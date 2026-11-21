// Rewrites relative links between the repo's markdown files (./t3-code.md#x,
// ../skills-table.md) into site routes (/guide/guides/t3-code/#x), so the
// markdown stays readable on GitHub and works on the site.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

export function remarkGuideLinks({ base = '/' } = {}) {
  const prefix = base.endsWith('/') ? base : base + '/';
  return (tree, file) => {
    const from = file.path ? path.dirname(file.path) : repoRoot;
    const walk = (node) => {
      if (node.type === 'link' && typeof node.url === 'string') {
        const m = node.url.match(/^(?!https?:|mailto:|#)([^#]+\.md)(#.*)?$/);
        if (m) {
          const target = path.relative(repoRoot, path.resolve(from, m[1])).replace(/\\/g, '/');
          const id = target.replace(/\.md$/, '');
          node.url = id.toLowerCase() === 'readme' ? prefix + 'guide/' : `${prefix}guide/${id}/${m[2] || ''}`;
        }
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}
