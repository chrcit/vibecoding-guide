/* Guide v2, Set up: see v2/content.ts for the words, types and helpers. Script: planning/guide-v2/lessons-14-17-setup.md. */
import type { SceneState, Label, Zone, P3 } from '../../journey/picture';
import { SPOT } from '../../journey/picture';
import { lab } from '../../journey/presets';
import { termLabel } from '../../journey/terms';
import { t3code } from '../../data/t3code';
import { plans } from '../../data/plans';
import { A, FIRST, atYou, b, n, points, push, type Lesson } from '../content';

// ---------- Set up: Providers ----------
// The Wednesday before the first Thursday. T3 Code is installed; now the agents and a plan. As in
// v1's providers.ts: the model runs on the provider's computers, the harness, its tools and your
// files on your laptop.

const [, , RAN_N] = t3code.screen.workLogGroups.value;
const [CLAUDE, CODEX] = t3code.providers.value;
const usd = (v: number) => `$${v}`;

const CLOUD: Zone = { id: 'cloud', kind: 'cloud', rect: [-30, -30, 60, 60] };
const LAPTOP: Zone = { id: 'lap', kind: 'laptop', rect: [52, -42, 166, 84] };
function floor(o: { tools?: boolean; meter?: 'plan' | 'api' } = {}): SceneState {
  const tools = o.tools ?? true;
  return {
    you: SPOT.you,
    agents: [{ id: 'a0', at: SPOT.agent, blocks: [FIRST] }],
    tools: tools ? { at: SPOT.tools, ids: ['read', 'edit', 'run', 'search'] } : null,
    project: tools ? { at: SPOT.project, rules: 'none', files: ['', '', '', '', '', ''] } : null,
    zones: [CLOUD, ...(tools ? [LAPTOP] : [])],
    meters: o.meter ? [{ id: 'm0', at: SPOT.meter, mode: o.meter, level: o.meter === 'plan' ? 1 : 0 }] : [],
    tracks: [[[0, 94], [0, 22]], ...(tools ? [[[20, 0], [56, 0]], [[88, 0], [120, 0]]] as SceneState['tracks'] : []), ...(o.meter ? [[[SPOT.meter[0] + 14, 0], [-22, 0]]] as SceneState['tracks'] : [])],
    labels: [],
  };
}
const frame = (model = 'the model, at the provider'): Label[] => [lab('you', 'you', 'left'), termLabel('a0', 'model', 'top', model), lab('zone:lap', 'your laptop: tools and files', 'bottom')];
const note = (s: SceneState, ...more: Label[]) => { s.labels = [...frame(), ...more]; };
const byTools = (text: string) => lab('tool:run', text, 'right');

const run = (back: 'tool' | 'bad' = 'tool') => ({ to: 'tool', tool: 'run', back }) as const;

const sProviders: Lesson = {
  id: 's-providers',
  parts: [
    {
      title: 'Find your agents',
      thread: 'Is this computer ready',
      fresh: true,
      request: 'I’ve installed T3 Code. Check which coding agents this computer has, and whether they’re signed in.',
      lede: 'The week before lesson 1: the Lantern has no app yet. Step one is T3 Code itself: the desktop app from t3.codes for macOS, Windows or Linux (or npx t3@latest to try it). It’s free, and it drives the coding agents on your computer with your own logins. Step two is this thread: ask what it finds.',
      points: points(floor(), [
        { say: 'T3 Code doesn’t bring a model of its own. It runs the agents on this computer, Claude Code or Codex, with your accounts. The model answers from the provider’s computers.', moves: [{ to: 'agent' }], ui: { env: '', limits: [], modelName: '', model: true },
          edit: (s) => { push(s, b('you', 2)); A(s).lamp = 'work'; note(s); } },
        { say: 'It asks each agent for its version. Claude Code answers. Codex isn’t installed.', moves: [run(), run('bad')],
          edit: (s) => { push(s, b('model', 0.6), b('tool', 1), b('model', 0.6), b('bad', 1)); note(s, byTools('claude: yes, codex: no')); } },
        { say: 'It replies with what to do. The Welcome page does the rest: Install or Sign in for Claude Code opens a terminal with the command ready; Set up for Codex signs in with a ChatGPT account and installs Codex for you.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); A(s).lamp = 'ok'; note(s, atYou('one agent ready')); } },
      ]),
      log: {
        took: '20s',
        rows: [
          { at: 1, label: n(RAN_N, 2), tone: 'bad', detail: { plain: 'Claude Code is installed and signed in; Codex isn’t installed', technical: 'claude --version; claude auth status; codex --version: not found' } },
        ],
      },
      answer: [
        `${CLAUDE} is installed and signed in, so you can start. ${CODEX} isn’t installed.`,
        'To add Codex, open the Welcome page (Settings → About → Welcome page), choose Set up next to Codex and continue with your ChatGPT account: T3 Code installs Codex itself, no terminal needed.',
      ],
      deeper: { level: 'technical', text: `Without the desktop app: ${t3code.cliInstall.value} installs the t3 command, and t3 starts the server and opens the web app. An agent that doesn’t show up is almost always not installed, or not on the PATH of the machine that runs the T3 Code server; set its Binary path in Settings → Providers.` },
      tryIt: { prompt: 'Check which coding agents this computer has, and whether they’re signed in.', t3: 'On a new installation the Welcome page lists the agents it finds. Choose Start once one is ready, or Start without an agent.' },
      sources: ['t3code.install', 't3code.cliInstall', 't3code.price', 't3code.ownLogins', 't3code.welcome', 't3code.codexWithChatGPT', 't3code.providerMissing', 't3code.providers'],
    },
    {
      title: 'A plan, not a key',
      thread: 'Is this computer ready',
      request: 'Which plan do I need for this, and what does it cost a month?',
      lede: 'Coding agents need a provider account. Most people start on a monthly plan.',
      points: points(floor({ meter: 'plan' }), [
        { say: `Claude Code isn’t on Claude’s free plan. Pro is ${usd(plans.claude.pro.price.value)} a month and includes it.`, moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 1.4)); s.labels = [...frame(), termLabel('meter:m0', 'plan', 'bottom', `Claude Pro: ${usd(plans.claude.pro.price.value)}`)]; } },
        { say: `Codex is on every ChatGPT plan, the free one included. Plus is ${usd(plans.chatgpt.plus.price.value)} a month.`,
          edit: (s) => { s.agents[0]!.model = 'b'; s.labels = [...frame(), termLabel('meter:m0', 'plan', 'bottom', `ChatGPT Plus: ${usd(plans.chatgpt.plus.price.value)}`)]; } },
        { say: `A plan is an allowance that refills. Max (${usd(plans.claude.max.price.value)}) gives ${plans.claude.max.usage.value}× Pro’s usage and Ultra (${usd(plans.claude.ultra.price.value)}) ${plans.claude.ultra.usage.value}× per week. Start small; lesson 14 shows what drains it.`, moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); s.meters![0]!.level = 0.7; s.labels = [...frame(), termLabel('meter:m0', 'plan', 'bottom', 'an allowance that refills')]; } },
      ]),
      answer: [
        `For Claude Code, Claude Pro at ${usd(plans.claude.pro.price.value)} a month; the free Claude plan doesn’t include it. For Codex, any ChatGPT plan: Plus is ${usd(plans.chatgpt.plus.price.value)}, and Free includes Codex too.`,
        `If you run agents most days and hit the limits, Max at ${usd(plans.claude.max.price.value)} gives ${plans.claude.max.usage.value}× Pro’s usage. Start on one plan with one provider; you can add the other later.`,
      ],
      deeper: { level: 'engineer', text: 'An API key bills every token at list price instead. For daily agent work a plan is far cheaper by every public estimate; neither provider publishes a dollar value for a plan’s limit.' },
      tryIt: { prompt: 'Which plan do I need for [the agent], and what do I get on it?', t3: 'Sign in to the agent with the account that has the plan: claude auth login, or Codex through Set up on the Welcome page.' },
      sources: ['plans.claude.free.claudeCode', 'plans.claude.pro.price', 'plans.claude.max.price', 'plans.claude.max.usage', 'plans.claude.ultra.price', 'plans.claude.ultra.usage', 'plans.chatgpt.limits.codexOnEveryPlan', 'plans.chatgpt.plus.price', 'plans.claude.limits.whatUsageMeans', 'harnesses.claudeCode.login'],
    },
    {
      title: 'Where your words go',
      thread: 'Is this computer ready',
      request: 'Before I paste the guest list: where does what I type here go?',
      lede: 'A club’s guest list has names and phone numbers in it. Ask before you paste.',
      points: points(floor(), [
        { say: 'What you type, and every file the agent reads, goes from your computer to the provider that runs the model. It doesn’t go to T3 Code’s servers.', moves: [{ to: 'agent' }],
          edit: (s) => { push(s, b('you', 1.4)); note(s, lab('a0', 'your words go here', 'right')); } },
        { say: 'On Claude’s consumer plans, whether your chats and code train future models is a setting you choose. Check it before real data goes in.', moves: [{ to: 'you', kind: 'model' }],
          edit: (s) => { push(s, b('model', 2)); note(s, lab('a0', 'training: your setting', 'right')); } },
        { say: 'Until the app is real, use made-up guests. Every list in this guide is made up for that reason.',
          edit: (s) => { note(s, atYou('made-up guests for now')); } },
      ]),
      answer: [
        `To the provider: your messages, and whatever files the agent reads, go from this computer to Anthropic for ${CLAUDE}, or OpenAI for ${CODEX}. T3 Code’s servers don’t get your prompts or files; T3 Code sends basic usage events, which T3CODE_TELEMETRY_ENABLED=false turns off.`,
        'On Claude Pro, Max and Ultra, training on your chats and code is a setting you choose: on, they’re kept up to 5 years; off, 30 days. Until the app holds real guests, paste made-up ones.',
      ],
      tryIt: { prompt: 'Make me a guest list with 60 made-up guests, in the shape of our real one: name, promoter, plus-ones, phone.', t3: 'Check the provider’s privacy setting in its own account settings before real data goes into a thread.' },
      sources: ['t3code.codeNotToT3', 'claims.privacy.claudeConsumer', 'claims.privacy.openaiApi'],
    },
  ],
};

export default sProviders;
