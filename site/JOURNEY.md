# The journey

The spine of the site. One drawn scene that grows through seventeen steps in two parts. Part one
(1 to 9, the home page) grows the agents, from a single chat to twenty in a loop. Part two (10 to
17, `/journey/week/`) grows the work around them: what it costs, who checks it, where you come in,
and where it runs. Each step has its own page at `/journey/<id>/`.

The owner's brief, in their words: "interactive scrolling explainers which keep some key visual
main", where "the visuals should also interlock and build an entire whole so you build up from the
first chat ... to high level stuff like orchestrating 10-20 agents at once in a loop and managing
context, outputs and verification."

## The idea

Six nouns, drawn once, never redrawn:

| Noun | Drawn as | Enters at |
| --- | --- | --- |
| you | a pawn | 1 |
| the model | the cap on a glass column; lit while it is working | 1 |
| the window | the glass column; everything the model can see is a slab in it | 1 |
| tools | four cubes on a bench | 2 |
| the project | a plate of file tiles; AGENTS.md is the green one, skills stand on a shelf | 2 |
| a check | a gate with a lamp | 5 |

An agent is a model, a window and tools in a loop. From step 6 the same unit is drawn smaller and
repeated; nothing new is invented for teams.

Each step adds one thing to the picture or multiplies one that is there:

1. **One chat.** A model and a window. A new chat is an empty window.
2. **It gets hands.** Tools and a project. One message from you, many turns of its own.
3. **The window fills.** Same picture, closer. The pile, the limit, compaction, a new thread.
4. **Write it down.** A file loaded at the start of every session. Skills stay on the shelf.
5. **Make it prove it.** A gate between the agent and "done".
6. **A second agent.** A helper with an empty window; a brief goes in, a report comes back.
7. **Side by side.** Several helpers, each with its own copy of the project, merged into main.
8. **A lead.** The agent you talk to stops building. A gate in front of main. Short reports.
9. **Twenty in a loop.** A queue, a fleet and a gate. You read what gets through the gate.

A slab and a puck share colours: what travels across the floor is what lands in a window. Dark is
you, pale is the model, blue is a tool result, green is instructions, hatched grey is a summary,
the accent is something that went wrong.

One meaning per colour, in the picture, the readout and the legend (`journey.css`, top comment):

| Colour | Means | Never |
| --- | --- | --- |
| accent (orange-red) | something went wrong: a failed check, a wrong file, a bad commit | "working", "new", "look here" |
| amber (`--j-work`) | busy right now: a model thinking, a tool in use, a file being edited, a job's lamp while it runs | a problem |
| blue | waits for you (a lamp, a card); a tool's result (a slab) | |
| green | passed (a lamp, a commit); instructions (a slab) | |

A label with a dotted underline opens something: its wiki page in the side view, with the term's
definition on hover or focus. A label without one is a name and nothing more. Give a label a link
only through `termLabel()` (below), so the word, the definition and the page agree.

## Rules for a chapter

- The picture carries the idea. A step is a heading, at most two short sentences and at most one
  control. If a step needs a paragraph, the picture is missing something: fix the picture.
- A step may also hold one `<More title="The prices">`: closed until opened, about sixty words, or
  one prompt to copy, or one small table. That is where the sourced numbers, the command and "how a
  named tool does it" go back in. The step reads complete without it.
- Name real things. A station is labelled "Opus 5.5" or "GPT-6.2 Sol" when the step is about those
  two, with the names read from `src/data/models.ts`, and the line under the picture is spoken by
  that name. The guide still does not say one is better than the other.
- Levels decide the output. plain sees what got done and what to do next; technical also sees the
  type check, the tests, the commands and the files; engineer also sees architecture, invariants,
  failure modes and cost. Three places carry it: the step text (`<Step level>` for a whole step,
  `<ForLevel is inline>` inside one), the script (`ctx.level`, `byLevel(ctx.level, {...})` for
  the line under the picture, the readout and the note), and the picture (a label that names a
  term picks its word per level: the check reads "check", "typecheck · tests", "tsc --noEmit ·
  npm test"). Changing the level re-runs the step on show; nothing has to listen for it.
- Every chapter lets the reader break the thing it teaches: take a tool away, drop the gate, send a
  thin brief, share one folder. Show what happens; do not warn about it.
- A part keeps its place and its meaning in every chapter. New parts go into `picture.ts` with a
  place on the floor plan, never into one chapter.
- What is said under the picture is what the people and programs in it said. Numbers under it are
  counted from what just happened.
- One of a step's two sentences says what the reader is looking at, using the label on the part.
  Ten test readers found the steps short enough and the pictures one sentence short.
- The first step of a chapter says where its parts were met before, with a link by the lesson's
  name: `the check from <LessonRef id="check" />` reads "the check from Check, lesson 9"
  (`components/journey/LessonRef.astro`; `lessonName(id)` in a script). Never "step 3" or
  "chapter 7": numbers move, and a reader landing cold does not know them. Readers took each
  chapter for a separate page until it did. The last step hands over to the next lesson (`<Next>`).
- One readout per chapter: the same names in the same order on every step, a count shown towards
  its total ("4 of 6"), a window as "22% full". Every run hands out a fixed number of tasks, ends,
  and closes with one sentence that says what came of it.
- A control answers in the same tick: it changes the line under the picture before the script
  plays. Switches that are each on or off go in `<div class="pick" data-multi>`; a plain `.pick` is
  one of several.
- The part in front of you or of main is called the check in text, as on its label.
- Each chapter gives one thing to do, in a `<More>`: a prompt to copy, the commands, or what a
  named tool does, from a verified fact.
- Made-up jobs are fine and are called made-up. Token counts, window sizes, prices and limits come
  from `src/data` through the page (`data` prop), with `<Verified>` in the foot.
- One name per thing, from `src/journey/terms.ts`: each term has one word, one plain sentence and a
  wiki page, and lists the names it retires (builder, worker and subagent are all a helper; the
  gate is the check; a session is a thread; the board is the tray). Define a term where the lesson
  first needs it: `<Term id="worktree" />` in step text (`components/journey/Term.astro`: the
  sentence on hover, focus or tap, and a link into the side view), and `termLabel('mgate', 'check')`
  or `{ at, term: 'check' }` on the picture (the same sentence on hover and focus). A lesson read
  cold must make sense: define again in each lesson, never "as we saw".
- A term the reader might not know is a label on the picture that opens its wiki page in the side
  view. Deeper play lives on a board (`/explain/...`, `/models/`) linked from the chapter's end.

## Part two: the work around the agents

The owner's brief, in their words: "essential concepts also getting the same full animation
treatment with progressive information disclosure", "usage vs api", "loops where specifically opus
5.5 is getting adversarial reviews from sol 6.2 and looping back and forth", "more weight to the
concept of building more and more things and having reviews and clean ups and refactors pull
requests, human review from colleagues and clients and users", "working on multiple tasks at once
in the same or different projects, creating different review artifacts to monitor the work done for
a task, building feedback instruments which allow for better interlacing of the human input",
"running different agents in different ways like locally or in a remote cloud environment or a
different computer using for example t3code".

Part one ends with you watching a gate. Part two pulls the camera back from the same floor. Nothing
from part one moves; six more nouns get a fixed place beside what is already there:

| Noun | Drawn as | Stands | Enters at |
| --- | --- | --- | --- |
| the meter | a glass tank that drains (a plan), or a pile of coins that grows (the API) | beside the model | 10 |
| a reviewer | a second station with a tinted cap: another model, its own window | beside the check | 11 |
| the tray | a plate beside you; cards stand on it | beside you | 12 |
| several jobs | the station, repeated in a row; your pawn walks to the one that needs you | along the front | 14 |
| other people | pawns: a colleague at the gate in front of main, a client in front of main, users beyond it | around main | 16 |
| a machine | a slab under the floor: your laptop, a computer that stays on, the cloud (floating, dashed) | under a job | 17 |

The tray is the hinge of part two. In 12 proof arrives on it. In 13 your answers leave from it. In
14 it is the board of jobs. In 16 it is what a colleague reads. In 17 it is what you see on your
phone. A card's colour follows the slab colours: blue for something a tool produced, pale for
something the model wrote, dark for something you wrote, accent for something wrong.

10. **What it draws from.** A meter beside the model. Every turn reads the whole window again.
11. **A second model.** The check gets a reviewer with a different model on top. Round and round.
12. **Proof you can read.** The tray. "Done" arrives with a summary, a test run, a screenshot.
13. **Your turn.** Your input gets doors: at the gate before the build, on the tray during and after.
14. **Several jobs.** The station in a row. One pawn, so jobs queue for you.
15. **The project grows.** The tiles of the project pile up. Clean-up and refactor are jobs.
16. **Other people.** A pull request waits at the gate in front of main; people stand around main.
17. **Other machines.** A slab under each job. Close the lid on one of them.

### Storyboards

Each chapter is four or five steps. The words below are the steps' text, close to final; tighten
them, do not lengthen them. "Breaks" is what the reader can do to make the thing fail. Jobs are
made-up and say so once per chapter; use the club list (a football club's member list) as in part
one. Every token, price, limit and product behaviour comes from `src/data` through the page.

**10 meter** (`solo({ tools, project, meter })`; team(n) with a meter for the last step). Data:
`models` pricing for Opus 5.5 (input, output, cacheRead), `plans.claude` prices and `limits`.
- `turn` *Every turn is counted.* "Each turn the model reads its whole window again and writes a
  little." A made-up job runs as in chapter 2; on every turn the window scans and the readout
  counts: turns, tokens read (all turns together), tokens written. The reader sees "read" run away
  from "written". No meter yet.
- `api` *On the API, every token is on a bill.* The meter appears as coins. Same job; a coin drops
  per so many cents. Readout: the job's bill, from the made-up tokens times the real prices.
  Control: pick a model (Opus 5.5, Fable 5.2, GPT-6.2 Sol). `<More title="The prices">` with `<Fact>`s.
- `cache` (level technical) *Reading the same thing again costs less.* Pick: cache on, cache off.
  The price of a cached read is a fact; what breaks the cache (a new thread, compaction, a changed
  instruction file) is shown by pressing a button that breaks it.
- `plan` *On a plan the price is fixed and the amount is not.* The meter is a tank. Jobs drain it;
  at empty the model stops with a blue lamp until the limit resets. Button: "Run another job".
  The drain rate is made-up and the step says why: the provider publishes no figure
  (`plans.claude.limits.whatUsageMeans`). `<More title="The limits">`: five-hour and weekly facts.
- `many` *Twenty agents draw from one tank.* `team(n)` with the meter beside the lead. Slider 1 to
  20, pick plan or API. Breaks: twenty on a plan empties the tank and all twenty stop mid-job.
  Ends with `<Next>` and more: `explain/plans-and-api/`, `models/`.

**11 review** (`solo({ tools, project, gate, reviewer })`). Labels: `a0` "Opus 5.5", `r0` "GPT-6.2
Sol", from data. A made-up job with three planted flaws, fixed in the script.
- `self` *Asked to check itself, it reads what it wrote.* The builder reviews in its own window:
  the same pile, the same assumptions. "Looks right." One of three found.
- `second` *A different model, an empty window.* The work goes to the gate and sideways to the
  reviewer, which gets the change and the brief and nothing else. Findings come back as accent
  pucks; the builder fixes; round two finds one; round three finds nothing; the gate turns green
  and the work reaches you. Lines under the picture are spoken by the two model names. Readout:
  rounds, findings, wrong when it reached you.
- `attack` *Tell it to break the thing.* Pick: "Review this." or "Find what is wrong. Try to break
  it." The polite brief gets "Looks good" and a remark about naming. `<More title="A prompt for this">`.
- `rounds` *Say when to stop.* Without a rule the reviewer always finds something: after the real
  flaws, matters of taste. Pick: no limit, or "only what breaks, three rounds at most". Readout
  counts rounds and what each side drew: two meters appear, one per provider, because each model
  runs on its own plan.
- `how` *Running it.* Pick how the two are joined: by hand (two threads, you carry the findings),
  one thread handing off, or the lead from chapter 8 doing it in a loop. `<More title="In T3 Code">`
  from `t3code.handoff`; Codex `/review` from `harnesses`. Breaks: self-review, the polite brief, no limit.

**12 proof** (`solo({ tools, project, gate, tray })`).
- `word` *"Done" is one word.* A job ends; one pale puck reaches you. Readout: changed lines you
  would have to read to know (made-up). The tray is empty.
- `cards` *Ask for proof with the work.* The agent runs the tests, opens the page, and four cards
  land on the tray one by one, each labelled on the picture: summary, test run, screenshot, a link
  to try. Each answers one question; the line under the picture says which.
- `catch` *Each card shows one kind of wrong.* Six made-up jobs that all pass the check, three of
  them not what you asked for. Toggle the cards; the readout counts what you catch at a glance
  and what lands unnoticed. Different from chapter 5: the gate is green every time.
- `during` *Proof while it runs.* A long job. Pick: nothing until the end, or a progress file.
  With it a card on the tray fills step by step and you can look without interrupting.
- `ask` *Say what you want back.* Pick the kind of work (a page, a script, a bug fix); the cards
  change (screenshots at two widths; rows before and after; the failing test, now passing).
  `<More title="A prompt for this">` with one prompt to copy.

**13 turn** (`solo({ tools, project, gate, tray })`). One made-up job with a fork in it: "Let the
club pause a member" (hidden from the list, or greyed out?). The reader plays you.
- `once` *You speak once.* It guesses at the fork, builds twelve turns on the guess, says done.
- `plan` *A door before the build.* The plan stops at the gate, blue lamp. Two buttons: "Go ahead",
  "Change step 3". The script waits for the reader. `<More title="Plan mode">` from `harnesses`.
- `ask` *A door during.* At the fork a question card lands on the tray and the agent carries on
  with the rest. Button: "Answer it". If the reader does not, the job ends with that part left open
  and says so.
- `pin` *A door on the result.* A screenshot card on the tray. Pick: type "the badge looks off", or
  pin the note on the picture. The pinned note travels back from the card with its place attached,
  and the fix lands where it was meant.
- `build` *Have it build the door.* The instrument is a job: a review page that lists every screen
  that changed with a comment box under each, saved to a notes file the agent reads on its next
  turn. A new card stands on the tray for good; a file tile lights on the project. `<More>` holds
  the prompt. This guide was built with one (`site/integrations/`); say so in one sentence.

**14 jobs** (`jobs(n)`).
- `one` *While it works, you wait.* One job, lamp on, your pawn standing still.
- `three` *Start another.* Three jobs in one project, each in its own copy. Your pawn walks to
  whichever lamp turns blue, stays a moment, walks on. The tray is the board: a card per job.
- `many` *There is still one of you.* Slider 1 to 5; pick what reaches you: "Done." (a long stop)
  or proof and short questions (a short stop). Readout over a made-up hour: jobs finished, time
  agents spent waiting for you. Breaks: five jobs and long stops; the row turns blue.
- `projects` *One project or several.* Pick. One: every job merges into main along the bus, one at
  a time. Several: a small project behind each job, each with its own instruction file.
- `board` *Keep the board short.* Pick how a job's card reads: a thread called "fix", or a name, a
  state and the next thing it needs from you. `<More title="In T3 Code">` from `t3code.worktrees`,
  `queueSteer`.

**15 grow** (`solo({ tools, project: { stacks, junk }, gate })`).
- `adds` *Every job adds something.* Job after job; tiles rise; commits line up on main.
- `junk` *And leaves something behind.* Hatched layers pile on the tiles: copies, code nothing
  calls. Each new job reads more before its first edit; the readout shows that share rising.
- `clean` *A clean-up is a job.* Button: "Run a clean-up". The hatched layers go; the check holds
  before and after.
- `refactor` *A refactor changes the shape and nothing else.* Uneven towers become even ones. Pick:
  with tests, without. Without, one tile turns accent and nothing notices.
- `rhythm` *Put it in the loop.* Slider: a clean-up every N jobs, or never, over twenty jobs.
  Readout: what the twentieth job had to read.

**16 people** (`ship(n, { people })`).
- `pr` *A pull request is a change that waits.* The branch travels the bus and stops at the gate in
  front of main, blue lamp. The automatic checks run there.
- `peer` *A colleague reads it.* A pawn at the gate. Pick what they get: the diff alone, or the
  diff with the proof from chapter 12. Their comment goes back to the agent as a dark puck.
  Second pick or slider: one small change, or everything at once. Breaks: twenty agents, one
  colleague, the gate backs up.
- `client` *A client looks at the thing, not the code.* A pawn in front of main gets a link. What
  they say travels back to you and becomes the next job.
- `users` *Users find what nobody tested.* Pawns beyond main. A report comes back as an accent
  puck; you hand it to the agent as the brief; the fix lands with a test, so the gate knows next time.
- `loop` *The widest loop.* All of it running: job, pull request, colleague, main, client, users,
  you. Readout: landed, sent back by a colleague, asked for by the client, reported by users.

**17 where** (`jobs(n, { gap: 100, machines })`). Data: `t3code.remote`, `connectMachines`,
`phoneIsRemote`; cloud sessions from `harnesses`.
- `laptop` *So far it all ran on your laptop.* One job on a slab: your files, your logins.
- `lid` *Close the lid and it stops.* Pick: open, closed. The slab and its job go faint; the card
  on the tray freezes.
- `box` *A computer that stays on.* A second slab and job. It keeps going with the lid closed; you
  reach it from the laptop or a phone. `<More title="In T3 Code">`.
- `cloud` *A machine in the cloud.* A floating slab. It starts empty for each task, with the
  repository and what you gave it; the result comes back as a pull request to main. Pick: with the
  setup it needs, or without (the check cannot start: red lamp).
- `mix` *Which job where.* Three jobs on three machines, all pushing to main; a lid button.
  Readout: running, stopped. `<Next>` leads to `/start/`.

Each chapter file also exports `demo(ctx, h)`: one short loop for the part-two overview
(`chapters/week.ts`).

## Files

- `src/journey/picture.ts`: the floor plan, the parts, and `picture(state)`: state in, parts,
  labels and camera out. Pure; also draws the first frame at build time.
- `src/journey/scene.ts`: the browser engine. Keeps the drawing in step with the state, moves pucks,
  runs scripts that stop when the reader scrolls on.
- `src/journey/presets.ts`: the standing arrangements: `solo()` and `team(n)`, and for part two
  `solo({ meter, reviewer, tray })`, `jobs(n)` and `ship(n)`.
- `src/journey/sim.ts`: the fleet simulation used by steps 7 to 9 and the home page.
- `src/journey/chapters/*.ts`: one file per chapter: a scene and a script per step, plus the
  actions its buttons and sliders call.
- `src/journey/run.ts`: picks the step on show from the scroll position and wires the controls.
- `src/journey/rungs.ts`: the seventeen steps and the two parts.
- `src/layouts/Journey.astro`, `src/components/journey/Step.astro`, `More.astro`, `Next.astro`,
  `src/styles/journey.css`.

A step in a page:

```astro
<Step id="norun" title="Take one tool away">
  <p>If it cannot run anything, it cannot check. It still says “fixed”.</p>
  <div class="pick">
    <button type="button" data-do="run" data-val="off" data-default aria-pressed="true">Without run</button>
    <button type="button" data-do="run" data-val="on" aria-pressed="false">With run</button>
  </div>
</Step>
```

`id` names a key of the chapter's `steps`. `data-do` calls one of its `actions`, `data-bind` one of
its `inputs`. `level="technical"` or `"engineer"` on a `<Step>` adds a step for those readers.

## Checks

Open the page at 1440 and 390 wide, light and dark, and scroll every step. With reduced motion
pucks do not travel and each script jumps to its result. `pnpm judge` both ways as usual.
