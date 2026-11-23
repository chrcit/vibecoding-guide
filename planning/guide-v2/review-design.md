# Guide v2 prototype: design review

Reviewed 2026-11-22 against the work-in-progress worktree `t3-f7cb7143-40888abe92293a93` (commit 6a944bd plus uncommitted changes), running at `http://127.0.0.1:4133/v2/`. Both lessons were played through every part and every point at 1440×900 and 390×844, in light and dark, with Playwright 1.65.1 from that worktree. Nothing in the worktree was changed.

Screenshots are in `~/.local/state/agent-artifacts/vibecoding-guide/guide-v2/review-design/`. The file names below are relative to that folder. `d-` is desktop, `p-` is phone, and `10-l2-p3-pt5` means lesson 2, part 3, point 5.

Two dev-only overlays (the Astro toolbar and the "Review 0" comments widget) sit on top of the dock in the owner's preview. On the phone the comments widget blocks taps on the play button. They don't ship, so they aren't ranked here, but they make the preview feel broken. Hide them on `/v2/` in dev.

## Verdict

The structure is right: a lesson is a thread, a part is a turn, the sidebar is the table of contents, and every word on screen is sourced. What holds it at 3/10 is the layout. Each turn is a long document page (meta, title, lede, figure, caption, answer, try box, sources) inside a centred reading column, so it doesn't feel like an ADE turn. The agent's answer, which is the payoff of every part, is almost never on screen when the animation reaches it. The picture is small, changes very little between points, and never points at the chat it explains. A 9/10 shows the turn and the explanation at the same time. It would read like T3 Code's timeline (quiet log, short answer, threads that spawn), and every point would visibly change one thing and point at its evidence.

## 1. The ten things holding it at 3/10, worst first

### 1. The agent's answer is off screen at the moment it matters

At the last point of every part, the reply text sits below the fold. `keepInView` scrolls only the figure into view (`player.ts`, `show()`). Before the last point the answer is already printed at 35% opacity, so it gives away the ending and looks disabled. Lesson 1, part 1 is worse: at point 4 the picture says "another run: Can you share the list?" while the dimmed answer below still shows the three made-up names.

- `d-light-10-l1-p1-pt4.png`: the answer is cut off by the dock.
- `d-light-10-l2-p4-pt5.png`: the proof ("tried at 390 pixels…"), which is the point of lesson 2, can't be seen.
- `p-light-10-l2-p4-pt5.png`: on the phone the answer never shows during playback.

| Before | After | Why |
| --- | --- | --- |
| The answer is printed dimmed (`[data-later] { opacity: .35 }`) from point 1 | The answer is absent until the last point, then streams in sentence by sentence (fade plus 4px rise, 200ms `--ease-out`, 60ms stagger) | T3 streams replies, and an answer shown in advance spoils the point |
| Scrolling targets the figure only | At the last point, scroll so the answer's first line sits above the dock. On desktop, move the picture into a side panel (section 3) so the figure and the answer are both visible | The reader has to see the claim and its evidence together |
| The L1 P1 picture and answer disagree at point 4 | Drop point 4, or make it a second, retried turn with its own short answer | The picture and the chat must never contradict each other |

### 2. The reply reads like a lesson page, not an agent message

Each turn stacks eight blocks: the meta line, a 22px/650 H2 (the biggest type in the column), a lede in the guide's voice, the figure, the caption, the answer, a dashed try box and Sources. The agent's own words come sixth. The dock repeats the H2. In an ADE the turn is the request, the log and a short answer.

- `d-light-10-l2-p1-pt1.png`
- `p-light-10-l2-p1-pt1.png`: on the phone the meta line wraps to two lines.

| Before | After | Why |
| --- | --- | --- |
| A meta breadcrumb plus an H2 plus a lede | One quiet first row in the work log: `Skill: agentic-guide · Lesson 2 · Part 2 of 4`. T3's own work-log label is "Skill: {name}" (BRIEF, `toolActivity.ts`; add a `fact()` before drawing it) | It is the brief's "meta at the top" in the app's own grammar. In the skill version it is literally true |
| The part title as an H2 in the reply | The title only in the dock (it is already there) | No duplication; the reply stays a message |
| The lede ("The same request. This time it tries what it wrote.") | Fold it into the request's framing or point 1's caption | One voice per block: the user, the agent or the guide |
| The try box and Sources under every reply | Collapse them into one footer row under the answer (`Try it · Sources (4)`), expanding on tap. Desktop may keep it open | They are useful but secondary, and today they push the next turn down by ~150px |

### 3. Lesson 2 sends the same message four times into one thread

Parts 2–4 repeat the door request in the same thread, one after another (`d-light-29-l2-end-top.png` shows the stack). No one uses a real thread that way, so it reads like a chat glitch, and it hides what the lesson is really doing: three runs of one request under different conditions. Lesson 1, part 3 has the opposite problem. "A new thread starts empty" changes the breadcrumb to "New thread", but the sidebar still shows one row (`d-light-19-l1-end-full.png`). The owner asked to see threads spawning, and no frame shows one.

| Before | After | Why |
| --- | --- | --- |
| Four identical requests stacked in one thread | Each counterfactual part is its own thread. Nested rows appear under the lesson in the sidebar as each part starts: "Door page", "Door page · Supervised", "Door page · done when" | Sibling threads are how an ADE compares attempts, and they teach "Start another" for free |
| "New thread" exists only in the breadcrumb (L1 P3) | A new sidebar row appears with a 200ms enter (opacity plus 4px slide) and becomes current, and the old row settles | The lesson is about threads, so the thread list should show it |
| No spawning anywhere | Where it's honest (L2 P2 or P4), an inline summary row in T3's own form, "{n} subagents" or "Created {n} threads" (both sourced in `t3code.ts`), expanding to child rows | It's the owner's explicit ask, and it previews chapter 3 without teaching it early |

### 4. The picture is small, barely changes, and blanks out

The subject fills about a third of the 2:1 stage, with empty space on every side (`d-light-10-l1-p1-pt1.png`). Between points, usually one block changes colour and an annotation changes words: compare `d-light-10-l1-p1-pt2.png` with `…pt3.png`. The reader learns from the text, not the drawing. On every part change the new stage is blank for about half a second while the turn scrolls in (`d-light-40-partnext-200ms.png`, `…450ms.png`). On the phone, annotations collide with the drawing and with each other: "its window: your request" runs across the model (`p-light-10-l2-p1-pt1.png`), "you" and "proof you can read" stack on the figure (`p-light-10-l2-p4-pt5.png`), and "run" hides under "your project" (`p-light-10-l2-p2-pt2.png`).

| Before | After | Why |
| --- | --- | --- |
| A fixed camera and a mostly empty stage | Fit the viewBox to the subject's bounds plus about 8% padding, per part | Double the drawing size for free |
| A point changes a fill colour | One designated "changed" element per point: a 1.5px accent outline that fades in over 180ms, plus the annotation anchored to it | The eye needs a target, and "what changed" is the lesson |
| A blank stage on part change | Render the new turn's `poster()` for point 1 into the stage before scrolling, then hand over to `Scene` | The picture shouldn't flash empty |
| 15px bold annotations that can overlap | Collision pass on the phone: try left, right, above and below in turn, then drop to the caption. 13px/600 on the phone | The labels are fine on desktop and fail at 390px |

### 5. The controls aren't obvious, and the play button is nearly invisible

The dock has four near-identical glyphs (⏮ ‹ › ⏭) with no visible labels, and play/pause sits apart at the far right. The play icon fails contrast: `.v2 button { color: inherit }` (specificity 0,1,1) beats `.v2-play { color: var(--paper) }` (0,1,0). The computed result is `rgb(58,54,47)` on `rgb(27,26,23)`, about 1.4:1, and in dark mode it's light on light. It only looks right while hovered. "Next part" starts autoplay but "next point" doesn't. The dots can't be clicked. Arrow keys work only when focus is inside the thread, Space does nothing, and nothing tells the reader any of this.

- `d-light-10-l1-p1-pt2.png`: dark-on-black play icon.
- `d-dark-10-l2-p2-pt4.png`: light-on-light.
- `p-light-10-l1-p1-pt3.png`: the next button stays grey after a tap.

| Before | After | Why |
| --- | --- | --- |
| `.v2-play` loses to `.v2 button { color: inherit }` | `.v2 .v2-play { color: var(--paper) }` | 1.4:1 becomes full contrast. It's a bug |
| ⏮ ‹ [title] › ⏭ ▶, with play far right | `‹  ▶  ›` grouped in the centre. The title becomes a button that opens a part list (all parts with their titles and ✓/● state). The dots become buttons, one per point, at least 24px hit area | Three obvious controls plus a menu is easier than five ambiguous ones, and points are reachable directly |
| Next part autoplays, next point doesn't | Moving never changes play state. Playing continues and paused stays paused | Predictable |
| `.v2-btn:active { scale(.94) }` and an ungated `:hover` | `scale(.97)`, 120ms `--ease-out`, hover inside `@media (hover: hover) and (pointer: fine)` | Press feedback should be subtle, and touch shouldn't leave sticky grey |
| No keyboard help | Space toggles play/pause and ←/→ move by point from anywhere on the page outside inputs. Show `title="Next point (→)"` tooltips on desktop | Discoverable, and it matches the arrow keys already wired up |

### 6. The sidebar is a list of titles, not yet a table of contents

There are no parts, no progress and no lesson numbers. The two built lessons differ from the fifteen unbuilt ones only by `--ink-2` against `--muted` (`d-light-00-landing.png`, `p-light-00-landing.png`). The status pill shows "Working" only while playing and disappears on pause, so a paused reader loses their place (`d-light-10-l1-p1-pt2.png`). Clicking the current lesson restarts it from part 1. Unbuilt lessons open a dead end with every control disabled (`p-light-33-unbuilt.png`). The filter works and is faithful to the real app (`d-light-34-filter-probe.png`), but with five chapters it does little.

| Before | After | Why |
| --- | --- | --- |
| A lesson row is a title only | The current lesson expands into part rows (subagent-style child rows with ✓, ● or ○) and the row carries `2/4` | A table of contents needs depth, and the parts are where the reader navigates |
| Status shown only while playing | Keep the status while paused. Use Done for finished lessons. For a lesson started but paused, show progress (`2/4`) rather than inventing a status | "Where am I" should not depend on play state |
| Unbuilt rows look clickable | Unbuilt rows at 55% opacity with a "soon" tag, not links. The page says "Lessons 1 and 2 play" once, at the top | No dead ends |
| Clicking the current lesson restarts it | Clicking resumes at the saved part. Restarting is an item in the part menu | Respect the reader's place |
| The footer note takes 90px | One line, plus the `example` badge that is already in the header | Space goes to the contents |

### 7. It still doesn't read as an ADE

The work log is the loudest thing in the column: 15px/560 ink labels, red and green tones, a card with dividers (`d-light-10-l2-p4-pt5.png`). The answer underneath is quieter. The model and mode chips float in their own row above the dock. In T3 Code they sit in the composer's footer ("Permissions: {mode}", `ComposerFooterControls.tsx`). The column is the site's 17px reading type on warm paper, centred at 46rem with about 210px of dead space each side at 1440. The result reads as an essay with a chat motif. Compare the prototype the owner liked (`proto-d-full.png`, unstyled here because it was opened from disk): its log is small and grey, and its turn is about the lead starting three threads.

| Before | After | Why |
| --- | --- | --- |
| Log rows in 15px/560 ink, with red or green labels | 13–14px muted rows with a small tool icon. Colour only in a leading glyph (✕ or ✓) or the detail text, not the label. Collapse to "Worked for 4m 05s" once the part ends | The log is evidence to scan. The answer is what you read |
| Chips in a row above the controls | Chips inside the control card's footer row, like the composer footer: `Opus 5.5 · Permissions: Full access` | It's the app's real place for them, and saves about 40px |
| 17px body text and a centred 46rem column on the desktop | 15px message text and 14px UI type. Left-align the column to the sidebar, use the freed width for the panel (section 3) | Density closer to the app. Today the right 15% of the screen is empty |
| No sign of activity while "Working" except a sidebar dot | A one-line live status under the log ("Running npm test…", from the sourced "Running {program}"), plus a 1.2s shimmer on that line only | The reader should see the agent working |

### 8. On the phone, the chrome takes a third of the screen and the request scrolls away

The site header is 56px, the breadcrumb 50px, and the chips plus the two-row dock 158px. Together that is 264 of 844px. The reading area is 580px, and the 334px picture fills most of it. The user's request is out of view at every point after the first (`p-light-10-l1-p1-pt3.png`, `p-light-10-l2-p2-pt2.png`). Each part change smooth-scrolls about 900px: scrollTop goes from 255 to 1146 between `l2-p1-pt5` and `l2-p2-pt1`. The thread-details popover opens on its own and covers the request (`p-dark-10-l1-p2-pt1.png`).

| Before | After | Why |
| --- | --- | --- |
| The site header stays on the thread screen | Hide it on the thread screen; the ‹ back button covers the job | +56px |
| Two-row dock plus a chips row (158px) | One 56px row (`‹ ▶ ›` plus the title button) plus a safe-area inset. Chips move into the thread-details sheet | +100px |
| The request scrolls off the top | A one-line sticky request bar under the breadcrumb ("At the door I want to type a name…"), tap to expand | The reader judges the answer against the request |
| An auto-opened popover over the content | Flash the `ⓘ 1%` button with a ring and put a one-line annotation in the picture ("the list takes room: 1%"). Never auto-open | Something the lesson teaches should not hide the lesson |
| An instant swap of turns plus a 900px smooth scroll | On the phone, replace the turn in place: the old one fades out (150ms) and the new one fades in (200ms, 6px rise), with scroll reset instantly | Long smooth scrolls make you feel you lost your place |

### 9. The picture explains, but never points at the evidence in the chat

The lessons hinge on things in the chat. Lesson 1 depends on invented names. Lesson 2, part 3 depends on a "Ran command" row that isn't there. Lesson 2, part 4 depends on the context figure. Yet the chat never marks any of them. The made-up names in L1 P1 show as a plain answer with nothing marking them false (`d-light-10-l1-p1-pt4.png`). At "no Ran command row: nothing tried the page" (L2 P3 pt5), the log just has three rows, and nothing shows the gap. The log is also out of step with the picture: in parts 2–4 every row tagged for a point appears at once, while the picture then spends about 4s visiting search, read and change in turn (`d-light-40-partnext-900ms.png`).

| Before | After | Why |
| --- | --- | --- |
| Made-up names shown as plain text | Each name gets a dotted accent underline at point 3, with a margin note: "made up, not on any list" | The lesson is "it invents". Show the invention where it happens |
| A missing row is simply missing | A dashed placeholder row, "— no Ran command —", that fades in at that point | You can't see something that isn't there unless it's marked |
| Log rows appear per point | Rows appear when the puck reaches the tool. `Scene.run` already awaits each `h.send`, so emit an event per move | The two views should tick together |
| No link between the picture and the UI | While a point plays, the matching log row gets the existing `[data-now]` tint, and hovering a row outlines its tool in the picture | The brief's "highlight the context bar" idea, made general |

### 10. Motion and finish details

Most of the motion is purposeful. The pucks explain, the log rows enter in 320ms with a 3px rise, and reduced motion is handled in the scene engine. A few things still cheapen it.

| Before | After | Why |
| --- | --- | --- |
| The `[data-new]` accent ring holds for 2.4s | 900ms total: 120ms in, hold, fade out | A highlight is a nudge, not a banner |
| The Working pill pulses at 1.2s | Keep it. Once the pill stays visible while paused (#6), make sure the pulse stops then | Motion should mean the agent is working |
| A new turn appears with no transition | 200ms opacity plus 6px `translateY` on `.v2-turn[data-current]`, `@starting-style` | Prevents a jarring jump; it is the one big change on screen |
| Every scroll is `smooth`, over any distance | Smooth only under 400px; otherwise instant plus the turn's fade-in | Long programmatic scrolls feel slow |
| Under reduced motion, autoplay still advances every 3.5–4s (measured) | Start paused when `prefers-reduced-motion` is set, with the first point drawn | The reader chooses when things move |

## 2. What already works and must be kept

- **The model.** Chapter = project, lesson = thread, part = turn, point = stop. It's simple, it maps onto the real app, and the sidebar-as-contents idea is right.
- **Accuracy discipline.** Every on-screen word comes from `t3code.ts`: "Worked for {duration}", "Searched files", "Read file", "Changed files", "Ran command", "Read {n} files", the statuses, "Permissions: {mode}", "Context window" and "{used}% used", "Filter threads by project", "Search projects...". Keep the "example" badges and the made-up-data note.
- **Progressive UI.** The model chip appears at L1 P1, the context button at L1 P2, and the permission chip and work log at L2 P1, each with a highlight. The best single moment in the build is L2 P3 pt3, where the sidebar row turns to **Approval** while the picture asks "May I run it?" (`d-light-10-l2-p3-pt3.png`). That is the ADE teaching itself. Build more moments like it.
- **Words by reader level in the log.** Plain readers see "where tonight's list is kept", technical readers `guest* in src/`, engineers `rg -l "guest" src/`. The request stays the same at every level, as the brief asks.
- **The lesson 2 arc.** It works → it tried it and fixed it → it couldn't run it and still said done → "done when" catches the double check-in. It's a strong, honest sequence, and the answers are well written ("One-handed comfort is yours to check on a real phone").
- **Engineering basics.** Hash deep links (`#l2-p3`), arrow keys, focus rings, 44px buttons, an `aria-live` caption and `role="img"` stages. Reduced motion in `Scene` makes sets instant and caps waits at 160ms. Completion persists in `localStorage` inside try/catch. On the phone, list and thread are two screens, as in the app.
- **Dark mode.** The picture and tokens hold up well in dark (`d-dark-10-l2-p2-pt4.png`). The only dark-mode bug is the play icon.
- **The filter popover.** It behaves like the real one, including Shift-click and favicon stacking. Keep it, but don't rely on it for navigation.

## 3. The owner's next idea: inline thread summary plus a browser panel on the right

> "use inline thread summary and a fake browser right sidebar with a fake interactive explainer there as well"

I read "inline thread summary" as the timeline row T3 already has for child threads: "{n} subagents", with a status line and elapsed time, expanding to one row each (sourced in `t3code.screen.subagents`). In the chat, each part collapses to a summary card once it ends. The browser panel is real too: "Each environment has a browser that you and the agent both see", and a local server opens "in the browser panel" (`t3code.browser`, `t3code.localServers`). The direction is accurate to the app. It also follows the owner's own principle of letting the how disappear and focusing on the what, because the reader finally sees the thing being built.

### What it fixes

- **#1 and #4.** The picture moves to a tall panel, so the chat column can show the request, log and answer at the same time as the animation. The panel is about 560×700 instead of 736×368, so the drawing can be about twice the size.
- **#2 and #7.** With the figure out of the reply, the reply becomes a real ADE turn: the Skill row, a quiet log and a short answer. It uses the dead space on the right at 1440.
- **#3.** Inline thread summaries give the four door attempts an honest home. Collapsed, each part is one card ("Door page · Supervised — Done, never ran it"), and the thread reads as a series of runs rather than four copies of one message.
- **#9, and new teaching.** The panel can have two tabs. **Explainer** holds the isometric picture, marked `example`. **localhost:4321/door** holds a fake, typeable door page that appears when the agent first runs it (L2 P2). In P2 the reader types "ana" and sees nobody, then after the fix sees Ana. In P3 the tab never opens, because nothing ran. In P4 a second tap shows "Already in at 22:41". That is the most direct proof of "done when" this guide could give.

### What it breaks, and how to contain it

- **Parity with the skill.** The brief's picture-inline-in-the-reply exists because that is how the skill shows a figure in a real thread. If the web version moves the figure to a panel, the skill should be able to do the same (open the figure HTML in T3's browser), or the web version teaches a layout the reader will never see. Check that before committing, and keep a small inline thumbnail of the figure in the reply that focuses the panel when tapped. That keeps both.
- **Lesson 1 has nothing to browse.** There are no tools and nothing runs. Let the panel open from L1 P1 with only the Explainer tab. The product tab appears, highlighted, when it is taught in L2. That fits the brief's progressive-UI rule.
- **Two focal points.** The animation on the right and the log in the middle compete. Tie them together. Each point highlights its log row (#9). The panel's caption repeats `2 of 5`. The dock drives both. Never animate in both columns at once: the panel moves and the chat only gains rows.
- **Width.** Sidebar 280 + chat 440 + panel 520 = 1240px minimum. Between 1024 and 1240px, collapse the sidebar to icons (chapter favicons). Below 1024px, use the phone layout.
- **A fake browser is easy to mistake for a real site.** Give it the `example` badge in the address bar and make-believe `localhost` addresses only. Keep the panel visually inside the app frame.

### Desktop (≥ 1240px)

```
┌ site header (40px) ───────────────────────────────────────────────────────────────────────────┐
├─────────────────────┬────────────────────────────────────┬─────────────────────────────────────┤
│ T3 Code example  ⏷ │ ① Hand it over / It gets hands  ⓘ4%│ [Explainer] [localhost:4321/door ✦] │
│                     │                                    │ ‹ › ⟳  localhost:4321/door  example │
│ ① Hand it over      │          ┌───────────────────────┐ │ ┌─────────────────────────────────┐ │
│  ✓ Say what you want│          │ At the door I want to │ │ │                                 │ │
│  ● It gets hands 2/4│          │ type a name… one hand.│ │ │   isometric explainer,          │ │
│    ✓ Door page      │          └───────────────────────┘ │ │   fitted to the subject,        │ │
│    ● Door page·run  │ ⚙ Skill: agentic-guide · L2 · 2/4  │ │   one outlined change per point │ │
│    ○ ·Supervised    │ ▾ Working · 1m 12s                 │ │                                 │ │
│    ○ ·done when     │   ⌕ Searched files   guest* in src │ │       "the failure goes in too" │ │
│  ○ Done when  soon  │   ▤ Read 2 files     guests.ts …   │ │                                 │ │
│  ○ Start another    │   ✎ Changed files    door.tsx      │ │                                 │ │
│                     │ ▸ ✕ Ran command  "ana" → nobody  ◀─┼─┤ (row tinted = this point)       │ │
│ ② Why it goes wrong │   Running npm test…  ░░░           │ └─────────────────────────────────┘ │
│  ○ The window fills │                                    │  2 of 5  It runs the page at phone  │
│  …                  │ ┌ Part 1 · Door page ── Done ────┐ │  width and types "ana". Nobody.     │
│                     │ │ Changed 1 file · never tried it│ │                                     │
│                     │ └────────────────────────────────┘ │                                     │
│                     │ ┌──────────────────────────────────┐                                     │
│ A drawing, not the  │ │  ‹    ▶    ›   One request, many turns  ● ● ○ ○ ○  ▾ │                │
│ app. Made-up data.  │ │  Opus 5.5 · Permissions: Full access                │                │
│                     │ └──────────────────────────────────┘                                     │
└─────────────────────┴────────────────────────────────────┴─────────────────────────────────────┘
```

Behaviour: the dock drives everything. Finished parts collapse into summary cards ("Part 1 · Door page — Done"), and tapping one reopens it. The `localhost` tab appears at L2 P2 pt2 with a highlight, and the reader can type into it. Its results follow the current point, so before the fix "ana" finds nobody whatever is typed.

### Phone (390px): understanding first, no side panel

```
┌────────────────────────────────┐
│ ‹  ① / It gets hands      ⓘ 4% │  site header hidden in a thread
│ “At the door I want to type…”▾ │  sticky request, one line
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ explainer, sticky,         │ │  ~40% of the height; shrinks to a
│ │ fitted to the subject      │ │  72px strip while the chat is
│ │                            │ │  scrolled, grows back on the next point
│ └────────────────────────────┘ │
│ 2 of 5  It runs the page and   │
│ types “ana”. Nobody shows up.  │
├────────────────────────────────┤
│ ⚙ Skill · Lesson 2 · Part 2/4  │  chat scrolls under the stage
│ ▾ Working · 1m 12s             │
│ ✕ Ran command  “ana” → nobody  │
│ ┌ localhost:4321/door   Open ↗┐│  opens a full-screen sheet with the
│ └─────────────────────────────┘│  fake door page: try it one-handed
├────────────────────────────────┤
│  ‹     ▶     ›   Many turns ▾  │  one 56px row + safe area
└────────────────────────────────┘
```

On a phone, the browser is a sheet rather than a panel. The fake door page is phone-sized anyway, so the reader can test "it must work on my phone with one hand" on their own phone. The explainer stays in the thread as a sticky stage, because on a phone understanding comes first and a hidden panel is never opened.

## Order of work

1. Fix the play-icon colour, sticky hover and press scale (#5), and hide the dev overlays on `/v2/`. These take minutes.
2. Restructure the turn (#2, #7): the Skill row, a quiet log, a streamed answer, the try box and sources folded into a footer.
3. Build the desktop panel and the phone sticky stage (#1, #4, section 3), with the viewBox fitted to the subject and one marked change per point.
4. Sibling threads for lesson 2 and the new-thread row in L1 P3 (#3), plus parts in the sidebar (#6).
5. Evidence links (#9): the made-up names marked, the missing-row placeholder, log rows synced to the pucks.
6. The fake door page in the `localhost` tab.
