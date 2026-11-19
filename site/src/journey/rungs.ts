// The steps of the journey, in order. Each adds one thing to the same mental model.
// Part one lays the foundations before your first line of code.
// Part two grows the agents, from one chat to twenty in a loop.
// Part three grows the working week around them: cost, review, proof, your turn, growth, people, machines.
import type { Level } from '../lib/levels';

export type LessonTheme = 'foundations' | 'core' | 'quality' | 'scale';

export interface Rung {
  id: string;
  n: number;
  part: 1 | 2 | 3;
  title: string;
  short: string;
  line: string;
  theme: LessonTheme;
  /** Concrete addition to the mental model, tuned to the reader's chosen level. */
  adds: Record<Level, string>;
  /** Direct jump targets inside this chapter's interactive page. */
  steps: { id: string; label: string }[];
  /** Wiki concepts that open in the side drawer without leaving the guide. */
  concepts: { slug: string; label: string }[];
}

export interface Part {
  n: 1 | 2 | 3;
  title: string;
  short: string;
  range: string;
  blurb: string;
  href: string;
  chapter: string;
}

export const parts: Part[] = [
  {
    n: 1,
    title: 'Before your first code',
    short: 'Part one · Foundations',
    range: '1–4',
    blurb: 'What AI is, Chat vs Work vs Coding Agent, providers and where models run, Git and cloud hosting, and your first real loop on a laptop, desktop or phone.',
    href: 'journey/foundations/',
    chapter: 'foundations',
  },
  {
    n: 2,
    title: 'From one chat to twenty agents',
    short: 'Part two · The agents',
    range: '5–13',
    blurb: 'One chat, tool loops, context windows and context rot, memory files, automated checks, helpers, parallel worktrees, leads and fleets.',
    href: 'journey/agents/',
    chapter: 'whole',
  },
  {
    n: 3,
    title: 'From one job to a working week',
    short: 'Part three · The working week',
    range: '14–21',
    blurb: 'Tokens and billing, adversarial second-model review, readable proof, stepping in, parallel jobs, keeping a growing codebase healthy, teams and remote machines.',
    href: 'journey/week/',
    chapter: 'week',
  },
];

export const rungs: Rung[] = [
  // ---------- Part 1: Foundations ----------
  {
    id: 'ai',
    n: 1,
    part: 1,
    title: 'What AI can do',
    short: 'AI modes',
    line: 'Text, voice, images, video and reasoning—and what changes between Chat, Work and Coding Agent modes.',
    theme: 'foundations',
    adds: {
      plain: 'Know when a quick chat is enough, when Work mode helps with files and decisions, and when to switch to a coding agent that actually builds the app.',
      technical: 'Distinguish stateless chat completions, tool-assisted Work workspaces (search, files, voice/vision), and autonomous coding harnesses that edit, typecheck and run tests.',
      engineer: 'Map capability surfaces (multimodal I/O, structured tool calling, sandboxed execution) to failure modes and verification boundaries before picking a runtime.',
    },
    steps: [
      { id: 'predict', label: 'How it works' },
      { id: 'senses', label: 'Voice, vision & decisions' },
      { id: 'modes', label: 'Chat vs Work vs Agent' },
      { id: 'bridge', label: 'Why code is different' },
    ],
    concepts: [
      { slug: 'model', label: 'Model' },
      { slug: 'agent', label: 'Agent' },
      { slug: 'voice-input', label: 'Voice input' },
      { slug: 'token', label: 'Token' },
    ],
  },
  {
    id: 'providers',
    n: 2,
    part: 1,
    title: 'Providers and where AI runs',
    short: 'Providers',
    line: 'Anthropic, OpenAI, Google and local models—where the thinking runs versus where your files live.',
    theme: 'foundations',
    adds: {
      plain: 'The AI brain usually runs in a provider’s data centre while your project files stay on your own laptop or desktop—and your phone can steer it remotely.',
      technical: 'Separate inference location (provider API/plan vs local GPU) from execution surface (web app, desktop harness, CLI, API) and local workspace files.',
      engineer: 'Evaluate provider lock-in, data-residency boundaries, harness abstractions (T3 Code, Claude Code, Codex), and latency/privacy trade-offs between cloud and local weights.',
    },
    steps: [
      { id: 'labs', label: 'The providers' },
      { id: 'where-brain', label: 'Where it runs' },
      { id: 'surfaces', label: 'Web, app, CLI & API' },
      { id: 'devices', label: 'Laptop, desktop & phone' },
    ],
    concepts: [
      { slug: 'harness', label: 'Harness' },
      { slug: 'agentic-development-environment', label: 'Agentic IDE' },
      { slug: 'work-data-privacy', label: 'Data privacy' },
      { slug: 'api', label: 'API' },
    ],
  },
  {
    id: 'stack',
    n: 3,
    part: 1,
    title: 'Git, GitHub and the cloud',
    short: 'Git & cloud',
    line: 'Save points you can always undo, static sites versus dynamic servers with databases, and picking the right size.',
    theme: 'foundations',
    adds: {
      plain: 'Git is your unlimited undo button, GitHub is your safe cloud copy, static hosting is free and simple for pages, and dynamic hosting adds a server and database when users log in or save data.',
      technical: 'Commit before every agent run, push branches to GitHub for diffs and rollbacks, and choose static deploys (CDN) vs dynamic runtimes (Node/Postgres/env secrets) by state requirements.',
      engineer: 'Treat git history as the transaction log for agent mutations, isolate secrets and preview environments per branch, and match compute/database topology and specs to workload profile.',
    },
    steps: [
      { id: 'git', label: 'Git & safe undo' },
      { id: 'github', label: 'GitHub & branches' },
      { id: 'hosting', label: 'Static vs dynamic' },
      { id: 'specs', label: 'Servers & specs' },
    ],
    concepts: [
      { slug: 'version-control', label: 'Version control' },
      { slug: 'branch', label: 'Branch' },
      { slug: 'how-the-web-works', label: 'How the web works' },
      { slug: 'deployment', label: 'Deployment' },
      { slug: 'database', label: 'Database' },
    ],
  },
  {
    id: 'first',
    n: 4,
    part: 1,
    title: 'Your first real loop',
    short: 'First loop',
    line: 'An easy bridge from idea to working app across your phone, laptop or desktop PC—without guesswork.',
    theme: 'foundations',
    adds: {
      plain: 'Pick one small real thing to build, talk through the idea on phone or laptop, let the agent build a first version in a fresh folder, open it, and ask for one tweak at a time.',
      technical: 'Initialise a git repo, pick a simple typed stack with a built-in test runner, ask the agent to inspect before editing, and verify every turn with typecheck + tests + live preview.',
      engineer: 'Bootstrap a clean repository with strict TypeScript, unit test harness, AGENTS.md conventions and an isolated branch so every subsequent agent loop starts reproducible.',
    },
    steps: [
      { id: 'setup', label: 'Pick your device' },
      { id: 'project', label: 'One small real job' },
      { id: 'run', label: 'Watch the first loop' },
      { id: 'tweak', label: 'Check & steer' },
    ],
    concepts: [
      { slug: 'prompt', label: 'Prompt' },
      { slug: 'web-builders', label: 'Web builders' },
      { slug: 'preview-deployment', label: 'Preview link' },
    ],
  },

  // ---------- Part 2: The Agents ----------
  {
    id: 'chat',
    n: 5,
    part: 2,
    title: 'One chat',
    short: 'Chat',
    line: 'A model and its window. The window holds everything the model can see, and a new chat starts empty.',
    theme: 'core',
    adds: {
      plain: 'It knows your name only while your name is in the window. Start a new chat and it knows nothing you told it before.',
      technical: 'The model is stateless: every turn the app sends the whole conversation again, and the reply is computed from that alone.',
      engineer: 'Inference is a function of the tokens sent; any memory is the harness replaying history into the request.',
    },
    steps: [
      { id: 'two', label: 'Two parts' },
      { id: 'send', label: 'Say something' },
      { id: 'reread', label: 'Read every time' },
      { id: 'fresh', label: 'A new chat' },
    ],
    concepts: [
      { slug: 'model', label: 'Model' },
      { slug: 'context-window', label: 'Context window' },
      { slug: 'thread', label: 'Thread' },
    ],
  },
  {
    id: 'loop',
    n: 6,
    part: 2,
    title: 'It gets hands',
    short: 'Loop',
    line: 'Tools let it search, read, edit and run. One request from you becomes seven turns of its own; without a way to run, “fixed” is a guess.',
    theme: 'core',
    adds: {
      plain: 'The agent opens your files, changes them, runs the app’s checks, sees what failed and fixes it, before it comes back to you.',
      technical: 'The harness runs each tool call (grep, read, patch, npm test) and feeds the output back; the loop ends when the model answers without one.',
      engineer: 'An agent is a model in a tool-execution loop with a permission boundary; how far it gets alone depends on fast, deterministic feedback.',
    },
    steps: [
      { id: 'hands', label: 'Tools' },
      { id: 'fix', label: 'One request, many turns' },
      { id: 'norun', label: 'Take run away' },
      { id: 'ask', label: 'What it may do alone' },
    ],
    concepts: [
      { slug: 'agent-loop', label: 'Agent loop' },
      { slug: 'tool-call', label: 'Tool call' },
      { slug: 'permission-mode', label: 'Permissions' },
    ],
  },
  {
    id: 'window',
    n: 7,
    part: 2,
    title: 'The window fills',
    short: 'Window',
    line: 'Everything it reads stays and is read again every turn. With unrelated work in the window, the same request edits the wrong file at 31% full.',
    theme: 'core',
    adds: {
      plain: 'A bigger window holds more but does not think better. One job per chat, paste only the lines that matter, and start fresh with a short brief.',
      technical: 'Unrelated tool output competes with your instructions well before the limit (context rot). Compaction keeps a summary and drops the rest; /clear starts clean.',
      engineer: 'Recall falls as the token count grows; the hard limit is a wall, quality falls long before it. Scope threads per task and push searches into helpers.',
    },
    steps: [
      { id: 'pile', label: 'Nothing leaves' },
      { id: 'rot', label: 'Worse answers' },
      { id: 'long', label: 'Past full' },
      { id: 'compact', label: 'What survives' },
      { id: 'paste', label: 'Lines, not the log' },
    ],
    concepts: [
      { slug: 'context-window', label: 'Context window' },
      { slug: 'compaction', label: 'Compaction' },
      { slug: 'token', label: 'Token' },
    ],
  },
  {
    id: 'memory',
    n: 8,
    part: 2,
    title: 'Write it down',
    short: 'Memory',
    line: 'A new session starts empty. A short file in the project, AGENTS.md, is loaded before your first word in every one.',
    theme: 'core',
    adds: {
      plain: 'Write down the rules you are tired of repeating, in AGENTS.md. Add one when a mistake repeats; keep the file short.',
      technical: 'Put the package manager, the check command (tsc --noEmit, npm test) and the folder map in AGENTS.md or CLAUDE.md, so every session checks the same way.',
      engineer: 'Encode stack decisions, module boundaries and the definition of done in a versioned file; move procedures that only some tasks need into skills.',
    },
    steps: [
      { id: 'gone', label: 'A new session forgets' },
      { id: 'file', label: 'AGENTS.md' },
      { id: 'grow', label: 'Keep it short' },
      { id: 'skills', label: 'Skills' },
    ],
    concepts: [
      { slug: 'instruction-file', label: 'Instruction file' },
      { slug: 'skill', label: 'Skill' },
    ],
  },
  {
    id: 'check',
    n: 9,
    part: 2,
    title: 'Make it prove it',
    short: 'Check',
    line: 'It says “done” either way: four of six made-up jobs come out broken. A check sends them back; each check catches one kind of wrong.',
    theme: 'quality',
    adds: {
      plain: 'Ask it to run the app and try what it changed before it says done, and to look at it on a phone. Tell it what must never happen.',
      technical: 'tsc --noEmit catches broken types, unit tests catch wrong logic, a browser check catches layout. None catches what no test asserts.',
      engineer: 'Fast checks in the loop and pre-commit, all of them in CI before merge. A check proves only what it asserts; spec gaps need a test from the requirement.',
    },
    steps: [
      { id: 'done', label: 'Done either way' },
      { id: 'tests', label: 'A check in the way' },
      { id: 'more', label: 'One check, one kind' },
      { id: 'spec', label: 'What no check sees' },
    ],
    concepts: [
      { slug: 'verification', label: 'Verification' },
      { slug: 'test', label: 'Tests' },
      { slug: 'browser-check', label: 'Browser check' },
      { slug: 'limits-of-checking', label: 'Limits of checking' },
    ],
  },
  {
    id: 'handoff',
    n: 10,
    part: 2,
    title: 'A second agent',
    short: 'Handoff',
    line: 'A helper starts with an empty window. A brief goes in, three lines come back, and its window is thrown away; it knows only what the brief says.',
    theme: 'scale',
    adds: {
      plain: 'Send a helper to read the messy files so your main chat stays short. Tell it everything in the brief, including what not to touch.',
      technical: 'Searches and log triage go to a subagent; only its summary enters the main thread. It sees none of the conversation, so the brief carries the constraints.',
      engineer: 'Treat delegation like an RPC contract: inputs, allowed side effects and the shape of the answer, stated in the brief.',
    },
    steps: [
      { id: 'alone', label: 'Searching fills the window' },
      { id: 'hand', label: 'Hand it to a helper' },
      { id: 'brief', label: 'Only the brief' },
    ],
    concepts: [
      { slug: 'subagent', label: 'Helper (subagent)' },
      { slug: 'context-window', label: 'Context window' },
    ],
  },
  {
    id: 'parallel',
    n: 11,
    part: 2,
    title: 'Side by side',
    short: 'Parallel',
    line: 'Three helpers in one folder overwrite each other. Give each its own copy (a worktree) and merge into main one at a time.',
    theme: 'scale',
    adds: {
      plain: 'Each helper gets its own copy of the project, so their changes cannot land on top of each other; finished work goes into main one piece at a time.',
      technical: 'One git worktree and branch per task: separate files, separate test runs, a clean merge into main. git worktree add ../club-search -b search.',
      engineer: 'Worktrees stop clashes on disk, not conflicts in code: split tasks by the files they own, and merge one branch at a time.',
    },
    steps: [
      { id: 'three', label: 'One folder' },
      { id: 'copies', label: 'A copy each' },
      { id: 'more', label: 'How many?' },
    ],
    concepts: [
      { slug: 'worktree', label: 'Worktree' },
      { slug: 'branch', label: 'Branch' },
      { slug: 'parallel-work', label: 'Parallel work' },
    ],
  },
  {
    id: 'lead',
    n: 12,
    part: 2,
    title: 'A lead',
    short: 'Lead',
    line: 'The agent you talk to stops building. It briefs five helpers, merges what passes the check, and keeps its window for five-line reports.',
    theme: 'scale',
    adds: {
      plain: 'One agent splits the goal, hands out the pieces and checks what comes back, so you talk to one agent instead of five.',
      technical: 'The lead writes briefs, runs the check on each branch, merges what passes and asks helpers for short reports, not diffs and logs.',
      engineer: 'Keep the lead’s context for decisions and integration; compress every report at the boundary, and judge work on a different model from the one that built it.',
    },
    steps: [
      { id: 'roles', label: 'One plans, five build' },
      { id: 'reports', label: 'What the lead reads' },
      { id: 'shapes', label: 'Other ways to split' },
      { id: 'gate', label: 'A check before main' },
    ],
    concepts: [
      { slug: 'orchestration', label: 'Orchestration' },
      { slug: 'subagent', label: 'Helper (subagent)' },
    ],
  },
  {
    id: 'fleet',
    n: 13,
    part: 2,
    title: 'Twenty in a loop',
    short: 'Fleet',
    line: 'Forty tasks, twenty helpers, one check in front of main. You decide what goes on the list and read what gets through.',
    theme: 'scale',
    adds: {
      plain: 'At this size you stop watching edits. You write the list of tasks, and you read what passed the check.',
      technical: 'Well-scoped tasks with a check each; the lead merges what passes. Every helper turn reads its own window again, which is what lesson 14 prices.',
      engineer: 'Throughput is set by the check and the merge order, not by the number of helpers. Cost scales with the number of windows.',
    },
    steps: [
      { id: 'twenty', label: 'Twenty helpers' },
      { id: 'nogate', label: 'Without the check' },
      { id: 'yours', label: 'What is left for you' },
    ],
    concepts: [
      { slug: 'orchestration', label: 'Orchestration' },
      { slug: 'verification', label: 'Verification' },
    ],
  },

  // ---------- Part 3: The Working Week ----------
  {
    id: 'meter',
    n: 14,
    part: 3,
    title: 'What it costs',
    short: 'Cost',
    line: 'Every turn re-reads the whole window, counting against a monthly plan or adding to an API bill.',
    theme: 'scale',
    adds: {
      plain: 'Long chats cost much more than short ones because the AI re-reads the whole conversation every turn; a monthly plan covers everyday work, and fresh threads keep usage light.',
      technical: 'Input tokens scale quadratically across turns unless prompt caching hits; keep prefix files stable, split long sessions and reserve expensive models for hard debugging.',
      engineer: 'Model O(n²) prefix-re-read economics, prompt-cache TTL/invalidation boundaries, and tiered model routing across plan allowances vs metered API spend.',
    },
    steps: [
      { id: 'turn', label: 'Every turn re-reads' },
      { id: 'api', label: 'API prices' },
      { id: 'cache', label: 'Prompt caching' },
      { id: 'plan', label: 'Monthly plans' },
      { id: 'many', label: 'Fleet spend' },
    ],
    concepts: [
      { slug: 'token', label: 'Token' },
      { slug: 'prompt-caching', label: 'Prompt caching' },
      { slug: 'subscription-plan', label: 'Subscription plan' },
      { slug: 'usage-window', label: 'Usage window' },
    ],
  },
  {
    id: 'review',
    n: 15,
    part: 3,
    title: 'A second model',
    short: 'Review',
    line: 'One model builds, a different model in a fresh window tries to break it, and they loop until real bugs are gone.',
    theme: 'quality',
    adds: {
      plain: 'Asking the same chat “is this right?” misses bugs it just made; hand the finished work to a different model with instructions to try to break it, and stop once real bugs are fixed.',
      technical: 'Send only the spec + git diff to a fresh reviewer model with an adversarial brief (“find failing edge cases, broken auth, missing tests”) and cap at real defects, not style nitpicks.',
      engineer: 'Break correlated blind spots with cross-vendor adversarial diff review in a clean context, scoped strictly to correctness, security and architectural invariants with a hard stopping rule.',
    },
    steps: [
      { id: 'self', label: 'Self-check misses bugs' },
      { id: 'second', label: 'Fresh second model' },
      { id: 'attack', label: 'Try to break it' },
      { id: 'rounds', label: 'Stop rule' },
      { id: 'how', label: 'Three ways to run it' },
    ],
    concepts: [
      { slug: 'review', label: 'Review' },
      { slug: 'diff', label: 'Diff' },
      { slug: 'limits-of-checking', label: 'Limits of checking' },
    ],
  },
  {
    id: 'proof',
    n: 16,
    part: 3,
    title: 'Proof you can read',
    short: 'Proof',
    line: 'Don’t accept “done.” Require a summary, test output, screenshot and live link matched to the job.',
    theme: 'quality',
    adds: {
      plain: 'Ask every finished job to come back with four pieces of proof you can check in seconds: a short summary, a screenshot, a link to click, and confirmation the checks ran.',
      technical: 'Standardize a Definition of Done bundle: diff summary, `tsc --noEmit` + unit test output, visual screenshot for UI changes, and a live preview URL or progress log for long runs.',
      engineer: 'Make verification artifacts first-class outputs of every agent run (machine-readable check status, coverage/regression evidence, preview build, structured progress file) so review scales O(1).',
    },
    steps: [
      { id: 'word', label: '“Done” is not proof' },
      { id: 'cards', label: 'Four proof cards' },
      { id: 'catch', label: 'What each catches' },
      { id: 'during', label: 'Progress while running' },
      { id: 'ask', label: 'Match proof to job' },
    ],
    concepts: [
      { slug: 'definition-of-done', label: 'Definition of done' },
      { slug: 'browser-check', label: 'Browser check' },
      { slug: 'preview-deployment', label: 'Preview link' },
    ],
  },
  {
    id: 'turn',
    n: 17,
    part: 3,
    title: 'Your turn',
    short: 'Your turn',
    line: 'Step in at the right moment: approve a short plan first, answer clarifying questions, or pin notes mid-run.',
    theme: 'quality',
    adds: {
      plain: 'You don’t have to wait until the end and redo everything—check a 5-line plan first, answer quick questions, and drop small notes while the agent works.',
      technical: 'Use Plan mode before multi-file changes to lock file paths, types and test strategy up front; queue mid-run steering notes instead of interrupting tool loops.',
      engineer: 'Front-load architectural and stack decisions into an explicit plan/spec review so execution loops stay autonomous; build lightweight review/notes tools when inspecting big batches.',
    },
    steps: [
      { id: 'once', label: 'One shot vs steering' },
      { id: 'plan', label: 'Approve the plan' },
      { id: 'ask', label: 'Let it ask first' },
      { id: 'pin', label: 'Queue a mid-run note' },
      { id: 'build', label: 'Throwaway review tools' },
    ],
    concepts: [
      { slug: 'plan-mode', label: 'Plan mode' },
      { slug: 'queue-and-steer', label: 'Queue and steer' },
      { slug: 'giving-feedback', label: 'Giving feedback' },
    ],
  },
  {
    id: 'jobs',
    n: 18,
    part: 3,
    title: 'Several jobs',
    short: 'Jobs',
    line: 'Run multiple jobs at once across one project or several—while remembering there is still only one of you.',
    theme: 'scale',
    adds: {
      plain: 'Start a second job while the first one runs, but cap how many you juggle at once—and ask for clear proof so checking them doesn’t become a full-time bottleneck.',
      technical: 'Keep 2–3 isolated worktrees moving in parallel; use a simple status board (job name, test state, what it needs from you) so context-switching stays cheap.',
      engineer: 'Optimize for human review bandwidth, not idle GPU avoidance: cap WIP where your review latency keeps agents fed, and decouple independent repos from shared-codebase merge queues.',
    },
    steps: [
      { id: 'one', label: 'Waiting on one job' },
      { id: 'three', label: 'Start another' },
      { id: 'many', label: 'Only one of you' },
      { id: 'projects', label: 'One project vs several' },
      { id: 'board', label: 'A job board' },
    ],
    concepts: [
      { slug: 'parallel-work', label: 'Parallel work' },
      { slug: 'worktree', label: 'Worktree' },
      { slug: 'shortcuts', label: 'Shortcuts' },
    ],
  },
  {
    id: 'grow',
    n: 19,
    part: 3,
    title: 'The project grows',
    short: 'Growth',
    line: 'Every feature adds files and leftover code. Clean-ups and test-guarded refactors are real jobs too.',
    theme: 'quality',
    adds: {
      plain: 'As your app grows, leftover unused code slows every future job down—schedule a quick tidy-up pass every few features so the app stays easy to change.',
      technical: 'Dead files bloat context reads and confuse agents; run dedicated dead-code clean-ups and always require green typechecks + unit tests before and after any refactor.',
      engineer: 'Manage architectural entropy deliberately: separate behavioral changes from structural refactors, enforce module boundaries, and use regression suites as safety nets during extraction.',
    },
    steps: [
      { id: 'adds', label: 'Code piles up' },
      { id: 'junk', label: 'Dead code slows reads' },
      { id: 'clean', label: 'Clean-up as a job' },
      { id: 'refactor', label: 'Test-guarded refactors' },
    ],
    concepts: [
      { slug: 'test', label: 'Tests' },
      { slug: 'verification', label: 'Verification' },
      { slug: 'diff', label: 'Diff' },
    ],
  },
  {
    id: 'people',
    n: 20,
    part: 3,
    title: 'Other people',
    short: 'People',
    line: 'Pull requests, colleagues, clients and real users—small verified changes get fast feedback that drives the next job.',
    theme: 'scale',
    adds: {
      plain: 'Share small working updates with a live preview link instead of huge mystery changes—colleagues and clients reply faster, and their notes become your next prompt.',
      technical: 'Keep PRs small (<200 lines) with green CI, unit tests and screenshots attached; deploy preview links per branch so non-technical reviewers test real behavior, not code.',
      engineer: 'Treat human review attention as a scarce resource: slice changes along clean boundaries, attach automated proof and preview URLs, and close the loop from user telemetry/feedback into queued tickets.',
    },
    steps: [
      { id: 'pr', label: 'Pull requests' },
      { id: 'peer', label: 'Colleague review' },
      { id: 'client', label: 'Client previews' },
      { id: 'users', label: 'Real users' },
      { id: 'loop', label: 'Feedback into next job' },
    ],
    concepts: [
      { slug: 'pull-request', label: 'Pull request' },
      { slug: 'preview-deployment', label: 'Preview link' },
      { slug: 'sharing-privately', label: 'Sharing privately' },
    ],
  },
  {
    id: 'where',
    n: 21,
    part: 3,
    title: 'Other machines',
    short: 'Machines',
    line: 'Your laptop, a desktop PC or always-on box, the cloud—and your phone steering them from anywhere.',
    theme: 'scale',
    adds: {
      plain: 'Close your laptop lid and local jobs pause; run long jobs on a desktop PC that stays on or in the cloud, and check in or approve work from your phone.',
      technical: 'Match execution host to the job: laptop for interactive UI work, always-on desktop/home box for long test runs and remote phone control, cloud sandboxes (with setup scripts) for parallel background PRs.',
      engineer: 'Ensure environment parity across laptop, always-on workstation and ephemeral cloud containers (declarative setup scripts, seeded test DBs, isolated credentials) so any job can migrate cleanly.',
    },
    steps: [
      { id: 'laptop', label: 'On your laptop' },
      { id: 'lid', label: 'Close the lid' },
      { id: 'box', label: 'Desktop / always-on box' },
      { id: 'cloud', label: 'Cloud sandboxes' },
      { id: 'mix', label: 'Which job goes where' },
    ],
    concepts: [
      { slug: 'always-on-machine', label: 'Always-on machine' },
      { slug: 'deployment', label: 'Deployment' },
      { slug: 'secrets', label: 'Secrets' },
    ],
  },
];

export const rung = (id: string) => rungs.find((r) => r.id === id)!;
export const after = (id: string) => rungs[rungs.findIndex((r) => r.id === id) + 1];
export const partOf = (chapter: string): Part =>
  parts.find((p) => p.chapter === chapter) ?? parts[(rungs.find((r) => r.id === chapter)?.part ?? 1) - 1]!;
export const rungsOf = (part: 1 | 2 | 3) => rungs.filter((r) => r.part === part);
