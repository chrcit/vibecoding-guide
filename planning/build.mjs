// Builds planning/dashboard.html and planning/PLAN.md from planning/plan.data.mjs.
// One source, two outputs. Run: node planning/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import plan from './plan.data.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Minimal inline markup for data strings: `code`, **bold**, [text](url).
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
const score = (c) => Math.round(((c.impact * c.impact) / (c.effort + c.risk)) * 10) / 10;
const changes = plan.changes.map((c) => ({ ...c, score: score(c) })).sort((a, b) => b.score - a.score || b.impact - a.impact);
changes.forEach((c, i) => (c.rank = i + 1));
const groupName = Object.fromEntries(plan.groups.map((g) => [g.id, g.name]));
const phaseName = Object.fromEntries(plan.phases.map((p) => [p.id, p.name]));

// ---------- Markdown ----------
const md = [];
const P = (...l) => md.push(...l, '');
const table = (head, rows) => {
  const cell = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  md.push(`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`), '');
};
P(`# ${plan.meta.title}`);
P(`Proposal dashboard, ${plan.meta.date}. Branch \`${plan.meta.branch}\`, based on \`${plan.meta.base}\`. Nothing here is built yet. The interactive version is [dashboard.html](./dashboard.html); both files are generated from \`plan.data.mjs\` by \`node planning/build.mjs\`.`);
P('## Where the current version falls short');
plan.verdict.forEach((v) => P(`- ${v}`));
P('## Principles for the next version');
plan.principles.forEach((v) => P(`- ${v}`));
P('## Ranked changes');
P('Score = impact squared ÷ (effort + accuracy risk), each on a 1 to 5 scale. Higher is better. Accuracy risk is the chance the item ships something wrong or soon stale. The roadmap orders by dependency as well as score.');
table(['#', 'Change', 'Group', 'Impact', 'Effort', 'Risk', 'Score', 'Phase'], changes.map((c) => [c.rank, `**${c.title}** (${c.id})`, groupName[c.group], c.impact, c.effort, c.risk, c.score.toFixed(1), phaseName[c.phase]]));
P('### What each change is');
for (const g of plan.groups) {
  P(`#### ${g.name}`);
  for (const c of changes.filter((x) => x.group === g.id)) {
    P(`**${c.id} · ${c.title}** (rank ${c.rank}, ${phaseName[c.phase]})`);
    P(c.what);
    P(`Why: ${c.why}`);
    if (c.risks) P(`Risk: ${c.risks}`);
    if (c.deps?.length) P(`Needs: ${c.deps.join(', ')}`);
  }
}
P('## Information architecture');
P(plan.ia.intro);
table(['Layer', 'In the article', 'In the guide', 'Pages'], plan.ia.layers.map((l) => [`**${l.name}**`, l.article, l.guide, l.pages]));
P(plan.ia.note);
P('## Route map');
table(['Route', 'What it is', 'Source', 'Status'], plan.routes.map((r) => [`\`${r.path}\``, r.what, r.source, r.status]));
P('## Reader levels');
plan.levels.forEach((v) => P(`- ${v}`));
P('## Figures');
P(plan.figures.intro);
table(['#', 'Figure', 'Lesson', 'Form and interaction', 'Data', 'Fate of the old one', 'Size'], plan.figures.list.map((f) => [f.id, `**${f.name}**`, f.lesson, f.form, f.data, f.old, f.size]));
P('### House style and tooling');
plan.figures.style.forEach((v) => P(`- ${v}`));
if (plan.figures.skills?.length) {
  P('### Figure skills compared');
  table(['Skill', 'By', 'Output', 'Good for', 'Against', 'Verdict'], plan.figures.skills.map((s) => [`[${s.name}](${s.url})`, s.by, s.output, s.good, s.bad, s.verdict]));
}
P('## Fast-changing data and stable fundamentals');
P(plan.data.intro);
table(['File', 'Holds', 'Source', 'When it changes'], plan.data.files.map((f) => [`\`${f.file}\``, f.holds, f.source, f.cadence]));
plan.data.rules.forEach((v) => P(`- ${v}`));
P('## The dev-only comment tool');
plan.comments.forEach((v) => P(`- ${v}`));
P('## Roadmap');
for (const ph of plan.phases) {
  P(`### ${ph.name}`);
  P(ph.goal);
  P(changes.filter((c) => c.phase === ph.id).map((c) => `- ${c.id} ${c.title}`).join('\n'));
  P(`Done when: ${ph.exit}`);
}
P('## Research gathered');
for (const r of plan.research) {
  P(`### ${r.title}`);
  if (r.body) P(r.body);
  (r.items || []).forEach((v) => md.push(`- ${v}`));
  md.push('');
}
P('## The dictated items');
table(['Heard', 'My reading', 'Confidence', 'What I would do'], plan.dictation.map((d) => [d.heard, d.reading, d.confidence, d.action]));
P('## Corrections the fact-check table needs');
plan.corrections.forEach((v) => P(`- ${v}`));
P('## Questions for the owner');
plan.questions.forEach((q, i) => {
  P(`**${i + 1}. ${q.q}**`);
  P(q.why);
  P(q.options.map((o, j) => `- ${j === 0 ? '(my default) ' : ''}${o}`).join('\n'));
});
fs.writeFileSync(path.join(dir, 'PLAN.md'), md.join('\n').replace(/\n{3,}/g, '\n\n'));

// ---------- HTML ----------
const dots = (n, kind) => `<span class="dots ${kind}" aria-label="${n} of 5">${[1, 2, 3, 4, 5].map((i) => `<i${i <= n ? ' class="on"' : ''}></i>`).join('')}</span>`;
const li = (arr) => `<ul>${arr.map((v) => `<li>${inline(v)}</li>`).join('')}</ul>`;
const sections = [
  ['ranking', 'Ranked changes'],
  ['ia', 'Architecture'],
  ['routes', 'Routes'],
  ['figures', 'Figures'],
  ['data', 'Data split'],
  ['comments', 'Comment tool'],
  ['roadmap', 'Roadmap'],
  ['research', 'Research'],
  ['questions', 'Questions'],
];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(plan.meta.title)}</title>
<script>try{const t=localStorage.getItem('plan-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<style>
:root{--paper:#f6f4ee;--card:#fffdf8;--ink:#1b1a17;--ink2:#45413a;--muted:#716b5f;--rule:#ddd6c7;--accent:#c2410c;--accent-soft:#f6dccd;--good:#2f6b55;--good-soft:#d6e8de;--warn:#a16207;--warn-soft:#f3e6c4;--bad:#b42318;--bad-soft:#f6d5d0;--blue:#2b4f86;--blue-soft:#dbe4f2;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--paper:#131210;--card:#1c1b18;--ink:#ece7dc;--ink2:#cbc5b8;--muted:#978f81;--rule:#322f29;--accent:#ff8a5b;--accent-soft:#3b2318;--good:#7cc3a6;--good-soft:#183029;--warn:#e3b341;--warn-soft:#33290f;--bad:#ff8f85;--bad-soft:#3a1b18;--blue:#8fb1ea;--blue-soft:#1a2538;color-scheme:dark}}
:root[data-theme=dark]{--paper:#131210;--card:#1c1b18;--ink:#ece7dc;--ink2:#cbc5b8;--muted:#978f81;--rule:#322f29;--accent:#ff8a5b;--accent-soft:#3b2318;--good:#7cc3a6;--good-soft:#183029;--warn:#e3b341;--warn-soft:#33290f;--bad:#ff8f85;--bad-soft:#3a1b18;--blue:#8fb1ea;--blue-soft:#1a2538;color-scheme:dark}
*{box-sizing:border-box}
html{scroll-padding-top:4.5rem;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;overflow-x:clip}
a{color:inherit;text-decoration-color:var(--accent);text-underline-offset:3px}
a:hover{color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}
code{font:0.86em ui-monospace,"SF Mono",Menlo,monospace;background:color-mix(in oklab,var(--rule) 55%,transparent);padding:.08em .32em;border-radius:4px;overflow-wrap:anywhere}
header.bar{position:sticky;top:0;z-index:5;background:color-mix(in oklab,var(--paper) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--rule)}
.bar-in{max-width:74rem;margin:0 auto;padding:.55rem 16px;display:flex;gap:.9rem;align-items:center}
.bar strong{white-space:nowrap}
.bar nav{display:flex;gap:.25rem;overflow-x:auto;flex:1;scrollbar-width:none}
.bar nav a{white-space:nowrap;text-decoration:none;color:var(--ink2);padding:.3rem .55rem;border-radius:6px;font-size:.9rem}
.bar nav a:hover{background:var(--card);color:var(--ink)}
button{font:inherit;color:inherit;background:var(--card);border:1px solid var(--rule);border-radius:8px;padding:.4rem .7rem;cursor:pointer}
button:hover{border-color:var(--accent)}
button[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
main{max-width:74rem;margin:0 auto;padding:0 16px 6rem}
h1{font-size:clamp(1.9rem,5vw,2.9rem);line-height:1.08;letter-spacing:-.02em;margin:2.2rem 0 .8rem;font-weight:650;text-wrap:balance}
h2{font-size:clamp(1.45rem,3.6vw,1.9rem);letter-spacing:-.015em;margin:4rem 0 .8rem;font-weight:650}
h3{font-size:1.08rem;margin:1.8rem 0 .5rem}
p,li{color:var(--ink2);text-wrap:pretty}
p{margin:0 0 .9rem;max-width:46rem}
ul{padding-left:1.15rem;margin:0 0 1rem;max-width:48rem}
li{margin:.3rem 0}
li::marker{color:var(--accent)}
strong{color:var(--ink)}
.lede{font-size:1.12rem;max-width:46rem}
.two{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));align-items:start}
.card{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:1rem 1.1rem}
.card h3{margin-top:0}
.card ul{margin-bottom:0}
.stats{display:grid;gap:.6rem;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));margin:1.4rem 0}
.stat{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:.8rem .9rem}
.stat b{display:block;font-size:1.7rem;line-height:1.1;letter-spacing:-.02em}
.stat span{color:var(--muted);font-size:.88rem}
.tools{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.8rem 0}
.tools .sp{flex:1}
.tools label{color:var(--muted);font-size:.9rem}
.change{background:var(--card);border:1px solid var(--rule);border-radius:12px;margin:.5rem 0}
.change[hidden]{display:none}
.change summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:2.2rem minmax(0,1fr) auto;gap:.2rem .7rem;align-items:center;padding:.7rem .9rem}
.change summary::-webkit-details-marker{display:none}
.rank{font:600 1.05rem ui-monospace,Menlo,monospace;color:var(--accent)}
.ct{font-weight:620;color:var(--ink)}
.cm{grid-column:2/-1;display:flex;flex-wrap:wrap;gap:.35rem .9rem;align-items:center;color:var(--muted);font-size:.84rem}
.pill{display:inline-block;border-radius:99px;padding:.05rem .55rem;font-size:.8rem;background:var(--blue-soft);color:var(--blue);white-space:nowrap}
.pill.p1{background:var(--good-soft);color:var(--good)}.pill.p2{background:var(--blue-soft);color:var(--blue)}.pill.p3{background:var(--warn-soft);color:var(--warn)}.pill.p4{background:var(--accent-soft);color:var(--accent)}
.sc{font:600 1rem ui-monospace,Menlo,monospace;white-space:nowrap}
.dots{display:inline-flex;gap:2px;vertical-align:middle;margin-left:.3rem}
.dots i{width:7px;height:7px;border-radius:50%;background:var(--rule)}
.dots.impact i.on{background:var(--good)}.dots.effort i.on{background:var(--warn)}.dots.risk i.on{background:var(--bad)}
.body{padding:0 .9rem .9rem 3.8rem;border-top:1px dashed var(--rule)}
.body p{margin:.7rem 0 0}
.pick{display:flex;gap:.4rem;margin-top:.8rem;flex-wrap:wrap}
.pick button{padding:.25rem .65rem;font-size:.88rem}
.pick button[aria-pressed=true][data-v=yes]{background:var(--good);border-color:var(--good);color:var(--paper)}
.pick button[aria-pressed=true][data-v=no]{background:var(--bad);border-color:var(--bad);color:var(--paper)}
.pick button[aria-pressed=true][data-v=later]{background:var(--warn);border-color:var(--warn);color:var(--paper)}
.change[data-pick=no] .ct{text-decoration:line-through;color:var(--muted)}
.change[data-pick=yes]{border-color:var(--good)}
@media (max-width:40rem){.body{padding-left:.9rem}.change summary{grid-template-columns:1.8rem minmax(0,1fr)}.sc{grid-column:2;justify-self:start}}
.tw{overflow-x:auto;border:1px solid var(--rule);border-radius:12px;background:var(--card);margin:.8rem 0 1.2rem}
table{border-collapse:collapse;width:100%;font-size:.92rem;min-width:38rem}
th,td{text-align:left;vertical-align:top;padding:.55rem .75rem;border-bottom:1px solid var(--rule)}
tr:last-child td{border-bottom:0}
th{font-weight:600;color:var(--muted);font-size:.84rem;white-space:nowrap}
td{color:var(--ink2)}
td b,td strong{color:var(--ink)}
.layers{display:grid;gap:.4rem;margin:1rem 0}
.layer{display:grid;grid-template-columns:9rem minmax(0,1fr) minmax(0,1.2fr);gap:.2rem 1rem;background:var(--card);border:1px solid var(--rule);border-left:5px solid var(--accent);border-radius:10px;padding:.7rem .9rem}
.layer:nth-child(2){border-left-color:var(--warn)}.layer:nth-child(3){border-left-color:var(--good)}.layer:nth-child(4){border-left-color:var(--blue)}.layer:nth-child(5){border-left-color:var(--muted)}.layer:nth-child(6){border-left-color:var(--bad)}
.layer b{font-size:1.05rem}
.layer small{color:var(--muted);font-size:.86rem;display:block}
.layer span{color:var(--ink2);font-size:.93rem}
@media (max-width:46rem){.layer{grid-template-columns:1fr}}
.tree{font:.86rem/1.7 ui-monospace,"SF Mono",Menlo,monospace;background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:.9rem 1rem;overflow-x:auto;white-space:pre}
.tree .n{color:var(--good)}.tree .m{color:var(--blue)}.tree .c{color:var(--muted)}
.road{display:grid;gap:.8rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));align-items:start}
.road .card{border-top:5px solid var(--good)}
.road .card:nth-child(2){border-top-color:var(--blue)}.road .card:nth-child(3){border-top-color:var(--warn)}.road .card:nth-child(4){border-top-color:var(--accent)}
.road ol{padding-left:1.2rem;margin:.4rem 0 .6rem}
.road li{font-size:.92rem}
.q{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:1rem 1.1rem;margin:.6rem 0}
.q h3{margin:0 0 .3rem}
.q p{font-size:.94rem}
.q fieldset{border:0;padding:0;margin:.5rem 0 0;display:grid;gap:.3rem}
.q label{display:flex;gap:.5rem;align-items:flex-start;color:var(--ink2);cursor:pointer}
.q input[type=radio]{margin-top:.3rem;accent-color:var(--accent)}
.q input[type=text]{width:100%;font:inherit;color:inherit;background:var(--paper);border:1px solid var(--rule);border-radius:8px;padding:.45rem .6rem;margin-top:.5rem}
.out{position:fixed;left:0;right:0;bottom:0;background:var(--card);border-top:1px solid var(--rule);z-index:6}
.out-in{max-width:74rem;margin:0 auto;padding:.55rem 16px;display:flex;gap:.7rem;align-items:center;flex-wrap:wrap}
.out span{color:var(--muted);font-size:.9rem;flex:1;min-width:10rem}
.note{border-left:3px solid var(--accent);padding:.1rem 0 .1rem .9rem;margin:1rem 0;max-width:46rem}
</style>
</head>
<body>
<header class="bar"><div class="bar-in">
<strong>Guide v-next</strong>
<nav aria-label="Sections">${sections.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
<button type="button" id="theme" aria-label="Switch between light and dark">◐</button>
</div></header>
<main>
<h1>${esc(plan.meta.title)}</h1>
<p class="lede">${inline(plan.meta.lede)}</p>
<div class="stats">${plan.meta.stats.map((s) => `<div class="stat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>
<div class="two">
<div class="card"><h3>Where the current version falls short</h3>${li(plan.verdict)}</div>
<div class="card"><h3>Principles for the next version</h3>${li(plan.principles)}</div>
</div>

<h2 id="ranking">Ranked changes</h2>
<p>Score is impact squared divided by effort plus accuracy risk, each from 1 to 5. Accuracy risk is the chance the item ships something wrong or soon stale. The roadmap further down orders by dependency as well as score. Open a row for the detail, then mark it yes, later or no. Your marks stay in this browser, and the bar at the bottom copies them as text you can paste back to me.</p>
<div class="tools" role="group" aria-label="Filter and sort">
<button type="button" data-f="all" aria-pressed="true">All ${changes.length}</button>
${plan.groups.map((g) => `<button type="button" data-f="${g.id}" aria-pressed="false">${esc(g.name)}</button>`).join('')}
<span class="sp"></span>
<label for="sort">Sort</label>
<select id="sort" style="font:inherit;color:inherit;background:var(--card);border:1px solid var(--rule);border-radius:8px;padding:.4rem .5rem"><option value="score">Score</option><option value="impact">Impact</option><option value="effort">Least effort</option><option value="risk">Least risk</option><option value="phase">Phase</option></select>
</div>
<div id="changes">
${changes
  .map(
    (c) => `<details class="change" data-id="${c.id}" data-group="${c.group}" data-score="${c.score}" data-impact="${c.impact}" data-effort="${c.effort}" data-risk="${c.risk}" data-phase="${c.phase}">
<summary><span class="rank">${c.rank}</span><span class="ct">${esc(c.title)}</span><span class="sc" title="Score">${c.score.toFixed(1)}</span>
<span class="cm"><span class="pill ${c.phase}">${esc(phaseName[c.phase])}</span><span>${esc(groupName[c.group])}</span><span>Impact${dots(c.impact, 'impact')}</span><span>Effort${dots(c.effort, 'effort')}</span><span>Risk${dots(c.risk, 'risk')}</span></span></summary>
<div class="body"><p>${inline(c.what)}</p><p><strong>Why.</strong> ${inline(c.why)}</p>${c.risks ? `<p><strong>Risk.</strong> ${inline(c.risks)}</p>` : ''}${c.deps?.length ? `<p><strong>Needs.</strong> ${esc(c.deps.join(', '))}</p>` : ''}
<div class="pick" role="group" aria-label="Decision for ${esc(c.title)}"><button type="button" data-v="yes" aria-pressed="false">Yes</button><button type="button" data-v="later" aria-pressed="false">Later</button><button type="button" data-v="no" aria-pressed="false">No</button></div></div>
</details>`,
  )
  .join('\n')}
</div>

<h2 id="ia">Information architecture</h2>
<p>${inline(plan.ia.intro)}</p>
<div class="layers">${plan.ia.layers.map((l) => `<div class="layer"><div><b>${esc(l.name)}</b><small>${inline(l.article)}</small></div><span>${inline(l.guide)}</span><span>${inline(l.pages)}</span></div>`).join('')}</div>
<p class="note">${inline(plan.ia.note)}</p>
<h3>Reader levels</h3>
${li(plan.levels)}

<h2 id="routes">Route map</h2>
<div class="tree">${plan.tree}</div>
<div class="tw"><table><thead><tr><th>Route</th><th>What it is</th><th>Source</th><th>Status</th></tr></thead><tbody>${plan.routes.map((r) => `<tr><td><code>${esc(r.path)}</code></td><td>${inline(r.what)}</td><td>${inline(r.source)}</td><td>${esc(r.status)}</td></tr>`).join('')}</tbody></table></div>

<h2 id="figures">Figures</h2>
<p>${inline(plan.figures.intro)}</p>
<div class="tw"><table><thead><tr><th>#</th><th>Figure</th><th>Lesson</th><th>Form and interaction</th><th>Data</th><th>Old figure</th><th>Size</th></tr></thead><tbody>${plan.figures.list.map((f) => `<tr><td>${esc(f.id)}</td><td><b>${esc(f.name)}</b></td><td>${inline(f.lesson)}</td><td>${inline(f.form)}</td><td>${inline(f.data)}</td><td>${inline(f.old)}</td><td>${esc(f.size)}</td></tr>`).join('')}</tbody></table></div>
<h3>House style and tooling</h3>
${li(plan.figures.style)}
${plan.figures.skills?.length ? `<h3>Figure skills compared</h3><div class="tw"><table><thead><tr><th>Skill</th><th>By</th><th>Output</th><th>Good for</th><th>Against</th><th>Verdict</th></tr></thead><tbody>${plan.figures.skills.map((s) => `<tr><td><a href="${esc(s.url)}"><b>${esc(s.name)}</b></a></td><td>${esc(s.by)}</td><td>${inline(s.output)}</td><td>${inline(s.good)}</td><td>${inline(s.bad)}</td><td>${inline(s.verdict)}</td></tr>`).join('')}</tbody></table></div>` : ''}

<h2 id="data">Fast-changing data and stable fundamentals</h2>
<p>${inline(plan.data.intro)}</p>
<div class="tw"><table><thead><tr><th>File</th><th>Holds</th><th>Source</th><th>When it changes</th></tr></thead><tbody>${plan.data.files.map((f) => `<tr><td><code>${esc(f.file)}</code></td><td>${inline(f.holds)}</td><td>${inline(f.source)}</td><td>${inline(f.cadence)}</td></tr>`).join('')}</tbody></table></div>
${li(plan.data.rules)}

<h2 id="comments">The dev-only comment tool</h2>
${li(plan.comments)}

<h2 id="roadmap">Roadmap</h2>
<div class="road">${plan.phases.map((ph) => `<div class="card"><h3>${esc(ph.name)}</h3><p>${inline(ph.goal)}</p><ol>${changes.filter((c) => c.phase === ph.id).map((c) => `<li>${esc(c.title)}</li>`).join('')}</ol><p><strong>Done when.</strong> ${inline(ph.exit)}</p></div>`).join('')}</div>

<h2 id="research">Research gathered</h2>
<div class="two">${plan.research.map((r) => `<div class="card"><h3>${esc(r.title)}</h3>${r.body ? `<p>${inline(r.body)}</p>` : ''}${r.items ? li(r.items) : ''}</div>`).join('')}</div>
<h3>The dictated items</h3>
<div class="tw"><table><thead><tr><th>Heard</th><th>My reading</th><th>Confidence</th><th>What I would do</th></tr></thead><tbody>${plan.dictation.map((d) => `<tr><td>${inline(d.heard)}</td><td>${inline(d.reading)}</td><td>${esc(d.confidence)}</td><td>${inline(d.action)}</td></tr>`).join('')}</tbody></table></div>
<h3>Corrections the fact-check table needs</h3>
${li(plan.corrections)}

<h2 id="questions">Questions for the owner</h2>
<p>The first option of each is what I would do if you said nothing. Answers are saved in this browser and included in the copied text.</p>
${plan.questions
  .map(
    (q, i) => `<div class="q" data-q="${q.id}"><h3>${i + 1}. ${inline(q.q)}</h3><p>${inline(q.why)}</p><fieldset><legend style="position:absolute;left:-999em">${esc(q.q)}</legend>${q.options.map((o, j) => `<label><input type="radio" name="${q.id}" value="${j}"><span>${inline(o)}</span></label>`).join('')}</fieldset><input type="text" aria-label="Note for question ${i + 1}" placeholder="Anything else on this one"></div>`,
  )
  .join('\n')}
</main>
<div class="out"><div class="out-in"><span id="tally">No decisions marked yet.</span><button type="button" id="copy">Copy my decisions</button><button type="button" id="reset">Reset</button></div></div>
<script>
const Q=${JSON.stringify(plan.questions.map((q) => ({ id: q.id, q: q.q, options: q.options })))};
const KEY='agentic-guide-plan-v1';
let S={picks:{},answers:{},notes:{}};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const list=document.getElementById('changes');
const rows=[...list.children];
const tally=()=>{const v=Object.values(S.picks);const n=k=>v.filter(x=>x===k).length;const a=Object.keys(S.answers).length;
 document.getElementById('tally').textContent=v.length||a?n('yes')+' yes, '+n('later')+' later, '+n('no')+' no; '+a+' of '+Q.length+' questions answered.':'No decisions marked yet.'};
const paint=()=>{rows.forEach(r=>{const p=S.picks[r.dataset.id]||'';r.dataset.pick=p;r.querySelectorAll('.pick button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===p)))});
 document.querySelectorAll('.q').forEach(q=>{const id=q.dataset.q;q.querySelectorAll('input[type=radio]').forEach(r=>r.checked=String(S.answers[id])===r.value);q.querySelector('input[type=text]').value=S.notes[id]||''});tally()};
list.addEventListener('click',e=>{const b=e.target.closest('.pick button');if(!b)return;const id=b.closest('.change').dataset.id;if(S.picks[id]===b.dataset.v)delete S.picks[id];else S.picks[id]=b.dataset.v;save();paint()});
document.querySelectorAll('.q').forEach(q=>{const id=q.dataset.q;q.addEventListener('change',e=>{if(e.target.type==='radio'){S.answers[id]=Number(e.target.value);save();tally()}});q.querySelector('input[type=text]').addEventListener('input',e=>{if(e.target.value)S.notes[id]=e.target.value;else delete S.notes[id];save()})});
document.querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-f]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));rows.forEach(r=>r.hidden=b.dataset.f!=='all'&&r.dataset.group!==b.dataset.f)}));
document.getElementById('sort').addEventListener('change',e=>{const k=e.target.value;const sorted=[...rows].sort((a,b)=>k==='score'||k==='impact'?b.dataset[k]-a.dataset[k]:k==='phase'?a.dataset.phase.localeCompare(b.dataset.phase)||b.dataset.score-a.dataset.score:a.dataset[k]-b.dataset[k]||b.dataset.score-a.dataset.score);sorted.forEach(r=>list.appendChild(r))});
document.getElementById('copy').addEventListener('click',async e=>{const t=id=>rows.find(r=>r.dataset.id===id).querySelector('.ct').textContent;const by=k=>Object.entries(S.picks).filter(([,v])=>v===k).map(([id])=>'- '+id+' '+t(id)).join('\\n')||'- none';
 const text='Decisions on the Agentic Coding Guide plan\\n\\nYES\\n'+by('yes')+'\\n\\nLATER\\n'+by('later')+'\\n\\nNO\\n'+by('no')+'\\n\\nQUESTIONS\\n'+Q.map((q,i)=>(i+1)+'. '+q.q+'\\n   '+(S.answers[q.id]!=null?q.options[S.answers[q.id]]:'(not answered)')+(S.notes[q.id]?'\\n   Note: '+S.notes[q.id]:'')).join('\\n');
 try{await navigator.clipboard.writeText(text);e.target.textContent='Copied'}catch(err){const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;inset:10% 5%;z-index:9;font:13px monospace';document.body.appendChild(ta);ta.select();e.target.textContent='Select and copy'}
 setTimeout(()=>e.target.textContent='Copy my decisions',2500)});
document.getElementById('reset').addEventListener('click',()=>{if(confirm('Clear all marks and answers?')){S={picks:{},answers:{},notes:{}};save();paint()}});
document.getElementById('theme').addEventListener('click',()=>{const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('plan-theme',r.dataset.theme)}catch(e){}});
paint();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'dashboard.html'), html);
console.log(`${changes.length} changes, ${plan.routes.length} routes, ${plan.figures.list.length} figures, ${plan.questions.length} questions`);
