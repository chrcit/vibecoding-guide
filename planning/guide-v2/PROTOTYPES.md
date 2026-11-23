# Guide v2 layout prototypes

The owner rated the first Guide v2 slice (`/v2/`) at 3/10, "still better than what we had before". Their next idea, in their words:

> "I think we might need to use inline thread summary and a fake browser right sidebar with a fake interactive explainer there as well."

We are exploring that idea as three variants of **one lesson part**, behind a picker. The owner flips between them at `/prototypes/guide-v2/` and picks one. The bar is Emil Kowalski's design engineering (see the craft rules below). Every variant must be a direction we could defend shipping, and it must fully work.

## The part

Lesson 2 "It gets hands", part 4 "Say what done looks like" (`site/src/v2/content.ts`, `LESSONS.l2.parts[3]`).
- The club owner asks for a door page: type a name, see if they're on tonight's list, tap them in, with a "done when" of three cases.
- The agent searches, reads and changes files, runs the three cases at phone size, and one fails: a guest can be tapped in twice.
- It fixes that, all three pass, and the reply comes back through the check with proof.
- There are five points.

The club, the guests and all the numbers are made up.

## What is already built (don't edit these; add to your own files)

- `site/src/prototypes/guide-v2/shared.ts`:
  - `player(stageEl, { dwell, autoplay })` drives v1's picture engine through the five points. It provides `go(i, animate)`, `next`, `prev`, `play`, `pause`, `toggle`, and `on(fn)` for index and playing changes.
  - `PART` holds the request, lede, points (each with a `say` line), `log.rows` (with the point each row appears at, and words per reader level), `answer` paragraphs, `deeper`, `tryIt` and `sources`.
  - `rowsAt(i)`, `statusAt(i)` (`Working`/`Done`), `META` (the "Chapter 1 · … › Part 4 of 4" line), `lv()` (text for the reader's level), `esc()`, `worked()`, `MODEL` and `t3code` (sourced app words).
  - `doorApp(el, stage)` mounts the club's door page, a working fake web app: type to search, tap to check in. It returns a setter for the stage, and `DOOR_AT[i]` gives the stage at point i.
  - `sidebarHtml(status)` renders the sidebar table of contents.
- `site/src/prototypes/guide-v2/shared.css` holds the frame (`.proto-shell`: sidebar plus your main area, full height under the site header), the sidebar styles and the door page styles. The picture stage gets its tones automatically from `player()`.
- `site/src/prototypes/guide-v2/harness.ts` and the page `site/src/pages/prototypes/guide-v2/index.astro` hold the picker, which is verbatim from the prototype skill. Don't touch them. Each variant exports `mount(stage: HTMLElement): () => void`. The returned function must clean up timers, listeners and the player, because switching variants re-mounts.
- Facts: every word that names a piece of T3 Code comes from `site/src/data/t3code.ts`. Relevant entries:
  - `screen.*`: composer, statuses, workLog, workLogGroups, workedFor, filter, contextWindow, permissionChip, subagents;
  - `browser`: "Each environment has a browser that you and the agent both see";
  - `htmlRenders`: agents can answer with a self-contained HTML page that renders in the thread;
  - `permissionModes`.

  If you draw something with no fact, mark it `example` and list it in your notes.

## Shared requirements

**The page is a drawing of T3 Code, marked "example", never a copy.** It has a sidebar, a chat column and, new here, a browser panel on the right.
- Leave out what the lesson doesn't need: open-in-editor, git controls, device name.
- The composer slot holds the lesson controls: back and forward through points, the part's clean title, pause/play, and part back/forward (parts are out of scope here, so they can be disabled stubs).
- Autoplay starts on mount.

**The inline thread summary.** The turn's work collapses to T3 Code's own summary line, "Worked for {duration}", with grouped rows ("Read 2 files", "Ran 2 commands"), and opens to the rows. How it reads, opens and follows the points is your variant's job.

**Phone (390×844).** Understanding comes first; there is no room for three columns. The sidebar hides; decide how the chat and the browser share the screen. Desktop is 1440×900 and must also work at 1024×768.

**Craft rules (Emil Kowalski):**
- Animate only what has a purpose.
- `ease-out` (`var(--ease-out)`) on entrances, never `ease-in`.
- UI motion under 300 ms.
- Only `transform` and `opacity`.
- `:active { transform: scale(0.97) }` on pressables.
- Hover styles only under `@media (hover: hover) and (pointer: fine)`.
- Nothing appears from `scale(0)`.
- Popovers scale from their trigger.
- No animation on keyboard-driven point changes.
- `prefers-reduced-motion` handled.
- Buttons at least 44 px on touch.
- Use the site tokens (`--ink`, `--paper`, `--card`, `--rule`, `--muted`, `--accent`, `--sans`, `--mono`, `--text-*`, `--space-*`, `--radius*`) so it looks like this site in light and dark.

**Copy.** Plain and short, no hype. Use the lesson's words from content.ts; don't invent claims.

**Checks.**
- The page runs at http://127.0.0.1:4826/prototypes/guide-v2/?v=N (shared dev server; it reloads when others save).
- Use Playwright, pinned in `site/package.json`. Run scripts from `site/` and never pass `--no-sandbox`. Before your first look, set localStorage `acg-level-offer` to `shown`.
- Shoot 1440×900, 1024×768 and 390×844, in light and dark, at every point. Use the dark theme via `document.documentElement.dataset.theme = 'dark'`.
- Look at every screenshot yourself. Check for no console errors and no sideways scroll.
- Save screenshots under `~/.local/state/agent-artifacts/vibecoding-guide/guide-v2/proto-<variant>/`.
- Don't commit, don't stop or restart servers, and edit only your own variant's files.
