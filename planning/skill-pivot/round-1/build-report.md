# Round 1: build report

2026-11-21. v1 of the `agentic-guide` skill and the new getting-started page, built on `next-version` from [BRIEF-2.md](../BRIEF-2.md), [mindset.md](../mindset.md), [PLAN-2.md](../PLAN-2.md) and [decisions.md](./decisions.md) (which won wherever they differed). Nothing committed or pushed.

## What was built

**The skill**, `skills/agentic-guide/`:

| File | What it holds |
| --- | --- |
| `SKILL.md` | Frontmatter `name` + `description` only (234 characters). Body about 7,700 characters, roughly 1,850 tokens: setup (T3 detection by a tool name ending in `html_render`, earlier sessions via `AGENTS.md`, offer `git init`, warn on a real-work folder), the first session in eight steps following decisions 1–2, 6–9, the three levels, asides (one per turn, noticed and not counted), the inline-page recipe, the never list, a file index. |
| `mechanisms/text.md` | It's all text: skills, `AGENTS.md`, persistence with consent (show the paragraph, write on yes, `CLAUDE.md` with `@AGENTS.md`, prove it in a fresh thread), bending the lesson. |
| `mechanisms/window.md` | The window: one job, one thread, context leaks as the lesson, referencing threads with `@`, drag or **Copy thread**. |
| `mechanisms/loop.md` | Model, harness, tools, world; how to fill the layers figure from the learner's turn. |
| `mechanisms/world.md` | Where work lives (threads, files, side effects) and the exact data sentence from decision 6. |
| `moves.md` | The sentence bank, grouped by what each move unlocks: check it, try N times, fresh thread, ask another thread / reference a thread, make me a page, undo/stop/what did you assume, keep going without waiting, install globally later. |
| `figures/layers.html` | The exemplar figure: six layers with the loop boxed, a "this turn" line per layer for the agent to fill. No scripts, no network. T3 theme variables with fallbacks, `color-scheme: light dark` for use outside T3. |
| `install.sh` | Project scope by default (`./.claude/skills` and `./.agents/skills`), `--global`, `--dir PATH`, `--link` (symlink) or copy (default). Idempotent. Replaces only an earlier `agentic-guide` install, refuses to run with the home folder as the project, skips (exit 1) a foreign folder of the same name, and prints how to check it worked. |

**The site:**

- `site/src/pages/start/index.astro`, new: the four steps (plan, T3 Code, install, start), what to expect, a "by hand" link to the first hour, credit to Theo and T3 Tools Inc. with the independence line. Every product claim and price goes through `<Fact>` or links to its sources anchor. No new facts were added.
- `site/src/pages/start/first-hour.astro`: the old `/start/` page, unchanged apart from the move.
- `site/src/lib/start.ts`: `skill` (repo, branch, path, project name), `skillUrl`, `installPrompt`, `promptLink()`, `installTerminal`.
- Links that meant "the first hour" now point to `start/first-hour/`: `journey/first.astro`, `journey/week.astro`, `journey/where.astro`, `read.astro`, `t3-code/index.astro`, `components/journey/Next.astro`, `components/fig/home-tiles/FirstHour.astro`, `data/archive.ts`, `lib/samples.ts`. Links that meant "start here" (`explain/voice.astro`, `explain/plans-and-api/read.astro`, nav) still go to `/start/`.
- Home hero (`pages/index.astro`): one line under the existing start buttons, "Or learn on your own work: install the guide in T3 Code and start it, in four steps." Journey and design untouched.

**Docs:** `README.md` (Quick Start entry, Guides table, structure tree), `skills-table.md` (new "The guide as a skill" section), `CLAUDE.md` and `AGENTS.md` (structure tree).

## Decisions beyond the plan

1. **Install flow: make the project first, then press the button.** T3 docs (prompt-links, 0.1.9) say a link without `repo` opens a draft *without a project* on the last-used machine, and a scratch-folder thread gets its own non-Git folder. So step 3 says: New project `practice`, then the button, and pick the project at the top of the draft if needed. As a safety net the prompt itself tells the agent to create a `practice` project with its T3 project tool if it finds itself in a scratch folder, or to stop and ask.
2. **The install prompt clones the repo to a temporary folder** and runs `install.sh` from there, so copying is the default. Symlinks would dangle once the temp folder goes. `--link` stays for people editing the skill.
3. **The prompt asks the agent to read `SKILL.md` and summarise it in two sentences before installing**, and to show the script's "How to check it worked" lines. That puts reading before installing and gives a visible result.
4. **The install prompt text lives only in `site/src/lib/start.ts`**, not as a file in the skill folder, so it can't drift and isn't copied into learners' projects.
5. **No separate site route for the skill files.** The reference collection only globs `skills/*.md`, so the nested folder stays off the site; `skills-table.md` links to it on GitHub, because a relative `.md` link would be rewritten into a site route that doesn't exist.
6. **"Get ChatGPT" points to `links.codexPricing`** (OpenAI's Codex pricing page), an existing sourced link, instead of adding an unchecked `chatgpt.com` URL. Step 1 names Claude Pro and ChatGPT Plus prices via existing facts and says free plans are untested (decisions: no Codex Free recommendation).
7. **The page states the Full access default** (`t3code.defaultMode`) and says the guide offers Supervised mode, which matches the "offered, not forced" owner default.
8. **Voice:** the skill says "the mic button", with one line that voice needs a one-time choice in Settings → Voice (0.1.9 composer docs: nothing is sent until you pick where transcription runs). No shortcut is taught.
9. **The skill links to `guides/models-and-costs.md` on GitHub** for prices and limits, since the deployed site URL isn't settled.
10. **Figure styling:** the site's existing `.btn` and `.btn.ghost` classes are used on the page; no new design tokens.

## Verified, and how

- `cd site && pnpm judge`: passes (check-facts 0 warnings and 0 errors, 170 pages built, check-dist clean, 173 pages with 8,655 internal links and 0 broken). `BASE_PATH=/agentic-coding-guide/ pnpm judge` gives the same result. `guides/fact-check.md` is unchanged.
- **`install.sh` in a `mktemp -d` fixture with a fake `HOME`:** first install, re-run, `--link`, link re-run ("Already linked"), back to copy, `--global` from an installed copy, re-run from an installed copy ("Already here"), refusal in the home folder (exit 1), a foreign folder skipped (exit 1), `--help`. `bash -n` passes. shellcheck isn't installed, so it wasn't run.
- **Lab install:** `bash .../install.sh` run inside `~/Developer/agentic-coding-lab`. Both `.claude/skills/agentic-guide/` and `.agents/skills/agentic-guide/` landed with all 8 files, and `diff -r` against the source shows them identical. Exit 0. Nothing else in the lab changed. The lab has no commits yet; its README is untracked.
- **Rendering (Playwright 1.65.1 from the site, no server):** `figures/layers.html` at 360 and 728 px, light and dark: no horizontal overflow, no console errors, the loop label readable after the `color-scheme` fix. Also checked with T3-like variables injected. `/start/` at 360 and 1280 px and the home page at 360 px: no horizontal overflow, no page errors. The install button's computed colours are paper on ink.
- **Install prompt link:** about 1.5k characters once encoded, under T3's 8,000-character limit.
- **T3 facts used in the skill and page come from the v0.1.9 user docs** (`html-renders`, `prompt-links`, `composer`, `permission-modes`, `welcome-page`, `thread-sidebar`, `source-control`, `faq`) and the `html_render` tool schema seen in this session (theme variable list, 360/728 px widths, no `vh`, no page background).

## Still unverified

- **The whole learner path in T3 Code:** that `$agentic-guide` shows up in the lab under Codex and Claude Code, that the skill loads, and that the first session behaves as written. Not run, by instruction.
- **The prompt link on 0.1.9:** the destination picker, picking the project in the draft heading, and whether the agent in a scratch thread really creates a `practice` project with `t3_project_create`.
- **The clone fails until the skill is on `main`.** `skill.branch` in `start.ts` is `main` (owner default: this repo's public path). Before the merge, the button and the terminal line clone a branch with no `skills/agentic-guide`. For testing now, set `branch: 'next-version'` or install with the local `install.sh`.
- **Symlinked skill folders (`--link`):** not confirmed for either Codex or Claude Code discovery.
- **Codex tool name `mcp__t3_code__html_render`:** taken from Sol's observation in advice-sol.md, not seen here. Detection is by suffix either way.
- **Whether `html_render` with `path` works on a file inside `.agents/skills/…`** under Codex's sandbox. The recipe also allows inline `html`.
- **The Claude Code `CLAUDE.md` → `@AGENTS.md` advice** follows `harnesses.claudeCode.contextFile`. Sol notes native `AGENTS.md` reading depends on the Claude Code version.

## Known gaps

- No `check-skill` lint, no token or word budget in CI, and no privacy grep. Word counts were checked by hand: SKILL.md about 1,280 words, mechanism files about 500 each, `moves.md` about 700.
- Step 4 has no real screenshot. It uses a small schematic message box with the verified empty-composer string.
- The `t3-welcome`, `t3-new-project` and other screenshot slots in `lib/samples.ts` are still `todo`; the moved first-hour page uses them as before.
- No German or other translations; the skill translates the figure on request.
- `nav.ts` still marks the Start section `ready: false`, so the header nav doesn't list it; the home hero and existing links reach it.
- The first-hour page doesn't link back to the new `/start/`.
- The skill has no explicit return-session flow beyond reading `AGENTS.md`. Thread search across sessions isn't relied on (decisions).
