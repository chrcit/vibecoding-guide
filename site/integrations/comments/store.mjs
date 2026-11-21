// Comment files on disk. Shared by the dev middleware and `pnpm comments`.
// One comment per file: <repo>/comments/<page-slug>/<timestamp>-<id>.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const ID_RE = /^[a-f0-9]{8}$/;
export const STATUSES = ['open', 'resolved'];

/** Normalise a page path: leading and trailing slash, no query or hash. Returns null if unsafe. */
export function cleanPage(page) {
  if (typeof page !== 'string' || page.length === 0 || page.length > 300) return null;
  let p = page.split(/[?#]/)[0];
  try { p = decodeURIComponent(p); } catch { return null; }
  if (/[\0\\]/.test(p)) return null;
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  if (p.split('/').some((s) => s === '..' || s === '.')) return null;
  return p.replace(/\/{2,}/g, '/');
}

/** Folder name for a page: "/guide/guides/t3-code/" -> "guide__guides__t3-code", "/" -> "index". */
export function pageSlug(page) {
  const trimmed = page.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return 'index';
  const slug = trimmed
    .split('/')
    .map((s) => s.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[.-]+|-+$/g, ''))
    .filter(Boolean)
    .join('__')
    .slice(0, 120);
  return slug || 'index';
}

export function newId() {
  return crypto.randomBytes(4).toString('hex');
}

function stamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'); // 20261118T101500Z
}

/** Resolve a path and make sure it stays inside `dir`. */
function inside(dir, ...parts) {
  const p = path.resolve(dir, ...parts);
  if (p !== dir && !p.startsWith(dir + path.sep)) throw new Error('path escapes the comments folder');
  return p;
}

export function createStore(commentsDir) {
  const dir = path.resolve(commentsDir);

  const files = () => {
    if (!fs.existsSync(dir)) return [];
    const out = [];
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      for (const f of fs.readdirSync(path.join(dir, d.name))) {
        if (f.endsWith('.json')) out.push(path.join(dir, d.name, f));
      }
    }
    return out.sort();
  };

  const read = (file) => {
    try { return { ...JSON.parse(fs.readFileSync(file, 'utf8')), file }; } catch { return null; }
  };

  const write = (file, data) => {
    const { file: _drop, ...clean } = data;
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(clean, null, 2) + '\n');
    fs.renameSync(tmp, file);
  };

  const find = (id) => {
    if (!ID_RE.test(id)) return null;
    const file = files().find((f) => f.endsWith(`-${id}.json`));
    return file ? read(file) : null;
  };

  return {
    dir,
    all: () => files().map(read).filter(Boolean),
    forPage: (page) => files().map(read).filter((c) => c && c.page === page),
    find,
    add(comment) {
      const now = new Date();
      const id = newId();
      const folder = inside(dir, pageSlug(comment.page));
      fs.mkdirSync(folder, { recursive: true });
      const file = inside(folder, `${stamp(now)}-${id}.json`);
      const data = { id, created: now.toISOString(), ...comment, status: 'open' };
      write(file, data);
      return { ...data, file };
    },
    update(id, changes) {
      const c = find(id);
      if (!c) return null;
      const next = { ...c, ...changes, updated: new Date().toISOString() };
      write(c.file, next);
      return next;
    },
    remove(id) {
      const c = find(id);
      if (!c) return false;
      fs.rmSync(c.file);
      const folder = path.dirname(c.file);
      if (fs.readdirSync(folder).length === 0) fs.rmdirSync(folder);
      return true;
    },
  };
}

// ---- Route -> source file -------------------------------------------------

const PAGE_EXT = ['.astro', '.md', '.mdx', '.html'];
const CONTENT_EXT = ['.md', '.mdx', '.markdown'];

function exists(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

/** Match route segments against src/pages, the way Astro's file router does (static before [param] before [...rest]). */
function matchPages(dir, segs) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return null; }
  const names = entries.map((e) => e.name);
  if (segs.length === 0) {
    for (const ext of PAGE_EXT) if (names.includes(`index${ext}`)) return { file: path.join(dir, `index${ext}`), rest: '' };
  }
  const [head, ...tail] = segs;
  if (head !== undefined) {
    if (tail.length === 0) {
      for (const ext of PAGE_EXT) if (names.includes(`${head}${ext}`)) return { file: path.join(dir, `${head}${ext}`), rest: '' };
    }
    if (entries.some((e) => e.isDirectory() && e.name === head)) {
      const m = matchPages(path.join(dir, head), tail);
      if (m) return m;
    }
    for (const e of entries) {
      if (!/^\[[^.\]][^\]]*\]/.test(e.name)) continue;
      if (e.isDirectory()) {
        const m = matchPages(path.join(dir, e.name), tail);
        if (m) return m;
      } else if (tail.length === 0 && PAGE_EXT.some((x) => e.name.endsWith(x))) {
        return { file: path.join(dir, e.name), rest: head };
      }
    }
  }
  for (const e of entries) {
    if (!e.isDirectory() && /^\[\.\.\.[^\]]+\]/.test(e.name) && PAGE_EXT.some((x) => e.name.endsWith(x))) {
      return { file: path.join(dir, e.name), rest: segs.join('/') };
    }
  }
  return null;
}

/** Content collection folders declared with glob({ base: '…' }) in src/content.config.ts. */
function contentBases(siteRoot) {
  const bases = [path.join(siteRoot, 'src/content')];
  for (const name of ['src/content.config.ts', 'src/content.config.mjs', 'src/content/config.ts']) {
    const f = path.join(siteRoot, name);
    if (!exists(f)) continue;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/base:\s*['"]([^'"]+)['"]/g)) bases.push(path.resolve(siteRoot, m[1]));
  }
  return bases;
}

/**
 * Best guess at the file that produced a route.
 * Returns { file, kind } with `file` relative to the repo root, or null.
 * kind: 'page' (an .astro/.md page), 'content' (a markdown entry rendered by a dynamic page), 'dev' (a review page).
 */
export function routeSource(page, { siteRoot, repoRoot }) {
  const rel = (p) => path.relative(repoRoot, p).split(path.sep).join('/');
  const segs = page.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segs[0] === 'dev') {
    const f = path.join(siteRoot, 'src/dev', `${segs[1] || 'index'}.astro`);
    if (segs.length <= 2 && exists(f)) return { file: rel(f), kind: 'dev' };
  }
  const m = matchPages(path.join(siteRoot, 'src/pages'), segs);
  if (!m) return null;
  if (m.rest) {
    for (const base of contentBases(siteRoot)) {
      for (const ext of CONTENT_EXT) {
        for (const cand of [path.join(base, m.rest + ext), path.join(base, m.rest, 'index' + ext)]) {
          if (exists(cand)) return { file: rel(cand), kind: 'content', template: rel(m.file) };
        }
      }
    }
  }
  return { file: rel(m.file), kind: 'page' };
}
