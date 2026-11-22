# Guide v2: notes on the first slice

## What was built

- **The `/v2/` route.** "Guide v2" is now in the site header (`lib/nav.ts`). The page is `site/src/pages/v2/index.astro`. v1 is untouched: nothing under `src/journey/` or `layouts/Journey.astro` changed.
- **A drawing of T3 Code.**
  - The sidebar is the table of contents. It lists all 17 lessons plus the Set up project. Only lessons 1 and 2 play. Any other lesson opens a "not built yet" note.
  - The chat column holds the lesson thread. Each part is one turn: the request, the work log, then the reply. The reply carries the where-you-are line, the title, the lede, the picture with its point caption, the answer, a prompt to copy with one "In T3 Code" line, and the sources.
  - The controls sit where the composer would be: part back and forward, point back and forward, the part title, and play/pause.
- **Playback.**
  - Clicking a lesson in the sidebar plays it from the start. Playback moves through the points, then through the parts.
  - Manual steps pause playback.
  - Arrow keys step by point; Shift+arrow steps by part.
  - The URL hash (`#l2-p3`) opens a given part.
  - Finished lessons are kept in localStorage.
- **The picture.** It is v1's engine, reused as is: `Scene`, `picture.ts` and `presets.ts`, with no new drawing. Each point is a full scene state plus the pucks played on the way to it.
- **Files.**
  - `site/src/v2/content.ts`: data only (see the last section).
  - `site/src/v2/player.ts`: the runtime.
  - `site/src/v2/html.ts`: text by reader level.
  - `site/src/styles/v2.css`.
- **Facts.**
  - New entries in `t3code.ts`: `screen.permissionChip`, `breadcrumb`, `filter`, `sections`, `folders`, `workedFor`, `workLogGroups`, `subagents`, `contextWindow` and `usageLimits`, plus `newThreadCarries`. Each was read from T3 Code `main` at commit 6972026 on 2026-11-22.
  - New `claims.lessons.*` entries, taken from `capabilities-recheck.md`.
  - No existing entry was rewritten. The branch is rebased onto the lead's corrected `screen.statuses` and `screen.composer`.

## Decisions

- **"The first 2 parts."** I read this as the brief's relay did: the first two lessons of chapter 1, with all their parts. Lesson 1 has 3 parts and lesson 2 has 4.
- **The sidebar is the folder view.** Threads are grouped under their projects, as with T3 Code's opt-in "Boring sidebar (group by project)". The app's default sorts threads by state into Pinned, Active, Working, Snoozed and Settled.
  - A chapter is a project and a lesson is a thread.
  - The chapter number stands in for the project favicon.
- **The filter does what the real one does:** "Filter threads by project".
  - It has "Search projects..." and "All projects", and Shift-click picks several projects.
  - Here, picking a project shows one chapter's lessons.
  - It does not toggle between lessons and the story's own threads.
- **Status labels.** These come from `t3code.screen.statuses` and are never typed into the code.
  - The playing lesson reads Working and a finished one reads Done.
  - While the agent waits for approval, the lesson reads Approval (lesson 2, part 3).
- **App features appear when taught, then stay.** A short ring marks each one when it appears.
  - The model chip appears at lesson 1, part 1. It shows Opus 5.5, read from `models.ts`.
  - Context window appears at lesson 1, part 2. It is drawn in thread details, because T3 Code has no context ring in the composer. The details open once and then fold back to a button that shows "n%". The percentages are made up and marked "example".
  - The work log appears in lesson 2. Its rows use T3's own labels, and its summary reads "Worked for …".
  - The permission chip appears in lesson 2: Full access, then Supervised in part 3, then Full access again in part 4.
  - The branch, device name, usage limits and subagents are not shown, because these two lessons do not teach them.
- **Lesson 1, part 1.** Following the re-check, the model is not made to invent names every time. The answer shows invented names, and the next point shows the other possible reply: it asks for the list.
- **Lesson 2, part 3 ("Take run away").** You decline the run in Supervised mode. The reply still opens with "Done", and its last line says the page wasn't tried. The work log has no "Ran command" row. The 8.88% figure appears only at engineer level, together with its deliberate-blocker setup.
- **"Turn".** The guide's glossary (`terms.ts`) uses "turn" for one round of the loop, so the part keeps the title "One request, many turns". OpenAI's docs use "turn" for the whole user turn. That fact's claim keeps OpenAI's wording.
- **Requests.** The request is the same sentence at every level. The level changes the work-log rows, and extra answer paragraphs appear for technical and engineer readers.
- **Names are made up:** the Lantern, the guests, the files and every number in a reply.

## What is left

- The layout is being re-prototyped: an inline thread summary, plus a browser panel for the explainer. `content.ts` is meant to be reused as is.
- **Known layout issues, deliberately not fixed:**
  - On a phone, the annotations crowd together at the last point of lesson 2, part 4.
  - The details popover covers the request for a few seconds when it first opens.
  - The pause between points is fixed. It is set by caption length.
- **The site header overflows by 6px at 384px wide.** This happens on every page (for example `/library/`) and predates v2. Between 1024 and 1920px there is no overflow with the fifth link, because the nav switches to the "many" breakpoint (inline from 72rem).
- Subagents, the "{n} subagents" row and "Runs on its own" are sourced but not drawn yet. Chapter 3 will need them.
- The owner has not yet confirmed the chapter order (see the brief).

## Content pass (2026-11-22)

Lessons 1 and 2 in `site/src/v2/content.ts`, rewritten from `review-learning.md` and the content points in `review-design.md`. They are now the start of the Lantern's Friday in `lessons-3-8.md`: Thursday 22:00, Friday 09:00, then 10:00 to 11:00. Doors open at 23:00, and Sami is on the door.

### What changed

- **Lesson 1 has three parts, all turns of real threads.**
  - "Only what's in the window" is the ask without the list. The likely reply comes first (it asks for the list). The invented names come second, labelled "another run", with no frequency claimed.
  - "Paste the list" is a follow-up in the same thread. Whatever you paste goes to the provider, and the try-it says to use made-up data.
  - "A new thread doesn't know the last one" is a new thread. Its window is not blank: the instructions every thread starts with are there, and Claude Code and Codex add the instruction file. The engineer note cites the Antigravity observation.
- **Lesson 2 is one thread, "Door check-in", with three different requests.**
  - "Say the what, it finds the how": Full access and what it reaches, the harness running each tool, and the thesis.
  - "Done, but never tried": you ask it to try the page. The test browser is missing, the reply says "Done", and the work log shows the red row. You find the double check-in yourself.
  - "Say how you'll know": the "done when" with three cases. It is drawn as yours, and nothing enforces it. It installs the test browser without asking (Full access), then 'testing' and 'fixed'.
  - There are no repeated requests any more, so the stack of four identical messages is gone.
  - Supervised and the Approval status left lesson 2. Lesson 7 is the natural home for them. `STATUS.approval` stays exported.
- **No "turn" for a step.** The inner loop is steps or tool calls. "Turn" means a whole request-and-reply.
- **Work-log rows use the app's real labels at every level:** "Searched guest in src", "Read src/guests.ts", "Changed 2 files", "Ran 2 commands". The plain gloss sits in the detail.
- **The context window is not shown in lessons 1 and 2.** No point sets `ui.context`. Lesson 5 reveals it.
- **The check-in time** in the answer is "Already in", with the time of the first tap. It no longer says 22:41, because the test runs around 11:00. `door.tsx` in the engineer row still says "Already in at …".

### New optional fields

- `Point.preview?: Preview` (from `./preview`). It is set on every point of lesson 2:
  - part 1 goes `none` → `first`;
  - part 2 is `first`, then `buggy` at its last point;
  - part 3 goes `buggy` → `testing` → `fixed`.
- `Part.thread?: string` holds the story thread's title in the sidebar. Parts with the same title follow each other in one thread. A new title with `fresh` opens a new row. The titles are made up:
  - lesson 1: "Who hasn't confirmed" (parts 1–2) and "Text unconfirmed guests" (part 3);
  - lesson 2: "Door check-in" (all three parts).

### New facts (`t3code.ts`, read at T3 Code commit 3806763)

- `fullAccessClaude`: Full access runs Claude Code in bypassPermissions (`ClaudeAdapterV2.ts`).
- `fullAccessCodex`: Full access runs Codex with the dangerFullAccess sandbox, and Supervised with read-only (`CodexAdapterV2.ts`).
- `screen.readRow`: "Read {path}".
- `screen.searchRow`: "Searched {query} in {target}".
- `screen.rowDetail`: the command or path as a row's detail.
- `screen.skillRow`: "Skill: {name}", for Claude's Skill tool (`packages/shared/src/toolActivity.ts`).

### Still open

- The thread titles are invented. T3 Code titles threads itself, and the guide doesn't source how.
- The thread details' local-server list covers servers started by terminals or by a Claude agent only. That is why the try-it says "open the page in the browser panel" without naming that list.
- Lesson 1 still pictures "the model on its own". In T3 Code every thread has a harness with tools. The lede says lesson 2 adds them.
- `lessons-3-8.md` mentions "the 22:41 check-in" in lesson 2. Its later lessons should take the time from the door preview instead.

## Layout: the Explainer tab (2026-11-22)

The owner flipped through three layout prototypes (planning/guide-v2/PROTOTYPES.md) and picked "Explainer tab": sidebar | chat | browser panel. Where this file describes the earlier layout above, this section wins.

- The chat is a thread: the request, a quiet `Skill: agentic-guide · Lesson N · Part n/N` row (`t3code.screen.skillRow`), a "Worked for …" summary card that opens to the work-log rows (lit by the point on show), and the reply, which appears only when it lands.
- The browser panel (a drawing, marked example) has two tabs: **Explainer** (the picture, fitted to its drawing, with points and play/pause in its bottom bar) and **Preview** (the app the agent builds, `site/src/v2/preview/`; the contract is in `preview/index.ts`). The owner's words: call the tabs "something normal like preview", never a raw address. Lesson 1 has no Preview.
- The door app (`preview/door.ts`) is meant to look like what a strong model would really ship ("opus 5.5 would never make this mid of an ui"): dark, one-handed, search in the thumb zone, capacity, lists, plus-ones, undo. Its `testing` stage shows the agent driving the shared browser.
- Phone: the chat is the screen; a mini player opens the browser as a sheet.
- UI helpers live in `site/src/v2/ui/` (fit, splitter, sheet, filter, preview, summary).

Known: annotations from the picture engine sometimes overlap parts; lesson 1's scene sits right-heavy; the door app's seed data is a simulated night (22:41) while the lesson runs at 11:00 with made-up guests.
