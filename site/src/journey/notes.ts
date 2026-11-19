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
      part: 'The model.',
      text: {
        plain: 'The model writes text. It has no notebook of its own: what it knows about you and your project is whatever sits in the glass column.',
        technical: 'Each request to the model is stateless. The app sends the conversation; the model reads it and writes the next reply. Nothing is stored on the model’s side between calls.',
        engineer: 'Inference is a function of the token sequence you send. Any state, chat history included, exists only because the harness puts it back into the request.',
      },
    },
    send: {
      part: 'Both sides land in the window.',
      text: {
        plain: 'Dark slabs are what you wrote, pale ones what it wrote. The column only grows while the chat goes on.',
        technical: 'Your message and the reply are appended to the message list. The next request carries both.',
        engineer: 'The prompt grows monotonically with the conversation, and so do latency and cost per turn.',
      },
    },
    reread: {
      part: 'Read again, every turn.',
      text: {
        plain: 'It “remembers” your name only because your first message is still in the column and gets read again.',
        technical: 'Every turn the whole message list is sent again. Drop the first message and the name is gone.',
        engineer: 'Continuity is full-history replay. Prompt caching makes the replay cheaper; it does not make the model attend to it any better.',
      },
    },
    fresh: {
      part: 'A new chat starts empty.',
      text: {
        plain: 'Handy when a chat has gone off track. Anything worth keeping has to be written down somewhere the next chat will read.',
        technical: 'A new thread sends an empty history. Durable facts belong in a file the tool loads, which is lesson 8.',
        engineer: 'A reset is free and total. Persist invariants on disk, versioned with the code, rather than in chat history.',
      },
    },
  },
  loop: {
    hands: {
      part: 'Tools.',
      text: {
        plain: 'Four cubes: search, read, edit, run. With them the model works on your real files instead of handing you code to paste.',
        technical: 'The harness (Claude Code, Codex) runs the tool call the model asks for: a grep, a file read, a patch, a shell command, and puts the output back in the window.',
        engineer: 'The harness maps text to side effects. Which tools exist decides what the agent can observe, and so what it can verify.',
      },
    },
    fix: {
      part: 'One request, many turns.',
      text: {
        plain: 'The red slab is a failing check. The agent read it and fixed its own mistake before telling you anything.',
        technical: 'Here the run tool is `npm test`: 1 of 12 fails, the agent patches members.ts and runs it again until 12 of 12 pass.',
        engineer: 'Fast local oracles (type checker, unit tests) turn generation into iteration: each failure is an observation the next turn can act on.',
      },
    },
    again: {
      part: 'The loop.',
      text: {
        plain: 'You wrote one message. The other turns were the agent reading results and deciding what to do next.',
        technical: 'Each tool result goes back into the window and triggers another model call, until the model answers without a tool call.',
        engineer: 'Work per human turn scales with how clear the request is and how fast the feedback is, not with how often you step in.',
      },
    },
    norun: {
      part: 'No run, no proof.',
      text: {
        plain: 'The run cube is greyed out. It edits, cannot try the result, and still says “fixed”. Watch the last line of the readout.',
        technical: 'Without shell access there is no `tsc` and no `npm test`; the swapped day and month go out unseen.',
        engineer: 'An agent without execution feedback is a code generator with confidence. Give it a safe way to run builds and tests.',
      },
    },
    ask: {
      part: 'Who approves what.',
      text: {
        plain: 'Each blue question stops the loop until you answer. Let it read and run tests alone; keep the questions for deleting or publishing.',
        technical: 'Allow reads and local `tsc`/test runs; ask before edits outside the project, `git push` and network calls.',
        engineer: 'Least privilege: run the loop in a worktree or sandbox so it rarely needs you, and keep consent for irreversible actions.',
      },
    },
  },
  window: {
    pile: {
      part: 'Nothing leaves.',
      text: {
        plain: 'Every message, every file it read and every test output is still in the column, and all of it is read again before each turn.',
        technical: 'Tool output is appended, not replaced. A 40k-token file read stays in the prompt for the rest of the thread.',
        engineer: 'The prompt is an append-only log; cost per turn and attention load both grow with it until something truncates or compacts it.',
      },
    },
    rot: {
      part: 'Context rot.',
      text: {
        plain: 'A bigger window holds more; it does not think better. The more unrelated text sits beside your request, the more likely it edits the wrong thing or forgets what you said first.',
        technical: 'Same request, same model, only the window changed. The tests would not catch the lost rule: nothing asserts the date format.',
        engineer: 'Anthropic reports recall falling as the token count grows. Keep one task per thread, read only what the task needs, and push searches into a helper (lesson 10).',
      },
    },
    long: {
      part: 'Past the limit.',
      text: {
        plain: 'The window has a hard size. A smaller one (Codex runs some models at 272k) fills sooner with the same work.',
        technical: 'Over the limit the request cannot be sent. Harnesses compact before that point; plain API calls fail.',
        engineer: 'The limit is a wall; quality falls long before it. Budget the window like memory, not like disk.',
      },
    },
    compact: {
      part: 'What survives.',
      text: {
        plain: 'Compaction keeps the gist. A rule you said once in chat may not make it into the gist; a new thread keeps exactly what you put in the brief.',
        technical: 'Claude Code’s compaction keeps a summary, reloads CLAUDE.md/AGENTS.md from disk and re-reads up to five recent files. Everything else in the conversation is gone.',
        engineer: 'Compaction is lossy and repeated compaction drifts. Prefer task boundaries: commit, write a short brief, start a new thread.',
      },
    },
    paste: {
      part: 'What you paste stays.',
      text: {
        plain: 'Paste the error, not the whole log. The big slab is read again on every turn after it.',
        technical: 'Pipe it: `npm test 2>&1 | tail -40` gives the failure and the summary line, not 200k tokens of passing tests.',
        engineer: 'Bound tool output (filters, line ranges, quiet flags) so noise never takes permanent residence in the prompt.',
      },
    },
  },
  memory: {
    gone: {
      part: 'A new session.',
      text: {
        plain: 'The new thread from lesson 7 is clean, and also forgets the format and the style it worked out yesterday.',
        technical: 'A new session knows nothing about pnpm, the test command or the folder layout until it finds them again, turn by turn.',
        engineer: 'A fresh context removes rot only if the invariants it needs are loaded deterministically at the start.',
      },
    },
    file: {
      part: 'AGENTS.md.',
      text: {
        plain: 'The green tile is a text file in your project. The tool loads it before your first word, every session.',
        technical: 'Put the package manager, the check command (`pnpm tsc --noEmit && pnpm test`) and the folder map in it. Claude Code reads CLAUDE.md, Codex reads AGENTS.md.',
        engineer: 'Record stack decisions, module boundaries and the verify command. It is versioned with the code and reviewed like code.',
      },
    },
    grow: {
      part: 'Short beats long.',
      text: {
        plain: 'Add a line when a mistake repeats, and delete lines that stopped mattering. Every line is read every session.',
        technical: 'Anthropic advises keeping CLAUDE.md under 200 lines: longer files take more of the window and are followed less.',
        engineer: 'Keep always-true invariants here; move procedures that only some tasks need into skills.',
      },
    },
    skills: {
      part: 'Skills.',
      text: {
        plain: 'Each skill is a checklist on the shelf. Only its name and one line sit in the window until a job needs it.',
        technical: 'Skill descriptions load at start; the full SKILL.md loads only when the task matches.',
        engineer: 'Progressive disclosure: conditional procedures cost a line of context until used.',
      },
    },
  },
  check: {
    done: {
      part: '“Done” is a word.',
      text: {
        plain: 'Orange pucks are broken work. They arrive looking exactly like the good ones.',
        technical: 'The agent ends every job with “Done.” A green exit code is evidence; the word is not.',
        engineer: 'Without an oracle, defects surface at the most expensive point: you, or your users.',
      },
    },
    tests: {
      part: 'The check.',
      text: {
        plain: 'Here the check is the agent running the app and clicking through it before saying done. Broken work goes back to it, not to you.',
        technical: 'Here the check is `tsc --noEmit && npm test`, run by the agent before it reports. A failure goes back into its loop.',
        engineer: 'Make the check a single command the agent must run green: types and unit tests first, because they are fast and deterministic.',
      },
    },
    more: {
      part: 'One check, one kind of wrong.',
      text: {
        plain: 'Running the app catches crashes and wrong values; looking on a phone catches layout. Switch one off and its kind gets through.',
        technical: 'tsc catches the renamed field, the unit tests catch the date, the browser check catches the overflow. None of them catches the others’ bugs.',
        engineer: 'Orthogonal oracles: types (contracts), unit tests (logic), browser (rendering). Put the fast ones in pre-commit, all of them in CI before merge.',
      },
    },
    spec: {
      part: 'What no check sees.',
      text: {
        plain: 'A check only looks for what someone told it to. Tell the agent what must never happen, and it can write a check for it.',
        technical: 'Turn the rule into a test: export the CSV with a hidden rating and assert it is absent. Now the gate knows.',
        engineer: 'A check proves what it asserts and nothing more. Spec gaps need a test written from the requirement, or a reviewer (lesson 15).',
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
