/* Guide v2, Set up: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import { TONIGHT } from '../preview/staff/data';
import type { SceneState, Label } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { harnesses } from '../../data/harnesses';
import { A, CHANGED, CHANGED_N, FIRST, FULL_ACCESS, RAN, atYou, b, file, n, points, push, type Lesson } from '../content';
/** As many made-up guests as the Preview's first page lists. */
const GUESTS_N = TONIGHT.length;

// ---------- Set up: First setup ----------
// The week before lesson 1: the Lantern's project is made, gets its notes, and runs.
// Lesson 2 opens in this project. The guests are made up.

const [, , RAN_N] = t3code.screen.workLogGroups.value;
const staff = (stage: string, url = 'localhost:4321/'): Preview => ({ app: 'staff', stage, url });

const frame = (): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'agent', 'top', 'the agent'), termLabel('tools', 'tools'), termLabel('project', 'project', 'top', 'the Lantern’s project')];
function floor(o: { files?: boolean; rules?: 'none' | 'plain' | 'lit' } = {}): SceneState {
  const s = solo({ tools: true, project: { rules: o.rules ?? 'none', commits: ['ok'], stacks: o.files ? [1, 1, 0, 0, 0, 0] : [0, 0, 0, 0, 0, 0], files: ['', '', '', '', '', ''] }, blocks: [FIRST], labels: frame() });
  return s;
}
const note = (s: SceneState, ...more: Label[]) => { s.labels = [...frame(), ...more]; };
const edit = (f: number) => ({ to: 'tool', tool: 'edit', file: f, back: 'tool' }) as const;
const run = (back: 'tool' | 'bad' = 'tool') => ({ to: 'tool', tool: 'run', back }) as const;

const sFirst: Lesson = {
  id: 's-first-setup',
  parts: [
    {
      title: 'A new project',
      thread: 'Set up the Lantern app',
      fresh: true,
      request: 'This is the Lantern’s staff app, for a small club. Set it up as a web app I can run on this computer and open on a phone later. Keep it simple.',
      lede: 'You chose New project and called it Lantern. T3 Code made a Git repository with a README, an icon and a first commit, privately on GitHub too, and opened this thread in it.',
      points: points(floor(), [
        { say: 'New project made the folder, the repository and its first commit. This thread works inside it.', moves: [{ to: 'agent' }], ui: { env: '', limits: [], modelName: '', model: true },
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; note(s, lab('main', 'first commit', 'bottom')); } },
        { say: 'It picks a small web stack and writes the start of the app.', moves: [edit(0), edit(1)],
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5), b('model', 1), b('tool', 1.5)); s.project!.stacks = [1, 1, 0, 0, 0, 0]; file(s, 0, 'edit'); file(s, 1, 'edit'); note(s, lab('project', 'a web app, started', 'right')); } },
        { say: 'It installs what the app needs and checks it builds. It replies with how to run it.', moves: [run(), { to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 1), b('tool', 3), b('model', 2)); s.project!.stacks = [1, 1, 0, 0, 0, 0]; file(s, 0, 'ok'); file(s, 1, 'ok'); A(s).lamp = 'ok'; note(s, atYou('npm run dev')); } },
      ]),
      log: {
        took: '2m 10s',
        rows: [
          { at: 1, label: n(CHANGED_N, 6), detail: { plain: 'the start of a web app', technical: 'package.json, astro.config.ts, src/pages/index.astro, …', engineer: 'Astro + TypeScript, no UI framework yet' } },
          { at: 2, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'installed and built', technical: 'npm install; npm run build' } },
        ],
      },
      answer: [
        'The Lantern’s app is a small web app now. npm run dev starts it on this computer; I haven’t started it yet.',
        'Nothing in it is about the club yet. Tell me what the first page should show.',
      ],
      tryIt: { prompt: 'This is [what the project is, for whom]. Set it up as a web app I can run here and open on a phone later. Keep it simple.', t3: 'Choose New project in the command palette (mod+k) or under Add Project. Turn on Create private repository on GitHub to publish it at the same time.' },
      sources: ['t3code.newProject', 't3code.publishRepo', 't3code.shortcuts.palette'],
    },
    {
      title: 'Notes it reads first',
      thread: 'Set up the Lantern app',
      request: 'Write an AGENTS.md for this project: what the Lantern is, how to run and check the app, and two rules: only made-up guests in the repository, and never a guest’s phone number in it.',
      lede: 'Every new thread starts without this conversation. A short file at the root of the project is how the next thread knows the basics.',
      points: points(floor({ files: true }), [
        { say: 'It writes AGENTS.md: what the project is, how to run it and check it, and your two rules.', moves: [{ to: 'agent' }, { to: 'tool', tool: 'edit', back: 'tool' }],
          edit: (s) => { push(s, b('you', 3), b('model', 1), b('tool', 1)); A(s).lamp = 'work'; s.project!.rules = 'lit'; note(s, lab('rules', 'AGENTS.md', 'left')); } },
        { say: 'Codex reads AGENTS.md. Claude Code reads CLAUDE.md, and AGENTS.md only when there’s no CLAUDE.md, so it adds a one-line CLAUDE.md that imports it.', moves: [{ to: 'tool', tool: 'edit', back: 'tool' }],
          edit: (s) => { push(s, b('model', 1), b('tool', 0.6)); s.project!.rules = 'lit'; note(s, lab('rules', 'CLAUDE.md: @AGENTS.md', 'left')); } },
        { say: `Short on purpose. A file every thread reads costs room in every window; Anthropic suggests keeping CLAUDE.md under ${harnesses.claudeCode.claudeMdLines.value} lines.`, moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 1.6)); s.project!.rules = 'plain'; A(s).lamp = 'ok'; note(s, lab('rules', 'read by every new thread', 'left')); } },
      ]),
      log: {
        took: '50s',
        rows: [
          { at: 0, label: CHANGED, detail: { plain: 'AGENTS.md: the club, how to run and check, two rules', technical: 'AGENTS.md (new, 24 lines)' } },
          { at: 1, label: CHANGED, detail: { plain: 'CLAUDE.md, pointing at AGENTS.md', technical: 'CLAUDE.md: @AGENTS.md' } },
        ],
      },
      answer: [
        'AGENTS.md says what the Lantern’s app is, how to run it (npm run dev) and how to check it (npm test), and holds your two rules: made-up guests only, and no guest’s phone number in the repository.',
        'CLAUDE.md is one line that imports it, so Claude Code reads the same notes.',
      ],
      deeper: { level: 'technical', text: 'In Claude Code, /init drafts a CLAUDE.md from the codebase. Lesson 6 is about what belongs in the file and what doesn’t.' },
      tryIt: { prompt: 'Write an AGENTS.md: what this project is, how to run and check it, and these rules: [rules]. Keep it short.', t3: 'Open AGENTS.md in the file viewer and read it once yourself.' },
      sources: ['harnesses.codex.contextFile', 'harnesses.claudeCode.contextFile', 'harnesses.claudeCode.init', 'harnesses.claudeCode.claudeMdLines', 't3code.browser'],
    },
    {
      title: 'See it run',
      thread: 'Set up the Lantern app',
      request: `Put tonight’s guest list on the first page, with ${GUESTS_N} made-up guests, and start the app so I can see it.`,
      lede: 'The project is ready for its first real page: the list that lesson 2’s door page will use.',
      points: points(floor({ files: true, rules: 'plain' }), [
        { say: 'It adds the made-up list and a first page that shows it.', moves: [{ to: 'agent' }, edit(2), edit(0)], ui: { perm: FULL_ACCESS }, preview: staff('none-'),
          edit: (s) => { push(s, b('you', 2), b('model', 1), b('tool', 2), b('model', 1), b('tool', 1.5)); A(s).lamp = 'work'; s.project!.stacks = [2, 1, 1, 0, 0, 0]; file(s, 2, 'edit'); file(s, 0, 'edit'); note(s, lab('project', '60 made-up guests', 'right')); } },
        { say: 'It starts the dev server. The thread details list the local server with its port; selecting it opens the page in the browser panel.', moves: [run()], preview: staff('starter'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1)); s.project!.stacks = [2, 1, 1, 0, 0, 0]; note(s, lab('tool:run', 'npm run dev', 'right')); } },
        { say: 'It replies. This thread ran in Full access, the default for new threads: it ran commands and changed files without asking. Supervised asks first; the chip under the composer changes it.', moves: [{ to: 'you', kind: 'model' }], preview: staff('starter'),
          edit: (s) => { push(s, b('model', 1.6)); s.project!.stacks = [2, 1, 1, 0, 0, 0]; A(s).lamp = 'ok'; note(s, atYou('tonight’s list, running')); } },
      ]),
      log: {
        took: '1m 30s',
        rows: [
          { at: 0, label: n(CHANGED_N, 2), detail: { plain: 'a made-up guest list, and a first page that shows it', technical: `src/guests.ts (${GUESTS_N} made-up guests), src/pages/index.astro` } },
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'started the app on this computer', technical: 'npm run dev: localhost:4321' } },
        ],
      },
      answer: [
        `Tonight’s list is on the first page: ${GUESTS_N} made-up guests with their promoter and plus-ones. The app is running at localhost:4321; open it from the thread details.`,
        'localhost only opens on this computer. Lesson 16 shows how to let someone else’s phone open a preview, privately; lesson 17, how to reach this computer from yours. This is the project lesson 2 starts in.',
      ],
      tryIt: { prompt: 'Put [the first useful thing] on the first page, with made-up data, and start the app so I can see it.', t3: 'Change a thread’s permission mode with the chip under the composer or mod+shift+a; the default for new threads is in Settings → Threads.' },
      sources: ['t3code.localServers', 't3code.browser', 't3code.defaultMode', 't3code.modeMeaning', 't3code.modeSwitch'],
    },
  ],
};

export default sFirst;
