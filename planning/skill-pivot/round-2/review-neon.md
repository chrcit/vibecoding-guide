# Round 2 Review — v2 Verification (Neon)

v2 fixes most round-1 blockers and matches T3 Code v0.1.9 docs (`permission-modes`, `composer`, `html-renders`) and live `html_preview`/`html_render` schemas with no wrong T3 claims found. One high-severity turn-flow regression in `SKILL.md` and the unmerged `main` branch remain.

## Round-1 Findings Status

- **1.1 False `Full access` safety claim:** **verified-fixed** (`site/src/pages/start/index.astro:96`, `skills/agentic-guide/SKILL.md:19`, `mechanisms/world.md:19`, `site/src/data/t3code.ts:53-58`).
- **1.2 `html_render` missing `html_preview`, `height`, `height: 100%`:** **verified-fixed** (`SKILL.md:57`, `moves.md:51-62`).
- **1.3 Steps 6–8 break across threads:** **verified-fixed** (`SKILL.md:30-32`, `mechanisms/window.md:27-35`; see new handover clash below).
- **1.4 `/start/` Step 3 install failures (5):** **partly fixed**. Fixed no-project draft (`start/index.astro:47`), `practice` collision (`start.ts:141`), two-turn read-then-yes gate (`start.ts:143`), and Windows copy (`start.ts:142-144`, `index.astro:69`). **Still open:** `skill.branch: 'main'` fails until merged and is unpinned (`site/src/lib/start.ts:127`).
- **2.1 Turn-pacing contradiction:** **partly fixed**. Stacked pages fixed (`SKILL.md:24,28`), but splitting Reply 2 and Reply 3 created a Reply 2 stall (below).
- **2.2 Diluted show-don't-tell:** **verified-fixed** (`SKILL.md:27`).
- **2.3 Step 4 `AGENTS.md` trigger:** **verified-fixed** (`SKILL.md:28-29`, `mechanisms/text.md:10,25`).
- **2.4 Level timing, `Codex`/`OpenAI`, `layers.html`:** **partly fixed**. Timing (`SKILL.md:27,36`), neutral providers (`loop.md:16`, `world.md:12,35`), 4-vs-6 rows (`loop.md:5`), inline template (`SKILL.md:58`, `figures/layers.html:10-11`), and HTML `"this turn:"` (`layers.html:81-108`) are fixed. **Still open:** `figures/layers.html:90,100` headings (`Harness`, `Tools`) and `mechanisms/loop.md:9` (`"seven tool calls"`) leak past `SKILL.md:38`'s `plain` vocabulary limit.
- **2.5 Internal references & UI paths:** **verified-fixed** (`SKILL.md:13,19,24,30,45`).
- **3 Stale Claude Code `AGENTS.md` claim:** **still open** (`mechanisms/text.md:20` omits direct `AGENTS.md` read when no `CLAUDE.md` exists; `site/src/data/harnesses.ts:40`).
- **4.1–4.5 `install.sh` & terminal one-liner:** **partly fixed**. Symlink check (`install.sh:66-80`), frontmatter/CRLF `is_guide` (`install.sh:27-36`), and subshell `EXIT` trap + `--global` line (`start.ts:156-158`, `index.astro:67-68`) are fixed (`installTerminal` trap still untested on bash/zsh). **Still open:** broad `cp -R` (`install.sh:98`), `--dir` ignored with `--global` (`install.sh:50-56`), `--global --link` from an installed copy symlinks into disposable `practice/` (`install.sh:94-95`).
- **5 `/start/` polish:** **partly fixed**. Fixed ChatGPT URL (`links.ts:45`), Claude Code terminal warning (`index.astro:39`), `~/.t3/projects` removal and command palette (`index.astro:44`), sample chat (`index.astro:49-58`), and `$` selection (`index.astro:76`). **Still open:** no API/CLI warning (`index.astro:25-32`), no Welcome **Start**/installer hint (`index.astro:34-40`), no new-thread button location (`index.astro:76`).

## New Problems Introduced in v2

1. **Reply 2 dead-end & Reply 3 `"this turn"` mismatch (`SKILL.md:27-28`, `mechanisms/loop.md:9`):** Reply 2 gives the result, computed/written line, level line, and (`SKILL.md:19`) `world.md:19`'s 94-word permission script—with **no question to prompt the learner**. Reply 3 then tells the agent to walk `"this turn"` and say `"one of them put this page on your screen"`, which is now the *previous* turn; if the learner naturally sends a content edit after Reply 2, `SKILL.md:24` forces a revised result on Reply 3, colliding with the loop walkthrough.
2. **Step 8 `"Last line"` clashes with plain-test handover (`SKILL.md:32`, `mechanisms/window.md:28-34`):** Step 8 gives an invented plain-test opener for *this* project, then closes with `"tell your chat to start a fresh thread, or make a new project folder, and get started on something real"`—contradicting `window.md:31` (click the sidebar button yourself), inviting learners to skip the test, and clashing with `SKILL.md:65`.
3. **`installPrompt` temp-folder leak & shallow check (`site/src/lib/start.ts:142-145`):** Step 2 downloads before Step 3 waits for `"yes"`, leaking the temp folder on `"no"` (and Claude Code's removal check can block `rm -rf` in Step 5). Step 4 omits explicit replace-earlier-install and subfolder (`mechanisms/`, `figures/`, `moves.md`) rules while Step 5 verifies only `SKILL.md`.
4. **Minor leftovers:** `SKILL.md:39` still lists `"mention permission modes"` under `some` though `SKILL.md:19` covers every level; `install.sh:70` reports a symlink to an existing file as `"does not exist"`.

```json
[
  {
    "severity": "high",
    "area": "skills/agentic-guide/SKILL.md",
    "text": "Reply 2 (SKILL.md:27) ends without asking the learner anything, while Reply 3 (SKILL.md:28, mechanisms/loop.md:9) expects to walk 'this turn' for the page produced in Reply 2; learners stall after Reply 2 or send a content edit that collides with Reply 3's loop walkthrough.",
    "fix": "End Reply 2 with the short loop summary (or a single prompt/question, e.g., what they'd change in the result or explanation) and keep 'offer layers picture' separate, or make Reply 3 explicitly walk 'the result turn' after a clear Reply 2 cue."
  },
  {
    "severity": "high",
    "area": "site/src/lib/start.ts",
    "text": "skill.branch is still 'main' (start.ts:127), so skillUrl, installPrompt, and installTerminal fail until merged and remain unpinned to a release tag.",
    "fix": "Merge skills/agentic-guide to main before publishing /start/, and pin skill.branch to a release tag at launch."
  },
  {
    "severity": "medium",
    "area": "skills/agentic-guide/SKILL.md",
    "text": "Step 8's closing instruction ('Last line: tell your chat to start a fresh thread, or make a new project folder, and get started on something real', SKILL.md:32) contradicts Step 8's own plain-test handover in this project (mechanisms/window.md:28-34) and awkwardly tells learners to ask the chat to start a thread.",
    "fix": "Replace the last line so it directs the learner to start a new thread in this project to run the plain test (or, once satisfied, open a new project folder for real work)."
  },
  {
    "severity": "medium",
    "area": "site/src/lib/start.ts",
    "text": "installPrompt (start.ts:142-145) downloads into a temp folder before asking 'yes' without cleanup on 'no', omits explicit replace-earlier-install and subfolder-completeness rules, and Step 5 checks only SKILL.md (so a partial fetch without mechanisms/ or figures/ would pass).",
    "fix": "Tell the agent to delete the temp folder whether the user says yes or no (avoiding bare rm -rf if blocked), explicitly replace an earlier agentic-guide install, and verify SKILL.md plus moves.md, mechanisms/, and figures/ in both destinations."
  },
  {
    "severity": "medium",
    "area": "skills/agentic-guide/SKILL.md",
    "text": "Placing mechanisms/world.md:19's 94-word permission-mode script on Reply 2 ('Once, by the first result', SKILL.md:19) alongside computed/written and level lines creates a ~130-word prose block beneath the first inline page.",
    "fix": "Trim the Reply 2 permission note to two concise sentences (Full access reaches your account, not just this folder; switch to Supervised via model picker -> Permissions or Cmd/Ctrl+Shift+A) and keep the longer wording in world.md for follow-up questions."
  },
  {
    "severity": "low",
    "area": "skills/agentic-guide/figures/layers.html",
    "text": "Row titles 'Harness' (layers.html:90) and 'Tools' (layers.html:100) plus mechanisms/loop.md:9 ('seven tool calls') leak technical vocabulary at the plain level, conflicting with SKILL.md:38 ('model, agent and thread named, nothing else').",
    "fix": "Instruct agents to simplify the Harness/Tools row titles at plain level (or use everyday labels as primary titles) and gate 'tool calls' in loop.md:9 to some/deep."
  },
  {
    "severity": "low",
    "area": "skills/agentic-guide/install.sh",
    "text": "install.sh still uses broad cp -R (install.sh:98), silently ignores --dir when combined with --global (install.sh:50-56), allows --global --link from inside an installed project copy (install.sh:94-95), and reports a symlink to an existing regular file as 'does not exist' (install.sh:70); installTerminal's trap cleanup (start.ts:156) also remains unexecuted on bash/zsh.",
    "fix": "Copy an explicit allowlist, error on --dir with --global, warn/refuse --global --link from inside .claude/skills or .agents/skills, change line 70 to 'is not a folder or does not exist', and run one end-to-end bash/zsh test of installTerminal."
  },
  {
    "severity": "low",
    "area": "site/src/pages/start/index.astro",
    "text": "Three non-technical onboarding hints remain missing: Step 1 doesn't say not to buy API credits or standalone CLIs (index.astro:25-32), Step 2 omits installer choice and clicking Start on the Welcome page (index.astro:34-40), and Step 4 doesn't say where to click to start a new thread (index.astro:76).",
    "fix": "Add one short clarifying phrase in Steps 1, 2, and 4 (consumer plan only; click Start when ready; New thread button on practice in the sidebar)."
  },
  {
    "severity": "low",
    "area": "skills/agentic-guide/mechanisms/text.md",
    "text": "text.md:20 ('Claude Code reads CLAUDE.md; a CLAUDE.md containing the line @AGENTS.md imports it') omits that Claude Code reads AGENTS.md directly when no CLAUDE.md exists (site/src/data/harnesses.ts:40), and SKILL.md:39 redundantly lists 'mention permission modes' under some.",
    "fix": "Align text.md:20 with harnesses.ts:40 and change SKILL.md:39 to 'mention the four permission modes and Settings default'."
  }
]
```
