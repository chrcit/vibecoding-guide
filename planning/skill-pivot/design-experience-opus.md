# The guide as a skill: the learner's experience

Design draft, 2026-11-21. "Verified" means read today in T3 Code's docs on `main` or its tool schemas; this machine runs 0.1.9, so learners may lack newer features. Platform facts that shape everything (first four verified):

- **Visual replies** are sandboxed, with an expand button for full screen; links open in the system browser. `html_render` takes a file path, so a shipped figure costs no output tokens.
- **Side chats** (`/side`) ask about a thread without adding to it; **Add to chat** brings the answer back.
- **Prompt links** (`app.t3.codes/new?prompt=…`) open a draft and never run it.
- **A page cannot talk back**; only an MCP App can, which means shipping an MCP server. Not in v1.
- **No events.** A skill acts only while its text is in the window; every "trigger" is the agent noticing something.

## 1. The first ten minutes

The site covers installing T3 Code and a provider (section 7). Its "Start in T3 Code" prompt link drafts: *"Install the agentic-guide skill from github.com/…/agentic-guide for every agent I have, then tell me what to restart."* The agent runs `npx skills add …`, then asks for a session restart and `$agentic-guide` in a new thread (`$` adds a skill: verified). Budget two minutes.

> **You:** $agentic-guide
>
> **Agent:** We'll build something real, and I'll stop now and then to say what just happened. Three questions; press the mic and ramble. (1) What do you do, and what have you used: ChatGPT on the web, Copilot, Claude Code, nothing? (2) What would you like to exist by tonight? (3) Can I keep notes on what you learn in `~/agent-notebook/`?
>
> **You** (dictated): Hydrologist. ChatGPT for emails. A folder of messy gauge-station CSVs I plot by hand every week…
>
> **Agent:** Pick anything. People in your position often start with one of these: **your CSVs, cleaned and plotted**, on made-up data with the same columns first, so no real readings go anywhere until it works · **a one-page site** for your group · **a small tool you'd use daily** · **something you've wanted for a year**.
>
> **You:** The CSVs.

Minutes 3 to 8: synthetic data, the cleaner, a plot rendered inline. Then the first aside:

> **Lesson · It gets hands.** You sent one message; I took eleven steps: read 3 files, wrote 2, ran 4 commands. Open the tool-call summary above to see them. Acting, looking and acting again is what makes this an agent. *[figure: the loop, with these eleven steps]* · Try: "What did you run, and what did you see each time?"

Minute 9: "I put a dip on 14 March in the made-up data. Did the cleaner keep it?" (the check lesson's setup). Minute 10: "Say *quiet*, *more*, or use `/side` to ask without interrupting the build."

**Risks.** Experts find interviews slow, so a stated goal skips them. Examples must come from the profile, not a fixed list.

## 2. How lessons interleave with the work

**Three ways a lesson fires**, most reliable first:

1. **Asked.** "What just happened?", "Why did it do that?", or a side chat. Always works, free until used.
2. **Watched.** The skill holds about 25 triggers (~1,500 tokens). When a turn ends, the agent checks them against counts from its own transcript: at most one lesson per turn, none mid-run, none already seen.
3. **Hooked** (later; Claude Code only; opt-in). A Stop hook script prints a nudge when a count crosses a line. It needs a settings change and may not carry over to Codex (unverified).

**Triggers are counts, never self-judgement.** "Notice when you said done without checking" relies on the blind spot the lesson is about; "edited code, ran no test, type check or browser command, said done" can be counted. Window fullness is not a trigger, since not every harness tells the model (unverified); turns and compactions stand in. Section 3's middle column is the trigger table, plus two more: a message sent mid-run (queue and steer) and under 20 words for a vague task (talk, don't type).

**Delivery**, every part skippable:

- **Aside**: under 60 words, after the work reply, under a fixed label ("Lesson · The window fills") so it never blends into the work.
- **Figure**: the lesson's HTML file, filled with the learner's numbers by a helper script that writes a JSON block. Full screen is T3's expand button. On "open it big", the agent opens the site's copy in the side browser tab, data in the URL fragment (never sent to the server).
- **Try this**: one prompt that moves their own work forward: "A dashboard often helps here. Try *make me a dashboard of what you've done so far*."

**Talking back.** The side chat is the channel: it starts with what the thread knows, the build continues, and **Add to chat** returns the conclusion. In the main thread: "skip", "I knew that" (raises the level), "more", "that's not what I see" (the agent re-checks its claim). Interactive figures end with a "copy my choice" button, since they cannot post back.

**Costs and annoyances:**

- **It fills the window it teaches about.** The skill text (3–5k tokens) and every aside are reread each turn. Lesson bodies stay in files; long explanations go to side chats.
- **Compaction can drop the skill**; lessons silently stop until `$agentic-guide` is re-added.
- **Lessons break flow.** Experts get them only at natural stops.
- **The agent builds and teaches.** Never stage a failure in real work; staged ones go in a labelled throwaway repo.

## 3. Every concept, at its moment

★ marks a concept that has to be lived; telling does little.

| Concept (lesson) | Lands when | Delivery |
| --- | --- | --- |
| Only the window (1) | It makes up a detail about their data | "I didn't know; I guessed" |
| Model far, files near (2) | They first mention real data | Privacy aside |
| Commit, GitHub, hosting (3) | Something first works | Try: "save a version" |
| First loop (4) | The first ten minutes | The frame, not a lesson |
| New chat starts empty (5) ★ | A new thread forgets the morning | Aside after the surprise |
| It gets hands (6) | First turn with 5+ tool calls | Figure with their counts |
| The window fills (7) ★ | It breaks a rule given hours ago | Figure of their pile |
| Write it down (8) ★ | Second session, or a repeated rule | AGENTS.md, then a fresh thread |
| Make it prove it (9) ★ | They find a bug it called done | Prompt for a check |
| A second agent (10) | A side question mid-build | Delegate; show brief and report |
| Side by side (11) | A second idea during a run | Offer a worktree thread |
| A lead (12) | Three or more live tasks | Orchestrator thread with a board |
| Twenty in a loop (13) ★ | Only when asked | Nested fan-out (row 16 below) |
| What it costs (14) | First "Limited" thread; after a fan-out | T3 Usage page: an estimate, not the bill |
| A second model (15) | First merge; a diff over ~200 lines | Review by another provider |
| Proof you can read (16) | "I can't tell if it works" | Ask for proof with the work |
| Your turn (17) | It guessed wrong at a fork | Plan first; pin notes on a screenshot |
| Several jobs (18) ★ | They watch a run for two minutes | Start another; the ceiling shows at four or five |
| The project grows (19) | Around session ten; duplicate code | A clean-up job |
| Other people (20) | First share or pull request | Private sharing options |
| Other machines (21) ★ | They close the lid and the job stops | Aside afterwards |
| Permission modes | First session; first risky command | New threads default to Full access |
| Scratch to project | First thing worth keeping | "Turn this into a project" |
| Be ambitious | First result accepted with "looks good" | Offer one bigger version |
| Laziness trap | Five results accepted, no diff opened | An offer: "Want to see what changed?" |

Twenty in a loop is the clearest case. Watching a lead start three helpers that each start two is easy; following the tree is not. Subagent threads are read-only and approvals bubble up to the parent (verified). Soon nobody can say which helper changed which file. That confusion is the lesson: it is why leads, short reports and a check exist.

## 4. Voice: four rewrites

1. *Ways of Working, Never Wait.*
   - Before: "A ten-minute run is short. Do not sit and watch it."
   - After: "This will take about ten minutes. You'll want to watch it scroll; everyone does the first time. Start a second thread on something unrelated, and come back when this one finishes."
2. *Journey, The window fills.*
   - Before: "Watch a morning of work pile on top: every message, file and log stays, and is read again before every turn."
   - After: "You've been in this thread since nine. Everything you pasted and every file and log it opened is still in there, reread before each reply. When it switched your dates back to month-first, it wasn't ignoring you. Your rule is one line under a morning of other text."
3. *Journey, Make it prove it.*
   - Before: "Four come out broken, in orange, and all six arrive marked “done”."
   - After: "It just told you it's done. It would have said the same if the export were broken. Did you feel that small jolt of trust? Look at the turn's tool calls: did it run the export even once?"
4. *Journey, Several jobs.*
   - Before: "Push it to five. A bare “Done.” means you read the work yourself, about eight made-up minutes; proof and one short question take two."
   - After: "Four threads are going, and two just came back at once. The one that says only "Done." means you read the code before you trust it. The one with a screenshot and a question takes a minute. Notice which you opened first."

Rules: say what they did and what they'll see; name a feeling only when it's predictable (impatience, misplaced trust, losing track); never praise. The site, with no live moment, uses "you will". Real numbers or none: the fourth drops the made-up eight minutes.

## 5. The learner's notebook

A plain folder, `~/agent-notebook/` by default, kept as a private Git repository outside their projects: lessons cross projects, projects get shared, and notes inside a repo get read as instructions.

| File | Holds | Used for |
| --- | --- | --- |
| `me.md` | Field, tools, plan, level, preferences; under 300 words | Read at session start (~1k tokens with progress) |
| `progress.json` | Each concept: seen, felt, known or skipped; date, project, trigger | No repeats; choosing the next lesson |
| `journal/<date>.md` | What they built, what went wrong, what they asked; thread links | Retros, monthly look-back |
| `playbook.md` | Prompts and rules that worked, in their words | Once reused three times: moved to an AGENTS.md or their own skill |
| `runs/<date>.json` | Threads, durations, tool calls, checks, failures, waits | A deeper agent's bottleneck analysis |

The agent writes once per session, after showing the changes. Risks: work details end up in it (it stays local, never pushed unless they choose); it goes stale (size caps, pruning on each write); writing outside the project may need approval under Claude Code permissions or the Codex sandbox (unverified per mode).

## 6. The ideal list

Ranked by impact for effort (effort includes tokens).

| # | Experience | How it works | Impact | Effort |
| --- | --- | --- | --- | --- |
| 1 | Pick anything | Interview, profile, examples that fit them | High | Low |
| 2 | Done without a check | A watched trigger; a figure of the check-free turn | High | Low |
| 3 | What just happened | A timeline of this thread's turns, edits, commands and checks | High | Low |
| 4 | Memory you feel | AGENTS.md from the session; a fresh thread picks it up | High | Low |
| 5 | Second opinion | `delegate_task` sends the diff to another provider | High | Low (two providers) |
| 6 | Proof every turn | Summary, check output and a screenshot at the end of each turn | High | Low |
| 7 | Talk, don't type | Two minutes of dictation; the same task redone | High | Low |
| 8 | Overview | `t3_thread_*` tools feed a board of thread states and asks | High | Medium |
| 9 | Session retro | Stalls, retries, wrong guesses and waits, into the journal | High | Medium |
| 10 | Bottleneck export | The `runs/` log plus a prompt for a deeper agent | Medium | Low |
| 11 | Plan gate | The next vague task starts with a plan; a "copy changes" button | Medium | Low |
| 12 | Where am I | The site's matching lesson, opened in the side tab | Medium | Low |
| 13 | Cost receipt | T3's Usage page after a fan-out, explained | Medium | Low |
| 14 | Second job, set up | The agent opens a worktree thread for their next idea | Medium | Low |
| 15 | Ambition pass | One bigger version after the first accepted result | Medium | Low |
| 16 | Nested fan-out | A lead, 3 helpers, 2 each, cheap models, 10-minute cap, throwaway task; ends in a who-did-what tree | High (lived) | Medium; many tokens |
| 17 | Window estimate | Turn and token proxies, labelled an estimate | Medium | Medium |
| 18 | Pin-the-note review | A review page whose notes go to a file the agent reads | Medium | Medium |
| 19 | Close the lid | A job on an always-on machine survives the lid | Medium | Medium (second machine) |
| 20 | Break-it sandbox | Staged failures in a throwaway repo | Medium | Medium; feels fake to experts |

Rows 3, 8, 9 and 10 plus the figure helper are the general "use" skills, each usable without the guide: `visualize` (template + JSON → file → `html_render`, no server), `overview`, `what-happened`, `retro`, `export-run`.

## 7. One source, two surfaces

A lesson is a folder, `lessons/<id>/`:

- **`lesson.md`.** Frontmatter: id, triggers, fact ids. Sections: `aside` (per level, second person, under 60 words), `try` (one prompt), `talk` (questions to expect), `deeper` (a link).
- **`figure.html`.** Self-contained. T3 theme variables with the site's tokens as fallbacks. Data from an embedded JSON block or the URL fragment. One file serves inline in T3, full screen in the side tab, and on the site.

The site reads `lesson.md` into each journey step: `aside` becomes its "you will" text, `try` a prompt link. `pnpm build:skill` copies lessons, figures and helpers into the skill, stamping in facts from `site/src/data` with source and date. The skill shows its build date and how to update.

The journey's scroll scenes stay site-only (they need the scene engine); a few could later become single-file figures.

**The hero.** One sentence, two buttons:

> **Learn to work with coding agents.** Read how it works, or learn it while you build something of your own.
>
> [Read the guide] [Start in T3 Code]

Under the second button: what it needs (T3 Code, free; one AI plan, from $20 a month) and three steps: install T3 Code, sign in to a provider, press the button. It's a prompt link, so nothing runs until you press Send.

Then: "T3 Code is made by Theo and T3 Tools. This guide is independent; we learned a lot from Theo's work." Independence is stated, not implied.

**Verify before building:**

- which installed versions have side chats and prompt links
- whether a link in a visual reply can open the side tab
- whether skills load in side chats
- Codex sandbox writes outside the project
- how reliably models count their own tool calls
