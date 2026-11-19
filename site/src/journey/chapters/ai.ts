// Chapter 1 (Part 1: Foundations): What AI is and what it can do.
// Behind the scenes of token prediction, multimodal senses (voice, image, video, transcription, decisions),
// and what changes between Chat, Work and Coding Agent modes.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, type SceneState } from '../picture';

type Sense = 'voice' | 'image' | 'video' | 'decide';
type Mode = 'chat' | 'work' | 'agent';

const baseChat = (): SceneState =>
  solo({
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'AI model', 'top', 'wiki/model/'),
      lab('tank:a0', 'window', 'left', 'wiki/context-window/'),
    ],
  });

const baseWork = (): SceneState =>
  solo({
    tools: ['search', 'read'],
    tray: [{ id: 'doc', mark: 'work' }, { id: 'note', mark: 'ok' }],
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'AI in Work mode', 'top', 'wiki/model/'),
      lab('tools', 'search & files', 'top', 'wiki/tool-call/'),
      lab('tray', 'drafts', 'right'),
    ],
  });

const baseAgent = (): SceneState =>
  solo({
    tools: true,
    project: { rules: 'plain' },
    gate: true,
    labels: [
      lab('you', 'you', 'left'),
      lab('a0', 'coding agent', 'top', 'wiki/agent/'),
      lab('tools', 'tools', 'top', 'wiki/tool-call/'),
      lab('project', 'your project', 'top'),
      lab('gate', 'check', 'right', 'wiki/verification/'),
    ],
  });

async function runPredict(ctx: Ctx, h: Script) {
  h.set((s) => Object.assign(s, baseChat()));
  ctx.model(
    'Behind the scenes.',
    byLevel(ctx.level, {
      plain: 'An AI model does not store facts in a secret brain between chats. It reads everything in the window and predicts the most useful next words one piece at a time.',
      technical: 'Every turn sends the full token sequence in the window to a stateless model. Quality depends directly on the clarity and relevance of what sits in that window.',
      engineer: 'Autoregressive inference over the prompt prefix: no hidden mutable memory exists outside serialized context tokens and external tool state.',
    }),
  );
  const prompt = byLevel(ctx.level, {
    plain: 'Summarise these three club meeting notes into five action items.',
    technical: 'Extract the API fields from this JSON sample into a TypeScript interface.',
    engineer: 'Compare SQLite vs Postgres for a single-tenant app with 50k rows and write-light traffic.',
  });
  ctx.say('you', prompt);
  ctx.stat([['step', '1. send prompt'], ['memory outside window', 'none']]);
  await h.send(route.youToAgent(), 'you', { ms: 460 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 4 }]; s.agents[0]!.busy = true; s.agents[0]!.scan = true; });
  ctx.stat([['step', '2. read full window'], ['mode', 'next-token prediction']]);
  await h.wait(950);
  h.set((s) => { s.agents[0]!.scan = false; s.agents[0]!.busy = false; s.agents[0]!.blocks!.push({ t: 'model', h: 5 }); });
  ctx.say('AI model', byLevel(ctx.level, {
    plain: 'Five clear actions written from your notes—one piece of text predicted after the next.',
    technical: 'Generated interface MemberRecord with typed fields directly from the tokens in the window.',
    engineer: 'Trade-off matrix generated from training priors + your constraints in the prompt window.',
  }));
  await h.send(reverse(route.youToAgent()), 'model', { ms: 460 });
  ctx.stat([['step', '3. reply streamed'], ['outside effects', 'none yet']]);
}

const SENSE_COPY: Record<Sense, { label: string; you: string; reply: string; stat: [string, string][]; model: Record<'plain' | 'technical' | 'engineer', string> }> = {
  voice: {
    label: 'Voice & transcription',
    you: '“Record a 2-minute voice ramble about the booking page I want, then turn it into a clean spec.”',
    reply: 'Transcribed speech → structured requirements list with open questions.',
    stat: [['input', 'spoken audio'], ['output', 'clean spec / prompt'], ['best on', 'phone or laptop mic']],
    model: {
      plain: 'Talking is 3× faster than typing. Speak messy thoughts on your phone or laptop and let transcription turn them into a clear brief before you build.',
      technical: 'Speech-to-text turns rough domain walkthroughs into structured markdown specs and acceptance criteria with far richer context than short typed prompts.',
      engineer: 'Use voice transcription for high-bandwidth problem framing and edge-case capture; feed the distilled spec—never raw rambling transcripts—into coding sessions.',
    },
  },
  image: {
    label: 'Images & screenshots',
    you: 'Pasting a phone screenshot of a broken button + a rough napkin sketch of the layout.',
    reply: 'Spotted the clipped button at 390 px width and matched the layout from your sketch.',
    stat: [['input', 'screenshot / sketch'], ['output', 'visual critique or asset'], ['best for', 'UI bugs & design']],
    model: {
      plain: 'You don’t need CSS vocabulary to report a visual bug—drop a screenshot in and point at what looks wrong.',
      technical: 'Multimodal models inspect rendered screenshots to catch layout overflow, contrast issues, and responsive regressions alongside DOM checks.',
      engineer: 'Pair headless browser screenshots with visual inspection loops so UI regressions surface as concrete pixel/layout artifacts rather than vague text descriptions.',
    },
  },
  video: {
    label: 'Video & recordings',
    you: 'Uploading a 45-second screen recording of a clunky checkout flow.',
    reply: 'Timestamped 3 friction points: slow validation at 0:14, hidden total at 0:28, double-click submit at 0:39.',
    stat: [['input', 'screen / demo video'], ['output', 'timestamped findings'], ['best for', 'flows & usability']],
    model: {
      plain: 'Record your screen while using an app or competitor flow—AI can watch the sequence and list every awkward step.',
      technical: 'Video and audio inputs compress multi-step reproduction steps into ordered bug reports and test cases you can hand straight to a coding agent.',
      engineer: 'Use short flow recordings to bridge UX observation and reproducible E2E test specifications.',
    },
  },
  decide: {
    label: 'Reasoning & decisions',
    you: '“Should we build a simple web form or a full login app for 40 club members? Show the trade-offs.”',
    reply: 'Compared maintenance, privacy, cost and effort—recommended a simple password-protected page first.',
    stat: [['input', 'constraints & goals'], ['output', 'options & risks'], ['best for', 'before you build']],
    model: {
      plain: 'Use AI to think through options before building anything—good questions up front save hours of rebuilding the wrong thing.',
      technical: 'Reasoning models are strongest when comparing trade-offs, spotting missing edge cases, and drafting a test plan before writing code.',
      engineer: 'Spend reasoning budget on architecture boundaries, data models, failure modes and stack selection before delegating implementation.',
    },
  },
};

function runSense(ctx: Ctx, sense: Sense) {
  const c = SENSE_COPY[sense];
  ctx.model(`${c.label}.`, c.model[ctx.level]);
  void ctx.scene.run(async (h) => {
    h.set((s) => {
      Object.assign(s, baseWork());
      s.labels = [
        lab('you', 'you', 'left'),
        lab('a0', 'multimodal AI', 'top', 'wiki/model/'),
        lab('tools', c.label, 'top', 'wiki/voice-input/'),
        lab('tray', 'result', 'right'),
      ];
    });
    ctx.stat(c.stat);
    ctx.say('you', c.you);
    await h.send(route.youToAgent(), 'you', { ms: 400 });
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 4 }]; s.agents[0]!.busy = true; s.tools!.on = 'read'; });
    await h.wait(650);
    h.set((s) => { s.agents[0]!.busy = false; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'tool', h: 3 }, { t: 'model', h: 4 }); s.tray!.cards = [{ id: 'doc', mark: 'ok' }, { id: 'note', mark: 'ok' }]; });
    ctx.say('AI', c.reply);
    await h.send(reverse(route.youToAgent()), 'model', { ms: 400 });
  });
}

function runMode(ctx: Ctx, mode: Mode) {
  ctx.model(
    mode === 'chat' ? 'Chat mode.' : mode === 'work' ? 'Work mode.' : 'Coding agent mode.',
    mode === 'chat'
      ? byLevel(ctx.level, {
          plain: 'Best for quick questions, learning, and drafting text. It cannot touch your files—you copy and paste anything you want to keep.',
          technical: 'Stateless text exchange: great for isolated explanations or snippets, slow for multi-file software because you act as the manual copy-paste bridge.',
          engineer: 'Zero tool integration: acceptable for design Q&A, poor for implementation because there is no repository ground truth or execution feedback.',
        })
      : mode === 'work'
        ? byLevel(ctx.level, {
            plain: 'Best for real-world desk work: reading PDFs, searching the web, organising notes, drafting emails and weighing decisions. Still stops short of editing and testing real software.',
            technical: 'Adds search, document readers, canvas artifacts and connectors (Drive, Slack, email)—great for specs and research, not wired to your local git repo or test runner.',
            engineer: 'Tool-augmented knowledge work with web/document connectors: use it for requirements synthesis and stakeholder artifacts, then hand crisp specs to a coding harness.',
          })
        : byLevel(ctx.level, {
            plain: 'Connected straight to your project folder and tools. It reads files, makes changes, runs the app to verify it works, and fixes mistakes before coming back to you.',
            technical: 'Runs inside your workspace with read/edit/search/shell tools: it edits multiple files, runs `tsc --noEmit` and unit tests, reads real errors, and loops until checks pass.',
            engineer: 'Closed-loop software execution: grounded in your repo, version-controlled in git, gated by deterministic compilers/tests/browsers, and composable across subagents.',
          }),
  );

  void ctx.scene.run(async (h) => {
    if (mode === 'chat') {
      h.set((s) => Object.assign(s, baseChat()));
      ctx.stat([['mode', 'Chat'], ['touches files', 'no'], ['runs checks', 'no']]);
      ctx.say('you', 'Write me a simple HTML page for our club schedule.');
      await h.send(route.youToAgent(), 'you', { ms: 400 });
      h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }, { t: 'model', h: 5 }]; });
      ctx.say('AI', 'Here is a code block—copy it, save it yourself, and tell me if anything breaks.');
      await h.send(reverse(route.youToAgent()), 'model', { ms: 400 });
      return;
    }
    if (mode === 'work') {
      h.set((s) => Object.assign(s, baseWork()));
      ctx.stat([['mode', 'Work'], ['tools', 'web search & docs'], ['runs your app', 'no']]);
      ctx.say('you', 'Read our 3 meeting PDFs, check venue prices online, and draft the season plan.');
      await h.send(route.youToAgent(), 'you', { ms: 400 });
      h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }]; s.agents[0]!.busy = true; s.tools!.on = 'search'; });
      await h.wait(550);
      h.set((s) => { s.tools!.on = 'read'; s.agents[0]!.blocks!.push({ t: 'tool', h: 4 }); });
      await h.wait(550);
      h.set((s) => { s.agents[0]!.busy = false; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'model', h: 4 }); s.tray!.cards = [{ id: 'doc', mark: 'ok' }, { id: 'note', mark: 'ok' }]; });
      ctx.say('AI', 'Season plan drafted from your PDFs and live search results. Ready for your review.');
      await h.send(reverse(route.youToAgent()), 'model', { ms: 400 });
      return;
    }
    h.set((s) => Object.assign(s, baseAgent()));
    ctx.stat([['mode', 'Coding agent'], ['touches files', 'yes (in repo)'], ['runs checks', byLevel(ctx.level, { plain: 'tests & preview', technical: 'tsc + unit tests', engineer: 'types + tests + E2E' })]]);
    ctx.say('you', byLevel(ctx.level, {
      plain: 'Add a filter by month to the club schedule page and check that it works.',
      technical: 'Add month filtering to schedule.ts, run tsc --noEmit and vitest, and fix any failures.',
      engineer: 'Extract pure filterByMonth(events, month) with strict types, unit tests, and UI wiring.',
    }));
    await h.send(route.youToAgent(), 'you', { ms: 380 });
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }]; s.agents[0]!.lamp = 'work'; });
    for (const [tool, file] of [['read', 0], ['edit', 2], ['run', -1]] as const) {
      h.set((s) => { s.agents[0]!.busy = true; s.tools!.on = tool; if (file >= 0) { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[file] = tool === 'edit' ? 'edit' : 'read'; } });
      await h.wait(420);
      h.set((s) => { s.agents[0]!.busy = false; s.tools!.on = null; s.agents[0]!.blocks!.push({ t: 'tool', h: 3 }); });
    }
    await h.send(route.agentToGate(), 'model', { ms: 320 });
    h.set((s) => { s.gates![0]!.lamp = 'ok'; s.agents[0]!.lamp = 'ok'; });
    await h.send(route.gateToYou(), 'model', { ms: 320 });
    ctx.say('coding agent', byLevel(ctx.level, {
      plain: 'Updated the schedule page, tested switching months in a browser—filter works.',
      technical: 'Edited schedule.ts + schedule.test.ts. tsc --noEmit clean, 12/12 unit tests pass.',
      engineer: 'Pure filter module extracted, strict types & edge-case tests green, diff ready.',
    }));
  });
}

async function runBridge(ctx: Ctx, h: Script) {
  h.set((s) => Object.assign(s, baseAgent()));
  ctx.model(
    'Why code is different.',
    byLevel(ctx.level, {
      plain: 'An essay is always a matter of opinion, so AI can sound confident while being subtly wrong. Code actually runs—if a button breaks or a number is wrong, a check catches it right away.',
      technical: 'Software gives the model an objective oracle: compilers, typecheckers, unit tests and real browsers turn hallucinated code into concrete stack traces the agent can fix.',
      engineer: 'Executable feedback loops separate coding agents from general LLM chat: deterministic verifiers bound error rates across multi-step autonomous trajectories.',
    }),
  );
  ctx.stat([
    ['prose / chat', 'checked by opinion'],
    ['software', byLevel(ctx.level, { plain: 'checked by running it', technical: 'checked by tsc + tests', engineer: 'checked by deterministic oracle' })],
  ]);
  await h.send(route.youToAgent(), 'you', { ms: 360 });
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 2.5 }, { t: 'tool', h: 4 }]; s.agents[0]!.lamp = 'work'; });
  await h.send(route.agentToGate(), 'bad', { ms: 320 });
  h.set((s) => { s.gates![0]!.lamp = 'bad'; });
  ctx.say('check', byLevel(ctx.level, {
    plain: 'Caught a mistake: clicking “Next month” crashed the page. Sent straight back to fix.',
    technical: 'FAIL: TypeError in schedule.test.ts line 18 (undefined month). Returning stack trace.',
    engineer: 'Invariant failed: month index 12 overflowed year rollover. Agent re-enters fix loop.',
  }));
  await h.wait(900);
  await h.send(reverse(route.agentToGate()), 'bad', { ms: 320 });
  h.set((s) => { s.agents[0]!.busy = true; s.agents[0]!.blocks!.push({ t: 'bad', h: 2 }, { t: 'tool', h: 2.5 }); });
  await h.wait(650);
  h.set((s) => { s.agents[0]!.busy = false; });
  await h.send(route.agentToGate(), 'model', { ms: 320 });
  h.set((s) => { s.gates![0]!.lamp = 'ok'; s.agents[0]!.lamp = 'ok'; });
  await h.send(route.gateToYou(), 'model', { ms: 320 });
  ctx.say('check', 'Fixed and verified. That feedback loop is why coding agents work so well.');
}

export async function demo(ctx: Ctx, h: Script) {
  await runBridge(ctx, h);
}

export const aiCh: Chapter = {
  steps: {
    predict: { scene: () => baseChat(), enter: (ctx) => void ctx.scene.run((h) => runPredict(ctx, h)) },
    senses: { scene: () => baseWork(), enter: (ctx) => runSense(ctx, 'voice') },
    modes: { scene: () => baseChat(), enter: (ctx) => runMode(ctx, 'chat') },
    bridge: { scene: () => baseAgent(), enter: (ctx) => void ctx.scene.run((h) => runBridge(ctx, h)) },
  },
  actions: {
    sense: (ctx, val) => runSense(ctx, val as Sense),
    mode: (ctx, val) => runMode(ctx, val as Mode),
  },
};
