# Guide v2: lessons 9 to 13 as scripts (chapter 3, More agents)

This continues [lessons 3 to 8](lessons-3-8.md) in the same shape: each part has a request, a lede, points (a scene state, moves and a "say" line), work-log rows per point, an answer and a try-it. It is built in `site/src/v2/lessons/l9.ts` to `l13.ts`.

**Everything about the club is made up.** That covers the Lantern, its staff, promoters and guests, every name, time, count, code and percentage in a reply, every context-window and usage percentage, and every file name. The scripts show behaviour that the sources describe. They are not records of real runs.

The conventions are the same as in `lessons-3-8.md`:

- **Chat** is what the lesson thread shows at that point: the request, work-log rows in T3 Code's words, the sidebar.
- **Explainer** is the picture (v1's engine), with at most two annotations. Annotations are in quotes.
- **Browser**: **E** means the explainer is in front; **App** means a Preview app, with its page path.
- Work-log rows use only words from `t3code.screen.workLog`, `workLogGroups`, `workedFor`, `subagents` and the new facts listed at the end.

---

## The week after: one page

The Friday of lessons 1 to 8 went fine. The Lantern's birthday is next Friday: the first night with tickets, and a bigger list than ever. The jobs this week are bigger than one thread can carry comfortably, and each lesson brings in more agents for one reason the job gives.

| When | Lesson | What happens at the Lantern | Why more agents | What the app has afterwards |
|---|---|---|---|---|
| Mon 10:00 | 9 A helper | Guests should give back their spot from their invite. First the agent has to find every place a spot is counted. Reading it all fills its window; a helper reads instead and sends back eight lines. Three helpers then check the build at once. One asks to run a command, and the question comes to you. | Reading a lot to answer a little. | `/i/<code>`: give back your spot |
| Tue 11:00 | 10 Side by side | Tickets: a sale page, the door scanning tickets, and the night's sales. Three threads, three worktrees, all done by lunch. Merged back, the door rejects every real ticket: each thread guessed what a ticket looks like. A shared shape on main first, then one merge at a time. | Three jobs that don't touch. | `/tickets`, `/door/scan`, `/sales` |
| Wed 14:00 | 11 A lead | Kai's spreadsheet, Noor's sheet and the ticket sales go into one list. A lead thread splits the work, delegates three child threads with short briefs, waits, and checks their work together before it reaches main. Its check catches Noor's importer dropping plus-ones. | A job with parts, and someone to hold them together. | `/guests/import` |
| Thu 16:00 | 12 A second model | The checkout takes money. A fresh reviewer of the same model finds one thing; a different model finds that two phones can buy the last ticket. A third round finds only style, so a rule says when to stop. Then two models build the same page and you keep one. | Different blind spots. | checkout fixed, a new sale page |
| Fri 12:00 | 13 A fleet | Before the birthday night: every page at phone size, light and dark, by keyboard. Twelve small helpers check 24 pages in minutes. They all draw on one plan, and the lead's window fills with their reports. The check in front of main catches a helper that turned the do-not-admit red into orange. | Many small, separate, checkable jobs. | every page checked |
| Fri 23:00 | | Doors open. | | |

Cast, all made up and carried over from lessons 1 to 8: Sami (door), Bea (bar), Kai and Noor (promoters), Ana Lopez and Lea Brandt (guests), Rico Vance (do-not-admit). The app already has the door, promoter links, plus-ones that count toward a promoter's limit, `/bar`, `/rota`, the do-not-admit list (red at the door), `AGENTS.md` with the phone rule, and a `door-check` skill.

Threads that carry across lessons: the **tickets** start in 10, are imported in 11 and reviewed in 12. **Red means do not admit** (written down in lesson 6) is what the fleet's check protects in 13. Each lesson's lede says what came before in one line, so a reader who jumps in isn't lost.

### What this chapter must get right

These are the mechanisms, as the sources describe them. Every lesson leans on them.

- **A subagent (a helper) runs inside one thread.** It starts with a fresh window that holds its brief, not the conversation, and only its summary comes back (`harnesses.claudeCode.subagentFreshContext`). In T3 Code the parent's timeline shows a "{n} subagents" row that expands to a row each; a subagent is not a thread in the sidebar (`t3code.screen.subagents`). If a subagent is waiting for an approval or an answer, the parent's row says Approval or Input (`t3code.subagentRequests`, new).
- **Every helper spends from the same plan.** Subagents send their own requests and draw on the same usage (`plans.claude.limits.subagentsDraw`, `harnesses.claudeCode.subagentUsage`). Codex says its subagent workflows use more tokens than single-agent runs (`harnesses.codex.subagents`).
- **Threads side by side are separate sessions.** Each has its own window. In its own worktree each has its own copy and branch (`t3code.worktrees`, `t3code.branchPrefix`). Nothing merges them for you.
- **A lead starts threads.** In T3 Code an agent can hand a task to another agent with `delegate_task`, and its thread wakes with the result (`t3code.delegate`). While it waits on a child thread, the lead's row says Waiting (`t3code.waitingOnChild`, new). The work log shows "Delegated {count} tasks" (`t3code.screen.delegatedRow`, new), and the children appear in the lead's timeline as subagent rows, not in the sidebar (`t3code.delegateChild`, new).
- **A second model** can be a fresh copy of the same one (fresh eyes, same blind spots: `harnesses.claudeCode.sameModelReviewer`) or another provider's (`t3code.crossProvider`, `t3code.delegate`). A reviewer asked to find problems always finds something (`harnesses.claudeCode.reviewerAlwaysFinds`). Shift-clicking several models sends one prompt to each, in its own thread and worktree (`t3code.manyModels`).
- **A fleet** multiplies all of the above: the plan drains faster, the lead reads more reports, and you are still one reader (`observations.experience.parallelThreads`, an observation). A thread that hits a usage limit says Limited (`t3code.limited`).

---

## Lesson 9, A helper

**Story beat.** Monday 10:00. Guests should be able to give back their spot from their invite, so their promoter gets the space back for the birthday night. Before anything is built, the agent has to find every place the app counts a spot.

v1 mechanism: `handoff.ts` (a helper with an empty window and only the brief in it; only its report comes back). Starting state: `team(0)`, then `team(1)` with the lead at full size, as in v1's `base()`. Part 9.3 uses `team(3)`. Part 9.4 adds a plan meter beside the agent.

The context window (lesson 5) shows in thread details throughout: it is the number this lesson is about.

### 9.1 Reading fills the window

**Request.** Next I want guests to give back their spot from their invite link. First find every place the app counts a guest's spot. Change nothing yet.

**Lede.** Monday 10:00. Last Friday went fine, and next Friday is the Lantern's birthday. A read-only question first.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Your question goes in. Thread details say the window is 4% used. | Request. Context 4%. | `team(0)`: you and the agent. "a question, no changes" at you. | E |
| 2 | It searches the project. Fourteen places mention a spot. | `Searched spot in src`. | Search slab in the agent's window. | E |
| 3 | To answer, it reads each file whole. Every one stays in its window. | `Read 9 files`. Context 31%. | Nine tool slabs stack in the window. "9 files, whole" at the window. | E |
| 4 | Three of those files matter. The answer is eight lines. The other six files stay in the window for the rest of the job. | Reply. | Model slab on top. "31% for 8 lines" at the window. | E |

**Answer.**

> A spot is counted in three places: the promoter's limit (`promoters.ts`, plus-ones included), the door's head count (`door/count.ts`), and the capacity check on the late list (`door/late.ts`). Giving back a spot has to update all three.
>
> Nothing is changed yet.

**By level.** *Technical:* `deeper` says every file it reads stays in this thread's window, and each later turn reads them again (lesson 5). *Engineer:* `deeper` says a read-heavy question in the main thread costs context for the rest of the session, which is what Claude Code's subagents are for.

**Try it.** "Find every place [the thing] is used. Change nothing yet." **In T3 Code:** open thread details and note the Context window before and after a read-heavy question.

**Facts.** `t3code.screen.contextWindow`, `t3code.screen.searchRow`, `t3code.screen.workLogGroups`.

### 9.2 A helper with an empty window

**Request** (new thread): the 9.1 request, and: *Use a helper for the reading.*

**Lede.** The same question in a new thread. This time the agent hands the reading to a helper.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The agent writes a short brief and starts a helper: a subagent, inside this thread. | "1 subagent" row appears, running *(highlighted)*. | `team(1)`: a brief puck to the helper. "a subagent: same thread" at the helper. | E |
| 2 | The helper's window starts empty. It holds the brief, not your conversation. | The subagent's row: "Find where a spot is counted". | The helper's window: one brief slab. "only the brief" at its window. | E |
| 3 | It does the searching and reading. The files fill the helper's window, not the agent's. | | Nine slabs fill the helper's window. The agent's stays short. | E |
| 4 | Only its report comes back: eight lines. | The subagent's row: done. | A summary puck back along the bus. "8 lines back" at the agent. | E |
| 5 | The same answer, and this thread's window is 7% used, not 31%. | Reply. Context 7%. | "7%, not 31%" at the agent's window. | E |

**Answer.** As in 9.1, plus: "A helper did the reading. Its report is above."

**By level.** *Technical:* `deeper` says Claude Code starts each subagent with a fresh window and returns only a summary. *Engineer:* `deeper` says the helper's reads cost tokens all the same: they are moved, not saved, and they count toward the same plan (part 4).

**Try it.** "Use a helper to find [what you need]. Bring back only what matters." **In T3 Code:** expand the subagents row to see each helper and what it was asked.

**Facts.** `harnesses.claudeCode.subagents`, `harnesses.claudeCode.subagentFreshContext`, `t3code.screen.subagents`.

### 9.3 Three helpers check at once

**Request** (same thread): Now build it. *Done when* you've tried it at phone size with made-up guests: a guest gives back their spot, and it frees up on the promoter's list, at the door and on the late list, plus-ones included.

**Lede.** The agent builds the give-back page itself. Then it sends three helpers to check the three places at once.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It builds the page itself: changing code stays in this thread. | `Changed 3 files`. | Agent works; project file tiles `edit`. | App `/i/ana`: "Ana Lopez · Guest of Kai · +1 · Give back my spot". |
| 2 | Three helpers start at once, one per place. Each brief names its place and says plus-ones count. | "3 subagents" row, 3 running. | `team(3)`: three briefs go out together. "3 at once, one brief each" at the helpers. | App |
| 3 | Two report back: the promoter's list and the late list free the spot. | Two rows done. | Two summary pucks back. | App |
| 4 | The door helper finds the head count still counts Ana's plus-one. | Third row: failed. "2 running" → "1 failed". | A `bad` puck back. "door: +1 still counted" at its helper. | App `/door`: count 1 too high, marked. |
| 5 | The agent fixes the count and runs the door check itself. All three pass. | `Changed files`, `Ran command` (ok). Reply. | Lamp `ok`. | App `/i/ana`: "Your spot is back with Kai". |

**Answer.**

> Guests can now give back their spot from their invite. The spot and any plus-ones go back to their promoter, and the door's count and the late list drop with them.
>
> I tried it at 390 px with made-up guests. Three helpers checked the promoter list, the door and the late list at once. The door helper found the plus-one still counted. I fixed that and ran the door check: all three pass.

**By level.** *Technical:* `deeper` says helpers that only read can safely run side by side in one checkout; helpers that edit the same files clash (lesson 4). *Engineer:* `deeper` says with nothing configured, Claude Code runs a subagent in the background and its result arrives later; Codex waits for all requested results and returns one consolidated response.

**Try it.** "Check [three things] at once, with a helper each. Each brief says [the rule they all need]." **In T3 Code:** the subagents row shows how many are running; expand it to see which one failed.

**Facts.** `harnesses.claudeCode.subagentBackground`, `harnesses.codex.subagentResults`, `t3code.screen.subagents`, `claims.lessons.toolCallEvidence`.

### 9.4 Its questions and its usage are yours

**Request** (same thread, Supervised): Try the give-back on a copy of Friday's real list before it goes live. *It must never change the live list.*

**Lede.** It touches real guests, so the thread is in Supervised. A helper wants to run a command.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The chip says Supervised. The agent starts a helper to try it on a copy of Friday's list. | Chip "Permissions: Supervised" *(highlighted)*. "1 subagent". | `team(1)`, plan meter beside the agent *(appears)*. | E |
| 2 | The helper wants to run a command. Its approval comes to you in this thread, and the thread's row says Approval. | Sidebar status **Approval**. | Lamp `wait` on the helper, puck to you. "its question comes to you" at you. | Page: `npm run trial -- --copy data/live/friday.json` |
| 3 | The command works on a copy. You approve. | Status Working. | Puck back to the helper. | E |
| 4 | Every helper sends its own requests. They come out of the same plan as this thread. | Reply. | The plan meter drops in steps, one per helper turn. "one plan for all of them" at the meter. | App `/i/lea` on the copy. |

**Answer.**

> On a copy of Friday's list, 14 guests could give back their spot and every count dropped as it should. The live list wasn't touched: the trial reads a copy and writes nothing back.

**By level.** *Technical:* `deeper` says helpers draw on the same usage as the main conversation; `/usage` in Claude Code shows the share. *Engineer:* `deeper` adds that a subagent can run on a smaller model, and Anthropic's cost advice suggests Haiku for simple subagent tasks (lesson 13).

**Try it.** "Use a helper for [the reading or checking]. Tell me before it runs anything that touches real data." **In T3 Code:** an Approval row on a thread you didn't touch may be one of its helpers asking.

**Facts.** `t3code.subagentRequests` (new), `plans.claude.limits.subagentsDraw`, `harnesses.claudeCode.subagentAttribution`, `harnesses.claudeCode.smallSubagentModel`, `t3code.screen.permissionChip`.

**After lesson 9 the reader can** say when a helper is worth it (lots of reading for a short answer), predict what a helper knows (its brief) and what comes back (a summary), run read-only helpers side by side, and expect their approvals and their usage to land on them.

---

## Lesson 10, Side by side

**Story beat.** Tuesday 11:00. The birthday night sells tickets: a sale page, the door scanning tickets, and a sales page for you. They look independent, so three threads work on them at once, each in its own worktree.

v1 mechanism: `team.ts` "parallel" (copies merged into main one at a time) and `jobs.ts` (jobs in a row, one of you, a tray). Starting state: `jobs(3, { projects: 'one' })`, each job with its own tree; parts 2 and 3 add the check in front of main (`mgate`). The sidebar shows the three story threads, each with its own status (`Point.threads`).

Lesson 4 showed why two threads need separate worktrees. This lesson is about splitting a job and bringing the pieces back.

### 10.1 Three jobs, three worktrees

**Request** (new thread "Ticket sale", New worktree): People can buy up to four tickets for Friday on their phone, and get each ticket as a code to show at the door. *Done when* you've tried it at phone size with made-up buyers.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | You send the sale page in a new thread, in New worktree: its own copy of the project, on its own branch. | Sidebar: "Ticket sale" Working. | Puck to j0. "t3/ticket-sale" at j0. | E |
| 2 | Mod+Enter sends a prompt in the background. You start the door scan and the sales page the same way. | Sidebar: three rows Working. | Pucks to j1, j2. "3 threads, nothing waits for you" at the tray. | E |
| 3 | Each has its own window and its own copy. None knows the other two exist. | | Windows fill. "its own window" at j1. | E |
| 4 | By lunch all three are Done, each passing its own checks in its own copy. | Three rows Done. Reply (the sale thread). | Lamps `ok`, cards `wait`. "pass, each on its own" at the tray. | App `/tickets` |
| 5 | The sale page writes LTN-7K2Q. The scan expects "lantern:…". Nobody said what a ticket is. | | "LTN-7K2Q" at j0, "lantern:…" at j1. | App `/door/scan` (scan-own) |

### 10.2 Bring them back

**Request** (sale thread): Merge the three branches into main one at a time, and run every check on main after each merge.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The sale branch first. Every check passes on main. | `Ran 2 commands` (ok). | j0 to main through the check, commit `ok`. | App `/tickets` |
| 2 | Then the door scan. The merge is clean: different files. | `Ran command` (ok). | j1 to main. "no conflicts". | |
| 3 | Checks on main fail: the scan rejects every sold ticket. | `Ran command` (bad). | Check `bad`. | App `/door/scan`: "Not a Lantern ticket" |
| 4 | It undoes that merge and replies. | `Ran command` (reset). Reply. | j1's work back off main. | |
| 5 | Each passed alone because each tested its own idea of a ticket. A clean merge only means the lines don't overlap. | The red row marked (`look: 'log'`). | | |

### 10.3 Agree the shape first

**Request** (sale thread): Write down what a ticket is in one place on main, with a test. Then bring the scan and sales branches up to date with main, make them use it, and merge them one at a time.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | One small change on main first: what a ticket is, with a test. | `Changed 2 files`. | Commit `ok`. "a ticket, defined once" at main. | |
| 2 | Scan and sales are brought up to date with main and use that definition. | `Ran command`, `Changed 3 files`. Two rows Working. | Pucks main → j1, j2. | |
| 3 | Merged one at a time, checks after each: all pass. | `Ran 4 commands` (ok). | Commits `ok`, check `ok`. | App `/door/scan`: "Ana Lopez · 2 tickets · Valid" |
| 4 | Split where pieces don't touch, write the shared parts first, bring them back one at a time. | Reply. | "shared first, then split" at main. | App `/sales` |

**Facts.** `t3code.worktrees`, `t3code.branchPrefix`, `t3code.shortcuts.background`, `observations.experience.parallelThreads` (labelled as an observation), `claims.lessons.toolCallEvidence`.

**After lesson 10 the reader can** split a job into pieces that don't touch, run them side by side in their own worktrees, expect each to pass on its own and still disagree, and bring them back one at a time with checks on main.

---

## Lesson 11, A lead

**Story beat.** Wednesday 14:00. Kai keeps his list in a spreadsheet, Noor in a sheet of her own, and the tickets come from the sale page. One guest list for Friday has to hold them all, with nobody twice.

v1 mechanism: `team.ts` "lead" (helpers in their own copies, short reports, a check in front of main). Starting state: `team(3, { trees: true, mgate: true })`.

**What T3 Code really shows** (read on main at 7b47a21): the lead's work log shows "Delegated 3 tasks" and a "3 subagents" group with a row per child ("Running", "Completed", "Failed"; the summary "3 working", "2 done · 1 failed"). Delegated child threads are **not** rows in the sidebar: they live inside the parent's view and open in the right panel. The lead's own row says **Waiting** while it is blocked on a child thread. "Woke" is the snooze status and isn't used.

### 11.1 One thread starts the others

**Request** (new thread "Friday's guest list"): Bring Kai's list, Noor's list and the ticket sales into one guest list for Friday. Split the work across threads with a short brief each, and tell me what each one did before anything is merged.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The lead reads a few rows of each list. It imports nothing itself. | `Read 3 files`. | Reads from main. "three lists, three shapes". | App `/guests/import` (sources) |
| 2 | A short brief each, handed to a thread of its own, in its own worktree. | `Delegated 3 tasks`, "3 subagents · 3 working". | Three briefs out. | |
| 3 | The lead waits. Its row says Waiting. | Lesson row **Waiting**. | Lead lamp `wait`. | |
| 4 | Each child starts with its brief; what it reads stays in its own window. | | Helper windows fill. | |
| 5 | Short reports come back; the lead's window holds briefs and reports only. | Rows Completed. | Three `sum` pucks back. | |
| 6 | It replies with what each did. Nothing merged. | Reply. | | |

### 11.2 The lead checks before main

**Request:** Check all three together, with made-up rows from each list, before anything reaches main.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Made-up rows from all three at once: Noor's guests have no plus-ones. | `Ran command` (bad). | Check `bad`. | App (partial): banner "found by the lead's check" |
| 2 | Noor writes "+1" after the name; her importer read it as part of the name, and its own test had no plus-ones. | | "“Lea Brandt +1” read as a name" at w1. | |
| 3 | The fix goes to a new child with the failing row in its brief. The lead waits again. | `Delegated 1 task`, one subagent row. **Waiting**. | Brief `bad` to w1. | |
| 4 | Fixed; the check on all three passes. | `Ran command` (ok). | Check `ok`. | App (fixed) |
| 5 | Three importers go through the check into main, and it replies. | `Ran 3 commands` (ok). Reply. | Three pucks to main, commits `ok`. | |

### 11.3 The part only the lead can do

**Request:** Some guests are on two lists. Keep each person once, with every list they came from.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Ana is on Kai's list and bought tickets. No child could see both. | | "needs all three lists". | App (fixed): pairs marked "same guest?" |
| 2 | The lead does this part itself, on main. | `Changed 2 files`. | Lead to main. | |
| 3 | Each duplicate becomes one guest who keeps both lists. Checks pass. | `Ran command` (ok). | "4 people kept once". | App (merged): "Ana Lopez · Kai · Ticket" |
| 4 | One reply; the children sit inside this thread; stopping it stops them. | Reply. | "one reply, four threads behind it". | |

**Facts.** `t3code.delegate`, `t3code.delegateChild` (new), `t3code.screen.delegatedRow` (new), `t3code.waitingOnChild` (new), `t3code.stopStopsSubagents` (new), `t3code.screen.subagents`, `t3code.screen.subagentStates` (new), `claims.lessons.toolCallEvidence`.

**After lesson 11 the reader can** hand a job with parts to a lead, expect short briefs out and short reports back, rely on the lead's check before main rather than each child's "done", and keep for the lead the work that needs every part.

---

## Lesson 12, A second model

**Story beat.** Thursday 16:00. The ticket checkout takes real money tomorrow. You want it read by someone who didn't write it.

v1 mechanism: `review.ts` (a reviewer beside the gate gets the change and the brief, never the builder's window; rounds until nothing breaks; a rule to stop). Starting state: `solo({ tools: true, project: true, gate: true, reviewer: true })`, the reviewer the same model in 12.1 and model `b` from 12.2. Part 12.4 uses `jobs(2)` with the second job on model `b`.

### 12.1 Fresh eyes, same model

**Request:** Review the ticket checkout before tomorrow.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It starts a review in a helper with its own window. The helper never saw how the code was written. | "1 subagent": code review. | Reviewer beside the gate, same model. "never saw the build" at the reviewer. | E |
| 2 | It finds one thing: a refund doesn't free the door's count. | Subagent done. | `bad` puck back. "1 found" at the reviewer. | App `/sales`: refund doesn't drop "Expected at the door". |
| 3 | Fresh eyes, but the same model: it tends to miss what the builder missed. | Reply. | "same model, same blind spots" at the reviewer. | E |

### 12.2 A different model reads it

**Request:** Have GPT-6.2 Sol review the checkout. Find the three most likely ways it's wrong, and show how to see each one fail. Skip style.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The thread hands the review to Codex with GPT-6.2 Sol, in a thread of its own. | `Created thread`; child row "Review: checkout · GPT-6.2 Sol". Lead **Waiting**. | Reviewer turns model `b`. Change and brief go to it, not the window. | E |
| 2 | It finds a race: two phones can buy the last ticket at once. | | `bad` puck. "the last ticket, sold twice" at the reviewer. | App: two phones, both "You're in", 401 of 400. |
| 3 | And a refund paid twice when the button is tapped twice. Each comes with a way to see it fail. | Child Done. Lead Working. | Two findings at the gate. | E |
| 4 | The builder fixes both, and adds a test for each. | `Changed 3 files`, `Ran command` (ok). | Gate `ok`. | App: second phone "Sold out". |

### 12.3 Tell it when to stop

**Request:** Review it again.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Round three. Nothing breaks any more. It still finds things: a name, a comment, an import order. | Child reply: 5 style notes. | Style pucks, `model`. "always finds something" at the reviewer. | E |
| 2 | A reviewer asked to find problems will always find some. Fixing taste can go on for ever. | | "round 3: only taste" at the gate. | E |
| 3 | The rule goes in the brief: only what breaks, three rounds at most. | Your next request names the rule. | Gate `ok`, reply through. | E |

### 12.4 Two models, one prompt

**Request** (new thread, two models selected): Redesign the ticket page for the birthday night. It must stay usable with one hand.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | In a new thread you Shift-click two models. The same prompt goes to each, in its own thread and worktree. | Two rows: "Ticket page · Opus 5.5", "Ticket page · GPT-6.2 Sol". | `jobs(2)`, j1 model `b`. "one prompt, two models" at the jobs. | E |
| 2 | Two designs come back. | Both Done. | Two cards `wait`. | App: design A. |
| 3 | You look at both. | | | App: design B. |
| 4 | You keep one and close the other. Its worktree goes with it. | Reply in the kept thread. | j1 off. "you choose" at you. | App: the kept design. |

**Facts.** `harnesses.claudeCode.codeReview`, `harnesses.claudeCode.sameModelReviewer`, `harnesses.claudeCode.reviewerAlwaysFinds`, `t3code.delegate`, `t3code.crossProvider`, `t3code.manyModels`, `t3code.waitingOnChild`.

**After lesson 12 the reader can** get a review from a window that never saw the build, choose a different model when blind spots matter, brief a reviewer to show failures and skip style, stop the rounds, and compare two models' builds of the same prompt.

---

## Lesson 13, A fleet

**Story beat.** Friday 12:00, eleven hours before the birthday night. Every page of the app should work at phone size, in light and dark, and by keyboard: 24 pages, three checks each.

v1 mechanism: `team.ts` "fleet". Starting state: `team(12, { mgate: true, mixed: true })` with a plan meter beside the lead. Thread details show Usage limits (`ui.usage`, an example label and number).

### 13.1 Twelve at once

**Request:** Before tonight, check every page at phone size, in light and dark, and by keyboard. Fix what's broken. Use small, fast helpers for the checking. *Done when* every page passes and you've shown me the pages you changed.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The lead lists 24 pages. | `Searched page in src/pages`. | "24 pages × 3 checks". | App `/checks` (waiting) |
| 2 | Twelve helpers on Haiku 5.5, two pages each. | "12 subagents · 12 working" (closed group, opens on click). | Twelve briefs out. | |
| 3 | Each checks and fixes its two pages. | Counts move. | Some lamps `ok`. | App (running) |
| 4 | Nine minutes later, twelve three-line reports. Nine pages fixed. | "12 done". | Reports back; meter drops. | App (checked) |
| 5 | Reply: nothing on main yet. | Reply. | | |

### 13.2 One plan pays for all of them

**Request:** Run the checks once more with every helper on Opus 5.5, to be sure.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Twelve helpers on the big model, all from one plan. | Group row. | "12 helpers, one plan" at the meter. | |
| 2 | The plan drains much faster. | Usage limits "Weekly: 22% left" (example). | Meter low. | |
| 3 | Nine in, the plan runs out: Limited. | Lesson row **Limited**. | Meter empty, three helpers `bad`. | |
| 4 | Resume at reset (or switch provider). It finishes and finds nothing new. | Reply. | Meter refilled. | |

### 13.3 Twelve reports, one reader

**Request:** Before main, run the door check and every test on all of it together.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Twelve reports sit in the lead's window; short because the brief said three lines. | Context 24%. | "12 reports in its window". | App (checked) |
| 2 | The check in front of main fails: do-not-admit is orange. | `Ran command` (bad). | Check `bad`. | App (red) |
| 3 | The helper's brief said "fix contrast", not "red is reserved". The check knew. | | "its brief: “fix contrast”" at the helper. | |
| 4 | Sent back with the rule, fixed, checked, merged. Reply. | One subagent row, `Changed 9 files`, `Ran command` (ok). | Check `ok`, commit. | App (done) |

### 13.4 More isn't always faster

**Request:** Which pages should I look at myself?

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | You can't read every change. You ask what to read. | | "one reader" at you. | App (done) |
| 2 | Six pages that changed most, marked "look". | Reply. | "six to look at". | |
| 3 | A fleet suits many small, separate jobs, each with a check. | | Lamps `ok`. | |
| 4 | Without a check, or on one big question, more agents make more work: one public case (an observation) of 600+ subagents and a 1,000-line change grown past 20,000. | | "observation: one case". | |

**Facts.** `harnesses.claudeCode.smallSubagentModel`, `harnesses.claudeCode.subagentModel`, `harnesses.claudeCode.subagentUsage`, `plans.claude.limits.subagentsDraw`, `harnesses.codex.subagents`, `harnesses.codex.maxThreads`, `t3code.screen.usageLimits`, `t3code.limited`, `t3code.screen.subagentStates`, `observations.experience.parallelThreads`, `observations.estimates.theo-2026-11-16-council-runaway.fact`, `observations.estimates.theo-2026-10-09-haiku-fanout.fact` (both observations, labelled in prose).

**After lesson 13 the reader can** say which jobs suit a fleet, keep it affordable with small models and short reports, rely on a check in front of main, and stay the one who reads what matters.

---

## T3 Code pieces this chapter shows

| Lesson | Piece | Sourced? |
|---|---|---|
| 9 | "{n} subagents" row, a row per subagent: "Running", "Completed", "Failed"; summary "{count} working · {count} done · {count} failed" | `screen.subagents`; new `screen.subagentStates`, `screen.subagentRow` |
| 9 | Parent row says Approval when a subagent waits for approval | New: `subagentRequests` (`Sidebar.logic.ts`, `resolveSidebarThreadStatus`) |
| 9 | Permission chip Supervised | `screen.permissionChip` |
| 10 | Several threads Working at once, each in its own worktree | `worktrees`, `branchPrefix` |
| 11 | "Delegated {count} tasks"; child threads inside the parent's view, not in the sidebar | New: `screen.delegatedRow`, `delegateChild` |
| 11 | Lead row Waiting while blocked on a child thread | New: `waitingOnChild` (`Sidebar.logic.ts`) |
| 12 | One prompt to two models, two threads and worktrees | `manyModels` |
| 13 | Usage limits in thread details | `screen.usageLimits` |
| 13 | Limited | `limited`, `screen.statuses` |

Not drawn, because the real app doesn't do it or the source doesn't say: subagents as sidebar rows (they aren't); "Woke" for a delegated result (Woke is the snooze status); a built-in review button (none found).

## Open questions

1. Lesson 10 asks the agent to merge branches with Git commands. T3 Code's own source-control actions (commit, push, pull request) are built in, but the docs don't describe merging one worktree into another. The script keeps merging as something the agent does in a thread.
2. Lesson 13's "Session: 62% left" uses the usage-limits row's format with a made-up label and number.
