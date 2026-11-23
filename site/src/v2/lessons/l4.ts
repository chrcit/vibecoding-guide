/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. */
import type { SceneState, XY, Block, Lamp, Card } from '../../journey/picture';
import { jobs, lab } from '../../journey/presets';
import { jobSpot, attendSpot, fileSpot, BUS_Y } from '../../journey/picture';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { CHANGED, CHANGED_N, RAN, RAN_N, STATUS, b, n, points, readRow, searchRow, type Lesson, type StoryThread } from '../content';

// ---------- lesson 4: start another ----------
// Friday 13:00 to 14:10. Several story threads at once in the Lantern's project: the promoter thread
// from lesson 3, then the bar, tonight's rota and tonight's post. Bea, Sami and every number, time
// and name here are made up.

const [CHECKOUT] = t3code.screen.workspace.value;
const HANDOFF = t3code.worktreeHandoff.value;
const BRANCH = `${t3code.branchPrefix.value}rota-tonight`;

// The story threads, by their titles in the sidebar, and the part of this lesson each one opens.
const PROMO = 'Promoter links';
const BAR = 'Bar running low';
const ROTA = 'Tonight’s rota';
const POST = 'Tonight’s post';
const OPENS: Record<string, number> = { [BAR]: 0, [PROMO]: 1, [ROTA]: 2, [POST]: 3 };
const W = STATUS.working, D = STATUS.done;
/** The sidebar's story threads at a point, oldest first: [title, status]. */
const side = (...rows: [string, string][]): StoryThread[] => rows.map(([title, status]) => ({ title, status, part: OPENS[title] }));

const preview = (app: string, stage: string, url?: string): Preview => ({ app, stage, ...(url ? { url } : {}) });
const NOOR = 'localhost:4321/p/q7Xk2mVd9TfR';

// ---------- the picture: several jobs in a row, one of you, a tray with a card per job ----------

const job = (s: SceneState, i: number) => s.agents[i]!;
/** n jobs in one project (the Lantern's), each window holding what that thread was told. */
function floor(n: number, o: { trees?: boolean; windows?: Block[][]; lamps?: Lamp[]; cards?: Card['mark'][] } = {}): SceneState {
  const s = jobs(n, { projects: 'one', trees: o.trees ?? false });
  s.agents.forEach((a, i) => {
    a.blocks = o.windows?.[i] ?? [b('rules', 1.2), b('you', 2)];
    a.lamp = o.lamps?.[i] ?? 'work';
    a.busy = a.lamp === 'work';
  });
  s.tray!.cards.forEach((c, i) => { c.mark = o.cards?.[i] ?? 'work'; });
  s.labels = [lab('you', 'you', 'left')];
  return s;
}
const note = (s: SceneState, ...more: ReturnType<typeof lab>[]) => { s.labels = [lab('you', 'you', 'left'), ...more]; };
/** From you up to job i of n, and back. */
const toJob = (i: number, nJobs: number): XY[] => { const [x] = jobSpot(i, nJobs); return [[0, 94], [0, 78], [x, 78], [x, 20]]; };
const fromJob = (i: number, nJobs: number): XY[] => [...toJob(i, nJobs)].reverse();
/** From job i along the bus to a file on the shared project, and back. */
const toFile = (s: SceneState, i: number, f: number): XY[] => { const [x] = jobSpot(i, s.agents.length); const p = s.project!; return [[x, -16], [x, BUS_Y], [p.at[0] - 46, BUS_Y], fileSpot(p, f)]; };
/** A thread's window after some work. */
const worked = (extra: Block[] = []): Block[] => [b('rules', 1.2), b('you', 2), b('model', 1), b('tool', 3), b('model', 1), b('tool', 2.5), ...extra];

// The promoter thread's window, from lesson 3: four requests and their work.
const promoWindow = (): Block[] => { const out: Block[] = [b('rules', 1.2)]; for (let i = 0; i < 5; i++) out.push(b('you', 1.4), b('model', 1), b('tool', 3), b('model', 1.2)); return out; };
const barWindow = (): Block[] => [b('rules', 1.2), b('you', 2.4)];

const lesson4: Lesson = {
  id: 'l4',
  parts: [
    {
      title: 'Don’t watch it work',
      thread: BAR,
      fresh: true,
      request: 'When the bar runs low on something, staff tap it on their phone, and in the morning I get one list to order from. Done when you’ve tried it at phone size: a tap adds the item once, and the list shows who tapped and when.',
      lede: 'Friday, 13:00. The promoter thread is still working on your last request: promoters can remove a guest until 22:00. Bea texts from the bar: they ran out of lime last Friday.',
      points: points(floor(1, { windows: [promoWindow()] }), [
        { say: 'The promoter thread is still working. You could sit and watch its log. Instead, you start a new thread for the bar.', moves: [], threads: side([PROMO, W]), preview: preview('promoters', 'capped', 'localhost:4321/promoters'),
          edit: (s) => { note(s, lab('j0', 'promoter links: working', 'top')); } },
        { say: 'In a new thread, mod+Enter (Cmd+Enter on a Mac, Ctrl+Enter elsewhere) sends the request in the background and opens a fresh draft, so the next idea has somewhere to go.', moves: [{ to: 'path', path: toJob(1, 2), kind: 'you' }], threads: side([PROMO, W], [BAR, W]), preview: preview('promoters', 'capped', 'localhost:4321/promoters'),
          edit: (s) => { Object.assign(s, floor(2, { windows: [promoWindow(), barWindow()] })); note(s, lab('j1', 'bar: working', 'top')); } },
        { say: 'Nothing needs you yet. In T3 Code’s default sidebar, working threads fold into a Working section and come back to the top when they finish, fail or need you. This drawing groups threads by project instead, so they stay under the lesson.', threads: side([PROMO, W], [BAR, W]), preview: preview('promoters', 'capped', 'localhost:4321/promoters'),
          edit: (s) => { job(s, 1).blocks!.push(b('model', 1), b('tool', 3)); note(s, lab([0, 112, 0], 'nothing needs you', 'bottom')); } },
        { say: 'Each thread has its own window. The bar thread knows nothing about promoters, and the promoter thread knows nothing about lime.', threads: side([PROMO, W], [BAR, W]), preview: preview('promoters', 'capped', 'localhost:4321/promoters'),
          edit: (s) => { job(s, 1).blocks!.push(b('model', 1), b('tool', 2.5)); note(s, lab('j1', 'knows only about lime', 'top')); } },
        { say: 'The bar job is smaller, so it finishes first. Its row says Done and waits for you to read it. The promoter thread keeps working.', moves: [{ to: 'path', path: fromJob(1, 2), kind: 'model' }], threads: side([PROMO, W], [BAR, D]), preview: preview('bar', 'ready'),
          edit: (s) => { job(s, 1).blocks!.push(b('model', 2)); job(s, 1).lamp = 'ok'; job(s, 1).busy = false; s.tray!.cards[1]!.mark = 'wait'; note(s, lab('j1', 'bar: done', 'top'), lab('card:j1', 'yours to read', 'bottom')); } },
      ]),
      log: {
        took: '5m 15s',
        rows: [
          { at: 1, label: searchRow('stock', 'src'), detail: { plain: 'nothing for the bar yet', technical: 'no matches; src/app.tsx holds the routes' } },
          { at: 2, label: n(CHANGED_N, 3), detail: { plain: 'a running-low page for staff, and the morning list', technical: 'src/bar.tsx, src/bar/order.tsx, src/bar.test.ts', engineer: '+src/bar.tsx, +src/bar/order.tsx; flagLow(item, who) ignores a second flag for the same item tonight' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'tried it at phone size: tapping twice adds lime once', technical: 'npm test: 6 of 6', engineer: 'vitest 4/4; playwright bar.spec 2/2 @390×844' } },
        ],
      },
      answer: [
        'Staff can now open /bar and tap whatever is running low. Each item shows who tapped it and when, and a second tap on the same item tonight doesn’t add it again. In the morning, the Order tab has tonight’s list in one place.',
        'I tried it at phone size with made-up staff: Bea tapped Lime at 23:12, then tapped it again, and it stayed one line, “Lime · Bea · 23:12”.',
      ],
      deeper: { level: 'engineer', text: 'Each thread is its own provider session with its own context window. Nothing from the promoter thread reaches the bar thread unless you put it there, or both read it from the project.' },
      tryIt: { prompt: 'Start a second request while the first is still running.', t3: 'In a new thread, press mod+Enter (Cmd on macOS, Ctrl elsewhere) to send it in the background and open another draft.' },
      sources: ['t3code.shortcuts.background', 't3code.workingSection', 't3code.screen.statuses', 't3code.newThreadCarries'],
    },
    {
      title: 'Queue it while it works',
      earlier: { turns: 4, from: 'l3', label: 'lesson 3' },
      thread: PROMO,
      fresh: true,
      resumes: true,
      running: {
        request: 'Let promoters remove a guest from their list until 22:00.',
        took: '4m 40s',
        ends: 2,
        rows: [
          { at: 0, label: n(CHANGED_N, 2), detail: { plain: 'a remove button on each guest, locked from 22:00', technical: 'src/p/[link].tsx, src/promoters.ts' } },
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'all checks pass, plus one for the 22:00 lock', technical: 'npm test: 16 of 16' } },
        ],
        answer: ['Promoters can now remove a guest until 22:00. After that their list locks and the page says so. All 16 checks pass, including a new one for the lock.'],
      },
      queued: { at: 2 },
      request: 'Promoters also enter a phone number for each guest, so we can reach them. It must never show on the door screen.',
      lede: 'Friday, 13:20. You think of something for the promoter thread while it’s busy. You don’t wait for it to finish, and you don’t stop it.',
      points: points(floor(2, { windows: [promoWindow(), worked([b('model', 2)])], lamps: ['work', 'ok'], cards: ['work', 'wait'] }), [
        { say: 'You type it into the promoter thread now and send it with mod+Enter. It waits at the end of the thread as a queued message.', threads: side([PROMO, W], [BAR, D]), preview: preview('promoters', 'noor', NOOR),
          edit: (s) => { s.rest = [{ id: 'q', at: [-58, 46], b: 'you' }]; note(s, lab([-58, 46, 4], 'queued', 'top')); } },
        { say: 'Enter would have steered it into the turn that’s running, which is T3 Code’s default when the provider supports it. Queued, it waits for that turn to end. You can still edit or remove it.', threads: side([PROMO, W], [BAR, D]), preview: preview('promoters', 'noor', NOOR),
          edit: (s) => { job(s, 0).blocks!.push(b('tool', 2)); note(s, lab([-58, 46, 4], 'queued', 'top'), lab('j0', 'its turn runs on', 'top')); } },
        { say: 'The turn ends with its reply. Your queued message goes in, and the same thread picks it up, with everything it already knows.', moves: [{ to: 'path', path: [[-58, 46], [-29, 46], [-29, 20]], kind: 'you', ms: 420 }], threads: side([PROMO, W], [BAR, D]), preview: preview('promoters', 'noor-phone', NOOR),
          edit: (s) => { s.rest = []; job(s, 0).blocks!.push(b('model', 1), b('you', 1.6), b('model', 1), b('tool', 2.5)); note(s, lab('j0', 'your rule, in its window', 'top')); } },
        { say: 'It replies. The door screen doesn’t show the number, and your must-never became a test. The rule is in this thread’s window now. Lesson 5 shows what happens to it there.', moves: [{ to: 'path', path: fromJob(0, 2), kind: 'model' }], threads: side([PROMO, D], [BAR, D]), preview: preview('door', 'promo'),
          edit: (s) => { job(s, 0).blocks!.push(b('model', 2)); job(s, 0).lamp = 'ok'; job(s, 0).busy = false; s.tray!.cards[0]!.mark = 'wait'; note(s, lab('j0', 'phone: never at the door', 'top')); } },
      ]),
      log: {
        took: '3m 30s',
        rows: [
          { at: 2, label: n(CHANGED_N, 3), detail: { plain: 'a phone field for promoters; the door page left as it was', technical: 'src/p/[link].tsx, src/promoters.ts, src/promoters/page.tsx', engineer: 'Guest.phone; the door’s query selects name, list and plus-ones only' } },
          { at: 2, label: CHANGED, detail: { plain: 'a test that looks for every guest’s number on the door page', technical: 'src/door.test.ts', engineer: 'door.test.ts: renders /door with seeded guests and fails if any seeded phone number appears' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'all 17 checks pass at phone size', technical: 'npm test: 17 of 17', engineer: 'vitest 13/13; playwright 4/4 @390×844' } },
        ],
      },
      answer: [
        'Promoters now enter a phone number with each guest. It shows on the promoter’s own list and on the Promoters page, never on the door screen.',
        'I added a test that searches the door page for every made-up guest’s number and fails if one appears. All 17 checks pass.',
      ],
      deeper: { level: 'technical', text: 'Steering hands your message to the running turn at once, and needs the provider to support it. A queued message waits for the next turn, and until it sends you can edit it or take it back.' },
      tryIt: { prompt: 'While a thread works, type the next thing it needs and queue it.', t3: 'While an agent works, Enter steers by default; mod+Enter uses the other action and queues the message. Settings → Chat → Follow-up behavior swaps the two.' },
      sources: ['t3code.queueSteer', 't3code.followUpDefault', 't3code.shortcuts.opposite', 't3code.screen.queued', 'harnesses.claudeCode.queue', 'harnesses.codex.queue'],
    },
    {
      title: 'Same folder, same files',
      thread: ROTA,
      fresh: true,
      request: 'Make tonight’s rota: who works the door and the bar, and when. Done when each person can open their own shift on their phone.',
      lede: 'Friday, 13:40. The bar thread is back at work on a follow-up: Bea wants the order list by supplier. You start a third thread for the rota.',
      points: points(floor(2, { windows: [worked(), barWindow()] }), [
        { say: 'You start the rota thread in the current checkout, the same folder the bar thread is working in.', moves: [{ to: 'path', path: toJob(1, 2), kind: 'you' }], threads: side([PROMO, D], [BAR, W], [ROTA, W]), ui: { checkout: { label: CHECKOUT } }, preview: preview('bar', 'ready'),
          edit: (s) => { note(s, lab('j0', 'bar', 'top'), lab('j1', 'rota', 'top')); } },
        { say: 'Both threads change the app’s menu file. Each one leaves its half-done change in the same folder.', moves: [{ to: 'path', path: toFile(floor(2), 1, 1), kind: 'model' }], threads: side([PROMO, D], [BAR, W], [ROTA, W]), preview: preview('bar', 'ready'),
          edit: (s) => { job(s, 1).blocks!.push(b('model', 1), b('tool', 3)); job(s, 0).blocks!.push(b('tool', 2)); s.project!.files = ['', 'bad', '', '', '', '']; note(s, lab('main', 'one folder, one menu file', 'bottom')); } },
        { say: 'Both run their checks, and each fails on the other’s half-done code. The bar page doesn’t even build any more.', moves: [{ to: 'path', path: [...toFile(floor(2), 0, 1)].reverse(), kind: 'bad', ms: 420 }, { to: 'path', path: [...toFile(floor(2), 1, 1)].reverse(), kind: 'bad', ms: 420 }], threads: side([PROMO, D], [BAR, W], [ROTA, W]), preview: preview('bar', 'broken'),
          edit: (s) => { for (const a of s.agents) { a.blocks!.push(b('bad', 2.5)); a.lamp = 'bad'; } note(s, lab('main', 'each fails on the other’s change', 'bottom')); } },
        { say: 'The rota thread finds changes it didn’t make, takes its own back out of the folder, and moves itself to a new worktree: its own copy of the project, on its own branch.', threads: side([PROMO, D], [BAR, W], [ROTA, W]), ui: { checkout: { label: 'rota-tonight', worktree: true, branch: BRANCH } }, preview: preview('bar', 'ready'),
          edit: (s) => { job(s, 1).tree = 'own'; job(s, 1).blocks!.push(b('model', 1), b('tool', 2)); job(s, 1).lamp = 'work'; job(s, 0).lamp = 'work'; s.project!.files = ['', 'edit', '', '', '', '']; note(s, lab([60, 16, 2], 'its own copy', 'bottom')); } },
        { say: 'Now each thread’s checks see only its own changes, and both pass. Bringing the two branches back together is a later lesson.', moves: [{ to: 'path', path: fromJob(1, 2), kind: 'model' }], threads: side([PROMO, D], [BAR, D], [ROTA, D]), preview: preview('rota', 'ready'),
          edit: (s) => { for (const a of s.agents) { a.blocks!.push(b('tool', 2), b('model', 2)); a.lamp = 'ok'; a.busy = false; } s.tray!.cards.forEach((c) => { c.mark = 'wait'; }); s.project!.files = ['', 'ok', '', '', '', '']; note(s, lab([60, 16, 2], 'its own copy', 'bottom'), lab('card:j1', 'both pass', 'bottom')); } },
      ]),
      log: {
        took: '6m 05s',
        rows: [
          { at: 1, label: n(CHANGED_N, 2), detail: { plain: 'the rota page, and a Rota link in the menu', technical: 'src/rota.tsx (new), src/nav.tsx', engineer: '+src/rota.tsx (half done); src/nav.tsx: + Rota' } },
          { at: 2, label: RAN, tone: 'bad', detail: { plain: 'the build fails in the bar page, which this job never touched', technical: 'npm test: build failed in src/bar/order.tsx', engineer: 'vite build: src/bar/order.tsx:18 “groupBySupplier” is not defined; not in this thread’s diff' } },
          { at: 3, label: RAN, detail: { plain: 'another thread is changing files in this folder; it takes its own changes back out', technical: 'git status: src/bar/order.tsx changed outside this thread', engineer: 'git status; git diff -- src/rota.tsx src/nav.tsx > /tmp/rota.patch; git checkout -- src/rota.tsx src/nav.tsx' } },
          { at: 3, label: HANDOFF, detail: { plain: 'its own folder and branch, then it carries on there', technical: BRANCH } },
          { at: 4, label: n(CHANGED_N, 2), detail: { plain: 'the rota, finished in its own copy', technical: 'src/rota.tsx, src/nav.tsx', engineer: 'git apply /tmp/rota.patch; rota.tsx: day view and one shift per person' } },
          { at: 4, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'its checks pass at phone size', technical: 'npm test 19 of 19, playwright 2 of 2', engineer: 'vitest 15/15; playwright rota.spec 2/2 @390×844' } },
        ],
      },
      answer: [
        'The rota is at /rota. The day view shows the whole night, and each person finds their own shift by name.',
        `Another thread was changing files in the same folder, so my checks were failing on its work. I took my changes back out of the shared folder and moved this thread to its own worktree on branch ${BRANCH}. I tried it there at phone size with made-up staff. The rota branch is ready to merge whenever you want.`,
      ],
      deeper: { level: 'engineer', text: 'Threads in one checkout share its branch, so T3 Code refuses a branch switch there while any of them is working. A worktree is a second working directory on its own branch. Here the agent moved itself with T3 Code’s handoff tool. Don’t count on that: pick New worktree before you send.' },
      tryIt: { prompt: 'Start the next independent job in its own worktree.', t3: 'In a new thread, choose New worktree under the composer before you send, or press mod+shift+x for the workspace menu.' },
      sources: ['t3code.sameCheckout', 't3code.worktreeHandoff', 't3code.screen.workspace', 't3code.branchPrefix', 't3code.shortcuts.workspace', 't3code.worktrees'],
    },
    {
      title: 'How many at once',
      thread: POST,
      fresh: true,
      request: 'Write tonight’s post for the club’s account: the line-up, doors at 23:00, guest list closes at 00:30. Done when it fits one phone screen and names nobody from the guest list.',
      lede: 'Friday, 14:00. Four threads, three of them done. More threads don’t give you more of yourself.',
      points: points(floor(4, { windows: [worked([b('model', 2)]), worked([b('model', 2)]), worked([b('model', 2)]), barWindow()], lamps: ['ok', 'ok', 'ok', 'work'], cards: ['wait', 'wait', 'wait', 'work'] }), [
        { say: 'Four threads now. Three came back done at about the same time, and each result is yours to read.', moves: [{ to: 'path', path: toJob(3, 4), kind: 'you' }], threads: side([PROMO, D], [BAR, D], [ROTA, D], [POST, W]), ui: { checkout: { label: CHECKOUT } }, preview: preview('rota', 'ready'),
          edit: (s) => { note(s, lab('tray', 'three to read', 'bottom')); } },
        { say: 'There is one of you. While you read one result, the other two wait.', threads: side([PROMO, D], [BAR, D], [ROTA, D], [POST, W]), preview: preview('rota', 'ready'),
          edit: (s) => { s.you = attendSpot(0, 4); s.tray!.cards[0]!.mark = 'work'; job(s, 3).blocks!.push(b('model', 1), b('tool', 2)); note(s, lab('tray', 'two results wait for you', 'bottom')); } },
        { say: 'A title like “fix” or “New thread” means opening each thread to find out what it is. A title that says the job saves you that.', threads: side([PROMO, D], [BAR, D], [ROTA, D], [POST, W]), preview: preview('rota', 'ready'),
          edit: (s) => { s.you = attendSpot(0, 4); s.tray!.cards[0]!.mark = 'ok'; job(s, 3).blocks!.push(b('model', 1), b('tool', 1.5)); note(s, lab('j0', '“fix”', 'top'), lab('j3', '“Tonight’s post”', 'right')); } },
        { say: 'A result that carries its proof is quick to read. A bare “Done.” takes longer. Lesson 8 comes back to that.', moves: [{ to: 'path', path: fromJob(3, 4), kind: 'model' }], threads: side([PROMO, D], [BAR, D], [ROTA, D], [POST, D]), preview: preview('post', 'ready'),
          edit: (s) => { s.you = [0, 104]; s.tray!.cards[0]!.mark = 'ok'; job(s, 3).blocks!.push(b('model', 2)); job(s, 3).lamp = 'ok'; job(s, 3).busy = false; s.tray!.cards[3]!.mark = 'wait'; note(s, lab('j3', 'done, with proof', 'right')); } },
      ]),
      log: {
        took: '1m 40s',
        rows: [
          { at: 0, label: readRow('src/lineup.ts'), detail: { plain: 'tonight’s line-up', technical: 'three acts, 23:00 to 05:00' } },
          { at: 1, label: searchRow('guest', 'src'), detail: { plain: 'the guest lists, to keep every name out of the post', technical: 'src/guests.ts, src/promoters.ts' } },
          { at: 2, label: CHANGED, detail: { plain: 'the post, as a file you can copy', technical: 'posts/tonight.md (new)' } },
        ],
      },
      answer: [
        'Here’s tonight’s post: the line-up, doors at 23:00, guest list closes at 00:30. It’s 61 words and fits one phone screen. I checked it against every name on tonight’s lists, and none appear.',
      ],
      deeper: { level: 'technical', text: 'An observation from the guide’s own use, not a measurement: past three to five parallel threads, the agents start waiting on you and review quality drops.' },
      tryIt: { prompt: 'Name each thread for its job.', t3: 'T3 Code titles a thread from the conversation. Press F2 on a thread in the sidebar to rename it, or choose Regenerate title from its menu.' },
      sources: ['observations.experience.parallelThreads', 't3code.threadTitles', 't3code.screen.statuses'],
    },
  ],
};

export default lesson4;
