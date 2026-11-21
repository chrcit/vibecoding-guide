// Lesson 1 (part one): what an AI model is and does. It writes what most likely comes next from
// what is in its window, and from nothing else. What it can take in, the three ways of using it
// (chat, work, coding agent) on one job, and why code is different: it can be run and checked.
// The club and its member list are made up.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, SPOT, type SceneState, type Block } from '../picture';
import { note, readout, lv } from './part1';
import { termLabel } from '../terms';

const toTray = () => route.agentToTray({ at: SPOT.tray, cards: [] });
const stat = readout(['in its window', 'it can reach', 'what comes back']);

const chatScene = (tray = false): SceneState => solo({
  tray: tray ? [] : undefined,
  labels: [
    lab('you', 'you', 'left'),
    termLabel('a0', 'model'),
    termLabel('tank:a0', 'window', 'left', 'its window'),
  ],
});

// ---------- predict: it only has the window ----------

async function runPredict(ctx: Ctx, h: Script, withList: boolean, first = false) {
  note(ctx, 'ai', 'predict');
  ctx.screen.setup({ form: 'chat' });
  // The first time on this page: the chat alone, as the reader knows it. Then the picture of what
  // was behind it all along.
  const reveal = first && !ctx.keep.revealed;
  if (reveal) { ctx.keep.revealed = true; ctx.screen.focus('screen'); }
  h.set((s) => Object.assign(s, chatScene()));
  stat(ctx, [withList ? 'your question and the list' : 'your question', 'nothing else', '…']);
  ctx.say('you', withList ? 'Who has not paid this season? [the member list, 40 rows, pasted below]' : 'Who in my club has not paid this season?');
  await h.send(route.youToAgent(), 'you', { ms: 520 });
  h.set((s) => {
    const a = s.agents[0]!;
    a.blocks = withList ? [{ t: 'you', h: 9 }, { t: 'you', h: 2 }] : [{ t: 'you', h: 2 }];
    s.labels![2] = termLabel('tank:a0', 'window', 'left', withList ? 'its window: question + 40 members' : 'its window: your question');
    a.busy = true; a.scan = true;
  });
  await h.wait(1300);
  h.set((s) => { const a = s.agents[0]!; a.scan = false; a.busy = false; a.blocks!.push({ t: withList ? 'model' : 'bad', h: 3 }); });
  await h.send(reverse(route.youToAgent()), withList ? 'model' : 'bad', { ms: 520 });
  ctx.say('model', withList
    ? '7 have not paid: Ana Ruiz, Ben Okafor, Dev Patel and 4 more.'
    : 'Ana Ruiz, Ben Okafor and Clara Novak have not paid yet.');
  stat(ctx, [withList ? 'your question and the list' : 'your question', 'nothing else', withList ? '7 names, from your list' : '3 names, made up']);
  if (reveal) {
    await h.wait(1600);
    ctx.screen.focus('both');
    ctx.say(null, 'Behind the screen: its window, holding your question and nothing else.');
    await h.wait(2600);
  }
  await h.wait(2200);
  ctx.say(null, withList
    ? 'Every name came from the list in its window.'
    : 'Three names that sound right. It never saw your club, so it made them up.');
}

// ---------- inputs: voice, photo, recording, a decision ----------

type Input = 'voice' | 'photo' | 'video' | 'decide';
const INPUTS: Record<Input, { you: string; slab: Block; window: string; reply: string; card: string; back: string }> = {
  voice: {
    you: '[a 2-minute voice note, recorded on the walk home]',
    slab: { t: 'you', h: 6 }, window: 'its window: the note as text',
    reply: 'Six to-dos: book the hall for 12 March, chase 7 unpaid members, order 10 boards…',
    card: '6 to-dos', back: 'a to-do list',
  },
  photo: {
    you: '[a photo of the paper sign-up sheet] Type this up as a list.',
    slab: { t: 'you', h: 5 }, window: 'its window: the photo',
    reply: '14 rows: name, date joined, paid or not. Row 9 is hard to read: is it “Lena” or “Lina”?',
    card: '14 rows', back: '14 rows and one question',
  },
  video: {
    you: '[a 40-second screen recording] This is how I update the spreadsheet each week.',
    slab: { t: 'you', h: 10 }, window: 'its window: the recording',
    reply: 'You do the same 5 steps each week. Steps 2 to 4 could be one button.',
    card: '5 steps', back: 'the steps, written out',
  },
  decide: {
    you: 'A spreadsheet or a small app for 40 members? Give me the trade-offs.',
    slab: { t: 'you', h: 2.5 }, window: 'its window: your question',
    reply: 'A spreadsheet is free and you know it. An app can show the coach who has paid without giving him the sheet. One question: who else needs to see it?',
    card: 'trade-offs', back: 'two options and a question',
  },
};

function runInput(ctx: Ctx, kind: Input) {
  const c = INPUTS[kind];
  note(ctx, 'ai', 'inputs');
  ctx.screen.setup({ form: 'chat' });
  void ctx.scene.run(async (h) => {
    h.set((s) => {
      Object.assign(s, chatScene(true));
      s.labels!.push(lab('tray', 'what comes back', 'right'));
    });
    stat(ctx, [c.window.replace('its window: ', ''), 'nothing else', '…']);
    ctx.say('you', c.you);
    await h.send(route.youToAgent(), 'you', { ms: 480 });
    h.set((s) => {
      const a = s.agents[0]!;
      a.blocks = [{ ...c.slab }];
      s.labels![2] = termLabel('tank:a0', 'window', 'left', c.window);
      a.busy = true; a.scan = true;
    });
    await h.wait(1100);
    h.set((s) => { const a = s.agents[0]!; a.busy = false; a.scan = false; a.blocks!.push({ t: 'model', h: 3 }); });
    await h.send(toTray(), 'model', { ms: 520 });
    h.set((s) => { s.tray!.cards = [{ id: 'back', }]; s.labels![3] = lab('card:back', c.card, 'right'); });
    ctx.say('model', c.reply);
    stat(ctx, [c.window.replace('its window: ', ''), 'nothing else', c.back]);
  });
}

// ---------- modes: chat, work, coding agent, on the same job ----------

type Mode = 'chat' | 'work' | 'agent';
const JOB = 'Make the member list show who has not paid.';

function runMode(ctx: Ctx, mode: Mode) {
  note(ctx, 'ai', 'modes');
  // The same job in the app each mode is used in: a chat, a chat with your files connected, T3 Code.
  ctx.screen.setup(mode === 'agent' ? { form: 't3', app: 'T3 Code', project: 'club-list', chips: [] } : { form: 'chat', app: 'Chat', project: undefined, chips: mode === 'work' ? ['Drive connected'] : [] });
  void ctx.scene.run(async (h) => {
    if (mode === 'chat') {
      h.set((s) => { Object.assign(s, chatScene(true)); s.labels!.push(lab('tray', 'what comes back', 'right')); });
      stat(ctx, ['your message', 'nothing else', '…']);
      ctx.say('you', JOB);
      await h.send(route.youToAgent(), 'you', { ms: 420 });
      h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'you', h: 2 }]; a.busy = true; });
      await h.wait(800);
      h.set((s) => { const a = s.agents[0]!; a.busy = false; a.blocks!.push({ t: 'model', h: 5 }); });
      await h.send(toTray(), 'model', { ms: 480 });
      h.set((s) => { s.tray!.cards = [{ id: 'code', }]; s.labels![3] = lab('card:code', 'code to copy', 'right'); });
      ctx.say('model', 'Here is the code. Paste it into your file and tell me if anything breaks.');
      stat(ctx, ['your message', 'nothing else', 'code you copy and try']);
      await h.wait(2000);
      ctx.say(null, 'You carry the code to the file, open it, and carry any error back.');
      return;
    }
    if (mode === 'work') {
      h.set((s) => Object.assign(s, solo({
        tools: ['search', 'read', 'write'],
        tray: [],
        labels: [
          lab('you', 'you', 'left'),
          termLabel('a0', 'model'),
          lab('tools', 'search · your files · write', 'top', 'wiki/connector/'),
          lab('tray', 'what comes back', 'right'),
        ],
      })));
      stat(ctx, ['your message', 'the web, files you connect', '…']);
      ctx.say('you', JOB + ' The list is members.xlsx in my Drive.');
      await h.send(route.youToAgent(), 'you', { ms: 420 });
      h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'you', h: 2 }]; a.busy = true; });
      for (const [tool, hgt] of [['read', 5], ['write', 2]] as const) {
        ctx.screen.row(tool === 'read' ? 'read' : 'edit', tool === 'read' ? 'Read members.xlsx' : 'Changed members.xlsx');
        h.set((s) => { s.tools!.on = tool; });
        await h.send(route.agentToTool({ at: SPOT.tools, ids: ['search', 'read', 'write'] }, tool), 'model', { ms: 360 });
        h.set((s) => { s.agents[0]!.blocks!.push({ t: 'tool', h: hgt }); s.tools!.on = null; });
      }
      h.set((s) => { const a = s.agents[0]!; a.busy = false; a.blocks!.push({ t: 'model', h: 2 }); });
      await h.send(toTray(), 'tool', { ms: 480 });
      h.set((s) => { s.tray!.cards = [{ id: 'sheet', b: 'tool', }]; s.labels![3] = lab('card:sheet', 'members.xlsx, new column', 'right'); });
      ctx.say('model', 'I added an “Unpaid” column to members.xlsx and coloured the 7 rows. It is in your Drive.');
      stat(ctx, ['your message, the sheet', 'the web, files you connect', 'a changed spreadsheet']);
      await h.wait(2000);
      ctx.say(null, 'It reached your file and wrote to it. It ran nothing, and nothing checked it.');
      return;
    }
    h.set((s) => Object.assign(s, solo({
      tools: true,
      project: true,
      gate: true,
      labels: [
        lab('you', 'you', 'left'),
        termLabel('a0', 'model'),
        termLabel('tools', 'tools'),
        termLabel('project', 'project'),
        termLabel('gate', 'check', 'right'),
      ],
    })));
    stat(ctx, ['your message', 'your project folder', '…']);
    ctx.say('you', JOB);
    await h.send(route.youToAgent(), 'you', { ms: 400 });
    h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'you', h: 2 }]; a.lamp = 'work'; });
    const steps: [string, number, 'read' | 'edit' | ''][] = [['read', 0, 'read'], ['edit', 2, 'edit'], ['run', -1, '']];
    for (const [tool, file, mark] of steps) {
      h.set((s) => { s.agents[0]!.busy = true; s.tools!.on = tool; if (file >= 0 && mark) { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = mark; } });
      if (tool === 'read') ctx.screen.row('read', 'Read members.ts');
      else if (tool === 'edit') ctx.screen.row('edit', 'Changed members.ts', 'an “unpaid” filter');
      else ctx.screen.row('run', 'Ran command', lv(ctx, 'opened the page and tried it', 'npm test', 'npm test && npx tsc --noEmit'));
      await h.wait(620);
      h.set((s) => { s.agents[0]!.busy = false; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'tool', h: tool === 'run' ? 3 : 2 }); });
    }
    await h.send(route.agentToGate(), 'model', { ms: 340 });
    h.set((s) => { s.gates![0]!.lamp = 'ok'; s.agents[0]!.lamp = 'ok'; });
    await h.send(route.gateToYou(), 'model', { ms: 340 });
    ctx.say('model', lv(ctx,
      'Done. The list now has an “Unpaid” button. I tried it: 7 of 40 show.',
      'Done. Edited members.ts and members.test.ts. npm test: 6 passed. tsc --noEmit: no errors.',
      'Done. Pure filter in members.ts, UI wired in App.tsx. 6 tests (incl. empty list) pass; tsc --noEmit clean. Diff: 2 files, +38 −4.'));
    stat(ctx, [lv(ctx, 'message, 2 files, the test run', 'message, 2 files, npm test output'), 'your project folder', 'the page, changed and tried']);
  });
}

// ---------- code: it can be run ----------

async function runCode(ctx: Ctx, h: Script, what: 'letter' | 'page') {
  note(ctx, 'ai', 'code');
  ctx.screen.setup({ form: 't3', project: 'club-list' });
  h.set((s) => Object.assign(s, solo({
    tools: true,
    project: true,
    gate: true,
    labels: [
      lab('you', 'you', 'left'),
      termLabel('a0', 'model'),
      termLabel('gate', 'check', 'right'),
      termLabel('project', 'project'),
    ],
  })));
  const page = what === 'page';
  stat(ctx, [page ? 'the list, the code' : 'the list', page ? 'your project, a test run' : 'nothing else', '…']);
  ctx.say('you', page ? 'Show at the top how many have not paid.' : 'Write a short letter to members who have not paid.');
  await h.send(route.youToAgent(), 'you', { ms: 400 });
  h.set((s) => { const a = s.agents[0]!; a.blocks = [{ t: 'you', h: 6 }, { t: 'you', h: 2 }]; a.busy = true; a.lamp = 'work'; });
  await h.wait(800);
  h.set((s) => { const a = s.agents[0]!; a.busy = false; a.blocks!.push({ t: 'model', h: 3 }); });
  if (!page) {
    await h.send(route.agentToGate(), 'bad', { ms: 340 });
    ctx.say('check', 'Nothing to run. A letter goes straight through.');
    await h.send(route.gateToYou(), 'bad', { ms: 340 });
    h.set((s) => { s.agents[0]!.lamp = 'off'; });
    ctx.say('model', 'Dear member, our records show 8 of you have not yet paid…');
    stat(ctx, ['the list', 'nothing else', 'a letter: you are the check']);
    await h.wait(2200);
    ctx.say(null, 'The list says 7. The letter says 8. Only you can notice.');
    return;
  }
  await h.send(route.agentToGate(), 'bad', { ms: 340 });
  h.set((s) => { s.gates![0]!.lamp = 'bad'; });
  ctx.say('check', lv(ctx, 'Tried it: the page says 8 unpaid, the list has 7.', 'npm test: 1 failed. unpaidCount: expected 7, got 8.', 'npm test: 1 failed. unpaidCount counts a member twice when they have two seasons.'));
  stat(ctx, ['the list, the code', 'your project, a test run', 'sent back: 8 ≠ 7']);
  await h.wait(1300);
  await h.send(reverse(route.agentToGate()), 'bad', { ms: 340 });
  h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'bad', h: 2 }); a.busy = true; });
  await h.wait(800);
  h.set((s) => { const a = s.agents[0]!; a.busy = false; a.blocks!.push({ t: 'tool', h: 2 }); });
  await h.send(route.agentToGate(), 'model', { ms: 340 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; s.agents[0]!.lamp = 'ok'; });
  await h.send(route.gateToYou(), 'model', { ms: 340 });
  ctx.say('check', lv(ctx, 'Tried again: 7 unpaid, matches the list.', 'npm test: 6 passed.', 'npm test: 6 passed, including the two-seasons case.'));
  stat(ctx, ['the list, the code', 'your project, a test run', 'the page, count checked: 7']);
  await h.wait(1800);
  ctx.say(null, 'The wrong count never reached you. The check caught it and sent it back.');
}

export async function demo(ctx: Ctx, h: Script) {
  await runPredict(ctx, h, false);
  await h.wait(1200);
  await runPredict(ctx, h, true);
}

export const aiCh: Chapter = {
  steps: {
    predict: { scene: () => chatScene(), enter: (ctx) => void ctx.scene.run((h) => runPredict(ctx, h, false, true)) },
    inputs: { scene: () => chatScene(true), enter: (ctx) => runInput(ctx, 'voice') },
    modes: { scene: () => chatScene(true), enter: (ctx) => runMode(ctx, 'chat') },
    code: { scene: () => chatScene(), enter: (ctx) => void ctx.scene.run((h) => runCode(ctx, h, 'page')) },
  },
  actions: {
    list: (ctx, val) => void ctx.scene.run((h) => runPredict(ctx, h, val === 'in')),
    input: (ctx, val) => runInput(ctx, val as Input),
    mode: (ctx, val) => runMode(ctx, val as Mode),
    what: (ctx, val) => void ctx.scene.run((h) => runCode(ctx, h, val as 'letter' | 'page')),
  },
};
