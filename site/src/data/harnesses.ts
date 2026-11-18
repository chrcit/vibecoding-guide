// Harnesses: the programs that give a model tools. Claude Code and Codex,
// side by side on the same questions, plus where T3 Code fits.
// developers.openai.com/codex/* now redirects to learn.chatgpt.com/docs/*.
import { fact, unverified } from './types.ts';

const CC = (page: string) => `https://code.claude.com/docs/en/${page}`;
const CX = (page: string) => `https://learn.chatgpt.com/docs/${page}`;

export const harnesses = {
  claudeCode: {
    openSource: fact(false, 'Claude Code is not open source.', 'https://github.com/anthropics/claude-code'),
    models: fact('Claude only', 'Claude Code officially supports Claude models only; gateways route to Claude on other platforms.', CC('llm-gateway')),
    defaultModel: fact('Opus 5.5', 'On Pro, Max, Ultra, Team, Enterprise and the Anthropic API, Claude Code defaults to Opus 5.5, whose default effort is medium.', CC('model-config')),
    subagents: fact(true, 'A Claude Code subagent runs in its own fresh context window and can be given its own model.', CC('sub-agents')),
    nestingDepth: fact(3, 'By default a Claude Code subagent can spawn subagents of its own, up to three layers below the main conversation (CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH changes it).', CC('sub-agents')),
    subagentUsage: fact('same limits', 'Subagents send their own requests, which count toward the same usage limits as the main conversation.', CC('sub-agents')),
    agentTeams: fact('off by default', 'Agent teams are experimental and disabled by default (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 turns them on).', CC('costs')),
    agentTeamTokens: fact(7, 'Agent teams use approximately 7× more tokens than standard sessions when teammates run in plan mode.', CC('costs'), { unit: 'multiplier' }),
    mcpConfig: fact(
      ['.mcp.json (project)', '~/.claude.json (local and user)'],
      'Claude Code stores project-scoped MCP servers in .mcp.json at the project root and local and user-scoped ones in ~/.claude.json; add one with claude mcp add.',
      CC('mcp'),
    ),
    voice: fact(
      '/voice',
      'Claude Code has voice dictation (/voice, hold or tap to record). Audio is streamed to Anthropic for transcription, needs a claude.ai login, and does not count toward plan limits.',
      CC('voice-dictation'),
    ),
    skills: fact(
      ['.claude/skills/<name>/SKILL.md', '~/.claude/skills/'],
      'Claude Code skills live in .claude/skills/<name>/SKILL.md in a project or ~/.claude/skills/ for everything. Run one with /name, or Claude loads it when its description matches.',
      CC('skills'),
    ),
    contextFile: fact(
      'CLAUDE.md',
      'Claude Code reads CLAUDE.md, and reads AGENTS.md only when no CLAUDE.md exists; otherwise import it with @AGENTS.md.',
      CC('memory'),
    ),
    features: fact(
      ['worktrees', 'checkpoints', 'plan mode', 'sandbox', 'hooks'],
      'Claude Code has worktrees (claude --worktree), checkpoints (/rewind, not for changes made by shell commands), permission modes including plan mode, an optional OS sandbox (/sandbox, macOS and Linux) and hooks.',
      CC('worktrees'),
    ),
    queue: fact(true, 'Claude Code queues a message you send while it is working.', CC('interactive-mode')),
    web: fact(true, 'Claude Code also runs on the web, in cloud sessions that work on your GitHub repositories.', CC('claude-code-on-the-web')),
    login: fact('claude auth login', 'Sign in to Claude Code with claude auth login.', CC('quickstart')),
    bestPractice: fact(
      'Before a run goes unattended, make sure it knows what done looks like, can check its own work, and can only touch what it should.',
      'Anthropic: "Before a run goes unattended, make sure it knows what done looks like, can check its own work, and can only touch what it should."',
      CC('best-practices'),
    ),
    enterpriseCost: fact(13, 'Across enterprise deployments Claude Code averages about $13 per developer per active day and $150 to $250 per month.', CC('costs'), { unit: 'usd' }),
    init: fact('/init', 'In Claude Code, /init generates a starting CLAUDE.md from the codebase: build commands, test instructions and conventions it finds. It suggests improvements when one exists.', CC('memory')),
    permissionRules: fact(
      '.claude/settings.json',
      'Claude Code permission rules live in settings files such as .claude/settings.json, as permissions.allow and permissions.deny lists like "Bash(npm run *)". They are enforced by Claude Code, not by the model; /permissions shows and edits them.',
      CC('permissions'),
    ),
    usageCommand: fact('/usage', 'In Claude Code, /usage shows plan usage bars and a breakdown of what counted against the limits for subscribers; the session dollar figure is for API users.', CC('costs')),
    mcpAdd: fact('claude mcp add --transport http <name> <url>', 'Add a remote MCP server to Claude Code with claude mcp add --transport http <name> <url>.', CC('mcp')),
    subagentFiles: fact(
      ['.claude/agents/', '~/.claude/agents/'],
      'Claude Code subagents are Markdown files with YAML frontmatter (name and description required) in .claude/agents/ for one project or ~/.claude/agents/ for all of them.',
      CC('sub-agents'),
    ),
    subagentModel: fact(
      ['sonnet', 'opus', 'haiku', 'fable', 'a full model ID', 'inherit'],
      "A Claude Code subagent's model field takes sonnet, opus, haiku, fable, a full model ID or inherit; by default a subagent runs on the same model as the conversation that starts it.",
      CC('sub-agents'),
    ),
    subagentFreshContext: fact(
      'fresh context, summary back',
      "Each Claude Code subagent starts with a fresh context window that does not see the conversation history, the skills already invoked or the files already read, and returns only a summary. A fork is the exception: it inherits the parent conversation.",
      CC('sub-agents'),
    ),
    subagentBackground: fact(
      'background by default',
      'With nothing configured, a subagent that Claude Code spawns from the main conversation runs in the background, and its result arrives as a notification in a later turn. Foreground subagents block the main conversation until they finish.',
      CC('sub-agents'),
    ),
    subagentWorktree: fact(
      'isolation: worktree',
      'Setting isolation: worktree runs a Claude Code subagent in a temporary Git worktree, an isolated copy of the repository, which is removed if the subagent changes nothing.',
      CC('sub-agents'),
    ),
    subagentAttribution: fact(
      '/usage',
      'On a Claude plan, /usage in Claude Code shows what share of recent usage went to skills, subagents, plugins and each MCP server.',
      CC('costs'),
    ),
    smallSubagentModel: fact(
      'model: haiku',
      "Anthropic's cost advice for Claude Code: for simple subagent tasks, set model: haiku in the subagent's configuration.",
      CC('costs'),
    ),
    agentTeamSize: fact(
      'proportional to team size',
      'Each agent-team teammate runs its own context window, so token use is roughly proportional to team size, and a teammate keeps using tokens until it exits.',
      CC('costs'),
    ),
    checkToRun: fact(
      'Give Claude something it can run that comes back pass or fail.',
      'Anthropic\'s best practices: "Give Claude something it can run that comes back pass or fail. Once it has that, it can keep going on its own and you don\'t have to watch." A test file, a build\'s exit code, a linter, a script that diffs output against a fixture or a browser screenshot all count.',
      CC('best-practices'),
    ),
    askForEvidence: fact(
      'ask for evidence',
      'Anthropic\'s best practices: ask Claude for evidence, the command it ran and its output or the screenshot. "All tests pass" on its own tells you very little.',
      CC('best-practices'),
    ),
    codeReview: fact(
      '/code-review',
      'In a terminal session, /code-review reviews the changes on your branch in a background subagent with its own context window, which never saw the conversation that produced the code.',
      CC('code-review-local'),
    ),
    reviewerAlwaysFinds: fact(
      'skip style',
      'Anthropic\'s best practices warn that a reviewer asked to find problems will always find something, and suggest telling it to report gaps that affect correctness and skip style.',
      CC('best-practices'),
    ),
    sameModelReviewer: fact(
      'a fresh pair of eyes',
      'By default a Claude Code subagent is the same model (or a smaller one) on the same task: you get a fresh pair of eyes out of it, not a smarter answer. A fresh reviewer helps because it has not seen your reasoning.',
      CC('best-practices'),
    ),
    permissionModes: fact(
      ['default (Manual)', 'acceptEdits', 'plan', 'auto', 'dontAsk', 'bypassPermissions'],
      'Claude Code has six permission modes: Manual (default), acceptEdits, plan, auto, dontAsk and bypassPermissions. In Manual it asks before most edits, shell commands and network access; bypassPermissions is meant for isolated containers and VMs only.',
      CC('permission-modes'),
    ),
    autoModeDefault: fact(
      'auto mode',
      'New interactive terminal and VS Code sessions of Claude Code start in auto mode, where a separate classifier model checks actions before they run. Deny rules apply in every mode.',      CC('best-practices'),
    ),
    startupContext: fact(
      ['CLAUDE.md', 'auto memory', 'MCP tool names', 'skill descriptions'],
      'Before you type anything, Claude Code loads CLAUDE.md (or AGENTS.md), auto memory, MCP tool names and skill descriptions into the context window.',
      CC('context-window'),
    ),
    autoCompactAt: fact(
      967_000,
      'Claude Code compacts a session on a model with a native 1M-token window at about 967K tokens by default; /autocompact sets an earlier point.',
      CC('model-config'),
      { unit: 'tokens' },
    ),
    compactionKeeps: fact(
      'a summary, plus instructions and recent files reloaded',
      'Compaction replaces the conversation with a summary. The project-root CLAUDE.md and auto memory are re-injected from disk, and Claude Code re-reads up to five of the files it read or edited, most recently modified first.',
      CC('context-window'),
    ),
    compactionReread: fact(5, 'After compaction Claude Code re-reads up to five of the files Claude read or edited in the session.', CC('context-window')),
    claudeMdLines: fact(200, 'Anthropic recommends keeping each CLAUDE.md under 200 lines: longer files consume more context and reduce adherence.', CC('memory')),
    claudeMdNesting: fact(
      'above at launch, below on demand',
      'CLAUDE.md files in the directories above the working directory load at launch; those in subdirectories load once Claude works with a file there.',
      CC('memory'),
    ),
    autoMemoryLoad: fact(
      '200 lines or 25KB',
      'Claude Code loads the first 200 lines or 25KB of its auto memory file, MEMORY.md, whichever comes first, at the start of every conversation.',
      CC('memory'),
    ),
    promptCacheTtl: fact(
      'about an hour on a plan, five minutes on an API key',
      'In Claude Code the prompt cache lasts about an hour on a subscription and five minutes on an API key, a cloud provider or usage credits. Subagents get five minutes unless you change it.',
      CC('best-practices'),
    ),
    clearAfterTwo: fact(
      'after two failed corrections, /clear',
      'Anthropic: after two failed corrections, run /clear and write a better prompt instead of a third; a third correction mostly adds to a conversation that already holds two failed attempts.',
      CC('best-practices'),
    ),
    focusedContext: fact(
      'focused context gives better answers',
      'Running out of context is rare on 1M-token windows, but Anthropic still advises /clear between tasks, because a focused context gets better answers and costs less.',
      CC('best-practices'),
    effort: fact(
      '/effort',
      'In Claude Code, set effort with /effort (a slider, or a level name), the --effort flag for one session, CLAUDE_CODE_EFFORT_LEVEL, or effortLevel in settings; max is not accepted as a saved level in settings.',
      CC('model-config'),
    ),
  },
  codex: {
    openSource: fact('Apache-2.0', 'The Codex CLI is open source under Apache-2.0. The models behind it are proprietary.', 'https://github.com/openai/codex'),
    models: fact(
      'OpenAI first, others possible',
      'Codex is built for OpenAI models but can be pointed at other providers such as Ollama, LM Studio, Amazon Bedrock or any Responses-compatible endpoint.',
      CX('config-file/config-advanced'),
    ),
    subagents: fact(true, 'Current Codex releases enable subagent workflows by default; they consume more tokens than comparable single-agent runs.', CX('agent-configuration/subagents')),
    nestingDepth: unverified('not published', 'Codex limits how deeply subagents can nest.', CX('agent-configuration/subagents'), 'The subagents page does not state a nesting depth; only a per-session cap on concurrent agent threads.'),
    mcpConfig: fact(
      ['~/.codex/config.toml', '.codex/config.toml'],
      'Codex stores MCP servers as [mcp_servers.<name>] tables in ~/.codex/config.toml, or .codex/config.toml in a trusted project. STDIO and streamable HTTP servers are supported.',
      CX('extend/mcp'),
    ),
    voice: fact(
      'desktop app only',
      'The ChatGPT desktop app has voice dictation for prompt text in Codex. The docs say nothing about voice in the Codex command line.',
      CX('features/voice'),
    ),
    skills: fact(
      ['.agents/skills/', '~/.agents/skills/'],
      'Codex skills live in .agents/skills/ in the project or any parent folder, and ~/.agents/skills/ for everything. Mention one with $name.',
      CX('build-skills'),
    ),
    contextFile: fact(
      'AGENTS.md',
      'Codex reads ~/.codex/AGENTS.md and then every AGENTS.md from the repository root down to the working directory.',
      CX('agent-configuration/agents-md'),
    ),
    sandbox: fact(
      ['read-only', 'workspace-write', 'danger-full-access'],
      'Codex sandbox modes are read-only, workspace-write (the default) and danger-full-access. It also has /review, worktrees and cloud tasks.',
      CX('sandboxing'),
    ),
    queue: fact(true, 'Codex queues a message you send while it is working.', CX('codex/cli')),
    login: fact('codex login', 'Sign in to Codex with codex login.', CX('auth')),
    docsMoved: fact(
      'learn.chatgpt.com/docs',
      'The Codex docs moved: developers.openai.com/codex/* now redirects (308) to learn.chatgpt.com/docs/*.',
      CX('pricing'),
    ),
    subagentFiles: fact(
      ['~/.codex/agents/', '.codex/agents/'],
      'Codex custom agents are TOML files in ~/.codex/agents/ (personal) or .codex/agents/ (project), each defining name, description and developer_instructions.',
      CX('agent-configuration/subagents'),
    ),
    subagentModel: fact(
      'agents.default_subagent_model',
      "Codex sets the default model for spawned agents with agents.default_subagent_model; a custom agent file's own model field takes precedence.",
      CX('agent-configuration/subagents'),
    ),
    maxThreads: fact(
      'agents.max_concurrent_threads_per_session',
      'Codex caps concurrently open spawned-agent threads with agents.max_concurrent_threads_per_session (legacy alias agents.max_threads); left unset, Codex chooses the default.',
      CX('agent-configuration/subagents'),
    ),
    subagentResults: fact(
      'consolidated response',
      'When several Codex subagents run, Codex waits until all requested results are in and returns a consolidated response in the main thread.',
      CX('agent-configuration/subagents'),
    ),
    approvals: fact(
      ['on-request', 'never'],
      'Codex approval policies are on-request (works inside the sandbox and asks before going beyond it) and never (does not stop for approval). workspace-write is the default low-friction sandbox mode for local work.',
      CX('sandboxing'),
    effort: fact(
      '/model',
      'In the Codex CLI, pick model and reasoning effort with /model (More reasoning… shows max and ultra); in the desktop app, use the model and reasoning control under the composer.',
      CX('models'),
    ),
  },
  t3code: {
    role: fact(
      'ADE',
      'T3 Code is an agentic development environment: it drives the harnesses above and adds threads, diffs, previews and mixing providers. What an agent can do still comes from the harness underneath.',
      'https://github.com/pingdotgg/t3code',
    ),
  },
} as const;
