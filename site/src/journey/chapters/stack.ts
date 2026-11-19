// Lesson 3 (part one): git as undo, GitHub as the copy online, a branch and a pull request, static
// and dynamic hosting, and what a server's specs are. Every job and load figure here is made up.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, SPOT, BUS_Y, type SceneState, type XY, type Person } from '../picture';
import { note, readout, lv } from './part1';
import { termLabel } from '../terms';

const stat = readout(['commits, on your laptop', 'commits, on GitHub', 'the member list page', 'server']);
const TOOLS = { at: SPOT.tools, ids: ['read', 'edit', 'run', 'search'] };
const PROJ = { at: SPOT.project };

// ---------- commit ----------

const commitScene = (): SceneState => solo({
  tools: true,
  project: { commits: [] },
  labels: [
    lab('you', 'you', 'left'),
    termLabel('a0', 'agent', 'top', 'the agent'),
    termLabel('project', 'project'),
    termLabel('main', 'commit', 'bottom', 'commits'),
  ],
});

async function runCommit(ctx: Ctx, h: Script, saved: boolean) {
  note(ctx, 'stack', 'commit');
  h.set((s) => Object.assign(s, commitScene()));
  stat(ctx, [0, '–', 'works', '–']);
  if (saved) {
    ctx.say('you', 'It works. Save this version.');
    await h.send(route.youToAgent(), 'you', { ms: 380 });
    await h.send(route.agentToRules(PROJ), 'model', { ms: 420 });
    h.set((s) => { s.project!.commits = ['ok']; });
    ctx.say('agent', lv(ctx, 'Saved: “Member list works”.', 'git add -A && git commit -m "Member list works"'));
    stat(ctx, [1, '–', 'works', '–']);
    await h.wait(900);
  }
  ctx.say('you', 'Make the list look nicer on a phone.');
  await h.send(route.youToAgent(), 'you', { ms: 380 });
  h.set((s) => { s.agents[0]!.busy = true; s.tools!.on = 'edit'; });
  await h.send(route.toolToFile(TOOLS, 'edit', PROJ, 2), 'bad', { ms: 420 });
  h.set((s) => { s.project!.files = ['', 'bad', 'bad', '', '', '']; s.agents[0]!.busy = false; s.tools!.on = null; });
  ctx.say('agent', 'Done. The list is responsive now.');
  stat(ctx, [saved ? 1 : 0, '–', 'broken: names cut off', '–']);
  await h.wait(1300);
  ctx.say('you', 'It is worse. Go back to how it was.');
  await h.send(route.youToAgent(), 'you', { ms: 380 });
  if (saved) {
    await h.send(route.agentToRules(PROJ), 'model', { ms: 420 });
    h.set((s) => { s.project!.files = ['', '', '', '', '', '']; });
    ctx.say('agent', lv(ctx, 'Back to the save point “Member list works”.', 'git restore . (back to the last commit)'));
    stat(ctx, [1, '–', 'works again', '–']);
    await h.wait(1500);
    ctx.say(null, 'One save point, and the bad change cost you a minute.');
  } else {
    h.set((s) => { s.agents[0]!.lamp = 'bad'; });
    ctx.say('agent', 'There is no saved version to go back to. I can try to undo it by hand.');
    stat(ctx, [0, '–', 'still broken', '–']);
    await h.wait(1500);
    ctx.say(null, 'Without a save point, “go back” is a guess.');
  }
}

// ---------- GitHub ----------

const GH: XY = [166, -104];
function ghScene(): SceneState {
  const s = commitScene();
  s.zones = [
    { id: 'lap', kind: 'laptop', rect: [52, -42, 166, 84] },
    { id: 'gh', kind: 'cloud', rect: [GH[0] - 34, GH[1] - 28, 68, 56] },
  ];
  s.projects = [{ id: 'gh', at: GH, scale: 0.6, commits: [] }];
  s.tracks!.push([[SPOT.project[0], -36], [GH[0], GH[1] + 22]]);
  s.labels = [
    lab('you', 'you', 'left'),
    lab('zone:lap', 'your laptop', 'bottom'),
    lab('p:gh', 'GitHub: the copy online', 'top', 'wiki/version-control/'),
    termLabel('main', 'commit', 'bottom', 'commits'),
  ];
  s.project!.commits = ['ok', 'ok', 'ok'];
  return s;
}
const UP: XY[] = [[SPOT.project[0], -36], [GH[0], GH[1] + 22]];
async function runGithub(ctx: Ctx, h: Script, pushed: boolean) {
  note(ctx, 'stack', 'github');
  h.set((s) => Object.assign(s, ghScene()));
  stat(ctx, [3, 0, 'works', '–']);
  if (pushed) {
    ctx.say('agent', lv(ctx, 'Sending the 3 save points to GitHub.', 'git push'));
    await h.send(UP, 'model', { ms: 620 });
    h.set((s) => { s.projects![0]!.commits = ['ok', 'ok', 'ok']; });
    stat(ctx, [3, 3, 'works', '–']);
    await h.wait(900);
  }
  ctx.say(null, 'The laptop is left on a train.');
  h.set((s) => { s.zones![0]!.off = true; s.project = null; s.agents[0]!.off = true; });
  stat(ctx, [0, pushed ? 3 : 0, pushed ? 'on GitHub only' : 'gone', '–']);
  await h.wait(1600);
  if (pushed) {
    h.set((s) => { s.zones![0]!.off = false; s.agents[0]!.off = false; s.project = { at: SPOT.project, rules: 'none', commits: [] }; });
    ctx.say('you', lv(ctx, 'New laptop. Get the club list back from GitHub.', 'git clone https://github.com/you/club-list.git'));
    await h.send(reverse(UP), 'model', { ms: 620 });
    h.set((s) => { s.project!.commits = ['ok', 'ok', 'ok']; });
    stat(ctx, [3, 3, 'works', '–']);
    await h.wait(1200);
    ctx.say(null, 'Everything up to the last push came back, with every save point.');
  } else {
    ctx.say(null, 'Nothing was pushed, so there is nothing to get back.');
  }
}

// ---------- branch and pull request ----------

function prScene(): SceneState {
  const s = solo({ project: false });
  s.agents[0]!.tree = 'own';
  s.project = { at: SPOT.main, rules: 'none', commits: ['ok', 'ok', 'ok'] };
  s.gates = [{ id: 'mgate', at: SPOT.mgate, axis: 'x' }];
  s.tracks = [[[0, 94], [0, 22]], [[0, -20], [0, BUS_Y]], [[0, BUS_Y], [SPOT.main[0] - 46, BUS_Y]]];
  s.labels = [
    lab('you', 'you', 'left'),
    termLabel('a0', 'agent', 'top', 'the agent'),
    termLabel('project', 'main', 'top', 'main: the version people use'),
    termLabel('mgate', 'pull-request', 'top'),
  ];
  return s;
}
async function runBranch(ctx: Ctx, h: Script, branch: boolean) {
  note(ctx, 'stack', 'branch');
  h.set((s) => { Object.assign(s, prScene()); if (!branch) { s.gates = []; s.agents[0]!.tree = false; } else s.labels![1] = termLabel('a0', 'branch', 'top', 'the agent, on a branch'); });
  stat(ctx, [3, 3, 'works', '–']);
  ctx.say('you', 'Add a “paid on” date to each member.');
  await h.send(route.youToAgent(), 'you', { ms: 380 });
  h.set((s) => { s.agents[0]!.busy = true; });
  await h.wait(900);
  h.set((s) => { s.agents[0]!.busy = false; });
  if (!branch) {
    await h.send([[0, -20], [0, BUS_Y], [SPOT.main[0] - 46, BUS_Y]], 'bad', { ms: 700 });
    h.set((s) => { s.project!.commits!.push('bad'); });
    ctx.say('agent', 'Done, it is on main.');
    stat(ctx, [4, 4, 'broken for everyone: dates show as “NaN”', '–']);
    await h.wait(1600);
    ctx.say(null, 'The change went straight to the version people use, mistake and all.');
    return;
  }
  await h.send(route.agentToMgate(), 'bad', { ms: 600 });
  h.set((s) => { s.gates![0]!.lamp = 'bad'; });
  ctx.say('check', lv(ctx, 'Tried the page: dates show as “NaN”.', 'CI: npm test failed: formatDate(undefined) returned "NaN".'));
  stat(ctx, [3, 3, 'works (main untouched)', '–']);
  await h.wait(1200);
  await h.send(reverse(route.agentToMgate()), 'bad', { ms: 600 });
  h.set((s) => { s.agents[0]!.busy = true; });
  await h.wait(700);
  h.set((s) => { s.agents[0]!.busy = false; });
  await h.send(route.agentToMgate(), 'model', { ms: 600 });
  h.set((s) => { s.gates![0]!.lamp = 'wait'; });
  ctx.say('check', 'Passed. Waiting for you to look.');
  await h.wait(1300);
  ctx.say('you', 'Looks right. Merge it.');
  h.set((s) => { s.gates![0]!.lamp = 'ok'; });
  await h.send(route.mgateToMain({ at: SPOT.main }), 'model', { ms: 500 });
  h.set((s) => { s.project!.commits!.push('ok'); s.gates![0]!.lamp = 'off'; });
  stat(ctx, [4, 4, 'works, with dates', '–']);
  await h.wait(1200);
  ctx.say(null, 'The mistake was caught at the pull request. Main only got the fixed version.');
}

// ---------- hosting ----------

const COACH: XY = [250, 40];
const TREAS: XY = [250, -30];
function hostScene(dynamic: boolean): SceneState {
  const people: Person[] = [{ id: 'coach', at: COACH, who: 'user' }, { id: 'treas', at: TREAS, who: 'user' }];
  return {
    you: null,
    agents: [],
    zones: [{ id: 'host', kind: 'cloud', rect: [100, -40, 90, 90] }],
    projects: dynamic ? [] : [{ id: 'site', at: [146, 5], scale: 0.6 }],
    gear: dynamic ? [{ id: 'srv', at: [128, 16], kind: 'server' }, { id: 'db', at: [164, -14], kind: 'db' }] : [],
    people,
    tracks: [[[175, 5], [COACH[0] - 10, COACH[1]]], [[175, 5], [TREAS[0] - 10, TREAS[1]]]],
    labels: [
      lab('zone:host', dynamic ? 'a server, always on' : 'static hosting', 'top', 'wiki/deployment/'),
      ...(dynamic ? [lab('gear:srv', 'server', 'bottom', 'wiki/backend/'), lab('gear:db', 'database', 'top', 'wiki/database/')] : [lab('p:site', 'the finished pages', 'top', 'wiki/frontend/')]),
      lab('coach', 'coach', 'bottom'),
      lab('treas', 'treasurer', 'top'),
    ],
  };
}
async function runHosting(ctx: Ctx, h: Script, dynamic: boolean) {
  note(ctx, 'stack', 'hosting');
  h.set((s) => Object.assign(s, hostScene(dynamic)));
  const server = dynamic ? 'yes, always on' : 'none';
  stat(ctx, [4, 4, 'live', server]);
  ctx.say('coach', 'Sam just paid. Marking him as paid.');
  const toSite: XY[] = [[COACH[0] - 10, COACH[1]], [175, 5]];
  if (!dynamic) {
    ctx.say(null, 'The finished pages go to the phone. The tick stays in that browser.');
    await h.send(reverse(toSite), 'model', { ms: 520 });
    await h.wait(900);
    ctx.say('treasurer', 'Sam: not paid.');
    await h.send([[175, 5], [TREAS[0] - 10, TREAS[1]]], 'bad', { ms: 520 });
    stat(ctx, [4, 4, 'Sam paid on one phone only', server]);
    await h.wait(1400);
    ctx.say(null, 'Static pages cannot share what people save. Cheap, fast, and fine for a page everyone only reads.');
    return;
  }
  await h.send(toSite, 'you', { ms: 520 });
  h.set((s) => { s.gear![0]!.lamp = 'work'; });
  await h.send([[136, 10], [158, -10]], 'you', { ms: 380 });
  h.set((s) => { s.gear![1]!.lamp = 'ok'; s.gear![0]!.lamp = 'off'; });
  ctx.say('server', 'Saved in the database: Sam, paid.');
  await h.wait(800);
  ctx.say('treasurer', 'Sam: paid.');
  await h.send([[175, 5], [TREAS[0] - 10, TREAS[1]]], 'model', { ms: 520 });
  stat(ctx, [4, 4, 'Sam paid, for everyone', server]);
  await h.wait(1400);
  ctx.say(null, 'The server keeps one list for everyone. It runs all day, so it costs more and needs looking after.');
}

// ---------- specs ----------

const SIZES = [40, 400, 4000, 40000];
function runSpecs(ctx: Ctx, idx: number) {
  note(ctx, 'stack', 'specs');
  const members = SIZES[Math.max(0, Math.min(3, idx))]!;
  // Made-up: on match day every member opens the list twice within ten minutes; the smallest
  // server answers about 20 page views a second.
  const perSec = (members * 2) / 600;
  const busy = Math.round((perSec / 20) * 100);
  void ctx.scene.run(async (h) => {
    h.set((s) => {
      Object.assign(s, hostScene(true));
      s.labels = s.labels!.filter((l) => l.at !== 'zone:host' && l.at !== 'gear:srv');
      s.labels.push(lab('gear:srv', 'the smallest server', 'bottom', 'wiki/deployment/'));
      s.labels = s.labels!.filter((l) => l.at !== 'coach' && l.at !== 'treas');
      const n = Math.min(9, 1 + Math.round(Math.log10(members) * 2));
      s.people = Array.from({ length: n }, (_, i) => ({ id: `u${i}`, at: [240 + (i % 3) * 22, -40 + Math.floor(i / 3) * 34] as XY, who: 'user' as const, scale: 0.8 }));
      s.labels!.push(lab('u0', `${members.toLocaleString('en-GB')} members`, 'top'));
    });
    stat(ctx, [4, 4, [`${perSec < 1 ? perSec.toFixed(2) : Math.round(perSec)} views a second on match day`, 'made-up'], busy > 100 ? `1 core · 1 GB · asked for ${(busy / 100).toFixed(1)}× what it can answer` : `1 core · 1 GB · ${busy}% busy`]);
    for (let i = 0; i < 3; i++) {
      await h.send([[240, -10], [175, 5]], 'you', { ms: 300 });
      h.set((s) => { s.gear![0]!.lamp = busy > 100 ? 'bad' : 'work'; });
      await h.send([[175, 5], [240, -10]], busy > 100 ? 'bad' : 'model', { ms: 300 });
    }
    h.set((s) => { s.gear![0]!.lamp = busy > 100 ? 'bad' : 'ok'; });
    ctx.say(null, busy > 100
      ? 'Too much for the smallest server: pages slow down and some fail. Now a bigger one pays for itself.'
      : busy < 5 ? 'The smallest server is asleep most of the day. A bigger one would be money for nothing.'
      : 'Still fine on the smallest server. Measure before you buy more.');
  });
}

export async function demo(ctx: Ctx, h: Script) {
  await runCommit(ctx, h, true);
}

export const stackCh: Chapter = {
  steps: {
    commit: { scene: () => commitScene(), enter: (ctx) => void ctx.scene.run((h) => runCommit(ctx, h, true)) },
    github: { scene: () => ghScene(), enter: (ctx) => void ctx.scene.run((h) => runGithub(ctx, h, true)) },
    branch: { scene: () => prScene(), enter: (ctx) => void ctx.scene.run((h) => runBranch(ctx, h, true)) },
    hosting: { scene: () => hostScene(false), enter: (ctx) => void ctx.scene.run((h) => runHosting(ctx, h, false)) },
    specs: { scene: () => hostScene(true), enter: (ctx) => runSpecs(ctx, 0) },
  },
  actions: {
    saved: (ctx, val) => void ctx.scene.run((h) => runCommit(ctx, h, val === 'yes')),
    pushed: (ctx, val) => void ctx.scene.run((h) => runGithub(ctx, h, val === 'yes')),
    branch: (ctx, val) => void ctx.scene.run((h) => runBranch(ctx, h, val === 'yes')),
    host: (ctx, val) => void ctx.scene.run((h) => runHosting(ctx, h, val === 'dynamic')),
  },
  inputs: {
    members: (ctx, val, el) => { el.setAttribute('aria-valuetext', `${SIZES[Number(val)]!.toLocaleString('en-GB')} members`); runSpecs(ctx, Number(val)); },
  },
};
