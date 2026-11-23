import fs from 'node:fs';
const beats = JSON.parse(fs.readFileSync('beats.json', 'utf8'));
const chunks = [], idx = new Map(), head = [], out = [];
for (const b of beats) {
  const parts = b.svg.replace(/<\/g><\/svg>$/, '').split('<g class="j-ent"');
  head.push(parts.shift());
  out.push({ labels: b.labels, ents: parts.map((p) => { const s = '<g class="j-ent"' + p; if (!idx.has(s)) { idx.set(s, chunks.length); chunks.push(s); } return idx.get(s); }) });
}
const data = JSON.stringify({ head, chunks, beats: out }).replace(/<\//g, '<\\/');
const html = fs.readFileSync('tpl.html', 'utf8').replace('/*PICCSS*/', () => fs.readFileSync('pic.css', 'utf8')).replace('/*DATA*/', () => data);
fs.writeFileSync('lesson-thread.html', html);
console.log(chunks.length, 'chunks', html.length, 'bytes');
