# Walkthrough report: w1-neon-b

- **Agent:** neon (pass 1)
- **Inner model:** `codex/gpt-6.2-astra`
- **Status:** Stopped — all 3 runs failed because the inner model's workspace is out of credits (`Your workspace is out of credits. Ask your workspace owner to refill in order to continue.`).
- **Findings reported:** 0 (`bug`: 0, `papercut`: 0, `curriculum`: 0, `works`: 0)

## Run 1: `w1-neon-b-L4` — L4 The loop (`deep`, data engineer)

- **Thread:** `mcp:9566fc01-5bd3-4516-9638-dd6e84130969`
- **Status:** `failed` (usage/credit limit on turn 2)

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Agent acknowledged `AGENTS.md` ("I'll use the agentic-guide skill and your saved preference for short, technical explanations.") and opened in 3 sentences asking what to work on today, skipping the first-session opener as instructed by Setup #2. | Ok (returning-learner setup worked) |
| 2 | `Generate 200 synthetic e-commerce order events as JSONL with some late-arriving duplicates and timezone offsets, deduplicate them keeping the latest update per order, and show daily revenue and duplicate rates by region.` | Agent emitted a short preamble ("I'll generate exactly 200 event records and use each order's local date for daily reporting.") and then the thread failed before completing: `Your workspace is out of credits. Ask your workspace owner to refill in order to continue.` | Failed (workspace out of credits) |

## Run 2: `w1-neon-b-L6` — L6 Moves: pages, parallel threads, referencing threads (`plain`, primary-school teacher)

- **Thread:** `mcp:1ea81884-cbff-4098-b1f9-88fa5b434e68`
- **Status:** `failed` (usage/credit limit on turn 1)

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Thread failed immediately with no assistant output: `Your workspace is out of credits. Ask your workspace owner to refill in order to continue.` | Failed (workspace out of credits) |

## Run 3: `w1-neon-b-L2` — L2 It's all text (`some`, marketing analyst with basic SQL)

- **Thread:** `mcp:b327fd82-4591-4ae4-b940-1ec784ee9451`
- **Status:** `failed` (usage/credit limit on turn 1)

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Thread failed immediately with no assistant output: `Your workspace is out of credits. Ask your workspace owner to refill in order to continue.` | Failed (workspace out of credits) |

## Curriculum review

None of the three assigned lessons (L4 at `deep`, L6 at `plain`, L2 at `some`) reached a completed work turn because `codex/gpt-6.2-astra` ran out of workspace credits mid-turn on `w1-neon-b-L4` turn 2 and rejected turn 1 on both subsequent runs. Because the walkthrough protocol requires evaluating the skill through actual learner transcripts and rendered inline pages, no live curriculum verdicts or findings were logged.

The only live behaviour observed before the limit hit was `w1-neon-b-L4` turn 1, where the returning-learner `AGENTS.md` check in `skills/agentic-guide/SKILL.md` worked as designed (the agent skipped the first-session intro and asked concisely what to work on today). Re-running this assignment once Codex workspace credits are refilled (or with a different inner provider/model) is needed to evaluate L4, L6, and L2.
