# Plan 2: one skill, `agentic-guide`

2026-11-21. Overrides [PLAN.md](./PLAN.md). Labels: [f id] fact in `site/src/data`; [doc] T3 Code docs; [obs] tool schema seen here, re-check on 0.1.9; [unv] check in the lab.

## 1. Deliverables and layout

```
skills/agentic-guide/              # nested: the skills/*.md site glob skips it
├── SKILL.md                       # §2, ≤ 2,500 tokens
├── modules/                       # one mechanism each, ≤ 900 tokens
│   model · harness · tools · world · context · verification
│   never-wait · parallel · orchestration · artifacts · cost   (.md)
├── figures/                       # self-contained HTML
│   layers · turn · world · context · threads · card   (.html)
├── scripts/fill.mjs               # figure + JSON → $TMPDIR/agentic-guide/
├── facts.md                       # generated: statement, date, status, source
└── install.sh                     # user or --project, both agents

site/scripts/build-skill-facts.mjs # writes facts.md from cited ids
site/scripts/check-skill.mjs       # lint (§6), part of `pnpm judge`
site/src/pages/start/index.astro   # new getting-started page (§5)
site/src/pages/start/first-hour.astro  # today's page, moved
site/src/lib/start.ts              # + installPrompt, promptLink()
site/src/data/links.ts             # + chatgpt, skillRepo (placeholder, flagged)
README.md, CLAUDE.md               # updated
```

**Figures.**
- **Content:** `layers` (you → T3 Code → harness → model → tools → world), `turn` (one learner turn, steps counted), `world` (their threads, files, side effects), `context` (this window vs a fresh thread), `threads` (from `t3_thread_list`), `card` (short note).
- **Theme:** only the variables `html_render` documents (`--foreground`, `--muted`, `--card`, `--border`, `--primary`, `--chart-1…6`, `--radius`, `--font-sans`…) [obs], with fallbacks; no page background, no `vh`.
- **Data:** a JSON `<script>` block. Static figures render by path at no output-token cost [obs]; without `node`, inline `html`.
- **Adapting** ("bigger / German / darker / as a table"): edit the filled copy, render again. T3 applies the learner's theme; its expand button is v1's full screen [doc html-renders].

**Install.**
- **Main route:** a T3 prompt link (`app.t3.codes/new?prompt=…`), which only drafts [doc prompt-links]. The prompt: fetch the repo, read `SKILL.md` and say in two lines what it does, install to `~/.claude/skills/` and `~/.agents/skills/` [f harnesses.*.skills], touch nothing else, say what to click next. Reading before installing is the first lesson, unannounced.
- **Terminal:** `npx skills add <owner>/<repo>` [f skills.installer; per-folder, both-agent targeting unv]; fallback `git clone` + `install.sh`. `<owner>/<repo>` is a placeholder.

## 2. SKILL.md contract

**Frontmatter:** `name` and a `description` ≤ 300 characters ("Interactive guide to working with coding agents in T3 Code. Use when the user starts the guide or asks how agents, threads, tools or context work."). No Claude-only syntax.

**Setup** (first turn; it speaks only if something is wrong):
1. **Surface.**
   - **T3 mode:** a tool whose name contains `html_render` exists. Deferred tools are searched for once; how Codex names the tool is [unv].
   - **Terminal mode:** figures become files with their path printed; T3-only moves (`@` a thread, drag, Cmd+K search) are skipped with one line.
2. **AGENTS.md.** Its `## How I want to learn` section holds level and preferences. Claude Code reads AGENTS.md only without a CLAUDE.md [f harnesses.claudeCode.contextFile]; if one exists, offer to add `@AGENTS.md`.
3. **Earlier sessions.**
   - In T3, `t3_thread_search "Guide ·"` finds earlier asides by label: the threads are the record, no progress file [assistant-text search unv]. Elsewhere, ask.
4. **Permission mode:** one line on what the thread's mode allows [f t3code.defaultMode, t3code.modeMeaning]; changing it is the learner's click.

**Level.**
- Asked in the first message: *I don't write code* · *I've done some technical work* · *I build software*.
- Checked against how they talk, saved to AGENTS.md with consent, moved by "simpler" or "more detail". It changes depth, never the work.

**What to explain next.**
- **A table** in SKILL.md: module, prerequisites, cue, depth per level. Cues are counted in the turn just finished, never self-judged: 3+ tool calls; first file created; edits then "done" with no command, test or preview; a message sent mid-run; an unrelated second request; 3+ live threads; a "what/where/why".
- **The choice:** at most one module per turn: cue fired, prerequisites met, not yet shown in this thread. A direct question beats the table.

**Staying short.**
- **Format:** the work reply first. Then the label `Guide · <Module>`, ≤ 60 words (90 at the highest level), at most one figure, and one *Try:* sentence.
- **Never** mid-turn, twice in a row, or while the learner is in flow.
- **Controls:** *quiet* (asides only on request), *more* (next depth), *skip* / *I know this* (marked seen), *that's not what I see* (re-check first).
- **Long answers:** via `/side` [f t3code.sideChat; skills there unv].

**Never:**
- Praise, say "easy", or tell the learner they're capable.
- Stage failures in real work.
- State a product fact, number or price not in `facts.md`, or a count not taken from the turn.
- At the lowest level in session one: open file viewers, side panels, terminals or dev servers (results go inline; a file gets one line saying where it is), or name more than T3 Code and their provider.
- Write outside the project except `$TMPDIR/agentic-guide/` and the install dirs.
- Commit, push, publish, start threads or message other threads unasked.
- Read other projects' threads unasked.
- Put work data or others' details into AGENTS.md or a figure unshown, or use CDNs.

## 3. Modules

Each file: the mechanism at three depths (`## plain`, `## some`, `## deep`), cue, figure, *Try* line, expected questions.

| Module | Mechanism | Lands when | Figure | Just a sentence |
| --- | --- | --- | --- | --- |
| **model** | Text in, text out; no memory beyond the window; can be confidently wrong | It assumed something about their work; "how does it know?" | `layers` | "Which parts of that did you guess?" |
| **harness** | Codex or Claude Code loops: window to model, run what it asks, feed results back. T3 Code is a window over many | First turn with 3+ tool calls | `turn`, their counts | "Show me what you ran and what you saw each time." |
| **tools** | An action described in text; the model writes a call, the harness runs it. That picture came through one | First inline figure | none | "What tools do you have? Draw them, grouped by what they touch." |
| **world** | Threads are stored text you can search and reference [doc thread-sidebar]; files sit in the project folder; side effects are commands, installs, anything sent out. Prompts go to the provider, not T3 [f t3code.codeNotToT3] | First file; "where is it?"; first real data | `world`, their items | "What did you change on my computer today?" |
| **context** | The window: this thread plus context files. AGENTS.md is read first in every new thread; a skill (this guide too) is a text file. One job, one thread | The tailoring step; later, leaked context or drift | `context`, `card` | "Write in AGENTS.md that…" |
| **verification** | It says done either way. Checking is yours; it can build the checks: proof, five tries first | "done" with no run; a flaw they find | `turn`, empty check | "Before you come back, try it five times and show me the proof." |
| **never-wait** | Queue or steer while it works [f t3code.queueSteer]; talk instead of typing [f t3code.voice.shortcut] | Watching a run; typing mid-run | none | Send the next thought now. |
| **parallel** | A second thread is a second agent with its own window; worktrees for the technical levels [f t3code.worktrees] | An unrelated idea mid-run | none | "Start a thread that does X while this one runs." |
| **orchestration** (needs context, world, verification, parallel) | `@`, drag or **Copy thread** a thread into a message: the agent reads it on demand, messages it only if asked [doc composer]. `delegate_task` reaches other providers [f t3code.delegate]. Lead, workers, second opinion | 3+ live threads; "what's going on?" | `threads` | "@A @B: compare what they found and stop the slower one." |
| **artifacts** | Any view of your work is a sentence away and worth the tokens. A repeated flow can become a skill or stay two freeform sentences | Lost, overwhelmed, or a long run to read | what they ask for | "Make me a page of what you did today and where to look first." |
| **cost** (deep, or asked) | Tokens, effort, plans, Limited; Usage is an estimate [f t3code.usagePage] | First Limited thread | none | "What did this cost, and where did it go?" |

## 4. First session (lowest level, T3, Codex)

The learner made a project and pressed Enter on `$agentic-guide`.

> **Agent:** I'm the guide, and the agent doing your work today. Press the mic (⌘⇧D) and talk: (1) *I don't write code* / *some technical work* / *I build software*? (2) Something small and personal you'd like done this month. (3) Something hard from your work.
>
> **Learner** (dictated): No code. An allotment plan for the year. At work I copy numbers from supplier spreadsheets into a report every week.
>
> **Agent:** *[layers]* You talk, a model writes, Codex lets it act on this folder, T3 Code keeps the conversations. First, make me yours: every new conversation here reads one instruction file first. How should I explain things? Language, length, pictures, tone.
>
> **Learner:** Short. German. More pictures. Explain English jargon.
>
> **Agent** *(edits AGENTS.md, renders `card` "Your instruction file now says…")*: Ab jetzt so. **Guide · Kontext:** Ein Satz, und jede neue Unterhaltung hier liest ihn zuerst. Am Ende siehst du es in einem frischen Thread.
>
> *(It drafts the allotment prompt with them: who they are, what they know, "do more than I ask". The plan renders inline.)*
>
> **Guide · Hände** *(turn: 1 message → 7 steps)*: Ein Satz von dir, sieben Schritte von mir. **Versuch:** „Was gefällt dir nicht?"
>
> *(Two rounds of critique, then once: "what would impress your neighbours?")*
>
> **Learner:** Now the spreadsheets.
>
> **Guide · Wo deine Arbeit liegt** *(world)*: First, made-up spreadsheets with your columns. Your words go to OpenAI; files stay here. Check your employer's rules before real data.
>
> *(The handover: they describe the real report, and the extraction gets built on the made-up data.)*
>
> **Guide · Prüfen:** I'd say "done" either way. How would you check this at work? **Versuch:** „Probier es an fünf Dateien und zeig mir, wo es schiefgeht." *(Their rule goes into AGENTS.md.)*
>
> **Agent:** Ask for the guide whenever you want: `$agentic-guide`, or "Guide: what's happening?" Now tell me to start a fresh thread for your next job, or make a new project folder. *(It does so on request; the new thread answers in short German.)*

**Some technical:** names Codex and Claude Code as harnesses, shows the AGENTS.md diff, gives paths and the permission mode in `world`, offers a worktree in `parallel`; tailoring may edit the project copy of SKILL.md.

**Highly technical:** no interview if a goal is stated; `harness` covers the loop, tool schemas, context assembly and which context file wins; an invitation to read and change SKILL.md; `cost`, a cross-provider second opinion and `orchestration` can come in session one.

## 5. Getting-started page (`/start/`)

One column, four steps. No level switch. The club list moves to `/start/first-hour/` ("do it by hand"). Facts go through `<Fact>`, with `<Verified>` in the footer.

1. **Get an AI plan:** buttons to Claude (`links.claudePricing`) and ChatGPT (new `links.chatgpt`). "Codex comes with every ChatGPT plan, including Free" [f plans.chatgpt.limits.codexOnEveryPlan]; Claude Pro is [f plans.claude.pro.price] a month.
2. **Get T3 Code:** button to `links.t3codeDownload`, free [f t3code.price]. "On its Welcome page, connect the agent for your plan" [f t3code.welcome, t3code.codexWithChatGPT].
3. **Install the skill:**
   - The **Install the skill** button: a prompt link carrying `installPrompt`.
   - Under it: "Opens T3 Code with a message ready. Nothing runs until you press Send."
   - Folded away: "Copy the message", and the terminal line.
4. **Start:**
   - "It's installed. Here's what it looks like": a schematic screen built from the verified strings [f t3code.screen.*].
   - The clicks: `Cmd/Ctrl+K` → **New project** → name it [f t3code.shortcuts.palette, t3code.newProject] → type `$agentic-guide` → Enter [f t3code.skillsInComposer].
   - "Nothing happened? Command palette → **Restart agent session**."

Credit: "T3 Code is made by Theo and T3 Tools. This guide is independent; we learned a lot from Theo's work." Home links to `/start/`.

## 6. Production ready

- **Accuracy:** `check-skill.mjs` fails on extra frontmatter, a description over 300 characters, unknown fact ids, prices or limits outside fact references, external URLs in figures, Claude-only syntax, modules over 900 tokens or SKILL.md over 2,500. `facts.md` is rebuilt in `pnpm build`. Every [unv] is resolved or marked where the learner sees it.
- **Privacy:** CI greps for details from the 18 November session; figures make no network calls; writes stay in the project, `$TMPDIR/agentic-guide/` and install dirs; AGENTS.md changes shown first; synthetic data offered before real data.
- **Accessibility:** figures pass `html_preview` light/dark at 728 and 390 px, no console errors; AA contrast; semantic HTML, `aria-label`, text summary; reduced motion; keyboard.
- **Both agents:** `$agentic-guide` and description matching work in Codex and Claude Code; plain CLIs run without errors, figures as files.
- **Tokens:** session one vs a control run without the skill (Codex `token_count` events): overhead ≤ 25%, ≤ 4 modules read, asides ≤ 120 output tokens on average.
- **Build:** `cd site && pnpm judge` with the default base and `BASE_PATH=/agentic-coding-guide/`; `check-facts.mjs --write` leaves no diff; `pnpm check-skill` passes.

**Test plan (lab T3 Code, server 0.1.9).**
1. **Install:** `install.sh --project` into `~/Developer/agentic-coding-lab`; the lab runs with its own `HOME` so the owner's skills don't leak in.
2. **Lab checks:** T3 tool names under Codex; `t3_thread_search` on assistant text; `$TMPDIR` writes in the Codex sandbox; skills in `/side`; `npx skills add` targeting; the prompt link on 0.1.9.
3. **Simulated learners on Codex:** a persona agent plays the learner via the lab's MCP endpoint [f t3code.mcp]; artifacts in `~/.local/state/agent-artifacts/vibecoding-guide/<session>/`.
   Scenarios: S1–S3 first session per level (S3 on Claude, once); S4 return session; S5 figure adaptation; S6 *quiet* holds five turns; S7 three threads then `@` orchestration; S8 plain Codex CLI and Claude Code; S9 install prompt from a clean `HOME`.
4. **Scoring:** "never" list held; ≤ 1 aside per turn; facts traceable; own task under way by turn 6; ends in a fresh thread; tokens vs control. Findings carry severity, area and a reproduction ([LOOP.md](./LOOP.md)).
5. **One real person** before v1.

## 7. Out of scope for v1

- "Use" skills, `~/agent-notebook/`, progress files, dashboards as features (artifacts are asked for, not shipped).
- Hooks, MCP apps, local servers, side-tab buttons in figures, plugin marketplace packaging.
- Modules on the site, the journey in second person, a hero redesign.
- The planted-trap repo, the twenty-agent fan-out, shipped translations, mobile, scheduled tasks, devices, remote machines.

**Owner decisions:** the repo URL; whether the level goes into AGENTS.md by default; whether step 4 tells the lowest level to switch from Full access (T3's default) to Supervised.
