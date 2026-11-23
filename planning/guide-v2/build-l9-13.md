# Build notes: lessons 9 to 13 (chapter 3, More agents)

Range `l9-13`. Script: [lessons-9-13.md](lessons-9-13.md). Built on branch `t3/7dee7daa`.

## What I built

- **Script** `planning/guide-v2/lessons-9-13.md`. It covers the week after the Friday: Mon to Fri, with the Lantern's birthday night (the first one with tickets) on Friday. Each lesson's job is one where more agents really help.
- **Lessons** `site/src/v2/lessons/l9.ts` to `l13.ts`, 17 parts in total:
  - **9 A helper** (4 parts): reading fills the window; a helper (subagent) with an empty window; three read-only helpers check at once; a helper's approval and its usage both land on you.
  - **10 Side by side** (3 parts): three threads in three worktrees; bringing them back, where the merge is clean but the checks on main fail because each guessed what a ticket is; agree the shared shape first.
  - **11 A lead** (3 parts): one thread delegates three child threads; the lead's check on all three before main; the join that only the lead can do.
  - **12 A second model** (4 parts): fresh eyes from the same model; a different provider's model (GPT-6.2 Sol via Codex) reviews; telling a reviewer when to stop; two models, one prompt (Shift-click).
  - **13 A fleet** (4 parts): twelve Haiku helpers at once; one plan pays for all of them, and the thread hits Limited; twelve reports, one reader, where the check before main catches the do-not-admit red turned orange; more isn't always faster.
- **Shared pictures** `site/src/v2/lessons/ch3.ts`. It isn't a lesson: the glob is `l*.ts`. It builds the desk (`team`, a lead with helpers), jobs side by side (`jobs`), moves along any route, and the words from T3 Code.
- **Four Preview apps**, each with its own file, CSS and folder:
  - `giveback`: a guest's invite with give-back and undo, the door's count bug, and a trial copy.
  - `tickets`: the sale page, the door scan (in its own worktree, mismatched, then working together), sales, the refund bug, the two-phone race, and two redesigns.
  - `guestimport`: the three sources, Noor's plus-ones bug, the fix, and merged duplicates.
  - `pagecheck`: 24 pages × 3 checks, from waiting to running, checked, the red failure and done.

  Helper agents built the apps to my stage contracts, with `door.ts` as the quality bar. I reviewed their screenshots.

## Shared-file changes (all additive, commented "Chapter 3")

- **`v2/content.ts`**
  - `Move` gains `{ to: 'path' }`, for a puck along any route, and `{ to: 'all' }`, for moves at the same time. They're for leads, helpers and jobs.
  - `Point.threads?: SideThread[]`: the lesson's story threads in the sidebar, each with its own status. Used for threads side by side.
  - `Row.agents?: SubRow[]`: T3 Code's subagent rows under a work-log row.
  - `Part.replyAt?`: where the reply lands when no move goes to `you`.
  - `Ui.usage?`: the thread details' Usage limits row.
- **`v2/player.ts`**
  - `replyAt` honours `Part.replyAt`.
  - `move()` handles `path` and `all`.
  - Status icons for Waiting, Input and Limited, drawn after T3's CircleDotDashed, MessageCircleQuestion and CircleAlert. `statusKey` falls back to the lower-cased word.
  - `showSidebar` uses `Point.threads` when a point sets it.
  - `previewAt` no longer falls back to an app's `none` stage before a lesson's first Preview point: the tab stays hidden until then, and its first appearance gets the "changed" dot. All five Haiku testers who saw the dev-server 404 there read it as broken. Lesson 2 is unchanged because it sets `door('none')` explicitly, but lessons 3 to 8 that relied on the fallback would now show no Preview tab until their first preview point.
  - `fillTurn` sets each subagent's state (Running, Completed or Failed) and the group summary ("{count} working · {count} done · {count} failed").
  - The usage-limits block in thread details.
  - A click handler opens and closes a subagents group.
  - A null guard on the live row's label.
- **`pages/v2/index.astro`**
  - Renders `Row.agents` as T3's subagent group: a "{n} subagents" button that a group of more than 4 starts closed, then one row per subagent with an avatar and status dot, title, detail and status. The model is in `title`, as T3 shows it in the hover card.
  - Adds the usage-limits block in thread details.
  - Adds `bot` and `delegate` icons.
- **`styles/v2.css`**: one block for the subagent rows, the usage block and indented sidebar thread rows.
- **`v2/ui/summary.ts`**: a `delegate` row kind, for the "Delegated {count} tasks" label.
- **`data/t3code.ts`**: new facts, listed below. `guides/fact-check.md` was regenerated.

## New facts (`t3code.ts`, read on T3 Code `main` at 7b47a21, 2026-11-23)

- `subagentRequests`: a subagent's approval request appears in the parent conversation, and the parent row says Approval, or Input for a question (`docs/user/permission-modes.md`; `Sidebar.logic.ts` `pendingSubagentRequest`).
- `delegateChild`: `delegate_task` starts a child with only its task and no parent history. It can run with `isolation: worktree` and on another provider. Children live inside the parent's view, not in the thread list (orchestrator `tools.ts`; `isListedThreadLineage`).
- `waitingOnChild`: a thread blocked on a child thread reads Waiting (`Sidebar.logic.ts`).
- `stopStopsSubagents`: stopping a thread stops the subagents it delegated to (`thread-sidebar.md`).
- `screen.subagentStates`: "{count} working", "{count} done", "{count} failed" (`subagentDisplay.ts`).
- `screen.subagentRow`: Running, Completed, Failed; the model is in the hover card (`V2LifecycleRow.tsx`).
- `screen.delegatedRow`: "Delegated {count} tasks" (`t3ToolSummary.ts`).

Corrections my research made to earlier assumptions, which are now in the script:
- Delegated child threads are **not** sidebar rows.
- "Woke" is the snooze status. It does not mean a delegated result arrived.
- The tool row says "Delegated {count} tasks". "Created {n} threads" is for `create_threads` and `t3_thread_launch`.
- A single subagent has no group row.
- T3 Code has no built-in "review with another model" button.

## Open questions

1. Lesson 10 has the agent merge worktree branches with git in a thread. T3 Code's docs describe commit, push and pull requests, but not merging one worktree into another, so the lesson shows the merge as the agent's own commands.
2. Lesson 12.2 names Codex with GPT-6.2 Sol as the reviewer. The finding, the race on the last ticket, is made up. Which model would find what is not a claim.
3. Context-window percentages restart per story thread. Lesson 5 (built elsewhere) reveals the context row. On this branch it first appears in lesson 9.
4. The `Ui.usage` label "Weekly" and its numbers are examples. The real label depends on the provider.

## Critique log

### Before the testers (my own pass with screenshots)

- **Fixed: the context number carried over between threads.** The 7% from lesson 9 showed in lesson 10's new threads, so every story thread now sets its own number on its first point.
- **Fixed: lesson 9's two thread titles** ("Where a spot is counted" and "…, with a helper") read alike and were cut off in the sidebar. The second is now "Give back a spot".
- **Fixed: annotations sat on top of parts of the picture.**
  - Lesson 10: the worktree term collided with the check note. It now shows only in part 1, and the check notes sit above.
  - Lessons 11 and 13: notes under the check landed on the main project. They are now below the project.
  - Lesson 12: notes on the check covered the model, so they moved to the reviewer. The "Buy at the bottom" note had hidden the Opus 5.5 label, so it moved to the tray.
- **Fixed: twelve subagent rows were a wall of text.** A group of more than 4 now starts closed, as T3's group row opens and closes.
- **Fixed: the plan meter read like one more helper.** It now carries a standing "your plan" label.
- **Fixed: lesson 12.4's thread titles** both began "Ticket page", so the model name was cut off. They now start with the model.

### Haiku round 1 (1440 light l9–l11; 390 dark l12, l13, l9; 1024 dark l10, l12, l13)

No console errors and no sideways scroll at any size. What they found, and what I did:

- **Fixed:**
  - In lesson 9 the "a question, no changes" note clipped off the left edge. Lesson 9's window notes now sit on the right.
  - In lesson 13 "six to look at" overlapped "your plan". The meter label is now on the left, and the lead's notes sit below.
  - On a phone the subagent group header was 23 px tall. It is now at least 44 px with a coarse pointer.
  - The ticket app's design-A confirmation had grey text on orange and stubs that disappeared. I sent it back to the tickets app's builder.
- **Not changed, on purpose:**
  - **"Cannot GET /tickets" (and /i/ana) on the Preview tab before anything is built.** Lesson 2 does the same with the door app, and the player shows an app's 404 before its first stage. All three testers read it as broken. Fixed in round 2 (see below).
  - **The address bar (`localhost:4321/sales`), the "worktree: t3/…" tags and the "Skill: agentic-guide" row.** They're deliberate: the drawing shows what T3 Code shows.
  - **"Review 0" and the icon bar at the bottom.** They're the dev server's overlays, not the page.
  - **No exit after lesson 13's last point.** It's the last lesson that plays, and the shared player disables Next there. Not mine to change.
  - **"Expected at the door" not dropping after a refund on `/sales` in lesson 10.** That's the refund bug lesson 12.1's review finds, planted on purpose. Only the `refund-bug` stage labels it.
  - **The sheet caption covers the bottom of the sales chart on a phone.** The app scrolls under it, and the caption is the shared player's.

- **Fixed after round 1 (my own find): a subagent row showed its result while it still said Running.** `SubRow.doing` now holds the progress line shown while it runs; the result appears once it's done.

### Haiku round 2 (1440 light l9, l12, l13; 390 dark l10, l11, l12)

No console errors and no sideways scroll. The subagent group header is at least 44 px on touch.

- **Fixed:**
  - **"Cannot GET" again, in lessons 10 and 12.** The shared fallback is changed (see Shared-file changes): the tab is now hidden until it is first needed.
  - **Annotations on the wrong tower.** In lesson 9 a helper's note landed on the agent, so helper notes now sit on its right. Lesson 12's reviewer notes are now below the reviewer. Lesson 13's "observation: one case" was on the main board and moved off it.
  - **Lesson 9.4's helper row** said "waiting for approval" after the approval.
- **Checked, and not a bug:**
  - "ArrowRight wraps to Point 1 at a lesson's end": it moves to the next lesson, whose first point reads "Point 1 of N". I checked l10 → l11.
  - "No filters" in the guest import: they're there, as chips. The tester's selectors missed them.
- **Left alone, as judgement calls:**
  - Window notes sitting on the glass of a tank. That's the engine's style, and lesson 2 does the same.
  - Lesson 9 part 2 repeats part 1's request. That's the point of the part: the same question in a new thread, plus one sentence.
  - The two-tap Refund in the sales app. A confirm on refunds is good practice.

### What I still don’t like

- In lesson 13.2, while the thread is Limited, the three unfinished helpers still count as "working". T3 would show them stopped or idle, and SubRow has no "stopped" state.
- Window notes (tank anchors) still sit on the tank glass, and a few notes touch a tower's edge at 1024 px. It's the engine's label placement; a holistic pass could give the label layer a no-overlap rule.
- The "the give-back page" note in 9.3 sits on the project board's edge.
- Lesson 9.4 shows a subagent's approval only through the Approval status and the words. There's no approval panel; lesson 7, built elsewhere, may add one that this part could reuse.
- At 1024 px, a fleet of 12 makes the picture small. The helpers read as a crowd, which is the point, but the annotations are small too.
- The usage-limits label "Weekly" and its percentages are examples, and they jump (66 → 22 → 0 → 90) to tell the story.
