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
  modeMeaning: fact(
    'Supervised asks for commands and file changes; Full access asks for nothing',
    "T3 Code's Supervised mode requests approval for commands and file changes; its Full access mode allows commands and edits without approval prompts.",
    doc('permission-modes'),
    { verified: '2026-11-20' },
  ),
  defaultMode: fact('Full access', 'The initial default permission mode for new threads is Full access.', doc('permission-modes')),
  modeSwitch: fact(
    'model picker → Permissions',
    'A new thread names its permission mode under the composer. To change it, open the model picker and choose Permissions at its bottom, or press mod+shift+a. New threads start on the default set in Settings → Threads → New threads → Permissions.',
    doc('permission-modes'),
    { verified: '2026-11-21' },
  ),
  newThreadButton: fact(
    'New thread in the sidebar',
    "The sidebar's New thread button starts a thread; with more than one open project it asks which project to use. Shift-click it, or use a project's own new-thread action, to start in that project.",
    doc('thread-sidebar'),
    { verified: '2026-11-21' },
  ),
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
  stable: fact('0.1.10', 'The newest stable T3 Code release on 18 November 2026 was 0.1.10, published on 17 November 2026.', `${REPO}/releases`),
  maker: fact('T3 Tools Inc.', 'T3 Code is copyright T3 Tools Inc. Its FAQ is written by Theo in the first person and links his own posts.', doc('faq')),
  welcome: fact(
    'Welcome page',
    'A new installation opens on a Welcome page that lists the agents found on the computer. For Claude Code, Install or Sign in opens a terminal with the command ready to run; for Codex, Set up offers sign-in with a ChatGPT account. Start finishes the page once one agent is ready.',
    doc('welcome-page'),
  ),
  codexWithChatGPT: fact(true, 'Codex can be connected with a ChatGPT account from inside T3 Code, which then installs Codex itself; no terminal is needed.', doc('providers-codex')),
  newProject: fact(
    '~/.t3/projects',
    'New project makes a Git repository in ~/.t3/projects with a README, an icon and a first commit, then opens a thread in it.',
    doc('source-control'),
  ),
  manyModels: fact(true, 'Shift-click several models in a new thread to send the same prompt to each; every selection starts its own thread and worktree.', doc('thread-sidebar')),
  worktreeFolder: fact('worktrees folder in the T3 home', 'New worktrees go in the worktrees folder of the T3 home directory unless Settings → Worktrees names another location.', doc('project-settings')),
  branchPrefix: fact('t3/', 'Automatically named worktree branches use the prefix t3/ by default; a model-chosen prefix such as feat/ or custom instructions are the alternatives.', doc('project-settings')),
  editFromHere: fact(
    'Edit from here',
    'Edit from here rewinds a thread to before a message. Reverting the files too is offered only for threads in a worktree; a thread in the project folder rewinds the conversation only.',
    doc('composer'),
  ),
  localServers: fact(true, 'The thread details card lists local servers the thread started, with their ports; selecting one opens it in the browser panel.', doc('thread-sidebar')),
  shortcuts: {
    model: fact('mod+shift+m', 'mod+shift+m opens the model picker (mod is Command on macOS, Ctrl elsewhere).', doc('keybindings')),
    effort: fact('mod+shift+e', 'mod+shift+e opens the effort picker.', doc('keybindings')),
    permissions: fact('mod+shift+a', 'mod+shift+a opens the permission mode picker.', doc('keybindings')),
    workspace: fact('mod+shift+x', 'mod+shift+x opens the workspace menu: the current checkout, a new worktree, or the previous worktree.', doc('keybindings')),
    background: fact('mod+Enter', 'In a new thread, mod+Enter sends the prompt, keeps the thread running in the background and opens a fresh composer.', doc('keybindings')),
    opposite: fact('mod+Enter', 'While an agent works, mod+Enter does the opposite of your default follow-up behaviour: it steers when the default is queue, and queues when it is steer.', doc('composer')),
    dictate: fact('mod+shift+d', 'mod+shift+d starts and finishes dictation; Esc discards the recording.', doc('keybindings')),
    usage: fact('mod+u', 'mod+u opens the Usage page.', doc('usage')),
    palette: fact('mod+k', 'mod+k opens the command palette.', doc('source-control')),
  },
  delegate: fact(
    'delegate_task',
    'An agent in a thread can hand a task to another agent with delegate_task, including to a linked machine, and its thread wakes with the result. Typing @ and a model name, such as @opus, names that model for the agent without changing the thread\'s model.',
    doc('remote-access'),
  ),
  skillsInComposer: fact('$', 'In the composer, / opens commands and $ adds a skill. After adding skills or MCP servers, Restart agent session picks them up.', doc('composer')),
  usagePage: fact(
    'estimate, not your bill',
    'The Usage page combines token use across providers and shows an estimated API-equivalent cost, which is not your subscription bill.',
    doc('usage'),
  ),
  claudePermissionsStillApply: fact(true, "Claude can still ask for approval in Full access when its own settings require it, so Claude Code's permission settings keep working underneath.", doc('permission-modes')),
  noLocalModels: fact(true, 'T3 Code does not support local models.', doc('faq')),
  codeNotToT3: fact(
    'provider only',
    'Code and prompts go from your machine to your provider, not to T3 servers. T3 Code sends basic product usage events without prompts or file contents; T3CODE_TELEMETRY_ENABLED=false turns them off.',
    doc('faq'),
  ),
  intelMac: fact(true, 'There is no t3 command-line build for Intel Macs; the desktop app works there.', doc('install')),
  cliInstall: fact('curl -fsSL https://t3.codes/install.sh | sh', 'The command-line install is curl -fsSL https://t3.codes/install.sh | sh (irm https://t3.codes/install.ps1 | iex on Windows); t3 starts the server and opens the web app.', doc('install')),
  openFromTerminal: fact('t3 app', 'With the desktop app running, t3 app opens a new thread for the current directory and adds it as a project if needed.', doc('install')),
  crossProvider: fact(true, 'The README says you can change models in the middle of a thread and "let Claude hand a task to Codex".', REPO),
  limited: fact(
    'Limited',
    'A thread marked Limited stopped on a provider usage or rate limit. Resume at reset schedules a continuation when the provider reports a reset time; you can also switch to another provider instance.',
    doc('thread-sidebar'),
  ),
  githubAuth: fact(
    ['saved token', 'GH_TOKEN', 'gh auth login'],
    'For GitHub, T3 Code needs a token: one saved in Settings → Source control & issues, GH_TOKEN in the server environment, or the GitHub CLI signed in with gh auth login.',
    doc('source-control'),
  ),
  providerMissing: fact('Binary path', "A provider that does not show up is almost always not installed or not on the PATH of the machine running the server; set its Binary path in provider settings.", doc('faq')),
  sideChat: fact('/side', 'Start a message with /side or /btw to ask about a thread in a side chat without adding to it.', doc('thread-sidebar')),
  handoffCap: fact(
    16_000,
    'A T3 Code handoff starts with a history allowance of 16,000 tokens by default; T3CODE_CONTEXT_HANDOFF_TOKEN_CAP changes it within 1,024 to 64,000.',
    doc('portable-handoffs'),
    { unit: 'tokens' },
  ),
  handoffLeavesOut: fact(
    ['reasoning', 'tool-call state', 'attachments'],
    "A T3 Code handoff keeps the selected messages in full, in order and with their roles, but leaves out the previous provider's reasoning, tool-call state and attachments. Omitted history can be fetched with T3 Code's thread-reading tool.",
    doc('portable-handoffs'),
  ),
  /** The words on T3 Code's own screen, for the schematic screen beside the journey's picture (journey/screen.ts). */
  screen: {
    composer: fact('Ask anything...', 'An empty T3 Code composer reads "Ask anything...".', `${REPO}/blob/main/apps/web/src/components/chat/ChatComposer.tsx`, { verified: '2026-11-20' }),
    newThread: fact('New thread', 'A thread with no title yet is called "New thread" in T3 Code.', `${REPO}/blob/main/apps/web/src/components/Sidebar.logic.ts`, { verified: '2026-11-20' }),
    statuses: fact(
      ['Working', 'Completed', 'Pending Approval', 'Awaiting Input', 'Plan Ready'],
      'The T3 Code sidebar marks a thread Working, Completed, Pending Approval, Awaiting Input or Plan Ready.',
      `${REPO}/blob/main/apps/web/src/components/Sidebar.logic.ts`,
      { verified: '2026-11-20' },
    ),
    workLog: fact(
      ['Searched files', 'Read file', 'Changed files', 'Ran command'],
      'A thread\'s work log lists what the agent did in rows such as "Searched files", "Read members.ts", "Changed files" and "Ran command".',
      `${REPO}/blob/main/packages/shared/src/toolActivity.ts`,
      { verified: '2026-11-20' },
    ),
  },
} as const;
