# Round 3: bug fixes only

From here on the implementation stays stable: no new features, no redesigns, no renames, no new files except where a bug needs one. Sources: [round-2/review-neon.md](../round-2/review-neon.md) and [round-2/review-sol.md](../round-2/review-sol.md).

## Fix

| # | Bug | Where | Fix |
| --- | --- | --- | --- |
| 1 | Reply 2 ends with no question, so the learner stalls. Reply 3 then walks "this turn" when the learner may have asked for a change instead. | SKILL.md (first-session replies 2–3), mechanisms/loop.md | Reply 2 ends with one short question. Reply 3 names what happened in whatever turn just ran, including a revision. |
| 2 | After a content-only change, the guide skips the question about explanation style. | SKILL.md (reply 3) | After the revised result, ask the style question once if no style preference has come up yet. |
| 3 | The level is saved without the learner confirming it. | SKILL.md (level, consent) | If the level is unconfirmed when a preference is ready to save, ask in the same breath. |
| 4 | The step 8 closing line contradicts its own plain-test handover. | SKILL.md step 8 | One closing that matches the handover. |
| 5 | Reply 2 grows to about 130 words: the permissions explanation, the computed/written line and the level line. | SKILL.md, mechanisms/world.md | The permission note moves to the first moment files are about to change, or is cut to one line with the how-to. Reply 2 respects the aside limit. |
| 6 | Plain level leaks "Harness" and "Tools", and counts tool calls. | figures/layers.html, mechanisms/loop.md | Plain-level labels in the figure, translated like the rest of its visible text. No counts at the plain level. |
| 7 | The data-handling claim is categorical: "T3 Code does not receive prompts or files". | mechanisms/world.md, and /start/ if it says the same | Separate three things. Files live on the machine running the agent. The provider receives what the agent sends. T3 stores threads on the machine running its server, and optional features are covered by T3's own terms. Verify against the T3 FAQ at v0.1.9. |
| 8 | The text says Claude Code reads CLAUDE.md, and leaves out that it reads AGENTS.md directly when there is no CLAUDE.md. | mechanisms/text.md | State it as `site/src/data/harnesses.ts` does. |
| 9 | The install prompt leaves its temp folder behind on "no", and only checks for SKILL.md. | site/src/lib/start.ts | Clean up on "no". Check the copied folder is complete (SKILL.md, mechanisms/, moves.md, figures/). |
| 10 | `install.sh` silently ignores `--dir` together with `--global`. | install.sh | Reject the combination with a clear message. |
| 11 | /start/ doesn't warn against buying API credits or a standalone CLI, and doesn't say to press Start on T3's Welcome page. | site/src/pages/start/index.astro | One line each. No new prices. |

## Not a bug here (owner)

- `skill.branch` is `main`. It works once merged. Pin a release tag before the page goes public. That is a launch step, not a code fix.

## Not doing

- Neon's remaining `install.sh` hardening beyond #10: replacing `cp -R` with an allowlist, and `--global --link` from inside an installed copy. These are low severity and would mean rewriting a tested script in the stable phase. Recorded as lessons instead.
