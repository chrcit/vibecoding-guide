// Per-element mental-model notes for every chapter step that doesn't compute dynamic action-level notes.
// Each entry explains concretely what that guide element adds to the mental model, adapted to the
// reader's selected level: plain (Vibe coding — outcomes & habits), technical (typechecking, unit tests,
// git & commands), engineer (architecture, invariants, stack & system economics).
import type { Level } from '../lib/levels';

export interface StepNote {
  part: string;
  text: Record<Level, string>;
}

export const STEP_NOTES: Record<string, Record<string, StepNote>> = {
  chat: {
    two: {
      part: 'Stateless model + context window.',
      text: {
        plain: 'The model has no hidden notebook behind the scenes—everything it knows about your project has to sit inside this visible window.',
        technical: 'Each API call is stateless: the model reads only the current token window and produces the next completion with zero hidden memory.',
        engineer: 'Treat the model as a pure function over the prompt buffer—reproducible behaviour comes from controlling what enters that buffer.',
      },
    },
    send: {
      part: 'Every reply enters the window.',
      text: {
        plain: 'Both your message and the AI’s reply stack up inside the window so the next turn can see what was already said.',
        technical: 'User prompts and assistant turns append sequentially; every follow-up turn re-sends the entire prefix to the model.',
        engineer: 'Appending turns grows the prompt prefix monotonically, coupling conversation length directly to latency, cost and attention dilution.',
      },
    },
    reread: {
      part: 'Full re-read on every turn.',
      text: {
        plain: 'The model “remembers” your name only because the app replays the whole conversation from the top on every message.',
        technical: 'Self-attention runs across the entire message history on every turn—if a detail is not in the transcript, the model cannot recall it.',
        engineer: 'Conversation continuity is an illusion maintained by full-history replay (mitigated on cost by prefix caching, not on attention noise).',
      },
    },
    fresh: {
      part: 'New chat = clean slate.',
      text: {
        plain: 'Opening a new chat empties the window completely—great for clearing confusion, as long as anything worth keeping is saved in a file.',
        technical: 'A fresh thread resets the token buffer to zero: no stale traces, no forgotten assumptions, ready for a clean task spec.',
        engineer: 'Resetting context is your primary defense against attention rot; persist durable specs and invariants on disk, not in chat logs.',
      },
    },
  },
  loop: {
    hands: {
      part: 'Tools turn chat into an agent.',
      text: {
        plain: 'Giving the model four tools—search, read, edit, run—lets it look at your real files and make changes instead of making you copy-paste.',
        technical: 'Structured tool calls let the harness execute file reads, patches and shell commands (`tsc`, `vitest`) and pipe stdout back into context.',
        engineer: 'The harness bridges probabilistic text generation to deterministic OS primitives; tool design determines what the agent can observe and verify.',
      },
    },
    fix: {
      part: 'Observe → edit → run → fix.',
      text: {
        plain: 'Notice the magic: when the first try breaks a check, the agent sees the failure itself and fixes it before coming back to you.',
        technical: 'Running the test suite inside the loop turns compiler/test failures into immediate feedback—no manual copy-paste of stack traces.',
        engineer: 'Closing the feedback loop with fast local oracles (typechecker + unit tests) converts open-ended generation into iterative convergence.',
      },
    },
    again: {
      part: 'Autonomous inner loop.',
      text: {
        plain: 'One clear goal from you triggers several turns of reading, editing and checking on its own—you only step in once the result is ready.',
        technical: 'A single well-scoped prompt drives multiple read/patch/test cycles until the exit code is zero and the diff matches the brief.',
        engineer: 'Maximize work-per-human-turn by investing in crisp specifications and fast deterministic checks rather than micro-steering each edit.',
      },
    },
    norun: {
      part: 'No run tool = flying blind.',
      text: {
        plain: 'Without the ability to run your app or checks, the agent guesses that its fix worked—and hands you broken code with total confidence.',
        technical: 'Disabling command execution strips away `tsc --noEmit` and unit tests; syntax errors and logic bugs survive straight into your diff.',
        engineer: 'An agent without execution feedback is a blind code generator; always expose safe local build, typecheck and test runners.',
      },
    },
    ask: {
      part: 'Permission gates & trust boundaries.',
      text: {
        plain: 'Auto-approve safe reads and local tests so the agent keeps moving, while keeping an approval gate on risky actions like deleting data or deploying.',
        technical: 'Approve read-only tools and local `tsc`/`test` runs automatically; gate destructive shell commands, git pushes and external network calls.',
        engineer: 'Design least-privilege sandboxes (local worktrees, isolated test DBs) so the inner loop runs uninterrupted while irreversible side effects require explicit consent.',
      },
    },
  },
  handoff: {
    alone: {
      part: 'Exploration fills the main window.',
      text: {
        plain: 'When one agent hunts through seven files to find one answer, all seven files stay stuck in its window and clutter the actual build.',
        technical: 'Exploratory `grep` and file reads bloat the main thread’s context with irrelevant code before you even start writing the patch or tests.',
        engineer: 'Mixing broad discovery with implementation pollutes the primary working set, accelerating context rot and inflating prefix cost.',
      },
    },
    hand: {
      part: 'Subagent = disposable context.',
      text: {
        plain: 'A helper starts with an empty window, reads the messy files, sends back a 3-line summary, and gets thrown away—keeping your main agent sharp.',
        technical: 'Delegate codebase search or log triage to a subagent so only the distilled file paths, symbols and line numbers enter the main thread.',
        engineer: 'Subagents act as context firewalls: isolate high-volume read/search noise in ephemeral windows and pass only structured summaries across the boundary.',
      },
    },
    brief: {
      part: 'The helper only knows its brief.',
      text: {
        plain: 'A helper cannot see your earlier chat—if you forget to include a rule like “read only, don’t edit”, it will happily go off-script.',
        technical: 'Explicitly pass scope, read-only constraints and expected output format in every delegation brief; never assume inherited thread context.',
        engineer: 'Treat subagent delegation like an RPC contract: define inputs, invariants, allowed side effects and return schema explicitly.',
      },
    },
  },
  parallel: {
    three: {
      part: 'Shared folder = clobbered edits.',
      text: {
        plain: 'Three agents editing the exact same folder at once step on each other’s files and break each other’s work.',
        technical: 'Concurrent agents on one working tree cause dirty diffs, conflicting file saves and polluted test runs.',
        engineer: 'Mutable shared working directories break isolation—never run parallel write-capable agents against the same checkout.',
      },
    },
    copies: {
      part: 'Git worktrees isolate parallel jobs.',
      text: {
        plain: 'Each agent gets its own clean copy of your project (a worktree) so they can build three features at once and merge them neatly one by one.',
        technical: 'One git worktree + branch per task gives every agent isolated files, its own `tsc`/unit-test run, and a clean PR diff into `main`.',
        engineer: 'Worktrees provide cheap filesystem & branch isolation on a shared object store, serializing integration cleanly at the merge gate.',
      },
    },
    more: {
      part: 'Scaling workers shifts the bottleneck.',
      text: {
        plain: 'Adding more parallel agents speeds up building, but only if you keep jobs small and clear enough that you can actually review what comes back.',
        technical: 'Five concurrent worktrees multiply merge conflicts and review load unless tasks touch disjoint modules with passing automated suites.',
        engineer: 'Parallelism scales cleanly only across orthogonal module boundaries with automated verification; otherwise merge contention and human review saturate.',
      },
    },
  },
  lead: {
    roles: {
      part: 'Lead orchestrator + specialist builders.',
      text: {
        plain: 'Instead of juggling five chats yourself, one lead agent breaks the goal into pieces, assigns helpers, and brings you one combined update.',
        technical: 'An orchestrator decomposes a spec into bounded subtasks, dispatches workers per module, and coordinates `tsc` + test verification before reporting.',
        engineer: 'Hierarchical orchestration separates planning/coordination from execution, keeping the lead’s context focused on architecture and integration contracts.',
      },
    },
    shapes: {
      part: 'Match the team shape to the risk.',
      text: {
        plain: 'Use Build→Review for tricky features, Plan→Build→Review for big changes, or Best-of-two when you want to compare two approaches.',
        technical: 'Choose pair (builder + reviewer), pipeline (plan → implement + unit tests → review), or parallel best-of-N based on blast radius.',
        engineer: 'Different coordination topologies trade token spend for variance reduction: pipelines enforce upfront design, pairs catch blind spots, N-way tournaments hedge hard design choices.',
      },
    },
    gate: {
      part: 'Merge gate protects main.',
      text: {
        plain: 'Every helper’s work has to pass the check before touching your live project—broken edits bounce back automatically.',
        technical: 'Require full `tsc --noEmit`, unit tests and lint to pass at the merge gate so broken worker branches never poison `main`.',
        engineer: 'A mandatory CI/local merge gate preserves `main` as a permanently green invariant regardless of how many autonomous workers run.',
      },
    },
    reports: {
      part: 'Short structured reports protect the lead.',
      text: {
        plain: 'If five builders dump their entire messy logs back to the lead, the lead’s window rots too—short status reports keep it clear-headed.',
        technical: 'Return compact summaries (changed files, test counts, remaining risks) rather than raw transcripts so the orchestrator avoids context rot.',
        engineer: 'Enforce strict information compression at every agent boundary; verbose child outputs collapse parent reasoning quality.',
      },
    },
  },
  fleet: {
    twenty: {
      part: 'Fleet = verification-driven workflow.',
      text: {
        plain: 'At twenty agents you stop babysitting individual edits—you write clear goals and review only the finished work that passed every check.',
        technical: 'High-concurrency runs work only when tasks are well-decomposed and guarded by strict types, unit suites and preview checks.',
        engineer: 'At fleet scale your role shifts from line-level authoring to system design: spec clarity, module decoupling, oracle coverage and merge-queue throughput.',
      },
    },
    nogate: {
      part: 'Fleet without checks = chaos at speed.',
      text: {
        plain: 'Running twenty agents with no checks doesn’t make you twenty times faster—it just piles up twenty broken changes for you to untangle.',
        technical: 'Removing typecheck and test gates scales defect injection linearly with worker count; `main` breaks immediately.',
        engineer: 'Autonomy without deterministic verification amplifies entropy—never increase concurrency faster than your automated oracle coverage.',
      },
    },
    yours: {
      part: 'Your real job: intent, taste & judgement.',
      text: {
        plain: 'Machines check syntax and tests; only you decide whether the app actually feels good and solves the right problem for your users.',
        technical: 'Let automated suites verify types and regressions while you focus human attention on architecture, edge-case specs and real user flows.',
        engineer: 'Reserve human cognitive bandwidth for irreducible decisions: problem framing, architectural boundaries, stack choices and product quality.',
      },
    },
  },
  meter: {
    count: {
      part: 'Every turn reads the whole window.',
      text: {
        plain: 'The model keeps no memory between turns: each turn it reads everything in its window again. A long job costs more than its last message suggests.',
        technical: 'Each request sends the whole window as input. File reads, tsc output and test logs stay in it and are paid for again on every later turn.',
        engineer: 'Input per turn is the window so far, so a job’s input grows with the square of its turns. Short threads and terse tool output are the cheapest optimisation.',
      },
    },
    api: {
      part: 'The API bills every token.',
      text: {
        plain: 'On the API you pay for what the model reads and what it writes, at a price per million tokens. Reading is most of the bill.',
        technical: 'Bill = input tokens × input price + output tokens × output price. On an agent loop, input is most of it.',
        engineer: 'Per-job cost is dominated by input, so model price per input token and the turns a job takes matter more than how long the replies are.',
      },
    },
    cache: {
      part: 'The cache makes rereading cheap.',
      text: {
        plain: 'What the model read last turn is kept for a while and costs a fraction to read again. Changing model or effort halfway throws it away.',
        technical: 'Cache reads are billed at a fraction of the input price; new tokens are cache writes at a premium. A changed prefix misses.',
        engineer: 'A hit needs an identical prefix: tools, system prompt, messages. Keep the instruction file, the tool set and the effort level stable within a thread.',
      },
    },
    plan: {
      part: 'A plan is a fixed price.',
      text: {
        plain: 'A plan costs the same each month. When its allowance runs out the agent pauses until the reset; nothing more is charged unless you turn on usage credits.',
        technical: 'Plan usage is limited per five hours and per week, shared across models and surfaces. Claude Code shows it with /usage.',
        engineer: 'A plan trades throughput for a predictable bill. The provider publishes no token figure for the limit, so measure your own jobs before you plan capacity on it.',
      },
    },
    many: {
      part: 'Agents multiply the meter.',
      text: {
        plain: 'Every agent you start draws from the same plan or the same bill. Twenty agents empty a plan twenty times as fast.',
        technical: 'Subagents and parallel agents each send their own requests, all counted against the same plan or API key.',
        engineer: 'At fleet scale cost is a design input: turns per job, cache hit rate and model price per job decide the hourly bill.',
      },
    },
  },
  review: {
    self: {
      part: 'A model reviewing itself reads its own reasoning.',
      text: {
        plain: 'Asked to check its own work, the agent reads the same window it built in, with the same assumptions. It finds little it did not already think of.',
        technical: 'Self-review happens in the same context: the tests it wrote encode its own reading of the task, so they pass.',
        engineer: 'Same context, same model: the errors are correlated with the build. Passing tests the builder wrote says little about the cases it never imagined.',
      },
    },
    second: {
      part: 'A fresh window and a different model.',
      text: {
        plain: 'The reviewer sees only what you asked for and what changed. It has none of the builder’s reasoning and none of its habits.',
        technical: 'Give the reviewer the task and git diff, nothing else. Findings go back to the builder; repeat until a round finds nothing.',
        engineer: 'Two sources of independence: a clean context and a different model. Each reduces how often builder and reviewer miss the same case.',
      },
    },
    attack: {
      part: 'Ask it to break the change.',
      text: {
        plain: '“Review this” gets “looks good”. Ask for the ways it is wrong and how to see each one fail.',
        technical: 'Ask for concrete failures with a way to reproduce each: a command, a test to write, steps in the app. Tell it to skip style.',
        engineer: 'An adversarial brief asks for counterexamples, not opinions. Each finding comes with a check, which you can turn into a regression test.',
      },
    },
    rounds: {
      part: 'A stop rule ends the loop.',
      text: {
        plain: 'A reviewer told to find problems always finds something. Say “only what breaks, three rounds at most”.',
        technical: 'Scope the review to correctness and cap the rounds; every round costs both models’ allowances.',
        engineer: 'Bound the loop by severity and by count. Past the real defects the reviewer produces taste, and the spend keeps rising with no gain.',
      },
    },
    how: {
      part: 'Three ways to wire it.',
      text: {
        plain: 'Paste findings between two threads, hand one thread across, or let a lead run the rounds and report once.',
        technical: 'By hand gives the cleanest reviewer window; a handoff passes a selection of the thread; a lead automates the loop.',
        engineer: 'In a team the loop runs before the pull request, so the human reviewer reads a change that has already been attacked.',
      },
    },
  },
  proof: {
    word: {
      part: '“Done” is a claim.',
      text: {
        plain: 'One word for hundreds of changed lines. The check passed, but that only means the tests the agent wrote are green.',
        technical: 'tsc and the test suite passed. Whether the change does what you asked is not something they test.',
        engineer: 'Green CI proves internal consistency. Intent is still unverified until something you can read in seconds says what was built.',
      },
    },
    cards: {
      part: 'The tray holds the proof.',
      text: {
        plain: 'Four cards beside you: what changed, what was tested, what it looks like, and a link to try it.',
        technical: 'Summary with files touched, the test command and its output, a screenshot at a stated width, a preview link.',
        engineer: 'Make proof an output of every run: the same four artefacts go into the pull request, where a colleague reads them before the diff.',
      },
    },
    catch: {
      part: 'The check and the cards catch different things.',
      text: {
        plain: 'The check catches what a machine can see, like a type error. Whether it is what you meant only you can see, on a card.',
        technical: 'tsc and tests catch broken code. A test named for the wrong behaviour, a page edited in the wrong place: those show on the cards.',
        engineer: 'Automated gates verify the code against itself; proof cards verify it against your intent. You need both, and they fail differently.',
      },
    },
    during: {
      part: 'Proof while it runs.',
      text: {
        plain: 'A progress file shows each step as the agent does it, so you see a wrong turn early without stopping it.',
        technical: 'Ask the agent to keep a PROGRESS.md with each step and its state; read it while it works.',
        engineer: 'A progress file is cheap observability: drift shows at the step it happens, not at the end of the run.',
      },
    },
    ask: {
      part: 'The job decides the proof.',
      text: {
        plain: 'A page: screenshots and a link. A script: rows before and after. A bug fix: a test that failed and now passes.',
        technical: 'Name the proof in the prompt: viewport widths, sample rows and counts, or a failing test plus its npm test output after the fix.',
        engineer: 'Match proof to risk: a red-then-green regression test for a defect, fixtures for a transform, a preview deploy for UI.',
      },
    },
  },
  turn: {
    once: {
      part: 'A fork in the request becomes a guess.',
      text: {
        plain: 'When a request can mean two things, the agent does not stop to ask. It picks one and builds on it.',
        technical: 'An ambiguous requirement turns into a silent assumption in the schema, the UI and the tests at once.',
        engineer: 'Every unresolved fork compounds: each later turn builds on the guess, so the cost of a wrong guess grows with the job.',
      },
    },
    plan: {
      part: 'A plan is the cheapest place to steer.',
      text: {
        plain: 'Reading four lines before any file changes takes seconds. Changing step 3 here costs nothing; changing it after costs twelve turns.',
        technical: 'Ask for the files, the types and the tests in the plan, and say: do not start until I say go.',
        engineer: 'Plan review is design review: settle the data model, permissions and test strategy before the loop runs on its own.',
      },
    },
    ask: {
      part: 'A question that does not block.',
      text: {
        plain: 'Tell the agent: if you hit a choice, ask me in one line and carry on with the rest.',
        technical: 'Uncertain product choices queue on the tray while the agent finishes the parts that do not depend on them.',
        engineer: 'Decouple the open decision from the rest of the work so your reply time is not on the critical path.',
      },
    },
    pin: {
      part: 'A note with a place.',
      text: {
        plain: 'A note pinned on a screenshot carries the spot it points at into the agent’s window, so it fixes the right thing first time.',
        technical: 'A pin gives the agent the screenshot and the element under it, not just a sentence it has to search for.',
        engineer: 'Feedback anchored to an element or file:line removes the search step and the wrong-target fix that comes with it.',
      },
    },
    build: {
      part: 'Build the instrument.',
      text: {
        plain: 'A small review page, built once, makes every later round of notes quicker: you write where you see the problem.',
        technical: 'A dev-only page writes notes to a file the agent reads at the start of each turn.',
        engineer: 'Tooling for your own review loop pays back on every job after it; in a team, the pull request is where the same notes land.',
      },
    },
  },
  jobs: {
    one: {
      part: 'One job = lots of waiting.',
      text: {
        plain: 'Running only one agent means you stare at a spinner while it works—and it sits idle the moment it finishes.',
        technical: 'Single-threaded agent runs leave either the human or the harness idle through most of the hour.',
        engineer: 'Serializing independent tasks caps throughput at human+model round-trip latency.',
      },
    },
    three: {
      part: 'Two or three jobs hit the sweet spot.',
      text: {
        plain: 'While two agents are building in their own worktrees, you review the third—everyone stays moving without feeling frantic.',
        technical: 'Running 2–3 isolated worktrees lets you review diffs and test runs on one branch while the others compile and execute suites.',
        engineer: 'Small-batch concurrency overlaps model execution with human review while keeping context-switching overhead low.',
      },
    },
    many: {
      part: 'You are the real bottleneck.',
      text: {
        plain: 'Five agents all saying vague “Done.” create a traffic jam on YOUR desk. Short proof cards cut each stop from 8 minutes down to 2.',
        technical: 'Parallel throughput is bounded by your review time per branch—clear diffs, green tests and concise summaries are what unlock concurrency.',
        engineer: 'By Little’s Law, adding workers past human review capacity only grows queue wait time unless you shrink per-task review service time.',
      },
    },
    projects: {
      part: 'One repo vs several repos.',
      text: {
        plain: 'In one project, jobs merge into the same main branch one by one. Across separate projects, each keeps its own folder and AGENTS.md rules.',
        technical: 'Cross-repo parallelism eliminates merge-queue contention completely, provided each repo carries its own self-contained `AGENTS.md` and test command.',
        engineer: 'Multi-repo workspaces decouple integration queues and lockfiles at the cost of stronger per-repo documentation hygiene.',
      },
    },
    board: {
      part: 'Name every thread by what it needs.',
      text: {
        plain: 'A sidebar full of “fix” and “new thread” wastes minutes just remembering what each one is. Clear titles + status let you triage in seconds.',
        technical: 'Track each thread by feature name, branch and state (`working`, `needs decision`, `ready to verify`) so context switches stay instant.',
        engineer: 'Explicit task-state boards minimize cognitive switching cost across concurrent agent streams.',
      },
    },
  },
  grow: {
    adds: {
      part: 'Every feature increases future reading.',
      text: {
        plain: 'As your app grows from 1 feature to 20, every new agent has to read more files before making its first safe edit.',
        technical: 'Codebase growth increases baseline context spent discovering types, routes and existing patterns before implementation begins.',
        engineer: 'Unbounded codebase growth raises per-task onboarding token cost unless clean module boundaries localize what an agent must read.',
      },
    },
    junk: {
      part: 'Dead code poisons every future session.',
      text: {
        plain: 'Old unused pages, duplicate helpers and dead code don’t sit harmlessly—future agents read them, get confused, and sometimes edit the wrong copy!',
        technical: 'Orphaned files and unused exports waste context tokens and actively cause context rot when agents edit stale duplicates instead of live modules.',
        engineer: 'Dead code is active negative leverage in agentic repos: it inflates token discovery cost and creates high-probability edit-target collisions.',
      },
    },
    clean: {
      part: 'Clean-up is a real job—keep it separate.',
      text: {
        plain: 'Ask for dedicated “tidy up unused files, change zero behaviour” jobs—with checks passing before and after—so future features stay fast.',
        technical: 'Run dedicated dead-code pruning passes (`knip`/`ts-prune` + unit suite verification) separate from feature PRs so diffs stay auditable.',
        engineer: 'Isolate structural hygiene commits from behavioral changes; verify zero functional drift via full test suite parity before and after.',
      },
    },
    refactor: {
      part: 'Never refactor without tests.',
      text: {
        plain: 'Splitting one giant messy file into neat smaller files makes every future agent smarter—as long as automated tests prove nothing broke along the way.',
        technical: 'Refactoring bloated modules shrinks per-task read size, but without automated unit tests guarding behaviour, silent regressions slip straight into `main`.',
        engineer: 'Tests are the precondition for safe agentic refactoring: modular boundaries shrink context footprint while the suite guarantees behavioral equivalence.',
      },
    },
    rhythm: {
      part: 'Tidy every ~5 features.',
      text: {
        plain: 'A quick tidy-up every few features keeps your project feeling crisp on day 100 instead of grinding to a halt under clutter.',
        technical: 'Cadenced hygiene (prune unused code, tighten types, split overgrown files every ~5 tasks) keeps context utilization flat as features accumulate.',
        engineer: 'Periodic entropy reduction amortizes maintenance cost and prevents exponential growth in per-task context load.',
      },
    },
  },
  people: {
    pr: {
      part: 'Pull request = shared safety gate.',
      text: {
        plain: 'When others work on the project too, changes wait in a pull request with automated checks and proof before joining the live app.',
        technical: 'Every agent branch lands through a PR carrying passing CI (`tsc`, unit tests), a focused diff and visual proof before merging to `main`.',
        engineer: 'The PR boundary enforces collective code ownership, CI determinism and reviewable change units across human and agent contributors.',
      },
    },
    peer: {
      part: 'Small PRs with proof respect teammates.',
      text: {
        plain: 'Dumping a 1,200-line AI change on a teammate jams the whole team. Forty focused lines with a test and screenshot get approved in two minutes.',
        technical: 'Ten agents can bury one human reviewer overnight—keep PRs atomic, self-contained and backed by passing tests + screenshots.',
        engineer: 'Human review bandwidth is the scarcest resource on an agent-accelerated team; optimize PR size and evidence density for reviewer throughput.',
      },
    },
    client: {
      part: 'Clients review live links, never code.',
      text: {
        plain: 'Send stakeholders a working preview link they can tap on their phone—their plain reaction immediately becomes the next clear brief for your agent.',
        technical: 'Preview deployments on every PR let non-technical stakeholders validate real behaviour instead of guessing from diffs or specs.',
        engineer: 'Tightening the preview-deployment feedback loop converts vague stakeholder expectations into concrete, testable requirements early.',
      },
    },
    users: {
      part: 'Turn every user bug into a permanent test.',
      text: {
        plain: 'Whenever a real user spots a bug, have the agent add an automated test for that exact bug alongside the fix so no user ever hits it twice.',
        technical: 'Every production defect becomes a permanent regression unit test—ensuring future agent edits cannot silently re-introduce the bug.',
        engineer: 'Ratchet test coverage monotonically from production incidents so the automated oracle encodes real-world edge cases forever.',
      },
    },
    loop: {
      part: 'The full feedback loop.',
      text: {
        plain: 'Once your app is live, real feedback from teammates, clients and users drives the next agent job—building turns into a calm weekly rhythm.',
        technical: 'Production telemetry, preview feedback and regression tests feed directly back into scoped agent briefs and verified PRs.',
        engineer: 'Closed-loop delivery links user observation → regression test → scoped agent execution → CI + peer review → preview deploy.',
      },
    },
  },
  where: {
    laptop: {
      part: 'Laptop: best for hands-on building.',
      text: {
        plain: 'Your laptop is where you steer live, preview screens side by side, and iterate quickly while you are sitting at the keyboard.',
        technical: 'Local laptop execution gives instant file watching, fast `tsc`/unit-test feedback and direct browser inspection.',
        engineer: 'Use the local workstation for high-bandwidth interactive work where tight edit-inspect latency dominates.',
      },
    },
    lid: {
      part: 'Close the lid → local jobs pause.',
      text: {
        plain: 'When your laptop sleeps, any agent running locally stops right where it was until you open the lid again.',
        technical: 'Local background tasks inherit your laptop’s sleep/network lifecycle—unreliable for long unattended runs.',
        engineer: 'Interactive laptops are poor hosts for asynchronous execution; decouple long-running agent tasks from workstation power state.',
      },
    },
    box: {
      part: 'Always-on desktop PC / home server + phone.',
      text: {
        plain: 'Run agents on a desktop PC or Mac mini that stays awake, and check progress or approve a plan right from your phone while away from your desk.',
        technical: 'An always-on machine keeps local repos, Docker/test DBs and dev servers warm 24/7 while you steer threads remotely via laptop or phone.',
        engineer: 'A dedicated always-on workstation combines full local-environment fidelity with uninterrupted background execution and mobile triage.',
      },
    },
    cloud: {
      part: 'Cloud sandboxes need reproducible setup.',
      text: {
        plain: 'Cloud coding agents run on fresh computers in a data center—great for running lots of jobs anywhere, as long as your project documents how to install and test itself.',
        technical: 'Ephemeral cloud sandboxes start blank: include deterministic install scripts, seed fixtures and test-DB setup so `pnpm test` passes cleanly.',
        engineer: 'Cloud agent execution demands hermetic, scripted environment provisioning (containers/setup hooks, mocked or ephemeral DBs) so verification parity matches local.',
      },
    },
    mix: {
      part: 'Match the machine to the job.',
      text: {
        plain: 'Use your laptop for live design tweaks, your always-on desktop for overnight refactors, cloud sandboxes for parallel chores, and your phone to unblock questions.',
        technical: 'Route interactive UI work to your laptop, long test-heavy runs to an always-on host, and self-contained bug fixes to cloud sandboxes—all landing on `main`.',
        engineer: 'Optimize across execution tiers (local, always-on host, ephemeral cloud) by balancing environment complexity, concurrency and latency—unified via Git and CI.',
      },
    },
  },
};
