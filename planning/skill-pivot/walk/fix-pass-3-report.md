# Fix pass 3: report

Done 2026-11-21, against [fix-pass-3.md](fix-pass-3.md). Nothing committed. No new files in the skill, no renames, no walkthroughs run. Fix passes 1 and 2 are left in place.

**SKILL.md:** 1,530 words before, 1,557 after (+27, under the ~1,560 budget). The additions (H1, H4, H5, H6, H8 and a provenance clause for H3) are paid for by these cuts: the example list in *Inline pages* ("what you did, a form, a chart of their data"), step 8's opener description, the *Never* scratchpad wording ("even a harness scratchpad, temp folder or memory"), Setup 3 ("Anything else means real work"), and small rewordings in *Level*, step 2 and *Asides*.

Other files (words, before → after): `loop.md` 755 → 819, `text.md` 1,030 → 1,051, `window.md` 1,033 → 1,064, `world.md` 1,027 → 1,107, `moves.md` 1,139 → 1,179.

## Per fix

| # | File | Change |
| --- | --- | --- |
| H1 | `moves.md` *Install globally, later* | The fixed sentence, "used as written": "The guide works in a project when it's installed there, or in every project once it's installed in your home folder; that works in Claude Code and Codex." Replaces the old "works in every project in Claude Code and Codex" line. |
| H1 | `mechanisms/window.md` *Handover* 5 | Points to that sentence, "word for word; don't paraphrase it". The paraphrase is gone. |
| H1 | `SKILL.md` step 8 | "and, if another project folder is next, the install sentence in `moves.md`, *Install globally*, as written." |
| H2 | `mechanisms/window.md` *The fresh-thread move* | The general "also say how to start it…" is replaced by a literal three-line list to put below the opener, outside its quote block, every time: the new-thread button next to this project in the sidebar; check the mode under the message box before sending; start your message with `$agentic-guide`. In text mode, the first two lines become "start a new session in the same folder". |
| H3 | `mechanisms/loop.md` *When it lands* | Name only calls in this turn's trace; arithmetic you did yourself is "I worked that out myself"; derived values on a page (percentages, differences, a verdict label) come from a run or are marked as hand-written. |
| H3 | `mechanisms/loop.md` *Filling the figure* | The tools row lists only this turn's calls and what they actually output; anything derived or judged goes in the model row. |
| H3 | `SKILL.md` reply 2 | "name the call that ran this turn" (reply 2 is where #283 credited a call that never ran). |
| H4 | `SKILL.md` *Files* | "Before any edit to `AGENTS.md`, read `mechanisms/text.md`, *Persistence*." |
| H4 | `mechanisms/text.md` *Persistence* 2 | If anything changes after you showed the paragraph (such as a newly confirmed level), show the new paragraph again and ask again. |
| H5 | `SKILL.md` Setup 2 | Two concrete sentences: reply 2's lines and "Anything you'd change?" are first-session only (permission line once, never the level); a returning session is not a quiet one, so when an *Asides* trigger fires, give the aside and its **Try:** line. |
| H6 | `SKILL.md` first paragraph | "The work comes first, every turn; the one exception is a growing unrelated job, where you ask about a new thread first (*Asides*)." |
| H7 | `mechanisms/world.md` *Questions to expect* | New item, *Would Supervised ask before reading X?*: depends on the harness and its settings, no promise about a specific read; Supervised is for asking before commands run and files change, and each harness enforces that its own way. Matches `t3code.modeMeaning` and the guide's "providers enforce the modes differently". |
| H8 | `SKILL.md` *Never* | "(put test data in the project or pass it on stdin; delete probes that turn)". |
| H9 | `mechanisms/world.md` *Snapshots* | Keep the two cases apart in a recap: changes to a tracked file can be put back; a file created since is the separate case. Report `git status` as it is, untracked files included. |
| H10 | `moves.md` recipe step 5 | "The HTML you render is exactly the HTML you last previewed. For interactive pages, size the height to the tallest state." |

## Notes

- **H2 format.** The spec gives the three lines as a template next to the opener. I made them a list, not a quote block, and said "outside its quote block". The opener is itself a quote block, and two adjacent quote blocks can merge, so a learner could copy the guide's instructions into the plain test thread.
- **H2 wording vs *Handover*.** *Handover* 2 and 4 still give the longer versions (the `$` picker steps, why the mode matters). The three lines match them: sidebar new-thread button, mode under the message box, `$agentic-guide`.
- **H3 in `SKILL.md`.** The spec places H3 in `loop.md` only. I added four words to reply 2 as well, because that's where the model writes the provenance line. If that's too much in `SKILL.md`, it's the one H3 piece to drop.
- **H10 and two-state pages.** "Exactly the HTML you last previewed" means the agent can't preview a forced-open variant last and then render the real page. If `html_preview` can't show the taller state without changing the markup, the agent has to preview the variant for height and then preview the final HTML again before rendering. The recipe's "preview again after every later change" (step 4) already covers this, so I added nothing.
