// Review comments left with the dev-only comment tool, as a task list.
//
//   pnpm comments                      open comments, grouped by page
//   pnpm comments --all                include resolved ones
//   pnpm comments --page /guide/x/     one page only
//   pnpm comments --json               machine-readable
//   pnpm comments resolve <id> [--note "what was done"]
//
// Files live in <repo>/comments/<page-slug>/<timestamp>-<id>.json (see comments/README.md).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore, cleanPage, ID_RE } from '../integrations/comments/store.mjs';

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
const store = createStore(path.join(repoRoot, 'comments'));
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const fail = (msg) => { console.error(msg); process.exit(1); };

if (flag('--help') || flag('-h')) {
  console.log(usage());
  process.exit(0);
}

if (args[0] === 'resolve') {
  const id = args[1];
  if (!id || !ID_RE.test(id)) fail('Usage: pnpm comments resolve <id> [--note "what was done"]');
  const changes = { status: 'resolved' };
  const note = value('--note');
  if (note) changes.note = note;
  const c = store.update(id, changes);
  if (!c) fail(`No comment with id ${id}.`);
  console.log(`Resolved ${id} (${path.relative(repoRoot, c.file)})`);
  process.exit(0);
}

if (args[0] === 'reopen') {
  const id = args[1];
  if (!id || !ID_RE.test(id)) fail('Usage: pnpm comments reopen <id>');
  const c = store.update(id, { status: 'open' });
  if (!c) fail(`No comment with id ${id}.`);
  console.log(`Reopened ${id}`);
  process.exit(0);
}

if (args[0] && !args[0].startsWith('--')) fail(`Unknown command "${args[0]}". Try --help.`);

let list = store.all();
if (!flag('--all')) list = list.filter((c) => c.status === 'open');
const pageArg = value('--page');
if (pageArg) {
  const page = cleanPage(pageArg);
  if (!page) fail(`Bad page path: ${pageArg}`);
  list = list.filter((c) => c.page === page);
}
list.sort((a, b) => a.page.localeCompare(b.page) || a.created.localeCompare(b.created));

if (flag('--json')) {
  console.log(JSON.stringify(list.map((c) => ({ ...c, file: path.relative(repoRoot, c.file) })), null, 2));
  process.exit(0);
}

if (!list.length) {
  console.log(flag('--all') ? 'No review comments.' : 'No open review comments.');
  process.exit(0);
}

const one = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const indent = (s, pad) => String(s).split('\n').map((l) => pad + l).join('\n');

let page = null;
for (const c of list) {
  if (c.page !== page) {
    page = c.page;
    const n = list.filter((x) => x.page === page).length;
    console.log(`\n## ${page}  (${n} comment${n === 1 ? '' : 's'})`);
  }
  const box = c.status === 'resolved' ? '[x]' : '[ ]';
  const src = c.sourceFile ? `${c.sourceFile}${c.sourceLoc ? `:${c.sourceLoc.split(':')[0]}` : ''}` : 'unknown source';
  console.log(`\n- ${box} ${c.id}  ${src}${c.heading?.text ? `  § ${one(c.heading.text)}` : ''}`);
  console.log(`      quote: “${clip(one(c.quote?.exact), 240)}”`);
  console.log(indent(c.comment, '      > '));
  const bits = [c.created.slice(0, 16).replace('T', ' ')];
  if (c.level) bits.push(`level ${c.level}`);
  if (c.theme) bits.push(c.theme);
  if (c.viewport?.width) bits.push(`${c.viewport.width}×${c.viewport.height}`);
  console.log(`      ${bits.join(' · ')}`);
  if (c.note) console.log(`      note: ${one(c.note)}`);
}
const open = list.filter((c) => c.status === 'open').length;
console.log(`\n${open} open${flag('--all') ? `, ${list.length - open} resolved` : ''}. Resolve with: pnpm comments resolve <id> --note "what you did"`);

function usage() {
  return `pnpm comments [--all] [--page <path>] [--json]
pnpm comments resolve <id> [--note "what was done"]
pnpm comments reopen <id>`;
}
