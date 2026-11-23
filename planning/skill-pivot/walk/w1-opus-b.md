# w1-opus-b (opus, pass 1)

Inner model for every learner thread: codex / gpt-6.2-astra. The Codex workspace ran out of credits during run 1 ("Your workspace is out of credits"). Run 1 failed at turn 4, and runs 2 and 3 failed on their first message. Every run was reported as `failed`, and I stopped as the brief says.

## w1-opus-b-L2: It's all text, deep, computational physicist

Thread `mcp:ec9696ae-39a6-4ad7-8ddf-50b5dcd1fca1`. Status: failed at turn 4 (out of credits).

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Three lines: what to get done today, type or use the mic, invented data is fine. It skipped the level question because AGENTS.md is seeded. | OK. The mic and invented-data lines are first-session leftovers (papercut). |
| 2 | Invented Ising Monte Carlo runs, mean acceptance against T for each L, flag anything odd, NumPy, honest units | Wrote `ising_summary.py` (18 runs, not "~20"), ran it, rendered an inline table page. The reply had four lines: the permission line, `exec_command` computed and I wrote the rule, the saved level is deep, "Anything you'd change?" | Format works. The page labels columns "L = 32 sites", which is wrong: L is the linear size (bug, low). It flagged only an outlier it had planted itself, not acceptance anomalies. |
| 3 | "L = 32 sites" is wrong; no mean without an SE, in this thread or any other | Fixed both. The new page shows 32 × 32 (1,024 sites), mean ± 1 SE with the formula and the degrees of freedom, and says outright that the SEs are identical because the invented offsets are identical. It then proposed writing the rule to the user-level `~/.codex/AGENTS.md` and asked first. | Page works. Proposing a write outside the project goes against SKILL.md *Never* and the *Persistence* section in text.md. On this machine that file already exists and holds the owner's real rules (bug, medium). |
| 4 | "Don't save yet. Home file vs the folder AGENTS.md, which wins, does Claude see either?" | Failed: workspace out of credits. | The core L2 question went untested. |

## w1-opus-b-L4: The loop, plain, small-shop owner

Thread `mcp:ea48cdc2-b6cc-4bce-bf07-38cacaf053bf`. Status: failed on the first message (out of credits). No turns.

## w1-opus-b-L6: Moves, some, UX designer

Thread `mcp:e48e349f-9b3f-45ff-96af-3fb8736ed8dd`. Status: failed on the first message (out of credits). No turns.

## Findings (all reported to the inbox)

- **bug, medium** (`mechanisms/text.md`). "In any other thread" led to a proposed write to `~/.codex/AGENTS.md`, outside the project. That file already exists on this machine, and only Codex reads it. Fix: default to the project `AGENTS.md`. For "everywhere", name both user-level files (`~/.codex/AGENTS.md`, `~/.claude/CLAUDE.md`), show their current content and the diff, and write only on an explicit yes.
- **bug, low** (page content). "L = 32 sites" for a linear size. A deep learner catches it, and Check it covers it.
- **papercut, low** (`SKILL.md`, Setup 2). A returning learner still gets the first-session mic and invented-data opener.
- **works** (`SKILL.md`, reply 2 and pages). The four-line reply, the page built on theme variables, computed vs written, and the honest SE caveat.

## Curriculum review

Only two real turns ran, so this section is thin.

- **Mechanism through the learner's work.** The L2 moment came up naturally: the learner wanted different behaviour, and the agent offered a quote block before saving. That is the shape text.md intends. A cross-project scope ("any other thread") is a gap, though. text.md only covers the project `AGENTS.md`, and the model filled the gap with a global file the skill otherwise forbids touching. The deep level description already explains which context file wins. *Persistence* should use that explanation when the learner asks for cross-project scope, before any write is offered.
- **Missing.** A sentence on user-level context files and their scope (per harness, per machine), and on the risk of overwriting rules the user already keeps there.
- **Sentences a deep learner would reuse from `moves.md`.** "Which parts of that did you guess?", "Run it on five different inputs, including one that should break it." and "Show me what you ran and what you saw each time" (from loop.md). The data run here begs for "try it five times" with different seeds.
- L4 and L6 were not reached.
