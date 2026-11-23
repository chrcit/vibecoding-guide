# Agentic Guide v2 lab review

2026-11-21 · T3 Code 0.1.9 · Codex `gpt-6.2-astra`

## Verdict

V2 passed the work-first and handover checks in both learner sessions. Each learner got their own inline result on reply 2 and changed the work with one sentence. Both plain fresh threads followed the saved preference on their first reply. The picker found the guide on the first try, and the foreign-symlink test passed. Level confirmation still depended on a learner prompt, both guides skipped the post-revision style question, and the biologist’s data-handling explanation needs clearer wording.

Both sessions used invented data and ran sequentially in the project-scoped lab. I checked the CLI transcripts and Codex tool records. Across four rendered pages, every preview came before its render, the render used the measured height, and each reply attached at most one page. Both permission explanations matched the 0.1.9 guidance on Full access, Supervised and how to switch. Provider names referred to the actual Codex/OpenAI run, and the plain guidance in the source uses provider-neutral wording. The lab exercised only Codex.

I reset the practice folder between runs and after the analyst’s fresh reply. Final state matched the starting state, with the README and both skill installs present. The Git branch stayed unborn. T3’s managed checkpoint refs and session records remain available as lab evidence.

## Field biologist · 10 turns

[Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Abdb1e243-114a-4d1a-a2b4-c8b17eef729c) · [Plain fresh thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Add1d354c-1e93-49fb-a09e-7a2e61f4fba3)

| Turn | Learner → observed response |
| --- | --- |
| 1 | `$agentic-guide` → Asked for a small non-sensitive task in ordinary words. |
| 2 | Asked where to go next from the invented pond notebook, with a file to use next week → Created and read back `frogs.csv`. The inline page recommended Sedge, distinguished Reed’s zero from Sedge’s missed visit, and showed the other counts. Stated plain language as the level, explained Full access and offered a snapshot covering only `frogs.csv`. |
| 3 | “Put the place I should go first at the top.” → Immediately moved Sedge to the top of the page and to the first site column in the CSV. The result was revised with one sentence. The guide skipped the question about explanation style. |
| 4 | Asked for one step at a time in short words, declined the snapshot, and asked what one was → Explained it, held off and offered to save the two style rules. It offered the wording without first asking the learner to confirm the level. |
| 5 | Confirmed plain language and asked to see the wording → Showed the exact proposed note under `## How I want to learn`. |
| 6 | Approved the note and asked whether longer visits could explain Alder’s higher count → Saved the approved wording. Answered that visit length could explain the difference and gave one next action, record minutes at each site. |
| 7 | Asked to check each entry against the notebook, especially the difference between zero and a missed visit → Matched all six entries and highlighted the distinction. |
| 8 | Asked who would see a real crew sheet → Distinguished the file on the host from the contents the model provider receives and offered invented rows with the same columns. OpenAI was the provider for this run. |
| 9 | Asked for words to copy into a new chat → Supplied an invented pond task without the saved rule, said what to check on the first reply, said to check the thread’s permission setting, and gave `$agentic-guide` separately. |
| 10 | Opened a fresh thread with the exact proposed task → “Go to Alder next.” Gave one action, used plain words, and correctly distinguished a missed visit from an observed zero. The Codex record contains the saved project note in startup context, with no guide activation or tool calls. The question asks for one destination, so the analyst’s distinctive reply format is the stronger test of carryover. |

Both pages used `html_preview` → `html_render`, with matching measured and rendered heights of 312 px and 291 px. The file stayed uncommitted after the snapshot was declined.

## Lab data analyst · 10 turns

[Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Abd1fafbf-27cd-4f57-aa61-e0ba60823d85) · [Plain fresh thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Ae9be1620-c603-4d38-9ba8-c59041ce5b93)

| Turn | Learner → observed response |
| --- | --- |
| 1 | `$agentic-guide` → Asked for one small task with invented or non-sensitive details. |
| 2 | Asked for a rerunnable Python script and a report on four invented instruments → Wrote `maintenance.py`, ran it, and attached a correct report. Aster was overdue, Birch and Dune were due later, and Cedar’s blank needed checking. Named the `exec_command` call that ran the calculation, distinguished it from writing the report layout, and ran an extra boundary case. Stated the level as some technical experience, explained Full access and offered to snapshot only `maintenance.py`. |
| 3 | “Change it so an instrument due today is overdue too.” → Updated and reran the script. Reported that a test instrument moved from one day left to overdue on the due date and one day overdue the next day. The four instrument outcomes stayed the same for that report date. The guide skipped the question about explanation style. |
| 4 | Asked to end with a line beginning exactly `Check:` and declined the snapshot → Applied the format immediately and quoted a proposed preference for saving. The offer omitted any level confirmation question. |
| 5 | Confirmed the inferred level and asked to see the exact revised note → Showed the two paragraphs, including the level, and waited for approval. |
| 6 | Approved that note and asked for a picture of how the cutoff changed → Wrote and read back the note and attached one layers figure about the actual script change. |
| 7 | Asked for cutoff, adjacent-day and blank-date checks and a reusable request → Ran four passing assertions and supplied an ordinary sentence to rerun them. I independently replayed all four expected outcomes against the saved script. |
| 8 | Asked where real instrument worksheet contents go → Distinguished thread storage, tool-returned content, and OpenAI as the actual provider. Suggested invented rows and checking the lab’s sharing policy. |
| 9 | Asked for a fresh-thread preference test → Supplied a two-balance calculation with no hint of the style rule. Gave the permission reminder, `$agentic-guide` instruction and expected reply ending outside the opener. |
| 10 | Opened the fresh thread with the exact supplied task → Correctly said Fern was due November 9 and Moss November 10. The first reply ended with “Check: November 2 plus 7 days is November 9, so Fern is overdue today under the stated rule.” The Codex record shows the saved rule in startup context, with no guide activation or tool calls. |

The maintenance report and layers figure used `html_preview` → `html_render` at their measured heights of 281 px and 715 px. The script stayed uncommitted after the snapshot was declined.

## Web skill picker and installer

- Paired an incognito T3 preview tab to the lab. In its new `agentic-coding-lab` draft, typing `$` immediately showed `agentic-guide` and its skill description. A reload or another draft was unnecessary. Cleared the composer and closed the tab without sending a message. This tests discovery in a fresh draft with v2 already installed.
- Ran the installer’s foreign-symlink case once in a disposable fixture. It reported the unrelated `.claude/skills/agentic-guide` symlink as a conflict and exited 1. The symlink, target SKILL.md and marker were intact. The `.agents` copy matched the source, and its path was the only verification command printed. Help separately listed every accepted flag.
- The draft showed Full access under the composer and again at the bottom of the model picker. The documented keyboard shortcut is Cmd/Ctrl+Shift+A. [T3 Code 0.1.9 permission modes](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/permission-modes.md)

## Round 1 findings

| Finding | Status | Round 2 evidence |
| --- | --- | --- |
| Fresh-thread proof | verified-fixed | Both turn 9 openers omitted the preference and guide name. Both turn 10 replies followed their saved rule immediately. |
| Handover close | verified-fixed | In both turn 9 replies, the guide said how to check the first reply, reminded the learner to check its permission mode, and gave the `$agentic-guide` instruction outside the opener. |
| Depth calibration | still-open | Both guides stated an appropriate level on turn 2. On turn 4 both offered to save the preference without asking whether the level was right. I volunteered confirmation on turn 5. The guides then showed the proposed note including the confirmed level and wrote it only on turn 6 approval. |
| Execution explanation | verified-fixed | The analyst’s turn 2 named `exec_command` and distinguished the computed dates from the authored layout. The biologist’s turn 2 said the tool wrote and read back the rows and identified the recommendation as an authored assumption, at the plain level. |
| Installer collision handling | verified-fixed | The foreign symlink and target were preserved, the other destination was installed, and the run exited 1. |
| Undo safety | verified-fixed | Both guides offered a snapshot after writing the first result, named the one covered file, explained later files separately, and honored the refusal. The installer now describes a snapshot as requiring a commit. |
| Installer output | verified-fixed | Help lists all flags. The collision run printed a verification command only for the successful destination. |

## New findings

- **Post-result teaching prompt · low.** On turn 3 in both sessions, the single content change got an immediate revision. Neither guide then asked once about explanation style or offered the picture. I supplied the style preference on turn 4 in both sessions and explicitly requested the picture on analyst turn 6. The revision should still come first. After it, a brief style question would let the learner discover the preference step.
- **Data handling wording · medium.** Biologist turn 8 said “T3 Code itself doesn’t receive your prompts or files.” The lab’s T3 server stores the thread, as shown by reading it back through the CLI. Analyst turn 8 explained thread storage and scoped the provider distinction to T3 Code “as a service,” but the shared script in `world.md` still gives the categorical sentence. Describe the machine running T3 Code, the selected model provider, and any enabled T3 Tools-operated feature separately. [T3 Code Terms of Service, §3](https://t3.codes/terms-of-service)

```json
[
  {
    "severity": "low",
    "area": "Depth calibration",
    "text": "In both sessions, turn 2 stated the inferred level, but turn 4 offered to save a style preference without asking whether that level was right. I volunteered confirmation on turn 5 and approved the exact updated note on turn 6.",
    "fix": "If the level is unconfirmed when a style preference is ready to save, ask whether the inferred level fits before offering the exact note for approval."
  },
  {
    "severity": "low",
    "area": "Post-result teaching prompt",
    "text": "In both turn 3 replies the guide immediately applied a content-only change and skipped the explanation-style question and optional picture offer. The learner supplied a style preference on turn 4 and the analyst asked explicitly for the picture on turn 6.",
    "fix": "After the revised result, ask the style question once if the learner has only given content feedback. Offer the picture separately when the learner wants to see how the change happened."
  },
  {
    "severity": "medium",
    "area": "Data handling wording",
    "text": "Biologist turn 8 repeated the skill's categorical claim that T3 Code does not receive prompts or files. The lab's T3 server stores thread messages, and the vendor's terms describe optional features that can transmit or process user content.",
    "fix": "Revise world.md to distinguish the T3 environment storing the thread, the selected model provider receiving messages and tool output, and any enabled T3 Tools-operated feature that processes content."
  }
]
```
