/* Guide v2 lesson 13, A fleet: see v2/content.ts for the types and lessons/ch3.ts for the shared pictures. */
import { lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { route, reverse, type SceneState } from '../../journey/picture';
import { models } from '../../data/models';
import { observations } from '../../data/observations';
import { A, CHANGED_N, FIRST, RAN, b, n, points, push, searchRow, type Lesson, type Move, type SubRow } from '../content';
import { H, S, all, app, desk, fillHelper, fromHelper, helperToMain, lamp, note, toHelper } from './ch3';

// ---------- lesson 13: a fleet ----------
// Friday 12:00, eleven hours before the birthday night. Made up: pages, helpers, minutes, percentages.

const HAIKU = models['claude-haiku-5-5'].name.replace(/^Claude /, '');
const OPUS = models['claude-opus-5-5'].name.replace(/^Claude /, '');
const N = 12;
const EVERY = Array.from({ length: N }, (_, i) => i);
const CHECK = 'Check every page before tonight';
const checks = (stage: string) => app('pagecheck', stage);
const floor = (meter: number, mixed = true) => desk(N, { mgate: true, mixed, who: 'lead', meter, lead: [FIRST], labels: [termLabel('project', 'main'), termLabel('mgate', 'check')] });
const out = (kind: 'model' | 'you' | 'bad' = 'model') => all(...EVERY.map((i) => toHelper(i, kind)));
const back = (kind: 'sum' | 'bad' = 'sum') => all(...EVERY.map((i) => fromHelper(i, kind)));
const toMgate: Move = { to: 'path', path: route.agentToMgate(), kind: 'model' };
const fromMgate = (kind: 'bad' | 'tool'): Move => ({ to: 'path', path: reverse(route.agentToMgate()), kind });
const PAGES = [['/door', '/door/late'], ['/door/scan', '/door/close'], ['/tickets', '/sales'], ['/bar', '/bar/order'], ['/rota', '/rota/me'], ['/promoters', '/p/[link]'], ['/p/[link]/edit', '/i/ana'], ['/guests', '/guests/import'], ['/do-not-admit', '/practice'], ['/login', '/settings'], ['/', '/about'], ['/checks', '/404']] as const;
/** The twelve helpers' rows: each checks two pages. `done` is the point it reports back at. */
const fleetRows = (done: (i: number) => number, model: string, bad?: number): SubRow[] => PAGES.map(([a, c], i) => ({
  name: `Check ${a} and ${c}`,
  doing: 'light, dark, keyboard',
  detail: i === bad ? { plain: 'raised contrast on the door', technical: `${a}: do-not-admit tag #d93025 → #e8710a` } : { plain: i % 3 === 0 ? 'fixed one thing' : 'both pass', technical: i % 3 === 0 ? `${a}: focus ring added` : 'light, dark, keyboard: pass' },
  done: done(i),
  model,
}));
const busy = (s: SceneState, on: boolean) => { for (const i of EVERY) { lamp(s, i, on ? 'work' : 'off'); if (on) fillHelper(s, i, b('model', 2)); else H(s, i).blocks = []; } };
const reports = (s: SceneState) => { A(s).blocks = [FIRST, b('you', 3), b('tool', 2), b('model', 1.5), ...EVERY.map(() => b('sum', 1.2)), b('model', 2)]; };
const { claim: runaway } = observations.estimates['theo-2026-11-16-council-runaway'].fact;
void runaway;

const lesson13: Lesson = {
  id: 'l13',
  parts: [
    {
      title: 'Twelve at once',
      thread: CHECK,
      fresh: true,
      request: 'Before tonight, check every page at phone size, in light and dark, and by keyboard. Fix what’s broken. Use small, fast helpers for the checking. Done when every page passes and you’ve shown me the pages you changed.',
      lede: 'Friday 12:00, eleven hours before the birthday night. The app has 24 pages now, and each needs checking three ways.',
      points: points(floor(0.66), [
        { say: 'The lead lists the app’s pages: 24 of them, three checks each.', moves: [{ to: 'agent' }], ui: { limits: [{ label: 'Weekly', left: 66 }], context: 3 }, preview: checks('waiting'),
          edit: (s) => { push(s, b('you', 3), b('tool', 2)); A(s).lamp = 'work'; note(s, lab('tank:a0', '24 pages × 3 checks', 'bottom')); } },
        { say: `It starts twelve helpers on ${HAIKU}, a small, fast model, with two pages each.`, moves: [out()], preview: checks('waiting'),
          edit: (s) => { push(s, b('model', 1.5)); busy(s, true); A(s).lamp = 'wait'; note(s, lab('w4', `12 helpers on ${HAIKU}`, 'right')); } },
        { say: 'Each checks its two pages in light, in dark and by keyboard, and fixes what it finds.', preview: checks('running'),
          edit: (s) => { for (const i of EVERY) fillHelper(s, i, b('tool', 4), b('model', 1)); for (const i of [0, 3, 5, 8]) lamp(s, i, 'ok'); note(s, lab('w4', 'working side by side', 'right')); } },
        { say: 'Nine minutes later all twelve are back, with three lines each. Nine pages needed a fix.', moves: [back()], preview: checks('checked'),
          edit: (s) => { reports(s); busy(s, false); A(s).lamp = 'work'; s.meters![0]!.level = 0.61; note(s, lab('tank:a0', '12 reports, 3 lines each', 'bottom')); } },
        { say: 'It replies. Nothing is on main yet: the check in front of main comes next.', moves: [{ to: 'you', kind: 'model' }], ui: { limits: [{ label: 'Weekly', left: 61 }] }, preview: checks('checked'),
          edit: (s) => { A(s).lamp = 'off'; note(s); } },
      ]),
      log: {
        took: '9m 40s',
        rows: [
          { at: 0, label: searchRow('page', 'src/pages'), detail: { plain: '24 pages', technical: '24 routes in src/pages' } },
          { at: 1, label: '', agents: fleetRows((i) => (i % 4 === 0 ? 2 : 3), HAIKU) },
        ],
      },
      answer: [
        'All 24 pages are checked at phone size, in light, in dark and by keyboard. Fifteen passed as they were, and nine needed a fix: mostly focus rings and contrast. The browser panel shows every page and what changed.',
        'Nothing is on main yet. Next I’d run the door check and every test on all of it together.',
      ],
      deeper: { level: 'technical', text: `Anthropic’s cost advice for Claude Code is to set model: haiku for simple subagent tasks. One public demo, as described by a YouTuber, had ${OPUS} directing ten Haiku subagents: 86 attempts in under a minute for $0.14, against 25 attempts in three and a half minutes for $0.47 alone. That is one demo, not a measurement.` },
      tryIt: { prompt: 'Check [each page or file] with a helper each, on a small model. Each sends back three lines: what it checked, what it fixed, what it couldn’t.', t3: 'The subagents row counts them as they run: working, done and failed. Expand it for each helper’s line.' },
      sources: ['harnesses.claudeCode.smallSubagentModel', 'harnesses.claudeCode.subagentModel', 't3code.screen.subagentStates', 'observations.estimates.theo-2026-10-09-haiku-fanout.fact'],
    },
    {
      title: 'One plan pays for all of them',
      thread: CHECK,
      request: `Run the checks once more with every helper on ${OPUS}, to be sure.`,
      lede: 'Friday 13:00. The same twelve jobs on the big model.',
      replyAt: 3,
      points: points(floor(0.61, false), [
        { say: `Twelve helpers on ${OPUS} now. Each sends its own requests, and they all come out of the same plan as the lead.`, ui: { context: 12 }, moves: [{ to: 'agent' }, out()], preview: checks('checked'),
          edit: (s) => { reports(s); push(s, b('you', 2)); busy(s, true); A(s).lamp = 'wait'; note(s, lab('meter:m0', '12 helpers, one plan', 'bottom')); } },
        { say: 'The plan drains much faster than it did with the small helpers.', ui: { limits: [{ label: 'Weekly', left: 22 }] }, preview: checks('checked'),
          edit: (s) => { for (const i of EVERY) fillHelper(s, i, b('tool', 5), b('model', 1.5)); s.meters![0]!.level = 0.22; note(s, lab('meter:m0', 'draining fast', 'bottom')); } },
        { say: 'Nine helpers in, the plan runs out. The provider stops the thread, and its row says Limited.', status: S.limited, ui: { limits: [{ label: 'Weekly', left: 0 }] }, preview: checks('checked'),
          edit: (s) => { s.meters![0]!.level = 0; s.meters![0]!.lamp = 'bad'; for (const i of [9, 10, 11]) lamp(s, i, 'bad'); for (const i of EVERY.slice(0, 9)) lamp(s, i, 'ok'); A(s).lamp = 'bad'; note(s, lab('meter:m0', 'out of usage', 'bottom')); } },
        { say: 'You can resume at reset, which schedules the rest, or switch to another provider. After the reset it finishes, and finds nothing new.', moves: [all(toHelper(9), toHelper(10), toHelper(11)), back(), { to: 'you', kind: 'model' }], ui: { limits: [{ label: 'Weekly', left: 90 }] }, preview: checks('checked'),
          edit: (s) => { reports(s); busy(s, false); s.meters![0]!.level = 0.9; s.meters![0]!.lamp = undefined; A(s).lamp = 'off'; note(s, lab('meter:m0', 'after the reset', 'bottom')); } },
      ]),
      log: {
        took: '38m 20s',
        rows: [
          { at: 0, label: '', agents: fleetRows((i) => (i < 9 ? 2 : 3), OPUS) },
        ],
      },
      answer: [
        `Done after the reset. On ${OPUS}, all 24 pages pass too, and it found nothing the small helpers missed.`,
        'The run stopped once on the usage limit with three helpers left, and resumed at the reset.',
      ],
      deeper: { level: 'technical', text: 'Every subagent sends its own requests and draws on the same plan as the main conversation. Codex says its subagent workflows use more tokens than comparable single-agent runs, and caps how many spawned agents run at once per session. A thread stopped on a limit can resume at reset, or switch to another provider instance.' },
      tryIt: { prompt: 'Use the small model for checks with clear answers. Save the big model for the judgement calls.', t3: 'Thread details show Usage limits. A Limited row offers Resume at reset.' },
      sources: ['plans.claude.limits.subagentsDraw', 'harnesses.claudeCode.subagentUsage', 'harnesses.codex.subagents', 'harnesses.codex.maxThreads', 't3code.limited', 't3code.screen.usageLimits', 'harnesses.claudeCode.smallSubagentModel'],
    },
    {
      title: 'Twelve reports, one reader',
      thread: CHECK,
      request: 'Before main, run the door check and every test on all of it together.',
      lede: 'Friday 14:00. Twelve helpers changed nine pages. One check looks at all of it.',
      points: points(floor(0.9), [
        { say: 'Twelve reports already sit in the lead’s window. They’re short because the brief asked for three lines. Long ones would fill it.', moves: [{ to: 'agent' }], ui: { context: 24 }, preview: checks('checked'),
          edit: (s) => { reports(s); push(s, b('you', 2)); A(s).lamp = 'work'; note(s, lab('tank:a0', '12 reports in its window', 'bottom')); } },
        { say: 'The check in front of main tries every page again. The door fails: the do-not-admit tag is orange, not red.', moves: [toMgate, fromMgate('bad')], preview: checks('red'),
          edit: (s) => { push(s, b('bad', 1.6)); s.gates![0]!.lamp = 'bad'; note(s, lab('project', 'door: do-not-admit not red', 'bottom')); } },
        { say: 'The door helper’s brief said “fix contrast”. It didn’t say that red at the door means do not admit. The check did.', preview: checks('red'),
          edit: (s) => { lamp(s, 0, 'bad'); note(s, lab('w0', 'its brief: “fix contrast”', 'right')); } },
        { say: 'Sent back with the rule, fixed, checked again, and only then merged. It replies.', moves: [toHelper(0, 'bad'), fromHelper(0), helperToMain(floor(0.9), 0), { to: 'you', kind: 'model' }], preview: checks('done'),
          edit: (s) => { lamp(s, 0, 'off'); s.gates![0]!.lamp = 'ok'; s.project!.commits = ['ok']; push(s, b('sum', 1), b('model', 2)); A(s).lamp = 'ok'; note(s, lab('project', 'every page passes', 'bottom')); } },
      ]),
      log: {
        took: '7m 15s',
        rows: [
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'the door check: the do-not-admit tag isn’t red', technical: 'npm run door-check: “do-not-admit is red” failed (#e8710a)' } },
          { at: 3, label: '', agents: [{ name: 'Fix /door: keep do-not-admit red, keep the contrast', doing: 'fixing /door with the rule', detail: { plain: 'red again, darker text on it', technical: '#d93025 restored · text #fff → contrast 4.9:1' }, done: 3, model: HAIKU }] },
          { at: 3, label: n(CHANGED_N, 9), detail: { plain: 'the nine fixed pages, merged into main', technical: 'git merge: 9 pages' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'the door check and every test, on main', technical: 'npm test 52 of 52 · door-check 4 of 4' } },
        ],
      },
      answer: [
        'Every page passes, and the nine fixes are on main. The check in front of main caught one helper’s fix: it raised the contrast on the door by turning the do-not-admit red into orange. Red at the door means do not admit, so it’s red again, with darker text for contrast.',
        'All 52 tests and the door check pass on main.',
      ],
      deeper: { level: 'engineer', text: 'A helper knows its brief. The project’s rules reach it only if the brief carries them or the harness loads them, and the check in front of main is the one place every rule gets tested on every change. Keep reports short and structured; the lead reads every one of them on every turn after.' },
      tryIt: { prompt: 'Before anything merges, run every check on all of the helpers’ work together. Send failures back with the rule they broke.', t3: 'Expand the red Ran command row to see which page failed the check, and why.' },
      sources: ['harnesses.claudeCode.subagentFreshContext', 'claims.lessons.toolCallEvidence', 't3code.screen.contextWindow'],
    },
    {
      title: 'More isn’t always faster',
      thread: CHECK,
      request: 'Which pages should I look at myself?',
      lede: 'Friday 15:00. Twenty-four pages, and one of you.',
      replyAt: 1,
      points: points(floor(0.9), [
        { say: 'You can’t read every change twelve helpers made. So you ask what to read.', ui: { context: 26 }, moves: [{ to: 'agent' }], preview: checks('done'),
          edit: (s) => { reports(s); s.project!.commits = ['ok']; push(s, b('you', 1.4)); A(s).lamp = 'work'; note(s, lab('you', 'one reader', 'right')); } },
        { say: 'It picks the six pages that changed most, and marks them in the browser panel.', moves: [{ to: 'you', kind: 'model' }], preview: checks('done'),
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'off'; note(s, lab('tank:a0', 'six to look at', 'bottom')); } },
        { say: 'A fleet suits many small jobs that don’t touch each other and each have a check, like one page each.', preview: checks('done'),
          edit: (s) => { busy(s, true); for (const i of EVERY) lamp(s, i, 'ok'); note(s, lab('w4', 'small, separate, checked', 'right')); } },
        { say: 'Without a check, or on one big question, more agents make more work. One public case, an observation: a review loop that started over 600 subagents and grew a planned 1,000-line change past 20,000 lines.', preview: checks('done'),
          edit: (s) => { busy(s, false); note(s, lab('tank:a0', 'observation: one case', 'bottom')); } },
      ]),
      log: { took: '40s', rows: [] },
      answer: [
        'Look at these six yourself: /door, /tickets, /bar/order, /p/[link], /i/ana and /guests/import. They changed most, and most of them are pages guests, Sami or Bea use tonight. Each is marked “look” in the browser panel, with what changed.',
        'The other 18 pages pass every check. Their changes were small: focus rings and contrast.',
      ],
      deeper: { level: 'technical', text: 'An observation, not a measurement: one developer described a council of reviewing models that wouldn’t agree, where the coding agent kept going for 50 or more loops, one thread started more than 600 subagents, and a planned 1,000-line change grew past 20,000 lines. In the guide’s own use, past three to five parallel threads, review quality drops.' },
      tryIt: { prompt: 'Which of these changes should I look at myself? Pick the few that matter most, and say why.', t3: 'Open the pages it names in the browser panel and try them yourself before you trust the fleet.' },
      sources: ['observations.estimates.theo-2026-11-16-council-runaway.fact', 'observations.experience.parallelThreads'],
    },
  ],
};

export default lesson13;
