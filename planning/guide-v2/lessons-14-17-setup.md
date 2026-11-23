# Guide v2: lessons 14 to 17 and Set up, as scripts

It continues [the Friday story](lessons-3-8.md) and follows its shape. Each part has a request, a lede, points (a "say" line, what the chat shows, the explainer, the browser), work-log rows per point, an answer, words by reader level, a try-it and its facts.

**Everything about the club is made up.** That covers the Lantern, its staff, promoters, guests and machines, every name, time, count, euro amount and percentage in a reply, and every "% left" in a usage meter. The scripts show behaviour that the sources describe. They are not records of real runs. Prices, plan names, limits and model names come only from `site/src/data/` and are listed under **Facts**.

**As built (2026-11-23).** The build follows this script with these changes; `build-l14-17.md` has the reasons.

- 14.3 became two parts: 14.3 "A small job, a small model" and 14.4 "A judgement, a big model", each its own new thread, so lesson 14 has four parts.
- 17.1 has no work log and no reply: the laptop slept mid-turn.
- 16.2's reviewer is the agent in front; the author thread stands behind the bus.
- Set up's parts are titled: Providers (Find your agents, A plan not a key, Where your words go); Git and hosting (Git on this computer, A GitHub account T3 Code can use, Where it will live); First setup (A new project, Notes it reads first, See it run).
- Staff app stages as built: add `payouts-why`, `stock-delivery` and `none-<path>` to the table below; Kai's broken total is €190.

Conventions are as in `lessons-3-8.md`:

- **Chat** is what the lesson thread shows at that point.
- **Explainer** is the picture, drawn with v1's engine, with at most two annotations (in quotes).
- **Browser** is the right-hand panel. **E** means the explainer is in front. **App** means the Lantern's staff app at 390 px, with its page path.

Work-log rows use only the words in `t3code.screen.workLog`, `workLogGroups`, `readRow`, `searchRow` and `workedFor`.

---

## The weeks after: one page

The first Friday went well. The app is now real: staff use it, it has outgrown one afternoon's work, and you use agents most days. Four things now matter that didn't on the first Friday.

| When | Lesson | What happens at the Lantern | What the app has afterwards |
|---|---|---|---|
| Tue, week 3, 15:00 | 14 Cost | The bar thread has been open since the first Friday. A one-line rename costs more in it than in a fresh thread. At 16:40 the promoter payout thread stops: Limited. A small job goes to a small model, the payout rules to a big one. | `/payouts`, the bar list sorted by taps |
| Mon, week 5 | 15 The project grows | Table bookings. The agent reads half the project before its first edit and changes an old copy of the guest list that nothing uses. A clean-up as its own job, then a refactor that the old promoter checks keep honest. | tables on tonight's list, one guest store |
| Wed, week 6 | 16 Other people | Staff want to swap shifts. The change goes up as a pull request. A reviewer that didn't write it finds that anyone can swap anyone's shift. Bea tries the new stock page on her phone behind a one-time code, then asks the agent a question through a guest link. | shift swaps, the stock page, a pull request |
| Sat, week 6 | 17 Other machines | You start the weekly report at 18:00 and close the laptop: it stops. An old mini PC in the office runs T3 Code as a service and writes the report every Saturday at 10:00. A cloud session starts from GitHub, not your laptop, so the made-up practice guests aren't there until a setup script makes them. | the night report, on a machine that stays on |
| Before the first Thursday | Set up | Install T3 Code, connect Claude Code and Codex with a plan, put Git and a private GitHub home behind the project, and make the Lantern's project with tonight's list in it. | the project that lesson 2 starts in |

Recurring cast (all made up): you (the owner), Sami (door), Bea (bar), Kai and Noor (promoters), Ana Lopez and Lea Brandt (guests). New, also made up: the office mini PC, called **office** in T3 Code.

Threads that carry across: the **bar thread** (lesson 4) is the long thread of 14.1. The **promoter checks** (lesson 3) are what catch the refactor in 15.3. The **practice guests** (8.4) are what the cloud session lacks in 17.3. **Set up, First setup** makes the project that lesson 2 opens.

### The Preview app

One app for the whole chapter: **the Lantern's staff app** (`site/src/v2/preview/staff.ts`), the app the agent has been building since lesson 2, at a later stage. Phone-first, with a bottom tab bar: Tonight, Bar, Rota, Payouts, Report. Its own look: warm paper and ink by day, a lantern amber for what needs a tap. Stages:

| Stage | Where | What it shows |
|---|---|---|
| `none` | any | the dev server's "Cannot GET" page |
| `starter` | S3 | the new project's first page: the Lantern's name and tonight's list, read only |
| `bar` / `bar-ale` / `bar-sorted` | 14 | Bar: running-low taps with who and when. `bar-ale` renames Ginger beer; `bar-sorted` orders by taps |
| `payouts` | 14, 15 | Payouts: per promoter, guests in, plus-ones, rate, total; a rule line at the foot |
| `payouts-broken` | 15.3 | the same page mid-refactor: Kai's plus-ones counted twice, marked |
| `tables-missing` / `tables` | 15 | Tonight: guests with a table booking; the first stage has no table numbers |
| `swap-open` / `swap` | 16 | Rota: request a swap. `swap-open` lets Bea pick Sami's shift; `swap` only her own |
| `gate` | 16.3, S2 | a one-time-code sign-in in front of the preview: email, then a six-digit code |
| `stock` | 16.3–16.4 | Bar stock for Bea: counts, last delivery |
| `report` | 17 | the night report: arrivals by hour, top bar taps, payouts |

---

## Lesson 14, Cost

**Story beat.** Tuesday of week 3, 15:00. You've had threads running most days. The bar thread from lesson 4 is still open: it has carried every bar change since.

v1 mechanism: `meter.ts` (every turn reads the whole window again; a plan is an allowance that drains, the API a bill that grows; the cache makes a reread cheap). Starting state: `solo({ tools: true, project: true, meter: 'plan' })`.

New in the app at this lesson: **Usage limits** in the thread details ("Session: {left}% left", "Weekly: {left}% left"), and the sidebar status **Limited**.

### 14.1 A long thread costs more per step

**Request** (in the bar thread, open since the first Friday): Ginger beer is now Ginger ale on the bar list. *Done when* the bar page shows the new name and the taps from last week still count.

**Lede.** One line, in a thread that has been open for three weeks.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | One line from you. It goes in on top of three weeks of bar work. | Request. Thread details: **Usage limits** appears (Session 64% left, Weekly 71% left; example). | A tall window: three weeks of slabs, then the new `you` slab. Meter `plan`, full-ish. "3 weeks of bar work" at the window. | App `/bar` |
| 2 | Every step sends the whole conversation again, not just your line. | `Searched files` | Model scans the window. Meter drops a step. "the whole thread, each step" | App `/bar` |
| 3 | Most of it is a repeat, and a repeat is cheaper: it comes from the cache. It still counts. | `Changed 2 files` | Meter drops again. "cache: the repeat, cheaper" at the meter. | App `/bar-ale` |
| 4 | It checks the old taps still count. Done. | `Ran command` (ok). Reply. Session 61% left. | Reply puck. | App `/bar-ale` |
| 5 | The same line in a fresh thread with a two-line brief draws far less. The work was the same; the window wasn't. | Session 61% → the fresh run shown alongside as 60% (example). | A second, short window beside the first. "same job, short window" | App |

**Answer.**

> Ginger beer is now Ginger ale on the bar list and in tomorrow's order list. The 14 taps from last week moved with it: they were stored by item id, not by name.
>
> I checked the bar page at 390 px and ran the bar checks: 6 of 6 pass.

**By level.** *Technical:* `deeper`: Claude Code sends the full conversation with every request; a one-line question in a session open all day still draws usage for the whole conversation. *Engineer:* `deeper` with the arithmetic at list price: Opus 5.5 input is $4 per million tokens and a cache read $0.20; most of a long thread's reread is a cache read, but on a plan it still draws on the same allowance. The provider publishes no dollar figure for a plan's limit.

**Try it.** "Start a fresh thread for this, with a short brief: [what it needs to know]." **In T3 Code:** turn on Usage limits in Settings → Appearance → Thread details, or send `/usage-limits`.

**Facts.** `plans.claude.limits.wholeConversation`, `plans.claude.limits.whatUsageMeans`, `models.claude-opus-5-5.price.input`, `models.claude-opus-5-5.price.cacheRead`, `t3code.screen.usageLimits`, new `t3code.screen.limitWindows`, new `t3code.usageLimitsInThread`.

### 14.2 Limited

**Request** (new thread): Each promoter's payout for Friday: €5 for each guest who came in, plus-ones count, no-shows don't. *Done when* the payouts page adds up for Kai and Noor with made-up guests, and a test checks the rule.

**Lede.** 16:40. Three threads have been working since lunch. They all draw on one allowance.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It reads where guests and promoters live. Three threads draw on the same allowance. | `Read 3 files`. Session 9% left. | Meter low, lamp `wait`. "3 threads, one allowance" | App `/payouts`: Cannot GET |
| 2 | It writes the rule as a test first. | `Changed files` | Puck to edit. Meter near empty. | App, same |
| 3 | The session limit runs out mid-turn. The thread stops and its row reads Limited. | Status **Limited** *(appears, highlighted)*. Session 0% left. | Meter empty, lamp `bad`. "limit reached" | App, same |
| 4 | Resume at reset schedules it to carry on when the window refills. Or move it to another provider's account; switching model doesn't help, the limit is shared across models. | Reply-like system line: Resume at reset (example). | Meter refills (dashed). "resets in full" | App |
| 5 | After the reset it picks up where it stopped and finishes. | `Changed 2 files`, `Ran command` (ok). Reply. | Lamp `ok`. | App `/payouts`: Kai €145, Noor €80 (made up) |

**Answer.**

> The payouts page is at /payouts. Each promoter gets €5 per guest who came in, plus-ones included; no-shows count for nothing. With made-up guests: Kai €145 for 29 people in, Noor €80 for 16.
>
> The rule is a test now. I stopped at the session limit at 16:52 and carried on after the reset.

**By level.** *Technical:* `deeper`: on a Claude plan, the session limit starts with your first message and resets in full five hours later; weekly limits apply across all models. With usage credits turned on, work continues on credits instead of stopping. *Engineer:* Codex: if a limit is reached during an active turn, the agent can finish that turn. Subagents and every parallel thread draw on the same limits.

**Try it.** "If you hit a limit, stop at a point where the tests pass and tell me what's left." **In T3 Code:** on a Limited row, choose Resume at reset, or switch the thread to another provider instance.

**Facts.** `t3code.limited`, `plans.claude.limits.fiveHour`, `plans.claude.limits.weekly`, `plans.claude.limits.sharedAcrossModels`, `plans.claude.limits.usageCredits`, `plans.chatgpt.limits.atTheLimit`, `plans.claude.limits.subagentsDraw`.

### 14.3 The right size of model

**Request** (two new threads): A: On the bar list, put the most-tapped items first. B: Payouts: refunds for guests turned away at the door don't count, and a promoter can see why each guest did or didn't count. *Done when* (A) the order follows tonight's taps; (B) a test covers a refund and the page says why.

**Lede.** Not every job needs the biggest model at its highest effort.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | The sort is small and clear. You start it on a small model at low effort. | Model chip shows Haiku 5.5 · low *(chip changes, highlighted)*. | Agent `model: 'b'`, small. "small model, low effort" | App `/bar` |
| 2 | It's done in a few steps. A small model costs a fraction per token: Haiku 5.5 is $0.10 per million input tokens, Opus 5.5 $4. | `Changed files`, `Ran command` (ok). Reply A. | Meter barely moves. | App `/bar-sorted` |
| 3 | The refund rule has a judgement in it. That one gets the big model at high effort. | Model chip Opus 5.5 · high. | Agent `model: 'a'`. "big model, high effort" | E |
| 4 | Higher effort thinks more and uses more of the limit. Set it when you start: changing model or effort mid-thread makes the next request miss the cache. | `Read 3 files`, `Changed 3 files`, `Ran command` (ok). Reply B. | Meter drops more. "pick at the start" | App `/payouts` with a "why" line per guest |

**Answer** (B):

> Refunds don't count now. A guest turned away at the door is marked "refunded" and drops out of the promoter's payout, and each guest row says why it counts or not.
>
> A new test covers Lea Brandt turned away at 00:20: Kai's total goes down by €5.

**By level.** *Technical:* effort levels are low, medium, high, xhigh and max; Claude Code defaults to medium. Effort is a signal, not a budget. *Engineer:* `deeper`: the Usage page shows an estimated API-equivalent cost across providers, not your subscription bill; public estimates of what a plan is worth in API dollars are one person's observations, labelled as such (Theo, 2 October 2026: about $8,000 a month for a $200 Claude plan).

**Try it.** Start the next small job on a small model at low effort. **In T3 Code:** the model picker is mod+shift+m and the effort picker mod+shift+e; a new thread carries your model and mode.

**Facts.** `models.claude-haiku-5-5.price.input`, `models.claude-opus-5-5.price.input`, `lineup.claudeCodeEffortLevels`, `lineup.claudeCodeEffortDefault`, `lineup.effortSignal`, `plans.claude.limits.effort`, `lineup.cacheBreakers`, `t3code.shortcuts.model`, `t3code.shortcuts.effort`, `t3code.newThreadCarries`, `t3code.usagePage`, `observations.estimates.theo-2026-10-02-claude-200` (engineer, labelled observation).

**After lesson 14 the reader can** say why a long thread costs more per step, read the usage limits and act on Limited, and pick the model and effort per job at the start of the thread.

---

## Lesson 15, The project grows

**Story beat.** Monday of week 5. The app has a door, promoters, bar, rota, payouts and a do-not-admit list. Each feature was built on its own day, by whichever thread was free.

v1 mechanism: `grow.ts` (features stack on the file tiles; from a point on each one leaves something behind that nothing uses; the next feature reads more before its first edit; a clean-up is a job that builds no feature; tests make a refactor safe). Starting state: `solo({ tools: true, gate: true, project: { stacks, junk, commits } })` with the stacks tall and junk on two tiles. The context window from lesson 5 is in the thread details.

### 15.1 It reads more before it starts

**Request:** Guests with a table booking show their table number on tonight's list. *Done when* Ana Lopez shows "Table 4" on tonight's list at phone size.

**Lede.** The same size of request as lesson 2. The project around it is five weeks bigger.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A small request. Before its first edit it has to find where guests live, and there are three places. | `Searched guest in src`. Context 18% (example). | Project tiles tall, two with junk layers. "5 weeks of features" | App `/tonight` (no tables) |
| 2 | It reads fourteen files. On the first Friday it read two. | `Read 14 files`. Context 41%. | Window fills with tool slabs. "read before the first edit" | App |
| 3 | It changes the guest list it found first: an old copy nothing uses any more. | `Changed 2 files` | Edit puck lands on a junk tile. "an old copy" | App |
| 4 | Its test passes, because the test also reads the old copy. It says done. | `Ran command` (ok). Reply. | Gate `ok`. | App `/tonight`: still no table numbers |
| 5 | You open tonight's list: no table numbers. The change went into a file nothing shows. | | "passed: the wrong file" at the gate. | App: highlight where "Table 4" should be |

**Answer** (as given):

> Tonight's list now shows a table number next to any guest with a booking. I added it in src/guests-list.tsx and a test that checks Ana Lopez shows "Table 4". 18 of 18 checks pass.

**By level.** *Technical:* `deeper`: two files render a guest list; one is imported by nothing. *Engineer:* `deeper`: dead code costs twice, once in reading and once when a test pins it; nothing marks a file dead until something reads the import graph.

**Try it.** Open the page yourself after a "done", before you read the reply. **In T3 Code:** open the turn's diff and check the changed file is one the page uses.

**Facts.** `t3code.worktrees` (diff view per turn), `t3code.screen.contextWindow`, `claims.research.contextRot`.

### 15.2 A clean-up is its own job

**Request:** Remove what nothing in the app uses: old copies, functions nothing calls, tests for pages that are gone. Change nothing else. *Done when* every check passes before and after and the app looks the same. *It must never touch tonight's real list.*

**Lede.** It builds no feature. It makes the next one cheaper.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | First it runs every check, so "after" has a "before" to match. | `Ran command` (ok) "18 of 18". | Gate `ok`. "before: 18 pass" | App `/tonight` |
| 2 | It finds what nothing imports: the old guest list, a second search function, a test for a page that's gone. | `Searched files`, `Read 6 files`. | Junk layers marked. "nothing uses these" | App |
| 3 | It removes them and runs every check again. | `Changed 5 files`, `Ran command` (ok) "17 of 17". | Junk gone, stacks lower. | App, unchanged |
| 4 | The table request again, in a fresh thread. It reads five files this time and changes the one the page uses. | `Read 5 files`, `Changed 2 files`, `Ran command` (ok). | Short window. "read: 5 files" | App `/tonight` with "Table 4" |

**Answer.**

> Removed 4 files and 2 functions that nothing in the app used, and one test for the old guest list. Nothing else changed: 17 checks pass before and after (one fewer, the old list's test).
>
> I didn't touch data. The table numbers are on tonight's list now.

**By level.** *Technical:* `deeper`: a separate job keeps the diff readable: a clean-up mixed into a feature hides the feature. *Engineer:* `deeper`: the check is "same behaviour": run before and after, compare.

**Try it.** "Remove what nothing uses. Change nothing else. Done when every check passes before and after." **In T3 Code:** run it in its own thread, and in its own worktree if another thread is working in the project.

**Facts.** `t3code.worktrees`, `claims.lessons.runChecks`.

### 15.3 A new shape, kept honest

**Request:** Guests are stored in one place, not three. *Done when* everything works as before and every check passes, with made-up guests.

**Lede.** A refactor changes the shape and keeps the behaviour. The checks you wrote weeks ago are what say it did.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It moves the three guest stores into one. | `Changed 6 files` | Stacks even out, same total. "same features, new shape" | App `/payouts` |
| 2 | The promoter checks from lesson 3 fail: Kai's plus-ones are counted twice. | `Ran command` (bad) "promoters.test.ts: 2 failed". | Gate `bad`. "an old check caught it" | App `/payouts-broken`: Kai 38 people, €190, marked |
| 3 | It fixes the count and runs everything again. All pass. | `Changed files`, `Ran command` (ok). | Gate `ok`. | App `/payouts`: Kai €140 (the refund rule from 14.4) |
| 4 | It writes the new shape into AGENTS.md, so the next thread finds guests in one look. | `Changed files` (AGENTS.md). Reply. | Rules tile lit. "one line in AGENTS.md" | App |

**Answer.**

> Guests now live in one store, src/guests.ts. The door, promoter pages, payouts and tonight's list all read from it.
>
> The promoter checks caught one break on the way: plus-ones were counted twice after the move. Fixed; all 17 checks pass. I added one line to AGENTS.md saying where guests live.

**By level.** *Technical:* `deeper`: without the promoter checks, nothing would have run, and the payouts would have doubled on Friday. *Engineer:* `deeper`: write the characterisation test before the refactor if it doesn't exist.

**Try it.** "Same behaviour, new shape: [what]. Run every check before and after." **In T3 Code:** expand the red Ran command row: the failing test names the old rule it protects.

**Facts.** `claims.lessons.runChecks`, `claims.lessons.toolCallEvidence`, `harnesses.claudeCode.claudeMdLines`.

**After lesson 15 the reader can** expect a bigger project to cost more reading per request, ask for clean-ups as their own jobs with before-and-after checks, and trust a refactor only as far as the checks that ran.

---

## Lesson 16, Other people

**Story beat.** Wednesday of week 6. Staff use the app on their phones every night. Now changes reach people other than you.

v1 mechanism: `people.ts` (a change waits at the gate in front of main as a pull request; a reviewer reads it; people beyond main send back what they find). Starting state: `ship(0, { people: [] })` with the tray, then `people: ['peer']`, `['peer', 'users']`.

### 16.1 A pull request, not a push

**Request:** Staff can ask to swap a shift with someone, and the other person accepts or declines on their phone. *Done when* tried at phone size with made-up staff, and it goes up as a pull request with what you checked in the description.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It works in its own worktree and branch, so main stays as staff use it tonight. | `Changed 4 files` | Agent with tree `own`. "its own branch" | App `/rota` (swap) |
| 2 | It runs the checks and tries a swap at phone size. | `Ran 2 commands` (ok) | Gate `ok` at the agent. | App `/rota`: Bea asks Sami |
| 3 | It commits, pushes and opens a pull request. The description says what it checked. | `Ran command` "gh pr create". | Puck along the bus to the gate before main. "pull request" | E |
| 4 | Nothing reaches main until someone merges it. | Reply with the PR link. | Puck waits at the gate. "waits for a reader" | E |

**Answer.**

> Shift swaps are on the rota page, in pull request #41 (made up). Ask from your own shift; the other person gets Accept and Decline.
>
> Checked at 390 px with made-up staff: Bea asked Sami, Sami accepted, both shifts moved. 21 checks pass.

**Facts.** `t3code.worktrees`, new `t3code.prText`, `t3code.branchPrefix`.

### 16.2 Someone who didn't write it

**Request** (new thread): Review pull request #41. Report what affects correctness or security; skip style.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A reviewer that didn't write it reads the change. It has none of the author's reasoning in its window. | `Read 4 files` | Reviewer (peer) at the gate. "didn't write it" | E |
| 2 | It finds one: the swap request takes any shift id. Bea can move Sami's shift without Sami. | Reply: one finding. | Puck `bad` back to you. "anyone's shift" | App `/rota-open`: Bea picks Sami's shift |
| 3 | You send the finding to the author thread. It checks who's asking on every swap, adds a test, pushes. | `Changed 2 files`, `Ran command` (ok). | Gate `ok`. | App `/rota`: own shifts only |
| 4 | You read the review guide's stops and merge. | Merged. | Puck through the gate to main. | E |

**Answer** (the reviewer):

> One finding, security: the swap request trusts the shift id from the page. Any signed-in staff member can request a swap on someone else's shift, and if the other person accepts, both shifts move without the owner. Check that the shift belongs to the person asking.
>
> Nothing else affects correctness.

**By level.** *Technical:* a reviewer asked to find problems will always find something; asking for correctness and security only keeps the list short. *Engineer:* a same-model reviewer is a fresh pair of eyes, not a smarter one.

**Facts.** `harnesses.claudeCode.codeReview`, `harnesses.claudeCode.reviewerAlwaysFinds`, `harnesses.claudeCode.sameModelReviewer`, new `t3code.reviewGuides`.

### 16.3 Show it before it ships

**Request:** Bea should try the new stock page on her phone tonight before it goes live. *It must never be public.* *Done when* only addresses I allow can open it.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | Your laptop's preview reaches only your laptop. Bea's phone is somewhere else. | | Users beyond main; Bea (user) far off. "can't reach your laptop" | E |
| 2 | It deploys a preview and puts a one-time code in front: only addresses you allow get in. | `Ran 2 commands` (ok) | Gate before Bea. "email, then a code" | App `/gate` |
| 3 | Bea enters her email, gets a code and is in. | | Puck from Bea through the gate. | App `/gate` → `/stock` |
| 4 | Not GitHub Pages: a Pages site is public even from a private repository. | Reply. | | App `/stock` |

**Answer.**

> The stock page is on a preview address behind a one-time code. Only the emails on your list get a code: yours and Bea's.
>
> For your own devices only, tailscale serve would do, but Bea isn't on your tailnet. I didn't use GitHub Pages: its sites are public.

**Facts.** `claims.hosting.cloudflareAccess`, `claims.hosting.tailscaleServe`, `claims.hosting.tailscalePersonal`, `claims.hosting.githubPagesPublic`.

### 16.4 Her question waits for you

**Request** (you share the stock thread with Bea through a guest link): no request from you; Bea writes: "Can it show when the last delivery came?"

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | You share the thread with Bea through a guest link. She sees the thread as it streams; she can't change it. | Thread status **Request** *(appears, highlighted)*: her message waits at the end. | A user puck rests before the agent (`rest`). "waits for you" | App `/stock` |
| 2 | Her message runs only when you send it, and then with the thread's permission mode. Read it as you'd read anything pasted from a chat. | You choose Send. | Puck moves into the window. | App |
| 3 | Anything the agent read or printed can show to her. That's why this thread never opened the guest list. | `Changed 2 files`, `Ran command` (ok). Reply. | "she sees the thread" | App `/stock` with "Last delivery: Tue 10:40" |

**Answer.**

> The stock page now shows when each item last came in, from the delivery notes you enter on /bar/deliveries. Lime: Tuesday 10:40.

**Facts.** new `t3code.guestLinks`, `t3code.screen.statuses` (Request).

**After lesson 16 the reader can** ship changes as pull requests with their checks in the description, get a review from something that didn't write the code, share a preview privately, and handle a guest's message before it runs.

---

## Lesson 17, Other machines

**Story beat.** Saturday of week 6. The Saturday report (last night in numbers) took you an hour each week by hand.

v1 mechanism: `where.ts` (jobs standing on the machine they run on: a laptop whose lid closes, an always-on computer, the cloud that starts empty). Starting state: `jobs(1, { machines: ['laptop'] })`, growing to `jobs(2)` and `jobs(3)`.

New in the app: the **Run on** picker under the composer, naming the machine.

### 17.1 The lid closes

**Request** (18:00, on your laptop): Every Saturday, the night report: arrivals by hour, what ran low at the bar, and each promoter's payout. *Done when* the report for last Friday is ready, with made-up data where a check needs it.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | It starts on your laptop: the thread, the tools and the files are all there. | Run on: your laptop *(appears)*. `Read 4 files`. | j0 on a laptop slab, lamp `work`. "your laptop" | App `/report`: Cannot GET |
| 2 | You close the lid to go to the club. The laptop sleeps, and the work stops with it. | Status stays Working, no new rows. | Laptop `off`, j0 faint. "asleep: stopped" | App, same |
| 3 | The phone app is a remote: it shows the thread, but the computer does the work and has to stay on. | | A phone beside you. "the phone only watches" | E |

**Facts.** `t3code.phoneIsRemote`, `t3code.remote`, new `t3code.screen.runOn`.

### 17.2 A computer that stays on

**Request** (on the office mini PC): same report, and *every Saturday at 10:00, without me.*

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | An old mini PC in the office runs T3 Code as a background service. It stays on. | Run on: office. | j1 on a box slab. "office: always on" | E |
| 2 | Your laptop and phone reach it through T3 Connect or your tailnet, from anywhere. | | Phone puck to the box. | E |
| 3 | The report runs there while your laptop sleeps. | `Read 4 files`, `Changed 3 files`, `Ran command` (ok). | j1 `work` → `ok`; laptop `off`. | App `/report` |
| 4 | Every Saturday at 10:00 it runs again on its own: a scheduled task on the machine that stays on. | Reply. | "Saturdays 10:00" at j1. | App `/report` |

**Facts.** new `t3code.backgroundService`, `t3code.remote`, `t3code.connectMachines`, `t3code.scheduledTasks`.

### 17.3 The cloud starts from GitHub

**Request** (from your phone, a cloud session on the Lantern's GitHub repository): The report's hour chart is off by one after the clocks changed. Fix it. *Done when* the report checks pass.

| # | Say | Chat | Explainer | Browser |
|---|---|---|---|---|
| 1 | A cloud session gets a fresh machine that clones your GitHub repository, not your laptop's folder. | | j2 on a cloud slab. "a fresh machine" | E |
| 2 | The practice guests from lesson 8 are made on your laptop and never committed. Here they don't exist, so the checks can't run. | `Ran command` (bad) "no practice data". | j2 lamp `bad`. "nothing to test with" | E |
| 3 | A setup script runs before the agent starts. Yours makes the made-up practice guests. Real guests never leave the club's machines. | `Changed files` (setup script). | j2 `ok`. "setup: made-up guests" | E |
| 4 | It fixes the hour, the checks pass, and the fix comes back as a pull request. It counts toward the same plan limits. | `Ran command` (ok). Reply. | Puck to main via the gate. | App `/report` |

**Facts.** new `harnesses.claudeCode.cloudClone`, new `harnesses.claudeCode.cloudSetup`, new `harnesses.claudeCode.cloudKeepsRunning`, new `harnesses.claudeCode.cloudUsage`.

**After lesson 17 the reader can** say which machine a thread runs on and what happens when it sleeps, keep long or scheduled work on a machine that stays on, and set up a cloud session with made-up data instead of real data.

---

## Set up

Unnumbered. Practical: what to install and connect, in order, with the Lantern as the example. The sidebar folder is **Set up**; the threads are **Providers**, **Git and hosting** and **First setup**. Lesson 2 starts in the project that First setup makes.

### Providers

**S1.1 Install it and find your agents.** Request: "Set up T3 Code on this computer so I can start." T3 Code installs as a desktop app (macOS, Windows, Linux), with `npx t3@latest`, or with the command-line installer. The Welcome page lists the agents it finds. For Claude Code, Install or Sign in opens a terminal with the command ready; for Codex, Set up offers sign-in with a ChatGPT account and installs Codex itself. T3 Code is free and drives the agents with your own logins. An agent that doesn't show up is almost always not installed or not on the PATH.

**S1.2 A plan, not a key.** Claude Code is not on Claude Free; Pro is $20 a month, Max $100 (5× Pro), Ultra $200 (10× Pro per week). Codex is on every ChatGPT plan, Free included; Plus is $20. A plan is cheaper for daily agent work than per-token API billing.

**S1.3 Where your code goes.** Code and prompts go from your machine to your provider, not to T3. On Claude consumer plans, training on your chats and code is a setting you choose. Use made-up data in examples.

**Facts.** `t3code.install`, `t3code.welcome`, `t3code.price`, `t3code.ownLogins`, `t3code.codexWithChatGPT`, `t3code.providerMissing`, `plans.claude.free.claudeCode`, `plans.claude.pro.price`, `plans.claude.max.price`, `plans.claude.max.usage`, `plans.claude.ultra.price`, `plans.claude.ultra.usage`, `plans.chatgpt.limits.codexOnEveryPlan`, `plans.chatgpt.plus.price`, `t3code.codeNotToT3`, `claims.privacy.claudeConsumer`.

### Git and hosting

**S2.1 Git on this machine.** Git needs your name and email to commit. Each commit is a point you can go back to. **S2.2 A private home on GitHub.** T3 Code needs a GitHub token (saved, GH_TOKEN, or `gh auth login`). New project can create a private repository on GitHub; Publish Repository does it for a folder that has none. **S2.3 Somewhere to host it.** Static files are free on Cloudflare; a private preview needs access control in front. Secrets go in the host's environment settings, never in the repository.

**Facts.** `t3code.githubAuth`, new `t3code.publishRepo`, `t3code.newProject`, `claims.hosting.cloudflareStatic`, `claims.hosting.cloudflarePaid`, `claims.hosting.cloudflareAccess`, `claims.hosting.githubPagesPublic`.

### First setup

**S3.1 A new project.** New project makes a Git repository in `~/.t3/projects` with a README, an icon and a first commit, then opens a thread in it. **S3.2 Notes it reads first.** The first thread writes AGENTS.md: what the Lantern is, tonight's list is made up, never put real guests' phone numbers in the repo. Claude Code's `/init` drafts one. **S3.3 See it run.** It starts the dev server; the thread details list the local server, and selecting it opens the page in the browser panel. New threads start in Full access unless you change the default.

**Facts.** `t3code.newProject`, `harnesses.claudeCode.init`, `harnesses.claudeCode.contextFile`, `t3code.localServers`, `t3code.browser`, `t3code.defaultMode`, `t3code.modeSwitch`.

---

## New facts, in one place

All read on 2026-11-23 from `https://github.com/pingdotgg/t3code/blob/main/` (commit 7b47a21) or `code.claude.com/docs`:

- `t3code.screen.limitWindows`: `apps/server/src/provider/claudeUsageLimits.ts` (Session, Weekly)
- `t3code.usageLimitsInThread`: `docs/user/usage.md` (`/usage-limits`; Settings → Appearance → Thread details)
- `t3code.screen.runOn`: `apps/web/src/components/BranchToolbarEnvironmentSelector.tsx`
- `t3code.guestLinks`: `docs/user/guest-links.md`
- `t3code.prText`, `t3code.reviewGuides`, `t3code.publishRepo`: `docs/user/source-control.md`
- `t3code.backgroundService`: `docs/user/background-service.md`
- `harnesses.claudeCode.cloudClone`, `cloudKeepsRunning`, `cloudUsage`: `code.claude.com/docs/en/claude-code-on-the-web`
- `harnesses.claudeCode.cloudSetup`: `code.claude.com/docs/en/cloud-environments`

## Open questions

1. **Where the usage meter lives.** T3 Code's real Usage limits sit at the bottom of the thread details card, behind a setting. The drawing shows them in the same popover as the context window, from 14.1 on.
2. **The model chip in 14.3.** The chip in the composer slot shows the model's name; the drawing appends the effort ("Haiku 5.5 · low") to show the dial. T3 Code shows effort in its own picker.
3. **Cloudflare Access is named, not drawn.** The `gate` stage is a generic one-time-code page so it can't pass for Cloudflare's own screen.
