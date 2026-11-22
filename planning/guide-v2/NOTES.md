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
