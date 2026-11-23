# Guide v2 build: lessons 14 to 17 and Set up (range `l14-17`)

Script: [lessons-14-17-setup.md](lessons-14-17-setup.md). Preview route: Portless `guide-v2-l14-17`.

## What I built

- **Lesson 14, Cost** (`v2/lessons/l14.ts`, 4 parts): a long thread costs more per step; Limited; a small job on a small model; a judgement on a big model. Picture: v1's `meter.ts` idea, a plan meter beside the model that drains one `sum` puck per request.
- **Lesson 15, The project grows** (`l15.ts`, 3 parts): it reads more before it starts (and edits a dead copy); a clean-up is its own job; a refactor kept honest by lesson 3's promoter checks. Picture: v1's `grow.ts` stacks and junk on the file tiles.
- **Lesson 16, Other people** (`l16.ts`, 4 parts): a pull request, not a push; a reviewer that didn't write it; a private preview behind a one-time code; a guest's message that waits (Request). Picture: v1's `people.ts` (`ship()`), with a second agent for the author thread and a private gate before Bea.
- **Lesson 17, Other machines** (`l17.ts`, 3 parts): the lid closes; a computer that stays on (background service, scheduled task); the cloud starts from GitHub (setup script with made-up data). Picture: v1's `where.ts` (`jobs()` on laptop, box and cloud slabs).
- **Set up** (`s-providers.ts`, `s-git-and-hosting.ts`, `s-first-setup.ts`, 3 parts each): find your agents, a plan not a key, where your words go; Git, a GitHub account T3 Code can use, where it will live; a new project, notes it reads first (AGENTS.md + a CLAUDE.md import), see it run. First setup makes the project lesson 2 opens.
- **Preview app** `v2/preview/staff.ts` (+ `staff.css`, `staff/*.ts`): the Lantern's staff app, one app for the whole chapter. Tabs Tonight, Bar, Rota, Payouts, Report; a one-time-code gate; stages `none`/`none-<path>`, `starter`, `bar`, `bar-ale`, `bar-sorted`, `payouts`, `payouts-why`, `payouts-broken`, `tables-missing`, `tables`, `swap-open`, `swap`, `gate`, `stock`, `stock-delivery`, `report`. State (taps, check-ins, a swap, the gate pass) survives stage changes. Built by a subagent from my brief; I wired and checked it.

## Shared-file changes (all small, additive, commented)

- `v2/content.ts`
  - `Move` gets `{ to: 'path'; path; kind; ms? }`: a puck along any floor route, for scenes beyond one agent and its tools (meter, gate before main, people, machines).
  - `Ui` gets `limits` (Usage limits rows), `modelName` (the model chip's words when not the default; `''` resets) and `env` (the "Run on" chip; `''` hides).
- `v2/lessons/index.ts`: the glob also picks up `./s-*.ts`, so the Set up threads (ids `s-…`) play.
- `v2/player.ts`
  - `move()` handles `to: 'path'`.
  - Two more sidebar status icons, Limited (CircleAlert) and Request (UserRound); `statusKey` maps any status with an icon.
  - `showUi()`: the model chip text, the Run on chip, and Usage limits rows in the thread details (the details button shows when there is a context value or limits; its short value falls back to the lowest "% left").
  - The part list header reads "Set up · Providers" for unnumbered threads instead of "Lesson undefined".
- `pages/v2/index.astro`: the details popover wraps the context block (`data-ctx-sec`) and adds a Usage limits block; a Run on chip (with a machine icon) in the composer chips.
- `styles/v2.css`: an appended block for the two statuses, the limits rows and the Run on chip.
- `data/t3code.ts`: new facts `usageLimitsInThread`, `guestLinks`, `prText`, `reviewGuides`, `publishRepo`, `backgroundService`, `screen.limitWindows`, `screen.runOn` (read on main at 7b47a21, 2026-11-23).
- `data/harnesses.ts`: `claudeCode.cloudClone`, `cloudSetup`, `cloudKeepsRunning`, `cloudUsage` (code.claude.com, 2026-11-23).
- `guides/fact-check.md` regenerated.

## Decisions

- **Usage limits live in the thread details popover**, under the context window, as T3 Code draws them at the bottom of its thread details card. They appear at 14.1 and stay. Example numbers, marked "example".
- **The model chip names model and effort in lesson 14** ("Haiku 5.5 · low"). T3 Code keeps effort in its own picker; this is the drawing's shorthand. Lesson 15 resets it.
- **Lesson 17 part 3 is not in T3 Code**: T3 Code runs agents on your own machines. The lede says the cloud session is Claude Code on the web, started from the Claude app.
- **The one-time-code gate is generic**, not Cloudflare's screen, so it can't pass for a real company's page. The reply names Cloudflare Access as the tool.
- **Set up order**: Providers → Git and hosting → First setup. First setup's project is published privately with "Create private repository on GitHub", which Git and hosting prepares.
- **No new cast** beyond the office mini PC. The reviewer in 16.2 is an agent in a new thread, not a person.

## Open questions

1. Lessons 3–13 are built elsewhere. Lesson 15 sets `ui.context` (it may already be set by lesson 5 after the merge) and refers to lesson 3's promoter checks, lesson 6's AGENTS.md and lesson 8's practice guests by name. If those lessons changed their story, these references need a look.
2. The sidebar's Request status in 16.4 sits on the story-thread row; T3 Code puts it on the thread the guest wrote to, which is the same.
3. `uiAt` accumulates in table-of-contents order, so the Set up threads (last in the TOC) inherit everything taught before them. Each Set up thread resets `env`, `limits` and `modelName` on its first point; the permission chip and context from earlier lessons still show.

## Critique log

### Round 0: my own pass, before the testers (1440×900 light, 390×844 dark)

- **Annotations over the drawing.** First screenshots had notes sitting on the window tank (14.1), on the meter (14.1–14.2), on the model's cap (14.3) and on the check post (15.1). Fixed by fixed annotation spots per lesson (`byWindow`, `byMeter`, `byGate`, `onTile`) and by naming the model and effort in the agent's own label instead of a second label beside it.
- **The reply landed at the wrong point** in lessons 15 and 16: the player lands a reply at the first move `to: 'you'`, and my gate and path moves didn't count. Replies now travel `to: 'you'` (which passes the gate on its way).
- **14.4 went "back" into the payout thread** and then claimed a mid-thread switch broke the cache; that doubled the thread row in the sidebar and taught the opposite of the point. It is now a new thread, with the model and effort chosen at its start.
- **17.1 said "Worked for 4m 20s"** over a turn that never finished (the laptop slept). The part now has no work log and no reply.
- **16.2 drew the reviewer as a person.** It is an agent in a new thread; the author thread stands behind the bus.
- **16.3's private gate sat on top of main**, with Bea among the staff. Bea now stands alone beyond the gate; the picture is still small (see below).
- **Claims tightened to their sources:** "cheaper, and quicker" (no source for quicker) → "at a fraction of the price"; "reads everything at full price" → "miss some or all of the cache"; "the payouts would double" → "come out too high" (the staff app's broken stage shows €190 against €140).

### Round 1: three Haiku testers

Screenshots: `~/.local/state/agent-artifacts/vibecoding-guide/guide-v2/l14-17/haiku-1/` (l14–17, 1440×900 light), `haiku-2/` (l16–17, 390×844 dark), `haiku-3/` (Set up, 1024×768 dark). No console errors from the pages, no sideways scroll in any run.

What they found, and what I did:

- **17.2 showed "Cannot GET /payouts"** for the office machine before the report existed. Real bug (the staff app's bare `none` stage defaults to /payouts): now `none-report`.
- **Annotations still touching the drawing**: "3 threads, one plan" and "more per step" on the plan meter's base (14), "its own copy, its own branch" on you (16.1), "nothing uses these" on the tiles (15.2), Set up labels running off the left edge at 1024 px. Moved them to clear spots and shortened the Set up frame labels ("the model, at the provider", "your laptop: tools and files").
- **"A fraction of the price" had no number.** The point now says it: Opus 5.5 cache read $0.20 per million tokens against $4 for fresh input, from `models.ts`.
- **Set up wasn't followable as instructions.** The Providers lede now says step one (the desktop app from t3.codes, or `npx t3@latest`) and the technical note gives the command-line install from `t3code.cliInstall`. "Before the first Thursday" is now "the week before lesson 1".
- **Rota button said "Ask Sami" after picking Jakob** (haiku-2). Not reproduced: a scripted pick of Jakob gives "Ask Jakob". Probably a click during a stage change.
- **Not acted on:** the "Review 0" pill (the site's dev-only comments tool, not in the build); `localhost:4321/...` in the Preview's address bar (deliberate: the app is a dev server in the story, and NOTES asks for make-believe localhost addresses); auto-advance into the next lesson at a lesson's end (player behaviour shared by all lessons); annotation links under 44 px on a phone (the picture engine's, all lessons).

### My critique after round 1 (what the testers missed)

- **Lessons 16 and 17 draw small.** `ship()` and `jobs()` frame wide floors, so the picture sits in a band with a lot of empty panel above. The private gate and Bea in 16.3 are tiny.
- **The usage limits are taught but hidden.** They live in the thread-details popover, which never opens by itself; a reader sees "64% left" on the button and the meter in the picture, and only sees the rows if they click.
- **The staff app's Report and Payouts showed a real-looking date** ("Fri 14 Nov") while the story only uses relative days. Now "Last Friday".
- **14.1's "fresh thread" point** shows a short window on the same agent: the picture can't show two threads side by side without a second scene, so the comparison is told more than shown.

### Round 2: two Haiku testers (1440×900 light on l14–17; 390×844 dark on Set up and l17)

Screenshots in `haiku-4/` and `haiku-5/`. No console errors, no sideways scroll. The desktop pass found no annotation over the drawing beyond "pull request" touching its connector line in 16.4. Its other two points were by design: /report doesn't exist before 17.1's report runs, and the $0.20 / $4 figures come from `models.ts`. The phone pass asked how a phone opens the first page at localhost; the first-setup reply now says localhost only opens on this computer and points to lessons 16 and 17. Its other points are shared design (try-it prompts truncate on a phone; a lesson's end runs into the next lesson).

## What I still don't like

- **Lessons 16 and 17 draw small** in the browser panel: `ship()` and `jobs()` frame wide floors, so the picture is a band with empty space above it. 16.3's private gate and Bea are tiny.
- **Annotation placement is hand-tuned per spot** (`byMeter`, `byWindow`, `byGate`, world points). It holds at 1440 and mostly at 1024; at narrow panels labels still crowd the meter in lesson 14 and the laptop slab in Set up. The engine needs collision-aware placement, not more hand spots.
- **Usage limits are hidden behind a click.** The rows are in the thread-details popover, which never opens on its own; the lesson teaches them through the meter in the picture and the "% left" on the button.
- **14.1's "fresh thread" comparison** happens on the same agent in the picture. Two windows side by side would show it better.
- **17.3 leaves T3 Code** for a Claude Code cloud session, while the drawing stays T3 Code's chat. The lede says so, but the chrome (Run on chip hidden, same sidebar) doesn't.
- **Set up is a story, not a checklist.** The steps are right and sourced, but a newcomer who wants a list has to collect it from three threads' replies and try-its.
- **The staff app was built by a subagent** from my brief. I checked every stage the lessons use, not every interaction in every stage.
