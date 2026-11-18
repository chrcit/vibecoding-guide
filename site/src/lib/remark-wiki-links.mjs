// Links in the wiki (../wiki/*.md). Articles link to each other with plain
// relative links (./context-window.md, ./context-window.md#a-heading), which
// work on GitHub; this turns them into site routes (/wiki/context-window/).
// Root-relative links to site pages (/explain/context/) get the base path.
//
// The build fails when an article links to a wiki file that does not exist,
// or to a markdown file outside the wiki.
//
// It also drops the article's own "# Title" and its summary paragraph from the
// rendered body, because the page header shows both (title and lede). The
// summary paragraph is dropped only when it matches the frontmatter exactly;
// src/lib/wiki.ts fails the build when it does not.
//
// Runs before remark-guide-links, which then leaves these links alone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const wikiDir = path.join(repoRoot, 'wiki');
const LINK = /^(?:\.\/)?([A-Za-z0-9_-]+)\.md(#.*)?$/;

const text = (node) =>
  typeof node.value === 'string' ? node.value : Array.isArray(node.children) ? node.children.map(text).join('') : '';
const norm = (s) => s.replace(/\s+/g, ' ').trim();

export function remarkWikiLinks({ base = '/' } = {}) {
  const prefix = base.endsWith('/') ? base : base + '/';
  return (tree, file) => {
    if (!file.path) return;
    const abs = path.resolve(file.path);
    if (path.dirname(abs) !== wikiDir) return;
    const name = `wiki/${path.basename(abs)}`;
    const problems = [];

    const fix = (node) => {
      const url = node.url;
      if (typeof url !== 'string' || /^(?:[a-z]+:|#|\/\/)/i.test(url)) return;
      const m = url.match(LINK);
      if (m) {
        const slug = m[1];
        const hash = m[2] || '';
        if (slug.toLowerCase() === 'readme') {
          node.url = `${prefix}wiki/${hash}`;
          return;
        }
        if (!fs.existsSync(path.join(wikiDir, `${slug}.md`))) {
          problems.push(`  ${name} links to "${url}", but wiki/${slug}.md does not exist.`);
          return;
        }
        node.url = `${prefix}wiki/${slug}/${hash}`;
        return;
      }
      if (/\.md(#|$)/.test(url)) {
        problems.push(`  ${name} links to "${url}". Wiki articles link to other wiki files as ./slug.md, and to site pages as /path/.`);
        return;
      }
      if (url.startsWith('/')) node.url = prefix + url.slice(1);
    };
    const walk = (node) => {
      if (node.type === 'link' || node.type === 'definition') fix(node);
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);

    if (problems.length) {
      throw new Error(`Broken wiki link${problems.length > 1 ? 's' : ''}:\n${problems.join('\n')}`);
    }

    // Drop "# Title" and the summary paragraph that follows it.
    const summary = file.data?.astro?.frontmatter?.summary;
    const kids = tree.children;
    const next = (from) => {
      for (let i = from; i < kids.length; i++) if (kids[i].type !== 'html') return i;
      return -1;
    };
    const h = next(0);
    if (h > -1 && kids[h].type === 'heading' && kids[h].depth === 1) {
      kids.splice(h, 1);
      const p = next(h);
      if (p > -1 && kids[p].type === 'paragraph' && typeof summary === 'string' && norm(text(kids[p])) === norm(summary)) {
        kids.splice(p, 1);
      }
    }
  };
}
