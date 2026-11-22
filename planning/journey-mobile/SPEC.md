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
