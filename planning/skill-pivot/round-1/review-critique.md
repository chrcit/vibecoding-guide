# Round 1 Critical Review — `agentic-guide` Skill & `/start/`

**Scope:** `skills/agentic-guide/` (`SKILL.md`, `mechanisms/*.md`, `moves.md`, `figures/layers.html`, `install.sh`), `site/src/pages/start/index.astro`, `site/src/lib/start.ts`, and the live dev page at `<tailnet preview URL>/start/`. Verified against T3 Code's official user docs (`composer.md`, `prompt-links.md`, `voice-input.md`, `thread-sidebar.md`, `welcome-page.md`) and T3 Code's live MCP tool schemas (`html_render`, `html_preview`, `t3_project_create`, `t3_thread_launch`).

## Verdict

The core pedagogy is sharp — result first, mechanisms named from what just happened, short asides, ad hoc inline pages — and the site's visual layout is clean. **It is not ready for the lab test or shipping.** There is a **false safety claim** on `/start/` about `Full access`, a **broken `html_render` recipe** in `SKILL.md` that omits a required parameter, a **dead-end session architecture** where Steps 7–8 can never run after Step 6 sends the learner to a fresh thread, and an **install path that breaks on first click** (unmerged `main`, no-project prompt link behavior, colliding `practice` fallback, and native Windows failure).

---

## 1. Blocking Issues (Fix Before Testing or Shipping)

### 1.1 False safety claim on `/start/` about `Full access`
- **Where:** `site/src/pages/start/index.astro:83` (rendered live under Step 4 → *What to expect*)
- **What it says:** `"New threads start in Full access mode: the agent runs commands without asking. The practice project keeps that to one folder."`
- **Why it's wrong and dangerous:** `Full access` does **not** confine the agent to the project folder. In Codex (`danger-full-access`) and Claude Code (bypassed permissions), `Full access` lets shell commands and file edits touch anything the OS user can access. Creating a `practice` project only sets the default working directory and gives Git undo history *inside* that folder — as `mechanisms/world.md:25` itself acknowledges (`"T3 Code is not itself a sandbox"`). Telling a non-technical scientist `"keeps that to one folder"` directly misleads them about blast radius.
- **Fix:** State plainly that `practice` is an empty folder with Git undo history so your real files aren't mixed in, *not* a sandbox — and tell them exactly where to flip **Supervised** on (`bottom of the message box` or `Cmd/Ctrl+Shift+A`) if they want the agent to ask before every command.

### 1.2 `SKILL.md` inline HTML recipe omits `html_preview` and the required `height` parameter
- **Where:** `skills/agentic-guide/SKILL.md:53`
- **What it says:** `call the html_render tool with inline html (or path to a file) and a title.`
- **Verified against live T3 Code MCP schemas:**
  - `html_render` has `"required": ["title", "height"]`, where `height` is an integer (`80–2000`) and its description instructs: `"Use the contentHeight from html_preview."` and `"Do not announce or restate the page."`
  - `html_preview` renders the HTML/path off-screen and returns `contentHeight` (plus console/runtime errors) before displaying anything to the user.
- **Impact:** An agent following `SKILL.md` literally will either error on missing `height`, guess a height (causing cut-off pages or huge whitespace), or skip `html_preview` and render broken HTML/JS straight to the learner on Turn 2. Also, `SKILL.md` forbids `vh` units and backgrounds on `html`/`body`, which is right, but omits `height: 100%` on `html`/`body` (also disallowed by `html_preview`/`html_render` because it breaks height measurement).
- **Fix:** Update `SKILL.md` *Inline pages*: call `html_preview` first to check for errors and get `contentHeight`, then call `html_render` with that `height` (and `title`), and don't restate the page in prose.

### 1.3 First session Steps 6–8 break across threads (Steps 7 and 8 will never run)
- **Where:** `skills/agentic-guide/SKILL.md:18–20`
- **What happens in practice:**
  - Step 6 tells the learner to put their real work in a **fresh thread** (`"Do not start the real task in this thread"`).
  - The learner opens Thread 2. Thread 2 does **not** have `$agentic-guide` active, so the agent in Thread 2 has never read `SKILL.md`.
  - Therefore **Step 7** (`"After a result in their field: 'How would you check this?'"`) and **Step 8** (`"Hand over. Prove AGENTS.md works... Offer the global install move."`) **never execute**.
  - Even if the learner manually invokes `$agentic-guide` in Thread 2, Setup rule 2 (`SKILL.md:10`) says: *"If `AGENTS.md` in this folder has a `## How I want to learn` section, follow it, skip the opening question and ask what they want to work on today"* — so Thread 2 has no idea it is supposed to finish Steps 7–8, and Step 6's rule forbids doing the real task in the guide thread anyway.
  - Compounding this, Step 8 says `"Tell them they can call the guide any time with $agentic-guide... Last line: ... make a new project folder, and get started on something real."` — but `$agentic-guide` is installed **only in `practice`** unless they ran the global install move! Calling `$agentic-guide` in a new project folder will fail with no skill found.
- **Fix:** Either (a) keep Step 7 (*Checking is theirs*) in Thread 1 on the Step 5 raised-bar result (or invented-shape data), then make Step 6/8 the explicit handover *before* they leave Thread 1, OR (b) have Step 6 hand them a starter message for Thread 2 that includes `$agentic-guide` and names what comes next, and clearly tie `"call the guide in any project"` to running the global install.

### 1.4 `/start/` Step 3 install flow has five concrete failure modes
- **Where:** `site/src/pages/start/index.astro:45–63`, `site/src/lib/start.ts:135–160`
- **Failure 1 — Broken right now (`branch: 'main'`):** `skillUrl` (`.../tree/main/skills/agentic-guide`) is a 404 until merged to `main`, and `git clone --branch main` will not contain `skills/agentic-guide/install.sh`. (Known in `build-report.md`, still a hard blocker before any user or lab test touches `/start/`.)
- **Failure 2 — Prompt link with no `repo` *always* opens without a project:** `start/index.astro:48` says `"If the draft is not in your practice project, pick the project at the top of the draft."` Per T3 Code's `docs/user/prompt-links.md`, a link with no `repo` parameter **always** opens without a project (scratch thread). Saying *"If"* misleads the learner into thinking it will usually land in `practice` on its own.
- **Failure 3 — Scratch-folder fallback collides with Step 3.1 and leaves the thread in scratch:**
  - Step 3.1 told the learner to create a project called `practice`.
  - If the learner clicks `Install the skill` and presses Send without picking `practice` at the top, `installPrompt` step 1 tells the agent: *"If it is a scratch folder, create a T3 Code project called 'practice' if you have a tool for that, and install there."*
  - Per `t3_project_create`'s schema, a registered folder is rejected (collision with the `practice` project they just made!). And even if `practice` didn't exist yet and `t3_project_create` succeeded, the running thread's cwd is *still* `~/.t3/scratch/...` — under a workspace-scoped sandbox, installing into `~/.t3/projects/practice` fails, and step 6's `"start a new thread in this project"` refers to the scratch thread, not `practice`.
- **Failure 4 — "Reading before installing" does not actually happen before install:**
  - `start/index.astro:49` implies the agent tells the user what the skill does before copying it (`"asks the agent to read the skill, tell you in two sentences what it does, and copy it into this project only"`).
  - In `installPrompt`, steps 2–5 run in **one turn** under `Full access`. The agent executes `bash .../install.sh` in step 4 *before* the user ever sees the two-sentence summary in the agent's reply. Either make it a real two-turn gate ("Stop and ask my OK before running `install.sh`") or stop implying the user reviews the summary before installation.
- **Failure 5 — Native Windows fails completely:**
  - `start/index.astro:45` explicitly addresses Windows users (`Ctrl+K on Windows and Linux`), and T3 Code ships a Windows desktop app.
  - Yet both `installPrompt` (`bash <temporary folder>/.../install.sh`) and `installTerminal` (`d="$(mktemp -d)" && ... && bash ...`) require POSIX `bash` and `mktemp`, which fail on stock Windows PowerShell / cmd without WSL or Git Bash. Neither `/start/` nor `install.sh` mentions macOS/Linux or offers a Windows path.

---

## 2. `skills/agentic-guide/` — Behavioral Ambiguities & Intent Drift

### 2.1 Turn-pacing contradiction in `The first session`
- **Where:** `skills/agentic-guide/SKILL.md:13–17`
- **Problem:** Line 13 says `Each step waits for the learner.` Then:
  - Step 2: `Do it. The result arrives on your next reply, inline...`
  - Step 3: `Name what happened, using this turn... Offer figures/layers.html once, filled with this turn.`
  - Step 4: `"What don't you like about it?"`
- **How agents will misread this:**
  - Interpretation A (strictly obeys "Each step waits"): On Turn 2, the agent renders the result and stops dead with zero explanation or prompt — leaving the learner staring at a page wondering what to type next (and contradicting `/start/index.astro:77`: *"The result comes on its next reply. Then it explains what just happened..."*).
  - Interpretation B (merges Steps 2, 3, and 4 into Turn 2): The agent renders **two** inline pages in one turn (the learner's result + `figures/layers.html`), violating `Asides`'s `"at most one page"` rule, AND stacks the level announcement, the loop explanation, the layers figure, and Step 4's question into one bloated reply.
- **Fix:** Explicitly mark **Turn 1**, **Turn 2**, **Turn 3** (or state clearly which steps belong to the same reply vs. wait for a reply). Do **not** offer/render `figures/layers.html` in the same turn as the first result page — offer it as a follow-up ("Want a picture of those layers from what just happened?") or on the next turn.

### 2.2 Show-don't-tell capability ("wow effect") is diluted in Step 2
- **Where:** `skills/agentic-guide/SKILL.md:14`
- **Problem:** Step 2 ends with `"Invite more than they asked for."`
- **Why this misses `BRIEF-2.md` / `mindset.md`:** In `mindset.md`, the magic happened because the agent *did* more than the beginner knew to ask for (showing capability immediately instead of praising them or telling them what's possible). `"Invite more than they asked for"` reads like telling the agent to *ask* the user to request more, which is passive and invites chatter.
- **Fix:** Replace with an explicit execution rule: *Go one useful step past the bare ask (e.g., an interactive filter, checklist, or visual layout they didn't think to request) without bloating it or asking permission first — let the first reply show what one plain sentence can produce.*

### 2.3 Step 4's `AGENTS.md` / "bend the lesson" moment won't trigger reliably
- **Where:** `skills/agentic-guide/SKILL.md:16`
- **Problem:** Step 4 asks `"What don't you like about it?"` and then says `"When they say how they want to be spoken to (shorter, German, more pictures), apply it on the very next reply. Then show the exact paragraph you'd add to AGENTS.md..."`
- **How it fails:** If the learner just got a balcony watering schedule, `"What don't you like about it?"` produces **content** feedback ("I don't have ferns", "make it weekly"), NOT communication-style feedback. So the `AGENTS.md` lesson and the `"bend the lesson"` insight from `BRIEF-2.md` may never trigger at all!
- **Fix:** Ask two halves in one breath: `"What don't you like about this — or about how I explained it? (Shorter, different language, bigger text, table instead of cards — anything.)"` And if they only change content on Turn 3, explicitly prompt one style/rule preference before Step 5 so `AGENTS.md` is actually experienced, not skipped.

### 2.4 Level inference timing and `plain`-level leaks
- **Where:** `SKILL.md:24–30`, `mechanisms/loop.md:15`, `mechanisms/world.md:21`, `figures/layers.html:41–57`
- **Issues:**
  1. **When to announce the level:** `SKILL.md:24` says *"Infer it from how they write; never ask them to rate themselves. Say the level you picked in one line..."* On Turn 1 the learner only typed `$agentic-guide` — there is no prose to infer from yet. `SKILL.md` should explicitly say: *infer and state it on Turn 2, after their first real message* (not Turn 1).
  2. **Hardcoded provider/harness in `plain` scripts:**
     - `mechanisms/loop.md:15` (**plain**): `"The program around it, here Codex, lets it act..."` — violates `SKILL.md:28` (`plain: model, agent and thread named, nothing else`, harness isn't named until `some`) AND hardcodes `Codex` when the learner may be on Claude Code!
     - `mechanisms/world.md:21` (**plain**): `"Your words go to OpenAI; the files stay on this computer unless I read them to answer you."` — hardcodes `OpenAI`! An agent running Claude Code could literally tell a learner their words went to OpenAI.
  3. **`figures/layers.html` leaks `some`-level concepts, contradicts `loop.md`'s layer count, and invites workspace clutter:**
     - `mechanisms/loop.md:5` says `"Four layers: model, harness, tools, world. figures/layers.html draws them."` Yet `figures/layers.html` draws **six** layers (`You`, `T3 Code`, `Harness`, `Model`, `Tools`, `World`).
     - Its `Harness` row displays `Codex, 6 rounds` and `Tools` displays `5 tool calls`, conflicting with `plain` vocabulary rules (`model, agent and thread named, nothing else`).
     - `mechanisms/loop.md:23` and `SKILL.md:55` say `"Copy figures/layers.html..."` — agents will take `"Copy"` literally and drop a stray `layers.html` file into the learner's practice project (violating `"Keep files out of view"` and `"Write a file only if they ask"`). Change to: *read `figures/layers.html` as a template and pass the filled HTML inline to `html_preview` / `html_render` without writing a file.*
     - `figures/layers.html:24` hardcodes `.now::before { content: "this turn: "; }` in CSS. The comment on line 4 tells the agent to translate every visible string, which agents reliably miss inside CSS `content:` rules. Put `"this turn:"` in HTML text instead.

### 2.5 Missing/wrong internal references and unactionable instructions in `SKILL.md`
- **Broken section pointer (`SKILL.md:19`):** Step 7 says `Turn the answer into their own try-N-times sentence (moves.md, Check it)`. In `moves.md`, those sentences are under `## Try it N times` (`moves.md:15`), not `## Check it` (`moves.md:7`).
- **Supervised mode offer is unactionable (`SKILL.md:28`):** `plain` says `Offer Supervised mode once (the agent asks before commands and edits); don't push it.` Neither `SKILL.md` nor `mechanisms/loop.md` tells the agent **how** the user turns Supervised mode on (bottom of the composer, or `Cmd/Ctrl+Shift+A`). The agent cannot flip its own thread's permission mode — so if the learner says "yes please", the agent has to guess the UI!
- **Ambiguous `"at most one page"` (`SKILL.md:39`):** `"at most 60 words (90 at deep), at most one page"` reads awkwardly next to a word count — say `"at most one inline page (via html_render)"` so agents don't confuse it with prose length.
- **Ambiguous `"near-empty practice project"` (`SKILL.md:10`):** Setup item 4 tells the agent to warn if the folder holds real work rather than a near-empty practice project. A newly created `practice` project with the skill installed already contains `README.md`, `.git/`, `.claude/`, and `.agents/`. State explicitly that those four are expected in a clean practice folder so the agent doesn't falsely nag the learner on Turn 1.

---

## 3. Factual & Product-Claim Audit (T3 Code, Claude Code, Codex)

| Claim & location | Verdict | Primary-source check |
|---|---|---|
| `The practice project keeps [Full access] to one folder.` (`start/index.astro:83`) | **False** | `Full access` runs without approval prompts as the host OS user (`harnesses.ts`, `world.md:25`). A project folder is a cwd + Git repo, not a sandbox. |
| `call the html_render tool with inline html (or path to a file) and a title.` (`SKILL.md:53`) | **Incomplete / breaks calls** | Live MCP schema requires `height` (integer `80–2000`) and specifies running `html_preview` first to obtain `contentHeight`. |
| `If the draft is not in your practice project, pick the project at the top of the draft.` (`start/index.astro:48`) | **Misleading** | `docs/user/prompt-links.md`: *"No `repo`: the draft opens without a project, on the machine you used last."* It is *never* in `practice` automatically. |
| `"Your words go to OpenAI"` / `"here Codex"` (`world.md:21`, `loop.md:15`) | **Wrong for Claude Code users** | Hardcoded provider/harness in `plain` scripts; should substitute the active provider/harness. |
| `Claude Code reads CLAUDE.md; a CLAUDE.md containing the line @AGENTS.md imports it` (`text.md:19`) | **Slightly stale** | Current Claude Code also reads `AGENTS.md` directly when no `CLAUDE.md` exists (`site/src/data/harnesses.ts:40`), though `@AGENTS.md` in `CLAUDE.md` remains safe if a `CLAUDE.md` exists. |
| `Get ChatGPT` button → `https://learn.chatgpt.com/docs/pricing` (`start/index.astro:31`, `links.ts:28`) | **Wrong destination for non-technical users** | That URL is OpenAI's technical Codex developer docs pricing reference, not the consumer ChatGPT Plus sign-up page. |
| `Cmd/Ctrl+K searches titles and messages` (`window.md:35`, `world.md:5`) | **Verified accurate** | Matches `docs/user/thread-sidebar.md` (message matches appear under **In messages** for words ≥3 chars). |
| `@` a thread, drag from sidebar, **Copy thread**, on-demand read (`window.md:26`, `moves.md:32`) | **Verified accurate** | Matches `docs/user/composer.md` (minor note: on desktop when a thread has a PR, the context menu item is **Copy → Thread**). |
| `Edit from here` rewinds conversation; files only in worktrees (`moves.md:48`, `world.md:23`) | **Verified accurate** | Matches `docs/user/composer.md`. |
| Voice needs one-time choice in **Settings → Voice** (`moves.md:55`) | **Verified accurate** | Matches `docs/user/voice-input.md` (on web/desktop; mobile defaults to on-device). |
| `$` adds a skill; **Restart agent session** reloads added skills (`start/index.astro:73`, `install.sh:89`) | **Verified accurate** | Matches `docs/user/composer.md`. |

---

## 4. Security & Robustness Audit of `install.sh` (and Install Commands)

1. **Unconditional symlink deletion (`install.sh:54–59`):**
   - For regular directories (`install.sh:64–70`), the script properly checks `grep -q "^name: $NAME$" "$dest/SKILL.md"` before `rm -rf "$dest"`, refusing to touch anything that isn't an earlier `agentic-guide` install.
   - For symlinks (`install.sh:54–59`), it **skips that check** and runs `rm "$dest"` unconditionally on *any* symlink named `agentic-guide` in `.claude/skills/` or `.agents/skills/`. If a user has a symlink to a different skill of the same name, `install.sh` silently unlinks it.
   - **Fix:** Check `grep -q "^name: $NAME$" "$dest/SKILL.md"` (or verify target) before unlinking, and skip with the same error message if it isn't `agentic-guide`.
2. **Unpinned remote code execution under `Full access` (`start.ts:137, 150, 160`):**
   - Both `installPrompt` and `installTerminal` clone floating `--branch main` over HTTPS and execute `bash .../install.sh` directly — in T3's default `Full access` mode, with no tag/commit pin and no pause for user approval after reading `SKILL.md`. Any compromised push to `main` becomes instant arbitrary code execution on every new learner's machine.
   - **Fix:** Pin to a release tag (e.g., `v0.1.0`) or commit SHA once published, and either pause for user confirmation before running `install.sh` or avoid running a remote shell script in `installPrompt` altogether (the agent can just verify `SKILL.md` and copy the skill files itself, or inspect `install.sh` before running it).
3. **`installTerminal` leaks `/tmp` directory (`start.ts:160`):**
   - `d="$(mktemp -d)" && git clone ... "$d/guide" && bash "$d/guide/.../install.sh"` never deletes `$d`. Every run leaves a cloned git repository behind in `/tmp`.
   - **Fix:** Add `; rm -rf "$d"` (or `trap 'rm -rf "$d"' EXIT` in a subshell). Note that `start/index.astro:61` tells users *"Add `--global` at the end"* — if you append cleanup after `install.sh`, appending `--global` at the end would break! Either offer a separate `--global` one-liner or put the cleanup in a trap before the `bash` command.
4. **Over-broad copy (`install.sh:77`):**
   - `cp -R "$SRC"/. "$dest"/` copies *everything* in `$SRC`, including any `.DS_Store`, editor swap files, or accidental stray files.
   - **Fix:** Copy an explicit allowlist (`SKILL.md`, `moves.md`, `install.sh`, `mechanisms`, `figures`).
5. **Minor script traps:**
   - `--dir /some/path --global` silently ignores `--dir` instead of warning or erroring.
   - Running `install.sh --global --link` from inside the disposable `practice/.claude/skills/agentic-guide` creates global symlinks pointing into `practice/` — deleting `practice` later breaks the global install. Warn or disallow `--global --link` when `$SRC` is inside `.claude/skills` or `.agents/skills`.
   - `grep -q "^name: $NAME$"` (`install.sh:35, 65`) matches anywhere in the file (not just YAML frontmatter) and breaks on CRLF (`\r\n`) line endings.
   - No Windows support (see §1.4 Failure 5).

---

## 5. `/start/` Page Audit — Is It Dead Simple for a Non-Technical Scientist?

Walked through the live rendered page (`<tailnet preview URL>/start/`) step by step against two questions: *Will a non-technical scientist get stuck?* and *Does each step tell them what they'll see?*

### Step 1 · Get Claude or ChatGPT (`start/index.astro:27–34`)
- **Gap 1 — Wrong link for ChatGPT:** Clicking **Get ChatGPT** lands on `learn.chatgpt.com/docs/pricing` (a developer documentation table for Codex), not ChatGPT's consumer subscription page. A scientist looking for ChatGPT Plus will think they clicked the wrong link.
- **Gap 2 — Doesn't say what NOT to buy/install:** Both Claude and OpenAI have consumer plans *and* developer API billing *and* standalone CLI downloads. One reassuring sentence would prevent costly wrong turns: *"Just sign up for the $20/month consumer plan (you don't need API credits or to install anything from their website)."*

### Step 2 · Get T3 Code (`start/index.astro:36–42`)
- **Gap 1 — Missing what happens during download & Welcome setup:**
  - Doesn't tell them which installer to pick on the download page (e.g., Apple Silicon vs Intel Mac, Windows).
  - **Big surprise for Claude Code users:** Per `docs/user/welcome-page.md`, clicking **Install** or **Sign in** for Claude Code *"opens a terminal with the correct command ready to run"*. A non-technical scientist who suddenly sees a black terminal window pop open with shell commands will panic or close it. Warn them in half a sentence!
  - Doesn't mention clicking **Start** at the bottom of the Welcome page once the agent shows ready (nor that they can skip the phone QR code and folder import boxes on the Welcome page for now).

### Step 3 · Install the guide skill (`start/index.astro:44–63`)
- **Gap 1 — Developer jargon:**
  - `~/.t3/projects` means nothing to a non-technical scientist. Just say *"in T3 Code's projects folder"* (drop the tilde path from the main instruction).
  - Step 3 says `press Cmd+K (Ctrl+K on Windows and Linux)` without ever calling it the **Command palette** — then Step 4 suddenly says `Command palette, Restart agent session` as if they already know what that is. Name it in Step 3 (`press Cmd+K … to open the command palette`).
- **Gap 2 — Misleading "If" and missing visual expectations:**
  - As noted in §1.4, `Install the skill` **always** opens a no-project draft, and on first click `app.t3.codes` **always** asks where to open it (plus the browser's own `"Open T3 Code?"` dialog). Tell them what they *will* see: *"Your browser will ask to open T3 Code; pick the app on your computer. A draft message will open without a project — pick `practice` at the top of the draft, then press **Send**."*
  - Doesn't say what happens **after pressing Send**: they'll see the agent run a couple of steps for ~10–20 seconds and reply with two sentences explaining the skill, a short checklist, and a final line saying it's ready. Without that, a non-technical user watching tool-call blocks scroll past doesn't know if it worked or broke.

### Step 4 · Start the guide (`start/index.astro:65–86`)
- **Gap 1 — Missing how to start a new thread:** Says `"In your practice project, start a new thread"` without saying where (**New thread** in the left sidebar, or the pen icon on `practice`).
- **Gap 2 — `$` autocomplete trap:** Says `"type $agentic-guide in the message box and press Enter."` In T3 Code's composer, typing `$` opens a skill dropdown menu — pressing `Enter` once selects the skill from the menu rather than sending the message! Say: *"type `$agentic-guide`, pick it from the list, and press Enter to send."*
- **Gap 3 — False safety reassurance:** Remove `"The practice project keeps that to one folder."` (see §1.1) and tell them where **Supervised** mode lives if they want to switch right away.

---

## 6. Prioritized Fix List for Round 2

1. **Fix the false `Full access` safety claim** on `/start/` (`start/index.astro:83`) and add the UI location for **Supervised** mode both on `/start/` and in `SKILL.md:28` (`plain`).
2. **Fix the `html_render` recipe** in `SKILL.md:53` to require `html_preview` first and pass its `contentHeight` as `height` to `html_render`, plus forbid `height: 100%` on `html`/`body`.
3. **Fix the Steps 6–8 cross-thread dead end** in `SKILL.md:18–20` (and tie global `$agentic-guide` availability to running the global install).
4. **Fix turn-pacing and Step 2/4 triggers** in `SKILL.md:13–17`: clarify which steps share a reply vs wait, don't render two pages in one turn, turn `"Invite more than they asked for"` into an explicit show-don't-tell execution rule, and prompt a style/preference tweak in Step 4 so `AGENTS.md` reliably fires.
5. **Remove hardcoded `Codex` / `OpenAI` from `plain` scripts** (`mechanisms/loop.md:15`, `mechanisms/world.md:21`), fix `figures/layers.html` (4 vs 6 layers, CSS `"this turn: "` string, read inline instead of `"Copy"`), and fix `SKILL.md:19`'s `moves.md` section name (`Try it N times`).
6. **Fix the Step 3 install flow & `install.sh`:**
   - Pin to a real branch/tag before testing; decide how to handle Windows (or state macOS/Linux clearly).
   - Fix `start/index.astro:48` ("always opens without a project — pick `practice` at the top") and fix `installPrompt` step 1 so it checks for an existing `practice` project instead of colliding with `t3_project_create`, and doesn't claim reading-before-installing unless it actually pauses for confirmation.
   - Harden `install.sh`: verify `SKILL.md` before `rm "$dest"` on symlinks, allowlist copied files, guard `--global --link` from inside an installed copy, and clean up `$d` in `installTerminal`.
7. **Polish `/start/` for a non-technical scientist:** fix the `Get ChatGPT` link, warn Claude Code users about the Welcome-page terminal and clicking **Start**, drop `~/.t3/projects`, name the Command palette in Step 3, describe what the install reply looks like, and clarify `$` selection + Enter to send.
