# Fix pass 1: report

Done 2026-11-21, against [fix-pass-1.md](fix-pass-1.md). Nothing committed. No new files in the skill, no renames, no site pages changed.

**SKILL.md:** 1,425 words before, 1,482 after (+57, within the +60 budget). It is paid for by tightening: the snapshot sentence now points to `world.md` *Snapshots*, the checkpoint sentence is shorter, step 4's level clause is shorter, and step 8's last line drops "real work gets its own project folder after that", which was half of the mixed signal in F18.

Other files after the pass (words): `loop.md` 724 (was 681), `text.md` 941 (664), `window.md` 951 (798), `world.md` 985 (807), `moves.md` 1,112 (1,032).

## F8 first: the Antigravity experiment

See [f8-antigravity.md](f8-antigravity.md). In short, Antigravity under T3 Code (ACP server 1.1.1) put none of `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md` or `.agent/rules/*.md` into a new thread's first request to the model. It did list the project's skills. Earlier walk threads got `AGENTS.md` only through a `view_file`/`client_view_file` tool call. The account's Antigravity quota was used up (HTTP 429, on Neon and on Flash), so the model never answered and there is no self-report. The evidence is the request Antigravity stored locally in its conversation database, which is stronger than a self-report. The docs bundled in Antigravity's binary say it loads `GEMINI.md`/`AGENTS.md` by walking up from the working folder; in this setup it didn't. The live check can be repeated after the quota resets (about 23:15 on 2026-11-21) in the same fixtures `lab-projects/f8-*`.

## Per fix

| # | Change |
| --- | --- |
| F1 | `moves.md` recipe step 2: never declare a T3 variable under its own name (the `:root{--card: var(--card, …)}` cycle). Use `var(--card, #fallback)` where it's used, or a prefixed alias. Also reworded "use T3's variables on `:root`" to "use T3's variables", because the old wording invited the declaration. |
| F2 | `moves.md` recipe step 3: lay out for about 390 px; tables with more than 4 columns stack or scroll inside their own box; chart labels readable at that width (replaces "read at 360px"). Step 4: over 2000 `contentHeight`, split the page or ask which part comes first. |
| F3 | `SKILL.md` *Never*: no writes outside the project, temp and probe files included (keep them in the project or delete them that turn); exceptions are the global install and a home-folder rule they said yes to; explain reach, never demonstrate it. `text.md` *Persistence* 4, "Everywhere": the project `AGENTS.md` stays the default. For every project, name the home-folder file for the harness (`~/.codex/AGENTS.md` for Codex, `~/.claude/CLAUDE.md` for Claude Code, otherwise say you don't know), say it may hold their own rules, show content and diff, and write only on an explicit yes. `world.md` *Permission mode*: explain reach, never demonstrate it by reading private folders or writing a probe file. |
| F4 | `world.md` *Permission mode*: the mode decides when they're asked, not what the agent can reach; reach is the user account plus any harness sandbox; don't promise per-tool rules. Same correction in `world.md` deep ("within any sandbox the harness has; the permission mode decides when it asks") and in `loop.md`'s "Can it do anything on my computer?" answer, which had the same blur. |
| F5 | `SKILL.md` step 7: "Before real work, or as soon as real material comes up"; invented data offered first. `world.md` *When it lands*: the first mention of real material triggers the data sentences before inviting the file; a saved rule or check that needs real material gets the data sentences when it is saved. |
| F6 | `window.md` *When it lands* and the `SKILL.md` *Asides* trigger now say the same: small job, do it, then the aside; a job that will grow or mix, one line first ("New thread for this? (it keeps the two from mixing)"), and do it here on no. |
| F7 | `SKILL.md` Setup 2: on a returning session the reply checkpoints don't apply; asides and **Try:** do, whenever a mechanism lands. `window.md` *The fresh-thread move*: every time you send them to a fresh thread, say how to start it and check its permission mode, and how to call the guide back (points to *Handover* 2 and 4). |
| F8 | `loop.md`: "The harness, the program you run the model in (such as Codex or Claude Code)". `text.md` plain: say "starts by reading it" only if the harness loads `AGENTS.md` by itself (Codex and Claude Code do), with an honest alternative sentence otherwise. Some: which harnesses load it; others may not, and the model then reads it only by choice. Deep: the dated Antigravity observation (2026-11-21), and "for any other harness, say you don't know rather than guess". *Persistence* 3: if the harness doesn't load it, say so before they rely on it. The *Does it remember me?* answer is narrowed to Codex. `window.md`: the intro says "any context files the harness loaded"; the plain line says "instruction files I've read"; *Handover* 3 gets the honest check sentence. `site/src/data/observations.ts`: `experience.antigravityContextFiles`, status `observation`, verified 2026-11-21. |
| F9 | `moves.md` *Install globally*: "in every project, for Claude Code and Codex" (Unlocks line and body). `window.md` *Handover* 5 says the same. `install.sh` help: `--global` reads "for every project in Claude Code and Codex". `bash -n` passes and `./install.sh --help` prints correctly. Behaviour unchanged. |
| F10 | `SKILL.md` *Level*: technical tools (CSS, SQL, R, formulas) mean **some**, even if they say they don't code. |
| F11 | `text.md` *Persistence* 2: write exactly the paragraph you showed, nothing more; at some and deep, show the path and the diff after writing. |
| F12 | `world.md` *Snapshots*: if the commit fails for lack of a name and email, say so in plain words; offer a name for this folder only (`git config` in the project, never `--global`) on yes; never leave it half done. |
| F13 | `SKILL.md` *Asides*: the **Try:** sentence is "reworded to their work"; at plain, one question per reply. |
| F14 | `SKILL.md` step 6: "their own check sentence (*Try it N times* in `moves.md` when repetition fits)". |
| F15 | `SKILL.md` *Files*: if this file's text is no longer in your window, read it again before going on. |
| F16 | `loop.md` *When it lands*: summaries, footnotes and labels on a page are text you wrote; check them against what the tool computed before you show the page. |
| F17 | `text.md` deep: context files are weighed by the model and can conflict or drift; permission modes are enforced by the harness in code, and no text overrides them. A shorter version is in some. |
| F18 | `window.md` *Handover*: end with one next step, the fresh thread; don't also promise to continue work here. Item 5 at plain: how to make a project folder in T3 (Cmd/Ctrl+K, **New project**; the folder goes in `~/.t3/projects` with a first snapshot, from `t3code.newProject`). `SKILL.md` step 8's last line is now the single next step. |
| F19 | `SKILL.md` step 3: ask the style question once, "here or in the next reply". |

## Notes and open points

- **`~/.claude/CLAUDE.md` (F3)** is not in `site/src/data/harnesses.ts`. It is Claude Code's documented user-level memory file, and this session loads it as the user's global instructions, but the data file only has `~/.codex/AGENTS.md` (Codex, verified). Consider adding a `claudeCode.userContextFile` fact; I didn't, because the brief limited site edits to `observations.ts`.
- **Site check:** `node scripts/check-facts.mjs --write`, `pnpm build` (170 pages) and `pnpm check-links` (0 broken) all pass. Regenerating `guides/fact-check.md` also picked up the uncommitted `t3code.ts` edits already in the working tree (two new rows, one longer claim) and moved its date to 21 November. That is expected from the generator, not something this pass changed.
- **Antigravity global skills (F9, #129):** the stored prompt lists skill folders `<provider>/config/skills`, `<provider>/antigravity-cli/skills`, `<project>/.agents/skills` and `<project>/.gemini/skills`, not `~/.agents/skills`. That supports qualifying the global install. I didn't add an Antigravity install path to the skill, because the brief said to change nothing else.
- **Not fixed, as the spec says:** #15, #34, #54 (content mistakes), #49 (snapshot timing), #137 and saving pages as files (curriculum notes).
