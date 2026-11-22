# Chapters, group b: lessons 8–14 and the Part 2 overview

Files: `site/src/journey/chapters/{whole,memory,check,handoff,team,meter}.ts` and
`site/src/pages/journey/{fleet,lead}.astro`. The other pages in the group needed no change. None of
these chapters called `ctx.screen`. The old chat screen was fed by `ctx.say`, so the work was
mostly making each line fit a bubble, giving the right part a voice, and pinning the chip.

Checked at 390×844 and 1440×900 (the new one-step desktop layout), light and dark, every step,
after the step's script had played: 129 screenshots in
`~/.local/state/agent-artifacts/vibecoding-guide/journey-mobile/chapters-b/`, plus Technical and
Engineer reruns in `technical*/` (`log.json` beside them records every bubble line and chip seen
while the step played, and flags a line cut by the ellipsis). After the last edits no bubble is cut
on any of them, and no page scrolls sideways. `pnpm build` passes.

## Shared pieces (in my files)

- **New speakers** (chapter `speakers` maps). `window` → `tank:a0` (memory, handoff, meter),
  `helper window` → `tank:w0`, `project` → `project`, `shelf` → `skills`, `meter` → `meter:m0`,
  and in the fleet lessons `check` → `mgate` (the shared map sent it to the gate in front of you,
  which the fleet scene also draws) and `main` → `project`.
- **Fleet lessons speak through their readout.** `sim.ts` only calls `ctx.stat`, so `watched(ctx, o)`
  in `team.ts` wraps ctx and turns each change in the readout into one bubble: “Clash: one edit
  landed on another.” and “Wrong, and on main: n.” at main, “Sent back: it fails the check.” at the
  check, “Window full: compacted.” at the lead, and on the first landing either “Merged into main.”
  (parallel) or the report the lead got (“Report: five lines.” / “Report: diff, logs, every
  read.”). Every run ends with “All n landed. k wrong.” at main. Used by parallel, lead, fleet and
  the overview.
- **Helpers' states**, which the thread list used to show: the lamps already carry them (amber
  working, blue at the check, green landed, accent wrong). The chip counts them:
  `fleetChip` shows “9/40 on main · 14 working”, read from the helpers' lamps each time the readout
  updates. The step text of Fleet's first step and Lead's first step now says what an amber and a
  blue lamp mean. I did not add a readout row: any number in a readout value that goes down
  (helpers working 14 → 12) makes `run.ts` flash the readout as a restart.

## 8 · Memory

- Every line cut to about 38 characters per level. The full mistakes (3/3/2026 and the colours,
  jest against vitest, the boundary breach) moved to the narration line at the end of the run.
- Window bubbles: “New thread: empty.” and “Loaded: AGENTS.md, 12 lines.” at the glass.
- Grow: you say “Wrong again. Add a rule to AGENTS.md.”; on the long file the tool says “… Rule
  missed.” Chip pinned to the file size (“AGENTS.md 168 lines”, was the 40-character readout).
- Skills: the shelf speaks (“4 skills: a name and a line each.”, then “PDF skill: the whole
  file.”), then the window (“Loaded: the PDF skill, in full.”). The step had no readout and no chip;
  it now uses the chapter's readout (with “the job” going from not run → made the PDF) and a chip:
  “4 skills: names only” → “PDF skill: read in full”.

## 9 · Check

- The check's lines shortened (see “left over”, they are short for a reason). Chip pinned to
  “reached you broken n” (was the list of checks, over 40 characters).
- Broken work reaching you is now said at you: “Broken: the dates are wrong.” and so on, after the
  agent's “Done.”. A repaired job gets “Fixed. It passes now.” at the check. So the step that is
  about “done either way” shows the “Done.” and the broken arrival side by side.

## 10 · Handoff

- Your request is “Find each date read. Change nothing.”; the full request goes to the narration.
- Brief bubbles: “Brief: list date files. Change nothing.” / “Brief: sort out the dates.”, with the
  full brief in the narration line.
- The helper's answer is “3 lines: members, export, import.ts”; the closing narration names what
  each file does with dates. Then the helper's glass says “Was 76% full. Thrown away.”
- Alone: “Read 7 files. 3 of them read dates.”, then “85% full, and it stays.” at the agent's glass.
- Short brief: each edit lands with “n files edited.” at the project; the step's chip is
  “files changed 3”.

## 11 · Parallel, 12 · Lead, 13 · Fleet

- All on `watched` and `fleetChip` (above). Lead “What the lead reads” pins the chip to the lead's
  window (“lead's window 87% full”); Fleet “Take the check away” to “wrong on main 9”; “What is left
  for you” to “helper turns 115”.
- Lead shapes: every role now speaks at its own station (`SHAPE_SPEAKERS` on the step: before, the
  planner's line went to the lead and the reviewer's to the narration line, because the shared map
  looks for `r0`). Lines shortened (“Hidden ratings still in the export.”, “Plan: list, page,
  export, a test each.”, “Keeping the second: export is in.”). Two builds now say “Build one:
  done.” / “Build two: done.” at their stations.

## 14 · Cost

- Every model and tool line rewritten per level to about 38 characters (the engineer's request was
  over 100).
- On each turn the window speaks first: “Turn 3: reads all 26,800 again.” with no cache, “Hit:
  26,800 of 28,200 cached.” with it, “Miss: all 28,200 read new.” on the effort change, and “Turn 1:
  18,300 read, and stored.” on the first turn. The scan lasts 1 s instead of 0.56 s so it can be
  read; your opening line stays 0.6 s longer.
- Chip: the turn before there is a meter, then the bill or the allowance (“cost of the job
  $0.268”, “allowance used 73%”, “cost of the hour $21.44”).
- The meter says “Empty. Wait for the reset.” on the plan and “Empty: all 20 wait for the
  reset.” in the fleet.

## Part 2 overview (`whole.ts`)

The memory, check, handoff, parallel, lead and fleet steps use the lessons' scripts, so they get
all of the above; each step got the matching chip and speakers. Chat, loop and window run the
other groups' scripts unchanged.

## Left over

1. **Overlay: a squeezed side bubble cuts short lines** (shared, `overlay.ts`). On the wide
   stage a bubble at the check is placed to its left at the 170 px minimum because that spot
   covers no other part, even with plenty of room above. At 15 px text, 30 characters then wrap
   to three lines and get the ellipsis (“Shows 3 / December, not 3…”, `probe` in my run). I kept the
   check's lines to about 28 characters to stay clear of it. The fix I'd want, in `make()` for
   left and right:
   ```diff
         const { w, h } = sizeAt(Math.min(full, room));
   +     // A side spot is only worth having if the line still fits in two lines there.
   +     const p = b.firstElementChild as HTMLElement;
   +     if (p.scrollHeight > p.clientHeight + 1) return null;
   ```
2. **Bubbles at a glass can sit over the neighbour.** “Was 82% full. Thrown away.” at the
   helper's glass lands below it, over the agent's base and the project label, on a phone. It
   points at the right part and nothing it covers is being read at that moment.
3. Lead shapes keeps its own readout names (“the one task, on main”), unlike the other lead steps.
   I left it: it is one task, not a count towards twelve.
4. The phone screenshots show the dev Review button over the readout's right column; that is the
   dev overlay, not the page.
