# Chapters, group a: lessons 1–7 and /journey/foundations/

Files changed: `site/src/journey/chapters/{ai,providers,stack,first,chat,loop,window,foundations}.ts`, `site/src/pages/journey/{loop,first}.astro`. `part1.ts` and the other five pages needed no change. Not committed.

Checked with Playwright 1.65.1 (from `site/`) against the shared dev server (route `agentic-coding-guide-site`, port 4826). Every step of every lesson was checked at 390×844 and 1440×900, light and dark, after its script had played, plus every non-default control at 390 light. The capture browser stubbed the dev server's reload socket, because other agents' saves reloaded the page mid-run. Screenshots: `~/.local/state/agent-artifacts/vibecoding-guide/journey-mobile/chapters-a/` (`<lesson>-<step>[-<control>-<value>]-<390|1440>-<light|dark>.png`; `*-before.png` is the state before these changes). `pnpm build` passes (170 pages, check-dist clean). `astro check` could not run because `@astrojs/check` is not installed, and I did not install it.

Common to all seven lessons:
- Every `ctx.screen` call is gone. Every bubble line is 38 characters or fewer. The rest of a long reply moved into the narration line.
- Every run starts by clearing the narration line. Before this, pressing a control left the previous choice's closing sentence showing until the new one arrived. For example, "List pasted in" showed "Three names… made them up" for 4 s.
- Readout values that were a bare dash now say something true ("none yet", "nothing yet", "not started", "your plan, as before").
- Each step's counter chip is pinned to the number that step is about.

## 1 · ai

- **New opening for `predict`.** The first time a reader lands on the page, the picture starts as the chat they already know: only "you" and "model" are labelled. You ask, it answers with three made-up names. Then "its window: your question" is labelled, the slab is read again (it flashes), and the narration says "Behind the chat: its window, holding your question and nothing else." This replaces the old `ctx.screen.focus('screen')` reveal. The overview's demo and the "List pasted in" button skip the reveal.
- Chip: `what comes back` on every step ("3 names, made up", "7 names, from the list", "a to-do list", "sent back: 8 ≠ 7"). The tank's label already says what is in the window.
- `inputs`: short bubbles on both sides ("14 rows. Row 9: is it Lena or Lina?"). The full reply goes to the narration, including "a photo can be misread, so a good answer asks".
- `modes`: in Work and Coding agent, the old work-log rows are now tool bubbles at the lit cube ("read members.xlsx", "changed members.ts", "opened the page and tried it" at plain level / `npm test` at technical). The full per-level reply moved to the narration.
- `code`: the check's lines are now short bubbles at the gate ("Tried it: page says 8, list has 7." and "Tried again: 7. Matches the list."). On the letter, the check's "Nothing to run" now stays up 1.2 s; it was replaced after 0.2 s.

## 2 · providers

- The cap's label is "Opus 5.5, on Anthropic's computers". Lines from "Opus 5.5" find it through that label; a chapter `speakers` map adds the laptop, desktop PC, phone and GPT-6.2 Sol.
- `labs`: chip is `you pay`. The four model names stay in the readout only.
- `reach`: the "you pay" values are shortened so the chip fits ("Free $0 or Pro $20 a month", "$4 in, $20 out per M tokens", "T3 Code free, plans as before"). The label crowding in T3 Code is fixed: no meter there (the chip carries the price), GPT-6.2 Sol's label sits below its station and "you, in T3 Code" sits to the left. Each model now speaks its own bubble in turn, at its own station.
- `where`: the "Up / Down" narration became tool bubbles at the lit cube ("Sent up: the text of members.ts.", "Changed here. Nothing sent up.", "Ran here. Sent up: what it showed."). The chip counts live: "files: 1 read, 1 changed". Offline relabels the cap "Opus 5.5: out of reach, offline".
- `devices`: the laptop says "Lid closed. The job waits." and the desktop PC "Still working. Nobody is here." The phone carries both "On the bus: looks good, go ahead." and the desktop's answer as it arrives. Chip: `your files` ("laptop, lid closed").
- Fixed: the "you pay –" row on two steps.

## 3 · stack

- Chips: `commit` "commits 1". `github` "commits: laptop 3 · GitHub 3", which visibly drops to laptop 0 when the laptop is lost. `branch` "main: untouched, still works" → "main: works, with dates" (or "broken for everyone"). `hosting` "Sam paid on one phone only". `specs` "1 core · 1 GB · 1% busy".
- `commit`: the whole save → break → go back exchange is in bubbles, so the "Saved" moment is no longer lost in a 104 px screen.
- `hosting` and `specs`: coach, treasurer and server now speak at their parts (chapter `speakers`). Before, those lines fell back to the narration. The server says its load ("1% busy. Mostly asleep.").
- Shortened values that wrapped: "broken for everyone", "untouched, still works", "N× too busy".

## 4 · first

- Chip: the beat on `job`, `loop` and `change` ("round 1 · 2 of 4: it builds"; "you say what to change" is shortened to "your changes" on the chip only). On `device` the chip is `working on`.
- `job`: the agent asks "Two questions first: teams? Amounts?" in a bubble. The per-level detail (stack proposal) moved to the narration.
- `loop`: the work log became a tool bubble per new file ("new file: members.ts"), shown 0.65 s each, then the check's bubble ("Opened the page, tried the form." / "npm test: 6 passed. tsc: clean."). Step text: "The counter in the corner shows which beat you are on".
- `change`: one bubble per file changed. The vague ask visibly touches six tiles and adds two.

## 5 · chat

- `LINES` are shortened to fit a bubble. `whole.ts` imports them and gets the short versions too.
- The tank's label counts: "its window: empty" / "its window: 2 messages". That gives the picture the number without the chip.
- `reread` now ends with "It read every message again and found your name in the first one." It used to have no narration.
- `fresh`: the narration no longer mentions "the screen". Pressing New chat puts a "New chat." bubble at you, which also replaces the stale "Sam." bubble (see shared request 1). Asking after it explains where the name went.
- Fixed: "1 messages".

## 6 · loop

The sequence is shown in the picture: two bubbles per tool call at the lit cube, what it does and what came back: search "date" → 2 files mention dates → read members.ts → 84 lines → edit how members.ts reads dates → run the tests → **1 of 12 fails: 3 March → 3 Dec** (accent slab, held 0.9 s) → edit: swap day and month → run the tests again → 12 of 12 tests pass → "Fixed: day and month were swapped."

- `hands` used to be blank. It now cycles through the four cubes, each lit with a bubble saying what it does.
- `fix` plays at 1.25× speed, so the run ends in about 11 s.
- Chips: turns on most steps; `norun` "proof it works none"; `ask` "times it asked you N". In the ask step, the run ends by naming T3 Code's mode, from `t3code.permissionModes`. This replaces the composer chip the screen used to show.
- The narration no longer mentions "the work log" ("One message from you, 7 turns of its own and 6 tool calls…"). Step text for `norun`: "look at “proof it works” in the corner".
- The "tool calls" lag the report found was caused by screen rows printing before the count went up; it is gone with the screen.

## 7 · window

- **One readout for the whole lesson** (it changed on every step): `in the window` (tokens of the window size, and "20k do not fit" past full), `full`, `your rule from message 1`, `read again, next 10 turns`. Chip: "window 22% full".
- Fixed: `rot` said "buried under 300k tokens" while the readout said 219k. The number is now counted from the window (216k of work above the rule).
- Fixed: the project plate was cut off at the frame edge on phones. It is now drawn only in `rot`, where a file is edited. The other steps frame the window and the tools only, so the tank is larger.
- Fixed: the "members.ts" / "export.ts" label sat on the tiles. It now hangs below them.
- `pile`: the model says "Done: a CSV export." after each job, and the rule slab gets a "your rule" label at the end. `compact`: the tool says "Window full: compacting." and the narration says what was kept. `paste`: you say which paste, and the slab's label carries its size ("the whole log: 200k").
- Removed `ctx.screen.history` from `long`. Fixed "20k of tokens".

## Overview · /journey/foundations/

- Each step plays its lesson's demo **once** and holds the end state, instead of looping. The loop reset the counter 0 → 1 → 0 while the reader read.
- Overview steps take their lesson's chip and speakers. Before, the providers step showed "model Opus 5.5" instead of the file count.

## Left over, and shared changes I'd want

1. **A way to clear the bubble.** After "New chat" the model's old "Sam." bubble stays next to an empty window. I worked around it with a "New chat." bubble from you. A clean fix in `run.ts` `say()`, plus a matching `clear()` call in the overlay:
   ```ts
   if (who && !text) { overlay.clear(); saidEl.textContent = ''; return; }
   ```
   With that, `ctx.say('model', '')` would hide the bubble.
2. **On phones, a station's bubble often lands below the cap, over the pawn and the tray card** (lesson 1 inputs and modes, lesson 4, lesson 6). There is no room above the cap (the chip) or beside it (under 170 px). This is the engine's fallback, not a chapter setting. One fix: let a bubble's `above` spot overlap the chip's row when the chip is on the other half of the stage.
3. `stack` hosting and specs still leave the lower third of the phone stage empty. The scene is width-bound; moving the coach and treasurer would mean changing where people stand on the floor plan.
4. The dev-only "Review 0" pill still covers the stage's bottom-right corner in every screenshot.

## Best screenshots

- `ai-predict-1440-light.png`: the new opening's end state, with the window named.
- `loop-fix-390-light.png`, `loop-norun-390-dark.png`, `loop-hands-390-light.png`
- `providers-reach-reach-t3-390-light.png`, `providers-where-390-light.png`
- `stack-github-390-light.png`, `stack-hosting-host-dynamic-390-light.png`
- `window-long-390-light.png`, `window-rot-mix-log-390-light.png`, `window-compact-390-light.png`
- `chat-fresh-ask-390-light.png`, `first-loop-390-light.png`
