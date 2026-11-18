// Outside judge: every internal href/src in the built site must resolve to a file.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] || 'dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  e.isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p);
});
walk(dist);

const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

let broken = 0, checked = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, attr] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|javascript:)/.test(attr)) continue;
    checked++;
    let [p, hash] = attr.split('#');
    let target;
    if (p === '') target = file;
    else {
      let abs = p.startsWith('/') ? p : path.posix.join(path.posix.dirname('/' + path.relative(dist, file)), p);
      if (base && abs.startsWith(base)) abs = abs.slice(base.length) || '/';
      target = path.join(dist, decodeURIComponent(abs));
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    }
    if (!fs.existsSync(target)) { broken++; console.log(`BROKEN ${path.relative(dist, file)} -> ${attr}`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) { broken++; console.log(`BAD ANCHOR ${path.relative(dist, file)} -> ${attr}`); }
  }
}
console.log(`${files.length} pages, ${checked} internal links, ${broken} broken`);
process.exit(broken ? 1 : 0);
