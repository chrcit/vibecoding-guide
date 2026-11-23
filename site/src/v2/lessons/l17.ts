/* Guide v2 lesson: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import type { SceneState, Label, XY, Zone } from '../../journey/picture';
import { BUS_Y } from '../../journey/picture';
import { jobs, lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import type { Preview } from '../preview';
import { t3code } from '../../data/t3code';
import { CHANGED, CHANGED_N, FIRST, RAN, b, n, points, type Lesson, type Move } from '../content';

// ---------- lesson 17: other machines ----------
// Week 6, Saturday. From v1's where.ts: each job stands on the machine it runs on. A laptop whose
// lid closes, a computer that stays on, and a machine in the cloud that starts from GitHub. The
// machine names ("laptop", "office"), the times and the report are made up.

const [READ_N] = t3code.screen.workLogGroups.value;
const staff = (stage: string, url: string): Preview => ({ app: 'staff', stage, url });
const LAPTOP_URL = 'localhost:4321/report';
/** A made-up tailnet address for the office machine (Tailscale names machines <name>.<tailnet>.ts.net). */
const OFFICE_URL = 'office.lantern-club.ts.net/report';

const GAP = 112;
const SLAB: [number, number, number, number] = [-31, -31, 62, 62];
const KINDS: Zone['kind'][] = ['laptop', 'box', 'cloud'];
const NAMES = ['your laptop', 'office: always on', 'the cloud'];
const spot = (i: number, count: number): XY => [(i - (count - 1) / 2) * GAP, 0];
const PHONE: XY = [44, 112];

function floor(count: number, o: { phone?: boolean } = {}): SceneState {
  const s = jobs(count, { gap: GAP, machines: KINDS.slice(0, count), trees: false, slab: SLAB, labels: [] });
  s.tray = null;
  if (o.phone) s.gear = [{ id: 'phone', at: PHONE, kind: 'phone', scale: 0.9 }];
  for (const a of s.agents) a.blocks = [FIRST];
  const l = -GAP - 34, r = GAP + 34;
  s.focus = ['you', 'project', [l, -34, 0], [l - 30, 34, 0], [r, -34, 0], [r, 44, 0], [0, -34, 60], [PHONE[0] + 10, PHONE[1], 20]];
  return s;
}
const frame = (count: number, names = NAMES): Label[] => [
  lab('you', 'you', 'left'),
  ...names.slice(0, count).map((t, i) => lab(`j${i}`, t, 'top')),
  termLabel('main', 'main', 'bottom', 'GitHub: main'),
];
const note = (s: SceneState, count: number, names: string[], ...more: Label[]) => { s.labels = [...frame(count, names), ...more]; };
const job = (s: SceneState, i: number) => s.agents[i]!;
const asleep = (s: SceneState, i: number, off = true) => { s.zones![i]!.off = off; job(s, i).off = off; if (off) { job(s, i).busy = false; job(s, i).lamp = 'off'; } };

/** From you to job i of count: up the floor to its machine. */
const toJob = (i: number, count: number): Move => { const [x] = spot(i, count); return { to: 'path', path: [[0, 94], [0, 44], [x, 44], [x, 22]], kind: 'you', ms: 620 }; };
const fromJob = (i: number, count: number, kind: 'model' | 'bad' = 'model'): Move => { const [x] = spot(i, count); return { to: 'path', path: [[x, 22], [x, 44], [0, 44], [0, 94]], kind, ms: 620 }; };
const phoneToJob = (i: number, count: number): Move => { const [x] = spot(i, count); return { to: 'path', path: [PHONE, [PHONE[0], 44], [x, 44], [x, 22]], kind: 'you', ms: 700 }; };
const toMain = (i: number, count: number): Move => { const [x] = spot(i, count); return { to: 'path', path: [[x, -16], [x, BUS_Y], [GAP + 54, BUS_Y]], kind: 'model', ms: 640 }; };
const fromMain = (i: number, count: number): Move => { const [x] = spot(i, count); return { to: 'path', path: [[GAP + 54, BUS_Y], [x, BUS_Y], [x, -16]], kind: 'tool', ms: 640 }; };

const REPORT = 'Every Saturday, the night report: arrivals by hour, what ran low at the bar, and each promoter’s payout. Done when last Friday’s report is ready, with made-up data wherever a check needs it.';

const lesson17: Lesson = {
  id: 'l17',
  parts: [
    {
      title: 'The lid closes',
      thread: 'Saturday report',
      fresh: true,
      request: REPORT,
      lede: 'Week 6, Saturday 18:00. Putting last night into numbers takes you an hour by hand each week. You hand it over from your laptop and get ready to leave for the club.',
      points: points(floor(1, { phone: false }), [
        { say: 'It starts on your laptop: the thread, the tools and the project’s files are all there. The Run on picker under the composer names the machine.', moves: [toJob(0, 1)], ui: { env: 'laptop' }, preview: staff('none-report', LAPTOP_URL),
          edit: (s) => { job(s, 0).blocks = [FIRST, b('you', 3), b('model', 1), b('tool', 5)]; job(s, 0).lamp = 'work'; job(s, 0).busy = true; note(s, 1, NAMES); } },
        { say: 'At 18:20 you close the lid to go to the club. The laptop sleeps, and the work stops with it, mid-step.', ui: { env: 'laptop' }, preview: staff('none-report', LAPTOP_URL),
          edit: (s) => { job(s, 0).blocks = [FIRST, b('you', 3), b('model', 1), b('tool', 5), b('model', 1)]; asleep(s, 0); note(s, 1, ['your laptop: asleep']); } },
        { say: 'Your phone can open the thread through the T3 Code app, but the phone is only a remote: the computer does the work, and it has to stay on.', ui: { env: 'laptop' }, preview: staff('none-report', LAPTOP_URL),
          edit: (s) => { job(s, 0).blocks = [FIRST, b('you', 3), b('model', 1), b('tool', 5), b('model', 1)]; asleep(s, 0); s.gear = [{ id: 'phone', at: PHONE, kind: 'phone', scale: 0.9 }]; note(s, 1, ['your laptop: asleep'], lab('gear:phone', 'your phone: a remote', 'right')); } },
      ]),
      // No work log and no reply: the laptop slept mid-turn, so the turn never finished and nothing came back.
      answer: [],
      deeper: { level: 'technical', text: 'The phone apps pair with a machine running T3 Code over your network, Tailscale, SSH or T3 Connect. They show its threads; the work runs on that machine.' },
      tryIt: { prompt: 'Before I close the laptop: how long will this take, and what’s left if it stops halfway?', t3: 'Check the Run on picker under the composer before you send something long: it names the machine that will do the work.' },
      sources: ['t3code.phoneIsRemote', 't3code.remote', 't3code.screen.runOn', 't3code.install'],
    },
    {
      title: 'A computer that stays on',
      thread: 'Saturday report',
      request: 'Run this on the office machine instead. And every Saturday at 10:00, without me.',
      lede: 'Saturday 18:30, from your phone at the club. An old mini PC in the office has run T3 Code as a background service since Thursday.',
      points: points(floor(2, { phone: true }), [
        { say: 'The office mini PC runs T3 Code as a background service, with no one logged in at it. It stays on.', ui: { env: 'office' }, preview: staff('none-report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); note(s, 2, ['your laptop: asleep', 'office: always on']); } },
        { say: 'Your phone reaches it through T3 Connect, or over your tailnet, from the club. The message goes to the office, not to the laptop.', moves: [phoneToJob(1, 2)], ui: { env: 'office' }, preview: staff('none-report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 1).blocks = [FIRST, b('you', 3)]; job(s, 1).lamp = 'work'; job(s, 1).busy = true; note(s, 2, ['your laptop: asleep', 'office: always on'], lab('gear:phone', 'from the club', 'right')); } },
        { say: 'The report runs there while the laptop sleeps: it reads, builds the page and checks it against made-up data.', moves: [fromMain(1, 2)], ui: { env: 'office' }, preview: staff('report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 1).blocks = [FIRST, b('you', 3), b('model', 1), b('tool', 5), b('model', 1), b('tool', 3), b('model', 1), b('tool', 2)]; job(s, 1).lamp = 'work'; note(s, 2, ['your laptop: asleep', 'office: always on']); } },
        { say: 'It replies, and sets the report as a scheduled task on that machine: every Saturday at 10:00, whether or not any of your devices is awake.', moves: [fromJob(1, 2)], ui: { env: 'office' }, preview: staff('report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 1).blocks = [FIRST, b('you', 3), b('model', 1), b('tool', 5), b('model', 1), b('tool', 3), b('model', 1), b('tool', 2), b('model', 2)]; job(s, 1).lamp = 'ok'; note(s, 2, ['your laptop: asleep', 'office: Saturdays 10:00']); } },
      ]),
      log: {
        took: '6m 40s',
        rows: [
          { at: 2, label: n(CHANGED_N, 3), detail: { plain: 'the report page, and made-up data for its checks', technical: 'src/report.tsx, src/report.ts, src/report.test.ts' } },
          { at: 2, label: RAN, tone: 'ok', detail: { plain: 'report checks pass with made-up guests', technical: 'npm test -- report: 6 of 6' } },
          { at: 3, label: CHANGED, detail: { plain: 'a scheduled task: Saturdays at 10:00', technical: 'scheduled task on office: “Saturday report”, Sat 10:00' } },
        ],
      },
      answer: [
        'Last Friday’s report is at /report on the office machine: arrivals by hour, the bar’s top taps and each promoter’s payout. Peak was 00:30.',
        'It runs again every Saturday at 10:00 on the office machine, and the thread will show it when you next look.',
      ],
      deeper: { level: 'engineer', text: `t3 service install runs T3 Code as a user service on Linux, macOS or Windows; t3 up sets how other devices reach it. T3 Connect links up to ${t3code.connectMachines.value} machines free (phones and browsers don’t count).` },
      tryIt: { prompt: 'Every [day] at [time], [the job]. Done when [what I’ll find].', t3: 'Pick the machine in Run on before you send, or set the task on a machine that stays on. On a server, t3 service install keeps T3 Code running without a terminal.' },
      sources: ['t3code.backgroundService', 't3code.remote', 't3code.connectMachines', 't3code.scheduledTasks', 't3code.screen.runOn'],
    },
    {
      title: 'The cloud starts from GitHub',
      thread: 'Report: clock change',
      fresh: true,
      request: 'The report’s hour chart is off by one after the clocks changed. Fix it. Done when the report checks pass.',
      lede: 'Sunday 11:00, on your phone. This one isn’t in T3 Code: you start a Claude Code cloud session on the Lantern’s GitHub repository from the Claude app. The drawing is the same.',
      points: points(floor(3, { phone: true }), [
        { say: 'A cloud session gets a fresh machine that clones your GitHub repository at the branch you pick. Not your laptop’s folder, not the office machine.', moves: [fromMain(2, 3)], ui: { env: '' }, preview: staff('report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 2).blocks = [FIRST, b('tool', 4)]; job(s, 2).lamp = 'work'; note(s, 3, ['your laptop: asleep', 'office: always on', 'the cloud: a fresh copy']); } },
        { say: 'The practice guests from lesson 8 are made on your machines and never committed. Here they don’t exist, so the report checks can’t run.', moves: [{ to: 'path', path: [[GAP, 0], [GAP + 30, 0]], kind: 'bad', ms: 420 }], ui: { env: '' }, preview: staff('report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 2).blocks = [FIRST, b('tool', 4), b('model', 1), b('bad', 3)]; job(s, 2).lamp = 'bad'; note(s, 3, ['your laptop: asleep', 'office: always on', 'the cloud: no test data']); } },
        { say: 'A cloud environment can carry a setup script, which runs before the agent starts. Yours makes made-up practice guests. Real guests never leave the club’s machines.', ui: { env: '' }, preview: staff('report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 2).blocks = [FIRST, b('rules', 2), b('tool', 4)]; job(s, 2).lamp = 'work'; note(s, 3, ['your laptop: asleep', 'office: always on', 'setup: made-up guests']); } },
        { say: 'It fixes the hour, the checks pass, and the fix goes up as a pull request. It ran while every machine of yours slept, and it counts toward the same plan limits.', moves: [toMain(2, 3)], ui: { env: '' }, preview: staff('report', OFFICE_URL),
          edit: (s) => { asleep(s, 0); job(s, 2).blocks = [FIRST, b('rules', 2), b('tool', 4), b('model', 1), b('tool', 2), b('model', 2)]; job(s, 2).lamp = 'ok'; s.project!.commits = [...(s.project!.commits ?? []), 'ok']; note(s, 3, ['your laptop: asleep', 'office: always on', 'the cloud: pull request']); } },
      ]),
      log: {
        took: '5m 30s',
        rows: [
          { at: 1, label: RAN, tone: 'bad', detail: { plain: 'report checks: no practice guests on this machine', technical: 'npm test -- report: fixtures/practice.json not found', engineer: 'ENOENT fixtures/practice.json (gitignored; generated locally)' } },
          { at: 2, label: CHANGED, detail: { plain: 'the setup script makes made-up guests', technical: 'scripts/practice-data.ts, run by the environment’s setup script' } },
          { at: 3, label: CHANGED, detail: { plain: 'hours use the club’s time zone', technical: 'src/report.ts', engineer: 'report.ts: bucket by Europe/… local hour, not UTC' } },
          { at: 3, label: RAN, tone: 'ok', detail: { plain: 'report checks pass, with the clock change in a test', technical: 'npm test -- report: 7 of 7' } },
        ],
      },
      answer: [
        'Fixed: the hour chart now uses the club’s local time, so the night of the clock change lines up. A new test covers that night. It’s in a pull request on GitHub.',
        'The checks first failed for want of practice guests: they’re never committed. I added a script that makes made-up ones; put it in the environment’s setup script and every cloud session will have them.',
      ],
      deeper: { level: 'technical', text: 'A cloud environment holds the network access, environment variables and setup script for its sessions. Secrets and real data stay out of the repository; the setup script makes what the checks need.' },
      tryIt: { prompt: 'What does this project need on a fresh machine before its checks can run? Write it as a setup script that uses only made-up data.', t3: 'T3 Code runs agents on your own machines. For a cloud session, use Claude Code on the web or Codex cloud tasks; a cloud task can use more of a Codex allowance than a local message.' },
      sources: ['harnesses.claudeCode.cloudClone', 'harnesses.claudeCode.cloudSetup', 'harnesses.claudeCode.cloudKeepsRunning', 'harnesses.claudeCode.cloudUsage', 'plans.chatgpt.limits.cloudTasks'],
    },
  ],
};

export default lesson17;
