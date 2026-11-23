# The guide as a skill you run in T3 Code: plan

2026-11-21. This combines six reports in this folder, read against [BRIEF.md](./BRIEF.md):

| File | Who | What |
| --- | --- | --- |
| [research-prior-art-opus.md](./research-prior-art-opus.md) | Opus 5.5 | Prior art, sourced |
| [research-prior-art-sol.md](./research-prior-art-sol.md) | GPT-6.2 Sol | Second prior-art pass and a verdict |
| [design-experience-opus.md](./design-experience-opus.md) | Opus 5.5 | First ten minutes, triggers, concept map, voice, notebook, ideal list, hero |
| [design-skills-opus.md](./design-skills-opus.md) | Opus 5.5 | Packaging, the "use" skills, full screen, lesson format |
| [take-neon.md](./take-neon.md) | Gemini 4 Neon | Blunt second opinion |
| [take-fable.md](./take-fable.md) | Fable 5.2 | One first-principles take |

Nothing here is built yet. The lab T3 Code for trying it runs at <tailnet preview URL>, fixed at server 0.1.9. It has its own data folder (`~/.local/share/agentic-guide-t3-lab`) and an empty project at `~/Developer/agentic-coding-lab`.

## How new is this

Each part of it has been done before, but nobody has put the parts together.

**Already done:**
- **Learner picks real work, progress saved in the repo:** the Discord-org Claude Code tutorial (`/tutorial`, "pick something real").
- **Your own project through a fixed course:** cc-self-train runs a ten-module course on it.
- **Teaching during everyday work:** Anthropic's Learning output style does this.
- **Quizzes on what you just built:** CodeSensei and learn-while-build.
- **Interactive HTML lessons:** teach-me, codebase-to-course and VibeTour, each in its own file or panel.
- **Courses:** Anthropic Academy, DeepLearning.AI and Cursor Learn teach on the web, and you practise somewhere else.

**Not found anywhere:**
1. A course whose subject is the agentic way of working: context, checks, delegation, orchestration. All the in-agent tutorials teach tool features or code.
2. Lessons that fire on the learner's own thread, with the learner's own numbers in the figure.
3. Figures shown inline in the chat thread, next to the work.
4. Nested agents used as the demonstration itself, so the learner loses track of who did what and then learns why leads and checks exist.
5. One static source behind both the website and the skill.

**Credit.** Theo's [tstack](https://github.com/t3dotgg/tstack) is everyday working skills, not teaching. It already follows the packaging pattern we want: use T3 Code features when they're present, fall back to native tools when not. We credit Theo for T3 Code, and for tstack wherever we borrow the pattern.

**The warning to design around.** Anthropic's trial with 52 developers found that delegating to AI lowered understanding, while asking it "why" helped. Harvard's CS50 tutor shows that instructions given only in a prompt get broken about a quarter of the time. So every lesson ends with something the learner checks or explains, and anything that must always happen can't rely on prompt instructions alone.

## The shape (all six reports agree)

**There are no lessons to complete.** The learner brings their own work, and the agent does it with them. The skill waits for the moment a concept has just happened in their thread. Then it names it in two sentences and offers one move to try.

The core loop:

1. You ask for something you need.
2. The agent does it.
3. At the end of the turn, at most one aside under a fixed label, for example "Lesson · It gets hands". It points at one thing that just happened.
4. You try the suggested move, or say "not now", "skip", "I knew that" or "more".
5. One line goes into your notebook.

**Triggers are counts, never self-judgement.** "Notice when you said done without checking" relies on the very blind spot the lesson teaches. "Edited code, ran no test, said done" can be counted. T3 gives a skill no events to subscribe to, so every trigger is the agent noticing something at the end of a turn. A hook that forces nudges in Claude Code can come later as an opt-in.

**The two sessions to design for:**
- **Session one:** fifteen minutes to something of the learner's own that works. Three spoken questions, then "pick anything", plus examples chosen from what they said. One real observation about their own run, three lines in the notebook. The feeling to aim for: "I understood what just happened to my files."
- **Session ten:** the tutor is nearly silent. It stops commenting on anything the learner has done twice without a nudge. The learner calls the look-back tools themselves. The lessons and the "use" skills turn out to be the same thing at two ages.

**Your dashboard example fits this:** while their own task runs, the aside says "a dashboard often helps here. Try: *make me a dashboard of what you've done so far*."

## What we ship: one repo, two parts

Neon argued for two packs, because a course is something you finish and the tools stay. Fable argued they are one thing at two ages. Both points fit one repo with separable skills:

| Skill | Lifetime | Does |
| --- | --- | --- |
| `learn` | Weeks; uninstall when done | The tutor: interview, trigger table, lessons, notebook |
| `visualize` | Permanent | Template plus data, written to one self-contained HTML file, shown inline with `html_render`. Without T3 it prints the file path. No dev server |
| `look-back` | Permanent | "What happened", "what did I do" and "what went wrong" are one skill asked from three distances. It writes one session file in a fixed shape (`runs/<date>.json`) that a deeper agent can analyse for bottlenecks |
| `overview` | Permanent | A live board: threads, their state, what's waiting on you |

I merged the brief's six "use" skills into three, as Fable suggested: visualize is the viewer, look-back is the analysis, and its session file is the "something agents can use later".

**Where the data comes from:**
- **Inside T3:** look-back reads the thread with `t3_thread_read`, which works for every provider and includes child threads. I checked that an agent can find its own thread id: `orchestrator_capabilities` returns it as `parentThreadId`.
- **Token counts:** they aren't in T3's thread view; I checked. They come from the provider's own logs, for example the `usage` fields in `~/.claude/projects/*.jsonl`. Those logs can be 22 MB, so a small dependency-free script boils them down first.

**Install:**
- **Both agents, one line:** a `git clone` plus `install.sh` symlinks each skill into `~/.claude/skills` and `~/.agents/skills` (Codex follows symlinks).
- **Claude Code plugin:** a plugin marketplace entry as well, which also handles updates.
- **Portability:** frontmatter holds only `name` and `description`, so the same file works in both agents.

## The notebook

The notebook is a plain folder, `~/agent-notebook/`, outside every project. Lessons carry across projects, projects get shared, and notes inside a repo get read by agents as instructions. It is a private git repo with a fixed shape, so it can't turn into a notes product:

| File | Holds |
| --- | --- |
| `me.md` | Field, tools, plan, level; under 300 words |
| `progress.json` | Each concept: seen, felt, known or skipped, with date and trigger |
| `journal/<date>.md` | What they built, what went wrong, links to the threads |
| `playbook.md` | Prompts and rules that worked, in their own words. When one has been reused three times, the agent offers to move it into that project's `AGENTS.md` (Neon's "friction log becomes AGENTS.md") |
| `runs/<date>.json` | Look-back's session files |

**It teaches itself:** the notebook is the only reason the tutor knows the learner in a new thread. Session two says so out loud, which is the "Write it down" lesson, lived.

## Full screen, honestly

Some of this is verified and some isn't:

- **Already works:**
  - T3's inline visual replies come with an expand button for full screen.
  - `html_render` accepts a file path, so a figure shipped with the skill costs no output tokens.
- **What doesn't work:**
  - The inline page is sandboxed.
  - Its links open the system browser.
  - `preview_open` takes only `http(s)` URLs, not `file://`.

  So no button inside the figure can open the side tab by itself.
- **The plan:**
  - The figure ends with "Open big", which copies a prompt, or shows the words to type if copying is blocked.
  - The agent then calls `preview_open` on the **site's copy** of the same figure, with the learner's numbers in the URL fragment. The fragment never leaves the browser.
  - Fallback: a tiny local static server on `127.0.0.1`.

This depends on the site being deployed again; the Cloudflare build is still broken.

## Every concept has a moment

The experience design maps all 21 journey steps, plus four extras, to the moment in real work where each lands best (its section 3). Examples:

| Concept | Lands when |
| --- | --- |
| It gets hands | The first turn with five or more tool calls; the figure shows their own counts |
| The window fills | It breaks a rule they gave hours ago |
| Make it prove it | They find a bug it called done |
| Several jobs | They've watched one run for two minutes |
| Twenty in a loop | Only when asked: a capped nested fan-out on a throwaway task, ending in a tree of who did what |

Some concepts don't occur on cue in real work: a live agent may simply not fail. Those get a scratch repo with planted traps (Neon's idea), clearly labelled. Failures are never staged in the learner's real work.

## Voice

Second person, about what they're doing and what they'll see. Name a feeling only when it's predictable: impatience, misplaced trust, losing track. Never praise. Use real numbers or none.

**Before:** "Four come out broken, in orange, and all six arrive marked "done"."
**After:** "It just told you it's done. It would have said the same if the export were broken. Did you feel that small jolt of trust? Look at the turn's tool calls: did it run the export even once?"

The site has no live moment, so it uses "you will". Four full rewrites are in the experience design, section 4.

## One source, two surfaces

Each lesson is `lessons/<id>/lesson.md` plus an optional `figure.html`:

- **Frontmatter:** id, triggers, prerequisites, ids of facts in the data files.
- **Sections:**
  - `aside`, per level, under 60 words;
  - `try`, one prompt;
  - `talk`, questions to expect;
  - `deeper`, a link to the site.

The site reads these files through an Astro collection, as it already does for `guides/` and `wiki/`. A build step copies them into the skill and stamps in the dated facts from `site/src/data`. A price is never typed into the skill.

The journey's scroll scenes stay on the site. Fable's rule for inline figures: an inline figure is either drawn from this session's data, or it's a link to the site. We don't rebuild the website in a 728-pixel box.

## The site

**The hero:**

> **Learn to work with coding agents.** Read how it works, or learn it while you build something of your own.
>
> [Read the guide] [Start in T3 Code]

**Under the second button:**
- **What it needs:** T3 Code (free) and one AI plan, from $20 a month.
- **Three steps:** install T3 Code, sign in to a provider, press the button.
- **The button:** a T3 prompt link (`app.t3.codes/new?prompt=…`) that drafts the install request and runs nothing until the learner presses Send. Needs checking on current versions.
- **Credit and independence:** "T3 Code is made by Theo and T3 Tools. This guide is independent; we learned a lot from Theo's work."

**Neon's warning, which I agree with:** the main reader is a skeptical engineer, and asking them to install three things before trusting us loses most of them. So the web path still has to pay off in two minutes with no setup. "Try this live in T3 Code" also goes at the end of each journey lesson, not only in the hero.

## Risks

- **It fills the window it teaches about.** The skill (3–5k tokens) and every aside are reread each turn. Lesson bodies stay in files; long answers go to side chats (`/side`).
- **Compaction can drop the skill,** and the lessons silently stop. The tutor says how to re-add it, and session files survive compaction.
- **Interrupting work gets it uninstalled.** Asides go at the end of a turn only, at most one, and "not now" is always accepted.
- **Platform bet.** T3 Code is at 0.1.x. Every skill works in plain Claude Code or Codex and gets better inside T3.
- **Cost.** The nested fan-out burns tokens. It is capped, uses cheap models and is offered only when asked.

## Verify in the lab before building

1. Whether a link in an `html_render` page can open the side tab, or only the system browser.
2. Whether clipboard copy works in the inline sandbox.
3. Whether side chats (`/side`) and prompt links exist in 0.1.9, and whether skills load in side chats.
4. How Codex sees T3's tool names, and whether its sandbox lets a skill write to `~/agent-notebook/` or bind a port.
5. How reliably a model counts its own tool calls and checks at the end of a turn.
6. A clean learner: run the lab with its own `HOME`, so none of the owner's skills, instructions or sign-ins leak in.

## Build order

1. **Lab checks** (the list above), half a day.
2. **Thin slice:**
   - the lesson format and three lessons: It gets hands, The window fills, Make it prove it;
   - the `learn` skill, with interview, trigger table and notebook;
   - `visualize` and `look-back`;
   - test it with fresh Haiku and Sonnet "learners" in the lab, then a real person.
3. **Site:** the hero, lessons read from the shared source, "try this live" links, and the switch to second person on the pages it touches. This needs the Cloudflare deploy fixed.
4. **The rest:** the remaining lessons, `overview`, second opinion from another provider, the nested fan-out, the planted-trap scratch repo.

## Decisions for the owner

- **Names:** the repo and plugin name (working name `agentic-guide`), and whether the skills get a prefix (`ag-look-back`) to avoid clashing with skills people already have.
- **Notebook location:** `~/agent-notebook/` outside projects (recommended), or a progress file inside each project like the Discord tutorial.
- **Thin-slice audience:** whether it targets the expert reader first, or newcomers.
