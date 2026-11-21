// Dev-only review comments. Select text in `astro dev`, write a comment, and it is
// saved as JSON in <repo>/comments/. Does nothing for any other Astro command, so
// nothing of it reaches a build; scripts/check-dist.mjs asserts that.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore, cleanPage, routeSource, ID_RE, STATUSES } from './store.mjs';

const ENDPOINT = '/__comments';
const MAX_BODY = 32 * 1024;
const MAX_COMMENT = 8000;
const MAX_QUOTE = 4000;

export default function comments() {
  return {
    name: 'acg-comments',
    hooks: {
      'astro:config:setup': ({ command, config, injectScript, updateConfig }) => {
        if (command !== 'dev') return;
        const siteRoot = fileURLToPath(config.root).replace(/\/$/, '');
        const repoRoot = path.resolve(siteRoot, '..');
        const store = createStore(path.join(repoRoot, 'comments'));
        const client = fileURLToPath(new URL('./client.js', import.meta.url));
        injectScript('page', `import ${JSON.stringify(client)};`);
        updateConfig({
          vite: {
            plugins: [{
              name: 'acg-comments-middleware',
              configureServer(server) {
                server.middlewares.use(handler({ store, siteRoot, repoRoot, base: config.base }));
              },
            }],
          },
        });
      },
    },
  };
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}

function sameOrigin(req, mutating) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = req.headers.origin;
  if (!origin) {
    // Browsers always send Origin on POST/PATCH/DELETE from fetch. A GET without one
    // is allowed only if the fetch metadata (when present) says it is same-origin.
    if (mutating) return false;
    const site = req.headers['sec-fetch-site'];
    return !site || site === 'same-origin' || site === 'none';
  }
  try { return new URL(origin).host === host; } catch { return false; }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY * 32) req.destroy(); // far over the cap: stop reading at all
      else if (size <= MAX_BODY) chunks.push(c);
    });
    req.on('end', () => {
      if (size > MAX_BODY) return reject(Object.assign(new Error('body too large'), { status: 413 }));
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(Object.assign(new Error('invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

function handler({ store, siteRoot, repoRoot, base }) {
  // The client calls the root path; the base-prefixed one is accepted too in case a
  // future Astro passes it through.
  const prefixes = [...new Set([ENDPOINT, base.replace(/\/$/, '') + ENDPOINT])];
  const relInRepo = (p) => {
    if (typeof p !== 'string' || !p) return null;
    const abs = path.resolve(p);
    if (!abs.startsWith(repoRoot + path.sep)) return null;
    return path.relative(repoRoot, abs).split(path.sep).join('/');
  };

  return async (req, res, next) => {
    const url = new URL(req.url, 'http://x');
    const prefix = prefixes.find((p) => url.pathname === p || url.pathname.startsWith(p + '/'));
    if (!prefix) return next();
    const rest = url.pathname.slice(prefix.length).replace(/^\//, '');
    const method = req.method || 'GET';
    const mutating = method !== 'GET' && method !== 'HEAD';

    try {
      if (!sameOrigin(req, mutating)) return send(res, 403, { error: 'cross-origin request refused' });
      if (mutating && method !== 'DELETE' && !/^application\/json\b/i.test(req.headers['content-type'] || '')) {
        return send(res, 415, { error: 'send application/json' });
      }

      if (!rest && method === 'GET') {
        const pageParam = url.searchParams.get('page');
        if (pageParam === null) return send(res, 200, { comments: store.all().map(pub) });
        const page = cleanPage(pageParam);
        if (!page) return send(res, 400, { error: 'bad page' });
        return send(res, 200, { comments: store.forPage(page).map(pub) });
      }

      if (!rest && method === 'POST') {
        const b = await readJson(req);
        const page = cleanPage(b.page);
        const exact = str(b.quote?.exact, MAX_QUOTE).trim();
        const comment = str(b.comment, MAX_COMMENT).trim();
        if (!page) return send(res, 400, { error: 'bad page' });
        if (!exact) return send(res, 400, { error: 'quote.exact is required' });
        if (!comment) return send(res, 400, { error: 'comment is required' });
        const route = routeSource(page, { siteRoot, repoRoot });
        // The client reports the .astro file of the element the selection starts in
        // (Astro marks elements with data-astro-source-file in dev). Markdown output
        // carries no such mark, so then the route's markdown or page file wins.
        const element = relInRepo(b.element?.file);
        const sourceFile = element ?? route?.file ?? null;
        const saved = store.add({
          page,
          quote: {
            type: 'TextQuoteSelector',
            exact,
            prefix: str(b.quote?.prefix, 200),
            suffix: str(b.quote?.suffix, 200),
          },
          heading: b.heading && typeof b.heading === 'object'
            ? { text: str(b.heading.text, 300), id: str(b.heading.id, 200) || null }
            : null,
          sourceFile,
          sourceLoc: element && typeof b.element?.loc === 'string' && /^\d+:\d+$/.test(b.element.loc) ? b.element.loc : null,
          pageFile: route?.file ?? null,
          level: str(b.level, 40) || null,
          theme: str(b.theme, 40) || null,
          viewport: {
            width: Number.isFinite(b.viewport?.width) ? Math.round(b.viewport.width) : null,
            height: Number.isFinite(b.viewport?.height) ? Math.round(b.viewport.height) : null,
          },
          comment,
        });
        return send(res, 201, { comment: pub(saved) });
      }

      if (rest && ID_RE.test(rest) && method === 'PATCH') {
        const b = await readJson(req);
        const changes = {};
        if (b.status !== undefined) {
          if (!STATUSES.includes(b.status)) return send(res, 400, { error: 'status must be open or resolved' });
          changes.status = b.status;
        }
        if (b.comment !== undefined) {
          const c = str(b.comment, MAX_COMMENT).trim();
          if (!c) return send(res, 400, { error: 'comment cannot be empty' });
          changes.comment = c;
        }
        if (b.note !== undefined) changes.note = str(b.note, 1000);
        if (!Object.keys(changes).length) return send(res, 400, { error: 'nothing to change' });
        const updated = store.update(rest, changes);
        return updated ? send(res, 200, { comment: pub(updated) }) : send(res, 404, { error: 'not found' });
      }

      if (rest && ID_RE.test(rest) && method === 'DELETE') {
        return store.remove(rest) ? send(res, 200, { ok: true }) : send(res, 404, { error: 'not found' });
      }

      return send(res, rest && !ID_RE.test(rest) ? 400 : 405, { error: 'unsupported request' });
    } catch (err) {
      return send(res, err.status || 500, { error: err.message || 'error' });
    }
  };
}

/** What the browser gets: the stored comment without the absolute file path. */
function pub(c) {
  const { file, ...rest } = c;
  return rest;
}
