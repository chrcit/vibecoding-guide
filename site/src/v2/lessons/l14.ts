/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import type { Block, SceneState, Label, P3 } from '../../journey/picture';
import { route } from '../../journey/picture';
import { solo, lab, worked as workedBlocks } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { models, lineup } from '../../data/models';
import { plans } from '../../data/plans';
import { A, CHANGED, CHANGED_N, FIRST, RAN, RAN_N, atYou, b, file, n, points, push, readRow, searchRow, status, type Lesson, type Move, type Ui } from '../content';

// ---------- lesson 14: cost ----------
// Week 3 after the first Friday: Tuesday 15:00 to Wednesday 11:00. Every "% left" is an example.

const [READ_N] = t3code.screen.workLogGroups.value;
const [SESSION, WEEKLY] = t3code.screen.limitWindows.value;
const LIMITED = status('Limited');
const opus = models['claude-opus-5-5'];
const haiku = models['claude-haiku-5-5'];
const short = (name: string) => name.replace(/^Claude /, '');
const [, , EFFORT_HIGH] = lineup.claudeCodeEffortLevels.value;
const [EFFORT_LOW] = lineup.claudeCodeEffortLevels.value;
/** $4, $0.20, $0.10: a price per million tokens as a reader expects it. */
const usd = (v: number) => (Number.isInteger(v) ? `$${v}` : `$${v.toFixed(2)}`);

const limits = (session: number, weekly: number): Ui => ({ limits: [{ label: SESSION, left: session }, { label: WEEKLY, left: weekly }] });
const staff = (stage: string, path: string): Preview => ({ app: 'staff', stage, url: `localhost:4321${path}` });

/** The meter is the plan's allowance; one `sum` puck from it per request the model reads. */
const draw: Move = { to: 'path', path: route.meterToAgent(), kind: 'sum', ms: 420 };
const search = { to: 'tool', tool: 'search', file: 1, back: 'tool' } as const;
const read = { to: 'tool', tool: 'read', file: 1, back: 'tool' } as const;
const edit = (f = 2) => ({ to: 'tool', tool: 'edit', file: f, back: 'tool' }) as const;
const run = (back: 'tool' | 'bad' = 'tool') => ({ to: 'tool', tool: 'run', back }) as const;

/** The frame's own labels. `model` names the model and effort on top of the agent, where the part is about choosing them. */
const frame = (model?: string): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', model), termLabel('meter:m0', 'plan', 'left', 'your plan')];
function floor(level: number, blocks: Block[]): SceneState {
  const s = solo({ tools: true, project: true, meter: 'plan', blocks, labels: frame() });
  s.meters![0]!.level = level;
  s.project!.files = ['', '', '', '', '', ''];
  return s;
}
const note = (s: SceneState, ...more: Label[]) => { s.labels = [...frame(), ...more]; };
/** Annotation spots that keep clear of the frame's own labels: right of the window, under the meter. */
/** The same, with the model's name and effort in place of the plain "model" on top of it. */
const noteM = (s: SceneState, model: string, ...more: Label[]) => { s.labels = [...frame(model), ...more]; };
const byWindow = (text: string) => lab([30, -30, 34] as P3, text, 'right');
const byMeter = (text: string) => lab([-72, 46, 0] as P3, text, 'bottom');
const meter = (s: SceneState, level: number, lamp?: 'off' | 'work' | 'ok' | 'bad' | 'wait') => { const m = s.meters![0]!; m.level = level; if (lamp) m.lamp = lamp; };

/** Three weeks of bar work in one thread: the window nearly full before you say anything. */
const LONG: Block[] = [FIRST, ...workedBlocks(17)];
const BAR_THREAD = 'Bar running low';
const PAYOUT_THREAD = 'Promoter payouts';

const lesson14: Lesson = {
  id: 'l14',
  parts: [
    {
      title: 'A long thread costs more per step',
      thread: BAR_THREAD,
      fresh: true,
      request: 'Ginger beer is now Ginger ale on the bar list. Done when the bar page shows the new name and last week’s taps still count.',
      lede: 'Three weeks after the first Friday, Tuesday 15:00. The bar thread from lesson 4 is still open: every bar change since has gone into it. You add one more line.',
      points: points(floor(0.64, LONG), [
        { say: 'One line from you, on top of three weeks of bar work. Thread details now show Usage limits: how much of each window of your plan is left.', moves: [{ to: 'agent' }], ui: { ...limits(64, 71), modelName: '' }, preview: staff('bar', '/bar'),
          edit: (s) => { push(s, b('you', 1)); A(s).lamp = 'work'; note(s, byWindow('three weeks of bar work')); } },
        { say: 'Every step sends the whole conversation again, not just your line. The model reads all of it before it searches.', think: 1200, moves: [draw, search], ui: limits(63, 71), preview: staff('bar', '/bar'),
          edit: (s) => { push(s, b('model', 0.6), b('tool', 1.2)); file(s, 1, 'read'); meter(s, 0.63); note(s, byWindow('the whole thread, every step')); } },
        { say: `Most of it repeats the last request, so it comes from the cache: on ${short(opus.name)} a cache read is ${usd(opus.price.cacheRead.value)} per million tokens against ${usd(opus.price.input.value)} for fresh input. On a plan it still draws on the same allowance.`, think: 900, moves: [draw, edit()], ui: limits(62, 71), preview: staff('bar-ale', '/bar'),
          edit: (s) => { push(s, b('model', 0.6), b('tool', 0.8)); file(s, 2, 'edit'); meter(s, 0.62); note(s, byMeter('the repeat: from the cache')); } },
        { say: 'It checks last week’s taps moved with the name, and replies. Three steps for a one-word change, each one reading three weeks.', think: 900, moves: [draw, run(), { to: 'you', kind: 'model' }], ui: limits(61, 70), preview: staff('bar-ale', '/bar'),
          edit: (s) => { push(s, b('model', 0.6), b('tool', 0.8), b('model', 0.8)); file(s, 2, 'ok'); meter(s, 0.61); A(s).lamp = 'ok'; note(s, atYou('one word changed')); } },
        { say: 'The same line in a fresh thread, with a two-line brief, reads a short window at every step. The job was the same size; the window wasn’t.', ui: limits(61, 70), preview: staff('bar-ale', '/bar'),
          edit: (s) => { A(s).blocks = [FIRST, b('you', 1.6), b('model', 0.6), b('tool', 1.2), b('model', 0.6), b('tool', 0.8), b('model', 0.8)]; A(s).lamp = 'ok'; note(s, byWindow('a fresh thread: a short window'), byMeter('less of the plan')); } },
      ]),
      log: {
        took: '1m 20s',
        rows: [
          { at: 1, label: searchRow('Ginger', 'src'), detail: { plain: 'where the bar list names its items', technical: 'src/bar/items.ts' } },
          { at: 2, label: n(CHANGED_N, 2), detail: { plain: 'the name; the taps stay with the item', technical: 'src/bar/items.ts, src/bar/order.tsx', engineer: 'items.ts: label only; taps keyed by item id, untouched' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'bar checks: 6 of 6 pass', technical: 'npm test -- bar: 6 of 6', engineer: 'vitest bar/*: 6 passed' } },
        ],
      },
      answer: [
        'Ginger beer is now Ginger ale on the bar list and in tomorrow’s order list. Its 14 taps from last week moved with it: they were stored by item, not by name.',
        'Checked at 390 px; the bar checks pass, 6 of 6.',
      ],
      deeper: {
        level: 'engineer',
        text: `At list price, ${short(opus.name)} reads input at ${usd(opus.price.input.value)} per million tokens and a cache read at ${usd(opus.price.cacheRead.value)}. Most of a long thread’s reread is a cache read, so it’s cheaper than it looks; on a plan it still draws on the limit, and Anthropic publishes no token or dollar figure for a plan’s limit.`,
      },
      tryIt: {
        prompt: 'Start a fresh thread for this. Brief: [the two things it needs to know]. Task: [the change]. Done when [what you’ll look at].',
        t3: 'Send /usage-limits to see how much of each window is left, or turn on Usage limits in Settings → Appearance → Thread details to keep them in view.',
      },
      sources: ['plans.claude.limits.wholeConversation', 'plans.claude.limits.whatUsageMeans', 'models.claude-opus-5-5.price.input', 'models.claude-opus-5-5.price.cacheRead', 't3code.screen.usageLimits', 't3code.screen.limitWindows', 't3code.usageLimitsInThread'],
    },
    {
      title: 'Limited',
      thread: PAYOUT_THREAD,
      fresh: true,
      request: 'Each promoter’s payout for Friday: €5 for each person who came in on their list, plus-ones count, no-shows don’t. Done when the payouts page adds up for Kai and Noor with made-up guests, and a test checks the rule.',
      lede: 'The same day, 16:40. Three threads have been working since lunch, and they all draw on one plan.',
      points: points(floor(0.09, [FIRST]), [
        { say: 'It reads where guests and promoters live. Three threads have drawn on the same plan since lunch: the session window is nearly used up.', moves: [{ to: 'agent' }, draw, read], ui: limits(9, 52), preview: staff('none', '/payouts'),
          edit: (s) => { push(s, b('you', 2.4), b('model', 0.8), b('tool', 4)); file(s, 1, 'read'); A(s).lamp = 'work'; meter(s, 0.07, 'wait'); note(s, byMeter('3 threads, one plan')); } },
        { say: 'It writes the rule down as a test first: €5 a person, plus-ones in, no-shows out.', moves: [draw, edit(3)], ui: limits(4, 51), preview: staff('none', '/payouts'),
          edit: (s) => { push(s, b('model', 1), b('tool', 1.5)); file(s, 3, 'edit'); meter(s, 0.03, 'wait'); note(s, lab('tool:edit', 'the rule, as a test', 'right')); } },
        { say: 'The session limit runs out mid-turn. The thread stops where it is, and its row in the sidebar reads Limited.', moves: [draw], status: LIMITED, ui: limits(0, 50), preview: staff('none', '/payouts'),
          edit: (s) => { meter(s, 0, 'bad'); A(s).lamp = 'bad'; note(s, byMeter('session: used up'), byWindow('stopped mid-turn')); } },
        { say: 'Resume at reset schedules it to carry on when the window refills, five hours after it began. Switching model doesn’t help: the limit is shared across models. Another provider’s account would.', status: LIMITED, ui: limits(0, 50), preview: staff('none', '/payouts'),
          edit: (s) => { meter(s, 0, 'wait'); A(s).lamp = 'wait'; note(s, byMeter('refills in full at 17:10')); } },
        { say: '17:10. The window refills, and the thread picks up where it stopped: the page, then the test. Both pass.', moves: [draw, edit(2), run(), { to: 'you', kind: 'model' }], ui: limits(96, 49), preview: staff('payouts', '/payouts'),
          edit: (s) => { push(s, b('model', 1), b('tool', 2), b('model', 1), b('tool', 2), b('model', 2)); file(s, 2, 'edit'); file(s, 3, 'ok'); meter(s, 0.96, 'ok'); A(s).lamp = 'ok'; note(s, atYou('payouts, after the reset')); } },
      ]),
      log: {
        took: '3m 40s',
        rows: [
          { at: 0, label: n(READ_N, 3), detail: { plain: 'where guests, promoters and arrivals are kept', technical: 'src/guests.ts, src/promoters.ts, src/door.tsx' } },
          { at: 1, label: CHANGED, detail: { plain: 'the payout rule, as a test', technical: 'src/payouts.test.ts (new)', engineer: '+payouts.test.ts: €5 × (guests in + plus-ones in); no-shows 0' } },
          { at: 4, label: n(CHANGED_N, 2), detail: { plain: 'the payouts page', technical: 'src/payouts.ts, src/payouts.tsx (new)' } },
          { at: 4, label: RAN, tone: 'ok', detail: { plain: 'the rule’s test and the old checks pass', technical: 'npm test: 24 of 24', engineer: 'vitest 24/24; playwright payouts.spec @390' } },
        ],
      },
      answer: [
        'The payouts page is at /payouts. Each promoter gets €5 for each person on their list who came in, plus-ones included; no-shows count for nothing. With made-up guests: Kai €145 for 29 people, Noor €80 for 16.',
        'The rule is a test now. I stopped at the session limit at 16:52 and carried on after the reset at 17:10.',
      ],
      deeper: {
        level: 'technical',
        text: `On a Claude plan the session window starts with your first message and resets in full five hours later; weekly limits run across all models on top of it. With usage credits turned on, work carries on on credits instead of stopping. In Codex, a limit reached mid-turn lets the agent finish that turn.`,
      },
      tryIt: {
        prompt: 'If you hit a usage limit, stop where the tests pass and tell me what’s left.',
        t3: 'On a row that reads Limited, choose Resume at reset, or switch the thread to another provider instance.',
      },
      sources: ['t3code.limited', 't3code.screen.statuses', 'plans.claude.limits.fiveHour', 'plans.claude.limits.weekly', 'plans.claude.limits.sharedAcrossModels', 'plans.claude.limits.usageCredits', 'plans.chatgpt.limits.atTheLimit', 'plans.claude.limits.subagentsDraw'],
    },
    {
      title: 'A small job, a small model',
      thread: 'Sort the bar list',
      fresh: true,
      request: 'On the bar list, put the most-tapped items first. Done when the order follows the taps at phone size.',
      lede: 'Wednesday 10:00. A small, clear change. Before you send it, you pick the model and the effort.',
      points: points(floor(0.88, [FIRST]), [
        { say: `It’s small and clear, so you start it on ${short(haiku.name)} at ${EFFORT_LOW} effort. The chip under the composer names the model it runs on.`, moves: [{ to: 'agent' }], ui: { ...limits(88, 47), modelName: `${short(haiku.name)} · ${EFFORT_LOW}` }, preview: staff('bar-ale', '/bar'),
          edit: (s) => { push(s, b('you', 1.4)); A(s).model = 'b'; A(s).lamp = 'work'; noteM(s, `${short(haiku.name)}, ${EFFORT_LOW} effort`); } },
        { say: 'It finds the list, changes the order and runs the bar checks, in few steps and few words.', moves: [draw, edit(), run()], ui: limits(87, 47), preview: staff('bar-sorted', '/bar'),
          edit: (s) => { push(s, b('model', 0.4), b('tool', 1), b('model', 0.4), b('tool', 0.8)); A(s).model = 'b'; file(s, 2, 'ok'); meter(s, 0.87); noteM(s, `${short(haiku.name)}, ${EFFORT_LOW} effort`); } },
        { say: `Done. Per token, ${short(haiku.name)} costs ${usd(haiku.price.input.value)} per million input tokens against ${usd(opus.price.input.value)} for ${short(opus.name)}. On a plan, a small model at low effort uses less of the limit.`, moves: [{ to: 'you', kind: 'model' }], ui: limits(87, 47), preview: staff('bar-sorted', '/bar'),
          edit: (s) => { push(s, b('model', 0.6)); A(s).model = 'b'; A(s).lamp = 'ok'; meter(s, 0.87); noteM(s, `${short(haiku.name)}, ${EFFORT_LOW} effort`, byMeter('barely moved')); } },
      ]),
      log: {
        took: '40s',
        rows: [
          { at: 1, label: CHANGED, detail: { plain: 'the bar list’s order', technical: 'src/bar/items.tsx', engineer: 'items.tsx: sort by taps (tonight + last 7 days), desc' } },
          { at: 1, label: RAN, tone: 'ok', detail: { plain: 'bar checks: 7 of 7 pass', technical: 'npm test -- bar: 7 of 7' } },
        ],
      },
      answer: [
        'The bar list now puts the most-tapped items first, counting tonight’s taps and last week’s. Lime and Ice are on top.',
        'Bar checks pass, 7 of 7, including a new one for the order.',
      ],
      deeper: { level: 'technical', text: `Claude Code offers the effort levels ${lineup.claudeCodeEffortLevels.value.join(', ')}, and starts at ${lineup.claudeCodeEffortDefault.value}. Effort is a signal, not a budget: at low effort the model still thinks on a hard problem, just less.` },
      tryIt: { prompt: '[A small, clear change]. Done when [what you’ll see].', t3: 'Open the model picker with mod+shift+m and the effort picker with mod+shift+e before you send. A new thread carries your model and mode.' },
      sources: ['models.claude-haiku-5-5.price.input', 'models.claude-opus-5-5.price.input', 'lineup.claudeCodeEffortLevels', 'lineup.claudeCodeEffortDefault', 'lineup.effortSignal', 'plans.claude.limits.effort', 't3code.shortcuts.model', 't3code.shortcuts.effort', 't3code.newThreadCarries'],
    },
    {
      title: 'A judgement, a big model',
      thread: 'Refunds on payouts',
      fresh: true,
      request: 'Payouts: a guest turned away at the door doesn’t count, and each promoter can see why each guest did or didn’t count. Done when a test covers a guest turned away and the page says why.',
      lede: 'Wednesday 10:30, a new thread. This change has a judgement in it: what counts, and how to say why.',
      points: points(floor(0.86, [FIRST]), [
        { say: `A rule with a judgement in it gets the big model at ${EFFORT_HIGH} effort. Set both when you start a thread: changing model or effort in the middle makes the next request miss some or all of the cache.`, moves: [{ to: 'agent' }], ui: { ...limits(86, 46), modelName: `${short(opus.name)} · ${EFFORT_HIGH}` }, preview: staff('payouts', '/payouts'),
          edit: (s) => { push(s, b('you', 1.8)); A(s).model = 'a'; A(s).lamp = 'work'; noteM(s, `${short(opus.name)}, ${EFFORT_HIGH} effort`, byWindow('chosen at the start')); } },
        { say: 'Higher effort means more thinking and more steps, and every token of it counts toward the limit.', think: 1400, moves: [draw, read, draw, edit(3)], ui: limits(81, 45), preview: staff('payouts', '/payouts'),
          edit: (s) => { push(s, b('model', 3), b('tool', 3), b('model', 2), b('tool', 1.5)); file(s, 3, 'edit'); meter(s, 0.81); noteM(s, `${short(opus.name)}, ${EFFORT_HIGH} effort`, byMeter('more per step')); } },
        { say: 'It tests a guest turned away at 00:20, changes the page so every guest says why, and runs everything.', moves: [draw, edit(2), run()], ui: limits(77, 44), preview: staff('payouts-why', '/payouts'),
          edit: (s) => { push(s, b('model', 2), b('tool', 2), b('model', 1), b('tool', 2)); file(s, 2, 'edit'); file(s, 3, 'ok'); meter(s, 0.77); note(s, lab('tool:run', 'turned away: refunded', 'right')); } },
        { say: 'It replies. T3 Code’s Usage page adds up what all your threads would have cost at API prices. That is an estimate, not your bill.', moves: [{ to: 'you', kind: 'model' }], ui: limits(77, 44), preview: staff('payouts-why', '/payouts'),
          edit: (s) => { push(s, b('model', 2.4)); A(s).lamp = 'ok'; meter(s, 0.77, 'ok'); note(s, atYou('why each guest counts')); } },
      ]),
      log: {
        took: '4m 50s',
        rows: [
          { at: 1, label: readRow('src/payouts.ts'), detail: { plain: 'how payouts are counted now' } },
          { at: 1, label: CHANGED, detail: { plain: 'a test: a guest turned away doesn’t count', technical: 'src/payouts.test.ts', engineer: 'payouts.test.ts: Lea Brandt turned away 00:20 → Kai −€5' } },
          { at: 2, label: n(CHANGED_N, 3), detail: { plain: 'the rule, and a reason on every guest row', technical: 'src/payouts.ts, src/payouts.tsx, src/door.tsx', engineer: 'reason: in | no-show | refunded; door.tsx records turned-away' } },
          { at: 2, label: n(RAN_N, 2), tone: 'ok', detail: { plain: 'all checks pass, 25 of 25', technical: 'npm test 25/25; payouts.spec @390' } },
        ],
      },
      answer: [
        'A guest turned away at the door doesn’t count now: they’re marked “refunded” and drop out of their promoter’s payout. Every guest row on /payouts says why it counts or not.',
        'A new test covers Lea Brandt, turned away at 00:20: Kai’s total goes from €145 to €140. All 25 checks pass.',
      ],
      deeper: {
        level: 'engineer',
        text: 'Usage estimates API-equivalent cost across providers from the session history on each machine; it is not your subscription bill. What a plan is worth in API dollars is published by nobody official. Theo, who makes T3 Code, put a $200 Claude plan at about $8,000 of API-priced tokens a month on 2 October 2026: one person’s estimate, and his figures move with the plans.',
      },
      tryIt: { prompt: '[A rule with a judgement in it]. Show me why each case comes out the way it does, and test the edge case: [the case].', t3: 'Pick the model and effort before the first message. Open Usage with mod+u to see the estimate across all your threads.' },
      sources: ['lineup.cacheBreakers', 'lineup.effortAllTokens', 'plans.claude.limits.effort', 't3code.usagePage', 't3code.shortcuts.usage', 'observations.estimates.theo-2026-10-02-claude-200.fact'],
    },
  ],
};

export default lesson14;
