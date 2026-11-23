# Guide v2: build notes for lessons 5 and 6 (range `l5-6`)

Built from `lessons-3-8.md` ("Lesson 5" and "Lesson 6") and the brief in `brief-lessons.md`. Lessons 3 and 4 were built in parallel elsewhere; nothing here depends on their code, but the story follows the script's cast and threads: the **Promoter links** thread (lesson 3), the **phone rule** queued into it at 13:00 (lesson 4), Kai and Noor, Sami at the door, Lea Brandt and Ana Lopez.

## What I built

### Lesson 5, The window fills (`site/src/v2/lessons/l5.ts`)

Friday 16:00 to 16:40. Four parts, five points each.

1. **Everything stays in** (Promoter links). A small question to a thread that has worked since 11:30. The thread details open on the context window (72%, then 85% and amber). The picture is v1's window pile (`chapters/window.ts`): the phone rule is a short slab low in the stack, labelled.
2. **In the window isn't the same as followed** (same thread). Asked to let Sami reach late guests, it puts phone numbers on `/door/late`. 17 of 17 checks pass, because the 13:00 test only covered the door's search. The last point marks the number in the Preview as the rule it breaks.
3. **Compact, or start over** (same thread). You send `/compact` first: T3 Code's own row reads "Compacting context", then "Context compacted 920K → 90K tokens". The summary keeps what was built and drops the rule said in passing. The request then carries the rule, and the fix holds. The last point sketches `/clear`: a faint "New session" divider, labelled as what `/clear` would leave.
4. **One job, one thread** (new thread, "Running late button"). A short window, one job, the rule in the request. Kai's page gets a "Running late" switch; the door sees it with no number. Last point: you've typed the phone rule three times today.

The context percentage is computed from the picture's own slabs (`pct()` in `l5.ts`), so the number in the thread details, the words in the composer and the height of the pile always agree. All of them are made up and relative.

### Lesson 6, Write it down (`site/src/v2/lessons/l6.ts`)

Friday 17:30 to 17:50, then "some Fridays later". Four parts.

1. **Every thread starts from zero** (new thread, "Regulars at the door"). No brief, no instructions file. It guesses `npx jest` (red row), finds `npm test`, builds a regulars star that comes out red with "10:41 PM", and never runs the door check.
2. **A file it reads first** (same thread). The request attaches today's threads with `@` as chips (a real T3 Code feature: the agent reads their history on demand). It writes `AGENTS.md`, shown in the Preview as a file. Then the picture shows the file going into a new thread's window before the first word, and which agent reads which file (Claude Code: CLAUDE.md, else AGENTS.md; Codex: AGENTS.md).
3. **Teach it once** (new thread, "Red means do not admit"). The file loads first. It makes the star gold, writes 22:41 without being told (the file says 24-hour), runs the door check unasked, and adds one line to AGENTS.md, shown as the turn's added line.
4. **Short beats long** (new thread, "Shorten AGENTS.md"). AGENTS.md is 240 lines; the door-check rule is on line 131 and was missed last Friday. It keeps the short rules and moves the steps into `.claude/skills/door-check/SKILL.md`. The skills shelf appears; the skill comes off the shelf; the work log shows T3 Code's `Skill: door-check` row; `/door/close` is the page it checks.

Restructured from the script, on purpose:
- The script's 6.2 put two threads in one part (write the file, then a new thread sends the regulars request again). A part is one turn, so the proof that a new thread follows the file moved into 6.3, which is a new thread and shows the file loading before the first word.
- The script's 6.4 needed two requests (build the checklist, then move steps into a skill). It is now one request, the restructure, with last Friday's miss in the lede, the request and the highlighted line 131.
- 5.3: the script's `/compact` became its own message before the request (the `command` field below), because in T3 Code a slash command is its own message and waits for the turn to finish.

### Preview apps

- `preview/lantern.ts` (+ `lantern.css`): the Lantern's other pages in the door page's dark look, with a tab bar in the thumb zone: `/promoters` (totals, cards that open to each list with numbers), `/door/late` (late promoter guests; stages: numbers and Call, the number marked as the broken rule, "Ask Kai" instead, "Running late · Kai" tags), `/p/kai` (Kai's list, "Running late" switches from lesson 5.4), `/door/close` (the closing checklist, ticks with times, "Locked up" at the end). State is shared across stages and mounts; switches on Kai's page show up on the door's late list. The address bar follows in-app navigation.
- `preview/file.ts` (+ `file.css`, `file/docs.ts`): a file viewer in T3 Code's theme, with line numbers, light Markdown colouring, an added line marked as the turn's change, a marked line with a note, and folds the reader can open. `docs.ts` holds AGENTS.md (first version, with the red rule, and the 240-line version with the door-check rule exactly on line 131) and the door-check SKILL.md; the lesson's replies count lines and rules from it.
- `preview/door.ts`: two new stages, `regularsRed` and `regulars` (a star on regulars, red with 12-hour time, then gold with 24-hour time). Existing stages unchanged.

## Shared-file changes, and why

All additive and commented in place.

- **`site/src/v2/content.ts`** (types only):
  - `Move`: `{ to: 'rules' }` (the agent writes the instructions file) and `{ to: 'load', from: 'rules' | 'skill' }` (the file or a skill goes into the window). Lesson 6 needs both; v1's memory chapter already draws them.
  - `Point.look`: adds `'context'`, which opens the thread details on the context window for that point.
  - `Part.chips` (threads attached with `@`), `Part.command` (a slash command sent before the request, with T3 Code's running and done rows and the point where the request follows), `Part.ghost` (a faint marker after the reply, for `/clear`'s "New session").
- **`site/src/v2/player.ts`**:
  - the two new moves;
  - `look: 'context'` opens the thread-details popover, and the next point closes it again (only if the point opened it);
  - the context row gets T3 Code's tones (warning from 80%, error from 90%) and its token text ("720k / 1m"), worked out from the example percentage and the model's 1M window;
  - `command` and `ghost` visibility per point in `fillTurn`;
  - a `v2:url` event from the Preview host updates the address bar when the reader follows a link inside an app;
  - **behaviour change**: a part's first point now starts its pucks from where the previous part ended when the thread continues (not `fresh`), instead of from an empty window. Without this, lesson 5's full window visibly emptied and refilled at every part. This also affects lessons 1 part 2 and lesson 2 parts 2–3, which now glide from the last picture instead of flashing an empty window. Points drawn without animation (keys, jumps, reduced motion) look exactly as before.
- **`site/src/pages/v2/index.astro`**: the context popover now draws T3 Code's row (label "Context", bar, tick where Claude Code compacts on its own, tokens; tooltip lines "Context: n% used" and "n of 1,000,000 tokens"); the command block, thread chips and the ghost divider in a turn; icons for compaction, the eraser and a thread chip; `Skill:` rows get the skill icon.
- **`site/src/styles/v2.css`**: one appended block for the above.
- **`site/src/v2/ui/summary.ts`**: a `skill` row kind, so `Skill: door-check` gets the skill icon.
- **`site/src/v2/preview/index.ts`, `door.ts`, `door.css`**: the two regulars stages.
- **`site/src/data/t3code.ts`**: new facts (below).

## New facts (`t3code.ts`, read at pingdotgg/t3code `main` 7b47a21 on 2026-11-23, status `verified`)

- `contextSetting`: Settings → Appearance → Thread details → Context window (`docs/user/composer.md`).
- `compact`: `/compact` reduces context usage when the provider supports it; slash commands wait for the turn (`composer.md`).
- `clear`: `/clear` starts a fresh provider session in the same thread, marked "New session" (`composer.md`).
- `threadAsContext`: `@` attaches another thread as a chip; the agent reads its history on demand (`composer.md`).
- `screen.contextRow`: "Context", "{used} / {max}", "Context: {used}% used", "{used} of {max} tokens", warning ≥80%, error ≥90%, tick at auto-compaction (`ThreadDetailsUsage.tsx`, `lib/contextWindow.ts`).
- `screen.compaction`: "Compacting context", "Context compacted {before} → {after} tokens" (`client-runtime/src/work-log/presentation.ts`).
- `screen.newSession`: "New session" divider (`chat/V2LifecycleRow.tsx`).

`guides/fact-check.md` regenerated with `node scripts/check-facts.mjs --write`.

## Open questions

1. **Where AGENTS.md is shown.** T3 Code has a file viewer next to the browser; the drawing shows the file in the browser panel's Preview tab, with the file path in the address bar. A separate "Files" tab would be more faithful but changes the shared browser panel.
2. **The tick on the context bar** sits at Claude Code's documented default (about 967K of 1M). T3 Code draws the tick only when the provider reports a threshold; whether Claude Code reports it through T3 Code wasn't checked.
3. **Lesson 3 and 4 overlap.** Lesson 3 also builds `/p/kai` and `/promoters`. If its thread made its own Preview app for them, the two should be merged into one (`lantern.ts` is meant to be that app).
4. **"Promoter links" earlier turns.** Lesson 5 continues a thread that lessons 3 and 4 own; the chat starts at lesson 5's first turn with a "previously" lede, as open question 3 in `lessons-3-8.md` suggested.

## Critique log

### Round 1: three Haiku testers (1440×900 light, 390×844 dark, 1024×768 dark)

Screenshots: `~/.local/state/agent-artifacts/vibecoding-guide/guide-v2/l5-6/haiku-1/`, `haiku-2/`, `haiku-3/`. No console errors and no sideways scroll at any size.

What they found, and what I did:
- **Picture annotations on the drawing** (all three). Labels at slabs touched the window's base, "you" notes ran into the tools, run results sat on the tools tray, "not followed" sat on the edit tool. Fixed: slab notes sit further left of the window, notes about you hang below the figure, run results hang between you and the tools, notes about a changed file sit beside its tile. Rechecked every point at 1440 (`me7/`).
- **Annotations sharing an anchor vanish** (my own find): "Codex: AGENTS.md" and "Claude Code: …" were both on `rules`, and the engine kept one. Fixed with a separate anchor.
- **Test counts "drift"** (17 → 18 → 19). The drift was meant (each part adds a check), but nothing said so. Now each new count comes with its new test in the reply and the log: the phone test on every door page (18), the late-list check (19), the regulars test (20).
- **Kai's page at phone width**: "Running late" crowded the names. Fixed: below 440 px the switch drops its words and the list gets a "Running late" column heading.
- **Closing checklist reads 0 / 6 after a passing check.** It is the live page the reader can tick; the agent's check ran on made-up data. Now says so in a line above the list.
- **The long AGENTS.md didn't scroll to line 131** when the Preview tab was hidden at the time (my own find). Fixed: the viewer scrolls once it has a size.
- **6.3's log said 2 changed files** while its detail named three. Fixed.
- Not acted on: the `localhost:4321` addresses and the "example" pill (the owner chose these for the drawing), the dashed "Review" button and dark toolbar (dev-only), the popover staying open after the reader opens it by hand (that is the reader's choice; a point that opens it closes it again), lesson 5 moving straight into lesson 6 (the player's existing behaviour), the door page's "Just in" strip clipping (door.ts's own design, with a fade).

### My own critique (things the testers missed)

- The first point of each lesson-5 part has nothing new in the chat except the popover; the picture carries it. The composer's words help, but the chat is quiet for two points in 5.1.
- The context popover covers the part heading and the start of the lede while it is open. It is only open on points about the window, but on a phone it hides the lede entirely.
- The door preview in lesson 6.1 still shows the door page's simulated night (142 in, 22:41) at 17:30. This predates these lessons (NOTES.md, "Known").
- Lesson 5 starts inside a thread whose earlier turns aren't shown. The lede says "previously", but the sidebar has no "Promoter links" row before lesson 5 because lessons 3 and 4 aren't merged here.

### Round 2: two Haiku testers (1440×900 light, 390×844 dark)

Screenshots: `haiku-4/`, `haiku-5/`. No console errors, no sideways scroll, no touch target under 44 px.

- **Labels on the project plate** (lesson 6): every note about AGENTS.md sat on the plate's front band. Fixed: they hang below the plate's front corner; "Claude Code: …" sits left of the plate; the skill note hangs below the shelf. **Two slab notes** near the window's base (lesson 5.3, 5.4) moved to the window's right side, because the engine clamps labels at the frame's left edge. Rechecked at 1440 (`me9/`, `me10/`).
- **Kai's "Running late" switches did nothing** (phone tester). A real bug, and it hid two more: the app's root carried `data-route`, so every tap matched the tab handler; and `closest()` climbed past the app into the page, where the phone sheet carries `data-open`, so taps there matched the row handler. Fixed in `lantern.ts` (lookups scoped to the app) and `file.ts` (folds). Verified with a touch script: switches toggle, folds open (46 → 141 lines).
- **The red rule badge crowded Lea's name.** Now its own line under her row.
- Not acted on: "Felix Branda…" truncates next to the phone pill at 390 px (an ellipsis, by design); the lesson boundary has no "Lesson 6" marker in the composer (player-wide, not these lessons).
- The round-2 phone run was partly disturbed by my edits reloading the dev server mid-run; its lesson 6 parts 2–3 Preview checks were redone by hand (above).

## What I still don't like

1. **The picture's label engine** places by anchor and clamps at the frame edge; every new annotation needs a hand-picked world point (`side`, `belowYou`, `ranSays`, `atFile`, `atRules` in `l5.ts`/`l6.ts`). A shared helper set in `content.ts`, or collision avoidance in `picture.ts`, would stop each lesson re-solving this.
2. **The context popover covers the part heading and lede** while it is open (points marked `look: 'context'`), and on a phone the whole lede. A slimmer inline row, or anchoring it below the header's right edge with a smaller footprint, would be better.
3. **The chat is quiet in 5.1 points 2–3**: only the composer's words and the picture change. A real thread would show nothing either, but the lesson leans on the Explainer there.
4. **The file is shown in the Preview tab**, labelled by its path. T3 Code's file viewer is its own surface; a "Files" tab in the browser panel would be truer.
5. **The door preview's simulated night** (142 in, 22:41) shows at 17:30 in lesson 6.1. Predates these lessons.
6. **Story seams with lessons 3–4**: lesson 5 opens inside the Promoter links thread without its earlier turns, and `/p/kai`, `/promoters` may also exist in lesson 3's own app; merge to one.
7. **Test counts** now rise with a stated reason, but six different numbers across two lessons is a lot for a reader to track. Fewer, rounder mentions might read better.
