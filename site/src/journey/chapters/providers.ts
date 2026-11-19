// Chapter 2 (Part 1: Foundations): Providers, models, where AI runs, and devices (laptop, desktop, phone).
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, jobs, lab } from '../presets';
import { route, reverse, type SceneState } from '../picture';

type LabId = 'anthropic' | 'openai' | 'google' | 'local';
type RunAt = 'cloud' | 'local';
type Surface = 'web' | 'desktop' | 'cli' | 'api';
type Device = 'phone' | 'laptop' | 'desktop';

const LABS: Record<LabId, { name: string; models: string; tools: string; note: Record<'plain' | 'technical' | 'engineer', string> }> = {
  anthropic: {
    name: 'Anthropic (Claude)',
    models: 'Claude Opus, Sonnet, Haiku',
    tools: 'claude.ai, Claude app, Claude Code, T3 Code',
    note: {
      plain: 'Makes the Claude models. You can chat on the web or phone, or connect Claude directly to your project folder via Claude Code or T3 Code.',
      technical: 'Provides Claude models via monthly Pro/Max plans or API, plus the Claude Code CLI and full support inside multi-provider apps like T3 Code.',
      engineer: 'Strong instruction adherence and long-horizon editing; supports prompt caching, extended thinking budgets, and clean CLI/SDK/MCP integration.',
    },
  },
  openai: {
    name: 'OpenAI (GPT & Codex)',
    models: 'GPT series & Codex coding models',
    tools: 'ChatGPT web/app, Codex app & CLI, T3 Code',
    note: {
      plain: 'Makes ChatGPT and Codex. You can use voice and chat on your phone, or run coding agents locally and in cloud sandboxes.',
      technical: 'Offers ChatGPT Plus/Pro plans and API access; Codex CLI and cloud tasks integrate cleanly with GitHub repos and multi-provider harnesses like T3 Code.',
      engineer: 'Pair an OpenAI model with a different vendor’s model for cross-lab diff review (step 15) to reduce correlated blind spots.',
    },
  },
  google: {
    name: 'Google (Gemini)',
    models: 'Gemini Pro & Flash models',
    tools: 'Gemini web/app, AI Studio, Gemini CLI, API',
    note: {
      plain: 'Makes Gemini, with strong voice, video and huge reading windows—great for throwing in long documents, recordings or whole folders.',
      technical: 'Large context windows and native multimodal (audio/video/image) ingestion via Gemini app, CLI and API, with fast Flash tiers for high-volume tasks.',
      engineer: 'Useful for multimodal ingestion (screen recordings, PDFs, large repo surveys) and cost-effective high-throughput subagent routing via Flash tiers.',
    },
  },
  local: {
    name: 'Open-weight / Local',
    models: 'Qwen, Llama, DeepSeek, Gemma',
    tools: 'Ollama, LM Studio, llama.cpp',
    note: {
      plain: 'Models you download and run right on your own desktop PC or high-memory Mac. Nothing leaves your computer, though top cloud models are still stronger on hard tasks.',
      technical: 'Open-weight models run via Ollama or LM Studio on local Apple Silicon or NVIDIA GPUs—zero per-token cost and strict privacy, bounded by your VRAM.',
      engineer: 'Ideal for air-gapped data, offline autocomplete or cheap classification; benchmark against frontier cloud models before relying on local weights for complex multi-file refactors.',
    },
  },
};

function runLab(ctx: Ctx, id: LabId) {
  const l = LABS[id];
  ctx.model(`${l.name}.`, l.note[ctx.level]);
  void ctx.scene.run(async (h) => {
    h.set((s) => Object.assign(s, jobs(1, {
      projects: 'one',
      machines: [id === 'local' ? 'box' : 'cloud'],
      trees: false,
      labels: [
        lab('you', 'you', 'left'),
        lab('j0', l.name, 'top', 'wiki/model/'),
        lab('zone:0', id === 'local' ? 'your GPU' : 'provider cloud', 'bottom'),
        lab('project', 'your files', 'top'),
      ],
    })));
    ctx.stat([['provider', l.name], ['models', l.models], ['access via', l.tools]]);
    ctx.say(null, `${l.name} — available through ${l.tools}. You are not locked into one lab.`);
    await h.wait(400);
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'you', h: 3 }, { t: 'model', h: 4 }]; s.agents[0]!.lamp = 'ok'; });
  });
}

function runWhere(ctx: Ctx, at: RunAt) {
  ctx.model(
    at === 'cloud' ? 'Cloud brain, local files.' : 'Local brain, local files.',
    at === 'cloud'
      ? byLevel(ctx.level, {
          plain: 'Even when a coding agent edits files on your laptop, the AI brain runs on the provider’s servers. Only the parts of files the agent opens are sent across—not your whole hard drive.',
          technical: 'The harness runs locally on your machine (executing git, tsc, vitest) while sending prompt + tool outputs over HTTPS to the provider’s inference servers.',
          engineer: 'Clear split between control plane/execution (local machine + shell) and inference plane (provider API). Keep `.env` secrets out of tool reads and check zero-data-retention policies for work repos.',
        })
      : byLevel(ctx.level, {
          plain: 'Running a model locally keeps every word on your own computer—great for private notes or offline flights, as long as your desktop or Mac has enough memory.',
          technical: 'Inference and tool execution both stay on localhost (e.g., Ollama on a 32–64 GB Mac or RTX GPU). Zero network calls, bounded by local memory bandwidth and model size.',
          engineer: 'Full data residency with predictable hardware CapEx, trading off frontier reasoning depth and context-window speed against local VRAM ceilings.',
        }),
  );
  void ctx.scene.run(async (h) => {
    h.set((s) => Object.assign(s, jobs(2, {
      projects: 'one',
      gap: 92,
      machines: at === 'cloud' ? ['laptop', 'cloud'] : ['box', 'box'],
      trees: false,
      labels: [
        lab('you', 'you', 'left'),
        lab('j0', 'harness & tools', 'top', 'wiki/harness/'),
        lab('j1', at === 'cloud' ? 'AI model' : 'local model', 'top', 'wiki/model/'),
        lab('zone:0', 'your computer', 'bottom'),
        lab('zone:1', at === 'cloud' ? 'provider data centre' : 'same computer GPU', 'bottom'),
        lab('project', 'your files', 'top'),
      ],
    })));
    ctx.stat(at === 'cloud'
      ? [['your files', 'on your computer'], ['AI thinking', 'provider GPU servers'], ['internet needed', 'yes']]
      : [['your files', 'on your computer'], ['AI thinking', 'your own GPU / RAM'], ['internet needed', 'no']]);
    ctx.say(null, at === 'cloud'
      ? 'Your harness opens files and runs commands locally; only the conversation and read snippets travel to the cloud model.'
      : 'Everything stays on your desk—both your files and the model weights live on the same machine.');
    h.set((s) => { s.agents[0]!.blocks = [{ t: 'tool', h: 4 }]; s.agents[1]!.blocks = [{ t: 'you', h: 3 }, { t: 'model', h: 4 }]; s.agents[1]!.busy = true; });
    await h.wait(700);
    h.set((s) => { s.agents[1]!.busy = false; s.agents[0]!.lamp = 'ok'; s.agents[1]!.lamp = 'ok'; });
  });
}

const SURFACES: Record<Surface, { title: string; say: string; stat: [string, string][]; model: Record<'plain' | 'technical' | 'engineer', string> }> = {
  web: {
    title: 'Web & phone app',
    say: 'Open claude.ai, ChatGPT or Gemini in a browser or phone app—zero setup, instant chat, voice and document work.',
    stat: [['setup', 'none (just sign in)'], ['best for', 'chat, voice, specs, research'], ['edits local repo', 'no']],
    model: {
      plain: 'Start here for brainstorming, voice notes and learning. Move to a desktop app when you want the AI to build inside your own project folder.',
      technical: 'Zero-friction surface for research, drafting specs and quick questions—switch to a local harness once you need git commits and test runs.',
      engineer: 'Use web/mobile clients for asynchronous planning and reading; avoid copy-pasting multi-file diffs out of browser chat.',
    },
  },
  desktop: {
    title: 'Desktop agent app',
    say: 'Apps like T3 Code, Cursor or Codex desktop sit on top of your folder—showing live threads, visual diffs, previews and multiple providers side by side.',
    stat: [['setup', 'install 1 app'], ['best for', 'visual coding & parallel threads'], ['edits local repo', 'yes']],
    model: {
      plain: 'The easiest bridge into coding with AI: you see your project, talk to the agent in plain language, and inspect visual changes without living in a scary black terminal.',
      technical: 'Gives you multi-provider threads, isolated git worktrees, diff viewers, voice input and plan/approval controls in one desktop surface.',
      engineer: 'High-leverage cockpit for supervising parallel worktrees, switching between models (e.g., builder vs reviewer) and connecting to remote always-on hosts.',
    },
  },
  cli: {
    title: 'Terminal CLI',
    say: 'Claude Code, Codex CLI or Gemini CLI run right inside your terminal—fast, keyboard-driven, and works over SSH on any server.',
    stat: [['setup', 'npm / brew install'], ['best for', 'speed, scripts, remote servers'], ['edits local repo', 'yes']],
    model: {
      plain: 'Looks bare at first, but underneath it is the exact same coding agent—just typed directly into a command window.',
      technical: 'Scriptable, zero-UI overhead, runs seamlessly inside tmux or SSH on remote workstations, and pipes cleanly into CI and git hooks.',
      engineer: 'First-class automation primitive: supports non-interactive headless runs, custom MCP servers, permission flags and reproducible CI pipelines.',
    },
  },
  api: {
    title: 'Direct API',
    say: 'Pay-per-token programmatic access—used by apps you build yourself, automated CI reviewers, and custom pipelines.',
    stat: [['billing', 'per token used'], ['best for', 'your own apps & CI automation'], ['edits local repo', 'via your code']],
    model: {
      plain: 'You don’t need an API key to start learning—a normal monthly subscription covers everyday building. APIs are for when your own software calls AI automatically.',
      technical: 'Keep an API key in `.env` (never committed to git) when wiring AI features into your app or running headless CI checks.',
      engineer: 'Metered per-token billing with explicit prompt-caching headers, structured outputs, rate limits and full observability over cost per job.',
    },
  },
};

function runSurface(ctx: Ctx, srf: Surface) {
  const s = SURFACES[srf];
  ctx.model(`${s.title}.`, s.model[ctx.level]);
  void ctx.scene.run(async (h) => {
    h.set((st) => Object.assign(st, solo({
      tools: srf === 'desktop' || srf === 'cli',
      project: srf === 'desktop' || srf === 'cli',
      meter: srf === 'api' ? 'api' : 'plan',
      labels: [
        lab('you', 'you', 'left'),
        lab('a0', s.title, 'top', srf === 'api' ? 'wiki/api/' : 'wiki/harness/'),
        ...(srf === 'desktop' || srf === 'cli' ? [lab('project', 'local repo', 'top')] : []),
      ],
    })));
    ctx.stat(s.stat);
    ctx.say(null, s.say);
    await h.send(route.youToAgent(), 'you', { ms: 380 });
    h.set((st) => { st.agents[0]!.blocks = [{ t: 'you', h: 3 }, { t: 'model', h: 4 }]; st.agents[0]!.lamp = 'ok'; });
    await h.send(reverse(route.youToAgent()), 'model', { ms: 380 });
  });
}

const DEVICES: Record<Device, { label: string; say: string; stat: [string, string][]; model: Record<'plain' | 'technical' | 'engineer', string> }> = {
  phone: {
    label: 'Phone',
    say: 'Record voice ideas on a walk, review a summary or screenshot on the sofa, or steer a desktop machine running at home.',
    stat: [['best for', 'voice specs, review & remote steering'], ['runs heavy builds', 'via remote box / cloud'], ['when', 'away from your desk']],
    model: {
      plain: 'Your phone isn’t for typing code—it’s your voice notebook and remote control for approving plans and checking finished previews.',
      technical: 'Use mobile apps for voice-to-spec capture, PR preview checks and remote steering of threads running on your home workstation or cloud sandbox.',
      engineer: 'Decouple human decision latency from desk time: approve plans, triage proof artifacts and unblock waiting threads from mobile while compute stays on an always-on host.',
    },
  },
  laptop: {
    label: 'Laptop',
    say: 'Your everyday interactive studio: build features, click through live previews in a real browser, and steer 1–3 agents at once.',
    stat: [['best for', 'hands-on building & visual checks'], ['limit', 'pauses when lid closes'], ['when', 'at a desk or café']],
    model: {
      plain: 'A normal laptop is all you need to start—because the heavy AI thinking runs in the cloud, even an older laptop builds software fast.',
      technical: 'Great for local dev servers, browser inspection and short test suites; close the lid and local agents sleep until you reopen it.',
      engineer: 'Primary interactive workstation—keep local dev environments light and offload long test matrices or background fleets to an always-on host or cloud container.',
    },
  },
  desktop: {
    label: 'Desktop PC / Home box',
    say: 'Stays plugged in and awake all day: runs long test suites, multiple parallel worktrees, optional local models—and lets your laptop or phone connect in.',
    stat: [['best for', 'always-on agents & heavy runs'], ['lid problem', 'none (stays awake)'], ['bonus', 'can run local GPU models']],
    model: {
      plain: 'An always-on desktop PC at home acts like your private workshop—start a job from your phone or laptop and come back to finished proof.',
      technical: 'Runs persistent worktrees, Docker/Postgres test databases and multi-hour agent loops without draining laptop battery or sleeping on lid-close.',
      engineer: 'Serves as a dedicated remote execution node (via T3 Code remote or SSH) with full environment parity, fast local NVMe/RAM and optional local GPU inference.',
    },
  },
};

function runDevice(ctx: Ctx, dev: Device) {
  const d = DEVICES[dev];
  ctx.model(`${d.label}.`, d.model[ctx.level]);
  void ctx.scene.run(async (h) => {
    h.set((s) => Object.assign(s, jobs(3, {
      gap: 84,
      machines: ['laptop', 'box', 'cloud'],
      trees: false,
      labels: [
        lab('you', dev === 'phone' ? 'you (phone)' : 'you', 'left'),
        lab('zone:0', 'laptop', 'bottom'),
        lab('zone:1', 'desktop PC', 'bottom', 'wiki/always-on-machine/'),
        lab('zone:2', 'cloud', 'bottom'),
        lab('j0', dev === 'laptop' ? 'active here' : 'standby', 'top'),
        lab('j1', dev === 'desktop' || dev === 'phone' ? 'running job' : 'ready', 'top'),
        lab('j2', 'cloud job', 'top'),
      ],
    })));
    ctx.stat(d.stat);
    ctx.say(null, d.say);
    const active = dev === 'laptop' ? 0 : 1;
    h.set((s) => {
      s.agents[active]!.blocks = [{ t: 'you', h: 3 }, { t: 'tool', h: 4 }, { t: 'model', h: 3 }];
      s.agents[active]!.lamp = 'ok';
      if (dev === 'phone') s.agents[2]!.lamp = 'work';
    });
  });
}

export async function demo(ctx: Ctx, h: Script) {
  h.set((s) => Object.assign(s, jobs(2, {
    gap: 92,
    machines: ['laptop', 'cloud'],
    trees: false,
    labels: [
      lab('you', 'you', 'left'),
      lab('j0', 'local tools', 'top', 'wiki/harness/'),
      lab('j1', 'cloud model', 'top', 'wiki/model/'),
      lab('zone:0', 'your computer', 'bottom'),
      lab('zone:1', 'provider cloud', 'bottom'),
    ],
  })));
  ctx.say(null, 'Your files stay on your machine while the provider’s servers do the heavy thinking.');
  h.set((s) => { s.agents[0]!.blocks = [{ t: 'tool', h: 4 }]; s.agents[1]!.blocks = [{ t: 'you', h: 3 }, { t: 'model', h: 4 }]; s.agents[1]!.lamp = 'ok'; });
  await h.wait(1200);
}

export const providersCh: Chapter = {
  steps: {
    labs: { scene: () => jobs(1, { machines: ['cloud'], trees: false, labels: [lab('you', 'you', 'left'), lab('j0', 'AI provider', 'top', 'wiki/model/')] }), enter: (ctx) => runLab(ctx, 'anthropic') },
    'where-brain': { scene: () => jobs(2, { gap: 92, machines: ['laptop', 'cloud'], trees: false }), enter: (ctx) => runWhere(ctx, 'cloud') },
    surfaces: { scene: () => solo({ tools: true, project: true, meter: 'plan' }), enter: (ctx) => runSurface(ctx, 'desktop') },
    devices: { scene: () => jobs(3, { gap: 84, machines: ['laptop', 'box', 'cloud'], trees: false }), enter: (ctx) => runDevice(ctx, 'laptop') },
  },
  actions: {
    lab: (ctx, val) => runLab(ctx, val as LabId),
    where: (ctx, val) => runWhere(ctx, val as RunAt),
    surface: (ctx, val) => runSurface(ctx, val as Surface),
    device: (ctx, val) => runDevice(ctx, val as Device),
  },
};
