# Fix pass 2: report

Done 2026-11-21, against [fix-pass-2.md](fix-pass-2.md). Nothing committed. No new files in the skill, no renames, no walkthroughs run.

**SKILL.md:** 1,482 words before, 1,530 after (+48, at the budget). The added words are paid for by these cuts: the second "one inline page" rule in *Asides* (*The first session* and the recipe already say it), "Don't restate the page in prose" in *Inline pages* (reply 2 and recipe step 6 already say it), "for the first session" in Setup 3, and shorter wording in Setup 1.

Other files after the pass (words): `loop.md` 755 (was 724), `text.md` 1,030 (941), `window.md` 1,033 (951), `world.md` 1,027 (985), `moves.md` 1,139 (1,112).

## Per fix

| # | File | Change |
| --- | --- | --- |
| G1 | `SKILL.md` Setup 2 | Replaces the general "checkpoints don't apply" with concrete negatives: "Returning session: don't announce the level; of reply 2's lines, write only the permission line, once. Asides and **Try:** still apply." |
| G1 | `SKILL.md` reply 2 | The same negative where the model writes reply 2: "write only four lines (returning session: the permission line only, once)". |
| G1 | `SKILL.md` *Level* | "Say the level once, at reply 2 of a first session"; plus "Say truthfully where it came from (their writing or `AGENTS.md`)." |
| G1 | `mechanisms/text.md` *Questions to expect* | New first item: *Why do you do that? How do you know my level?* If the reason is a file, name it ("It's in a note in this folder, `AGENTS.md`; I read it at the start"); this is the lesson moment, never hide it. |
| G2 | `mechanisms/window.md` *Handover* 1 | Openers ask only for output that stays on the machine (an answer in the thread, or a file in the project), never "a page" or "a link"; never invite real or personal data; carry no one else's personal or health details. |
| G2 | `mechanisms/window.md` *Handover* 3 | One line to say: "If a reply offers to publish or share something, that sends it off this computer; say no unless you mean it." |
| G2 | `mechanisms/window.md` *The fresh-thread move* | Any opener written there follows *Handover* 1 (output stays on the machine, no real or personal data). |
| G2 | `mechanisms/world.md` intro, *Side effects* | "anything sent off the machine (a push, a published page or a link, an email)". |
| G3 | `SKILL.md` *Never* | "…temp and probe files included, even if your harness offers a scratchpad, temp folder or its own memory". |
| G3 | `mechanisms/text.md` *Persistence* | After item 4: some harnesses keep their own memory (such as Claude Code's auto-memory); don't save there; rules go in `AGENTS.md`, shown first and written only on yes. |
| G3 | `mechanisms/text.md` **deep** | Harness memory is a second channel: a rule saved there would also reach the fresh thread and confound the `AGENTS.md` test. |
| G4 | `mechanisms/world.md` *Where data goes* | "Never say nothing left the machine: every turn sends the conversation and what you read to the company that runs the model." |
| G5 | `moves.md` recipe step 1 | "Values and quoted output come from the tool output, copied, never retyped or trimmed." |
| G5 | `mechanisms/loop.md` *When it lands* | After the computed-vs-written bullet: the same holds for the reply text; a claim about what untested code would output is written by hand, so run it on the invented data or don't state the result. |
| G6 | `mechanisms/world.md` *Snapshots* | On a missing Git identity: ask which name and email to use; don't pick an author yourself, not even one from the history; then set it for this folder only. |
| G7 | `SKILL.md` *Asides* | "A direct question beats any trigger: answer each in that reply, before any aside." |
| G7 | `SKILL.md` *Inline pages*, **Adapting** | "change only the page and render again". See the note below on where this went. |
| G8 | `SKILL.md` *Asides* | The at-plain clause now reads "one question and one mechanism per reply; if two are due, the one they act on first goes now." |
| G9 | `moves.md` recipe step 4 | "Preview again after every later change too, before rendering; never guess the height." |

## Notes

- **G7 placement.** The spec puts the language clause in "`moves.md` *Adapting*", but `moves.md` has no *Adapting*; the **Adapting** rule lives in `SKILL.md` *Inline pages*. I put the clause there ("change only the page") so it sits next to the rule it qualifies, at a cost of two words.
- **G1** now says the negative in three places the model reads at the moment it matters (Setup 2, the reply-2 line, *Level*). That is deliberate duplication, given the single Setup sentence failed 6 of 6 times. Worth re-checking on Sonnet in the next walk.
- The phrase "I read it at the start" in text.md is true for harnesses that load `AGENTS.md` (Codex, Claude Code). For Antigravity the existing *Persistence* 3 / **deep** caveats still apply; I didn't add a qualifier there to keep the edit small.
