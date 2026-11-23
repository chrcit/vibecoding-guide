/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { SceneState, Block, Label, P3 } from '../../journey/picture';
import { CAP } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview, DoorStage } from '../preview';
import { t3code } from '../../data/t3code';
import { A, CHANGED, CHANGED_N, FIRST, RAN, RAN_N, b, file, fill, n, points, push, readRow, searchRow, type Lesson, type Move } from '../content';
import { AGENTS_V1, LONG_LINES, MISSED_LINE, SHORT_LINES, SKILL_PATH, RED_RULE, rules } from '../preview/file/docs';

// ---------- lesson 6: write it down ----------
// Friday 17:30 to 17:50, then some Fridays later. The window and the project plate are drawn as v1
// draws them (journey/chapters/memory.ts): the instructions plate is absent, plain or lit; in a new
// thread the file goes into the window before your first word; skills sit on a shelf by name until
// one is taken off. The files themselves are in preview/file/docs.ts. All of it is made up.

const [READ_N] = t3code.screen.workLogGroups.value;
const skillRow = (name: string) => fill(t3code.screen.skillRow.value, { name });
const pct = (bs: Block[]) => Math.max(1, Math.round((bs.reduce((s, x) => s + x.h, 0) / CAP) * 100));

const frame = (more: Label[] = []): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools'), termLabel('project', 'project'), ...more];
const scene = (rules: 'none' | 'plain', blocks: Block[] = [FIRST], skills = 0): SceneState => {
  const s = solo({ tools: true, project: { rules, skills }, blocks, labels: frame() });
  s.project!.files = ['', '', '', '', '', ''];
  return s;
};
const note = (s: SceneState, ...more: Label[]) => { s.labels = frame(more); };
/** An annotation beside the window's right face, high up. */
const side = (text: string, z = 48): Label => ({ at: [14, -14, z] as P3, text, place: 'right' });
/** An annotation hanging below you, clear of the line to the agent and the tools. */
const belowYou = (text: string): Label => ({ at: [0, 104, 0] as P3, text, place: 'bottom' });
/** What a run came back with, below the tools and clear of their tray. */
const ranSays = (text: string): Label => ({ at: [52, 46, 0] as P3, text, place: 'bottom' });
/** An annotation beside the file the agent changed (file tile 2 on the project plate). */
const atFile = (text: string): Label => ({ at: [214, -12, 2] as P3, text, place: 'right' });
/** An annotation about the instructions file: below the plate's front edge, clear of its tiles. */
const atRules = (text: string, place: Label['place'] = 'bottom'): Label => (place === 'bottom' ? { at: [116, 72, 0] as P3, text, place } : lab('rules', text, place));

const door = (stage: DoorStage): Preview => ({ app: 'door', stage });
const agentsMd = (stage: string): Preview => ({ app: 'file', stage, url: 'AGENTS.md' });

const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const read = { to: 'tool', tool: 'read', file: 1, back: 'tool' } as const;
const change = { to: 'tool', tool: 'edit', file: 2, back: 'tool' } as const;
const runOk: Move = { to: 'tool', tool: 'run', back: 'tool' };
const runBad: Move = { to: 'tool', tool: 'run', back: 'bad' };

const REGULARS = 'Mark regulars on the door page: guests who came three Fridays in a row. Done when it shows at the door at phone size.';
const RULES_SLAB = b('rules', 1.1);
const LONG_SLAB = b('rules', 4.2);

const lesson6: Lesson = {
  id: 'l6',
  parts: [
    {
      title: 'Every thread starts from zero',
      thread: 'Regulars at the door',
      fresh: true,
      request: REGULARS,
      lede: 'Friday, 17:30. A new thread, and no brief this time. Everything the earlier threads worked out about this project stays in those threads.',
      points: points(scene('none'), [
        { say: `A new thread: the harness’s instructions and your request, ${pct([FIRST, b('you', 0.8)])}% of the window. The project has no instructions file, so nothing else comes in.`, moves: [{ to: 'agent' }], look: 'context', ui: { context: pct([FIRST, b('you', 0.8)]) }, preview: door('fixed'),
          edit: (s) => { push(s, b('you', 0.8)); A(s).lamp = 'work'; note(s, atRules('no instructions file')); } },
        { say: 'It looks for how tests run here and guesses the wrong command. Earlier threads found the right one, but that stayed in them.', moves: [search, runBad], preview: door('fixed'),
          edit: (s) => { push(s, b('model', 0.4), b('tool', 0.8), b('model', 0.3), b('bad', 0.9)); file(s, 1, 'read'); note(s, ranSays('no tests found')); } },
        { say: 'It finds the right command and builds the star. The star comes out red, and the time as 10:41 PM.', moves: [read, change, runOk], preview: door('regularsRed'),
          edit: (s) => { push(s, b('model', 0.3), b('tool', 0.6), b('model', 0.4), b('tool', 1), b('model', 0.3), b('tool', 0.7)); file(s, 2, 'edit'); A(s).lamp = 'ok'; note(s, atFile('red star, 10:41 PM')); } },
        { say: 'It replies: unit tests pass. It never tried the door at phone size. Nothing in this thread said that’s how done is checked here.', moves: [{ to: 'you', kind: 'model' }], preview: door('regularsRed'),
          edit: (s) => { push(s, b('model', 0.8)); A(s).lamp = 'off'; note(s, ranSays('never ran: the door check')); } },
      ]),
      log: {
        took: '3m 5s',
        rows: [
          { at: 1, label: searchRow('test', 'package.json'), detail: { plain: 'how tests run in this project', technical: 'package.json scripts' } },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'tried a test command this project doesn’t use', technical: 'npx jest: no tests found', engineer: 'npx jest → No tests found, exiting with code 1 (the project runs vitest)' } },
          { at: 2, label: readRow('src/door.tsx'), detail: { plain: 'the door page', technical: 'src/door.tsx' } },
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'a star for regulars', technical: 'src/door.tsx, src/guests.ts', engineer: 'guests.isRegular(id): last three Fridays; door row badge “★ regular · last in {toLocaleTimeString()}”' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'unit tests pass, one new for regulars', technical: 'npm test: 20 of 20' } },
        ],
      },
      answer: [
        'Regulars now have a star on the door page, for guests who came three Fridays in a row, with the time they last came in. Unit tests pass.',
      ],
      deeper: { level: 'engineer', text: 'The project’s conventions (vitest through npm test, 24-hour times, the door check at 390 px) were worked out in earlier threads and live only there. A new thread carries your model and mode, not what other threads learned.' },
      tryIt: { prompt: 'Add [a small thing] to [a page in your project].', t3: 'Start it in a fresh thread, then expand the first Ran command row: see what it tried before it found the right command.' },
      sources: ['t3code.newThreadCarries', 't3code.screen.rowDetail', 't3code.screen.searchRow'],
    },
    {
      title: 'A file it reads first',
      thread: 'Regulars at the door',
      request: 'Write down how this project works and the club’s rules, so every new thread starts with them. Use what we settled today in',
      chips: ['Door check-in', 'Promoter links', 'Running late button'],
      lede: 'Same thread. You attach today’s threads with @, so it can read what was settled in them.',
      points: points(scene('none', [FIRST, b('you', 0.8), b('model', 2.2), b('tool', 3.6), b('model', 0.8)]), [
        { say: 'The threads go in as references, not as text. It reads their history only when it needs it.', moves: [{ to: 'agent' }], preview: door('regularsRed'),
          edit: (s) => { push(s, b('you', 0.9)); A(s).lamp = 'work'; note(s, belowYou('3 threads, by reference')); } },
        { say: 'It reads the three threads and the project, then writes AGENTS.md at the project’s root.', moves: [read, { to: 'rules' }], preview: agentsMd('agents'),
          edit: (s) => { push(s, b('model', 0.4), b('tool', 3), b('model', 0.6), b('tool', 0.6)); s.project!.rules = 'plain'; note(s, atRules('AGENTS.md')); } },
        { say: `It replies: ${rules(AGENTS_V1)} rules in ${AGENTS_V1.length} lines. Open the Preview and read the file yourself.`, moves: [{ to: 'you', kind: 'model' }], preview: agentsMd('agents'),
          edit: (s) => { push(s, b('model', 0.9)); A(s).lamp = 'off'; note(s, atRules('AGENTS.md')); } },
        { say: 'From now on, in every new thread, the harness puts the file in the window before your first word, right after its own instructions.', moves: [{ to: 'load', from: 'rules' }], preview: agentsMd('agents'),
          edit: (s) => { A(s).blocks = [FIRST, RULES_SLAB]; s.project!.rules = 'plain'; note(s, side('a new thread: read before your first word')); } },
        { say: 'Which file is read depends on the agent underneath. Claude Code reads CLAUDE.md, and AGENTS.md only when there is no CLAUDE.md. Codex reads AGENTS.md.', preview: agentsMd('agents'),
          edit: (s) => { note(s, atRules('Codex: AGENTS.md'), { at: [100, 44, 0] as P3, text: 'Claude Code: CLAUDE.md, else AGENTS.md', place: 'left' }); } },
      ]),
      log: {
        took: '1m 40s',
        rows: [
          { at: 1, label: n(READ_N, 6), detail: { plain: 'the three threads, the tests and the door page', technical: '3 threads, package.json, tests/door.spec.ts, src/door.tsx' } },
          { at: 1, label: CHANGED, detail: { plain: 'a new file: AGENTS.md', technical: 'AGENTS.md (new)' } },
        ],
      },
      answer: [
        `I wrote AGENTS.md at the root of the project: ${rules(AGENTS_V1)} rules in ${AGENTS_V1.length} lines. They cover how to check work here, the time format, the phone-number rule, promoter privacy, test data and the one-handed door.`,
        'To check it, start a new thread and ask for something small at the door. It should run the door check without being told.',
      ],
      deeper: { level: 'engineer', text: 'Claude Code reads CLAUDE.md, and AGENTS.md only when no CLAUDE.md exists; to keep one file for both, put @AGENTS.md in CLAUDE.md. Codex reads every AGENTS.md from the repository root down to the working folder. Not every provider loads a file at the start: in the guide’s own lab test, Antigravity under T3 Code didn’t, and the model read AGENTS.md only when it chose to. That is one observation, not a documented rule.' },
      tryIt: { prompt: 'Write down how this project works and its rules in AGENTS.md, so every new thread starts with them. Keep it short.', t3: 'Type @ and part of a thread’s title to attach it as a chip. Then open AGENTS.md in the file viewer and read it yourself.' },
      sources: ['t3code.threadAsContext', 'harnesses.claudeCode.contextFile', 'harnesses.codex.contextFile', 'harnesses.claudeCode.startupContext', 'observations.experience.antigravityContextFiles', 't3code.browser'],
    },
    {
      title: 'Teach it once',
      thread: 'Red means do not admit',
      fresh: true,
      request: 'Red on the door page means one thing only: do not admit. Make the regulars star another colour, and add that rule to AGENTS.md. Done when the star isn’t red and the rule is in the file.',
      lede: 'Friday, 17:50. The star from the last thread is red, and to Sami red will mean one thing. You start a new thread for the fix.',
      points: points(scene('plain', []), [
        { say: `A new thread. Before your first word, AGENTS.md goes into the window. Then your request: ${pct([FIRST, RULES_SLAB, b('you', 0.9)])}% used.`, moves: [{ to: 'load', from: 'rules' }, { to: 'agent' }], look: 'context', ui: { context: pct([FIRST, RULES_SLAB, b('you', 0.9)]) }, preview: door('regularsRed'),
          edit: (s) => { A(s).blocks = [FIRST, RULES_SLAB, b('you', 0.9)]; A(s).lamp = 'work'; note(s, side('AGENTS.md, before your first word')); } },
        { say: 'It makes the star gold and adds one line to AGENTS.md. It also writes the time as 22:41: the file says 24-hour, and nobody had to repeat it.', moves: [change, { to: 'rules' }], preview: agentsMd('agents-red'),
          edit: (s) => { push(s, b('model', 0.4), b('tool', 0.8), b('model', 0.3), b('tool', 0.4)); file(s, 2, 'edit'); note(s, atRules('+1 line')); } },
        { say: 'It runs the door check at phone size without being asked. The file says that’s how done is checked here.', moves: [runOk], preview: door('regulars'),
          edit: (s) => { push(s, b('model', 0.3), b('tool', 1)); file(s, 2, 'ok'); A(s).lamp = 'ok'; s.project!.rules = 'plain'; note(s, ranSays('door check, unasked')); } },
        { say: 'It replies with what changed in the page and in the file.', moves: [{ to: 'you', kind: 'model' }], preview: door('regulars'),
          edit: (s) => { push(s, b('model', 0.8)); A(s).lamp = 'off'; note(s, belowYou('gold, 22:41')); } },
        { say: 'Read the change to the file like any other change: one line, and it says what you meant. Every thread from now on starts with it.', preview: agentsMd('agents-red'),
          edit: (s) => { note(s, atRules('every new thread reads this')); } },
      ]),
      log: {
        took: '1m 55s',
        rows: [
          { at: 1, label: n(CHANGED_N, 3), detail: { plain: 'a gold star, a 24-hour time, and one line in AGENTS.md', technical: 'src/door.css, src/door.tsx, AGENTS.md', engineer: 'door.css: .regular → var(--gold); door.tsx: last-in as HH:mm; AGENTS.md +1' } },
          { at: 2, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'unit tests and the door check at phone size pass', technical: 'npm test: 20 of 20 · npm run door-check: 12 of 12', engineer: 'vitest 20/20; door-check: 12 of 12 at 390×844' } },
        ],
      },
      answer: [
        `The regulars star is gold now, and the last-in time reads 22:41. I added one line to AGENTS.md: “${RED_RULE.slice(2)}”`,
        { plain: 'The door check at phone size passes, and so do the unit tests.', technical: 'npm run door-check: 12 of 12. npm test: 20 of 20.' },
      ],
      deeper: { level: 'technical', text: 'An instructions file steers every later thread, so a vague rule in it misleads all of them. Read its diff like code. In Claude Code, /init drafts a starting CLAUDE.md from the codebase, which you then cut down.' },
      tryIt: { prompt: 'That’s the second time. Add a rule to AGENTS.md so it doesn’t happen again.', t3: 'Open the turn’s diff and check the new line says what you meant.' },
      sources: ['t3code.worktrees', 'harnesses.claudeCode.init', 'harnesses.claudeCode.contextFile'],
    },
    {
      title: 'Short beats long',
      thread: 'Shorten AGENTS.md',
      fresh: true,
      request: `AGENTS.md has grown to ${LONG_LINES} lines, and last Friday’s closing checklist skipped the door check. Keep only the rules every job needs, and move the door-check steps into a skill. Done when the file is short again and the door check still runs before you say done.`,
      lede: 'Some Fridays later, still made up. Weeks of “add that to AGENTS.md”. Last Friday a thread built the closing checklist at /door/close and never ran the door check.',
      points: points(scene('plain', [], 0), [
        { say: `All ${LONG_LINES} lines go into the window at the start of every thread, before your first word.`, moves: [{ to: 'load', from: 'rules' }, { to: 'agent' }], look: 'context', ui: { context: pct([FIRST, LONG_SLAB, b('you', 1.2)]) }, preview: agentsMd('agents-long'),
          edit: (s) => { A(s).blocks = [FIRST, LONG_SLAB, b('you', 1.2)]; A(s).lamp = 'work'; s.project!.rules = 'plain'; note(s, side(`AGENTS.md: ${LONG_LINES} lines, every thread`)); } },
        { say: `The door check is one rule among ${LONG_LINES}, on line ${MISSED_LINE}. In the window isn’t the same as followed: last Friday it was missed.`, preview: agentsMd('agents-131'),
          edit: (s) => { A(s).scan = true; note(s, atRules(`missed last Friday: line ${MISSED_LINE}`)); } },
        { say: 'It keeps the short rules in AGENTS.md and moves the door-check steps into a skill. Only a skill’s name and one line sit in every window; the steps load when they’re needed.', moves: [read, { to: 'rules' }, change], preview: { app: 'file', stage: 'skill', url: SKILL_PATH },
          edit: (s) => { push(s, b('model', 0.4), b('tool', 1.6), b('model', 0.4), b('tool', 0.6)); s.project!.skills = 1; s.project!.rules = 'plain'; note(s, { at: [196, 62, 0] as P3, text: 'skill door-check: a name and one line', place: 'bottom' }); } },
        { say: 'Before it replies, it checks its work the new way: it takes the skill off the shelf and runs the door check.', moves: [{ to: 'load', from: 'skill' }, runOk], preview: { app: 'lantern', stage: 'close', url: 'localhost:4321/door/close' },
          edit: (s) => { push(s, b('rules', 0.8), b('model', 0.3), b('tool', 1)); s.project!.skillOut = 0; A(s).lamp = 'ok'; note(s, ranSays('12 of 12 at phone size')); } },
        { say: 'It replies. The file is short again, and the steps it used are in the work log.', moves: [{ to: 'you', kind: 'model' }], preview: { app: 'lantern', stage: 'close', url: 'localhost:4321/door/close' },
          edit: (s) => { push(s, b('model', 0.9)); s.project!.skillOut = undefined; A(s).lamp = 'off'; note(s, atRules(`AGENTS.md: ${SHORT_LINES} lines`)); } },
      ]),
      log: {
        took: '4m 15s',
        rows: [
          { at: 2, label: readRow('AGENTS.md'), detail: { plain: 'all of it', technical: `${LONG_LINES} lines` } },
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'a shorter AGENTS.md, and a new door-check skill', technical: `AGENTS.md, ${SKILL_PATH} (new)` } },
          { at: 3, label: skillRow('door-check'), detail: { plain: 'the door-check steps, loaded now', technical: SKILL_PATH } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'the door at phone size, /door/close included', technical: 'npm run door-check: 12 of 12', engineer: 'door-check: 12 of 12 at 390×844 (/door, /door/late, /door/close)' } },
        ],
      },
      answer: [
        `AGENTS.md is ${SHORT_LINES} lines again: the rules every job needs. The door-check steps are now a skill called door-check, in ${SKILL_PATH}, and AGENTS.md says to use it before saying done on a door page.`,
        { plain: 'I used it before replying: the door at phone size, /door/close included. All 12 cases pass.', engineer: 'I used it before replying: door-check 12 of 12 at 390×844, /door/close included.' },
      ],
      deeper: { level: 'technical', text: 'Anthropic recommends keeping each CLAUDE.md under 200 lines: longer files cost context and reduce adherence. A skill’s name and description load up front, about 100 tokens each in the Agent Skills standard, and its body only when it is used. Claude Code keeps skill listings to about 1% of the window, Codex to 2%.' },
      tryIt: { prompt: 'AGENTS.md is getting long. Keep only the rules every job needs, and move step-by-step procedures into skills.', t3: 'Type $ in the composer to see which skills the agent can use. When Claude uses one, the work log shows a Skill row.' },
      sources: ['harnesses.claudeCode.claudeMdLines', 'skillFacts.specMetadataTokens', 'skillFacts.claudeCodeListing', 'skillFacts.codexListing', 'harnesses.claudeCode.skills', 't3code.skillsInComposer', 't3code.screen.skillRow'],
    },
  ],
};

export default lesson6;
