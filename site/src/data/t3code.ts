// T3 Code: what it is, what it does and where it stops. From the README, the
// user docs and the releases list.
import { fact } from './types.ts';

const REPO = 'https://github.com/pingdotgg/t3code';
const DOCS = 'https://github.com/pingdotgg/t3code/tree/main/docs/user';
const doc = (name: string) => `https://github.com/pingdotgg/t3code/blob/main/docs/user/${name}.md`;

export const t3code = {
  version: fact('0.1.11 nightly', 'The newest T3 Code builds on 18 November 2026 were nightlies of version 0.1.11. The guide was last read against 0.1.10.', `${REPO}/releases`),
  licence: fact('MIT', 'T3 Code is open source under the MIT licence, copyright T3 Tools Inc.', REPO),
  price: fact('free', 'T3 Code is free, has no paid tier and does not resell tokens.', REPO),
  ownLogins: fact(true, 'T3 Code drives the agent CLIs installed on your machine, signed in with your own accounts. API keys are optional.', REPO),
  providers: fact(
    ['Claude Code', 'Codex', 'Cursor', 'OpenCode', 'Grok Build', 'Antigravity', 'Kiro', 'Pi', 'Muse Code', 'fx', 'any ACP agent'],
    'T3 Code supports Claude Code, Codex, Cursor, OpenCode, Grok Build, Antigravity, Kiro, Pi, Muse Code, fx, and any agent that speaks the Agent Client Protocol (ACP).',
    REPO,
  ),
  install: fact(
    ['desktop app (macOS, Windows, Linux)', 'npx t3@latest', 'web client', 'iOS and Android apps'],
    'Install as a desktop app for macOS, Windows and Linux, try it with npx t3@latest, use the hosted web client, or use the iOS and Android apps.',
    REPO,
  ),
  scratchThreads: fact(true, 'Threads without a project live in a scratch folder and can be turned into a project later.', DOCS),
  worktrees: fact(true, 'A thread can run in its own Git worktree. Commit, push and pull request actions are built in, with a diff view per turn.', doc('source-control')),
  handoff: fact(
    'budgeted selection',
    'Handing a task from one provider to another passes "a budgeted selection, not an agent-written summary" of the conversation. You can change models in the middle of a thread.',
    doc('portable-handoffs'),
  ),
  htmlRenders: fact(true, 'Agents on every provider can answer with a self-contained HTML page that renders in the thread.', doc('html-renders')),
  browser: fact(true, 'Each environment has a browser that you and the agent both see, plus a file viewer and a terminal.', DOCS),
  queueSteer: fact(true, 'Follow-up messages either queue or steer. Queued messages can be edited or removed before they send. Steering needs provider support.', doc('composer')),
  remote: fact(
    ['local network', 'Tailscale', 'SSH environments', 'T3 Connect'],
    'Use it remotely by pairing over your network or Tailscale, through SSH environments, or with T3 Connect.',
    doc('remote-access'),
  ),
  connectMachines: fact(3, 'Each T3 Connect account can link up to 3 machines free; phones and browsers do not count. A paid T3 Chat plan raises this to 10 (Pro) or 100.', doc('remote-access')),
  phoneIsRemote: fact(true, 'The iOS and Android apps are remotes: the computer does the work and has to stay on.', doc('remote-access')),
  permissionModes: fact(
    ['Supervised', 'Auto-accept edits', 'Auto', 'Full access'],
    'Permission modes are Supervised, Auto-accept edits, Auto and Full access. T3 Code itself is not a sandbox.',
    doc('permission-modes'),
  ),
  defaultMode: fact('Full access', 'The initial default permission mode for new threads is Full access.', doc('permission-modes')),
  voice: {
    exists: fact(true, 'T3 Code has voice dictation in the composer, in comments and in review replies.', doc('voice-input')),
    where: fact(
      'local model or your key',
      'On desktop and web you choose where transcription runs: a model downloaded to an environment, or a cloud provider (OpenAI or Grok Voice Transcribe) with your own key. Phones transcribe on the device by default.',
      doc('voice-input'),
    ),
    maxRecording: fact(5, 'A single voice recording in T3 Code is limited to five minutes.', doc('voice-input'), { unit: 'minutes' }),
    shortcut: fact('mod+shift+d', 'Start dictation in T3 Code with mod+shift+d (Command on macOS, Ctrl elsewhere) or the microphone button.', doc('voice-input')),
    dictionary: fact(
      100,
      'T3 Code keeps a dictionary of names and terms on your device and another per project; each recording carries up to 100 entries from the two combined.',
      doc('voice-input'),
    ),
    cloudProviders: fact(
      ['OpenAI', 'Grok Voice Transcribe', 'OpenRouter'],
      'For cloud transcription T3 Code can use OpenAI, Grok Voice Transcribe or OpenRouter, each billed to your own account with that provider.',
      doc('voice-input'),
    ),
  },
  mcp: fact(
    '<environment>/mcp',
    'Agents that T3 Code did not start can work with an environment through its MCP server, at the environment address followed by /mcp.',
    doc('outside-agents'),
  ),
  scheduledTasks: fact(true, 'Tasks can run on a schedule.', DOCS),
  contributing: fact(
    'no feature PRs',
    'Outside pull requests for new features, providers or UI overhauls are closed; bug fixes from daily users are welcome.',
    `${REPO}/blob/main/CONTRIBUTING.md`,
  ),
  faqLinks: fact(
    'one blog post, one X post, one video, one gist',
    "The T3 Code FAQ is written in Theo's voice and links one t3.gg blog post, one post on X, one YouTube video and one GitHub gist. It links no account pages.",
    doc('faq'),
  ),
} as const;
