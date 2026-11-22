# The build loop

How the skill and the getting-started page get built, 2026-11-21 on. The live dashboard reads `loop.json` and refreshes every 20 seconds (it is served from the owner's machine, tailnet only).

## Who does what

- **Opus 5.5 (Claude)** does the main work: planning, implementation, fixes.
- **Sol (GPT-6.2, Codex)** and **Neon (Gemini 4)** advise before each implementation and review and test after it. Their advice is weighed, not obeyed: each accepted or rejected point is recorded with a reason.
- **Fable 5.2** gives one independent take on the new direction (round 0 only).
- The lead thread (Opus) reconciles, keeps `loop.json` current and writes the round notes.

## Rounds

| Round | What may change | Steps |
| --- | --- | --- |
| 0 | Everything | Distil the mindset from the owner's 18 Nov session; rework the plan; Fable's take |
| 1 | Design and code | Sol + Neon advise on the plan → Opus builds v1 → Sol + Neon review and test |
| 2 | Design and code | Sol + Neon advise on the fixes → Opus revises → Sol + Neon review and test |
| 3+ | **Bug fixes only** | Review and test → Opus fixes bugs → lessons extracted into `reviews/` |

From round 3 the implementation stays stable: no new features, no redesigns, no renames. Anything bigger than a bug goes into `reviews/` as a lesson or a proposal for the owner.

## Testing

- `cd site && pnpm judge` (build + link check), with the default base path and `BASE_PATH=/agentic-coding-guide/`.
- The skill is installed project-scoped into the lab project (`~/Developer/agentic-coding-lab`) and run in the lab T3 Code (a separate server, tailnet only) as a learner would. Learner runs use Codex where possible, since the Claude weekly limit is the scarce budget.
- Reviewers report findings with severity (high / medium / low), area and a concrete reproduction.

## Budget

Usage is read from local logs: Claude from T3's provider event logs, Codex from its session files. The loop pauses when the Claude weekly window passes 95% and tells the owner.

## Outputs

- `round-<n>/`: advice, reviews and test reports per round.
- `reviews/`: lessons extracted from the stable state, one file per theme.
- No commits or pushes unless the owner asks. A patch snapshot is saved outside the repo at the end of each round.
