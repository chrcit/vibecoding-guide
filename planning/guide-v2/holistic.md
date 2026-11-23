# Guide v2: the holistic pass (2026-11-23)

One pass over all 20 threads as one product, after the five parallel builds were merged. I played every point of every thread at 1440×900 light (307 points, a screenshot each) and the first and last point of every part at 390×844 dark. I also stepped every Preview app through its stages. Evidence: `~/.local/state/agent-artifacts/vibecoding-guide/guide-v2/holistic/` (`me-1440-light/`, `me-390-dark/`, `me-prev/`, contact sheets in `sheets/`).

## What works, and stays

- **One story, told forward.** Chapters 1 and 2 are one Friday at the Lantern, from 09:00 to doors at 23:00. Chapter 3 is the birthday week. Chapter 4 is weeks later. Every part moves the club on, and nothing reruns the same request. That fixes the oldest complaint (`review-design.md` #3).
- **A part is a real turn.** The request is outcome-level, with a done-when or a must-never. The log grows one row per point, the reply lands where the agent answers, and "Worked for …" folds the log. Reading one thread feels like reading a T3 Code thread.
- **The app appears as it's taught.** Model, permissions, work log, worktree and branch, context, usage limits, Run on. Each appears at the point that teaches it and then stays.
- **The facts are sourced.** Every T3 Code word comes from `t3code.ts`, and every number from `site/src/data`. Personal estimates are marked as observations in the prose (lesson 4's "three to five threads", lesson 13's 600 subagents).
- **The Preview apps are real.** Readers can type into them, tap, add guests and see counts change. They look like what a strong model would ship.
- **The shell.** The T3 Code sidebar as the table of contents, the menu in the sidebar header, T3 Code's light and dark themes, and the composer slot holding the controls.

## What doesn't, ranked by how much it hurts a first-time reader

1. **Annotations sit on the drawing.** The engine kept labels apart from each other, but not off the parts they describe. By a box-overlap measure, 286 of 307 points had a label covering a drawn part, 481 labels in all. Labels that shared an anchor got the same key, so one replaced the other. Every thread had hand-tuned positions to work around it.
2. **The sidebar said "Working" after the reply.** The rule was "Working while playback plays", so the status ignored the story. In T3 Code (`SidebarThreadRow.tsx`), the thread you have open shows no status once its turn ends. Done marks only an unread finished thread.
3. **The Lantern contradicted itself across lessons.** Lessons 3–4 (`promoters.ts` + `lantern/store.ts`) and lessons 5–6 (`lantern.ts`) each had their own promoter data:
   - Noor had 11 guests on a limit of 15 in one and 12 on 20 in the other;
   - the phone ranges differed;
   - lesson 5 used `/p/kai` after lesson 3 had made links long and random;
   - lesson 5 dated the phone rule 13:00, while lesson 4 queued it at 13:20.
4. **Night clocks in the daytime.** The door said 22:41 and the bar 23:20 while the lessons ran at 10:00 to 21:00, and nothing explained why. Only lesson 5's late list said "Dev data · 00:20".
5. **Threads that continue start mid-air.** Lesson 4.2, lesson 5 and lesson 14 continue threads from earlier lessons, but the chat began at the new turn. The only hint was a sentence in the lede.
6. **Phone panels cover the thread.**
   - The context popover that a point opens covered the part's heading.
   - The question panel plus the mini player plus the composer took about 45% of the screen.
7. **Set up inherited lesson 17.** Set up happens "the week before lesson 1", but it played with everything taught through lesson 17 still showing: the context percentage, the permission chip and the branch toolbar.
8. **Lesson 17.1 ends on nothing.** The laptop sleeps mid-turn, so the turn has no reply. The chat kept a shining "Working for …" and then showed only the try box.
9. **The same idea looked different.**
   - Lesson 7's approval is a work-log row, but lesson 9's helper approval showed only as a status. `t3code.subagentRequests` says both appear in the parent conversation.
   - The workspace, branch and Run on chips were crammed into the composer row and wrapped onto a second line at 1440. T3 Code puts them in a branch toolbar under the composer.
10. **Leftovers.**
    - The reading-level offer could open over the browser panel on a first visit, though the menu already has the reading level.
    - "Not built yet" said only lessons 1 and 2 play.
    - `#l5/3` didn't open lesson 5 part 3 (only `#l5-p3` did).
11. **Pictures are small at 1440 and 1024.** I measured before changing anything. The fit already scales the drawing to about 83% of the panel's width: wide scenes (jobs, fleet, ship) are limited by the panel's width, not by bad fitting. A bigger picture needs a wider panel or a different scene layout, not a fit tweak.

## The learning arc

- **Repetition.** Lesson 16.2 ("Someone who didn't write it") re-taught lesson 12.1 (a fresh reviewer that never saw the author's reasoning) almost word for word. The new idea in 16.2 is the pull request as the place where a change waits.
- **Repetition, kept on purpose.** "A new thread doesn't know the last one" appears in 1.3, 6.1 and Set up's "Notes it reads first". 6.1 builds on 1.3 by showing the cost (it guesses the test command). Set up is outside the main line. I left both.
- **The progression from proof to proof is right.** 2.3 says the cases, 3.1 turns them into checks that stay, 3.4 keeps a goal set, and 8 asks for proof you can read. Each adds one thing. Lesson 3's title, "Done when", overlaps 2.3's subject, but the parts make the step clear.
- **Chapter jumps.** Each is carried by the first lede: "Monday 10:00, the week after" (lesson 9) and "Three weeks after the first Friday" (lesson 14). No gap needed filling.
- **Pacing.** Chapters 1 and 2 are dense: eight lessons in one day. It reads as a busy Friday, not as filler. Chapter 3's parts are shorter and could take one more point of "why" each, but no reader in any round asked for it.
- **Claims.** I sampled the numbers a skeptical engineer would check: the 600-subagent case, the three-to-five threads, and the cache price in 14.1. All three are in `site/src/data`, and the first two are labelled as observations in the prose. I found nothing unsourced in the sample.

## What I changed

1. **Collision-aware annotation placement in the engine** (`journey/scene.ts`, `journey/picture.ts`).
   - Each label tries its own side first, then the other sides and a few rows up or down. It takes the spot that costs least: covering another label costs most, covering a drawn part costs by how much it covers, and distance from its own spot costs a little.
   - Floor-sized parts count as ground.
   - Labels on the same anchor now get unique keys.
   - Result: labels covering a part dropped from 481 to 20 across 307 points, and labels overlapping each other stayed at 0. v1's `/journey/` and `/library/` use the same engine; checked below.
2. **The sidebar status follows the turn:** Working until the reply lands, then nothing, whether playback is playing or paused.
3. **One Lantern.**
   - `lantern.ts` now reads Kai's and Noor's guests, limits and links from `lantern/store.ts`, the store the promoter pages and the door already share.
   - Lesson 5's counts match: Noor has 11 guests and 3 plus-ones. Kai's page is at his random link, and the phone rule is from 13:20.
   - Lesson 13 names the link page `/p/[link]`.
4. **One clock story.** The door, bar and staff apps say "dev data" next to their time, with a tooltip: the dev server runs on made-up guests with its clock set to a Friday night. Lesson 5's late list already said this.
5. **Earlier turns.** A part can declare `earlier` (from lesson, how many turns). The chat then shows a quiet divider such as "6 earlier turns in this thread · lessons 3 and 4", which links to them. It is used in 4.2, 5.1 and 14.1.
6. **Panels make room.**
   - Thread details that a point opens show only the context row. On a phone they become a strip under the header that pushes the thread down.
   - On a phone, the question panel replaces the mini player while it's open. Its options are 44px targets, and the question is clamped to two lines.
7. **Set up starts clean:** only the model and the work log. Set up threads carry forward only what earlier Set up threads taught.
8. **Lesson 17.1.**
   - The "Working" line stops when the laptop sleeps.
   - A faint "Laptop asleep" marker says the turn stopped and no reply came back. The marker is the same component as lesson 5's /clear sketch, with a moon icon.
9. **One visual system.**
   - Lesson 9.4's helper approval is now lesson 7's approval row, with the command and the helper named.
   - The workspace, branch and Run on chips moved into a branch toolbar under the composer, as in T3 Code.
10. **Leftovers.**
    - The reading-level offer no longer renders on bare pages.
    - The "not built" copy is generic.
    - Deep links accept `#l5-p3`, `#l5/3`, `#l5/3/2` and `#l5-p3-2`.
11. **Copy.** 16.2 is now "Reviewed before it reaches them". It builds on lesson 12 instead of re-teaching it.

## Deliberately left alone

- **Picture size** (see item 11 above).
- **The staff app's look.** It is light by day and dark in the dark theme, while chapters 1 and 2 are always dark. It's a later version of the app weeks on. It follows the theme, which `staff.css` says on purpose.
- **Where AGENTS.md shows.** It stays in the Preview tab, not a Files tab.
- **The chapter order.** The owner still has to confirm it.

The verification rounds and what they found are below.

## Verification

### Automated sweep (every point, three viewports)

A script steps all 307 points. At each point it records:
- console and page errors;
- sideways scroll;
- labels overlapping each other;
- labels covering a drawn part, meaning more than 20% of the label's box over a part's box, with floor-sized parts left out;
- the sidebar saying Working after the reply has landed.

| Measure | Before (1440 light) | After (1440 light) | 1024 dark | 390 dark |
|---|---|---|---|---|
| Labels covering a part | 481 | 20 | 31 | 42 |
| Labels overlapping each other | 0 | 0 | 0 | 0 |
| Working after the reply | most points while playing | 0 | 0 | 0 |
| Errors, sideways scroll | 0 | 0 | 0 | 0 |

At 390, the first after-run showed 3px of sideways scroll at the points that open thread details. The details button's highlight ring was hanging off the header once its box became `display: contents`. Fixed, and re-checked at 0.

The labels that still cover a part are in scenes with no free room near the anchor: lessons 9 to 11 with their helper towers, and Set up's model with its long term labels.

### Haiku round 1 (three testers)

The testers were:
- 1440 light, lessons 1 to 6 and Providers;
- 390 dark, lessons 7 to 12 and Git;
- 1024 dark, lessons 13 to 17 and First setup.

What they found that was real, and what I did:
- **The door's lists didn't match.** In lessons 2, 7 and 8 the door still listed Kai 24 and Noor 21, while lessons 3 to 6 had 20 and 11. The door's Kai and Noor lists now come from the promoter store. Lea Brandt is left off the door's own list, because she joins through Kai's link in lesson 3.
- **Three testers read "Cannot GET /payouts" (and the like) as broken.** Every app's not-yet-built page now keeps the dev server's raw reply and adds one dashed line saying why. One shared helper does this: `preview/lantern/notfound.ts`.
- **Labels clipped at the panel's edge at 1024.** The picture fit never scaled below 1. It can now go to 0.7.
- **The current lesson sat below the fold** in the sidebar at 768px tall. The sidebar now scrolls it into view when the lesson changes and on load.
- **Escape didn't close thread details** unless the focus was inside them. It now closes them from anywhere.
- **The desktop details popover still covered the lede** when a point opened it. It is now the same strip as on the phone, at every width.
- **Guest import's sample rows were dark on dark.** The site gives every `pre` a themed background with `!important`, and the app now keeps its own.
- **Lesson 4 copy.**
  - 4.1 says the drawing groups threads by project, so no Working section shows.
  - 4.4's tray note now reads "two results wait for you" (it was "waiting on you: 2", which a tester read as contradicting "three done").

Not acted on, and why:
- **The double check-in in 2.2 and the phone number at the door in 5.2.** These are the lessons' deliberate bugs, and the chat says so.
- **"Limited missing" in lesson 14.** The Limited badge is on the story thread's row under the lesson. The tester's screenshot cut it off at 768px, which the scroll fix above addresses.
- **Truncated titles in the breadcrumb and the 1024 sidebar.** T3 Code truncates there too.
- **"Review 0" and the dark pill.** They are dev-only and confirmed absent from `dist`.
- **Several file names in the phone tester's report** pointed at the wrong lesson. Their script ran on into the next lesson. I checked the screenshots, not the file names.

### Haiku round 2 (confirming: 390 dark on lessons 5, 7, 14 and Git; 1024 dark on lessons 4, 9, 13, 16 and First setup)

- **Confirmed fixed:**
  - no sideways scroll;
  - touch targets at 44px;
  - Kai 20 + 9 and Noor 11 + 3 in the chat and the Preview alike;
  - statuses (Working, Done, Approval, Request, Limited) where the story puts them;
  - approval and subagent rows read clearly;
  - no console errors.
- **Real, fixed:** First setup asked for "60 made-up guests" while its Preview lists 26. The request, log and reply now take the number from the Preview's own data. The staff app's eyebrow, "The Lantern · dev data", wrapped at 1024; it now reads "Lantern · dev data".
- **Not acted on:**
  - Try-it prompts are one line on a phone. The brief asks for that: phone puts understanding first, and Copy carries the whole prompt.
  - The "dev data" pill and `localhost` address are the story: the app runs on the dev server.
  - One tester said "Working with the reply on screen". The reply on screen was the earlier turn's; the sweep shows Working after a landed reply at 0 points.

## Still not right

- **Pictures stay small** at 1024, and in wide scenes at 1440: the fleet (lesson 13), ship (16) and jobs (4, 10, 17). The fit is now honest, and it can shrink as well as grow, but the panel is narrower than the scenes. Fixing it needs a wider panel by default, or scenes laid out for a tall panel.
- **About 20 labels per viewport still cover a part.** These are scenes with no free room near the anchor: helper towers in lessons 9 to 11, and Set up's long term labels. A few labels now sit a row or two away from their anchor, and with no leader line it's a short hunt.
- **The phone dock is still tall.** The mini player, composer words, controls and the branch toolbar (from lesson 4.3) together take about 35% of the screen.
- **The staff app's look.** It is light by day and themed in the chapter 4 lessons, against chapters 1 and 2's always-dark Lantern. It is defensible as a later version of the app, but a reader may notice.
- **The approval row never shows which button was pressed**, as on T3 Code's main branch. Your declining bubble in 7.1 carries it.

## For the owner to decide

1. **The chapter order** (from BRIEF.md). It is still the relay's proposal.
2. **Whether the browser panel should default wider** at 1440 so wide scenes draw bigger. That would narrow the chat to about 520px.
3. **Whether Set up should read as a checklist** rather than a story. Its steps are sourced, but they are spread over three threads' replies.
