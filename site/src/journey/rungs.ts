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
  /** What the part builds, in one plain sentence. */
  blurb: string;
  /** Where the part picks up: one line that ties it to the part before. */
  recap?: string;
  href: string;
  /** The overview's chapter script (journey/chapters): one step per lesson, keyed by lesson id. */
  chapter: string;
}

export const parts: Part[] = [
  {
    n: 1,
    title: 'Before your first code',
    short: 'Part one · Foundations',
    range: '1–4',
    blurb: 'What AI is and where it runs, the tools around your code (Git, GitHub, hosting), and your first loop with a coding agent on a laptop, desktop or phone.',
    href: 'journey/foundations/',
    chapter: 'foundations',
  },
  {
    n: 2,
    title: 'From one chat to twenty agents',
    short: 'Part two · The agents',
    range: '5–13',
    blurb: 'One chat grows into an agent with tools, a window that fills, an instruction file and a check, then helpers, a lead and a fleet of twenty.',
    recap: 'The loop you ran at the end of part one is one agent. This part takes it apart and grows it into twenty.',
    href: 'journey/agents/',
    chapter: 'whole',
  },
  {
    n: 3,
    title: 'From one job to a working week',
    short: 'Part three · The working week',
    range: '14–21',
    blurb: 'What the agents cost, who reviews their work, the proof you read, where you step in, several jobs at once, a growing project, other people and other machines.',
    recap: 'The fleet you just watched is what this part prices, checks and runs through a working week.',
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
    title: 'What an AI model does',
    short: 'AI model',
    line: 'It writes from what is in its window and nothing else. Voice, photos and recordings go in too. Chat, work and a coding agent differ in what it can reach.',
    theme: 'foundations',
    adds: {
      plain: 'Paste what it needs to know, or it will make something up. A coding agent can try its own work; a chat answer you have to try yourself.',
      technical: 'Every message resends the whole window. A coding agent runs your npm test and tsc --noEmit and reads the output.',
      engineer: 'The model is stateless; the harness picks the tools and assembles the window. Executable checks are what make agent output trustworthy.',
    },
    steps: [
      { id: 'predict', label: 'Only the window' },
      { id: 'inputs', label: 'Voice, photo, video' },
      { id: 'modes', label: 'Chat, work, agent' },
      { id: 'code', label: 'Code can be run' },
    ],
    concepts: [
      { slug: 'model', label: 'Model' },
      { slug: 'context-window', label: 'Context window' },
      { slug: 'voice-input', label: 'Voice input' },
      { slug: 'agent', label: 'Agent' },
    ],
  },
  {
    id: 'providers',
    n: 2,
    part: 1,
    title: 'Providers and where AI runs',
    short: 'Providers',
    line: 'Anthropic, OpenAI and others make the models. You reach them through an app, a coding tool on a plan, the API or T3 Code. The model runs far away; your files stay on your laptop.',
    theme: 'foundations',
    adds: {
      plain: 'One plan and one app are enough. The thinking happens on the provider’s computers; your files stay with you; a phone can steer a computer that stays on.',
      technical: 'Claude Code and Codex sign in with your plan; the API bills per token. Tools run locally and only their output is sent up.',
      engineer: 'Inference remote, execution local. What enters the window is what leaves your machine. Keep the setup portable across providers.',
    },
    steps: [
      { id: 'labs', label: 'Who makes them' },
      { id: 'reach', label: 'Four ways in' },
      { id: 'where', label: 'Model far, files near' },
      { id: 'devices', label: 'Laptop, desktop, phone' },
    ],
    concepts: [
      { slug: 'harness', label: 'Harness' },
      { slug: 'subscription-plan', label: 'Plan' },
      { slug: 'api', label: 'API' },
      { slug: 'work-data-privacy', label: 'Data privacy' },
    ],
  },
  {
    id: 'stack',
    n: 3,
    part: 1,
    title: 'Git, GitHub and hosting',
    short: 'Git & hosting',
    line: 'A commit is a save point, GitHub keeps a copy online, a pull request holds a change until it is checked, and a site is finished pages or a server with a database.',
    theme: 'foundations',
    adds: {
      plain: 'Have the agent save a version whenever something works and push it to GitHub. Static hosting for pages people read; a server when people save things others must see.',
      technical: 'git add -A, git commit, git push, git switch -c, a pull request with npm test in CI. Static output on a CDN against a process with a database.',
      engineer: 'One task, one branch, one pull request, required checks on main. Choose hosting by state and trust; every moving part is something to deploy and patch.',
    },
    steps: [
      { id: 'commit', label: 'Save points' },
      { id: 'github', label: 'The copy online' },
      { id: 'branch', label: 'Branch and pull request' },
      { id: 'hosting', label: 'Static or server' },
      { id: 'specs', label: 'How big a server' },
    ],
    concepts: [
      { slug: 'version-control', label: 'Version control' },
      { slug: 'branch', label: 'Branch' },
      { slug: 'pull-request', label: 'Pull request' },
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
    line: 'One app, one plan, one folder on the device in front of you. One small real job, and four beats: you ask, it builds, you look, you say what to change.',
    theme: 'foundations',
    adds: {
      plain: 'Start with the club’s member list. Ask it to ask you first, look at every version, and say exactly what to change.',
      technical: 'The first prompt asks for tests and a type check, so every version arrives with npm test and tsc --noEmit passing.',
      engineer: 'Approve a three-line stack proposal before any code; keep each turn one small, reviewable diff.',
    },
    steps: [
      { id: 'device', label: 'Your device' },
      { id: 'job', label: 'One small job' },
      { id: 'loop', label: 'Four beats' },
      { id: 'change', label: 'Say what to change' },
    ],
    concepts: [
      { slug: 'prompt', label: 'Prompt' },
      { slug: 'web-builders', label: 'Web builders' },
      { slug: 'version-control', label: 'Version control' },
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
    line: 'A new thread starts empty. An instruction file in the project, AGENTS.md, is loaded before your first word in every one.',
    theme: 'core',
    adds: {
      plain: 'Write the rules you are tired of repeating into AGENTS.md. Add one when a mistake repeats; keep the file short.',
      technical: 'Put the test runner, the check command (npm run check: tsc --noEmit, vitest run) and the folder map in AGENTS.md or CLAUDE.md, so every thread checks the same way.',
      engineer: 'Encode stack decisions, module boundaries and the definition of done in a versioned file; move procedures that only some tasks need into skills.',
    },
    steps: [
      { id: 'gone', label: 'A new thread forgets' },
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
      { slug: 'verification', label: 'Check' },
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
      technical: 'Searches and log triage go to a helper; only its summary enters the main thread. It sees none of the conversation, so the brief carries the constraints.',
      engineer: 'Treat delegation like an RPC contract: inputs, allowed side effects and the shape of the answer, stated in the brief.',
    },
    steps: [
      { id: 'alone', label: 'Searching fills the window' },
      { id: 'hand', label: 'Hand it to a helper' },
      { id: 'brief', label: 'Only the brief' },
    ],
    concepts: [
      { slug: 'subagent', label: 'Helper' },
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
      { slug: 'orchestration', label: 'Lead' },
      { slug: 'subagent', label: 'Helper' },
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
      { slug: 'orchestration', label: 'Lead' },
      { slug: 'verification', label: 'Check' },
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
    line: 'Several jobs at once, in one project or in several, with one of you to answer them.',
    theme: 'scale',
    adds: {
      plain: 'Three jobs on the club list, each in its own thread and its own copy of the project. You go to whichever needs you; proof and short questions keep each stop to a couple of minutes.',
      technical: 'One worktree and branch per job; each merges into main after the type check and tests. In one repo a later branch rebases when an earlier one touched the same file.',
      engineer: 'Throughput is set by your review time per stop, not by the number of agents. One repo shares history, CI and merge order; several repos isolate everything, secrets included.',
    },
    steps: [
      { id: 'one', label: 'Waiting on one job' },
      { id: 'three', label: 'Start another' },
      { id: 'many', label: 'One of you' },
      { id: 'projects', label: 'One project or several' },
      { id: 'board', label: 'A readable board' },
    ],
    concepts: [
      { slug: 'parallel-work', label: 'Parallel work' },
      { slug: 'worktree', label: 'Worktree' },
      { slug: 'thread', label: 'Thread' },
    ],
  },
  {
    id: 'grow',
    n: 19,
    part: 3,
    title: 'The project grows',
    short: 'Growth',
    line: 'Every feature adds code and some leave clutter. Clean-ups and refactors are jobs too.',
    theme: 'quality',
    adds: {
      plain: 'Feature 13 reads 39% of its window before its first edit. One clean-up later, feature 14 reads 28%. Every five features, a clean-up first.',
      technical: 'Clean-ups delete only, with the tests green before and after. Refactors run tsc and the tests after every move; without tests, a broken export reaches main.',
      engineer: 'Keep structural and behavioural changes in separate pull requests; the test suite is the only statement that behaviour stayed the same.',
    },
    steps: [
      { id: 'adds', label: 'Features add up' },
      { id: 'junk', label: 'Clutter left behind' },
      { id: 'clean', label: 'A clean-up' },
      { id: 'refactor', label: 'A refactor with tests' },
      { id: 'rhythm', label: 'Every five features' },
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
    line: 'Agents write the change; people decide what gets built and whether it ships.',
    theme: 'scale',
    adds: {
      plain: 'A change waits in front of main as a pull request until a person says yes. A colleague reads it, a client tries a link, users report bugs, and each of them hands you the next job.',
      technical: 'CI runs the type check and tests on every pull request; keep each one small with its test and a screenshot, and fix user bugs with a test first.',
      engineer: 'Reviewer time is the scarce resource. Size and evidence per pull request set throughput; tests written from incidents keep the same bug out.',
    },
    steps: [
      { id: 'pr', label: 'A pull request' },
      { id: 'peer', label: 'A colleague reads it' },
      { id: 'client', label: 'A client tries it' },
      { id: 'users', label: 'Users find bugs' },
      { id: 'loop', label: 'The widest loop' },
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
    line: 'Your laptop, an always-on computer, the cloud, and your phone to follow them.',
    theme: 'scale',
    adds: {
      plain: 'Close the lid and the laptop’s job stops; the always-on computer and the cloud carry on. Start on your laptop, and choose the permission mode before you walk away.',
      technical: 'Reach the always-on computer over Tailscale, SSH or T3 Connect. A cloud machine starts empty: give it a setup script so the tests can run there.',
      engineer: 'State lives where the agent runs: repository, threads, logins and secrets. Keep one setup script and one test command so any job runs anywhere.',
    },
    steps: [
      { id: 'laptop', label: 'On your laptop' },
      { id: 'lid', label: 'Close the lid' },
      { id: 'box', label: 'An always-on computer' },
      { id: 'cloud', label: 'A machine in the cloud' },
      { id: 'mix', label: 'Which job goes where' },
    ],
    concepts: [
      { slug: 'always-on-machine', label: 'Always-on computer' },
      { slug: 'permission-mode', label: 'Permission modes' },
      { slug: 'secrets', label: 'Secrets' },
    ],
  },
];

export const rung = (id: string) => rungs.find((r) => r.id === id)!;
export const after = (id: string) => rungs[rungs.findIndex((r) => r.id === id) + 1];
export const partOf = (chapter: string): Part =>
  parts.find((p) => p.chapter === chapter) ?? parts[(rungs.find((r) => r.id === chapter)?.part ?? 1) - 1]!;
export const rungsOf = (part: 1 | 2 | 3) => rungs.filter((r) => r.part === part);
