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
  review: {
    self: {
      part: 'Why self-review misses blind spots.',
      text: {
        plain: 'Asking the same agent to check its own work rarely catches big misses—it already convinced itself its approach was right.',
        technical: 'Reviewing inside the same context window inherits the builder’s assumptions and skips edge cases the builder never considered.',
        engineer: 'Same-context self-critique suffers from confirmation bias baked into the prior token trace; fresh context + fresh model breaks correlated errors.',
      },
    },
    second: {
      part: 'Fresh second model = real second pair of eyes.',
      text: {
        plain: 'A second model sees only what you asked for and what changed—none of the builder’s excuses—so it catches permission bugs and missed edge cases.',
        technical: 'Hand a fresh model only the spec and `git diff` (plus test summary) to surface logic regressions, missing auth checks and unhandled nulls.',
        engineer: 'Cross-family adversarial review over minimal diff + spec decorrelates failure modes without paying the token cost of the builder’s full transcript.',
      },
    },
    attack: {
      part: 'Tell the reviewer to try to break it.',
      text: {
        plain: 'A polite “review this” gets a polite “looks good!”. Ask explicitly: “Find real bugs, security holes, or anything that breaks what I asked for.”',
        technical: 'Prompt for concrete failure modes (auth bypass, missing edge-case tests, type escapes, race conditions) rather than open-ended feedback.',
        engineer: 'Adversarial review prompts shift the reviewer from sycophantic approval to falsification—demanding reproducible counterexamples or invariant violations.',
      },
    },
    rounds: {
      part: 'Always set a stop rule.',
      text: {
        plain: 'Without a stop rule, two models will nitpick variable names forever and burn your budget. Cap it: “real bugs only, max 3 rounds.”',
        technical: 'Scope reviews strictly to correctness, security and test gaps with a hard round cap so style bikeshedding doesn’t drain token budgets.',
        engineer: 'Bound automated review loops by severity threshold (blocking defects only) and iteration budget to prevent unbounded spend with zero quality gain.',
      },
    },
    how: {
      part: 'Three ways to wire the handoff.',
      text: {
        plain: 'Start by pasting findings across two threads, graduate to one-click handoff in T3 Code, or let a lead run the review loop automatically.',
        technical: 'Pick manual cross-thread review (cleanest isolation), harness handoff (fast in-app switch), or orchestrated review loops for recurring tasks.',
        engineer: 'Trade off context purity against coordination latency: clean-room diff handoffs preserve independence while orchestrated loops amortize human attention.',
      },
    },
  },
  proof: {
    word: {
      part: '“Done.” tells you nothing.',
      text: {
        plain: 'One word hides hundreds of changed lines—you should never have to guess whether the agent actually built what you pictured.',
        technical: 'A bare completion message forces manual `git diff` spelunking and ad-hoc local verification before you know if the spec was met.',
        engineer: 'Unstructured completion claims maximize human verification latency; require standardized evidence artifacts with every finished task.',
      },
    },
    cards: {
      part: 'Four proof cards at a glance.',
      text: {
        plain: 'Summary + test pass + screenshot + live preview link let you judge a whole feature in 30 seconds without reading a wall of code.',
        technical: 'Require a concise diff summary, exact `tsc`/unit-test output, mobile+desktop screenshots and a runnable link on every PR.',
        engineer: 'Structured verification bundles compress review time by surfacing behavioral, visual and static-check evidence before code inspection.',
      },
    },
    catch: {
      part: 'Tests pass ≠ right feature.',
      text: {
        plain: 'Tests can be 100% green while the wrong page was updated or an email goes to everyone—the proof cards let YOU spot intent misses instantly.',
        technical: 'Green unit tests only prove the assertions the agent wrote; inspecting test names, screenshots and live flows catches spec drift.',
        engineer: 'Automated checks verify internal consistency, not external intent—pair green CI with human-scannable behavioral proof.',
      },
    },
    during: {
      part: 'Progress trail catches detours early.',
      text: {
        plain: 'On longer jobs, a live checklist lets you spot the moment an agent wanders off into touching your login page—before it wastes ten more turns.',
        technical: 'Having long-running agents maintain a short progress log lets you catch unwanted refactors or scope creep mid-flight.',
        engineer: 'Observability into intermediate plan steps reduces sunk-cost rework by exposing architectural drift early in multi-turn runs.',
      },
    },
    ask: {
      part: 'Tailor the proof to the job.',
      text: {
        plain: 'Pages need phone + desktop screenshots and a link; data scripts need before/after rows and counts; bug fixes need a test that failed then passed.',
        technical: 'Specify the exact proof artifact in your prompt: viewport screenshots for UI, input/output fixtures for scripts, failing-then-passing unit test for bugs.',
        engineer: 'Match evidence to risk class—demand red-to-green regression tests for defects, deterministic fixtures for transforms, and rendered DOM/visual checks for UI.',
      },
    },
  },
  turn: {
    once: {
      part: 'Ambiguity makes agents guess.',
      text: {
        plain: 'When a request has a fork in the road (“hide paused members or grey them out?”), an agent won’t stall—it picks one and builds 12 turns on its guess.',
        technical: 'Underspecified requirements force silent assumptions across schema, UI and tests, turning cheap clarifications into expensive rewrites.',
        engineer: 'Every unresolved product or architectural fork left in a prompt compounds rework across every downstream file the agent touches.',
      },
    },
    plan: {
      part: 'Plan mode = cheap course correction.',
      text: {
        plain: 'Reading a 4-line plan before any files change takes ten seconds—catching a wrong guess here saves ten minutes of undoing code.',
        technical: 'Use Plan Mode to inspect proposed file changes, data types and test cases before the agent writes a single line of implementation.',
        engineer: 'Front-load architectural alignment: reviewing a concise plan catches boundary, schema and stack missteps at near-zero token and rework cost.',
      },
    },
    ask: {
      part: 'Non-blocking questions keep momentum.',
      text: {
        plain: 'Tell the agent: “If you hit a product choice, drop a short question and keep building the unblocked parts while you wait for me.”',
        technical: 'Structuring tasks so ambiguous UI decisions queue separately lets the agent finish typed logic and tests without stalling.',
        engineer: 'Decouple uncertain product choices from deterministic plumbing so human latency does not block the critical path.',
      },
    },
    pin: {
      part: 'Point directly at the spot.',
      text: {
        plain: 'Saying “the badge looks off” makes the agent guess which badge. Pinning the exact element or pasting the screenshot+box fixes the right thing in one try.',
        technical: 'Anchor feedback to exact DOM selectors, file:line references or annotated screenshots so edits hit the target symbol immediately.',
        engineer: 'High-precision spatial/symbolic pointers eliminate search ambiguity and collapse multi-turn clarification loops to a single targeted patch.',
      },
    },
    build: {
      part: 'Build custom review loops for yourself.',
      text: {
        plain: 'You can even ask the agent to build a small review page for your app so you can click through screens, leave notes, and have it fix all of them in one batch.',
        technical: 'Invest 5 minutes asking the agent to generate a local preview harness or fixture gallery—it pays back on every iteration afterwards.',
        engineer: 'Meta-tooling (custom visual galleries, golden-file reviewers, structured feedback files) turns repetitive human QA into a high-leverage loop.',
      },
    },
  },
  jobs: {
    one: {
      part: 'One job: you mostly wait.',
      text: {
        plain: 'The agent works for minutes at a time and stops only when it needs you. With one job, those minutes are yours to wait through.',
        technical: 'One thread, one branch: the agent runs its loop and the tests, and you are idle until it asks or finishes.',
        engineer: 'Serial jobs cap throughput at one agent run plus one human review per task; your attention sits unused most of the hour.',
      },
    },
    three: {
      part: 'Own thread, own copy, own branch.',
      text: {
        plain: 'Each job has its own conversation and its own copy of the project, so three can run without touching each other. You go to whichever card needs you.',
        technical: 'One worktree per job (`git worktree add ../club-search -b search`); each branch passes the type check and tests before it merges into main.',
        engineer: 'Worktrees share one object store and history but not the working files: give each its own dependencies, dev server port and test database.',
      },
    },
    many: {
      part: 'You are the queue.',
      text: {
        plain: 'Past three or so jobs, they wait for you more than you wait for them. Proof and one short question make each stop short enough to keep up.',
        technical: 'Agent waiting time is summed over all jobs. Cutting review time per stop (tests run, screenshot attached) does more than adding jobs.',
        engineer: 'Adding workers past your review capacity only grows the queue in front of you; shrink the service time per stop instead.',
      },
    },
    projects: {
      part: 'Same project or different ones.',
      text: {
        plain: 'In one project, two jobs can change the same page and one has to catch up before it lands. Separate projects never collide, but you switch between their rules.',
        technical: 'Shared repo: merges happen in order and a later branch rebases on main and reruns the tests. Separate repos: each needs its own AGENTS.md and test command.',
        engineer: 'One repository gives one history, one CI and one merge order; several give isolation and separate secrets, and nothing checks they still fit together.',
      },
    },
    board: {
      part: 'Name the thread by what it needs.',
      text: {
        plain: 'A card that says “fix” makes you open it to remember what it is. A name, a state and what it needs lets you decide at a glance.',
        technical: 'Name threads after the job and the branch, and keep the state visible: working, question, ready to check.',
        engineer: 'A board with explicit states is the scheduler for your attention: you pick the next stop from it without reloading context.',
      },
    },
  },
  grow: {
    adds: {
      part: 'Each feature reads more.',
      text: {
        plain: 'Before its first change, an agent reads the parts of the project it will touch. The bigger the project, the more of its window that takes.',
        technical: 'Discovery reads (routes, types, existing helpers) come before any edit and grow with the code, especially in files every change goes through.',
        engineer: 'Per-task read cost tracks module coupling more than total size: one tangled file that every change passes through costs every task.',
      },
    },
    junk: {
      part: 'Unused code still gets read.',
      text: {
        plain: 'An old copy of a page or a helper nobody calls looks like real code until it has been read. Agents read it, and sometimes edit the wrong copy.',
        technical: 'Dead exports and duplicate modules cost reads on every task and make it likely that an edit lands in the copy nothing uses.',
        engineer: 'Dead code fills the window with plausible but irrelevant context, the condition under which output quality drops.',
      },
    },
    clean: {
      part: 'A clean-up builds nothing and saves reading.',
      text: {
        plain: 'One job that only removes what nothing uses, with the tests passing before and after. Every feature after it reads less.',
        technical: 'Keep clean-ups in their own commits and pull requests, with the test run before and after, so the diff only deletes.',
        engineer: 'Separate structural changes from behavioural ones; a deletion-only diff with green tests before and after is cheap to review.',
      },
    },
    refactor: {
      part: 'Only tests can say nothing changed.',
      text: {
        plain: 'Splitting a big file makes later features read less, but the app must do exactly what it did. Without tests nobody knows it does not, until someone uses it.',
        technical: 'Run `tsc --noEmit` and `npm test` before the first move and after each one; a test that fails points at the move that broke it.',
        engineer: 'The test suite is the refactor’s specification of behaviour: where it has no test, write one first, or the change is unverified.',
      },
    },
    rhythm: {
      part: 'Every five features, a clean-up first.',
      text: {
        plain: 'A regular clean-up keeps what each feature reads low. With none, feature 20 reads about twice as much as it needs to.',
        technical: 'Put the clean-up in the queue like any job: every fifth, before the next feature, with the same test run before and after.',
        engineer: 'Scheduled clean-ups keep per-task context roughly flat as features pile up, instead of letting it climb with every feature.',
      },
    },
  },
  people: {
    pr: {
      part: 'A pull request waits for a person.',
      text: {
        plain: 'The agent’s change stops in front of main with its proof beside it. Nothing reaches the live app until someone says yes.',
        technical: 'CI runs the type check and the tests on the branch; the pull request shows the diff, the run and the screenshots in one place.',
        engineer: 'The pull request is the unit of review and the place where the automatic check and a human decision are both required before main.',
      },
    },
    peer: {
      part: 'One colleague, many agents.',
      text: {
        plain: 'Agents make changes faster than a person can read them. Small changes with proof are what keep the line moving.',
        technical: 'Keep each pull request to one change with its test and a screenshot; a reviewer can then read it in minutes.',
        engineer: 'Reviewer time is the scarce resource; size and evidence per pull request set your team’s throughput, not the number of agents.',
      },
    },
    client: {
      part: 'Clients judge a running thing.',
      text: {
        plain: 'A client can click through a link and say what they want changed. They cannot judge a diff. What they say is your next brief.',
        technical: 'A preview link per pull request lets someone try the change before it merges.',
        engineer: 'Preview links turn vague requests into concrete ones early, while the change is still cheap to redo.',
      },
    },
    users: {
      part: 'Every bug report becomes a test.',
      text: {
        plain: 'When a user finds a bug, ask for a test that fails because of it, then the fix. The same mistake cannot come back unnoticed.',
        technical: 'A regression test written from the report fails first, then passes with the fix, and runs in CI on every later pull request.',
        engineer: 'Coverage that grows from real incidents encodes the cases nobody thought to specify.',
      },
    },
    loop: {
      part: 'Most briefs now come from people.',
      text: {
        plain: 'After launch, colleagues, clients and users give you the next job. You pass it on and read what comes back.',
        technical: 'Feedback becomes a scoped brief, a branch, a pull request with proof, a review and a merge, in that order every time.',
        engineer: 'The loop is report, test, scoped agent job, CI and review, preview, merge; each stage has an owner and a record.',
      },
    },
  },
  where: {
    laptop: {
      part: 'Start on your laptop.',
      text: {
        plain: 'Your files, your logins, your screen. It is the easiest place to start and to watch what the agent does.',
        technical: 'The agent runs the type check, the tests and the dev server locally, so you see results at once.',
        engineer: 'Everything is co-located: repository, threads, credentials and `.env`. Simple, and tied to one machine’s power state.',
      },
    },
    lid: {
      part: 'Asleep means stopped.',
      text: {
        plain: 'A sleeping laptop stops its agents where they were. They carry on when you open it.',
        technical: 'Local agent processes sleep with the machine; long test runs and long jobs stall with them.',
        engineer: 'Work that must continue unattended cannot depend on a workstation’s sleep cycle.',
      },
    },
    box: {
      part: 'A computer that never sleeps.',
      text: {
        plain: 'Run the agent on a desktop or small server at home and check it from your phone. Choose the permission mode before you leave it alone.',
        technical: 'T3 Code runs on that computer; the laptop and phone connect to it over Tailscale, SSH or T3 Connect.',
        engineer: 'State lives on the always-on computer: repository, threads, logins and secrets. The phone is a remote; it does no work itself.',
      },
    },
    cloud: {
      part: 'The cloud starts empty.',
      text: {
        plain: 'A cloud machine has only the repository and what you set up. If the tests need a database, the setup has to make one.',
        technical: 'A setup script installs dependencies and starts the test database so `npm test` runs there as on your laptop.',
        engineer: 'Nothing persists between tasks: the repository, the setup script and stored secrets are the whole environment. Check what it costs on your plan.',
      },
    },
    mix: {
      part: 'Pick the machine by the job.',
      text: {
        plain: 'Live work on the laptop, long runs on the always-on computer, separate tasks in the cloud. They all land on one main.',
        technical: 'Every machine pushes a branch; the same check and the same pull request process decide what reaches main.',
        engineer: 'Keep the environments alike (one setup script, one test command), so any job can run on any machine and the check means the same everywhere.',
      },
    },
  },
};
