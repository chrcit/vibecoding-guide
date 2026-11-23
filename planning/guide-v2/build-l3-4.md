# Guide v2: lessons 3 and 4 (build notes, range `l3-4`)

Chapter 1 "Hand it over" is complete: lesson 3 "Done when" and lesson 4 "Start another", from the scripts in `lessons-3-8.md`. Preview route on Portless: `guide-v2-l3-4`.

## What I built

### Lesson 3, Done when (`site/src/v2/lessons/l3.ts`)

One story thread, "Promoter links", Friday 11:30 to 12:40. Four parts, all turns of that thread:

1. **A check that stays.** A product-slice request with two checks in its done-when. It writes them as tests first, the door check fails (Kai's guests missing at the door), it fixes the door search, both pass, and the checks stay in the project.
2. **Must never.** The must-never becomes a test that tries: Kai's numbered link `/p/7` changed by one character opens Noor's list `/p/8`. Long random links and an ownership check fix it. The reply names what isn't covered (a forwarded real link).
3. **What nobody wrote down.** The Promoters overview: every check passes, and you see Kai's 20 guests bring 9 plus-ones, so 29 people on a limit of 20. Nobody wrote down that plus-ones count.
4. **Keep going until done.** `/goal`: the row says **Goal**, a goal line sits at the end of the thread ("Pursuing goal · n checks", the objective, Clear), two older checks fail, the agent goes again without handing back, and the goal completes ("Goal complete"). The row goes to Done.

The picture is v1's `solo({ tools, project, gate })`, so the check between the agent and you carries each part: "your done-when: 2 checks", "1 of 2 pass", "leak found", "passed: nobody asked", "goal: stays set", "met: its judgement".

### Lesson 4, Start another (`site/src/v2/lessons/l4.ts`)

Several story threads at once, Friday 13:00 to 14:10. The sidebar lists every story thread under the lesson row, each with its own status, at every point:

1. **Don't watch it work.** While "Promoter links" works (Working), you start "Bar running low" with mod+Enter (background send). Both rows say Working; the bar finishes first and says Done while the promoter thread keeps working. The point text says what the default sidebar does (a Working section that folds working threads) without drawing it, because the guide draws the project-folder sidebar, where T3 Code turns that section off (see facts).
2. **Queue it while it works.** The chat switches to "Promoter links" with its earlier turn still running ("Working for …", a row growing). Your phone-number rule waits under it as T3 Code's queued message: a dashed, unfilled bubble with Send now, edit and remove under it. When the running turn ends ("Worked for …" folds it, its reply lands), the queued message becomes a sent bubble and the turn plays. The phone rule is planted here for lesson 5.
3. **Same folder, same files.** "Tonight's rota" starts in the current checkout (the workspace control "Current checkout" appears under the composer, highlighted). Both threads edit the menu file, each fails on the other's half-done code, and the bar page stops building (Preview: a build-error overlay). The rota thread sees changes it didn't make, takes its own back out, and hands itself off to a new worktree: the work-log row is T3 Code's own "Handed off thread to a git worktree", and the composer shows the worktree folder and the branch `t3/rota-tonight`. The deeper note says not to count on the agent doing this: choose New worktree before you send.
4. **How many at once.** Four threads, three Done at once; one of you reading; titles that say the job versus "fix"; the post comes back with its proof. The three-to-five threads figure is labelled as the guide's observation.

The picture is v1's `jobs(n, { projects: 'one' })`: windows per thread, a tray card per thread, pucks from you to each job, a resting puck for the queued message, the shared project tile marked bad, then `tree: 'own'` for the worktree.

### Preview apps (`site/src/v2/preview/`)

All one product with the door: the same dark, warm Lantern palette, list hues and type (`lantern/lantern.css`, shared helpers in `lantern/ui.ts`).

- **`promoters.ts`**: a promoter's link page (count as the headline, one pip per spot, plus-ones as smaller pips, over-limit pips red, newest guests first, the add form in the thumb zone with plus-ones as a segmented control, validation for empty and duplicate names and a full list, a phone field and remove buttons in lesson 4) and the owner's Promoters page (totals, a card per promoter, "Full" / "Over by n" / "Closed" badges, a working limit stepper, the 9 plus-ones marked in 3.3). Stages listed at the top of the file.
- **`lantern/store.ts`**: the promoters' guests, shared with the door, so a guest you add through Kai's link turns up when you search the door. Made-up phone numbers come from the UK's drama range (+44 7700 900xxx).
- **`door.ts`** (extended, nothing removed): stages `promo-missing` (the first promoter version left their guests off the door) and `promo` (Kai's and Noor's lists are what they added). Both open with "lea" typed, so Lea Brandt shows as on Kai's list, or "Not on tonight's list" in the bug stage.
- **`bar.ts`**: running-low tiles with drawn icons, who-is-tapping chips, a second tap refused with a shake and "already on the list", undo for five seconds, the Order tab with who and when and Copy list, and a `broken` stage (build error in `src/rota.tsx`, imported by the menu every page uses).
- **`rota.ts`**: the night 22:00–05:00 on one screen, a lane per area and a bar per shift; find your shift by name or tap a bar for your own card (time, length, who's on with you).
- **`post.ts`**: tonight's post as it would read on a phone, with the request's checks under it (word count computed from the text: 61).

## Shared-file changes, and why

All additive and commented in place.

- **`content.ts` (types)**
  - `STATUS.goal` (lesson 3's Goal status, from `screen.statuses`).
  - `Move` `{ to: 'path', pts, kind, ms? }`: a puck along any polyline. Lesson 4's pucks go between several jobs; lesson 3's goal puck goes back from the gate to the agent.
  - `Ui.checkout`: the workspace and branch controls under the composer, taught in 4.3 and kept after.
  - `StoryThread` and `Point.threads`: every story thread in the sidebar at a point, each with its own status and the part it opens. Without it, the sidebar behaves as before (lesson 1).
  - `Part.running`, `Part.queued`: a turn of the same thread still running, and the request waiting as a queued message until a point.
  - `Part.goal`: the goal line.
  - `Part.resumes`: with `fresh`, the chat switches to an existing story thread, so the part isn't labelled "New thread".
- **`player.ts`**: Goal's icon and colour in the status map; the `path` move; story threads in `showSidebar` (per-point list and statuses, current thread marked, rows without a part are disabled); the main "Working for …" hides while the request is queued; `fillTurn` calls `fillExtras`; `showUi` paints the checkout chips; `wireExtras` for the running turn's fold. The drawing of the extras lives in the new `v2/ui/turnextras.ts`.
- **`index.astro`**: markup for the running turn, the queued message's controls, the goal line, the two checkout chips, and the "New thread" label skipped for `resumes`.
- **`v2.css`**: one block at the end for Goal's colour, the running turn, the queued bubble, the goal line and the checkout chips.
- **`t3code.ts`**: new facts (below).
- **`door.ts`** and **`preview/index.ts`**: the two door stages and their types.

## New facts (`t3code.ts`, read on `main` at 7b47a21, 2026-11-23)

- `goal`: what `/goal` does, the Goal status, the goal line, per-provider stop behaviour (`docs/user/composer.md`).
- `screen.goalLine`: "Pursuing goal", "Goal complete", "{count} checks", "Clear" (`ThreadActivityBanners.tsx`, `threadExecution.ts`).
- `workingSection`: the default Working section, and that it is off with project folders (`docs/user/thread-sidebar.md`).
- `sameCheckout`: one checkout shares its branch; New worktree for a separate branch and folder (`thread-sidebar.md`).
- `worktreeHandoff`: an agent in a thread can move it to a new worktree on a new branch; the row "Handed off thread to a git worktree" (`apps/server/src/mcp/toolkits/worktree/tools.ts`, `t3ToolSentences.ts`).
- `followUpDefault`: a follow-up steers by default; mod+Enter queues (`packages/contracts/src/settings.ts`).
- `threadTitles`: Regenerate title, and F2 renames the focused thread (`keyboard-focus.md`, `thread-sidebar.md`).
- `screen.queued`: the dashed queued bubble with Send now, Edit queued message, Remove queued message (`QueuedRunsControl.tsx`).
- `screen.workspace`: "Current checkout", "New worktree" (`BranchToolbar.logic.ts`).

## Decisions and deviations from the script

- **The story threads are in the sidebar**, as the task asked (the script's open question 2 suggested inline summaries instead). They sit under the lesson row, like lesson 1's second thread, each with its own status. There is no "inline thread summary" card: it isn't a T3 Code element.
- **No Working section is drawn.** The guide's sidebar is T3 Code's project-folder view, and in that mode T3 Code turns the Working section off. The point text and the fact say what the default sidebar does.
- **The promoter thread in 4.1 works on a follow-up** ("remove a guest until 22:00"), not on the lesson-3 goal, which finished at 12:40.
- **Steer is the default.** The script had the queued message typed and queued; T3 Code's default follow-up is Steer, so the part says it was sent with mod+Enter to queue it, and that Enter would have steered.
- **The worktree move is the agent's handoff tool**, a real T3 Code tool and work-log row. The script had the thread "restarted in New worktree", which T3 Code doesn't do for a running thread. The handoff doesn't carry uncommitted changes, so the rota thread takes its changes out as a patch and applies them in the worktree.
- **Turn counting in the goal.** The script numbered "turn 1, turn 3". How T3 Code renders goal continuations isn't sourced, so the log grows as one "Working for …" and the words say "goes again".
- **Noor has 11 guests and 3 plus-ones** (14 on 15), so only Kai is over once plus-ones count, and Noor's page still takes one guest in lesson 4.

## Open questions

- The "not built yet" note still says "Lessons 1 and 2 play" (`index.astro`, `player.ts`). I left it alone because every parallel range would edit the same line; the holistic pass should make it generic.
- The door's original Kai and Noor lists (lesson 2) are replaced by the promoters' own lists in the `promo` stages. If lesson 2's numbers are meant to carry forward, the seeds should be reconciled.
- Several Preview apps run a simulated night (the door at 22:41, the bar at 23:20) while the lessons run in the afternoon. Same known issue as lesson 2.

## Critique log

### My own pass, before the testers (1440×900 light, 390×844 dark)

- 4.2 drew the main turn's work log (its Skill row) under the queued bubble, so the queued message seemed to have started already. **Fixed:** the main log stays hidden until the message is sent.
- 4.2 said "New thread" over a thread that already existed. **Fixed:** `Part.resumes`.
- Annotations ran over the drawing: "your done-when: 2 checks" across the gate, "Kai's guests missing" over the tools, "its own window" over a tank and track, "phone: never at the door" on a tank, "its own copy" on the bus track, "read it against your two checks" on the track to the tools. **Fixed:** shorter gate words ("2 checks", "1 of 2 pass", "leak found", "nobody asked", "goal set", "all pass"); tool-side duplicates removed; window notes moved over the heads ("promoters only", "lime only"); lesson 3's notes for you sit under your figure.
- Preview apps: headers sat at the panel edge while the body was centred; the leak badge covered Noor's header; the build-error code block took the site's light `pre` background (`!important` in global.css). **Fixed** (header in the same column, badge at the bottom, the overlay sets `--paper-2`).
- The "29 people" tag on the Promoters page sat on the capacity bar. **Fixed:** it is inline under the plus-ones figure.

### Haiku round 1 (three testers: 1440×900 light, 390×844 dark, 1024×768 dark)

What they found that was real, and what I did:

- **All three hit "Cannot GET /p/7" or "Cannot GET /bar" and read it as broken.** Lesson 2 does the same on purpose (the dev server before the page exists), but in my lessons it added nothing. **Fixed:** until the new page exists, the Preview shows the app as it already is (the door in 3.1, the Promoters page in 4.1). The `none` stages stay in the apps but no point uses them.
- Annotations on figures: "queued" on the "you" figure (4.2), "you meant 20 people" over the track (3.3). **Fixed** (the queued puck moved left, label on top; notes for you under the figure).
- "mod+Enter" unexplained. **Fixed** in 4.1's point text: "Cmd+Enter on a Mac, Ctrl+Enter elsewhere".
- Touch targets in the apps under 44 px on a phone (limit steppers 40×36, Copy 40, rota shift bars 36). **Fixed** under `pointer: coarse`. "Cloakroom" ran into a shift bar. **Fixed** (wider area column).

What I didn't act on, and why:

- "Review 0" and the dark pill at the bottom: the dev-only comments overlay and Astro's dev toolbar; `check-dist` confirms neither ships.
- The `dataset` page error on every load: the testers' own init script set the theme before `<html>` existed.
- "Label the sidebar threads", "rewrite 'Handed off thread to a git worktree' in plain words": the rows and the label are T3 Code's own. The plain gloss is in the row's detail.
- "Two counters disagree" (composer "Point 4 of 4" and the explainer dots): shared player design, not this range.
- Story threads keep their statuses when you replay a part: that's the story's state at that point, by design.
- Forward references ("Lesson 5 shows…", "Lesson 8…"): kept; the sidebar is the table of contents.

### Haiku round 2 (confirmation: 1440×900 light, 390×844 dark)

- No "Cannot GET" or error page in any Preview, no console or page errors, no sideways scroll. Real taps worked: adding a guest on Noor's page, the bar's double tap and the Order tab, the door search, the limit stepper.
- Lesson 4's annotations over neighbouring jobs (the jobs stand close, so a label over one tower covered the next): "promoters only"/"lime only", "fails on rota's code"/"fails on bar's code", "fix"/"Tonight's rota" overlapping each other, "nothing needs you" on the tray. **Fixed:** one label over the jobs per point, the rest in open space ("knows only about lime"; "each fails on the other's change" under the shared project; "fix" on the leftmost job and the post's label to the right of the rightmost; "nothing needs you" under your figure).
- The bar's who-is-tapping chips were 36 px on a phone. **Fixed** (44 px under `pointer: coarse`).
- Not acted on: labels resting on the gate's top edge in lesson 3 (the engine's 'left'-of-gate placement, the same as lesson 2's "your three cases"); "Next" carries on into the next part (shared player design); the mini picture's labels measured slightly past 390 px inside a clipped container (shared fit code).

## What I still don't like

- **Gate annotations sit on the gate's top edge** in every lesson-3 point. It's the engine's placement and matches lesson 2, but a cleaner anchor point just left of the gate would clear it. That's a picture-engine change for a holistic pass.
- **Lesson 4's picture is small and sparse at 1440.** Four columns in a row read as a diagram of threads, but the windows' contents barely show, so "its own window" is said more than seen. A zoom on the two windows in 4.1 point 4 would teach it better.
- **The goal's continuation is one long log.** T3 Code may draw goal continuations as separate runs; I didn't source how, so 3.4 shows one "Working for …" that grows. If the real app shows separate "Worked for" groups, 3.4 should too.
- **4.3's handoff is the agent's own idea.** It's real T3 Code behaviour (the tool and the row exist), but it makes the lesson read as "the agent fixes it" when the habit to teach is "pick New worktree before you send". The deeper note says so; a holistic pass might make the reader ask for the move instead (a steered message), which would also show steering.
- **The Preview apps run a simulated night** (bar 23:20, door 22:41) while the lessons run in the afternoon.
- **The checkout chips wrap onto a second line** in the composer at 1440 once the branch shows (model, permissions, folder, branch). T3 Code puts them in a separate toolbar under the composer; the guide's composer has one row.
- **Story-thread rows truncate** ("Bar running …") in the 15–16rem sidebar when a status shows.
- **"Not built yet" copy** still says lessons 1 and 2 play.
