# Guide v2: the first slice

This is the handoff for building Guide v2. The owner worked out the direction with a thinking-partner thread and asked for a first slice to try. Everything the builder needs is in this file and the files it links.

## The request, as relayed from the thinking-partner thread

They want a first slice they can try. It is a new, separate "Guide v2": leave the current journey (v1, `/journey/…`, `site/src/journey/`, `layouts/Journey.astro`) and its routes as they are.

### What to build

- A new section called "Guide v2". It gets its own link in the site header and its own route (`/v2/`).
- Build the shell and the first two lessons of the new chapter 1, with all their parts. The owner's words were "try it for the first 2 parts". The relay read that as these two lessons. If you read it differently, build the two lessons anyway and say so in your reply.

### The idea, in the owner's words

> "just doing a fake t3code in the browser which goes through the lessons piece by piece and the lessons popup just inline in chat and we fake the entire agent experience is great and instead of the chatbox we have the controls for going back and forth in the lessons or specific substep which has a clean title and pause/start the animated explainer and per default it just starts a lesson when you click on it."

> "The sidebar has the same features as on t3code. When we then want to explain the tool we can just highlight the context bar. We don't have to do 1:1 the UI we will keep thing away which don't matter too much like an open in vscode button and we will start progressively showing more and more of the UI. before we don't talk about multi device use there is no need to show the current device name. Same with git branches and usage limits and context. These will all appear newly once the lesson is taught and it will pop up."

> "The sidebar needs to be shown very early so we can let people use it as a table of contents of the different lessons by using the t3 sidebar filter icon as an actual control to show the lessons"

On the chat, the owner said it:

> "needs to also become way more realistic and like t3code (not crazy but right now it's imessage and not an ade chat). It should show the subagents/threads spawning and short but still a few paragraph responses which contain the lessons meta information at the top and then the actual response below. on web we fake that and in the skill the users agent actually responds."

On examples: "we want to teach people to let the how disappear for a bit and focus on the what". The narrative lives mainly in the example. The example world is a nightclub, which replaces the football club.

### What that means concretely

1. **The page is a simulated T3 Code.** It has a sidebar and a chat column. Every lesson is a scripted thread, and each part of a lesson is one turn: the request, then the work log, then a reply.
2. **The reply** opens with where the reader is (chapter, lesson, part). Then come the title, the picture as an inline block in the chat, and a few short paragraphs of what the agent actually answered.
   - The picture is the existing engine (`site/src/journey/picture.ts`, `scene.ts`, `presets.ts`). Reuse it; do not redraw it.
   - This mirrors how the skill shows a figure inline in a real thread (`skills/agentic-guide/`).
3. **Controls replace the chat box.** Where the chat box would be, put:
   - back and forward through the parts of a lesson, and through the points of a part's animation;
   - a clean title for the current part;
   - pause/play.

   Clicking a lesson in the sidebar starts it playing. The reader moves back and forth through the points of an animation. There is no before/after comparison view and no guess-first quiz.
4. **The sidebar is there from the first lesson, and it is the table of contents.**
   - A chapter is a project and a lesson is a thread.
   - A thread's state shows where the reader is: Completed for a finished lesson, Working for the one playing.
   - The sidebar's filter control switches between the lessons and the threads of the story inside the current lesson (for example a lead and its helpers).
   - Check what the filter icon does in the real app before giving it this job; `site/src/data/t3code.ts` has no fact about it yet. Add a sourced fact for it, and for any other piece of the app you draw. Research notes are under "What the real app does" below.
5. **Everything else in the app appears only when its lesson teaches it**, and is highlighted when it appears: model name, branch, permission mode, context indicator, usage limits, device name. Leave out what does not matter (an open-in-editor button and the like).
6. **Use the app's own words** from `site/src/data/t3code.ts`: the thread states Working, Completed, Pending Approval, Awaiting Input and Plan Ready; the work-log rows; "Ask anything...". The page is a drawing of the app marked "example", never a copy of it. Accuracy of tool claims is this repo's first priority.
7. **Names**, in text and in the interface: chapter, lesson, part. A stop inside a part's animation is a **point**. Words on the picture are **annotations**. The owner does not want "bubble", "counter" or "readout". (v1's code uses chapter and part the other way round; do not rename v1.)
8. **Requests are outcome-level** and use the same sentence at every reader level. The level changes how much of the how the work log and the reply show. Each request carries a "done when" or a "must never".
9. **Phone and desktop:**
   - Phone puts understanding first.
   - Desktop adds doing: the prompt to copy and the "in T3 Code" notes are prominent there, and one line each on a phone.

### The new order

This is the relay's proposal. The owner asked for a reorder around working in parallel and has not yet confirmed this exact list.

- **Chapter 1, Hand it over:** Say what you want · It gets hands · Done when · Start another
- **Chapter 2, Why it goes wrong:** The window fills · Write it down · Your turn · Proof you can read
- **Chapter 3, More agents:** A helper · Side by side · A lead · A second model · A fleet
- **Chapter 4, The work around it:** Cost · The project grows · Other people · Other machines
- Providers, Git and hosting, and first setup move out of the main line into a "Set up" project in the sidebar.

Show all of these in the sidebar so the table of contents can be judged. Only the first two need to play.

### The two lessons to build

**Lesson 1, Say what you want** (from v1's `ai` and `chat`). The club's owner tries a model for the first time. Suggested parts:
1. Text in, text out. Asked who on Friday's list has not confirmed, without the list, it makes names up.
2. Only what is in the window. With the list pasted, the names are real.
3. A new thread starts empty.

**Lesson 2, It gets hands** (from v1's `loop`). One request at one-feature size, for example: "At the door I want to type a name, see if they're on tonight's list, and tap them in. It must work on my phone with one hand." Suggested parts:
1. Tools and the work log appear.
2. One request, many turns.
3. Take "run" away and it still says done.
4. Say what done looks like.

These parts are starting points; tighten or change them as the material needs.

### Read first

- **[prototype/lesson-thread.html](prototype/lesson-thread.html)**: the prototype the owner reacted to and liked. It shows one lesson part as one turn: the real picture inline, six points with arrows, and the work log and thread list following the points.
  - [prototype/gen.ts](prototype/gen.ts) shows how its picture states were produced from `team(3)`; [build.mjs](prototype/build.mjs) and [tpl.html](prototype/tpl.html) assembled the page.
  - Its chat box and suggested messages are superseded by point 3 above.
  - Its "Round 2" questions came with recommendations. The owner liked the direction, but their answers to those questions are not recorded here. The text above is what was decided.
- **[../journey-mobile/research-agent-capabilities.md](../journey-mobile/research-agent-capabilities.md)**: what one request to a current agent can credibly be. It has a ladder of request sizes, with two nightclub requests per size. The default job size is a feature or a product slice, not a one-file change. Its unverified figures must not go into `site/src/data` without a re-read.
- **`planning/journey-mobile/SPEC.md` and the `test-*.md` reports**: still valid for v1. For v2, the picture-on-top layout is replaced by the picture inside the reply.

### Constraints

- No private details in the repo. Use made-up names and data only, and say they are made up.
- Follow `CLAUDE.md`:
  - Dated facts live in `site/src/data` with a source.
  - `cd site && pnpm build && pnpm check-links` must pass.
- When it runs, give the owner the preview URL for the `/v2/` route.

## Notes from reading the code

**Reusing the picture.** `site/src/journey/scene.ts` exports `class Scene`, which works browser-only.
- `new Scene(stageEl)` builds the SVG and the label layer inside a positioned element with a height.
- `scene.set(state, instant?)` replaces the state.
- `scene.change(fn)` mutates and redraws.
- `scene.run(async (h) => { … })` runs a script with `h.wait(ms)`, `h.send(points, kind)` (a puck along a polyline; `route.youToAgent()` etc. from `picture.ts`), `h.set(fn)` and `h.check()`. A second `run` cancels the first, which is how back/forward and pause can interrupt.
- `scene.stop()` stops the script and clears the pucks.
- `scene.level` sets the reader's level for term labels.

**Starting states.** These come from `presets.ts`:
- `solo({ tools, project, gate, blocks, labels, meter, tray })` for you plus one agent;
- `team(n, …)` for a lead and helpers;
- `jobs(n, …)` for side-by-side threads.

`lab(at, text, place)` makes a label, which v2 calls an annotation. `termLabel` in `terms.ts` links a glossary term. See `chapters/ai.ts` and `chapters/loop.ts` for how v1 scripts the same mechanisms (for example `runPredict`).

**Styles.**
- The picture's styles are global, in `src/styles/journey.css`, together with `components/fig/fig.css` and `styles/board.css`.
- Two variables sit on `.j-root`, which v2 won't use, so set them on your own container:
  - `--j-shade`: `var(--ink)`, or `var(--paper-2)` in dark mode;
  - `--j-work`: `#c58f0c`, or `#e7bd45` in dark mode.
- `.j-stage` gives the stage `position: relative`.
- Don't pull in v1's layout rules (`.j-view`, `.j-steps`, `.jp`). They are scoped to `.j-root` / the journey container, so importing the CSS is fine as long as v2's markup does not use those classes.

**Header link.** Header items come from `sections` in `site/src/lib/nav.ts` (`ready: true` shows them). Add `{ id: 'v2', label: 'Guide v2', path: 'v2/', ready: true }`. The header goes inline from 64rem when there are 4 sections or fewer (`Header.astro`, "Few sections"). A fifth item may need that breakpoint checked: the header must not overflow at 1024–1440.

**Layout.** `Base.astro` (`section` prop) is the shell, and `LevelBoot` handles reader levels (`lib/levels.ts`: plain, technical, engineer; `LEVEL_EVENT` on document).

**T3 Code's words already sourced** are in `site/src/data/t3code.ts`:
- `screen.composer` ("Ask anything...");
- `screen.newThread`;
- `screen.statuses`;
- `screen.workLog`;
- `permissionModes`;
- `defaultMode` (Full access);
- `limited`;
- `delegate` (delegate_task);
- `usagePage`;
- `sideChat`;
- `newThreadButton`.

## What the real app does (sidebar, filter, chat)

Read from the T3 Code source on GitHub, `pingdotgg/t3code`, main branch, on 2026-11-22. Paths are relative to `https://github.com/pingdotgg/t3code/blob/main/`. The quoted words are the English source strings inside the i18n helpers. Each one still needs a `fact()` in `t3code.ts` before it is drawn.

- **The filter icon is a project filter.** It is a funnel (`ListFilterIcon`) labelled "Filter threads by project". It opens a list with a "Search projects..." field, "All projects", and one row per project; Shift-click selects several. Once projects are picked, the icon shows their favicons. There is no sort, status or archive option in it. Source: `apps/web/src/components/Sidebar.tsx`.
  - So in v2 it maps cleanly to "show the threads of this chapter": chapters are projects. The relay's idea of switching between lessons and the story's own threads is not what the real control does. Showing a lesson's helpers is the job of the subagent rows (below).
- **The sidebar sorts threads by state by default**, into the sections "Pinned", "Active", "Working" (with a count), "Snoozed" and "Settled". Project folders are a Labs setting ("Boring sidebar (group by project)"). With folders on, the folder header has a "New thread in {project}" button. Sources: `Sidebar.tsx`, `apps/web/src/components/settings/LabsSettingsPanel.tsx`, `apps/web/src/components/sidebar/SidebarProjectFolderHeader.tsx`.
  - The header buttons are "Add project" and "New thread", and the thread search has the placeholder "Search". Source: `apps/web/src/components/sidebar/SidebarThreadHeader.tsx`.
- **Status labels:**
  - "Pending Approval", "Awaiting Input", "Guest Request", "Working", "Connecting", "Waiting", "Failed", "Plan Ready" and "Completed". Source: `Sidebar.logic.ts` (`resolveThreadStatusPill`).
  - "Limited". Source: `sidebar/SidebarThreadRow.tsx`.
- **Subagents are not listed at the top level of the sidebar.** In the parent's timeline they form a group row, "{n} subagents", with a status line, the elapsed time and stacked avatars; expanding it gives one row per subagent. A child thread shows a "Subagent of {parent}" divider, and its composer is replaced by "Runs on its own" with an "Open parent" button. Sources: `chat/TimelineV2EventRow.tsx`, `chat/MessagesTimeline.tsx`, `chat/ProviderSubagentBar.tsx`, and `Sidebar.logic.ts` (`filterSidebarV2VisibleThreads`). How nested child rows look in the sidebar was not found.
- **The chat header is a breadcrumb:** the project favicon and name, then "/", then the parent thread if there is one, then the title. A thread without a project shows "No project". "Open in {editor}" and the git controls ("Uncommitted", "vs {ref}") live elsewhere; leave them out. Source: `chat/ChatHeader.tsx`.
- **Composer:**
  - The placeholder is "Ask anything. @ files, $ skills, / commands". The collapsed mobile form shows "Ask anything...". Source: `apps/web/src/composerPlaceholder.ts`.
  - The permission chip reads "Permissions: {mode}", with the modes Supervised, Auto-accept edits, Auto and Full access. Source: `chat/runtimeModeConfig.ts`.
  - There is no context ring in the composer. Context sits in a thread-details usage popover:
    - "Context window", "{used}% used", and "{used} of {max} tokens".
    - "Usage limits": "{label}: {left}% left" and "Resets in {duration}".

    Sources: `chat/ThreadDetailsUsage.tsx`, `apps/web/src/lib/contextWindow.ts`.
  - When usage runs out, a banner reads "{provider} is out of usage · resets {time}". Source: `chat/ComposerUsageLimits.tsx`.
- **Work log:**
  - The summary line is "Worked for {duration}"; after an interrupt it reads "You stopped after {duration}".
  - Row labels (source: `packages/shared/src/toolActivity.ts`):
    - "Ran command";
    - "Read {path}" or "Read file";
    - "Changed files";
    - "Searched files";
    - "Web search";
    - "Skill: {name}";
    - while a command runs, "Running {program}", "Ran {program}" and "Failed {program}".
  - Grouped rows read "Read {n} files", "Changed {n} files", "Ran {n} commands" and "Created {n} threads". Source: `packages/client-runtime/src/work-log/presentation.ts`.
  - There is no "Edited" label.

## Working on this

- Work on your own branch, cut from `skill-and-mobile-lessons`. Commit as you go. The lead merges it into `skill-and-mobile-lessons`.
- Run your own dev server for the owner's preview (your task message says how), and give the owner the URL that opens `/v2/`. Do not stop any other server.
- Check at 390×844 and 1440×900, in light and dark. The repo pins Playwright in `site/package.json`; never use `--no-sandbox`.
- Write what you built and what is left into `planning/guide-v2/NOTES.md`.
- The owner wants Sol (Codex, gpt-6.2-sol) given side quests along the way until its usage is used up. Good fits: review passes, phone checks, fact re-checks, each in its own worktree or limited to its own files.
- If it exists, read `planning/guide-v2/capabilities-recheck.md` (a Sol re-check of the capability figures, with ready-made `fact()` lines) before writing any number into a lesson.
