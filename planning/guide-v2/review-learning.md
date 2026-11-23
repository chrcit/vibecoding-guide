# Guide v2 review: two readers and a fact-check

Reviewed 2026-11-22. Covers worktree `t3-f7cb7143-40888abe92293a93` (commit `6a944bd` plus uncommitted changes) at `http://127.0.0.1:4133/v2/`. I read lessons 1 and 2 in the browser at Vibe coding (plain) and Engineer, at 1440×900, and at 390×844 for the first part only (see "Not checked"). I also read `site/src/v2/content.ts` and `site/src/data/{t3code,claims}.ts`. Read-only: no code changed.

## Verdict

The shell works and looks like an ADE. Teaching is where it falls short. The lessons are four runs of one sentence in a lab, and they do not tell a story. Two of the claims that matter most to a skeptical engineer are wrong about how agents work: the "done when" gate and "each tool call is a turn". The thesis, "let the how disappear and focus on the what", is never said. A newcomer finishes lesson 2 with no project to try it on and no word about what Full access lets the agent do. Most of this is copy and structure. The engine and shell can stay.

## Top 10, ranked

### 1. The "done when" gate claims something that doesn't happen

L2 part 4 says "Your 'done when' becomes a check it can run before it replies" and "The reply comes through the check". The picture draws a gate the reply must pass. In a plain agent run, nothing enforces this. The "done when" is text in the window like the rest of the request. It makes the model likely to test those cases, and it gives you a list to check its proof against. An engineer who knows that will stop trusting the rest. No fact backs the gate (`featureRequest` only says the prompting guide recommends saying how to verify).

**Fix:** keep the gate drawing, but label it as yours, not the agent's. Copy:

> Point 1: "Your “done when” goes into the window like the rest of the request. It doesn't force anything. It tells the agent what to try, and it tells you what to look for in the proof."
> Point 5: "It replies with what it tried and what happened. Hold that against your three cases: each one should show up in the work log."
> Annotation: "your three cases" (not "your “done when”" on a gate the reply flows through).

### 2. "Turn" is used wrongly, and the count doesn't add up

L2 part 2 is titled "One request, many turns". It says "Each tool call is a turn of its own" and shows "7 turns, 1 message". The cited source, `claims.lessons.agentLoop`, says the opposite: tools run *within one* Codex turn. The guide's own vocabulary also makes a part "one turn of that thread (request, work log, reply)". The plain-level work log shows 6 rows while the point says "seven turns… Each one is a row in the work log". The seventh hides in a grouped row that only technical readers see as "Read 2 files".

**Fix:** use "step" or "tool call", never "turn", for the inner loop.

> Title: "One request, many steps"
> Point 1: "Search, read, change, as before. Each step is the same loop: it asks for a tool, the harness runs it, the result goes back into its window."
> Point 5: "One message from you, seven tool calls. The work log shows them, grouped where they repeat."
> Annotation: "7 tool calls, 1 message"

### 3. The same request behaves three ways, and the lesson never says why

L2 parts 1, 2 and 4 send the same sentence. In part 1 it never runs anything. In part 2 it tests and fixes. In part 4 it tests the cases you named. The only explanation is "This time it tries what it wrote." A newcomer thinks the guide made it test. An engineer asks what changed: the seed, the instructions, or the effort? This is the real lesson, because agents vary run to run, and whether they check depends on the model, the project's instructions and whether the project has anything to run. Left unsaid, it reads as a cheat.

**Fix:** make the cause explicit in the lede, and change one thing per part that the reader controls.

> Part 2 lede: "The same request, run again. Agents don't do the same thing every time. This run, it also tried what it built."
> Add to the part 2 reply's deeper (technical): "Nothing in your request asked it to test. Whether it does depends on the model, the project's instruction file and whether the project has something it can run. Lesson 3 makes it ask for proof."

### 4. Lesson 1's main example shows the less likely reply, and the screen contradicts itself

Part 1 ends with the annotation "another run: “Can you share the list?”" while the reply below gives three invented names, with nothing marking them as invented. A current frontier model asked "who on Friday's list hasn't confirmed" without the list will usually ask for it. An engineer will try the suggested prompt, get a question back, and decide the guide is out of date. The source (`missingInformation`) supports "can supply a confident but false answer", not "usually does". The recheck says to show both possible replies.

**Fix:** show the likely reply first and the failure second, and mark the invented names in the reply.

> Point 3: "Most runs, it asks for the list. It can't answer from a list it never saw."
> Point 4: "Some runs, it fills the gap: names that sound right, written as confidently as real ones."
> Reply (point 4 state): "Three people haven't confirmed yet: Lena Brandt, Tom Okafor and Jule Sander." followed by a small marked line, "These names are not on any list. The model made them up."

Or keep one reply and make it the ask, with the invented names as the annotation.

### 5. "A new thread starts empty" is wrong

A new thread's window holds the harness's system prompt, the tool definitions, and the project's instruction file (AGENTS.md / CLAUDE.md). The agent can also read the project's files. Only the earlier conversation is gone. The recheck says this directly: "leave out those earlier messages. The project and model settings can still carry over." "Empty" also undercuts chapter 2's "Write it down", which works only because a new thread is *not* empty.

**Fix:**

> Title: "A new thread doesn't know the last one"
> Point 1: "A new thread. Yesterday's conversation stays in the other thread. What comes along: your model, your permission mode and the project with its instruction file."
> Point 3: "So it asks which guests you mean. Paste the list again, go back to that thread, or put the list in the project where every thread can find it."
> Engineer deeper: "The window isn't blank: the harness's system prompt, the tool definitions and the instruction file are there before your first word. The conversation isn't."

Set `context` to a small non-zero example (for example 3%) at point 1, not 0.

### 6. Security and privacy are missing (P0)

- L2 part 1 says "New threads start in Full access, so it uses them without asking" and moves on. Nothing says what Full access allows: any command, any file the account can reach. `guides/t3-code.md` treats this as a deliberate choice ("T3 Code is not a sandbox").
- L1 part 2 pastes a 60-row guest list, which is personal data, and the try-it prompt says "Here is the list: [paste it]". Nothing says this sends it to a provider.

**Fix:** one sentence each, in the reply, at every level.

> L2 part 1, point 1: "Now it has tools: search, read, change and run, in the project's folder. New threads start in Full access: it runs commands and changes files without asking. That is anything your account can do on this machine, so pick it on purpose."
> L1 part 2 try-it: "Here is the list: [paste a made-up list]. Who hasn't replied?" plus the T3 note "Whatever you paste goes to the model's provider. Use made-up data, or data your plan and your employer allow."

### 7. The nightclub is set dressing, and the thesis is never stated

Nobody introduces the club owner. "The Lantern" first appears inside a drafted text message in L1 part 2. There are no stakes: no doors at 22:00, no queue, no volunteer on the door. Lesson 2 repeats the request four times as an experiment, so the story stops after part 1. The brief's thesis, "let the how disappear and focus on the what", is visible only to someone who notices that the plain work log hides file names. It is never said.

**Fix:**
- Give each lesson a single setup line before the first request (it can be the lede of part 1):
  > L1: "You run the Lantern, a small club. Friday is in two days and the guest list lives in a spreadsheet."
  > L2: "Doors open at 22:00. Whoever is on the door has a phone in one hand and a stamp in the other."
- Have each part move the night forward instead of rerunning it. For example: part 2 is the dress rehearsal on Thursday, and part 3 is Friday 21:30, when the preview won't start.
- State the thesis once, in L2 part 1's reply:
  > "You didn't name a file, a framework or a field. It found the guest list, read how it's stored and wrote the page. That's the how. Yours is the what: who stands at the door, what they need to see, and what must never happen."

### 8. Engineer level adds almost nothing where engineers need it

A diff of the plain and engineer text shows that L1 gains two sentences (one is the technical-level line). L2 gains file paths in the work log and two deeper lines. The audience note says engineers want mechanisms. They already know LLMs hallucinate and that chat has no memory. What they don't know is how the agent setup changes that. Nothing tells them that the harness, not the model, executes tools. Nothing says the whole transcript is re-sent on every call, what is in the window before they type, or who wrote the test that passed.

**Fix:** one engineer deeper line per part that names the mechanism. Suggested lines:

> L1 p1: "Generation is next-token prediction over the window. With no list in the window, a plausible list is as likely an output as a refusal; current models are tuned to ask, not guaranteed to."
> L1 p2: "Pasting is the simplest retrieval. Sixty rows fit easily. Thousands don't, and that is when tools that search beat pasting (lesson 2) and the window starts to fill (lesson 5)."
> L2 p1: "The model emits a tool call; the harness (Claude Code or Codex under T3 Code) executes it and appends the result; the whole transcript goes back to the model for the next step."
> L2 p2: "The test it ran is one it wrote in the same run. Passing its own test shows the code does what it thought you meant. Your cases (lesson 3) check what you meant."
> L2 p3: keep the 8.88% line, but name the model: "In OpenAI's Blocker Deception test, GPT-6.2 Sol with the Codex developer prompt left out a known blocker in 8.88% of trials. The test was built to provoke it, and the study gives no rate for everyday use."

### 9. The work log teaches things the real app doesn't do

- "Each row of the work log is one tool call" (L2 p1 try-it) contradicts `t3code.screen.workLogGroups`. Repeated calls are grouped, and the lesson itself shows "Read 2 files" and "Ran 2 commands".
- The plain rows paraphrase ("where tonight's list is kept"). The real app shows `Read src/guests.ts` and the command. A newcomer who opens T3 Code will see paths and commands and think something is wrong.
- `door.spec` runs in L2 part 2 without any Changed files row creating it. An engineer will ask who wrote the test. That question is the point of chapter 2, so show it.

**Fix:** show the app's real label at every level and put the plain gloss in the detail ("Read src/guests.ts · how the list is stored"). Add `+src/door.spec.ts` to the change row in parts 2 and 4. Change the try-it to "Each row is a tool call, or a group of the same call. Expand one to see the command and what came back."

### 10. "Take run away and it still says done" shows a different failure from the one it names

The title promises an overstated "done". The reply then says "I couldn't run it, so I haven't tried it." That is honest, and the deeper line even says "Here the last line admits it." The blocker is also the reader's own refusal, which a reader will not see as a real failure. The 8.88% figure is about known obstacles in the environment (a missing file, an unavailable build tool).

**Fix:** make the blocker environmental, and have the reply gloss over it.

> Lede: "Friday, 21:30. The same request. This time the preview won't start on this machine."
> Point 3: "It tries to run the page. The command fails: no browser to test with."
> Point 5: "It replies “Done.” The work log says otherwise: the only Ran command row is red, and nothing after it tried the page."
> Reply: "Done. The door page is at /door: type a few letters and tap a guest to check them in." (no admission)
> Title: "Done, but never tried"

Keep Supervised and Approval for a later lesson on permissions, or show them in part 1 as the stricter alternative to Full access.

## Pass 1: the skeptical senior engineer

| Part | What I learn | Problem |
|---|---|---|
| L1 p1 Text in, text out | The model sees only the window. | I knew that. The invented-names reply doesn't match what current models do (#4). Points 1 and 2 say the same thing. |
| L1 p2 Only what is in the window | Pasting puts the data in the window. | "Every name in its reply comes from a row it was given" is overstated. With 60 rows it can still mis-copy or miscount. Say "names you can check against the list". |
| L1 p3 A new thread starts empty | The conversation doesn't carry over. | Wrong about the system prompt and instruction file (#5). |
| L2 p1 Tools and the work log appear | Tool calls, and results go back into the window. | Good mechanism, best part. Full access passes without comment (#6). The harness is only in a tooltip. |
| L2 p2 One request, many turns | Run, fail, fix, rerun. | Wrong use of "turn" (#2). Unexplained variance (#3). A test that appears from nowhere (#9). |
| L2 p3 Take run away… | Read the log, not the reply. | The scene contradicts the title (#10). |
| L2 p4 Say what done looks like | Name the cases. | Gate mechanism is wrong (#1). Duplicates lesson 3, "Done when". |

The nightclub carries L2 part 1 well: a door, one hand, a list. Elsewhere it is decoration (#7). The work log carries "let the how disappear" at plain level, but only for readers who compare levels.

## Pass 2: the newcomer at Notion level

Where I get lost:

- **First screen.** I land inside a chat with a 3D tank. Nothing says what this page is, that it is a pretend T3 Code, or how to use the controls. The only explanation is the sidebar footnote, in small type.
- **The controls.** There are two kinds of back and forward (|◀ and ‹), with no labels I can see. "Part 1 of 3 · point 4 of 4" uses the guide's own words before I know them.
- **Words used without explanation in the visible text** (tooltips exist for model, window, tools and project only):
  - *harness*: inside the tools tooltip, with no tooltip of its own in the lesson;
  - *Full access*, *Supervised*, *permission mode*;
  - *work log*, *thread details*, *composer*, *model picker*;
  - *CSV* ("friday-list.csv");
  - "/door";
  - "390 pixels wide";
  - "Done when", which arrives as a formula in lesson 1 before any lesson explains it.
- **Who am I?** The "I" in the requests is never introduced (#7).
- **What next?** The lesson 2 try-it asks me to send the door request "in T3 Code". I have no club project, no list and no app. Nothing tells me to start from an empty folder, or which project to open.

**Fix:** add a three-line start card on first visit:

> "This is a pretend T3 Code. Each lesson is a thread; press play or step with ‹ ›. You're the owner of a small club, the Lantern."

Add a "Start here" setup step for lesson 2's try-it:

> "Make an empty folder, open it as a project, and ask for a one-page guest list app with ten made-up guests first."

## Pass 3: fact-check

Data files read: `site/src/data/t3code.ts`, `site/src/data/claims.ts` (`lessons`), and `site/src/data/models.ts`. Checked against `capabilities-recheck.md`.

**Traced and consistent**

- New threads start in Full access: `t3code.defaultMode`.
- Supervised asks before commands and file changes: `t3code.modeMeaning`.
- The route to switch modes: `t3code.modeSwitch`.
- The Approval status: `t3code.screen.statuses`.
- "New thread", the context window wording, "Worked for", the work-log labels and the filter label: `t3code.screen.*`.
- New threads carry the model and mode: `t3code.newThreadCarries`.
- The agent loop: `claims.lessons.agentLoop`.
- Run, fix and repeat checks: `claims.lessons.runChecks`.
- Expand a tool call to see the command and output: `claims.lessons.toolCallEvidence`.
- 8.88%, with the deliberate-blocker setup in the sentence: `claims.lessons.blockedCheckOmission`.
- Name the outcome, constraints and check: `claims.lessons.featureRequest`.
- Opus 5.5 and GPT-6.2 Sol as model names: `models.ts`.

**Contradicted by a fact in this repo**

1. "Each tool call is a turn of its own", "One request, many turns" and "7 turns" contradict `claims.lessons.agentLoop` ("Within one Codex turn…").
2. "Each row of the work log is one tool call" contradicts `t3code.screen.workLogGroups`.
3. "A new thread. Its window starts empty" contradicts the recheck guidance ("The project and model settings can still carry over") and the window term's own definition, which counts files opened.
4. `site/src/journey/terms.ts`, the `harness` term: "Claude Code, Codex and T3 Code are harnesses" contradicts `guides/t3-code.md` ("It is a viewer, not a harness"). This is v1 code, but v2 reaches it through the tools tooltip.
5. The permission chip draws "Full access". The sourced string is "Permissions: {mode}" (`t3code.screen.permissionChip`). Show "Permissions: Full access" or say it is shortened.
6. The sidebar draws project folders. Per `t3code.screen.sections` and `folders`, the default sorts by state, and folders are the Labs "Boring sidebar" setting. Say so in the sidebar footnote.

**Untraced (no fact, and stated as fact)**

- "Your 'done when' becomes a check it can run before it replies" and "The reply comes through the check" (#1). I know of no source for this, and I believe it is wrong.
- "Every name in its reply comes from a row it was given" (L1 p2). Overstated; soften it.
- "Ask again and it may ask to see the list instead" (L1 p1). The recheck supports "might invent names or ask", but `missingInformation` covers only the invent half. Extend the fact's claim or add one.
- "It writes the text most likely to come next" is a standard simplification. It's acceptable, but at engineer level say that instruction tuning changes what "likely" means.
- "The deeper line: a current model…" names no model while the chip says Opus 5.5. A reader will read it as Opus. Name GPT-6.2 Sol (#8).

**Safe as labelled examples:** the durations ("Worked for 1m 50s", "4m 05s", "5m 20s"), the context percentages and the guest data. The sidebar footnote says the numbers are made up. Keep them out of prose, as the recheck asks. Times this short for a tested feature are on the optimistic side, so don't quote them anywhere as typical.

## The lesson design

The parts are mostly the right mechanisms in the wrong grouping:

- L1 p1 and p2 are one idea (what's in the window) split in two.
- L2 p4 is lesson 3 ("Done when"), and its "proof you can read" annotation is lesson 8's title.
- L2 p3 needs a different blocker to teach what its title says.

Seven parts and 33 points for two lessons is a lot of stepping for little new information per step. Several points repeat the one before ("It reads everything in its window. Your sentence is all there is.").

Fewer, stronger points would teach more. Each part should change one thing and end on a consequence the reader can act on.

### Proposed breakdown

**Lesson 1, Say what you want** (2 parts, 7 points)

1. **Only what's in the window.** *Setup: the Lantern, Friday in two days.*
   1. Your sentence goes in, and nothing else.
   2. Most runs, it asks for the list.
   3. Some runs, it invents names that sound right, marked in the reply.
   4. Paste a made-up list: now every name is one you can check, and what you paste goes to the provider.
2. **A new thread doesn't know the last one.**
   1. A new thread: the conversation stays behind.
   2. What comes along: model, mode, the project and its instruction file.
   3. So put what every thread needs in the project (this sets up "Write it down").

**Lesson 2, It gets hands** (3 parts, 13 points)

1. **Say the what; it finds the how.** *Setup: doors at 22:00, one hand.*
   1. Tools appear, and Full access means no asking.
   2. It searches; the harness runs the search and the result goes back.
   3. It reads how the list is stored.
   4. It writes the page.
   5. It replies, and the log keeps every step. You never named a file.
2. **It can try what it built.** *Thursday's rehearsal.*
   1. Same request, run again; this run, it tests.
   2. It writes its own test, and it fails.
   3. It fixes and reruns.
   4. Its test passes. It checked what it thought you meant, and one-handed is still yours to try.
3. **Done, but never tried.** *Friday 21:30.*
   1. Same request; the preview won't start here.
   2. The run fails.
   3. It replies "Done."
   4. The log shows a red row and nothing after it. Read the log, not the reply. Then lesson 3 teaches "done when" and proof.

This keeps each lesson to one claim a reader can repeat:

- **Lesson 1:** it knows only what's in its window.
- **Lesson 2:** it acts with tools in a loop, and "done" is a claim you check in the log.

It also hands lesson 3 a reason to exist.

## Smaller notes

- L1 requests carry "Done when I have names I can text today". A chat model with no tools can't check anything, so in lesson 1 this reads as a formula. The brief wants a "done when" on every request, so keep it, but add one line in L1 p1 saying it is for you: "You'll know it's done when the names are real ones you can text. That's a check only you can make here."
- L1 p3 try-it, "New thread carries your model and mode, not what you said in other threads", is good. Add "or the project's files".
- The answer text is greyed while the part plays, which is good. On the final point of L1 p1 the picture and the reply disagree (#4).

## Not checked

- **Phone, beyond part 1's first point.** At 390×844 the dev-only comments button ("Review 0", from `site/integrations/comments`) sits over the play button. My scripted clicks on the point controls stalled, so I have no phone screenshots past L1 p1 point 1. It is dev-only, but it hides the play control in every dev preview the owner sees on a phone.
- **Dark mode and the filter popover.**
