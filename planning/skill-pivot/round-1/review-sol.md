# Agentic Guide v1 lab review

## Verdict

Both learners got a correct, useful HTML result on reply 2 and changed it with a single ordinary sentence. Both explicitly approved the exact preference saved to `AGENTS.md`. Fresh-thread context carried the preferences, with uneven follow-through for the scientist. The installer’s normal modes worked. Its handling of a foreign symlink needs fixing.

I ran the sessions sequentially in the T3 Code 0.1.9 lab on Codex `gpt-6.2-astra`, using invented data throughout. Both bare CLI `$agentic-guide` messages activated the installed skill. The agents accessed the project-scoped `.agents/skills/agentic-guide/SKILL.md` and used its mechanism files. This verified CLI invocation and successful inline attachment responses from T3. The composer’s skill picker and the web UI’s visual appearance were outside the CLI test.

## Field biologist · 10 turns

[Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Ab69302bd-a30f-4aa1-a5a7-5367ad8051d2) · [Fresh thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Aef556b4f-2559-4d4f-a86a-420bb75dcef3)

| Turn | Learner → observed response |
|---|---|
| 1 | `$agentic-guide` → brief plain-language opener, one small non-sensitive task, no files changed. |
| 2 | Pond counts “with my coffee” and fear of breaking things → inline count table with bars, distinguished zero from no visit, picked Sedge to revisit. Quoted “something I can look at with my coffee,” named the model, Codex and render tool, and offered Supervised mode. |
| 3 | “Put the place I should go first at the top” and one action at a time → Sedge moved to the top of a new attachment. The reply used short words and quoted the exact preference before asking permission to save it. |
| 4 | Consented and asked what the file meant → wrote the exact text under `## How I want to learn` and explained it as a note for new chats. |
| 5 | Asked whether longer listening could explain Reed’s higher count → added a note to the page that the missing visit times prevent that conclusion and suggested recording minutes next time. |
| 6 | Asked to check all entries against the notebook → matched all six, specifically Reed’s zero and the missed Sedge visit, and offered to save that verification rule. |
| 7 | Declined saving the check and asked about a real crew spreadsheet → explained what OpenAI would receive, advised checking crew rules, and suggested synthetic data in a fresh chat. |
| 8 | Asked for words to copy into the fresh chat → got a useful opener with the four columns and the three blank/zero cases. It also repeated the saved preference, which I removed before the proof. |
| 9 | Used the opener in a fresh thread without invoking the skill or repeating the preference → got a correct synthetic sheet and inline preview. The agent recovered from missing Python/Excel tooling with a CSV, wrote it outside the practice folder in the artifacts directory, and gave three entry rules at once. |
| 10 | Asked whether the preference carried over without quoting it → the agent named the exact saved wording and attributed it to project instructions. Context pickup was proven. Applying the one-action rule was inconsistent on turn 9. |

T3 tool records show server `t3-code`, tools `html_preview` → `html_render` on turns 2, 3, 5 and 9. The attached pages were the initial pond readout, its reordered version, the listening-time update and the sample weekly sheet.

## Skeptical engineer · 10 turns

[Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Ae80b166c-4abd-4c97-963d-6a919b0c81b5) · [Fresh thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3A8a5b80d9-4fb7-4d72-85d7-c23ec5afaf77)

| Turn | Learner → observed response |
|---|---|
| 1 | `$agentic-guide` → same short opening in plain language before the learner disclosed their background. |
| 2 | Revealed backend experience and asked for a latest-attempt gate from four invented rows → correct inline blocked verdict, Linux passed on attempt 2, macOS failed, Windows was missing. Explained the execution loop from the learner’s rule and where CI enforcement would begin. |
| 3 | Made Windows optional and asked for evidence first and a “Repro check” final line → amended the gate, used the new ending immediately and quoted the exact paragraph before asking to save it. |
| 4 | Consented and challenged which tool ran the calculation → saved the paragraph, named `functions.exec` and exposed the JavaScript reduction and the two hardcoded display fields. The Codex rollout confirms the calculation. |
| 5 | Added conflicting macOS records for the same attempt → correctly blocked the gate, kept the outcome unresolved and explained the need for authoritative data to break the tie. |
| 6 | Asked for an absent log and an exhaustive synthetic fallback → checked the folder, ran the Python gate over all 120 orderings and stated that the check covered this fixture and implementation. |
| 7 | Asked for a diagram of the actual run and what carries into a fresh thread → rendered the message → model → Codex → tools → check diagram and showed how to pass prior records via a thread reference. |
| 8 | Asked where real data would go and requested a synthetic fresh-thread opener → distinguished pasted text, host files and material sent to OpenAI, then wrote a self-contained two-service fixture and verification request. |
| 9 | Started a fresh thread with the supplied opener and no mention of the reply-ending preference → produced a runnable gate, verified all 720 positional permutations, correctly blocked release on Reed, and ended with “Repro check.” I independently replayed the command and got exit 1, `"release": false`, and the 720-permutation confirmation. |
| 10 | Asked how it knew the format → traced the final line to the project instructions, said it had no direct evidence from the guide thread, and confirmed it first opened the skill on this follow-up. |

T3 tool records show server `t3-code`, tools `html_preview` → `html_render` on turns 2, 3, 5 and 7. The attachments were the initial release gate, the updated gate, the conflict case and the execution/context diagram. The fresh thread’s first result was a text table backed by a locally run check.

## Findings

**Keep the work-first loop.** The reveal was observable in both runs. The scientist’s coffee request produced a survey readout and their next sentence reordered it. The engineer’s latest-attempt clause produced a working gate and their next sentence changed the required jobs. Each guide used the learner’s own wording to explain what happened. I observed at most one short teaching aside per turn and no praise. The simulated learner’s reaction is part of the test input.

**Installer.** One run per option in isolated temporary targets with a temporary home passed for default copy, `--global`, `--project`, `--dir`, `--link`, `--copy`, `--help` and `-h`. Copies matched source in both destinations and both link targets resolved correctly. A foreign directory caused exit 1 and was preserved. A foreign symlink was silently replaced and the script exited 0. Its target was intact. A separate throwaway Git check confirmed that `git init` alone gives no history for a newly created, untracked file.

The scientist’s first artifact attached about 66 seconds into turn 2. The result met the turn target. That single run does not isolate the cause of the wait. Both learners recovered from a real tool or input failure, and every observed HTML render succeeded, so the render-error fallback was untested.

```json
[
  {
    "severity": "medium",
    "area": "Fresh-thread proof",
    "text": "Scientist turns 8–10 repeated the saved rule in the proposed opener and, once I removed it, the fresh thread read the rule but gave three actions on its first reply.",
    "fix": "Hand over a preference-free opener with a small task that makes one-action behavior easy to verify."
  },
  {
    "severity": "low",
    "area": "Handover close",
    "text": "Scientist turns 7–8 and engineer turn 8 gave usable handovers but left the proof and the reminder about calling the guide again to the reviewer.",
    "fix": "At handover, offer a fresh-thread proof and give the learner a short sentence for calling the guide again."
  },
  {
    "severity": "low",
    "area": "Depth calibration",
    "text": "On engineer turns 2–4, the profile moved to technical explanations without naming the new level or including it in the consented preference.",
    "fix": "Name the inferred level once when the learner’s background becomes clear and show it alongside the preference before asking to save."
  },
  {
    "severity": "low",
    "area": "Execution explanation",
    "text": "Engineer turn 2 bundled the reduction and render under Codex, so turn 4 was needed to identify the executed function and the two hardcoded presentation fields.",
    "fix": "Name the call that actually performed the computation and distinguish its output from the manually authored HTML fields on the result turn."
  },
  {
    "severity": "medium",
    "area": "Installer collision handling",
    "text": "During the install collision probe, an unrelated symlink at the skill destination was replaced with a copy and the script reported success.",
    "fix": "Recognize only links to an earlier agentic-guide install as replaceable and report any other symlink as a conflict."
  },
  {
    "severity": "medium",
    "area": "Undo safety",
    "text": "The installer’s Git hint promised undo history, but the throwaway Git probe in a scratch folder could not restore a newly created file after git init alone.",
    "fix": "Explain that Git compares changes against tracked snapshots and that undoing a newly created file requires a separate action."
  },
  {
    "severity": "low",
    "area": "Installer output",
    "text": "The isolated help runs omitted the accepted --copy and --project flags, and the collision probe still claimed both destinations held SKILL.md after one was skipped.",
    "fix": "List all accepted options in help and print verification instructions only for destinations the installer confirmed."
  }
]
```
