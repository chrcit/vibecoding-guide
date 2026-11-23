# Journey lessons: picture only, step navigation

The owner's brief, in their words: "The chat is not readable and honestly I feel like we should ban this ui below the illustration. Strike it away in each lesson and think through how to get the minimal needed version of the information directly inside the animated illustration. Then there also needs to be a way to navigate and control the animation and show the meta information below from the desktop left sidebar content. So on desktop I might scroll more or click a button but on mobile people only want to go forward and backwards in the animation/explainer. I would say going from animation to animation should change the text below which should be in a scroll container on mobile."

## What goes

- The chat screen beside or above the picture (`.j-screen`, `src/journey/screen.ts`) on every lesson and overview.
- The caption under the picture (`.j-cap`: `.j-say` and `.j-stats`).

## What the picture carries instead

An overlay layer inside `.j-stage`, drawn in step with the scene, with at most two small things at a time:

1. **A speech bubble at the speaker.** `ctx.say(who, text)` with a speaker (you, the model or a named model, the agent, a helper, the check, a tool, a colleague, a client, a user…) shows one short bubble anchored to that part of the picture, with a pointer to it. The latest line replaces the one before. It never covers the part that speaks, stays inside the stage, and is readable at 390 px (at least 13 px text, two lines at most, the rest cut with an ellipsis). A speaker with no part on the picture falls back to the narration line. The speaker-to-part map lives in one place.
2. **One counter on the picture.** The readout's primary value (by default the first pair of `ctx.stat`, or what a chapter pins) as a small chip in a corner of the stage, for example "round 1 · you ask" or "window 22% full". It flashes when a control restarts the count, as the readout does now.

Both follow the site tokens and work in light and dark. With reduced motion they appear without transition.

## What moves to the step text

The step on show gets, under its own text and controls (where the note and the colour key already go, `placeExtras()` in `run.ts`):

- the narration line (`ctx.say(null, …)`), as a live region;
- the full readout (`ctx.stat`), as the small table it is now;
- the note and the colour key, as now.

## Navigation

**Desktop** (the journey container at 60 rem or more): the steps still scroll past the picture in the left column and the step whose top passes the reading line is the one on show. Add Back and Next buttons on the picture (a small control bar in a bottom corner, with "2 of 4") that scroll the previous or next step into reading position. Left and right arrow keys do the same when focus is not in a field.

**Phone and narrow pages** (below 60 rem): no scroll-driven steps. The view fills the screen under the site header:

```
lesson rail
picture (with bubble and counter)
[ ← Back ]  2 of 4 · step title  [ Next → ]
step panel: only the step on show, scrolls on its own
  heading, text, controls, narration line, readout, note, key, <More>
```

- Back and Next change the step on show and the text in the panel. The panel scrolls back to its top on every change.
- On the first step, the panel starts with the lesson's count and title (`.j-head`). On the last step it ends with the `<Next>` card and the foot (sources, last verified), and Next leads to the next lesson.
- Swipe left and right on the picture also steps. Vertical scrolling inside the panel must never step.
- The step id is in the URL hash (`history.replaceState`). Opening `/journey/meter/#many` shows that step, on both layouts.
- Buttons at least 44 px high. Everything fits at 360 px wide without sideways scrolling.
- Changing the level re-runs the step on show and keeps the reader on it, or on the nearest step if it was hidden.

The overview pages (`/journey/foundations/`, `/journey/agents/`, `/journey/week/`) use the same layout and the same navigation.

## Keep

- Scripts, scenes, `ctx` and the chapter API stay as they are, so chapters keep working. `ctx.screen` becomes a no-op until the chapters drop their calls.
- `site/JOURNEY.md`: rewrite "The screen and the picture" for the new model, and update "Layout".
- Checks: 1440×900 and 390×844, light and dark, every step of a few lessons; `pnpm build && pnpm check-links` in `site/`.

## For chapter authors

The shared parts are built (`src/journey/overlay.ts`, `steps.ts`, `run.ts`, `chapter.ts`). Adapting a chapter means its script, not the engine. What a chapter does:

**Drop `ctx.screen`.** Every `ctx.screen.setup/row/result/history/focus` call does nothing now. Delete them. If a row carried something the reader needs (a real file name, a test result), say it in a bubble from the tool or the check, or in the narration line.

**Who speaks where.** `ctx.say(who, text)` keeps its signature. A speaker gets a bubble at their part in this order, and falls back to the narration line in the step text when none applies:

1. The chapter's own map, `speakers` on the chapter or on one step (`StepDef.speakers` adds to the chapter's). Keys are the speaker as the script names it, any case; values are a label anchor name, or `null` to keep that speaker in the narration line:
   ```ts
   export const chapter: Chapter = {
     speakers: { treasurer: 'peer', coach: 'you', server: 'gear:server', 'desktop pc': 'gear:me', planner: null },
     steps: { … },
   };
   ```
   Anchor names are the ones a label takes: `you`, `a0`, `r0`, `w0`…`w19`, `j0`…, `gate`, `mgate`, `tools`, `tool:<id>`, `project`, `rules`, `main`, `meter:<id>`, `tray`, `card:<id>`, `peer`, `client`, `user0`…, `zone:<id>`, `p:<id>`, `gear:<id>`.
2. A label on the picture whose words are the speaker's name: a station labelled "Opus 5.5" speaks for `ctx.say('Opus 5.5', …)`, a card labelled "test run" for `ctx.say('test run', …)`. Use the same words in the label and the script and nothing else is needed.
3. The shared map, `SPEAKERS` in `overlay.ts`: `you` → you; `model`, `the model`, `agent`, `the agent`, `lead`, `planner`, `builder` → `a0` (or the first job when there is no `a0`); `check`, `the check…`, `test run`, `judge` → the first gate; `tool`, `tools`, `progress` → the lit tool cube, else the bench; `reviewer` → `r0`; `helper` → the busy helper, else the first; `colleague` → the `peer` person; `client`, `user`/`users` → those people. Add a speaker here only when it means the same part in every chapter.

The bubble can share the chip's row when there is space beside the chip. It tries each side of the speaker and uses the label boxes when looking for a clear spot. In a crowded picture, if it hides what the step is about, set `speakers: { tool: null }` on the `StepDef` to put that speaker in the narration line.

A speaker whose part is not drawn in the current scene (no `you`, no gate yet) goes to the narration line, with their name in front. A bubble follows its part when the camera moves and stays until another bubble, a step change or a call such as `ctx.say('model', '')` clears it. `ctx.say(null, '')` clears the narration alone.

**Line lengths.** The bubble shows up to two lines, with an ellipsis for any text left over at full width. It is up to 240 px wide at 13 px text on a 390 px phone, and up to 288 px at 15 px text on a wide page. It takes a narrower spot beside a part only if the text still fits in two lines. Aim for about 38 characters and put the rest of a long reply in the narration or step text.

**The counter.** The chip shows one readout number. By default it is the first pair given to `ctx.stat`, shown as the name up to its first comma and the value ("turns 3", "in the window 6 messages"). Pin another with `counter`, on the chapter or one step:
```ts
counter: 'beat',                                  // the pair named "beat, this round" (a name, or its start)
counter: (pairs) => `window ${pairs[1]?.[1]}`,    // or write the chip's words; null or '' hides it
```
Pick the number the picture is about (the round, the window's fill, the bill), and keep the chip short: about 24 characters. The readout's full table still shows in the step text, and a restart (a counter going down) flashes both.

**Narration.** `ctx.say(null, …)` sits in the step text under the controls, as a live region. It is not on the picture any more, so it can carry the closing sentence and the numbers, but keep it to one or two sentences.

**Navigation needs nothing.** Steps, Back and Next, swipe, keys and `#step-id` links come from `steps.ts` and `run.ts`. A chapter must not scroll the page, and a script must not assume the step's text is on screen while it plays (on a phone only the panel is). The `<Next>` card on the last step is also where the narrow layout's last Next button leads, so keep it in the last step.

**Checks per chapter.** 390×844 and 1440×900, light and dark, every step: the bubble points at the right part and its text is not cut mid-thought; the chip shows the number the step is about; no line from the old screen is lost that the reader needs.
