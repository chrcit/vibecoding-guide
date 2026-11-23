# Journey lessons on a phone: test brief

The lessons at `/journey/<id>/` are scrolling explainers: a sticky view (lesson rail, a schematic chat screen, the animated picture, and a caption with a readout) over short steps that scroll past it. On a phone the sticky view takes most of the screen, the chat is unreadable and the steps are clipped behind it. See `site/JOURNEY.md` for the concept and `site/src/layouts/Journey.astro`, `site/src/journey/run.ts`, `site/src/journey/screen.ts`, `site/src/styles/journey.css` for the code.

The owner's decision, in their words: "The chat is not readable and honestly I feel like we should ban this ui below the illustration. Strike it away in each lesson and think through how to get the minimal needed version of the information directly inside the animated illustration." And: on desktop people may scroll or click a button, "but on mobile people only want to go forward and backwards in the animation/explainer. Going from animation to animation should change the text below, which should be in a scroll container on mobile." The readout and other meta information should show in the step text (the left column on desktop).

So the chat screen (`.j-screen`) and the caption under the picture (`.j-say`, `.j-stats`) are going away. Your job is to look at the current lessons on a phone and say, for every step, what of that information a reader needs and how little of it can live inside the picture.

## How to look

- The site runs at `http://127.0.0.1:<port>/`. Find the port with `portless list` (route `agentic-coding-guide-site`, the `localhost:<port>` part). Never stop or restart that server or any other Portless route.
- Use Playwright from the site: `cd site && node your-script.mjs` with `import { chromium, devices } from 'playwright'` (version pinned in `site/package.json`; browsers are installed). Never pass `--no-sandbox`. Viewport 390×844, `deviceScaleFactor: 2`, `isMobile: true`, `hasTouch: true`; check light and dark (`colorScheme`).
- For each step: scroll it into reading position, wait for its script to play (about 4–8 s), take a screenshot, and read the text of `.j-screen`, `.j-say` and `.j-stats` at a few moments. Save screenshots under `~/.local/state/agent-artifacts/vibecoding-guide/journey-mobile/<your-name>/`. Look at the screenshots yourself.
- Also look once at 1440×900 to see what the desktop layout carries.

## What to report

Write `planning/journey-mobile/test-<your-name>.md` with one section per lesson, and per step a row:

| Step | What the screen and caption say | What the reader needs | Minimal version in the picture | Moves to the step text |

- "Minimal version in the picture": for example a short speech bubble at the part that speaks ("you", the model's cap, the check), a single counter on the part it counts ("round 2", "22% full" on the window), a word on a lamp. At most one or two small things per moment; say which part of the picture it sits on (names from `site/src/journey/picture.ts`).
- "Moves to the step text": what belongs in the text panel instead (the readout's full numbers, a closing sentence).
- Then a short list of other phone problems per lesson (text clipped, controls hard to tap, `<More>` boxes, copy prompts, the rail, the `<Next>` card), each with what you saw.
- End with a short section on navigation: how a phone reader should move from step to step (forward, back, where the buttons go, swipe or not), and anything about the overview pages (`/journey/foundations/`, `/journey/agents/`, `/journey/week/`).

Report while you go, lesson by lesson, so the file grows. Don't edit anything else in the repo. Don't commit.

## Assignments

| Tester | Lessons |
| --- | --- |
| opus | 1 ai, 2 providers, 3 stack, 4 first, 5 chat, 6 loop, 7 window, and the overview `/journey/foundations/` |
| sol | 8 memory, 9 check, 10 handoff, 11 parallel, 12 lead, 13 fleet, 14 meter, and the overview `/journey/agents/` |
| neon | 15 review, 16 proof, 17 turn, 18 jobs, 19 grow, 20 people, 21 where, and the overview `/journey/week/` |
