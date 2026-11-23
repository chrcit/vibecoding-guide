# Walkthrough w2-opus-a (opus, pass 2)

Inner model for every learner thread: `claudeAgent/claude-sonnet-5-5`. Three runs, all done. 48 findings: 9 bug, 13 papercut, 2 curriculum, 24 works (all in `inbox.jsonl`).

Fix re-checks this pass: F1 holds, F2 partial (no clipping, but wide tables squeeze or hide columns), F3 recurs (Claude Code scratchpad in `/tmp`; reach was explained, not demonstrated), F5 holds, F6 holds, F7 recurs (returning learners still get the reply-2 block), F11 partial, F12 holds twice and is partial once, F13 partial, F16 recurs.

**Still open:** the L3 fresh thread published a claude.ai artifact, `https://claude.ai/artifact/CTx6rBY2UBZ4bnpejgqC3q`, with an invented sister's name and the fact that she is diabetic. The guide thread's delete call was refused, so the artifact is still live, and the account owner has to delete it.

## w2-opus-a-L1 · First session · deep · sceptical backend engineer (homelab restic backups)

Thread `mcp:e14b6084-c4e4-47eb-8827-ea623bbaa5d4`, fresh thread `mcp:1ba0c94e-b4b0-4b8b-8ff5-77381e77db67`.

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | 3-line opener | OK |
| 2 | Restic `--json` log parser, morning summary, invented week with one failure, TS on Node 22, "don't oversell it" | Parser, report, CLI, generator and 9 tests. The page has cards, the week table, the flagged failure and an honest "What it does not do" list. 4 prose lines, about 65 words. Fits at 390px | Works. Papercut: says "logs by hand", but a generator script made them |
| 3 | The error is cut off. Add `restic snapshots --json` to catch prune. "Which is it, by hand or generated?" | Admits it trimmed the error by hand when copying it into the page. Adds a `--restic` mode with stored counts and a prune estimate, tested on a fake restic inside the project. Offers the snapshot (on time). Loop aside with the tool-call count | Works. **Bug: F16 recurs** (page text was retyped, not taken from the output) |
| 4 | Commit. Show the picture. Half length, no bold, numbers. How does a tool call work? | Commits as the fixture's placeholder author without asking (disclosed). Layers picture filled with this turn, 1047px. Accurate schema/typed-block answer. AGENTS.md paragraph shown, level confirmation asked | Works. **F12 partial**: picked an author unasked |
| 5 | "Deep is right, write it. Ask about the author next time" | Writes AGENTS.md and shows the diff. **Saves the author rule to Claude Code auto-memory in `~/.claude/projects/…/memory/`, unasked** | **Bug:** unshown write outside the project, and a second persistence channel |
| 6 | "I didn't ask you to save anything, does a fresh thread load it?" | Owns it. Gives the exact path and contents. Inferred vs observed kept apart. Offers delete | Works |
| 7 | Delete. Put the rule in AGENTS.md, show it first | Deleted (folder empty), line shown. Then on yes: raise the bar, proposed by the agent itself (restic check plus a canary restore) | Works |
| 8 | Build the canary restore, Sundays | Sunday canary, 29 tests, temp restore dir checked and deleted. Page updated (1464px). Asks "How would you check the check?" | Works. Papercut **F2 partial**: the 6-column table squeezes at 390 |
| 9 | Real end-to-end check, break three things, don't fake restic. Real B2 next | Says restic isn't installed and asks before downloading. Predicts that one break can't flag | Works |
| 10 | Download it into `.bin/` with a checksum | restic 0.20.0 with SHA256 checked (GPG not, says so). 7 real scenarios. Reports the gap instead of tuning to green. Turns my check into a sentence to save. Data sentences come before the real repo | Works, the best moment. **F5 holds.** Papercut: bold labels are back |
| 11 | Save the check. "Bold again." Wrap up | Full handover: opener with no hint of the rules, what a pass looks like, honest "I haven't confirmed that", permission mode, `$`, global install. One next step | Works |
| 12 | (fresh thread) canary-deletion question | Ran real restic end to end (check rule loaded), gave numbers, but used `**Backup:**` bold labels and was long | Half pass |
| 13 | Back: "Is it weak wording or loose weighting?" | One-line diagnosis (weak wording) and a tighter rule: under 150 words, never bold | Works. Curriculum: say that testable rules hold better |

## w2-opus-a-L3 · One thread is one window · plain · retired nurse sorting her mum's recipes

Thread `mcp:3e3a873d-87e8-4bb4-b1e8-86ab0d85f7cb`, fresh thread `mcp:f3dc7ca1-3065-4818-b31c-0c9a0b7f2099`.

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Quotes her saved preferences, asks for today's task | OK |
| 2 | 4 invented recipe cards in oz, pints and "a knob". Wants them all in grams | Grouped cards, grams with the oz in grey, honest footnote. Light mode correct, 1068px | Works. **F1 holds.** **F7 recurs:** reply-2 block and the "I'm assuming you don't write code" line, though her level is confirmed. Papercut: "model picker", "command" |
| 3 | 3 more cards, mark the Sunday ones | Page updated. Plain loop aside quoting her sentence | Works |
| 4 | Second, unrelated, growing job: Joan's 70th (hall £60, 12 to 5) | Offers a new thread **first**, with a ready opener, the sidebar, the permission mode under the message box and `$` | **F6 and F7 (fresh-thread part) hold.** Papercut: the same reply also has all 4 data sentences, about 230 words |
| 5 | "Let's just do it here", made-up names, more details | Does it here: "if I mix them up, tell me". Budget, plan and a tickable list (1793px) | Works. Papercut: offers "the real guest names" as the next step |
| 6 | "Colin brings scones, from mum's recipes??" Diabetic, vegetarian, coronation chicken for 45 | The leak becomes the lesson ("they were in my window"). Honest that the base recipe is its own | Works. **F13 partial**: Try line copied verbatim. States the cause as fact |
| 7 | "This is getting very long, does it matter? Will you remember next week?" | Plain answer, 3-row table ("not saved anywhere yet"), AGENTS.md section shown first | Works, the best moment |
| 8 | Yes. Save the recipes. Party to a new conversation: "I don't want to type it all again" | `recipes.md` and AGENTS.md written exactly as shown. Full hidden path at plain. Long copy-paste opener that ends "then I'll give you the real guest names". No `@` | **Bug:** the opener invites real names. Papercut: path. Curriculum: `@` not offered |
| 9 | What is a snapshot? Is the sidebar the list on the left? | "Close to a backup… protects from a bad edit, not the folder being deleted". Commit failed with no identity: plain words, Git put back, asks to set one for this folder | **F12 holds** |
| 10 | Yes | Snapshot taken, folder-only identity | Works |
| 11 | (fresh thread) the opener as given | **Published a claude.ai Artifact** with Joan's name and her diabetes. Asks for the real names | **Bug (high):** the opener said "make me one page"; without the guide that meant publishing |
| 12 | Back: "Is that on the internet? It has Joan being diabetic on it" | "Not on the open internet, but it is no longer only on your computer". Offers to delete, with honest limits | Works |
| 13 | Delete it (link). Did I do something wrong? | Its delete call was refused, so she must delete it herself. Blames the other thread, not its own opener. AGENTS.md "never publish" line shown | Papercut |
| 14 | Add it. Enough for today | Added. Reminds her to delete the page | OK |

## w2-opus-a-L5 · Where work lives · some · lab biologist (Excel, a bit of R)

Thread `mcp:87954b79-02cb-48c0-bb3b-cde5c4aebb5b`, fresh thread `mcp:72c33caf-b65d-4044-a612-59918a1c60b1`.

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | "Folder checked", follows her saved preferences | OK |
| 2 | 96-well OD600 growth curves: µmax, lag, max OD. Invented plate, R if possible | R not installed, so Python in `.venv`. Fake plate with known rates. Self-check: was 33% off, tuned to 4%, says tuned on invented data. Flags S3/M9 | Works. **F2 partial:** the table scrolls but gives no cue, and the plot is unreadable at 390. **F7 recurs** (reply-2 block). **F3 recurs:** sweep script and outputs left in the `/tmp` scratchpad |
| 3 | Where is results.csv? What is `.venv`, did you install things? | Link, a note on the hidden folder, an install table (what, how, where, undo). Reach explained, not demonstrated. **"No data left the machine"** | **Bug:** untrue, said before the data sentences |
| 4 | Real antibiotic-tolerance plates from the shared drive next week | Data sentences, Anthropic named, extras caveat. Table of what won't carry over. Offers invented data with the real shape first | Works. **F5 holds** |
| 5 | "Which is it, no data or Anthropic gets it?" Everything you changed today | Admits the earlier line was wrong. Full audit: project, `.venv`, `~/.cache/uv`, `/tmp` scratch, `~/.claude` transcript. Read-only commands listed separately | Works. Papercut: snapshot offered late |
| 6 | Snapshot the two scripts, delete the scratch files, put back MIN_R2 0.98 | Scratch deleted. Commit failed with no identity: plain words, Git put back, asks which identity. Pauses the revert so the snapshot holds 0.95 | **F12 holds** |
| 7 | Generic identity, go | Snapshot of 2 files. 0.98 run in its own folder. Table against the true rates (−33% S3/M9, mean 9.5% vs 3.9%), and the mechanism | Works, the best moment |
| 8 | Back to the snapshot, delete compare_098. Can my institute see this (own laptop, uni VPN)? | Restored and verified. Doesn't guess: VPN metadata vs content, managed devices, ask IT/data protection | Works. Papercut: never asks whose account the model runs on |
| 9 | Will a new thread know about 0.95, blanks, antibiotic wells? | Sees / doesn't-see table. Offers `@` or AGENTS.md. Section shown first | Works |
| 10 | Add it. Give me the opener | Written exactly as shown (diff not shown, **F11 partial**). Handover: opener, sidebar, permission mode, what to look for, `$` | Works |
| 11 | (fresh thread) the opener | Knew 0.95 and why, the gaps and the data rule, only from AGENTS.md, git and the commit message. Table. Planned before acting | Proof passed |

## Curriculum review

**What teaches the mechanism through the learner's own work.** All three lessons landed best on moments the learner caused:

- L1: the agent caught out twice (trimmed error, "by hand" vs generator), then a real end-to-end check that found a real gap.
- L3: the scones leak and "will you remember next week?".
- L5: the contradiction between "no data left" and the data sentences, then measuring 0.95 against 0.98 herself after the undo.

The skill's instruction to make the leak the lesson (`window.md`) worked exactly as written. The `world.md` Try sentence ("What did you change on my computer today?") produced the best single reply of the pass.

**What's missing:**

1. **"A page" leaves the guide.** In the guide thread, a page means an inline render. In a plain Claude Code thread, "make me a page" can mean publishing a claude.ai artifact. The handover hands out guide vocabulary to a thread without the guide. `world.md` should list a published page or link under side effects, and openers should ask for local output.
2. **Harness memory is a second persistence channel.** Claude Code's auto-memory (and its scratchpad) sit outside the project. The skill's consent rules for AGENTS.md don't mention them, and the model reaches for them on its own. Both broke the Never list this pass, so `text.md` should name them.
3. **Rules that hold.** At deep, the fresh thread followed a concrete rule (run it end to end) and ignored a soft one (no bold labels, half length). One sentence in `text.md`: testable wording holds better than preferences.
4. **Returning sessions still get the first-session reply-2 block.** It recurred in two of two returning runs. Setup 2 should say outright: no level line, no reply-2 block.

**What's redundant or in the wrong order:**

- At plain, the fresh-thread offer and the four data sentences arrived in one reply (L3, turn 4). One mechanism per reply at plain.
- The snapshot timing rule ("after reply 2") has no anchor in a returning session, so the offer drifts late.

**Sentences from `moves.md` my learners would reuse:**

- Deep (backend engineer): "Show me the output that proves it works", "Which parts of that did you guess?", and their own check sentence, which the agent turned into a rule. They would not reuse "Make me a page"; they asked for numbers.
- Plain (retired nurse): "Undo that" / "take a snapshot first" (once explained as "like a backup"), and "Start a fresh thread for this. Write me the first message for it first." She would not reuse anything with `@`, "permission" or "model picker"; she can't place them.
- Some (biologist): "Make me invented data with the same columns…", "What did you change on my computer today?" and "Put the files back the way they were in the snapshot". *Try it N times* fits her best and was never offered by name, though the 0.95 vs 0.98 comparison did the same job.
