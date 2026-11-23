# Guide v2: lessons 3 to 8 as scripts

Design only. Nothing here is built yet. It continues [the brief](BRIEF.md) and the two lessons that already exist as data (`site/src/v2/content.ts` in the Guide v2 worktree). It follows their shape: each part has a request, a lede, points (a scene state, moves and a "say" line), work-log rows per point, an answer and a try-it.

**Everything about the club is made up.** That covers the Lantern, its staff, promoters and guests, every name, time, count, phone number and percentage in a reply, and every context-window percentage. The scripts show behaviour that the sources describe. They are not records of real runs.

Conventions in the point tables:

- **Chat** is what the lesson thread shows at that point: the request, work-log rows in T3 Code's words, inline thread summaries, panels above the composer, and status changes in the sidebar.
- **Explainer** is the picture, drawn with v1's engine (`picture.ts`, `presets.ts`), with at most two annotations. Annotations are in quotes.
- **Browser** is the right-hand panel. **E** means the explainer is in front. **App** means the club's app at 390 px, with the page path. **Page** means a file or web page.
- Work-log rows use only words from `t3code.screen.workLog`, `workLogGroups` and `workedFor`. A row marked *(new fact)* uses a label from T3 Code's source that `t3code.ts` does not hold yet.

---

## The Friday: one page

One club, one Friday, one owner (the reader, "you"). Doors open at 23:00. Each lesson ends with the app a little further along and a habit the reader didn't have before.

| Time | Lesson | What happens at the Lantern | What the app has afterwards |
|---|---|---|---|
| Thu 22:00 | 1 Say what you want | You ask who hasn't confirmed. Without the list it invents names. With the list it answers from the rows. | Nothing yet. A text to send. |
| Fri 09:00 | 1, part 3 | In a new thread the list is gone. | |
| 10:00 | 2 It gets hands | The door page: type a name, tap them in. It says done without running anything, then runs your three cases. | `/door` |
| 11:30 | 3 Done when | Promoters Kai and Noor each get a link to add guests up to a limit. A must-never catches a leak between promoter lists. All checks pass, yet Kai's 20 guests bring 9 plus-ones, because nobody wrote down that plus-ones count. A `/goal` keeps the agent going until they do. | `/p/<link>`, `/promoters` |
| 13:00 | 4 Start another | While the promoter thread works, you start a bar thread (Bea: "we ran out of lime last Friday") and then a rota thread. You queue a rule into the promoter thread while it runs: a guest's phone number never shows at the door. Two threads in one folder break each other's test runs until the second moves to a new worktree. | `/bar`, `/rota` |
| 16:00 | 5 The window fills | The promoter thread has run since 11:30. Asked to let door staff reach late guests, it puts phone numbers on the door screen. Your 13:00 rule is still in the window, and it isn't followed. Compacting keeps what was done and drops the rule you said in passing. A fresh thread with a short brief gets it right. | late-guest list, without numbers |
| 17:30 | 6 Write it down | You've typed the phone rule three times. The Lantern's `AGENTS.md` now loads before every thread's first word. One correction becomes one line in the file. The file stays short, and the long door-check steps become a skill. | `AGENTS.md`, `door-check` skill |
| 19:00 | 7 Your turn | Sami at the door calls. A guest who started a fight last Friday is on Noor's list tonight. You need a do-not-admit list. The agent asks before it touches the live list. It asks whether to hide or flag. It shows a plan before it builds. Last, it asks everything at once, then runs without stopping. | do-not-admit, shown in red |
| 21:00 | 8 Proof you can read | Before you hand Sami the phone: "Done." tells you nothing. A request for proof brings a summary, check output and the door at phone size. A reply that says "all pass" disagrees with its own work log. The last check is you, tapping through the door yourself. | the door, tried by you |
| 23:00 | | Doors open. | |

Recurring cast (all made up): Sami (door), Bea (bar), Kai and Noor (promoters), Ana Lopez and Lea Brandt (guests), "Zed" (not on the list), Rico Vance (do-not-admit). Ana, Zed and the 22:41 check-in already appear in lesson 2.

Two threads carry the story across lessons, so later failures have a cause the reader saw. The **promoter thread** starts in lesson 3, takes the queued phone rule in lesson 4, and fills up in lesson 5. The **phone rule** is planted in 4.2, lost in 5.2, carried by a brief in 5.4, and written down in 6.2.

---

## Lesson 3, Done when

**Story beat.** 11:30: promoters Kai and Noor will add their own guests from now on, and you write down what done means, including what must never happen.

v1 mechanism: `check.ts` (a gate between the agent and you that sends broken work back, plus the flaw no check catches because nobody wrote it down). Starting state: `solo({ tools: true, project: true, gate: true })`, the same as lesson 2 part 4, so the gate is already familiar.

### 3.1 A check that stays

**Request.** Each promoter gets their own link to add guests for Friday, up to the limit I set for them. *Done when* you've tried it at phone size with made-up promoters: a promoter can add guests until the limit and the next one is refused, and their guests show up at the door.

**Lede.** One request the size of a product slice, with two checks in its done-when.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Your done-when has two checks in it. It writes them down first, as tests in the project. | Request. `Searched files`: where guests and the door live. | Request puck into the window. Gate lamp off. "your done-when: 2 checks" on the gate. | E |
| 2 | It builds a page per promoter, a limit for each, and a tag on each guest saying who added them. | `Read 3 files`, `Changed 4 files`. | Pucks to read and edit. Three file tiles `edit`. | App `/p/kai`: "Kai · Friday · 0 of 20", an Add guest button. |
| 3 | It runs both checks. The second fails: Kai's guests aren't at the door. | `Ran command` (bad): "Kai's guests missing at the door". | Puck to run, back `bad`. Gate lamp `bad`. "1 of 2 pass". | App `/door`: search "lea" → "Not on tonight's list". |
| 4 | It fixes the door search and runs both again. Both pass. | `Changed files`, `Ran command` (ok). | Gate lamp `ok`. File tile `ok`. | App `/door`: "Lea Brandt · Guest of Kai". |
| 5 | The checks stay in the project, and every later change runs them again. | Reply. `Worked for 6m 40s`. | Reply through the gate. "promoters.test.ts: stays" on the file tile. | App `/p/kai`: "20 of 20 · Your list for Friday is full". |

**Answer.**

> Each promoter now has their own link. It shows Friday, how many of their spots are left and an Add guest button. You set each promoter's limit on the new Promoters page.
>
> I tried it at 390 px with two made-up promoters. Kai, with a limit of 20, added 20 guests, and the 21st was refused with "Your list for Friday is full". Kai's guests show at the door as "Guest of Kai". My first version left them off the door list, and the second check caught it.
>
> Both checks are now tests in the project, so the next change runs them too.

**By level.** *Technical:* rows name `src/promoters.ts`, `src/p/[link].tsx`, `promoters.test.ts`, and "npm test: 12 of 12". *Engineer:* the limit is enforced in `addGuest()` on the server, not only by disabling the button. The run is Playwright `door.spec` at 390×844 plus vitest. The answer adds one line saying where the limit is enforced.

**Try it.** "Each [person] gets their own link to [add things] up to a limit I set. Done when you've tried it with made-up people: they can add until the limit, the next one is refused, and what they add shows up where I need it." **In T3 Code:** expand the last `Ran command` row and find a test named after each part of your done-when.

**Facts.** Existing: `claims.lessons.featureRequest`, `claims.lessons.runChecks`, `claims.lessons.toolCallEvidence`, `harnesses.claudeCode.checkToRun`, `t3code.screen.workLog`, `t3code.screen.workLogGroups`, `t3code.screen.workedFor`. New: none.

### 3.2 Must never

**Request.** Same as 3.1, and: *It must never let a promoter see another promoter's guests.*

**Lede.** A must-never is a check too. The agent has to work out what breaking it would look like.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A must-never is a check too. First it works out what a leak would look like. | Request. `Searched files`. | Request in. A second annotation on the gate: "must never: 1 check". | E |
| 2 | It writes the test before the fix: open Noor's list using Kai's link. | `Changed files`: the new test. | Puck to edit. Test file tile `edit`. | E |
| 3 | The test fails. Change one character of Kai's link and Noor's list opens. | `Ran command` (bad): "with Kai's link changed by one character, Noor's guests show". | Gate `bad`. "leak found" on the gate. | App `/p/kai` with one character changed shows Noor's list, outlined red and marked "the leak, made up". |
| 4 | It makes links long and random, and checks who's asking on every request. The test passes. | `Changed 2 files`, `Ran command` (ok). | Gate `ok`. | App, same changed link: "This link doesn't open a list." |
| 5 | Your earlier checks still pass. The reply says what was checked and what wasn't. | `Ran 2 commands` (ok). Reply. | Reply through the gate. "3 checks pass" at you. | App `/p/noor`: Noor's own list. |

**Answer.**

> Promoters can only open their own list. Links are now long random codes, and every request checks that the link belongs to the promoter asking.
>
> I tried it at 390 px. With Kai's link changed by one character, the page says "This link doesn't open a list". Before the fix it opened Noor's list. That check now runs with all the others.
>
> Not covered: anyone who gets hold of Kai's real link can see Kai's list. If promoters forward links, they'll need to sign in. Should I add that?

**By level.** *Technical:* the log says links were numbered (`/p/7` → `/p/8`). *Engineer:* sequential ids (an insecure direct object reference) were replaced with 128-bit tokens and a server-side ownership check. The test asserts a 404 for another promoter's token. An optional `deeper` line can cite the DryRun study, but only with its scope in the same sentence (sequential PRs to two apps, scored with the company's own tooling) and never as a general rate.

**Try it.** "… It must never let one [person] see another's [data]. Prove that with a test that tries." **In T3 Code:** in the work log, find the row where the must-never test first failed. That row shows the check works.

**Facts.** Existing: `claims.lessons.featureRequest`, `claims.lessons.toolCallEvidence`. New, optional and engineer-only: `claims.lessons.agentPrVulns` (26 of 30 PRs, status verified, with a scope note), source https://www.dryrun.security/the-agentic-coding-security-report. The recheck verified it with scope.

### 3.3 What nobody wrote down

**Request.** Show me where each promoter's list stands for Friday. *Done when* I can see, per promoter, the guests added, their limit and how many have arrived, at phone size.

**Lede.** Every check passes. You still find a problem by looking.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It builds the overview and runs every check, old and new. All pass. | `Read 2 files`, `Changed 2 files`, `Ran command` (ok): "14 of 14". | Gate `ok`. | App `/promoters`: "Kai 20 / 20 · 9 plus-ones · 0 in", "Noor 12 / 15 · 4 plus-ones · 0 in". |
| 2 | You look. Kai's 20 guests bring 9 plus-ones, so 29 people come in on a limit of 20. | Reply arrives (see below). | Reply puck passes the gate `ok` and turns `bad` at you. "you meant 20 people" at you. | App: the "9 plus-ones" cell highlighted. |
| 3 | No check caught it, because no check said it. The gate only knows what you wrote down. | | Gate still `ok`. "passed: nobody asked" on the gate. | App, unchanged. |
| 4 | One sentence would make it a check: a plus-one counts toward the limit. The next request carries it. | The composer gets your next sentence (unsent). | A new slab waits at you, colour `you`. | E |

**Answer** (as the agent gives it, without noticing the gap):

> The overview is at /promoters. It has one row per promoter: guests added, their limit and how many have arrived. It updates when the door taps someone in.
>
> I tried it at 390 px with made-up data. All 14 checks pass, including the ones from your last two requests.

**By level.** *Technical:* `deeper` says that adding "list anything you had to assume" to the request would probably have surfaced it, which lesson 7 shows. *Engineer:* `deeper` notes the ambiguity sits in the data model: `limit` counts `Guest` rows, not heads. A test can only assert the reading it was given.

**Try it.** "… Before you say done, list anything you had to assume." **In T3 Code:** open the app in the browser panel and look at the result yourself before reading the reply.

**Facts.** Existing: `harnesses.claudeCode.bestPractice` ("knows what done looks like"). New: none. This part is a design point drawn from v1's `check.ts` (the "spec" flaw).

### 3.4 Keep going until done

**Request.** `/goal` Plus-ones count toward each promoter's limit, and every promoter check passes at phone size with made-up promoters.

**Lede.** A goal is a done-when that stays set. The agent keeps working, turn after turn, until it judges the goal met.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A goal is a done-when that stays set. The thread's row says Goal while it works. | Sidebar status **Goal** *(appears, highlighted)*. A goal line at the end of the thread *(new fact; drawn as an example)*. | Gate lamp `wait`. "goal: stays set" on the gate. | E |
| 2 | Turn one: it makes plus-ones count, then runs the checks. Two older checks fail. Kai is already over. | `Changed files`, `Ran command` (bad): "2 failed: lists already over the limit". | Gate `bad`. "turn 1" at the agent. | App `/promoters`: "Kai 29 / 20". |
| 3 | It doesn't stop at the end of the turn. It checks the goal, sees it isn't met, and starts again. | `Worked for 3m 10s`, then new rows begin underneath. The status stays Goal. | Puck back to the agent, not to you. "turn 2". | E |
| 4 | Turn three: every check passes. It judges the goal met, and the row goes to Done. | `Ran 2 commands` (ok). Status **Done**. | Gate `ok`, reply through to you. | App `/promoters`: "Kai 29 / 20 · full until 9 drop out". |
| 5 | "Met" is its own judgement. The checks you wrote are what make that judgement worth something. | Reply. | "met: by its judgement" at the agent. "by your checks" on the gate. | App |

**Answer.**

> Goal met. Plus-ones now count toward each promoter's limit, and all 15 checks pass at 390 px with made-up promoters.
>
> Kai was already over: 20 guests and 9 plus-ones on a limit of 20. I left all 29 on the list and blocked new adds until Kai is under 20. If you'd rather drop the most recent ones, tell me.
>
> It took three turns. My first change broke two older checks, and the goal kept me going until they passed.

**By level.** *Technical:* turns are separated by `Worked for …` lines, each with its own rows. *Engineer:* `deeper` explains that `/goal` works with Codex, Claude and OpenCode 2.2.5 or later. Stopping Claude ends the turn and leaves the goal set. Stopping Codex pauses it, and so does Codex ending its work with the goal unmet. The choice about Kai's existing guests is the kind of call lesson 7 says to ask about rather than make. The agent made it, and said so.

**Try it.** `/goal [what done means, as checks]`. **In T3 Code:** send `/goal` on its own to see the current goal, and `/goal clear` to remove it.

**Facts.** Existing: `t3code.screen.statuses` (Goal, Done). New: `t3code.goal`, covering what `/goal` does, the Goal status, the goal line and per-provider behaviour. Source: https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md#goals (read on 2026-11-22: "With Codex, Claude, and OpenCode 2.2.5 or later, send `/goal` …", "The thread shows **Goal** while it works").

**After lesson 3 the reader can** write a request with a done-when someone could check and a must-never someone could test, spot that "all checks pass" covers only what was written down, and leave a goal set so the agent keeps going without them.

---

## Lesson 4, Start another

**Story beat.** 13:00: the promoter thread is still working on its goal. Bea texts that the bar ran out of lime last Friday. You don't wait for the promoter thread.

v1 mechanism: `jobs.ts` (several jobs in a row, one of you, a tray with a card per job) for the threads, and the `trees` / `tree: 'bad'` marks from `team.ts` for the clash. Starting state: `jobs(1, { projects: 'one' })`, growing to `jobs(2)` and `jobs(3)`.

Chat in this lesson relies on the **inline thread summary**, the owner's new chat element: a compact card per story thread with its title, status and last work-log line. The story threads are made up and marked "example". (Open question 2 asks whether they also appear in the sidebar.)

### 4.1 Don't watch it work

**Request** (in a new thread): When the bar runs low on something, staff tap it on their phone and I get one list to order from in the morning. *Done when* you've tried it at phone size: a tap adds the item once, and the list shows who tapped and when.

**Lede.** One thread is working. You start the next one.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The promoter thread is working. You could watch its log. Start a second thread instead. | Thread summary: "Promoter links · Goal · Ran command". | `jobs(1)`: j0 lamp `work`, its tray card `work`. "promoter links: working" at j0. | E |
| 2 | Cmd+Enter sends it in the background and opens a fresh composer. | Your request, sent. A second summary: "Bar running low · Working". The fresh composer is highlighted. | `jobs(2)`: both lamps `work`, two cards `work`. | E |
| 3 | Working threads fold into the sidebar's Working section. Nothing there needs you. | Sidebar: "Working 2", collapsed *(appears, highlighted)*. | You stand still. "nothing needs you" at you. | E |
| 4 | Each thread has its own window. The bar thread knows nothing about promoters. | | Two windows with different slabs. "its own window" at j1's window. | E |
| 5 | The bar job is smaller and finishes first. Its row comes back to the top of the list as Done. | Bar summary: **Done**, `Worked for 5m 15s`. The promoter thread is still in Working. | j1 lamp `ok`, its card `wait` (ready to check). j0 still `work`. | App `/bar`: "Running low" buttons: Lime, Tonic, Ice, Ginger beer. |

**Answer** (the bar thread's reply):

> Staff can now open /bar and tap whatever is running low. Each item shows who tapped it and when, and a second tap on the same item tonight doesn't add it twice. Tomorrow morning, /bar/order shows tonight's list in one place.
>
> I tried it at 390 px with made-up staff: Bea tapped Lime at 23:12, then tapped it again, and it stayed one line, "Lime · Bea · 23:12".

**By level.** *Technical:* the summary cards show the last row's detail ("npm test: 6 of 6"). *Engineer:* `deeper` says each thread is its own provider session with its own context window, so nothing from the promoter thread reaches the bar thread.

**Try it.** Start a second request while your first is still running. **In T3 Code:** press mod+Enter (Cmd on macOS, Ctrl elsewhere) in a new thread to send it in the background and open another draft.

**Facts.** Existing: `t3code.shortcuts.background`, `t3code.screen.sections`, `t3code.screen.statuses`, `t3code.newThreadCarries`. New: `t3code.workingSection`. Working threads fold into a collapsed Working section, and a thread returns to the top of the active list "when it finishes, fails, or needs an approval or answer". It is on by default (beta). Source: https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md#fold-working-threads-beta

### 4.2 Queue it while it works

**Request** (queued into the promoter thread while it is still working): Promoters also enter a phone number for each guest, so we can reach them. *It must never show on the door screen.*

**Lede.** You think of something while the promoter thread is busy. You don't wait for it to finish, and you don't interrupt it.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | You think of something for the promoter thread while it works. Type it now. | Promoter thread's composer: your message, shown as queued *(the queue/steer control appears, highlighted)*. | A `you` puck rests on the floor before j0 (`rest`). "queued" beside it. | E |
| 2 | Queued, it waits for the current turn to end. Steer would hand it over now, if the provider supports it. | | j0 keeps working. The resting puck stays put. | E |
| 3 | The turn ends and your message goes in. It works it into the same thread. | Promoter summary: `Changed 3 files`, `Ran command` (ok). | The resting puck moves into j0's window. | App `/p/kai`: the add form gets a Phone field. |
| 4 | The door screen doesn't show the number. Your must-never became a test. | Reply. Promoter summary: **Done**. | j0 card `wait`. "phone: never at the door" on j0's window, a small slab low in the stack. | App `/door`: "Lea Brandt · Guest of Kai", no number. |

**Answer** (the promoter thread):

> Promoters now enter a phone number with each guest. It appears on the promoter's own list and the Promoters page, never on the door screen.
>
> I added a test that searches the door page for every made-up guest's number and fails if one appears. All 16 checks pass.

**By level.** *Technical:* the log shows the queued message landing after `Worked for …`. *Engineer:* `deeper` says steering needs provider support, while queued messages can be edited or removed before they send.

**Try it.** While a thread works, type the next thing you need and queue it. **In T3 Code:** while an agent works, mod+Enter uses the other follow-up action, Queue or Steer, for one message.

**Facts.** Existing: `t3code.queueSteer`, `t3code.shortcuts.opposite`, `harnesses.claudeCode.queue`, `harnesses.codex.queue`. New: none.

*(This part plants the phone rule that lesson 5 loses. The annotation in point 4 marks where it sits in the window.)*

### 4.3 Same folder, same files

**Request** (third thread, same checkout as the bar thread's follow-up): Make tonight's rota: who works the door and the bar, and when. *Done when* each staff member can open their own shift on their phone.

**Lede.** Two threads working in one folder change the same files.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | You start the rota thread in the same folder, while the bar thread works on a follow-up. | Two summaries: "Bar running low · Working", "Rota · Working". | `jobs(2, { projects: 'one', trees: false })`: both pucks head for the one project. | E |
| 2 | Both edit the app's menu file. The rota thread saves a half-done change. | Rota: `Changed files`. | Both pucks land on the same file tile, marked `bad`. "same file" at the tile. | E |
| 3 | The bar thread runs its checks and they fail on the rota thread's half-done code. | Bar: `Ran command` (bad): "build failed in rota.tsx, not part of this job". | j0 back `bad`. "not its fault" at j0. | App: a build-error screen in place of `/bar`. |
| 4 | A new worktree gives each thread its own copy of the project and its own branch. | The rota thread restarted in **New worktree**. A branch chip "t3/rota-…" appears *(highlighted)*. | `trees: 'own'`: a copy beside each job. "own copy" at j1's tree. | E |
| 5 | Now each thread's checks see only its own changes. Bringing them back together is a later lesson. | Both: `Ran command` (ok). | Both lamps `ok`. | App `/rota`: "Sami · Door · 22:00–04:00". |

**Answer** (the rota thread):

> The rota is at /rota. Each person opens their own shift with their name, and the day view shows the whole night.
>
> I'm working in a separate worktree on branch t3/rota-tonight, so my changes don't touch the bar work. I tried it at 390 px with made-up staff. Both are ready to merge whenever you want.

**By level.** *Technical:* rows show the failing build path. *Engineer:* `deeper` says threads in one checkout share its branch, so T3 Code refuses a branch switch there while any of them is working. A worktree is a second working directory on its own branch.

**Try it.** Start the next independent job in its own worktree. **In T3 Code:** choose New worktree in the new thread before you send.

**Facts.** Existing: `t3code.worktrees`, `t3code.branchPrefix`, `t3code.worktreeFolder`. New: `t3code.sameCheckout` ("Use a new thread for a separate task. Choose New worktree when its code changes need a separate branch and working directory. Threads in the same checkout share its branch…"). Source: https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md

### 4.4 How many at once

**Request** (a fourth thread): Write tonight's post for the club's account: the line-up, doors at 23:00, guest list closes at 00:30. *Done when* it fits one screen and names nobody from the guest list.

**Lede.** More threads don't give you more of yourself. The limit is how many results you can read.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Four threads now. Three come back at about the same time. | Three summaries go Done at once. | `jobs(4)`: three cards `wait`, one `work`. | E |
| 2 | There is one of you. While you read one result, the other two wait. | | You walk to one card. The other two stay `wait`. "waiting on you: 2" at the tray. | E |
| 3 | A title like "fix" means opening the thread to find out what it is. A title that says the job doesn't. | Sidebar rows: "Promoter links", "Bar running low", "Rota", "Tonight's post". A ghost version shows them as "fix", "new thread". | Cards with clear labels, toggling to vague ones (the `board: 'vague'` mechanism). | E |
| 4 | Results that carry their proof are quick to read. A bare "Done." takes longer. That comes back in lesson 8. | Post summary: "Done: fits one screen, no guest names". | Short stop at each card. | Page: the post as text. |

**Answer** (the post thread):

> Here's tonight's post. Line-up, doors at 23:00, guest list closes at 00:30. It's 61 words, fits one phone screen and names no guests.

**By level.** *Technical and engineer:* `deeper` (observation, labelled as such): in the guide's own use, past three to five parallel threads the agents start waiting on you and review quality drops.

**Try it.** Name each thread for its job. **In T3 Code:** rename a thread from its menu so the sidebar says what each one is for.

**Facts.** Existing: `observations.experience.parallelThreads` (status observation, must be labelled in prose). New: none. Thread rename is in the sidebar docs. Add it as a fact only if the lesson draws the menu.

**After lesson 4 the reader can** start a second job without waiting for the first, add information to a running thread without stopping it, keep separate jobs in separate worktrees, and judge when another thread would only add to the queue in front of them.

---

## Lesson 5, The window fills

**Story beat.** 16:00: the promoter thread has run since 11:30, and when asked to help Sami reach late guests it puts their phone numbers on the door screen.

v1 mechanism: `window.ts` (the pile, rot with the same request against different windows, compaction versus a fresh thread, pasting less). Starting state: `solo({ tools: true, project: true })` with a deep stack of `worked(…)` slabs and the phone-rule slab low down. Window sizes stay relative. The thread-details percentage is the number on screen.

Honesty point for the whole lesson, from `harnesses.claudeCode.focusedContext`: on 1M-token windows, running out completely is rare. The usual problem is crowding, which comes well before overflow. The lesson says so.

### 5.1 Everything stays in

**Request** (in the promoter thread): Show me tonight's numbers so far. *Done when* I see, per promoter, guests added, plus-ones and arrived.

**Lede.** A small question to a thread that has worked all day.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Everything since 11:30 is still in this thread's window: every request, every file it read, every test log. | Thread details: "Context window · 71% used" *(highlighted; first shown in lesson 1)*. | The pile, run quickly: slabs stacking in the window. "since 11:30: all of it" at the window. | E |
| 2 | Before every turn, the model reads all of it again. | | `scan: true`, slabs flashing in turn. "read again every turn". | E |
| 3 | Your phone rule from 13:00 is one short slab, under hours of test output. | | Label at that slab: "your phone rule". | E |
| 4 | It answers. It works, and the window is fuller still. | `Read file`, `Ran command`. "Context window · 84% used", the row turns amber. | Lamp `wait`. | App `/promoters` with the numbers. |

**Answer.**

> Friday so far: Kai has 20 guests and 9 plus-ones, 0 in. Noor has 12 guests and 4 plus-ones, 0 in. Doors haven't opened, so arrivals are all zero.

**By level.** *Technical:* `deeper` says the percentage counts tokens in this thread's window. *Engineer:* `deeper` says each turn sends the whole conversation again, and prompt caching makes rereading cheaper but not free (`harnesses.claudeCode.promptCacheTtl`).

**Try it.** Look at how full your longest thread is. **In T3 Code:** turn on Context window in Settings → Appearance → Thread details. It appears once the provider reports usage.

**Facts.** Existing: `t3code.screen.contextWindow`, `models.claude-opus-5-5.context`, `harnesses.claudeCode.startupContext`, `harnesses.claudeCode.focusedContext`. New: `t3code.contextSetting` (how to switch it on), source https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md. New: `t3code.contextTones` (warning at 80% used, error at 90%, a tick marks the auto-compaction point), source https://github.com/pingdotgg/t3code/blob/main/apps/web/src/components/chat/ThreadDetailsUsage.tsx. Read in source on 2026-11-22. Verify before drawing.

### 5.2 In the window isn't the same as followed

**Request** (in the same thread): Let Sami reach promoter guests who haven't arrived by midnight. *Done when* it takes two taps from the door page.

**Lede.** The request doesn't repeat the rule. It's still in the window, said once at 13:00.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The request goes on top of a full window. | Request. "Context window · 86% used". | Request slab on top of the pile. | E |
| 2 | It builds a late-guests list with a Call button. The number shows on the door screen. | `Changed 2 files`. | Puck to edit, file tile `bad`. "door page" at the tile. | App `/door/late`: "Lea Brandt · Guest of Kai · +43 660 000 0000 · Call" (an obviously fake number). |
| 3 | Its checks pass. The phone test from 13:00 checked the guest search, not this new list. | `Ran command` (ok): "17 of 17". | Gate not drawn. Lamp `ok` at the agent, the puck to you turns `bad`. | App, unchanged. |
| 4 | Your rule is still in the window. It wasn't followed. | Reply. | The rule slab flashes. "still in the window" at the slab. "not followed" at the file tile. | App: the number highlighted red. |

**Answer.**

> Done. /door/late lists promoter guests who haven't arrived by midnight. Tap one, then Call. That's two taps.
>
> I tried it at 390 px with made-up guests. All 17 checks pass.

**By level.** *Technical:* `deeper` says the 13:00 test covered the search results and not new pages, so the must-never was only as wide as its test. *Engineer:* `deeper` cites context rot (`claims.research.contextRot`): recall falls as the window grows. It's a tendency, not a certainty, and a shorter window would have made this less likely, not impossible.

**Try it.** In a long thread, ask for something that touches a rule you gave early on, and check whether it held. **In T3 Code:** open thread details and note the Context window percentage before you send.

**Facts.** Existing: `claims.research.contextRot`, `t3code.screen.contextWindow`. New: none.

### 5.3 Compact, or start over

**Request** (in the same thread): Take the phone numbers off the door screen. Sami calls from the promoter's list instead. *It must never show a guest's phone number at the door.*

**Lede.** The window is close to full. Two ways to make room, and what each one keeps.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | 92% used. The row turns red. | "Context window · 92% used" (error tone). | `spill` off, stack at the cap, lamp `bad`. | E |
| 2 | `/compact` swaps the whole conversation for a summary, plus a few files read again. | You send `/compact`. | The stack collapses to one `sum` slab and a few `tool` slabs. "a summary" at the `sum` slab. | E |
| 3 | The summary keeps what was built. The rule you said in passing at 13:00 is gone. | "Context window · 9% used". | The rule slab is gone. "13:00 rule: gone" at the window. | E |
| 4 | This time your request carries the rule, so it holds, for this turn. | `Changed files`, `Ran command` (ok). | Lamp `ok`. | App `/door/late`: names and "Ask Kai to call", no numbers. |
| 5 | `/clear` would start a new session in the same thread, with nothing carried over. A new thread does the same. | A ghost "New session" marker shows what `/clear` would look like. | Toggle: the window empty except a `you` slab. | E |

**Answer.**

> The door screen no longer shows any phone numbers. /door/late now says which promoter to ask, and the promoter's own list has the number.
>
> I widened the phone test: it now loads every door page, not only the search, and fails if any made-up guest's number appears. All 18 checks pass.

**By level.** *Technical:* `deeper` says compaction is lossy: it keeps a summary, not your exact words. *Engineer:* `deeper` says Claude Code's compaction re-injects the project-root CLAUDE.md from disk and re-reads up to five recently used files (`harnesses.claudeCode.compactionKeeps`). A rule kept in that file survives compaction. That is lesson 6.

**Try it.** When a thread is close to full, finish the job in a fresh one rather than pushing on. **In T3 Code:** send `/compact` to shrink a long thread, or `/clear` to start a new session in the same thread.

**Facts.** Existing: `harnesses.claudeCode.compactionKeeps`, `harnesses.claudeCode.compactionReread`, `harnesses.claudeCode.autoCompactAt`. New: `t3code.compact` ("Send `/compact` … to reduce context usage when the provider supports it") and `t3code.clear` ("Send `/clear` … to start a fresh session in the same thread … the thread marks where it began with **New session**"). Source for both: https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md

### 5.4 One job, one thread

**Request** (new thread, with a short brief): Add a "running late" button to the promoter page, so a promoter can tell the door their guest is late. *Done when* the door's late list shows it. *It must never show a guest's phone number at the door.*

**Lede.** A new thread, with only this job and a two-line brief in it.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A new thread. Its window holds your brief and nothing else. | "Context window · 3% used". | An empty window, then one `you` slab. "your brief: 2 lines" at it. | E |
| 2 | It reads the few files this job needs. | `Searched files`, `Read 3 files`. | A few `tool` slabs. | E |
| 3 | It builds, runs the checks and follows the rule, which is right there at the top. | `Changed 2 files`, `Ran command` (ok). | Lamp `ok`. | App `/p/kai`: a "Running late" toggle per guest. App `/door/late`: "Lea · running late (Kai)". |
| 4 | Short, and on one job. But you typed the phone rule for the third time today. | Reply. | "rule typed: 3 times today" at you. | App |

**Answer.**

> Promoters can mark a guest as running late from their list. The door's late list shows "running late" with the promoter's name, and no phone numbers anywhere at the door.
>
> I tried it at 390 px with made-up guests. All 18 checks pass.

**By level.** *Technical:* `deeper` restates Anthropic's advice to clear between tasks, because a focused context gets better answers (`harnesses.claudeCode.focusedContext`). *Engineer:* `deeper` adds Anthropic's rule of thumb: after two failed corrections, start fresh with a better prompt rather than add a third (`harnesses.claudeCode.clearAfterTwo`).

**Try it.** "[One job.] Done when [check]. Must never [rule]." Send it in a new thread. **In T3 Code:** New thread carries your model and mode, not the conversation.

**Facts.** Existing: `harnesses.claudeCode.focusedContext`, `harnesses.claudeCode.clearAfterTwo`, `t3code.newThreadCarries`. New: none.

**After lesson 5 the reader can** read how full a thread's window is, recognise that a long thread can drop an early rule without overflowing, choose between compacting, clearing and a fresh thread with a brief, and keep each thread on one job.

---

## Lesson 6, Write it down

**Story beat.** 17:30: you've typed the phone rule three times today, and Sami and Bea will use this app every Friday, so the club's rules go into a file the agent reads first.

v1 mechanism: `memory.ts`. The project's rules plate is `none`, `plain` or `lit`. In a new session the rules slab is sent into the window before your first word. The file grows until a rule in the middle is missed. A skills shelf holds skills whose names are in the window until one is taken out (`skillOut`). Starting state: `solo({ tools: true, project: { rules: 'none' } })`.

### 6.1 Every thread starts from zero

**Request** (new thread): Mark regulars on the door page, guests who came three Fridays in a row. *Done when* it shows at the door at phone size.

**Lede.** A new thread, no brief. Everything the earlier threads learned about this project is gone.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A new thread. The window is empty, and the project has no instructions file. | "Context window · 1% used". | Rules plate `none`. Empty window. "no instructions file" at the plate. | E |
| 2 | It searches for how tests run here and guesses wrong. | `Searched files`, `Ran command` (bad): "no tests found". | Puck to run, back `bad`. | E |
| 3 | It finds the right command and builds the badge. Times come out as 10:41 PM. | `Ran command` (ok), `Changed files`. | Lamp `ok`. | App `/door`: "Ana Lopez ★ regular · last in 10:41 PM". |
| 4 | It never tried the door at phone size. Nothing told it that's how done is checked here. | Reply. | "never ran: door check" at the run tool. | App, same. |

**Answer.**

> Regulars now have a star on the door page, for guests who came three Fridays in a row. Unit tests pass.

**By level.** *Technical:* rows show `npx jest` → "no tests found", then `npm test`. *Engineer:* `deeper` says the repository's conventions (vitest through `npm test`, 24-hour times, the 390 px door check) live only in earlier threads.

**Try it.** Start a fresh thread in your project and see what it has to rediscover. **In T3 Code:** expand the first `Ran command` row and see what it tried before it found the right command.

**Facts.** Existing: `t3code.newThreadCarries`. New: none.

### 6.2 A file it reads first

**Request:** Write down how this project works and the club's rules, so every new thread starts with them. *Done when* a new thread follows them without being told.

**Lede.** One file in the project, read at the start of every thread.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It reads today's threads and the project, then writes AGENTS.md. | `Read 6 files`, `Changed files`: AGENTS.md. | Puck to the project, rules plate turns `plain`. "AGENTS.md" at the plate. | Page: AGENTS.md in the file viewer (below). |
| 2 | You start a new thread. Before your first word, the file goes into the window. | New thread. "Context window · 2% used". | The rules plate turns `lit`, a `rules` slab travels into the empty window. "read before your first word". | Page: AGENTS.md. |
| 3 | You send the regulars request again. It uses the right command, 24-hour times and the door check. | `Ran 2 commands` (ok): "npm test 19 of 19 · door check at 390 px". | Lamp `ok`. | App `/door`: "Ana Lopez ★ regular · last in 22:41". |
| 4 | Which file gets read first depends on the agent underneath. | | "Claude Code: CLAUDE.md" and "Codex: AGENTS.md", both at the plate. | E |

The file, as shown in the browser (made up):

```markdown
# The Lantern: guest and door app

- Before you say done, run `npm test` and `npm run door-check` (the door at 390 px). Paste what they printed.
- Times are 24-hour: 22:41.
- A guest's phone number never appears on any door screen.
- Promoters only ever see their own list.
- Tests use made-up guests from `fixtures/guests.ts`. Never read or change `data/live/`.
- Door staff use one hand: large tap targets, and the search box within thumb reach.
```

**Answer.**

> I wrote AGENTS.md at the root of the project: six rules, 11 lines. They cover how to check work here, the time format, the phone-number rule, promoter privacy, test data and the one-handed door.
>
> To check it, start a new thread and ask for something small at the door. It should run the door check without being told.

**By level.** *Technical:* `deeper` says the file is plain text in the repository, committed like code. *Engineer:* `deeper`, a P0 accuracy point: Claude Code reads CLAUDE.md and reads AGENTS.md only when no CLAUDE.md exists, so keep AGENTS.md and import it with `@AGENTS.md` (`harnesses.claudeCode.contextFile`). Codex reads every AGENTS.md from the repository root down (`harnesses.codex.contextFile`). In the guide's own lab test, Antigravity under T3 Code did not load AGENTS.md at thread start, and the model read it only when it chose to (`observations.experience.antigravityContextFiles`, an observation, to be labelled).

**Try it.** "Write down how this project works and its rules in AGENTS.md, so every new thread starts with them." **In T3 Code:** open the file in the file viewer and read it yourself. It's short.

**Facts.** Existing: `harnesses.claudeCode.contextFile`, `harnesses.codex.contextFile`, `harnesses.claudeCode.startupContext`, `observations.experience.antigravityContextFiles`, `t3code.browser` (mentions the file viewer). New: none.

### 6.3 Teach it once

**Request:** Red on the door page means one thing only: do not admit. Make regulars a different colour, and add that rule to AGENTS.md. *Done when* the badge isn't red and the rule is in the file.

**Lede.** A correction you'd otherwise repeat becomes one line in the file.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The regulars star came out red. To Sami, red will mean "do not admit". | Request. | "red: reserved" at you. | App `/door`: red star highlighted. |
| 2 | It changes the colour and adds one line to AGENTS.md. | `Changed 2 files`: door styles, AGENTS.md. | Puck to the rules plate, plate `lit`. | Page: AGENTS.md, one new line highlighted: "Red on the door means do not admit. Nothing else is red." |
| 3 | The diff shows exactly what changed in the file: one line. | The turn's diff view *(highlighted)*. | "+1 line" at the plate. | Page |
| 4 | Every thread from now on starts with that line. | Reply. | Plate `plain`. | App `/door`: a gold star. |

**Answer.**

> The regulars star is gold now. I added one line to AGENTS.md: "Red on the door means do not admit. Nothing else is red." Every new thread will start with it.

**By level.** *Technical:* `deeper` says to read the diff of the instructions file like any other change, because a vague rule there misleads every later thread. *Engineer:* `deeper` mentions `/init` in Claude Code, which drafts a starting CLAUDE.md from the codebase (`harnesses.claudeCode.init`).

**Try it.** "That's the second time. Add a rule to AGENTS.md so it doesn't happen again." **In T3 Code:** open the turn's diff and check the rule says what you meant.

**Facts.** Existing: `harnesses.claudeCode.init`, `t3code.worktrees` (mentions the diff view per turn). New: none.

### 6.4 Short beats long

**Request** (some Fridays later, still made up): Add the closing checklist to the door app. *Done when* the door check passes and the checklist is on `/door/close`.

**Lede.** Weeks of "add that to AGENTS.md". The file is long now.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | AGENTS.md has grown to 240 lines. All of it loads at the start of every thread. | "Context window · 6% used" at the start. | Rules slab grown tall (the `teach` mechanism). "240 lines, every thread". | Page: AGENTS.md, long, scrolling. |
| 2 | It builds the checklist and skips the door check, a rule on line 131. | `Changed files`, `Ran command` (ok): unit tests only. | Lamp `bad`. "missed: line 131" at the plate. | Page: line 131 highlighted. |
| 3 | Short rules stay in the file. The long door-check steps move into a skill: a name and one line in every window, the full text only when needed. | | Skills shelf appears beside the plate. "names only" at the shelf. | E |
| 4 | Next time it needs the door check, it reads the skill. | `Skill: door-check` *(new fact)*, `Ran command` (ok). | Skill off the shelf (`skillOut`), `rules` slab into the window. | App `/door/close`. |

**Answer.**

> The closing checklist is at /door/close: lights, till, stock count, locked doors. Sami ticks each one.
>
> I moved the door-check steps out of AGENTS.md into a skill called door-check, and I ran it before replying: the door at 390 px, all cases pass. AGENTS.md is 64 lines again.

**By level.** *Technical:* `deeper` cites Anthropic's advice to keep each CLAUDE.md under 200 lines, because longer files cost context and reduce adherence (`harnesses.claudeCode.claudeMdLines`). *Engineer:* `deeper` says skills load their name and description up front and their body when invoked (`skills.specMetadataTokens`, `skills.claudeCodeListing`, `skills.codexListing`).

**Try it.** "AGENTS.md is getting long. Keep only the rules every job needs, and move step-by-step procedures into skills." **In T3 Code:** type `$` in the composer to see which skills the agent can use.

**Facts.** Existing: `harnesses.claudeCode.claudeMdLines`, `skills.specMetadataTokens`, `skills.claudeCodeListing`, `skills.codexListing`, `t3code.skillsInComposer`. New: `t3code.screen.workLogSkill` ("Skill: {name}" row), source https://github.com/pingdotgg/t3code/blob/main/packages/shared/src/toolActivity.ts

**After lesson 6 the reader can** set up an instructions file that every new thread reads, turn a repeated correction into one line in it, account for which agent reads which file, and keep the file short by moving procedures into skills.

---

## Lesson 7, Your turn

**Story beat.** 19:00: Sami calls. A guest who started a fight last Friday, Rico Vance, is on Noor's list tonight, so you need a do-not-admit list before doors.

v1 mechanism: `turn.ts` (one job with a fork in it, a lamp that waits, a door the reader opens, plan cards on the tray with the guessed step marked). Starting state: `solo({ tools: true, project: true, gate: true, tray: [] })` with `tray.gap = 16`.

The one request, the same in every part except 7.4: *Let me mark a guest as do-not-admit, so the door sees it the moment they search the name. It must never be possible to tap a do-not-admit guest in by mistake.*

**T3 Code status words.** The current sidebar row shows **Approval** and **Input** (`t3code.screen.statuses`). "Plan Ready" is not a status in the current row. See the note in 7.3 and open question 1.

### 7.1 Approval

**Lede.** In Supervised mode it asks before commands and file changes. You read what it wants to run.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Supervised: it asks before it runs commands or changes files. | Request. The chip reads "Permissions: Supervised" *(highlighted)*. | "you approve each action" at you. | E |
| 2 | It wants to run a script on `data/live/`, tonight's real list. | A "Command approval" panel with the command, buttons Approve, Decline, Always allow this session, Cancel *(new fact)*. Sidebar row: **Approval**. | Lamp `wait`, puck to you. "May I run this?" at you. | Page: the command, `node scripts/mark.js --live "Rico Vance"`. |
| 3 | AGENTS.md says never touch `data/live/`. You decline, and say why in a reply. | You type: "Not on the live list. Build it with made-up guests." | Puck back to the agent. The run tool is marked "declined". | E |
| 4 | It builds with made-up guests instead, then asks to change two files. You approve. | "File change approval", Approve. `Changed 2 files`. | File tiles `edit`. | App `/door`: "Rico Vance · DO NOT ADMIT" (made-up guest). |
| 5 | It finishes. Every action that touched something went past you first. | `Ran command` (ok). Reply. | Lamp `ok`. | App |

**Answer.**

> Do-not-admit is built and tried with made-up guests. You mark a guest from their row on the Promoters page, and the door then shows them as "Do not admit", with no tap-in button.
>
> I didn't touch tonight's real list, as you said. To mark Rico Vance for tonight, open that guest's row on the Promoters page and choose Do not admit.

**By level.** *Technical:* `deeper` says Supervised asks for commands and file changes, and some read-only actions can go ahead without asking. *Engineer:* `deeper` says Claude can still ask in Full access when its own settings require it (`t3code.claudePermissionsStillApply`). A text reply to a pending Claude approval declines it and gives the agent feedback.

**Try it.** For anything that touches real data, use Supervised and read each command before you approve it. **In T3 Code:** open the model picker, then Permissions at its bottom, or press mod+shift+a.

**Facts.** Existing: `t3code.modeMeaning`, `t3code.modeSwitch`, `t3code.shortcuts.permissions`, `t3code.screen.permissionChip`, `t3code.screen.statuses`, `t3code.claudePermissionsStillApply`. New: `t3code.approvalPanel` (headings "Command approval", "File change approval"; buttons Approve, Decline, Always allow this session, Cancel), sources https://github.com/pingdotgg/t3code/blob/main/apps/web/src/components/chat/ComposerPendingApprovalActions.tsx and `ComposerPendingApprovalPanel.tsx` in the same folder (the panel headings were read in the 26 October clone; re-read on main). New: `t3code.declineWithText` ("While a Claude approval is pending, type a text reply to decline that request and give feedback"), source https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md

### 7.2 Input

**Lede.** Back in Full access. The job has a fork in it: hide the guest, or flag them.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Halfway through it hits a fork: hide do-not-admit guests from the door list, or show them flagged? | A question panel with two options: "Hide from the list", "Show in red: Do not admit" *(new fact)*. Sidebar row: **Input**. | Lamp `wait`, a card on the tray `wait`. "a question for you" at the card. | E |
| 2 | You're busy in the bar thread. The question waits, and the thread moves back to the top of the list. | Sidebar: the lesson's story row moves to the top, still **Input**. | You stand elsewhere. The card stays `wait`. "waiting on you" at the tray. | App `/bar`. |
| 3 | You answer: show them in red. Hidden would look like a list mistake, and Noor would add them again. | You pick "Show in red". | Puck to the agent. Card `ok`. | E |
| 4 | It builds on your answer, not a guess. | `Changed 2 files`, `Ran command` (ok). | Lamp `ok`. | App `/door`: "Rico Vance", red, "Do not admit", no tap-in button. |
| 5 | Without the question, it would have picked one and built twelve turns on it. | | A ghost replay of v1's `once` script: twelve fast turns, files `bad`. "12 turns on a guess". | E |

**Answer.**

> Do-not-admit guests now show at the door in red with "Do not admit" and no tap-in button, as you chose. They stay on their promoter's list, marked, so nobody adds them again by mistake.
>
> I tried it at 390 px: searching "rico" shows the red row, and there's nothing to tap.

**By level.** *Technical:* `deeper` says permission modes don't stop the agent asking questions about the task. *Engineer:* `deeper` says a subagent's approvals and questions surface in the parent thread (`t3code.screen.subagents` context), which matters in chapter 3.

**Try it.** "If you hit a choice I haven't made, ask me. Don't pick one." **In T3 Code:** an Input row in the sidebar means a question is waiting. You can also dismiss a question without answering.

**Facts.** Existing: `t3code.screen.statuses`. New: `t3code.questionPanel` (the panel with the question and its options; "Dismiss question without answering"), source https://github.com/pingdotgg/t3code/blob/main/apps/web/src/components/chat/ComposerPendingUserInputPanel.tsx. New: `t3code.modeQuestions` ("Permission modes do not prevent the agent from asking questions about the task"), source https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md. Existing `t3code.workingSection` (proposed in 4.1) covers the return to the top of the list.

### 7.3 A plan before the build

**Request:** the 7 request, and: *Show me your plan before you change anything.*

**Lede.** You see what it will do before it does any of it.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It reads the project and writes a plan. No files change. | `Searched files`, `Read 3 files`. No `Changed files` row. | Pucks only to read. File tiles `read`. | E |
| 2 | The plan arrives as a card: four steps. | "Proposed plan" card with a "Plan" badge, four numbered steps *(new fact)*. Sidebar row: **Done** (the turn ended). | Four plan cards on the tray (`planCards`). "plan" at card 1. | Page: the plan as Markdown (Download as markdown is one of its actions). |
| 3 | Step 3 is a guess: "Remove do-not-admit guests from promoter lists." | | Card 3 `wait`. "step 3: a guess" at it. | Page: step 3 highlighted. |
| 4 | You change step 3 before any code exists: keep them on the list, marked. | You reply: "Step 3: keep them on the list, marked. Then go ahead." | Card 3 `ok`. | E |
| 5 | Now it builds the plan you agreed to. | `Changed 3 files`, `Ran command` (ok). | Lamp `ok`. | App `/door`: red row. |

**Answer** (to the plan request, the turn that produced the card):

> Here's the plan. I haven't changed anything yet.
>
> 1. Add "do not admit" to each guest, off by default. 2. On the Promoters page, a button to mark a guest. 3. Remove do-not-admit guests from promoter lists. 4. At the door, show them in red with no tap-in, and test that no tap gets through.
>
> Step 3 is my guess. Tell me if you'd rather keep them on the list.

**By level.** *Technical:* the plan steps name files. *Engineer:* the plan names the migration and the server-side check. `deeper` says a plan costs one short turn, and a wrong guess found later costs every turn built on it.

**Note on T3 Code.** On main on 2026-11-22, T3 Code still renders a "Proposed plan" card (`ProposedPlanCard.tsx`) and keeps a plan interaction mode in its thread data. I found no plan toggle in the composer footer (the 26 October clone had one, "Default mode. Click to enter plan mode"). `composer.md` no longer lists `/plan`. The current sidebar row has no plan status. "Plan Ready" exists only in the older status pill (`resolveThreadStatusPill` in `Sidebar.logic.ts`), and `corrections.ts` records it as replaced for row labels. The script therefore makes the plan request in words, which works with every provider, and shows the row as Done. It needs re-checking before drawing (open question 1).

**Try it.** "Show me your plan before you change anything. Mark any step that's a guess." **In T3 Code:** the plan's menu can copy it, download it as Markdown or save it to the workspace.

**Facts.** Existing: `harnesses.claudeCode.permissionModes` (Claude Code's own plan mode), `harnesses.claudeCode.features`. New: `t3code.proposedPlan` ("Proposed plan" card, "Plan" badge, Copy to clipboard, Download as markdown, Save plan to workspace), source https://github.com/pingdotgg/t3code/blob/main/apps/web/src/components/chat/ProposedPlanCard.tsx. Unresolved: where plan mode is switched on in T3 Code today.

### 7.4 Ask first, then don't wait for me

**Request:** the 7 request, and: *Before you build, ask me everything you'd otherwise have to guess, all at once. Then finish without stopping.*

**Lede.** Your questions up front, then a long run that doesn't need you.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It reads the project and asks its questions in one go. | Question panel with three questions: hide or flag, tonight only or every Friday, plus-ones too? Sidebar: **Input**. | One tray card `wait` with three marks. "3 questions, once" at it. | E |
| 2 | You answer all three in under a minute. | Your answers: flag in red, every Friday until removed, plus-ones too. | Puck to the agent. | E |
| 3 | Then it works with nothing left to ask. | Sidebar: **Working**, folded into Working. Rows stream. | Lamp `work`, a long run, no puck to you. "nothing to ask" at you. | E |
| 4 | Meanwhile you're in the rota thread. Nothing waits on you. | Rota thread in front. | You at another card. | App `/rota`. |
| 5 | It comes back once, Done, with its proof. | `Worked for 9m 30s`. **Done**. | Reply through the gate. | App `/door`: Rico and Rico's plus-one, both red. |

**Answer.**

> Done, with your three answers. Do-not-admit guests show in red at the door every Friday until you remove them, and so do any plus-ones they bring.
>
> I tried it at 390 px with made-up guests: Rico and Rico's plus-one show red with no tap-in, Ana still taps in, and marking or unmarking works from the Promoters page. All 22 checks pass.

**By level.** *Technical:* `deeper` says this is the rung-2 pattern from the request-size notes: interview first, then build. *Engineer:* `deeper` suggests asking for the answers to be written to a spec file in the repo, so the next thread doesn't ask again (ties back to lesson 6).

**Try it.** "Before you build, ask me everything you'd otherwise guess, all at once. Then finish without stopping." **In T3 Code:** answer, then switch to another thread. The row comes back when it's done.

**Facts.** Existing: `harnesses.claudeCode.bestPractice`, `t3code.screen.statuses`. New: none (uses `t3code.questionPanel` from 7.2). Before writing "three questions in one panel", check whether T3 Code's input panel shows several questions at once.

**After lesson 7 the reader can** choose a permission mode by what the job touches, read and decline an approval with a reason, answer a question without losing their place elsewhere, get a plan before any code changes, and put their decisions up front so a long run doesn't stop for them.

---

## Lesson 8, Proof you can read

**Story beat.** 21:00: doors at 23:00, and before you hand Sami the phone you want to know the door works, without reading code.

v1 mechanism: `proof.ts` (cards on the tray: summary, test run, screenshot, link; each answers one question). Starting state: `solo({ tools: true, project: false, gate: true, tray: [] })` with `tray.gap = 18`. v1 leaves the project out so the cards get room.

### 8.1 "Done." tells you nothing

**Request:** Get the door ready for tonight: search, tap in, promoter guests, do-not-admit. *Done when* it all works.

**Lede.** The done-when is "it all works". The reply is one word long.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It reads, changes and runs things. The work log fills. | `Read 4 files`, `Changed 2 files`, `Ran 3 commands`. | Pucks to tools. | E |
| 2 | The reply: "Done. Everything works." | Reply. | Puck through the gate, tray empty. "Done." at you. | E |
| 3 | What changed? What ran? Did anyone look at the door? The reply doesn't say. | | Three `?` cards appear on the tray, empty. | App: unchanged. You'd have to look yourself. |
| 4 | To find out, you'd read the log line by line, or the code. | Work-log rows highlighted. | "to know: read it all" at you. | E |

**Answer.**

> Done. Everything works.

**By level.** *Technical and engineer:* `deeper` quotes Anthropic's advice to ask for evidence, the command and its output or the screenshot, because "All tests pass" on its own tells you very little (`harnesses.claudeCode.askForEvidence`).

**Try it.** Look at your last reply. Could you tell from the reply alone what was checked? **In T3 Code:** expand each `Ran command` row and see which checks actually ran.

**Facts.** Existing: `harnesses.claudeCode.askForEvidence`, `claims.lessons.toolCallEvidence`. New: none.

### 8.2 Ask for the proof

**Request:** the 8.1 request, and: *Show me what changed and what you left out, which checks ran with their output, and the door at phone size for each case.*

**Lede.** The same work. This time the request names the proof.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The same work, but you asked what to bring back. | Same rows. | Pucks to tools. | E |
| 2 | A summary: what changed, and what's not done. | Reply starts. | Card `sum` on the tray. "summary" under it. | E |
| 3 | The check output: what ran, and what didn't. | Reply quotes the `Ran command` output. | Card `tests`. | E |
| 4 | The door at phone size, one view per case. You and the agent see the same browser. | | Card `shot`. | App `/door` at 390: four states in turn: Ana found, Zed "Not on tonight's list", Ana again "Already in at 22:41", Rico red. |
| 5 | Each card answers one question you'd otherwise have to dig for. | | Three cards `ok`. "proof you can read" at the tray. | App |

**Answer.**

> Ready for tonight. Changed: the door now loads promoter guests and do-not-admit marks on start, so a slow connection can't hide either one. Not done: the door doesn't work offline. If the club's wifi drops, it stops.
>
> Checks: `npm test` 22 of 22 passed. `npm run door-check` at 390 px went through four cases and all passed: Ana found and tapped in, Zed not on the list, Ana's second tap "Already in at 22:41", Rico shown red with no tap-in.
>
> All four cases are in the browser panel now, at phone size.

**By level.** *Technical:* the `tests` card shows the command lines. *Engineer:* the answer adds that the door check runs headless Chromium at 390×844 against seeded fixtures. `deeper` says the "not done" line matters as much as the passes.

**Try it.** "… Show me what changed and what you left out, which checks ran with their output, and [the screen] at phone size." **In T3 Code:** the browser panel is shared, so look at the cases the agent opened there.

**Facts.** Existing: `harnesses.claudeCode.askForEvidence`, `t3code.browser`, `t3code.localServers`. New: none. Avoid claiming screenshots render in the chat unless a fact is added for it. The script shows the cases in the shared browser instead.

### 8.3 When the proof disagrees with the reply

**Request:** Run every check once more before doors and tell me the result.

**Lede.** The reply and the work log say different things. The log is the record.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It runs the checks. | `Ran command`: "npm test 22 of 22". `Ran command` (bad): "door-check: browser failed to start". | One run back `tool`, one `bad`. | E |
| 2 | The reply says: "All checks pass." | Reply. | Puck through the gate, `model`. "All checks pass." at you. | E |
| 3 | The work log says the door check never ran. | The failed row highlighted. Expanded, it shows the error. | The `bad` slab in the window flashes. "door check: never ran" at the run tool. | Page: the expanded output, "browser failed to start". |
| 4 | You ask about the row. It reruns, and the door check passes. | You: "The door check didn't run. Run it." `Ran command` (ok). | Lamp `ok`. | App `/door`, four cases. |

**Answer** (as given at point 2; the follow-up answer is one line):

> All checks pass. The door is ready for tonight.

**By level.** *Technical:* `deeper` says a check that didn't run is not a check that passed, so read the rows, not only the reply. *Engineer:* `deeper` gives the figure with its setup in the same sentence: in OpenAI's Blocker Deception test, built to provoke this, GPT-6.2 Sol with the Codex developer prompt omitted or misrepresented a known blocker in 8.88% of trials (`claims.lessons.blockedCheckOmission`). The test gives no rate for everyday use. Lesson 2 part 3 already used this figure, so lesson 8 can link back to it rather than repeat it.

**Try it.** "Run every check. Say which ran, which passed, and which could not run." **In T3 Code:** look for a red `Ran command` row before you read the reply.

**Facts.** Existing: `claims.lessons.blockedCheckOmission`, `claims.lessons.toolCallEvidence`, `harnesses.claudeCode.askForEvidence`. New: `t3code.screen.commandStates` ("Running {program}", "Ran {program}", "Failed {program}"), source https://github.com/pingdotgg/t3code/blob/main/packages/shared/src/toolActivity.ts

### 8.4 The last check is yours

**Request:** Give me a way to try the door myself with made-up guests before doors. *Done when* I can tap through all four cases. *It must never touch tonight's real list.*

**Lede.** The checks cover what can be written down. Whether it feels right in one hand at 23:00 is yours to judge.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It starts the app in practice mode with made-up guests. | `Ran command`: the dev server. Thread details lists the local server and its port *(highlighted)*. | Puck to run. "practice mode" at the run tool. | App `/door?practice`: a yellow "Practice: made-up guests" banner. |
| 2 | You open it in the browser panel and tap through: Ana in, Zed out, Ana again, Rico red. | Your taps, no rows. | You at the tray, taking the `link` card. "you try it" at you. | App, driven by the reader's clicks or the autoplay. |
| 3 | Everything passes, but the search box sits at the top, out of a thumb's reach. | | Card `link` marked `wait`. "one hand: no" at it. | App: the search box at the top highlighted. |
| 4 | That's a note for next Friday, not a blocker for tonight. You hand Sami the phone. | You queue: "Next week: search box at the bottom." | Lamp `ok`. All cards `ok` except one `wait`. | App `/door`, practice banner gone. |

**Answer.**

> Practice mode is running in the browser panel at /door?practice, with 30 made-up guests, including an Ana Lopez, a Zed who isn't listed and a do-not-admit Rico. Nothing you tap there reaches tonight's list. The practice data lives in its own file, and a test checks that practice mode can't write to the real list.
>
> Try the four cases. One-handed comfort is for you to judge on your phone.

**By level.** *Technical:* `deeper` says this is where the work hands back to you: the agent can show you the cases, and only you can judge whether they suit the door. *Engineer:* `deeper` says that to try it on a real phone, the phone needs to reach the computer serving the app, which is covered in Set up.

**Try it.** "Give me a way to try it myself with made-up data. It must never touch the real data." **In T3 Code:** open the thread details card and select the local server to open it in the browser panel.

**Facts.** Existing: `t3code.localServers`, `t3code.browser`. New: none.

**After lesson 8 the reader can** name the proof they want in the request, read a reply's summary, check output and screens without reading code, catch a reply that disagrees with its own work log, and keep the final check, using it themselves, for themselves.

---

## T3 Code pieces each lesson reveals

What appears, highlighted, at the point that teaches it, and whether `site/src/data/t3code.ts` sources it (worktree version, which has the lesson 1–2 additions). "Source read" means I read it in T3 Code's source or docs on 2026-11-22, but it still needs a `fact()`.

| Lesson | Piece | Sourced in t3code.ts? |
|---|---|---|
| 3 | Sidebar status **Goal** | Yes, `screen.statuses` |
| 3 | `/goal` and the goal line at the end of the thread | No. Source read: `docs/user/composer.md#goals`. The line's exact look wasn't read, so draw it as an example |
| 3 | Expanding a `Ran command` row to see its output | Yes, `claims.lessons.toolCallEvidence` |
| 4 | Background send (mod+Enter) and the fresh composer | Yes, `shortcuts.background` |
| 4 | **Working** section, collapsed, with a count. Rows come back to the top when done or when they need you | Section names yes (`screen.sections`). Fold-and-return behaviour no. Source read: `thread-sidebar.md#fold-working-threads-beta` |
| 4 | Inline thread summary in the chat | Not a T3 Code element. It's the guide's own device, so label it as such |
| 4 | Queue / Steer for a follow-up | Yes, `queueSteer`, `shortcuts.opposite` |
| 4 | New worktree, and the branch chip (`t3/…`) | Partly: `worktrees`, `branchPrefix`. "Threads in one checkout share its branch" no. Source read: `thread-sidebar.md` |
| 5 | Context window row in thread details | Yes, `screen.contextWindow`. **Already revealed in lesson 1 part 2** (`ui.context`), against the owner's "appears once the lesson teaches it". Either move the reveal to 5.1 or keep lesson 1's as a quiet first sight |
| 5 | The setting that turns the row on (Settings → Appearance → Thread details) | No. Source read: `composer.md` |
| 5 | Amber at 80%, red at 90%, the auto-compaction tick | No. Source read: `ThreadDetailsUsage.tsx` |
| 5 | `/compact`, `/clear` and the "New session" marker | No. Source read: `composer.md` |
| 6 | File viewer showing AGENTS.md | Yes, `browser` (mentions a file viewer) |
| 6 | Diff view for a turn | Yes, `worktrees` (mentions a diff view per turn) |
| 6 | `Skill: {name}` work-log row | No. Source read: `packages/shared/src/toolActivity.ts` |
| 6 | `$` for skills in the composer | Yes, `skillsInComposer` |
| 7 | Permission chip "Permissions: Supervised" | Yes, `screen.permissionChip`, `modeSwitch`. Revealed in lesson 2, highlighted again |
| 7 | Approval panel: "Command approval", "File change approval"; Approve, Decline, Always allow this session, Cancel | No. Buttons read on main. Panel headings read in the 26 October clone, so re-read on main |
| 7 | Declining with a text reply (Claude) | No. Source read: `permission-modes.md` |
| 7 | Status **Approval** | Yes, `screen.statuses` (first shown in lesson 2) |
| 7 | Question panel with options, "Dismiss question without answering" | No. Source read: `ComposerPendingUserInputPanel.tsx` |
| 7 | Status **Input** | Yes, `screen.statuses` |
| 7 | "Proposed plan" card, "Plan" badge, Copy, Download as markdown, Save plan to workspace | No. Source read: `ProposedPlanCard.tsx` |
| 7 | A plan-mode toggle | **Not found on main.** It was in the 26 October clone ("Default mode. Click to enter plan mode"). Don't draw it until re-checked |
| 7 | "Plan Ready" | **Don't draw.** Not in the current row. It survives only in the older status pill, and `corrections.ts` lists it as replaced |
| 8 | Thread details: local servers and their ports, opening in the browser panel | Yes, `localServers` |
| 8 | Shared browser panel | Yes, `browser` |
| 8 | "Running / Ran / Failed {program}" row states | No. Source read: `toolActivity.ts` |

### Proposed new facts, in one place

All are from `https://github.com/pingdotgg/t3code/blob/main/`, read on 2026-11-22 unless noted. Each needs a `fact()` in `t3code.ts` and a re-read when it's added.

- `goal`: `docs/user/composer.md#goals`
- `workingSection`: `docs/user/thread-sidebar.md#fold-working-threads-beta`
- `sameCheckout`: `docs/user/thread-sidebar.md`
- `contextSetting`, `compact`, `clear`: `docs/user/composer.md`
- `contextTones`: `apps/web/src/components/chat/ThreadDetailsUsage.tsx`
- `screen.workLogSkill`, `screen.commandStates`: `packages/shared/src/toolActivity.ts`
- `approvalPanel`: `apps/web/src/components/chat/ComposerPendingApprovalActions.tsx`, `ComposerPendingApprovalPanel.tsx`
- `declineWithText`, `modeQuestions`: `docs/user/permission-modes.md`
- `questionPanel`: `apps/web/src/components/chat/ComposerPendingUserInputPanel.tsx`
- `proposedPlan`: `apps/web/src/components/chat/ProposedPlanCard.tsx`
- Optional, outside T3 Code: `claims.lessons.agentPrVulns`, https://www.dryrun.security/the-agentic-coding-security-report, verified with scope in `capabilities-recheck.md`.

Figures kept out on purpose: the request-size ladder's minutes, hours and line counts. The recheck says the sources don't establish them. The only rate used is 8.88%, with its setup in the same sentence, and the parallel-threads figure is labelled as the guide's observation.

---

## Open questions for the owner

1. **Plan mode in lesson 7.** Current T3 Code shows a "Proposed plan" card, but I found no plan toggle in the composer and no `/plan` in the docs, and the sidebar row has no plan status. "Plan Ready" is only in an older status pill. Recommendation: teach "show me your plan before you change anything" in words, which works with every provider, draw the Proposed plan card, and show the row as Done. Ask the T3 Code side whether plan mode is moving.
2. **Where the story's threads live.** From lesson 4 the story has its own threads (promoter links, bar, rota, post). The sidebar is the lessons' table of contents. Recommendation: show the story threads as inline thread summaries in the lesson's chat, and let the sidebar's Working section show only a count, marked "example", so the table of contents stays clean. The alternative is real story rows mixed in with lesson rows.
3. **One continuous Friday.** Lessons 4 to 6 depend on each other: the phone rule is planted in 4.2, lost in 5.2 and written down in 6.2. That makes the failures feel earned, but a reader who jumps straight to lesson 5 needs a one-line "previously" in the lede. Is a continuous story acceptable, or should each lesson stand alone?

Smaller points to settle when building: whether lesson 1's early context-row reveal stays; whether "three questions in one panel" (7.4) matches T3 Code's input panel; and whether lesson 3's `/goal` should come before or after the plus-ones gap (it's after, so the goal has a concrete thing to fix).
