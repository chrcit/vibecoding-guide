// Checks the sourced facts in src/data/ (runs first in `pnpm build`).
//
//   node scripts/check-facts.mjs           check; fail on a broken entry or a stale guides/fact-check.md
//   node scripts/check-facts.mjs --write   regenerate guides/fact-check.md from the data
//   node scripts/check-facts.mjs --online  also check that every source and link URL still responds
//
// Fails when an entry lacks a source, a valid date, a status or a claim, when
// ids collide, when a link in links.ts is malformed, or when a correction
// points at a fact that does not exist. Warns on entries verified more than
// 60 days ago. Node 22 imports the .ts data files directly (type stripping).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allFacts, dataFiles, formatValue, formatDate } from '../src/lib/facts.ts';
import { links, credits } from '../src/data/links.ts';
import { corrections } from '../src/data/corrections.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const factCheckPath = path.resolve(here, '../../guides/fact-check.md');
const args = new Set(process.argv.slice(2));
const STALE_DAYS = 60;
const STATUSES = new Set(['verified', 'observation', 'unverified']);

const errors = [];
const warnings = [];
const today = new Date();

const isDate = (s) => {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const isUrl = (s) => {
  try {
    const u = new URL(s);
    return (u.protocol === 'https:' || u.protocol === 'http:') && !!u.hostname.includes('.');
  } catch {
    return false;
  }
};
const ageDays = (s) => Math.floor((today.getTime() - new Date(`${s}T00:00:00Z`).getTime()) / 864e5);

// Facts
const facts = allFacts();
const seen = new Map();
for (const f of facts) {
  const where = `${f.id} (src/data/${f.file}.ts)`;
  if (seen.has(f.id)) errors.push(`duplicate id ${f.id} in ${seen.get(f.id)} and ${f.file}`);
  seen.set(f.id, f.file);
  if (!f.source || typeof f.source !== 'string') errors.push(`${where}: no source`);
  else if (!isUrl(f.source)) errors.push(`${where}: source is not a URL: ${f.source}`);
  if (!isDate(f.verified)) errors.push(`${where}: verified is not a YYYY-MM-DD date: ${f.verified}`);
  else if (ageDays(f.verified) < 0) errors.push(`${where}: verified date ${f.verified} is in the future`);
  else if (ageDays(f.verified) > STALE_DAYS) warnings.push(`${where}: last verified ${f.verified}, over ${STALE_DAYS} days ago`);
  if (!STATUSES.has(f.status)) errors.push(`${where}: status must be verified, observation or unverified, got ${f.status}`);
  if (!f.claim || typeof f.claim !== 'string') errors.push(`${where}: no claim sentence`);
  if (f.value === undefined || f.value === null || f.value === '') errors.push(`${where}: no value`);
  if (f.status === 'unverified' && !f.note) errors.push(`${where}: an unverified entry needs a note saying why`);
}

// Links and credits
for (const [key, l] of Object.entries(links)) {
  if (!l.label) errors.push(`links.${key}: no label`);
  if (!isUrl(l.url) || !l.url.startsWith('https://')) errors.push(`links.${key}: malformed or non-https URL: ${l.url}`);
  if (!isDate(l.checked)) errors.push(`links.${key}: checked is not a YYYY-MM-DD date: ${l.checked}`);
  else if (ageDays(l.checked) > STALE_DAYS) warnings.push(`links.${key}: last checked ${l.checked}`);
}
const urls = Object.values(links).map((l) => l.url);
for (const u of new Set(urls)) if (urls.filter((x) => x === u).length > 1) errors.push(`links.ts: ${u} is registered twice`);
for (const c of credits) {
  if (!c.name || !c.for) errors.push(`credits: entry without a name or reason: ${JSON.stringify(c)}`);
  if (!isUrl(c.url)) errors.push(`credits.${c.name}: malformed URL: ${c.url}`);
  if (!isDate(c.checked)) errors.push(`credits.${c.name}: checked is not a date`);
}

// Corrections
for (const [i, c] of corrections.entries()) {
  if (!isDate(c.date)) errors.push(`corrections[${i}]: date is not YYYY-MM-DD`);
  if (!isUrl(c.source)) errors.push(`corrections[${i}]: source is not a URL`);
  if (!c.was || !c.now) errors.push(`corrections[${i}]: needs both was and now`);
  for (const id of c.facts ?? []) if (!seen.has(id)) errors.push(`corrections[${i}]: unknown fact id ${id}`);
}

// guides/fact-check.md is generated from the same data.
const generated = renderFactCheck();
if (args.has('--write')) {
  fs.writeFileSync(factCheckPath, generated);
  console.log(`check-facts: wrote ${path.relative(process.cwd(), factCheckPath)}`);
} else {
  const current = fs.existsSync(factCheckPath) ? fs.readFileSync(factCheckPath, 'utf8') : '';
  if (current !== generated) errors.push('guides/fact-check.md is out of date with src/data/. Run: node scripts/check-facts.mjs --write');
}

if (args.has('--online')) await checkOnline();

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
const count = (s) => facts.filter((f) => f.status === s).length;
console.log(
  `check-facts: ${facts.length} facts (${count('verified')} verified, ${count('observation')} observation, ${count('unverified')} unverified), ` +
    `${Object.keys(links).length} links, ${corrections.length} corrections, ${warnings.length} warnings, ${errors.length} errors`,
);
process.exit(errors.length ? 1 : 0);

// ---------------------------------------------------------------------------

function cell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function sourceLink(url) {
  const u = new URL(url);
  let label = u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/$/, '');
  if (label.length > 60) label = `${label.slice(0, 59)}…`;
  return `[${cell(label)}](${url})`;
}

function table(rows) {
  const out = ['| Claim | Value | Status | Source |', '|---|---|---|---|'];
  for (const f of rows) {
    const status = f.status + (f.note ? `: ${f.note}` : '');
    out.push(`| ${cell(f.claim)} | ${cell(formatValue(f))} | ${cell(status)} | ${sourceLink(f.source)} |`);
  }
  return out.join('\n');
}

function renderFactCheck() {
  const dates = facts.map((f) => f.verified).filter(isDate).sort();
  const newest = dates[dates.length - 1];
  const parts = [];
  parts.push('# Sources and Fact-Check');
  parts.push('<!-- Generated from site/src/data/ by `node site/scripts/check-facts.mjs --write`. Do not edit by hand: change the data file and regenerate. -->');
  parts.push(
    `Every number and tool claim in the guide, with where it comes from. Last checked on **${formatDate(newest, true)}**. ` +
      'Models, prices and limits change every few months, so treat this page as a dated snapshot and follow the links. ' +
      'The same data drives the site\'s sources page.',
  );
  parts.push(
    'Status means:\n\n' +
      '- **verified**: checked against the primary source on the date given.\n' +
      "- **observation**: someone's dated, attributed estimate or experience. The guide labels it that way and never presents it as a general fact.\n" +
      '- **unverified**: could not be confirmed. Listed under Could Not Verify at the end, never stated as a fact.',
  );

  parts.push('## Corrections\n\nWhat an earlier version said, and what the sources say now.');
  const corr = ['| Date | Earlier claim | What the sources say | Source |', '|---|---|---|---|'];
  for (const c of corrections) corr.push(`| ${formatDate(c.date)} | ${cell(c.was)} | ${cell(c.now)} | ${sourceLink(c.source)} |`);
  parts.push(corr.join('\n'));

  for (const file of dataFiles) {
    const rows = facts.filter((f) => f.file === file.file && f.status !== 'unverified');
    if (!rows.length) continue;
    if (file.file === 'claims') {
      const groups = { privacy: 'Privacy', hosting: 'Sharing and Hosting', trends: 'Price Trends', research: 'Research', hardware: 'Hardware' };
      for (const [key, title] of Object.entries(groups)) {
        const sub = rows.filter((f) => f.id.split('.')[1] === key);
        if (sub.length) parts.push(`## ${title}\n\nFrom \`site/src/data/claims.ts\`.\n\n${table(sub)}`);
      }
      continue;
    }
    parts.push(`## ${file.title}\n\n${file.about} From \`site/src/data/${file.file}.ts\`.\n\n${table(rows)}`);
  }

  const open = facts.filter((f) => f.status === 'unverified');
  parts.push('## Could Not Verify\n\n' + open.map((f) => `- ${f.claim} ${f.note}`).join('\n'));

  parts.push(
    '---\n\n**Related:**\n' +
      '- [Models and Costs](./models-and-costs.md) - The numbers in context\n' +
      '- [T3 Code](./t3-code.md) - Capabilities and limits\n' +
      '- [Ways of Working](./ways-of-working.md) - The habits',
  );
  return parts.join('\n\n') + '\n';
}

async function checkOnline() {
  const targets = [...new Set([...facts.map((f) => f.source), ...urls, ...credits.map((c) => c.url), ...corrections.map((c) => c.source)])].filter(isUrl);
  const failed = [];
  const one = async (u) => {
    const opts = { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; link-check)' } };
    try {
      let r = await fetch(u, { ...opts, method: 'HEAD' });
      if (r.status >= 400) r = await fetch(u, { ...opts, method: 'GET' });
      if (r.status >= 400) failed.push(`${r.status} ${u}`);
    } catch (e) {
      failed.push(`${e.name === 'TimeoutError' ? 'timeout' : e.message} ${u}`);
    }
  };
  for (let i = 0; i < targets.length; i += 8) await Promise.all(targets.slice(i, i + 8).map(one));
  console.log(`check-facts --online: ${targets.length} URLs, ${failed.length} not responding`);
  for (const f of failed) errors.push(`online: ${f}`);
}
