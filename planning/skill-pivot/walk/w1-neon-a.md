# Walkthrough Report — `w1-neon-a` (neon, pass 1)

- **Assignment:** `w1-neon-a`
- **Inner model:** `claudeAgent/claude-sonnet-5-5`
- **Runs completed:** 3 / 3 (`w1-neon-a-L1`, `w1-neon-a-L5`, `w1-neon-a-L3`), 0 failed
- **Findings logged to `inbox.jsonl`:** 29 total — `bug`: 3, `papercut`: 9, `curriculum`: 1, `works`: 16

---

## Summary of Key Findings

1. **Systematic CSS custom-property cycle bug in generated inline HTML (`bug/high`, `skills/agentic-guide/moves.md`, reproduced in 3 of 3 runs):**
   On `w1-neon-a-L1` Turn 2, `w1-neon-a-L5` Turn 2, and `w1-neon-a-L3` Turn 4, the model wrote `:root{...--card:var(--card,#18181b);...}` when aliasing T3 CSS variables on `:root`. In CSS, aliasing a custom property to itself creates a cycle that makes `--card` guaranteed-invalid and overrides T3's `:root { --card: #ffffff }` in light mode. When `.box` used `background: var(--card, #18181b)` (`L1` T2 and `L5` T2), light-mode preview pixels confirmed `#18181b` dark cards with `#27272a` dark text (unreadable). When `.box` used `background: var(--card)` (`L3` T4), card fill silently vanished to transparent.
   - **Fix:** In `moves.md` *Make me a page* step 2, explicitly warn never to alias a T3 variable to its own name on `:root` (use `var(--card, ...)` directly on selectors, or prefix aliases like `--g-card` as `figures/layers.html` does) and check light mode when previewing.

2. **Tension between "Do their work first" and "Offer the fresh-thread move before starting" (`papercut/medium`, `skills/agentic-guide/mechanisms/window.md`, `L3` T4):**
   When an unrelated second job (3-day Bayesian workshop plan) arrived in the physics integrator benchmark thread, the agent generated and rendered the entire 1478px workshop HTML page inside the benchmark thread first, and only afterward gave `Guide · window` suggesting a fresh thread. `window.md` explicitly says *"offer the fresh-thread move before starting"*, which clashes with `SKILL.md`'s *"Do their work first, explain second"*.
   - **Fix:** Explicitly reconcile the two rules in `SKILL.md` and `window.md`: for an unrelated second request, stopping to offer a fresh thread *is* the first helpful action.

3. **Returning-learner sessions drop the `Guide · <topic>` + `Try:` cadence and handover scaffolding (`curriculum/medium` & `papercut/medium`, `SKILL.md` & `window.md`, `L5` T3–T7 & `L3` T6):**
   - In `L5` (seeded `plain` fixture), the learner spent Turns 3–6 exploring files-vs-chat, sensitive reserve data, computer-change audit, and Supervised mode with **zero** `Guide · ...` asides and **zero** **Try:** lines; the first aside only arrived on Turn 7 (about the loop) and Turn 8 (about undo).
   - In `L3` (seeded `deep` fixture), when the learner asked to be set up for a fresh thread on Turn 6, the agent supplied only the opener quote and omitted parts 2–5 of `window.md` *Handover* (sidebar button + checking default permission mode under the message box, what to verify, calling `$agentic-guide` back, global install), likely because `window.md` labels the 5-part handover *"At the end of the first session"*.
   - **Fix:** Add brief returning-session guidance in `SKILL.md` (keep the aside + **Try:** cadence when mechanisms land) and in `window.md` *The fresh-thread move* (always remind about starting from the sidebar and checking permission mode under the message box).

4. **Other notable papercuts caught across runs:**
   - **Plain-vs-some mis-inference (`L1` T2, `SKILL.md`):** A UX designer living in Figma/Notion who inspects CSS was classified as `plain` because they said *"I don't really write code except inspecting CSS"*.
   - **Omitted Reply-3 style question (`L1` T3, `SKILL.md`):** When Turn 3 also carried a direct learner question (*"how did you build it?"*), the agent dropped *"And how I explained it: shorter, another language, bigger text, a table?"*.
   - **Unshown diff/path at `some` (`L1` T5, `SKILL.md`):** After approval, the agent wrote *"Saved `AGENTS.md`"* without showing path/diff, even though it appended an unpreviewed third bullet for `Level: "some"`.
   - **Unset Git identity on first snapshot (`L1` T6, `world.md`):** `git commit` failed on a fresh repo/machine with no `user.name`/`user.email`, leaving `AGENTS.md` *"staged"* and exposing Git jargon (handled gracefully once pointed out, and avoided cleanly in `L5` T6 and `L3` T4 via one-off `-c` commit identity).
   - **Supervised read-permission overclaim (`L5` T6, `world.md`):** Table claimed unconditionally that in Supervised mode *"Reading is allowed without asking"* right after the learner asked about `~/Documents`, without noting harness/provider differences.
   - **Task-specific numbers baked into saved checking rule (`L1` T7 → T10, `moves.md`):** Saving `"impossible values like 0 or 200"` from the desk-lamp task caused the fresh note-taking thread to test `0 people`, `1 person`, and `200 people` for a 6-person team.

---

## Run 1 — `w1-neon-a-L1` (L1 First session, level `some`)

- **Persona:** UX designer at Figma/Notion level comparing four invented home-studio desk lamps
- **Main thread:** `mcp:97db5d0f-8928-4dfc-868e-5fcd8c62a485`
- **Fresh handover thread:** `mcp:d6d6450b-245b-495a-913c-876b4a1fe1b5` (`w1-neon-a-L1 fresh`)
- **Turns:** 10 (9 main + 1 fresh handover test)

### Turn Table

| Turn | What I typed | What happened | Verdict |
|---|---|---|---|
| 1 | `$agentic-guide` | Clean 2-paragraph, 4-line welcome ("I'm your guide today, and I'm also the agent... What's one small thing you'd like done this month?"). No jargon, no files touched. | **Works** |
| 2 | Described UX designer background (Figma/Notion, inspects CSS occasionally) and 4 invented desk lamps for a 140 cm matte oak desk with dual 27" monitors; asked for comparison. | Rendered interactive HTML comparison with live priority sliders, bars, score table, and dual-monitor/CRI R9/flicker checklist (1116px, 0 console errors, 0 files written). Tight 4-line, 48-word prose reply with Full access line and computed-vs-written note. **Bugs/papercuts:** (1) `:root{--card:var(--card,#18181b)}` broke light mode (dark `#18181b` cards with dark text); (2) mis-inferred level `plain` ("I'm assuming you don't write code") and hid tool names. | **Bug (high) + Papercut (medium) + Works** |
| 3 | Asked for "more detail", asked to add a desk-space criterion and check whether Option C fits, and asked how the page and scores were built. | Refused to guess C's width; computed 27" 16:9 dual-monitor width + 1 cm bezel = 123.5 cm (16.5 cm free) with a live width input updating C's fit & score (1464px, 0 console errors, CSS fixed: no `--card` cycle). Separated script-computed vs browser-computed vs hand-written values. Walked the loop at `some` level (Sonnet 5.5, Claude Code, 3 tool calls), gave **Try:** line, offered layers picture without stacking. **Papercut:** omitted the Reply-3 style-preference question. | **Works + Papercut (medium)** |
| 4 | Said yes to layers picture; volunteered style preference (short tight bullets, compact tables for comparisons). | Rendered `figures/layers.html` accurately filled with Turn 3 (`Claude Code`, `Sonnet 5.5`, 3 tool calls, Anthropic, 740px, 0 console errors, light/dark clean). Immediately applied bullets + compact table ("Without it" vs "With it"). Previewed exact `AGENTS.md` quote block before writing, held back unconfirmed level and asked to confirm `some`. Zero project files written yet. | **Works** |
| 5 | Confirmed `some` and approved saving `AGENTS.md`; asked what to do next. | Wrote `AGENTS.md`, ran 2 web searches on lighting standards (300–500 lux, UGR ≤ 19, PWM flicker, R9/TM-30) and self-corrected its own 500–800 lux assumption in a compact table with links. Offered honest Git snapshot (didn't commit yet) and gave `Guide · Text` aside + **Try:** line. **Papercut:** wrote only "Saved `AGENTS.md`" with no path/diff (required at `some`) while appending an unpreviewed 3rd bullet for `Level: "some"`. | **Works + Papercut (medium)** |
| 6 | Approved Git snapshot of `AGENTS.md` and asked to update page to 300–500 lux band + expert checklist. | `git commit` failed because `user.name`/`user.email` were unset; left `AGENTS.md` staged and asked for identity or local placeholder without silently inventing one. Updated page cleanly (1636px at 728px, 2020px at 390px, 0 console errors), recomputed totals in a separate script, and asked Step 6: *"how would you check this comparison before you trust it?"* **Papercut:** unset Git identity snag + "staged" jargon on first snapshot. | **Works + Papercut (medium)** |
| 7 | Approved placeholder Git identity; gave UX edge-case checks (all sliders 0, max one criterion, 0 cm / 200 cm width, manual spot checks). | Committed `1f00d06` with local `.git/config` placeholder. Actually ran the edge-case checks on the scoring logic, caught and fixed **2 real defects** (all-zero winner highlight; 0 cm scoring 10 and -5 cm scoring 10.9), honestly noted browser clicks weren't tested, kept scratch tests out of project, updated page (1636px, 0 errors), and previewed a reusable `AGENTS.md` checking rule before saving. | **Works** |
| 8 | Approved saving checking rule; asked whether to paste a real Notion export of 18 customer checkout interviews. | Saved rule to `AGENTS.md`. Delivered all 4 *Where data goes* sentences verbatim/accurately (including T3 optional-extras caveat and naming Anthropic), flagged workplace rules and participant consent, offered invented data with the same shape in a compact table, and gave `Guide · World` aside + **Try:** line. | **Works** |
| 9 | Declined pasting real data; asked to snapshot updated `AGENTS.md`, set up a fresh thread, and explain getting the guide into a separate checkout folder. | Committed `69ac00a` (clean tree). Delivered complete 5-part handover: plain note-taking tool opener (no guide/rule hints, designed to show bullets + table), sidebar + permission-mode check, what to look for, separate `$agentic-guide` recall, and global-install table (`~/.claude/skills` & `~/.agents/skills`) asking before running. | **Works** |
| 10 (fresh) | Sent exact Turn 9 opener in new thread `w1-neon-a-L1 fresh`. | Stayed 100% plain (no guide persona, no lamp leakage) and obeyed **every** `AGENTS.md` rule without prompting: short bullets, compact comparison table, edge-case checks, two hand spot-checks, and "What I found broke". **Minor papercut:** literal `"0 or 200"` from lamp rule made it check `0 people`, `1 person`, and `200 people` for a 6-person team. | **Works + Papercut (low)** |

### Inline HTML Pages Inspected (`w1-neon-a-L1`)
1. Turn 2 (`be4dede6`): 728×1116, 0 console errors — **FAIL in light mode** due to `:root{--card:var(--card,#18181b)}` cycle making cards `#18181b` with `#27272a` text.
2. Turn 3 (`ea67a109`): 728×1464, 0 console errors — **PASS** light & dark (cycle removed).
3. Turn 4 (`37900140`, `layers.html`): 728×740, 0 console errors — **PASS** light & dark (`--g-*` prefixed vars).
4. Turn 6 (`200a794b`): 728×1636 and 390×2020, 0 console errors — **PASS** light, dark, and narrow 390px.
5. Turn 7 (`068a29bb`): 728×1636, 0 console errors — **PASS** light & dark.

---

## Run 2 — `w1-neon-a-L5` (L5 Where work lives, level `plain`)

- **Persona:** Field ecologist who only uses spreadsheets testing invented woodland bird transects
- **Main thread:** `mcp:55a42671-d3a4-47bc-b5cf-b2ba70c850dc`
- **Fixture:** `fixture.sh w1-neon-a-L5 plain` (seeded `AGENTS.md` with `Level: plain (confirmed)` + short/tables)
- **Turns:** 9

### Turn Table

| Turn | What I typed | What happened | Verdict |
|---|---|---|---|
| 1 | `$agentic-guide` | Detected seeded `AGENTS.md`, skipped intro, asked cleanly what to work on today (33 words). | **Works** |
| 2 | Provided 4 invented woodland transects (Marsh Wren, Meadow Pipit, Pine Siskin); asked for an Excel-friendly CSV with birds/100m and a comparison. | Created accurate UTF-8 BOM CSV `transect-bird-density.csv` and rendered inline HTML table + stacked bar chart + ecology caveats (663px, 0 console errors; noted light rain lowers detection at Oak Hollow). Tight 54-word reply with Full access line. **Bugs/papercuts:** (1) reproduced `:root{...--card:var(--card,#18181b)}` light-mode contrast bug on `.box`; (2) showed full raw filesystem path `~/...` before asked at `plain` level. | **Bug (high) + Papercut (low)** |
| 3 | Asked where `transect-bird-density.csv` lives (chat, cloud, or laptop) and whether closing the app deletes it. | Checked actual hostname (`<host>`), distinguished real file vs chat vs cloud in a compact table, and refused to assume `<host>` is the user's laptop ("Only if <host> is your laptop. I can't tell from here."). | **Works** |
| 4 | Said I'm considering dropping in my real wetland-reserve survey spreadsheet (endangered nesting GPS + landowner notes); asked if anything leaves my computer and whether my employer/agency can see it. | Gave all 4 *Where data goes* sentences accurately (including T3 optional-extras caveat and Anthropic), explicitly flagged nesting GPS & landowner notes would be sent when read, refused to guess about employer/agency visibility or data retention, and offered invented data with the same shape. | **Works** |
| 5 | Asked what changed on my computer today since starting, and to sort the CSV + save `weather-caveats.txt`. | Returned an unusually honest 4-row audit table (project files, temporary helper script & screenshot elsewhere, commands run, what left machine), sorted CSV & wrote `weather-caveats.txt`, and offered a Git snapshot with the exact new-file limitation before committing. | **Works** |
| 6 | Approved snapshot (placeholder ok); asked whether Full access could overwrite `~/Documents` spreadsheets and what Supervised changes. | Committed `2ec74be` with one-off `-c` identity (Git config untouched). Memorable plain-level honesty: *"The project folder is where I work, but it isn't a fence."* Accurate Supervised switch path. **Papercut:** table unconditionally claimed *"Reading is allowed without asking"* in Supervised mode without noting harness/provider differences for outside-project reads. | **Works + Papercut (medium)** |
| 7 | Asked to drop `weather` and `length_m` from CSV and create new file `meeting-talking-points.txt`. | Made both changes, noted the snapshot covers the CSV while the new note stays separate, and gave its first aside (`Guide · the loop` + **Try:** line). **Curriculum note:** zero `Guide`/`Try` asides appeared during Turns 3–6 while L5 World concepts actually landed. | **Curriculum (medium)** |
| 8 | Asked to undo both changes and restore the folder to the snapshot. | Reverted `transect-bird-density.csv` cleanly from `2ec74be`, deleted `meeting-talking-points.txt` as a separate step, verified clean `git status`, and gave `Guide · undo` (*"The deleted note had no snapshot, so it can't be recovered"*) + **Try:** line. | **Works** |
| 9 | Asked where old conversations end up and how to find them next month. | Explained local text storage on `<host>`, sidebar, `Cmd/Ctrl+K` search (titles & message words), files surviving independently, `@` referencing from new threads, tailored **Try:** line, and optional fresh-thread test offer. | **Works** |

### Inline HTML Pages Inspected (`w1-neon-a-L5`)
1. Turn 2 (`96eae9b8`): 728×663, 0 console errors — **FAIL in light mode** due to reproduced `:root{...--card:var(--card,#18181b)}` cycle making `.box` `#18181b` with dark text.

---

## Run 3 — `w1-neon-a-L3` (L3 One thread is one window, level `deep`)

- **Persona:** Computational physicist benchmarking numerical integrators, then mixing in an unrelated workshop job
- **Main thread:** `mcp:306c943a-3653-48fa-a700-1d583da8a8ab`
- **Fresh referencing thread:** `mcp:6511e836-3272-49a1-803c-28e1caacee46` (`w1-neon-a-L3 fresh`)
- **Fixture:** `fixture.sh w1-neon-a-L3 deep` (seeded `AGENTS.md` with `Level: deep (confirmed)` + short/tables)
- **Turns:** 8 (7 main + 1 fresh referencing test)

### Turn Table

| Turn | What I typed | What happened | Verdict |
|---|---|---|---|
| 1 | `$agentic-guide` | Loaded saved preferences cleanly ("deep level, short explanations, tables for comparisons") and asked what to work on (3 lines). | **Works** |
| 2 | Asked for `integrator_bench.py` comparing Velocity Verlet vs RK4 on an invented 1D anharmonic oscillator ($T=200, \Delta t=0.05$). | Wrote clean script + rendered inline HTML with equal-cost `dt/4` row, fitted convergence orders, and log-log SVG showing RK4 secular drift crossing Verlet near $T \approx 1.7\times 10^4$ (585px, 0 console errors, light/dark clean). 54-word prose reply naming `Bash`, path, and hand-written chart coordinates. | **Works** |
| 3 | Asked to add 4th-order Yoshida symplectic integrator at $T=200$ and $T=2\times 10^5$. | Implemented triple-jump Yoshida4 ($9.3\times 10^{-7}$ bounded drift), verified hand-typed coefficients via order check (3.88) + 1000× horizon check, noted Python loop overhead vs C++. Deep `Guide · loop` aside naming exact tool calls (`Read`, 4 `Edit`s, `Bash`) + tool schemas in context; offered `"layers"`; offered honest Git snapshot. | **Works** |
| 4 | Approved snapshot AND dropped an unrelated second job (3-day Bayesian summer workshop schedule + checklists) in the same thread. | Committed `4387127` (one-off identity). **Papercut:** built and rendered the full 1478px workshop HTML page in the benchmark thread *before* giving `Guide · window` suggesting a fresh thread (contrary to `window.md` "offer the fresh-thread move before starting"). **Bug (3rd run):** reproduced `:root{...--card:var(--card,#18181b)}` cycle (here `.box` fell back to transparent). | **Bug (high) + Papercut (medium)** |
| 5 | Asked mechanically what is inside the window, why long threads drift/forget, how cost per turn scales, and the exact context limit for this model. | Exceptional deep-level breakdown: stateless API resend, 5-part window table (even noting `html_preview` + `html_render` enter pages twice), attention dilution + lossy compaction, $O(n^2)$ input-token scaling + prompt cache expiry. Strictly refused to quote context size from memory and linked `guides/models-and-costs.md`. | **Works** |
| 6 | Asked to be set up for a fresh thread to port `integrator_bench.py` to C++, how to reference this thread instead of repeating, and how subagents fit into the window budget. | Crisp opener quote, nuanced `@` / drag / Copy-thread guidance (explicitly warning that reading a mixed thread pulls in workshop noise too, so ask narrowly), and sharp parent-vs-subagent table (gain, token overhead, handoff failure mode). **Papercut:** omitted handover parts 2–5 (sidebar start + default permission-mode check, verification, `$agentic-guide` recall, global install). | **Works + Papercut (medium)** |
| 7 (fresh) | Started `w1-neon-a-L3 fresh` referencing `w1-neon-a-L3` (`mcp:306c943a-...`) narrowly for benchmark baselines only; asked for C++17 port & `-O2` vs `-O3 -ffast-math` table. | Cleanly read earlier thread on demand, pulled exact Python baselines & opener context while ignoring workshop noise, stayed 100% plain (no guide), obeyed `AGENTS.md`, and compiled/verified `integrator_bench.cpp` matching Python drifts to 4 digits. | **Works** |
| 8 (main T7) | Returned to main thread and asked how to move the guide to a new C++ repo folder and what carries over vs stays behind. | Produced clear 6-row carries-over-vs-stays-here table (guide global install, `AGENTS.md`, `~/.claude/CLAUDE.md`, threads, files/Git, Settings → Threads default permission mode), checked both home skill paths, gave exact *Where data goes* sentences, noted untracked `integrator_bench.cpp`, and asked before running global install. | **Works** |

### Inline HTML Pages Inspected (`w1-neon-a-L3`)
1. Turn 2 (`5d0dd358`): 728×585, 0 console errors — **PASS** light & dark (no `--card` alias).
2. Turn 4 (`44eb7e00`): 728×1478, 0 console errors — **FAIL (subtle)** due to `:root{...--card:var(--card,#18181b)}` cycle silently invalidating `--card` on `.box` (transparent instead of T3 `--card` surface).

---

## Curriculum Review

### 1. Did the skill teach the mechanism through the learner's own work, or did it lecture?
- **Strong win on teaching through the learner's work.** Across all three levels (`plain`, `some`, `deep`), the skill stayed anchored to the learner's actual artifacts:
  - In `L1`, the **Checking is theirs** moment (Turn 7) was the single strongest sequence of the entire walkthrough: running the UX designer's own edge-case checks exposed two genuine bugs in the lamp comparator, which made saving the checking rule to `AGENTS.md` feel earned rather than abstract, and watching the fresh handover thread (`L1` T10) obey every saved rule without being told proved *"it's all text"* viscerally.
  - In `L5`, the snapshot-vs-new-file undo (Turns 7–8) and the 4-row *"what changed on my computer today"* audit (Turn 5) grounded **The world** concretely in `transect-bird-density.csv` and `meeting-talking-points.txt`.
  - In `L3`, pointing out that `html_preview` + `html_render` doubled the workshop page's token footprint in the physics thread (Turn 5) and warning that `@`-reading a mixed thread pulls in the workshop noise (Turn 6) taught **The window** through the exact mess the learner had just created.
- **Where it drifted toward Q&A rather than active teaching:** In returning-learner runs (`L5` Turns 3–6, `L3` Turn 6), once the 8-step first-session script no longer applies, the agent shifted into pure helpful-assistant Q&A mode — answering accurately, but dropping the `Guide · <topic>` + `Try:` cadence that turns an explanation into a reusable habit.

### 2. What felt missing, redundant, or in the wrong order?
- **Missing — first-snapshot Git identity guard (`world.md`):** Fresh learners on new machines routinely lack `git config user.name`/`user.email`. Offering a snapshot only to hit a Git error that leaves files *"staged"* (`L1` T6) is avoidable friction; the skill should tell the agent to check identity or offer a one-off `-c` placeholder cleanly (as it happened to do in `L5` T6 and `L3` T4).
- **Missing — conflict resolution between `SKILL.md` ("Do their work first") and `window.md` ("offer the fresh-thread move before starting"):** Without an explicit exception for an unrelated second job, the agent complies with the second job inside the dirty window first (`L3` T4), undermining *"teach it by doing it"*.
- **Missing — CSS variable aliasing warning in `moves.md`:** Telling agents to *"use T3's variables on `:root`"* reliably induces `:root { --card: var(--card, #18181b) }` across 100% of runs that use `.box` cards, breaking light mode.
- **Missing — generalizing task-specific checking rules (`moves.md`):** When converting a learner's checking answer into an `AGENTS.md` rule, keeping literal numbers (`0 or 200`) leaks task-specific quirks into unrelated future threads (`L1` T10).
- **Slight ordering/trigger gap in `L1` Reply 3:** Pairing the layers-picture offer and the style-preference question on the same reply caused the style question to drop as soon as the learner also asked a direct question (`L1` T3). Having a fallback ("if still unasked on Reply 4, ask now") prevents missing the Bend-it moment.
- **Nothing felt redundant** across the four mechanisms (`loop`, `text`, `window`, `world`); each pulled real weight, and the 4-line / ≤60-word Reply 2 discipline worked cleanly across all three levels.

### 3. Which `moves.md` sentences would real learners at these levels actually reuse?
- **High reuse across all levels (`plain`, `some`, `deep`):**
  - *"Which parts of that did you guess?"* and *"What did you assume? List it."* — immediately natural to a UX designer, ecologist, and physicist alike; pairs naturally with the computed-vs-written disclosure.
  - *"Make me invented data with the same columns and kinds of values as mine, and build the method on that first."* (`world.md`) — huge practical value for anyone handling customer interviews (`L1`) or sensitive field data (`L5`).
  - *"What did you change on my computer today? Group it into files, commands and anything that left this machine."* — directly answers the biggest anxiety for `plain` and `some` users.
  - *"Start a fresh thread for this. Write me the first message for it first."* — immediately sticky once a learner sees context pollution (`L3`).
- **High reuse at `some` / `deep`, lower at `plain`:**
  - *"Run it on five different inputs, including one that should break it."* / custom **Try it N times** rules — resonated strongly with the UX designer (`L1` T7) and fits scientists/analysts naturally, whereas a spreadsheet-only `plain` user is more likely to reuse *"Before you change the file, tell me which columns you'll touch and which you'll leave alone."*
  - *"`@thread-name`: what did it find? Compare it with what we have here."* — natural for `deep`/`some` multi-thread workflows (`L3` T7), less likely to be top-of-mind for a first-week `plain` user until they have several threads.
  - *"Take a snapshot of these files first."* / *"Put the files back the way they were in the snapshot, and show me."* — very useful once demonstrated, though `plain` users will phrase it as *"save a backup before you edit this"* unless the word *snapshot* is reinforced without Git jargon.
- **Lower unprompted reuse:**
  - *"Make me a page of what you did today and where to look first."* — learners love receiving inline pages, but rarely think to ask for one unprompted until the agent models *"Draw how the parts of this fit together"* or *"Turn these questions into a form I can click through"*.
  - *"Keep going without waiting"* (*"While that runs: …"*) — useful power move, mostly adopted by `some`/`deep` users once they encounter long builds or benchmarks.
