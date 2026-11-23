# Group c: lessons 15–21 and `/journey/week/` in the picture-only layout

Files changed: `site/src/journey/chapters/{week,review,proof,turn,jobs,grow,people,where}.ts`, `site/src/pages/journey/turn.astro`. Nothing shared was edited. Not committed.

None of these chapters still called `ctx.screen`, so the work was the bubbles, the chips, the bugs in the test report and the framing.

Checks: every step of every lesson at 390×844 and 1440×900, light and dark (164 captures), plus 19 control runs that change the picture (each choice button, toggle and door). A log of every bubble and narration line, chip value and label overlap per capture is in the results JSON next to the screenshots. Every bubble line is now 38 characters or fewer, and no bubble is cut with an ellipsis except one on the overview, which is fixed (below). `pnpm build` passes (170 pages, check-dist and check-facts clean).

Screenshots: `~/.local/state/agent-artifacts/vibecoding-guide/journey-mobile/chapters-c/`
- `before/`: baseline at 390 light
- `final/`: every step, `<lesson>-<step>-{phone,desk}-{light,dark}.png`, plus contact sheets `sheet-<lesson>-<variant>.png`
- `controls/`: after pressing each control

## Shared rules used in all eight

- Bubble lines are short, and the long version goes to the narration line in the same tick: the flaws in full, a card's full text, the merge-conflict explanation.
- Every chapter sets a `counter` that shows the number the step is about. The chips are listed per lesson below.
- `week.ts` passes each lesson's `speakers` and `counter` through to its overview step. In the overview the jobs speak at their stations and the chips match the lessons.

## 15 Review

- Chip: `round 3 · found 3 of 3`.
- Bubbles: flaws and fixes are named in a few words (`2 flaws: double pay, anyone can mark.`, `Fixed: one mark only, treasurer only.`), and the narration line gives the full sentences. With the "break it" brief, the narration also carries each "To see it: …" line while the round plays. Your briefs are short (`Find 3 ways it’s wrong, and show each.`, `Only what breaks. 3 rounds at most.`), and the whole prompt is still in the step and the CopyPrompt. The lead's report and the handoff line are shortened.
- **Bug fixed, step 4 label overlap.** The allowance labels now read `Anthropic: 88% left` and `OpenAI: 30% left`. The word "allowance" is still the term on hover and in the step text. The step's frame gets a point above the models, so the picture sits lower on a phone and the labels clear the chip.
- In the fast taste rounds the reviewer's remark is the bubble (`Consider an enum for the status.`). Before, the builder's last fix stayed over the labels for ten rounds.

## 16 Proof

- Chips: `with it: one word` / `with it: 4 cards`. On catch and during: `on a card 4 · missed 0`.
- Cards speak once they have landed, so the bubble points at the card. They speak one line per level from a new `SHORT` table, and the narration gives the card's question and full text. Before, cards spoke before they existed and fell to the narration.
- Catch: the card lines are shortened. When a card is switched off, the model says "Done." and then you say what you find out later (`Later: Everyone got a reminder!`). This replaces `Done. (long sentence)`.
- **Bug fixed, step 4 line printed twice.** Step 4's progress line is said once (`4 of 10: Change the login?!`), and the narration says why it matters. The double `ctx.say('progress', …)` is gone.
- Word: after "Done." the tray's label reads `the tray: empty`.
- Ask: shorter card questions and a shorter bug-fix ask. `now passing` speaks from its own card instead of the check.
- Framing: a point under the tray, so the card labels below it stay inside the picture.

## 17 Your turn

- Chip: `turns 12 · wrong 12`, or `turns 9 · waiting on you` while it waits.
- **Bug fixed, blocking choices reachable.** On the plan step the two buttons now come straight after the one sentence, above the plan list. At 390×844 they are on screen without scrolling. On the pin step the sentence is shortened so its buttons sit higher. While a step waits, the narration says "It waits for you. Answer with … above."
- **Bug fixed, readout while paused.** The plan step sets "waiting on you: one decision" while it waits.
- The question comes from the card it is about, so the bubble points at that card and no longer covers it: step 3 of the plan, the question card and the screenshot (chapter `speakers`). All bubbles are short. The review-page prompt is a short bubble, and its full wording is in the narration.

## 18 Jobs

- Speakers: every job name maps to its station (`job 1, search` → `j0`, `thread “fix”` → `j0`…), so questions and "Done" appear as bubbles at the job. Before, all of them went to the narration line and replaced each other.
- Chip: `minute 42 of 60 · 3 done`.
- The merge conflict is a short bubble (`Main changed. Updating my copy.`), and the explanation is in the narration. A few questions are trimmed.

## 19 Growth

- Chip: `feature 13 · read 39%`.
- Clean-up, refactor and check lines are shortened, and the clean-up's full result is in the narration. Feature 9's name is shorter.
- In the overview, the grow loop no longer tells the reader to "Run a clean-up". The overview has no button for it.

## 20 People

- The pull request, check, client, fix and loop lines are shortened (`From the client: send a receipt.`). The colleague's verdict in the busy day is short, and "a made-up day: 10 agents, one colleague" moved to the narration.
- Chip: left at the default, `changes landed on main N`.

## 21 Machines

- Chip: `running 2 · landed 5`.
- Machines carry their state on their own label: `your laptop: asleep` while the lid is closed (in the overview too), and `the cloud: no setup` or `the cloud: set up`.
- The cloud failure is a short bubble at the check (`No test database. Can’t run tests.`), and the full sentence is in the narration. In the overview the lid closing is your bubble.

## `/journey/week/`

Each step uses its lesson's chip and speakers through `week.ts`. Proof, turn and where loops have no readout, so they show no chip; that matches the lessons' demos. The overview's proof ask was cut on desktop when the bubble narrowed beside "you", so it is now shorter (`Let members pay online, with proof.`).

## Left over, and shared changes I'd want (not made)

1. **Bubble placement ignores labels.** `Overlay.place()` scores spots by the main parts they cover, not by labels, so a bubble can sit on a label: proof's card labels, jobs' "the tray", people's "main". I'd add the placed labels to the cost in `overlay.ts`:
   ```diff
   -    const cost = (c: Spot, i: number) => (keep.some((k) => overlap(c, k) > 0) ? 1e7 : 0) + others.reduce((n, k) => n + overlap(c, k), 0) + i;
   +    const labelBoxes = [...this.stage.querySelectorAll<HTMLElement>('.j-label')].map((e) => ({ l: e.offsetLeft, t: e.offsetTop, w: e.offsetWidth, h: e.offsetHeight }));
   +    const cost = (c: Spot, i: number) => (keep.some((k) => overlap(c, k) > 0) ? 1e7 : 0) + others.reduce((n, k) => n + overlap(c, k), 0) + 0.5 * labelBoxes.reduce((n, k) => n + overlap(c, k), 0) + i;
   ```
   (Labels are absolutely positioned in `.j-labels` inside the stage. If that container is offset, use `getBoundingClientRect()` relative to the stage instead.)
2. **The desktop readout wraps letter by letter** in the new left panel when readout names are long. On jobs, "60 of 60" and the "example hour" tag stack one character per line (`final/jobs-*-desk-light.png`). The value column needs a minimum width or `white-space: nowrap` in `journey.css`. Other lessons with shorter names look fine.
3. **On a phone, an overview opened at its first step by hash** (`/journey/week/#meter`) scrolls the panel down to the part switch, so the picture is off screen. The plain URL and other steps' hashes work (`r2/week-hash-meter-phone-light.png` vs `r2/week-nohash-phone-light.png`). This is in `run.ts` or `steps.ts`, not in a chapter.
4. On phones most pictures still leave a band of about 50–80 px under the scene: the scenes are wide and the stage is portrait, so the width sets the scale. I only moved the frame where labels collided (review step 4, proof).
