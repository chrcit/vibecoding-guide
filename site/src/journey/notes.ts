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
  // ---------- part one ----------
  ai: {
    predict: {
      part: 'The window.',
      text: {
        plain: 'Everything it uses is in there: what you typed, what you pasted, its own replies. Leave something out and it fills the gap with what sounds likely.',
        technical: 'The app sends the whole window with every message and the model keeps nothing between calls. A wrong answer usually means something was missing from the window.',
        engineer: 'Output depends only on the tokens sent. Instruction files, retrieved documents and tool results are all the harness putting more text into this one window.',
      },
    },
    inputs: {
      part: 'All of it becomes window.',
      text: {
        plain: 'Talking is the quickest way to give it a lot of detail. It can misread a photo or a voice note, so a good answer asks when it is unsure (try the photo).',
        technical: 'Speech is transcribed to text; images and recordings are turned into tokens too and take room in the window. A long recording fills it faster than a page of text.',
        engineer: 'Same window, same price per token, same chance of misreading. Ask it to list what it could not read rather than trusting a clean-looking result.',
      },
    },
    modes: {
      part: 'What changes is its reach.',
      text: {
        plain: 'In chat you carry everything. At work it can open files you connect and write new ones. As a coding agent it works in your project folder and tries what it built.',
        technical: 'Chat has no tools. Work adds search and connectors. A coding agent adds read, edit and run on a folder, so it can run npm test and read the result.',
        engineer: 'Same model each time. claude.ai with connectors, Claude Code or Codex each decide the tool set, the permissions and how the window is assembled.',
      },
    },
    code: {
      part: 'Something to check against.',
      text: {
        plain: 'This is why the rest of the guide is about coding agents: their work can be tried before you see it. A letter, a summary or a plan still needs you to read it.',
        technical: 'A failing test is output the agent cannot argue with: it lands in the window and the agent fixes the code. Check, lesson 9, builds that check.',
        engineer: 'Executable feedback gives the loop ground truth. The limit is coverage: the check only catches what a test or a look covers.',
      },
    },
  },
  providers: {
    labs: {
      part: 'Different makers, same idea.',
      text: {
        plain: 'Every model here does what AI model, lesson 1, showed: it reads its window and writes. You do not need to pick the right company to start; any one plan will do.',
        technical: 'Each maker has a large model and smaller, cheaper ones. The window, the tools and the loop work the same way on all of them.',
        engineer: 'Stay portable: keep instructions in AGENTS.md and checks in npm scripts, so swapping the model is a setting. A second maker’s model is also a cheap reviewer later.',
      },
    },
    reach: {
      part: 'A plan or a bill.',
      text: {
        plain: 'A plan is a monthly price with a usage limit that refills. The API charges for every token instead. To start, a plan is simpler.',
        technical: 'Claude Code and Codex sign in with your plan; an API key bills per token instead. T3 Code is a front end over those tools and uses the logins you already have.',
        engineer: 'Plan: flat cost, opaque limits. API: exact metering, scales with use, needed for your own scripts and CI. Cost, lesson 14, does the sums.',
      },
    },
    where: {
      part: 'Thinking far away, files at home.',
      text: {
        plain: 'An ordinary laptop is enough: the heavy work happens on the provider’s computers. Only what the agent reads is sent, so keep passwords and private data out of the folder.',
        technical: 'Read, edit and run are executed locally by the coding tool; the model only receives their output. A .env file it opens is sent like any other file.',
        engineer: 'Inference is remote, execution local. The trust boundary is what tool output enters the window: secrets, customer data and logs all count as sent.',
      },
    },
    devices: {
      part: 'The work lives where the files live.',
      text: {
        plain: 'A laptop is fine to start. A desktop PC that stays on keeps working while you sleep. A phone shows the work and lets you say yes or no; it does not do the work.',
        technical: 'The agent runs as a process on the machine with the files. Closing the lid suspends it. A phone client is a remote view of that process.',
        engineer: 'Put long jobs on a machine that stays on, reach it from laptop or phone. Machines, lesson 21, adds cloud machines that start empty.',
      },
    },
  },
  stack: {
    commit: {
      part: 'Undo for the whole folder.',
      text: {
        plain: 'Ask the agent to save a version each time something works. Then “go back” is one sentence instead of a guess.',
        technical: 'Commit before you hand over a change; git diff shows exactly what the agent did and git restore . throws it away.',
        engineer: 'Small commits make each agent change reviewable and revertable on its own. Note that restore leaves new untracked files: git status shows them.',
      },
    },
    github: {
      part: 'A copy that is not on your desk.',
      text: {
        plain: 'You can start without GitHub; add it once the project matters to you. After that, push often: what was never pushed lives on one laptop.',
        technical: 'origin is the copy on GitHub. Push after each commit you care about; clone gives a new machine the whole history.',
        engineer: 'GitHub is also where checks run, cloud agents start from and other people review. Treat the default branch there as the source of truth.',
      },
    },
    branch: {
      part: 'Changes wait at the pull request.',
      text: {
        plain: 'Main stays working while the agent tries something on a branch. The pull request is the moment the check runs and you say yes.',
        technical: 'Protect main, open a pull request per change, let CI run npm test on it. The pull request page shows the diff and the check result together.',
        engineer: 'One task, one branch, one pull request keeps changes atomic. Branch protection with required checks is cheap; it is what lets you run many agents later.',
      },
    },
    hosting: {
      part: 'Does anything need to be remembered?',
      text: {
        plain: 'If people only read the page, static hosting is enough and often free. If people save things others must see, like who has paid, you need a server and a database.',
        technical: 'Static: the build output on a CDN, no runtime. Dynamic: a running process with a database and secrets in environment variables.',
        engineer: 'Choose by state and trust: who writes, who may read, where it is checked. Every moving part is something an agent has to deploy, test and keep patched.',
      },
    },
    specs: {
      part: 'Buy the size you measure.',
      text: {
        plain: 'A club list needs the smallest server there is. Start small; move up when pages get slow, not before.',
        technical: 'Look at the busiest moment, not the daily total. Memory runs out before cores on small apps; a database usually needs its own disk.',
        engineer: 'Measure peak requests and p95 latency before resizing. Stateless servers let you add copies; the database is what is hard to scale.',
      },
    },
  },
  first: {
    device: {
      part: 'One app, one plan, one folder.',
      text: {
        plain: 'That is the whole set-up on a laptop or desktop. On a phone you can start in a browser builder, but the files then live on their site.',
        technical: 'Install a coding tool, sign in with your plan, create an empty folder and run git init in it, or ask the agent to.',
        engineer: 'Decide early where it will run and who else will touch it; that decides the stack more than the first feature does.',
      },
    },
    job: {
      part: 'Small, real, yours.',
      text: {
        plain: 'A job you care about tells you at a glance whether it works. Asking it to ask first stops it from guessing the parts you did not say.',
        technical: 'The prompt asks for tests and a type check, so the first version arrives with npm test and tsc --noEmit already passing.',
        engineer: 'The stack decision comes back as three lines for you to approve, before any code: framework, where data lives, how it is tested.',
      },
    },
    loop: {
      part: 'Your two beats.',
      text: {
        plain: 'You do two of the four beats: you ask and you look. The looking is the part nobody else can do for you.',
        technical: 'Look at the running page, then read the test output it shows you. If it shows none, ask for it before the next change.',
        engineer: 'Each turn is one diff you can review. Keep turns small enough that a failing check points at one change.',
      },
    },
    change: {
      part: 'What comes back.',
      text: {
        plain: 'A few precise changes come back as a few things to check. A vague wish comes back as a different app.',
        technical: 'A vague request turns into a wide diff that the tests may pass and you still did not want. Precise asks keep the diff small.',
        engineer: 'Scope is your control on blast radius. Vague prompts produce wide, unreviewable diffs even when every check is green.',
      },
    },
  },
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
        plain: 'The orange slab is a failing check. The agent read it and fixed its own mistake before telling you anything.',
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
      part: 'A new thread.',
      text: {
        plain: 'The new thread from lesson 7 is clean, and also forgets the format and the style it worked out yesterday.',
        technical: 'A new thread knows nothing about the test runner, the check command or the folder layout until it finds them again, turn by turn.',
        engineer: 'A fresh context removes rot only if the invariants it needs are loaded deterministically at the start.',
      },
    },
    file: {
      part: 'AGENTS.md.',
      text: {
        plain: 'The green tile is a text file in your project. The tool loads it before your first word, in every thread.',
        technical: 'Put the package manager, the check command (`npm run check`: `tsc --noEmit && vitest run`) and the folder map in it. Claude Code reads CLAUDE.md, Codex reads AGENTS.md.',
        engineer: 'Record stack decisions, module boundaries and the verify command. It is versioned with the code and reviewed like code.',
      },
    },
    grow: {
      part: 'Short beats long.',
      text: {
        plain: 'Add a line when a mistake repeats, and delete lines that stopped mattering. Every line is read at the start of every thread.',
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
        technical: 'Turn the rule into a test: export the CSV with a hidden rating and assert it is absent. Now the check knows.',
        engineer: 'A check proves what it asserts and nothing more. Spec gaps need a test written from the requirement, or a reviewer (lesson 15).',
      },
    },
  },
  handoff: {
    alone: {
      part: 'A search is mostly noise.',
      text: {
        plain: 'Seven whole files went into the window for a three-line answer, and they stay for the rest of the job.',
        technical: 'A grep and seven file reads, all appended to the main thread before the first edit of the real task.',
        engineer: 'Discovery and implementation share one context here: the search output dilutes everything after it and is paid for on every later turn.',
      },
    },
    hand: {
      part: 'A helper.',
      text: {
        plain: 'The second column is a helper: an agent with its own empty window. Its window filled instead of the agent’s, then was thrown away.',
        technical: 'Claude Code calls a helper a subagent: a fresh window, a summary back. Only the three lines cost the main thread anything.',
        engineer: 'A context firewall: high-volume reads stay in a disposable window; only the structured result crosses the boundary.',
      },
    },
    brief: {
      part: 'Only the brief crosses.',
      text: {
        plain: '“Do not change anything” was said to the agent, not written in the brief, so the helper changed three files. Orange tiles are those changes.',
        technical: 'The helper sees no conversation. Scope, read-only, where to look and what to return all go in the brief.',
        engineer: 'State inputs, allowed side effects and the answer’s shape. Anything left implicit is a guess on the other side.',
      },
    },
  },
  parallel: {
    three: {
      part: 'One folder, three writers.',
      text: {
        plain: 'Orange tiles are edits that landed on top of another helper’s. Each helper thinks it finished; one of them did not.',
        technical: 'Three agents on one working tree: overwritten saves, test runs that see each other’s half-done edits.',
        engineer: 'Shared mutable state with no isolation. Never run write-capable agents in parallel on one checkout.',
      },
    },
    copies: {
      part: 'A copy each.',
      text: {
        plain: 'The small plate beside each helper is its own copy of the project. Nothing it does touches main until it is merged.',
        technical: 'One worktree and branch per task: its own files, its own `npm test`, a clean merge into main.',
        engineer: 'Worktrees share one object store and isolate the working tree; integration is serialised at the merge.',
      },
    },
    more: {
      part: 'More helpers, fuller window.',
      text: {
        plain: 'More helpers finish sooner, but each sends a report to the same agent. Its window is the next thing to run out.',
        technical: 'Five branches merge one at a time, and five reports land in one thread. The agent becomes the bottleneck.',
        engineer: 'Parallelism moves the limit to integration: merge order, conflicts and the coordinator’s context.',
      },
    },
  },
  lead: {
    roles: {
      part: 'The lead.',
      text: {
        plain: 'The front column is the agent you talk to. It no longer edits files: it writes briefs and merges. The five behind it are the helpers.',
        technical: 'The lead splits the request into tasks, starts a helper per worktree, and merges branches into main.',
        engineer: 'Separate coordination from execution: the lead holds decisions and integration; helpers hold the code reads.',
      },
    },
    reports: {
      part: 'Its window is for reports.',
      text: {
        plain: 'With “Everything”, the lead’s window fills with other agents’ work and gets compacted, losing what it was keeping track of.',
        technical: 'Ask helpers for changed files, test result, open questions. Diffs and logs stay on the branch for whoever needs them.',
        engineer: 'Compress at every boundary. A coordinator that ingests raw child output degrades like any overfull context.',
      },
    },
    shapes: {
      part: 'Shapes of a team.',
      text: {
        plain: 'Build then review for a tricky change, plan first for a big one, two builds when you are unsure which approach is right.',
        technical: 'Pair (helper and reviewer), pipeline (plan, build, review), best of two. The reviewer runs a different model.',
        engineer: 'Topologies trade tokens for variance: a pipeline fixes design up front, a pair catches blind spots, best-of-N hedges a hard choice.',
      },
    },
    gate: {
      part: 'The check in front of main.',
      text: {
        plain: 'Main only gets work that passed. Without the check, red marks land on main and stay there.',
        technical: 'The lead runs the check on each branch before merging. Broken branches go back to their helper with the output.',
        engineer: 'Main stays green as an invariant however many helpers run; re-run the check after each merge.',
      },
    },
  },
  fleet: {
    twenty: {
      part: 'The fleet.',
      text: {
        plain: 'The lead, the check and twenty helpers, each with its own copy. The readout counts the forty tasks onto main.',
        technical: 'Each helper starts every task with an empty window and a brief; nothing carries over between tasks except what is on main.',
        engineer: 'Small, independent tasks with a check each are what make twenty helpers useful; big coupled tasks just queue at the merge.',
      },
    },
    nogate: {
      part: 'No check, at speed.',
      text: {
        plain: 'Twenty helpers without a check land broken work twenty times faster. The red marks on main are yours to untangle.',
        technical: 'Without the check, about one task in four (made up here) merges broken; later tasks build on top of it.',
        engineer: 'Never raise concurrency faster than check coverage: defects scale with the number of helpers.',
      },
    },
    yours: {
      part: 'Your part.',
      text: {
        plain: 'What to build, and whether what got through is what you wanted. The check cannot tell you that.',
        technical: 'Write the task list and the checks; read what passes. Helper turns are the cost driver, counted in the readout.',
        engineer: 'Your time goes on framing, boundaries and the checks. Cost scales with windows times turns: lesson 14 prices it.',
      },
    },
  },
  meter: {
    count: {
      part: 'A long thread costs more with every message.',
      text: {
        plain: 'Start a new thread for a new job: the old one is read again on every turn.',
        technical: 'Keep tool output short: a test reporter that prints only failures, files read in parts.',
        engineer: 'Capping the turns a job may take and starting fresh threads are the biggest levers on input.',
      },
    },
    api: {
      part: 'Reading is most of the bill.',
      text: {
        plain: 'A shorter window saves more than a shorter reply.',
        technical: 'Bill = input × input price + output × output price. On an agent loop input is nearly all of it.',
        engineer: 'Compare models per job, not per token: a cheaper model that takes more turns can cost more.',
      },
    },
    cache: {
      part: 'Keep the start of the window the same.',
      text: {
        plain: 'Pick the model and the effort before a job and keep them until it is done; switch between jobs.',
        technical: 'A hit needs the same start: tools, system prompt, earlier messages. Anything new goes at the end.',
        engineer: 'Treat the start of the window as an interface: instruction file, tool set and effort fixed within a thread.',
      },
    },
    plan: {
      part: 'Learn what your own jobs take.',
      text: {
        plain: 'Claude shows how much of the current allowance you have used under Settings > Usage.',
        technical: 'In Claude Code, /usage shows the bars and what used them; the allowance resets five hours after your first message, and weekly.',
        engineer: 'Measure tokens per job on your own work before you plan capacity on a plan; with usage credits on, work goes on at API rates.',
      },
    },
    many: {
      part: 'Start as many agents as you can review.',
      text: {
        plain: 'Each agent you start draws from the same allowance or the same bill.',
        technical: 'Every helper sends its own requests on the same plan or key; /usage breaks them down.',
        engineer: 'An hour costs agents × jobs per hour × cost per job; the cache hit rate and turns per job are the parts you control.',
      },
    },
  },
  review: {
    self: {
      part: '“I checked it” from the author is not a review.',
      text: {
        plain: 'Do not take the agent\'s own check as the last word on its work.',
        technical: 'The tests it wrote encode its own reading of the task, so they pass, and the check stays green.',
        engineer: 'Same context, same model: its misses go with the build, so self-review adds little that is independent.',
      },
    },
    second: {
      part: 'Do it yourself in two threads.',
      text: {
        plain: 'Open a new thread on the other model and paste in what you asked and the change.',
        technical: 'Paste the task and the output of git diff main into a new thread on the other model, and nothing else.',
        engineer: 'A clean window and a different model each cut how often reviewer and author miss the same case.',
      },
    },
    attack: {
      part: 'Each finding needs a way to see it fail.',
      text: {
        plain: 'If a finding does not say how to see it, ask for that before anything is fixed.',
        technical: 'Turn each “to see it” into a test that fails before the fix, so the check catches it next time.',
        engineer: 'Counterexamples are cheap to sort and become regression tests; opinions are neither.',
      },
    },
    rounds: {
      part: 'Put the stop rule in the first message.',
      text: {
        plain: 'Write it into the request: only what breaks, three rounds at most.',
        technical: 'Past the real flaws, each round spends both models\' tokens on taste.',
        engineer: 'Bound the loop by severity and by count: spend keeps rising while what a round finds falls to nothing.',
      },
    },
    how: {
      part: 'Start by hand.',
      text: {
        plain: 'By hand is the easiest to watch and to stop; automate it once you trust the loop.',
        technical: 'Keep the round count and the stop rule in the instructions, not in your head.',
        engineer: 'Log what each round found, so a loop you did not watch can still be checked afterwards.',
      },
    },
  },
  proof: {
    word: {
      part: 'Ask what came with the “done”.',
      text: {
        plain: 'On work you cannot see, a bare “done” is a claim to check.',
        technical: 'Green tsc and tests show the code agrees with itself, not with your request.',
        engineer: 'CI proves internal consistency; intent stays unverified until something readable says what was built.',
      },
    },
    cards: {
      part: 'Ask for the cards with the job.',
      text: {
        plain: 'Put the four cards in the same message as the job, so they come back with it.',
        technical: 'The test run card carries the exact command and its output, not just “tests pass”.',
        engineer: 'Make the same four cards the template of every pull request description.',
      },
    },
    catch: {
      part: 'Look at the cards even when the check is green.',
      text: {
        plain: 'The check is green for work that is wrong in ways only you can see.',
        technical: 'A test named for the wrong behaviour still passes: read the test names on the card.',
        engineer: 'Gates check code against itself, cards check it against intent; they fail differently, so keep both.',
      },
    },
    during: {
      part: 'On a long job, ask for a progress file.',
      text: {
        plain: 'Anything that takes more than a few minutes is worth a progress file.',
        technical: 'Ask for a PROGRESS.md updated after each step, with the step and its state.',
        engineer: 'Drift shows at the step it happens, and you see it without interrupting the agent.',
      },
    },
    ask: {
      part: 'Reuse one proof prompt.',
      text: {
        plain: 'Copy the prompt below once and add it to every job.',
        technical: 'For a fix: write the test, run it red, change the code, run it green; both outputs on the card.',
        engineer: 'Match proof to risk: regression tests for defects, fixtures for transforms, a preview for UI.',
      },
    },
  },
  turn: {
    once: {
      part: 'Say which meaning you mean.',
      text: {
        plain: 'Before you send a request, look for words that could mean two things and pick one.',
        technical: 'An ambiguous request becomes a silent choice in the data, the screen and the tests at once.',
        engineer: 'Each turn builds on the guess, so a wrong guess costs more the longer the job runs.',
      },
    },
    plan: {
      part: 'Correct the plan, not the code.',
      text: {
        plain: 'Changing step 3 now costs one reply; after the build it costs every turn built on it.',
        technical: 'Ask the plan to name files, types and tests, so the guess shows before any of them exist.',
        engineer: 'Plan review is design review: data model, permissions and test strategy are settled before the loop runs on its own.',
      },
    },
    ask: {
      part: 'One line in the request makes this happen.',
      text: {
        plain: 'Add: if you hit a choice, ask me in one line and carry on with the rest.',
        technical: 'Only the part that depends on the answer waits; the rest is built and tested meanwhile.',
        engineer: 'Taking the open decision off the critical path means your reply time does not hold up the job.',
      },
    },
    pin: {
      part: 'Point, do not describe.',
      text: {
        plain: 'When something looks wrong, mark it on the screenshot instead of describing it.',
        technical: 'A pin hands over the element under it, so the agent edits that element instead of searching for one.',
        engineer: 'Feedback tied to an element or a file and line removes the search and the wrong-target fix.',
      },
    },
    build: {
      part: 'Build the review page once.',
      text: {
        plain: 'It costs one job and makes every later round of notes quicker.',
        technical: 'Keep it dev only: the notes file lives in the repo and is never shipped.',
        engineer: 'In a team the pull request is where the same notes land; this page is your own loop before it.',
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
