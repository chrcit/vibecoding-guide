/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import { PROMOTERS } from '../preview/lantern/store';
import type { SceneState, Block, Label, P3 } from '../../journey/picture';
import { CAP } from '../../journey/picture';
import { solo, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { A, CHANGED_N, FIRST, RAN, b, file, fill, n, points, push, readRow, searchRow, type Lesson, type Move } from '../content';

// ---------- lesson 5: the window fills ----------
// Friday 16:00 to 16:40. The promoter thread ("Promoter links") has run since 11:30: lesson 3 built
// the promoter links in it, and lesson 4 queued the phone rule into it at 13:20. The window is drawn
// as v1 draws it (journey/chapters/window.ts): a pile of slabs, oldest at the bottom. The percentage
// in the thread details is worked out from the pile, so the number and the picture agree. All of it
// is made up, and window sizes are relative.

const [READ_N] = t3code.screen.workLogGroups.value;
const [COMPACTING, COMPACTED] = t3code.screen.compaction.value;
const PROMOTER = 'Promoter links';

const sum = (bs: Block[]) => bs.reduce((s, x) => s + x.h, 0);
/** How full the window is, in per cent, as the thread details would show it. */
const pct = (bs: Block[]) => Math.round((sum(bs) / CAP) * 100);
/** Where slab i sits in the drawn stack (the picture's own arithmetic, journey/picture.ts stackMarkup). */
function slabZ(bs: Block[], i: number) {
  const total = sum(bs);
  const f = total > CAP ? CAP / total : 1;
  let z = 4.4;
  for (let j = 0; j < i; j++) z += Math.max(1.3, bs[j]!.h * f);
  return z + Math.max(1.3, bs[i]!.h * f) / 2;
}
/** An annotation beside the window's right face, high up, clear of the stack and the tools. */
const side = (text: string, z = 48): Label => ({ at: [14, -14, z] as P3, text, place: 'right' });
/** An annotation hanging below you, clear of the line to the agent and the tools. */
const belowYou = (text: string): Label => ({ at: [0, 104, 0] as P3, text, place: 'bottom' });
/** What a run came back with, below the tools and clear of their tray. */
const ranSays = (text: string): Label => ({ at: [52, 46, 0] as P3, text, place: 'bottom' });
/** An annotation beside the file the agent changed (file tile 2 on the project plate). */
const atFile = (text: string): Label => ({ at: [214, -12, 2] as P3, text, place: 'right' });
/** An annotation on the window's front face, beside slab i. */
const atSlab = (bs: Block[], i: number, text: string): Label => ({ at: [-40, 40, Math.max(16, slabZ(bs, i))] as P3, text, place: 'left' });

// The day in the window. 11:30: the promoter links (lesson 3). 13:20: your phone rule, queued in
// (lesson 4), one short slab. Then hours of test runs and fixes on top of it.
const MORNING: Block[] = [b('you', 1.4), b('model', 0.8), b('tool', 2.6), b('model', 0.8), b('tool', 4.2), b('model', 1), b('tool', 2.2), b('model', 1.2), b('tool', 3), b('model', 1)];
const RULE = b('you', 1.1);
const AFTERNOON: Block[] = [b('model', 0.8), b('tool', 2.4), b('model', 0.8), b('tool', 4.6), b('model', 1), b('tool', 3.2), b('tool', 3.8), b('model', 1.1), b('tool', 2.6), b('model', 0.9)];
const DAY: Block[] = [FIRST, ...MORNING, RULE, ...AFTERNOON];
const RULE_AT = 1 + MORNING.length;

const frame = (more: Label[] = []): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'model'), termLabel('tools', 'tools'), termLabel('project', 'project'), ...more];
const scene = (blocks: Block[]): SceneState => {
  const s = solo({ tools: true, project: true, blocks, labels: frame() });
  s.project!.files = ['', '', '', '', '', ''];
  return s;
};
const note = (s: SceneState, ...more: Label[]) => { s.labels = frame(more); };
const lantern = (stage: string): Preview => ({ app: 'lantern', stage, url: `localhost:4321${stage === 'promoters' ? '/promoters' : stage === 'late-running' ? `/p/${PROMOTERS.kai.token}` : '/door/late'}` });

const read = { to: 'tool', tool: 'read', file: 1, back: 'tool' } as const;
const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const change = { to: 'tool', tool: 'edit', file: 2, back: 'tool' } as const;
const runOk: Move = { to: 'tool', tool: 'run', back: 'tool' };

// The window after each part, so the next part's numbers follow from it.
const ASK1 = b('you', 1);
const AFTER1: Block[] = [...DAY, ASK1, b('model', 0.7), b('tool', 3.4), b('model', 0.6), b('tool', 1.6), b('model', 1.3)];
const ASK2 = b('you', 1.1);
const AT2 = [...AFTER1, ASK2];
const AFTER2: Block[] = [...AT2, b('model', 0.5), b('tool', 1), b('model', 0.4), b('tool', 0.8), b('model', 0.5)];
const FULL: Block[] = [...AFTER2, b('you', 0.4)];
// /compact: a summary and a few files read again. No instructions file yet: that is lesson 6.
const SUMMARY: Block[] = [FIRST, b('sum', 2.2), b('tool', 0.6), b('tool', 0.5), b('tool', 0.5)];
const ASK3 = b('you', 1.4);
// A new thread on one job: a short window.
const FRESH: Block[] = [FIRST, b('you', 0.9)];
const FRESH_READ: Block[] = [...FRESH, b('model', 0.3), b('tool', 0.6), b('model', 0.3), b('tool', 0.9)];
const FRESH_BUILT: Block[] = [...FRESH_READ, b('model', 0.3), b('tool', 0.7), b('model', 0.3), b('tool', 0.6)];

const lesson5: Lesson = {
  id: 'l5',
  parts: [
    {
      title: 'Everything stays in',
      earlier: { turns: 6, from: 'l3', label: 'lessons 3 and 4' },
      thread: PROMOTER,
      request: 'Show me tonight’s numbers so far. Done when I see, per promoter, guests added, plus-ones and arrived.',
      lede: 'Friday, 16:00. The promoter thread has run since 11:30: it built Kai’s and Noor’s links (lesson 3), and at 13:20 you queued a rule into it: a guest’s phone number never shows at the door (lesson 4). Now a small question.',
      points: points(scene(DAY), [
        { say: `Your question goes in on top of everything since 11:30: every request, every file it read, every test log. All of it is still in this thread’s window, ${pct([...DAY, ASK1])}% full.`, moves: [{ to: 'agent' }], look: 'context', ui: { context: pct([...DAY, ASK1]) }, preview: lantern('promoters'),
          edit: (s) => { push(s, ASK1); note(s, side('since 11:30: all of it')); } },
        { say: 'Before every turn, the model reads all of it again, from the instructions at the bottom to your question at the top.', think: 1500, preview: lantern('promoters'),
          edit: (s) => { A(s).busy = true; A(s).scan = true; note(s, side('read again, every turn')); } },
        { say: 'Your phone rule from 13:20 is in there: one short slab, low down, under hours of test output.', preview: lantern('promoters'),
          edit: (s) => { note(s, atSlab([...DAY, ASK1], RULE_AT, 'your phone rule, 13:20')); } },
        { say: `It reads the promoter lists and counts. The work goes into the window too: ${pct(AFTER1)}% now, and the row turns amber from 80%.`, moves: [read, runOk], look: 'context', ui: { context: pct(AFTER1) }, preview: lantern('promoters'),
          edit: (s) => { A(s).blocks = AFTER1.slice(0, -1); A(s).lamp = 'work'; note(s, side(`${pct(AFTER1)}% full`)); } },
        { say: 'It answers. A small question, answered right, from a window that is nearly full.', moves: [{ to: 'you', kind: 'model' }], preview: lantern('promoters'),
          edit: (s) => { A(s).blocks = AFTER1; A(s).lamp = 'off'; note(s, belowYou('Kai 20 · Noor 11')); } },
      ]),
      log: {
        took: '40s',
        rows: [
          { at: 3, label: n(READ_N, 2), detail: { plain: 'both promoter lists', technical: 'src/promoters.ts, src/guests.ts' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'counted tonight’s guests per promoter', technical: 'npm run stats -- --night friday', engineer: 'npm run stats -- --night friday → kai 20/9/0, noor 12/4/0' } },
        ],
      },
      answer: [
        'Friday so far: Kai has 20 guests and 9 plus-ones, 0 in. Noor has 11 guests and 3 plus-ones, 0 in. Doors haven’t opened, so nobody has arrived yet.',
        'The same numbers are on /promoters.',
      ],
      deeper: { level: 'technical', text: 'The percentage counts the tokens in this thread’s window against the model’s 1M. Each turn sends the whole conversation to the model again. Prompt caching makes that rereading cheaper, not free: on a subscription the cache lasts about an hour, on an API key five minutes.' },
      tryIt: { prompt: 'Sum up what this thread has done so far, in five lines.', t3: 'Turn on Context window in Settings → Appearance → Thread details, then open the details in your longest thread. The row appears once the provider reports usage.' },
      sources: ['t3code.screen.contextWindow', 't3code.screen.contextRow', 't3code.contextSetting', 'models.claude-opus-5-5.context', 'harnesses.claudeCode.promptCacheTtl'],
    },
    {
      title: 'In the window isn’t the same as followed',
      thread: PROMOTER,
      request: 'Let Sami reach promoter guests who haven’t arrived by midnight. Done when it takes two taps from the door page.',
      lede: 'Friday, 16:10, same thread. The request doesn’t repeat the phone rule. You said it once, at 13:20, and it’s still in the window.',
      points: points(scene(AT2), [
        { say: `The request goes on top of a window that is ${pct(AT2)}% full. It says nothing about phone numbers.`, moves: [{ to: 'agent' }], ui: { context: pct(AT2) }, preview: lantern('promoters'),
          edit: (s) => { A(s).lamp = 'work'; note(s, side(`${pct(AT2)}% full`)); } },
        { say: 'It builds a late list for the door, with a Call button. To call, it needs the number, so the number goes on the door screen.', moves: [read, change], preview: lantern('late-phone'),
          edit: (s) => { push(s, b('model', 0.5), b('tool', 1)); file(s, 2, 'edit'); note(s, atFile('door page')); } },
        { say: 'Its checks pass, 17 of 17. The phone test from 13:20 checks the door’s search results, and this is a new page.', moves: [runOk], preview: lantern('late-phone'),
          edit: (s) => { push(s, b('model', 0.4), b('tool', 0.8)); A(s).lamp = 'ok'; note(s, ranSays('17 of 17 pass')); } },
        { say: 'It replies: done, two taps, tried at phone size.', moves: [{ to: 'you', kind: 'bad' }], preview: lantern('late-phone'),
          edit: (s) => { A(s).blocks = AFTER2; A(s).lamp = 'off'; note(s, belowYou('“Done.”')); } },
        { say: 'Open the Preview: Lea’s number is on the door screen. Your rule is still in the window, and it wasn’t followed. In the window isn’t the same as followed.', preview: lantern('late-flag'),
          edit: (s) => { file(s, 2, 'bad'); A(s).lamp = 'bad'; note(s, atSlab(AFTER2, RULE_AT, 'still in the window'), atFile('not followed')); } },
      ]),
      log: {
        took: '2m 30s',
        rows: [
          { at: 1, label: readRow('src/door.tsx'), detail: { plain: 'the door page', technical: 'src/door.tsx' } },
          { at: 1, label: n(CHANGED_N, 2), detail: { plain: 'a late list for the door, with a Call button', technical: 'src/door/late.tsx (new), src/door.tsx', engineer: '+src/door/late.tsx: lateGuests(now) → name, promoter, phone; tel: link' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'all checks pass', technical: 'npm test: 17 of 17', engineer: 'vitest 15/15; playwright door.spec 2/2 @390×844 (search results only)' } },
        ],
      },
      answer: [
        'Done. /door/late lists promoter guests who haven’t arrived by midnight. Tap one, then Call. That’s two taps.',
        { plain: 'I tried it at phone size with made-up guests. All 17 checks pass.', engineer: 'I tried it at 390×844 with made-up guests. All 17 checks pass.' },
      ],
      deeper: { level: 'engineer', text: 'Anthropic calls it context rot: as the window grows, a model’s recall of what is in it declines. It’s a tendency, not a certainty. A shorter window makes a miss like this less likely, not impossible. And the 13:20 test checked the door’s search results, so the must-never was only as wide as its test.' },
      tryIt: { prompt: 'Before you change anything: which rules from earlier in this thread apply to this?', t3: 'Open the thread details and note the Context window percentage before you send.' },
      sources: ['claims.research.contextRot', 't3code.screen.contextRow', 'claims.lessons.toolCallEvidence'],
    },
    {
      title: 'Compact, or start over',
      thread: PROMOTER,
      command: { text: '/compact', running: COMPACTING, done: fill(COMPACTED, { before: `${pct(FULL) * 10}K`, after: `${pct(SUMMARY) * 10}K` }), doneAt: 1, requestAt: 2 },
      request: 'Take the phone numbers off the door screen. Sami asks the promoter to call instead. It must never show a guest’s phone number at the door.',
      lede: 'Friday, 16:20, same thread. The window is close to full. Before the fix you make room, and see what that keeps.',
      points: points((() => { const s = scene(AFTER2); s.project!.files = ['', '', 'bad', '', '', '']; return s; })(), [
        { say: `${pct(FULL)}% used, and the row has turned red. You send /compact first.`, look: 'context', ui: { context: pct(FULL) }, preview: lantern('late-flag'),
          edit: (s) => { A(s).blocks = FULL; A(s).lamp = 'bad'; note(s, side(`${pct(FULL)}% full`)); } },
        { say: '/compact swaps the whole conversation for a summary of it, plus a few files read again. The summary keeps what was built. The rule you said in passing at 13:20 isn’t in it.', look: 'context', ui: { context: pct(SUMMARY) }, preview: lantern('late-flag'),
          edit: (s) => { A(s).blocks = SUMMARY; A(s).lamp = 'off'; note(s, atSlab(SUMMARY, 1, 'a summary'), side('13:20 rule: gone')); } },
        { say: 'So this time the request carries the rule. It takes the numbers off and widens the phone test to every door page.', moves: [{ to: 'agent' }, change, runOk], ui: { context: pct([...SUMMARY, ASK3, b('model', 0.6), b('tool', 1.2)]) }, preview: lantern('late-ask'),
          edit: (s) => { push(s, ASK3, b('model', 0.6), b('tool', 1.2)); file(s, 2, 'ok'); A(s).lamp = 'ok'; note(s, side('the rule, in the request', 30)); } },
        { say: 'It replies. The rule holds, for this turn, because it’s in this request.', moves: [{ to: 'you', kind: 'model' }], preview: lantern('late-ask'),
          edit: (s) => { push(s, b('model', 1.2)); A(s).lamp = 'off'; note(s, belowYou('no numbers at the door')); } },
        { say: '/clear goes further: a new session in the same thread, with nothing carried over. A new thread does the same, and gets its own title.', preview: lantern('late-ask'),
          edit: (s) => { A(s).blocks = [FIRST]; note(s, side('after /clear: only what you send next')); } },
      ]),
      ghost: { at: 4, label: t3code.screen.newSession.value, note: 'what /clear would leave here' },
      log: {
        took: '1m 50s',
        rows: [
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'no numbers on the late list: “Ask Kai” instead, and a new phone test', technical: 'src/door/late.tsx, tests/door-phone.spec.ts (new)', engineer: 'late.tsx: drop phone, add askPromoter(id); +door-phone.spec: every /door route, fail on any fixture number' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'all checks pass, the new phone test too', technical: 'npm test: 18 of 18' } },
        ],
      },
      answer: [
        'The door screen no longer shows phone numbers. /door/late now says which promoter to ask, and the promoter’s own list has the number.',
        'The 13:20 phone test only searched the door. I added one that loads every door page and fails if any made-up guest’s number appears. All 18 checks pass.',
      ],
      deeper: { level: 'technical', text: 'Compaction is lossy: it keeps a summary, not your exact words. Claude Code re-reads up to five recently used files and re-injects the project’s CLAUDE.md from disk, so a rule kept in that file survives compaction. That is lesson 6.' },
      tryIt: { prompt: 'Take [the problem] out. It must never [the rule], on any page.', t3: 'Send /compact to shrink a long thread, when the provider supports it, or /clear on its own to start a new session in the same thread. The thread marks it with New session.' },
      sources: ['t3code.compact', 't3code.clear', 't3code.screen.compaction', 't3code.screen.newSession', 'harnesses.claudeCode.compactionKeeps', 'harnesses.claudeCode.compactionReread'],
    },
    {
      title: 'One job, one thread',
      thread: 'Running late button',
      fresh: true,
      request: 'Add a “running late” button to the promoter page, so a promoter can tell the door their guest is late. Done when the door’s late list shows it. It must never show a guest’s phone number at the door.',
      lede: 'Friday, 16:40. A new thread with one job in it, and the rule written into the request.',
      points: points(scene([FIRST]), [
        { say: `A new thread. Its window holds the harness’s instructions and your request, nothing else: ${pct(FRESH)}% used.`, moves: [{ to: 'agent' }], look: 'context', ui: { context: pct(FRESH) }, preview: lantern('late-ask'),
          edit: (s) => { A(s).blocks = FRESH; A(s).lamp = 'work'; note(s, side('your request: one job, one rule', 30)); } },
        { say: 'It reads the few files this job needs.', moves: [search, read], preview: lantern('late-ask'),
          edit: (s) => { A(s).blocks = FRESH_READ; file(s, 1, 'read'); note(s, lab('tool:read', 'what this job needs', 'right')); } },
        { say: 'It builds the switch, runs the checks, and keeps the rule: it’s right there, at the top of a short window.', moves: [change, runOk], ui: { context: pct(FRESH_BUILT) }, preview: lantern('late-running'),
          edit: (s) => { A(s).blocks = FRESH_BUILT; file(s, 2, 'ok'); A(s).lamp = 'ok'; note(s, ranSays('19 of 19 pass')); } },
        { say: 'It replies. Kai flips the switch; the door sees “running late”, and no number.', moves: [{ to: 'you', kind: 'model' }], preview: { app: 'lantern', stage: 'late-shown', url: 'localhost:4321/door/late' },
          edit: (s) => { push(s, b('model', 0.6)); A(s).lamp = 'off'; note(s, belowYou('done, rule kept')); } },
        { say: 'Short, and on one job. But that’s the third time today you’ve typed the phone rule.', preview: { app: 'lantern', stage: 'late-shown', url: 'localhost:4321/door/late' },
          edit: (s) => { note(s, belowYou('phone rule, typed 3 times')); } },
      ]),
      log: {
        took: '2m 10s',
        rows: [
          { at: 1, label: searchRow('late', 'src'), detail: { plain: 'where “late” already lives', technical: 'src/door/late.tsx, src/p/[link].tsx' } },
          { at: 1, label: n(READ_N, 3), detail: { plain: 'the promoter page, the late list, the guest data', technical: 'src/p/[link].tsx, src/door/late.tsx, src/guests.ts' } },
          { at: 2, label: n(CHANGED_N, 3), detail: { plain: 'a switch per guest, shown on the late list', technical: 'src/p/[link].tsx, src/door/late.tsx, src/guests.ts', engineer: 'guests.runningLate (bool, cleared at check-in); /p/[link] switch; /door/late badge “running late · {promoter}”' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'all checks pass, one new: late shows, no number', technical: 'npm test: 19 of 19' } },
        ],
      },
      answer: [
        'Promoters can mark a guest as running late from their list. The door’s late list shows “running late” with the promoter’s name, and no phone numbers anywhere at the door.',
        { plain: 'I tried it at phone size with made-up guests. All 19 checks pass, one of them new: the late list shows “running late” and no number.', engineer: 'I tried it at 390×844 with made-up guests. All 19 checks pass; the new one asserts the badge and no number on /door/late.' },
      ],
      deeper: { level: 'technical', text: 'Anthropic advises clearing between tasks: a focused context gets better answers and costs less. And after two failed corrections, start fresh with a better prompt rather than add a third.' },
      tryIt: { prompt: '[One job]. Done when [the check]. It must never [the rule].', t3: 'A new thread carries your model and permission mode, not the conversation. Paste the rules it needs into the request, until lesson 6.' },
      sources: ['harnesses.claudeCode.focusedContext', 'harnesses.claudeCode.clearAfterTwo', 't3code.newThreadCarries'],
    },
  ],
};

export default lesson5;
