/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import type { SceneState, Label, P3, XY, Kind } from '../../journey/picture';
import { route, SPOT, BUS_Y, USERS } from '../../journey/picture';
import { ship, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { claims } from '../../data/claims';
import { A, CHANGED, CHANGED_N, FIRST, RAN, RAN_N, atYou, b, n, points, push, status, type Lesson, type Move } from '../content';

// ---------- lesson 16: other people ----------
// Week 6, Wednesday. Staff use the app on their phones every night; now changes reach them.
// From v1's people.ts: a change waits at the gate before main as a pull request, a reviewer reads
// it there, and the people beyond main are who it reaches. The pull request number, the staff and
// every time are made up.

const [READ_N] = t3code.screen.workLogGroups.value;
const REQUEST = status('Request');
const staff = (stage: string, path: string, url?: string): Preview => ({ app: 'staff', stage, url: url ?? `localhost:4321${path}` });
/** A made-up preview address behind a one-time code. */
const PREVIEW_URL = 'stock-preview.lantern-staff.example';

const GATE_X = SPOT.mgate[0] - 12;
const BEA = USERS[1]!;
/** In the review part, the author thread stands beside the gate before main; the agent in front is the reviewer. */
const REVIEWER: XY = [64, BUS_Y - 44];
/** The private gate in front of the preview: between main and the people beyond it. */
const ACCESS: XY = [336, BUS_Y];
/** Bea, on her own phone, beyond the private gate (16.3 only). */
const BEA_AWAY: XY = [392, BUS_Y];

type Who = 'reviewer' | 'users' | 'access';
const frame = (who: Who[]): Label[] => [
  lab('you', 'you', 'left'),
  termLabel('a0', 'agent', 'top', 'the agent'),
  termLabel([GATE_X - 50, BUS_Y, 0], 'pull-request', 'bottom', 'pull request'),
  termLabel('main', 'main', 'bottom'),
  ...(who.includes('users') ? [lab('user0', 'staff', 'top')] : []),
  ...(who.includes('access') ? [lab('bea', 'Bea’s phone', 'top')] : []),
];
function floor(who: Who[]): SceneState {
  const s = ship(0, { people: who.includes('users') ? ['users'] : [], lead: [FIRST], labels: frame(who) });
  s.agents[0]!.tree = 'own';
  if (who.includes('reviewer')) s.agents.push({ id: 'r0', at: REVIEWER, scale: 0.7, blocks: [], model: 'b' });
  if (who.includes('access')) {
    s.gates!.push({ id: 'access', at: ACCESS, axis: 'x', lamp: 'off' });
    s.people = [{ id: 'bea', at: BEA_AWAY, who: 'user' }];
    s.tracks = [...(s.tracks ?? []), [[SPOT.main[0] + 46, BUS_Y], [BEA_AWAY[0] - 10, BUS_Y]]];
  }
  s.focus = ['you', [-36, 104, 0] as P3, 'a0', 'mgate', 'main', ...(who.includes('access') ? [[BEA_AWAY[0] + 10, BEA_AWAY[1], 30] as P3, [BEA_AWAY[0], BEA_AWAY[1] + 14, 0] as P3] : [[USERS[0]![0] + 8, USERS[0]![1], 20] as P3, [USERS[2]![0] + 8, USERS[2]![1] + 8, 0] as P3])];
  return s;
}
const note = (s: SceneState, who: Who[], ...more: Label[]) => { s.labels = [...frame(who), ...more]; };
const mgate = (s: SceneState, lamp: 'off' | 'work' | 'wait' | 'ok' | 'bad') => { s.gates!.find((g) => g.id === 'mgate')!.lamp = lamp; };
const waiting = (s: SceneState, kind: Kind = 'model') => { s.rest = [{ id: 'pr', at: [GATE_X, BUS_Y], b: kind }]; };

const toGate: Move = { to: 'path', path: route.agentToMgate(), kind: 'model', ms: 640 };
const intoMain: Move = { to: 'path', path: route.mgateToMain({ at: SPOT.main }), kind: 'model', ms: 420 };
const reviewRead: Move = { to: 'path', path: [...route.agentToMgate()], kind: 'tool', ms: 640 };
const toAuthor: Move = { to: 'path', path: [[0, 94], [0, -20], [0, BUS_Y], [REVIEWER[0], BUS_Y], [REVIEWER[0], REVIEWER[1] + 14]], kind: 'bad', ms: 900 };
const toBea = (kind: Kind): Move => ({ to: 'path', path: [[SPOT.main[0] + 46, BUS_Y], [BEA[0] - 10, BEA[1]]], kind, ms: 520 });
const beaToAccess: Move = { to: 'path', path: [[BEA_AWAY[0] - 10, BEA_AWAY[1]], [ACCESS[0] + 8, ACCESS[1]]], kind: 'you', ms: 520 };
const beaToAgent: Move = { to: 'path', path: [[BEA[0] - 10, BEA[1]], [BEA[0] - 10, 40], [30, 40], [14, 18]], kind: 'you', ms: 900 };

const SWAP = 'Swap shifts';
const W: P3 = [30, -30, 34];

const lesson16: Lesson = {
  id: 'l16',
  parts: [
    {
      title: 'A pull request, not a push',
      thread: SWAP,
      fresh: true,
      request: 'Staff can ask to swap a shift with someone, and the other person accepts or declines on their phone. Done when you’ve tried it at phone size with made-up staff, and it goes up as a pull request with what you checked in its description.',
      lede: 'Week 6, Wednesday 11:00. Sami, Bea and the bar staff open the app on their phones every night. A change you merge reaches them that night.',
      points: points(floor(['users']), [
        { say: 'It works in its own worktree, on its own branch. Main stays exactly as staff use it tonight.', moves: [{ to: 'agent' }], preview: staff('swap', '/rota'),
          edit: (s) => { push(s, b('you', 2.6), b('model', 1), b('tool', 3), b('model', 1), b('tool', 2)); A(s).lamp = 'work'; note(s, ['users'], lab(W, 'its own copy, its own branch', 'right')); } },
        { say: 'It runs the checks and tries a swap at phone size: Bea asks Sami, Sami accepts, both shifts move.', preview: staff('swap', '/rota'),
          edit: (s) => { push(s, b('model', 1), b('tool', 3)); A(s).lamp = 'ok'; note(s, ['users'], lab(W, 'tried it: 21 checks pass', 'right')); } },
        { say: 'It commits, pushes and opens a pull request. T3 Code writes the description from the change and from the work in the thread, including the checks it ran.', moves: [toGate], preview: staff('swap', '/rota'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1)); waiting(s); mgate(s, 'wait'); note(s, ['users'], lab('mgate', 'waits for a reader', 'top')); } },
        { say: 'It replies with the link. Nothing reaches main, or the staff’s phones, until someone merges it.', moves: [{ to: 'you', kind: 'model' }], preview: staff('swap', '/rota'),
          edit: (s) => { push(s, b('model', 2)); waiting(s); mgate(s, 'wait'); A(s).lamp = 'off'; note(s, ['users'], lab('mgate', 'waits for a reader', 'top'), atYou('pull request #41')); } },
      ]),
      log: {
        took: '6m 10s',
        rows: [
          { at: 0, label: n(CHANGED_N, 4), detail: { plain: 'swap requests on the rota, with Accept and Decline', technical: 'src/rota/swap.ts (new), src/rota.tsx, src/rota/swap.test.ts', engineer: 'branch t3/shift-swaps; swap.ts: request → accept|decline; both shifts move in one write' } },
          { at: 1, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'every check, and a swap tried at phone size', technical: 'npm test 21/21; rota.spec @390' } },
          { at: 2, label: RAN, detail: { plain: 'committed, pushed, opened a pull request', technical: 'git push -u origin t3/shift-swaps; gh pr create', engineer: 'gh pr create --title "Shift swaps" --body-file .pr.md' } },
        ],
      },
      answer: [
        'Shift swaps are on the rota page, in pull request #41. Staff ask from their own shift; the other person gets Accept and Decline on their phone.',
        'Tried at 390 px with made-up staff: Bea asked Sami, Sami accepted, both shifts moved. All 21 checks pass; the description lists them.',
      ],
      deeper: { level: 'technical', text: 'A pull request is a proposal to merge a branch into main. Your host runs its checks there, and someone reads it before it lands. Merged, it reaches every phone that opens the app.' },
      tryIt: { prompt: '[The change]. Work on a branch and open a pull request. Put what you tried and what you checked in the description.', t3: 'Use the thread’s Git actions to commit, push and create the pull request; Pull requests lists them for review.' },
      sources: ['t3code.worktrees', 't3code.prText', 't3code.branchPrefix', 't3code.githubAuth'],
    },
    {
      title: 'Someone who didn’t write it',
      thread: 'Review #41',
      fresh: true,
      request: 'Review pull request #41. Report only what affects correctness or security; skip style.',
      lede: 'Wednesday 12:00, a new thread. The author thread is sure of its work. A reviewer that never saw its reasoning reads the change cold.',
      points: points(floor(['users', 'reviewer']), [
        { say: 'A fresh reviewer reads the change. Nothing of the author’s reasoning is in its window: only your request, the diff and the project.', moves: [{ to: 'agent' }, reviewRead], preview: staff('swap', '/rota'),
          edit: (s) => { push(s, b('you', 1.4), b('model', 1), b('tool', 6)); A(s).model = 'b'; A(s).tree = false; A(s).lamp = 'work'; waiting(s); mgate(s, 'work'); note(s, ['users', 'reviewer'], lab([-30, -14, 8] as P3, 'the reviewer: didn’t write it', 'left')); } },
        { say: 'It finds one thing: a swap request trusts the shift it’s given. Bea can put Sami’s shift up for a swap without Sami.', moves: [{ to: 'you', kind: 'bad' }], preview: staff('swap-open', '/rota'),
          edit: (s) => { push(s, b('model', 1), b('bad', 2)); A(s).model = 'b'; A(s).tree = false; A(s).lamp = 'bad'; waiting(s, 'bad'); mgate(s, 'bad'); note(s, ['users', 'reviewer'], lab('mgate', 'anyone’s shift', 'top'), atYou('one finding')); } },
        { say: 'You send the finding to the author thread. It checks, on every swap, that the shift belongs to whoever asks, adds a test that tries, and pushes.', moves: [toAuthor], preview: staff('swap', '/rota'),
          edit: (s) => { A(s).model = 'b'; A(s).tree = false; A(s).lamp = 'off'; s.agents[1]!.blocks = [FIRST, b('bad', 1.4), b('model', 1), b('tool', 2)]; s.agents[1]!.lamp = 'ok'; waiting(s); mgate(s, 'ok'); note(s, ['users', 'reviewer'], lab('r0', 'the author thread: fixed', 'right'), lab('mgate', 'checks pass', 'top')); } },
        { say: 'You read it once more, through the review guide’s stops if you like, and merge. Tonight it’s on every staff phone.', moves: [intoMain, toBea('model')], preview: staff('swap', '/rota'),
          edit: (s) => { A(s).model = 'b'; A(s).tree = false; s.rest = []; mgate(s, 'ok'); s.project!.commits = [...(s.project!.commits ?? []), 'ok']; note(s, ['users', 'reviewer'], lab('main', 'merged', 'top')); } },
      ]),
      log: {
        took: '2m 30s',
        rows: [
          { at: 0, label: n(READ_N, 4), detail: { plain: 'the change and what it touches', technical: 'gh pr diff 41; src/rota/swap.ts, src/auth.ts…' } },
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'tried it: Bea can request a swap on Sami’s shift', technical: 'a test as Bea with Sami’s shift id: accepted', engineer: 'POST /rota/swap {shiftId: sami-fri} as bea → 200' } },
        ],
      },
      answer: [
        'One finding, security: the swap request trusts the shift id from the page. Any signed-in staff member can put someone else’s shift up for a swap, and if the other person accepts, the shift moves without its owner. Check that the shift belongs to the person asking.',
        'Nothing else affects correctness.',
      ],
      deeper: { level: 'engineer', text: 'A reviewer asked to find problems will always find something; asking for correctness and security only keeps the list worth reading. The same model as a reviewer is a fresh pair of eyes, not a smarter one: it helps because it hasn’t seen the author’s reasoning.' },
      tryIt: { prompt: 'Review [the pull request]. Report only what affects correctness or security, each with how to reproduce it. Skip style.', t3: 'Start the review in a new thread so it doesn’t share the author’s window. With Review guides on, a pull request’s Guide tab walks you through it in reading order.' },
      sources: ['harnesses.claudeCode.codeReview', 'harnesses.claudeCode.reviewerAlwaysFinds', 'harnesses.claudeCode.sameModelReviewer', 't3code.reviewGuides'],
    },
    {
      title: 'Show it before it ships',
      thread: 'Bar stock',
      fresh: true,
      request: 'Bea should try the new stock page on her phone tonight, before it goes live. It must never be public. Done when only the addresses I allow can open it.',
      lede: 'Wednesday 17:00. The stock page is on a branch. Bea knows the bar better than anyone, and she isn’t at your laptop.',
      points: points(floor(['access']), [
        { say: 'The preview on your laptop reaches your laptop. Bea’s phone is somewhere else, and can’t open it.', moves: [{ to: 'agent' }], preview: staff('stock', '/stock'),
          edit: (s) => { push(s, b('you', 2.4)); A(s).lamp = 'work'; note(s, ['access'], atYou('preview: your laptop only', 'left')); } },
        { say: 'It deploys the branch to a preview address and puts a one-time code in front of it. Only the email addresses you allow get a code.', moves: [{ to: 'path', path: [...route.agentToMgate(), ...route.mgateToMain({ at: SPOT.main }), [ACCESS[0] - 8, ACCESS[1]]], kind: 'model', ms: 900 }], preview: staff('gate', '/', PREVIEW_URL),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 1), b('tool', 2)); s.gates!.find((g) => g.id === 'access')!.lamp = 'wait'; note(s, ['access'], lab('access', 'email, then a code', 'bottom')); } },
        { say: 'Bea enters her email, gets a code, and she’s in. Anyone else gets nothing.', moves: [beaToAccess], preview: staff('gate', '/', PREVIEW_URL),
          edit: (s) => { s.gates!.find((g) => g.id === 'access')!.lamp = 'ok'; note(s, ['access'], lab('access', 'only the emails you allow', 'bottom')); } },
        { say: 'It replies. It didn’t use GitHub Pages: a Pages site is public even when its repository is private.', moves: [{ to: 'you', kind: 'model' }], preview: staff('stock', '/stock', PREVIEW_URL),
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'ok'; s.gates!.find((g) => g.id === 'access')!.lamp = 'ok'; note(s, ['access'], lab('access', 'only the emails you allow', 'bottom'), atYou('the link for Bea')); } },
      ]),
      log: {
        took: '3m 50s',
        rows: [
          { at: 1, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'deployed the branch to a preview address, with a one-time code in front', technical: 'wrangler deploy --env preview; an access policy for two emails', engineer: 'Cloudflare Access: one-time PIN, allow you@…, bea@… (made-up addresses)' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'checked an address not on the list is refused', technical: 'curl the preview without a session: redirected to sign-in' } },
        ],
      },
      answer: [
        'The stock page is on a preview address with a one-time code in front. Only your email and Bea’s get a code; here is the link for her.',
        'For your own devices, tailscale serve would do, but Bea’s phone isn’t on your tailnet. I didn’t use GitHub Pages: its sites are public, even from a private repository.',
      ],
      deeper: { level: 'technical', text: `Cloudflare Access is free for up to ${claims.hosting.cloudflareAccess.value} users and can put an email one-time code in front of a site. Tailscale’s Personal plan is free for up to ${claims.hosting.tailscalePersonal.value} users, and tailscale serve shares a local port with your own devices only.` },
      tryIt: { prompt: 'Let [who] try [the page] on their phone before it goes live. It must never be public. Done when only the addresses I allow can open it.', t3: 'Ask in the thread that built it; the agent can set up the preview and the access rule with your hosting account.' },
      sources: ['claims.hosting.cloudflareAccess', 'claims.hosting.tailscaleServe', 'claims.hosting.tailscalePersonal', 'claims.hosting.githubPagesPublic'],
    },
    {
      title: 'Her question waits for you',
      thread: 'Bar stock',
      request: 'Can it show when the last delivery came?',
      lede: 'Wednesday 18:30. You shared the stock thread with Bea through a guest link. The message below is hers, not yours.',
      points: points(floor(['users']), [
        { say: 'Bea follows the thread in her browser and writes to it. Her message waits at the end of the thread, and its row in the sidebar reads Request.', moves: [], status: REQUEST, preview: staff('stock', '/stock', PREVIEW_URL),
          edit: (s) => { A(s).blocks = [FIRST, b('you', 2.4), b('model', 1), b('tool', 2), b('model', 1), b('tool', 2), b('model', 2)]; s.rest = [{ id: 'bea', at: [30, 40], b: 'you' }]; note(s, ['users'], lab([30, 40, 6] as P3, 'Bea’s message: waits', 'right')); } },
        { say: 'It runs only when you choose Send, and then with this thread’s permission mode. Read it the way you’d read anything pasted from a chat.', moves: [{ to: 'path', path: [[30, 40], [14, 18]], kind: 'you', ms: 520 }], preview: staff('stock', '/stock', PREVIEW_URL),
          edit: (s) => { s.rest = []; push(s, b('you', 1)); A(s).lamp = 'work'; note(s, ['users'], lab('tank:a0', 'you chose Send', 'left')); } },
        { say: 'She sees everything the agent reads or prints in this thread. That’s why this thread never opened the guest list.', moves: [{ to: 'tool', tool: 'edit', back: 'tool' }, { to: 'you', kind: 'model' }], preview: staff('stock-delivery', '/stock', PREVIEW_URL),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 2)); A(s).lamp = 'ok'; note(s, ['users'], lab('user0', 'she sees the thread', 'top')); } },
      ]),
      log: {
        took: '1m 40s',
        rows: [
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'the last delivery on each item', technical: 'src/stock.tsx, src/bar/deliveries.ts' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'stock checks pass, and the preview is updated', technical: 'npm test -- stock: 5 of 5; wrangler deploy --env preview' } },
        ],
      },
      answer: [
        'The stock page now shows when each item last came in, from the delivery notes on /bar/deliveries. Lime: Tuesday 10:40.',
        'The preview has it now, behind the same code.',
      ],
      deeper: { level: 'technical', text: 'A guest link is for one person, works in one browser and lasts 24 hours. Guests don’t see diffs and can’t change the thread; they can see what the agent read or printed.' },
      tryIt: { prompt: 'Before I share this thread: list anything you read or printed here that shouldn’t be seen outside the club.', t3: 'Right-click a thread and choose Share with guest (a beta in Settings → Labs, with T3 Connect). Their messages wait for your Send or Dismiss.' },
      sources: ['t3code.guestLinks', 't3code.screen.statuses'],
    },
  ],
};

export default lesson16;
