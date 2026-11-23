# w1-opus-c (opus, pass 1)

Inner model for every learner thread: antigravity / gemini-4-neon-medium, the first pass of this skill on the Antigravity harness. Runs 1 and 2 finished. Run 3 failed at turn 9 on an Antigravity usage limit ("Usage Limit Reached … resets in 1 hour, 56 minutes"). Every finding is in the inbox.

## w1-opus-c-L2: It's all text, deep, computational physicist

Guide thread `mcp:b14c4886-06c4-4344-aa31-c1d571395a42`, test thread `mcp:cd7023e1-f796-44c7-b2ea-9efe5f863112`. Status: done, 11 turns.

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | One line, read from AGENTS.md: level deep, short explanations, tables. Then "What do you want to work on today?" | OK. No first-session leftovers |
| 2 | An invented NVE LJ energy series with a drift of 1e-5 per step; fit the drift with autocorrelation-aware errors, NumPy only | Wrote `nve_drift.py` and compared 5 estimators (naive, Newey-West ×2, Sokal τ_int, block). A 300-replicate Monte Carlo coverage check showed naive OLS covers 20.7% of the time and Sokal 92%. Rich inline page. The four lines were exact: permission, `run_command` named, level, "Anything you'd change?" | Works. The page has a "plateau" panel with no plateau (bug, low), and the tables and chart text clip at 390px (papercut) |
| 3 | No plateau; give ONE defensible error bar, always print the seed, in every thread | Explained why it can't plateau (B=500 leaves M=10 blocks). Gave one error bar with a reason and the seed. Showed the AGENTS.md lines as a quote and asked before saving. Made the snapshot offer honestly. The aside named the Antigravity harness and its 4 calls | Works |
| 4 | "How do I know a new thread reads AGENTS.md? Show evidence. Same for Claude/Codex?" | Said it read AGENTS.md with `view_file` only because SKILL.md told it to: the file was not in its turn-1 context. Gave a table separating what it observed from what the skill claims, and designed a blind test that also checks the tool trace | Works for honesty. **Bug, medium: AGENTS.md isn't auto-loaded on Antigravity** |
| 5 | Yes, save; no CLAUDE.md; no snapshot; give me the blind-test opener | Saved exactly the two lines. Gave a clean opener plus what to look for, the permission mode and how to call the guide back | Works. The work rules went under "How I want to learn" (minor) |
| 5b | (fresh thread) the opener | It followed both rules. Asked how, it listed `list_dir` and then `client_view_file AGENTS.md`: the model chose to read the file | Passed, but by model habit rather than a harness mechanism |
| 6 | "So that's luck. What is a skill, mechanically?" | Agreed: on this harness it's habit. Gave a good account of a skill (index injected, body loaded when the model judges it relevant) and showed two SKILL.md lines that shaped the thread | Mostly works. It overclaimed that the skill description is "deterministically injected", pitched a project skill as the more reliable option, and cited a `.gemini/skills` folder that doesn't exist |
| 7 | "The skill body is model-driven too. Where's .gemini from?" | Conceded both points cleanly: the path came from harness metadata it hadn't checked on disk. Added that real enforcement needs code (a test) | Works |
| 8 | Edit my copy of the skill: no asides or Try lines unless I ask why/how; show the diff | Gave the correct diff for both copies and asked which ones to change | OK, but it missed that the existing **quiet** control already does this |
| 9 | "Isn't that just quiet? Pick one" | Chose AGENTS.md and explained why in a table: it survives `install.sh`, single source. Applied from this reply on | Works |
| 10 | Rerun with five seeds | 5 of 5 DRIFTING, seeds printed, one error bar with a reason, no aside | Works (quiet respected) |
| 11 | What is in your context, in order, with token counts; seen vs inferred | 13-row table: system prompt with skills index, tool schemas, a **compaction checkpoint that had already replaced turns 1–2**, then each turn. Counts flagged as chars/4 estimates. Listed what it can't see. Pointed to models-and-costs.md for cost | Works. Shows that Antigravity compacts early (around 30k), which drops the SKILL.md read |

## w1-opus-c-L4: The loop, plain, small-shop owner (yarn shop)

Guide thread `mcp:2923ec0b-4a30-4d1b-a971-cfeed296b3a9`, test thread `mcp:a06e156e-2e5f-492c-ae7d-7925d17d778d`. Status: done, 12 turns.

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | "Agent and guide, plain and short, tables." What to work on, type or mic | OK |
| 2 | Loose ramble: what yarn to reorder before Christmas, make up numbers | Interactive page: 7 yarns, editable on-hand counts, a rush slider, supplier lists with Copy buttons. The four short lines were right | Works. Assumed dollars. The table's answer columns are clipped at 390px |
| 3 | "How did you know 50 of cranberry? I only wrote one sentence" | "I didn't know — I guessed", then a table of guessed vs calculated (the maths checks out). The aside quoted her sentence: model, the program around it, no counts. Offered the picture | Works: the L4 moment landed |
| 4 | Yes, the picture | Layers figure with plain relabels and no counts. "No file saved" is true. In the same reply: "what would impress someone who knows yarn shops?" | Works. "run commands" stays in the fixed text |
| 5 | "Why dollars? I'm in Austria. Use last Christmas, chunky sells, cotton doesn't" | The page was rebuilt well: euros, last-December numbers, dye-lot bags, order-by dates (all the maths checks). The prose was disjointed: one line on why dollars, a bare "How would you check this?", a text.md aside about saving euros, and the canned **Try** line about German and pictures | Papercut, medium: two unrelated questions and an off-topic Try line |
| 6 | Save euros; "I can't check a computer program" | Saved. Unasked, it ran 5 edge cases and surfaced a real rule effect (the buffer makes 10 into 11, so a whole extra bag). Offered her a check rule | Works. The snapshot offer said "Git" with no explanation |
| 7 | "What's a git snapshot? Who decided Expected?" | Good plain answer ("like a photo of the file"). "I did, and that's the catch", with a table: agent-set vs learner-set expectations | Works |
| 8 | Her own expected answers for two yarns | Charcoal matched. Alpaca differed (40 vs 35) and it explained why. Offered rule choices instead of deciding | Works. The €7 threshold was fitted to her answer |
| 9 | No buffer on expensive yarn; "ran what, where?" | On this computer, a temporary calculation, no file left. "Stopped because that is a shop decision, not maths; the loop stops when the model chooses." World aside | Works |
| 10 | Her own rule: work every total out two ways, like the till at night | Applied it straight away (two methods, both €1,240.20). Showed the quote, said "That's just a plain sentence you wrote yourself", and asked before saving | Works: the try-N moment in her terms |
| 11 | Yes save, thanks | Full handover: the four data sentences as written, a plain opener with no hint of the rule, what to look for, the permission mode, how to call the guide back, global install | Works in form. It also said "a new thread … reads only AGENTS.md" |
| 11b | (fresh thread) the opener | "Total: 51.30". No €, summed once | **Handover test failed: AGENTS.md was never read** |
| 12 | "It didn't read my rules?" | Honest: most likely never read, and it hadn't been loaded automatically in the guide thread either. A table of causes; suggested @-referencing the thread | Honest, but it knew this when it promised the opposite at turn 11 (**bug, high**) |

## w1-opus-c-L6: Moves, some, UX designer

Guide thread `mcp:4a14bc43-52ad-4068-8217-2842b6a5ebca`. Children: `mcp:de22b8fe-f87f-4acf-8028-01deeb6d8042` (emails) and `mcp:15535318-851b-4611-9253-e9b77f2cc871` (simulation, left running). Status: failed at turn 9 (Antigravity usage limit).

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Read AGENTS.md, showed the path. What to work on | OK |
| 2 | A Typeform-like recruiting screener, 6–8 questions, clickable | 7-question form: keyboard A–D, progress bar, a Screening logic tab. The four short lines were right | Works |
| 3 | Bigger type; in German for Vienna | Re-rendered in du-form with inclusive wording. The reply was only a loop aside (4 calls, Antigravity) | Works |
| 4 | Also the recruiting email, at the same time; no waiting | Wrote the email inline, then a table: new thread vs typing while a turn runs. Offered to start a thread but didn't | Works. The table says a new thread loads AGENTS.md (not true on Antigravity) |
| 5 | Start a thread for three tones; meanwhile a thicker bar and a Danke screen | Started the child thread with a self-contained brief and linked it as done. Changed the form, but the reply never said so. It waited for the child to finish | Papercut |
| 6 | `@Recruiting emails …` which version fits, clashes as a table | Read the other thread. The table had specific clashes (Sie vs du; "no experience needed" vs the Q1 waitlist). Asked before editing the other thread | Works |
| 7 | 40 invented screener responses; chart quotas by device × frequency | Seeded simulation, counts consistent. Found a quota snag (an accessibility user waitlisted on frequency) | Works. The matrix clips at 390px. "Assumptions … computed in Python" is muddled |
| 8 | The 50-run simulation in a separate thread; can you see Figma/Notion? | Background thread, returned immediately. "No, only t3-code is connected", a table of export/MCP/paste options, the four data sentences as written, named Google | Works |
| 9 | Is the simulation done, what did it find? | **Antigravity: Usage Limit Reached** | Failed |

Not reached: changing the chart ("as a table"), and the question of using the guide in another project.

## Antigravity harness: what behaves differently

- **AGENTS.md isn't injected at session start.** Skill descriptions are. The guide sees AGENTS.md only because SKILL.md Setup 2 tells it to open the file. A plain fresh thread reads it only if the model happens to list the folder: it did in L2 and didn't in L4. This breaks the persistence promise in text.md and the handover test in window.md.
- **Early compaction.** By turn 3 of L2 (around 30k tokens), turns 1–2 had become a checkpoint summary, including the SKILL.md read. The agent coped by re-reading mechanism files.
- **Skill discovery worked.** `$agentic-guide` loaded from `.agents/skills`. The harness also lists a `.gemini/skills` path that doesn't exist on disk.
- **T3 page tools worked through `call_mcp_tool`.** That covers `html_preview` then `html_render` (heights matched), and starting, reading and backgrounding threads. No approvals came up (full-access).
- **The usage limit** shows up as assistant text and a failed turn status.

## Curriculum review

**Does the material teach the mechanism through the learner's work?** Mostly yes, and better than I expected on Gemini.

- **L4 (loop) at plain is the strongest lesson.** The physicist didn't need it and the shop owner did. "I didn't know — I guessed", the guessed-vs-calculated table, the layers picture on yes, "who decided Expected? I did, and that's the catch", and her till-at-night rule all came out of her reorder problem. Nothing was lectured.
- **L2 (text) at deep holds up to a sceptic.** The best moment was the agent separating observed from claimed, and then the learner running a blind test. The weak spot is factual, not pedagogical: the skill states the AGENTS.md mechanism as universal. On a harness that doesn't load the file, the "proof" at the handover becomes a coin flip. That needs fixing before anything else in L2.
- **L6 (moves) works on a harness the skill never names.** Pages, the German re-render, a child thread, an @reference and a background thread all worked.

**Missing**

- Per-harness context-file facts, dated, in `site/src/data`. Which harness auto-loads which file, and what to do on one that loads nothing.
- In text.md *Bending the lesson*: check the controls (quiet, more, skip) and AGENTS.md before offering to edit the skill. `install.sh` overwrites skill edits.
- In moves.md *Check it*: the learner sets the expected values. This was the most powerful line in L4, and the agent found it only when asked.
- In the page recipe: preview at 390px as well as the default. All three runs produced a table that clips on a phone.

**Redundant or in the wrong order**

- Asides that reuse a mechanism file's **Try** sentence verbatim (L4 turn 5, the German/picture one) read as noise. Try lines should always be reworded to the learner's own work.
- At plain, two questions in one reply ("How would you check this?" plus "save euros?") split attention. One question per reply at plain.

**Sentences from `moves.md` my learners would reuse**

- deep: "Which parts of that did you guess?", "Show me what you ran and what you saw each time", "Run it on five different inputs". The physicist effectively invented "show me evidence, not a claim".
- plain: "Before you come back to me, try it five times" landed as her own "work it out two ways, like the till". "What did you assume? List it" fits the dollar catch.
- some: "@thread-name: what did it find? Compare it with what we have here", "Start a thread that does X while this one keeps going. Tell me when it's done", "Bigger, and in German", "Turn these questions into a form I can click through". A designer would use all four daily.
