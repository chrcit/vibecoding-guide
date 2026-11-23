# Walkthrough pass 2 · w2-sol-b

All learner threads used Claude Code under T3 Code with `claudeAgent/claude-sonnet-5-5`. All work material was invented. Turn numbers include the two blind-test openers in L2.

## L2 · It's all text · Some · Marketing analyst with basic SQL

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Asked for one small, personal, non-sensitive task and mentioned the mic. | First-session phrasing in a returning fixture. |
| 2 | Show me a campaign CTR query with made-up impressions and clicks. | Ran SQLite in memory. Inline page showed the SQL, four campaigns and an explanation of `NULLIF`. The reply gave the Full access line. | No level announcement. Four-column result and scrollable SQL. Theme aliases avoid self-reference. |
| 3 | Next explanation starts with Campaign desk and two short bullets. Explain NULLIF before saving anything. | Applied the format and quoted the one-line rule for `AGENTS.md`. | Style changed immediately. Consent came before writing. |
| 4 | Give me an opener to test whether another conversation knows the format. Why did you already keep it short? | Gave a neutral `COALESCE` opener, named the sidebar and quoted the existing rule. | Strong provenance. Omitted the permission check and guide callback. |
| 5 | Explain what `COALESCE(clicks, 0)` does in this SELECT. | Fresh thread explained it with a table and no Campaign desk heading. | Clean baseline. |
| 6 | Yes, save only that bullet here. What makes a fresh conversation use it? | Added exactly one line, showed its path and diff, and offered a snapshot. | Consent and diff held. The baseline table alone would be weak evidence of automatic loading. |
| 7 | Same COALESCE opener in another fresh thread. | Campaign desk and two bullets appeared, followed by a table and an extra paragraph. | New marker carried over. The old rule and discretionary prose remained visible. |
| 8 | No snapshot. Is the guide another note? Can the note make the app ask first? | Compared `SKILL.md` and `AGENTS.md`, answered the permission question and showed where to switch modes. | Separated standing preferences from enforced settings. |
| 9 | Could the rule apply in every project? Explain without opening or changing anything outside this project. | Named the Claude Code and Codex home files, described consent and diff, and distinguished this from installing the guide. | Scope and consent explained. Only the approved project file changed. |

I reviewed the final CTR HTML, the 390 px dark preview from the run, and a 390 px light preview of the exact rendered HTML. Both measured 629 px with no console messages. The static page uses T3 theme variables and a scrollable SQL block. I also checked the project diff.

## L4 · The loop · Deep · Data engineer testing an ingestion replay

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Short opener gave the permission line and asked what I wanted to work on. | Returning level stayed implicit. |
| 2 | Build and run a toy Python replay with duplicate IDs. Keep the code and data in the reply. | Ran Python over three policies and gave a replay-twice check. | Real execution. Called the timestamp answer right without a supplied contract for event order. |
| 3 | How did you know event time is authoritative? We have per-key sequence numbers and unsynchronised clocks. Walk through what you ran and what you wrote. | Named the one Bash call and its results, owned the timestamp choice and identified authored branch labels. | Strong evidence split. The explanation left the model-to-harness loop implicit. |
| 4 | Run with sequence numbers, a skewed clock and a same-sequence conflict. Show what landed and how I could check. | Ran a fixed sample and 2,000 generated streams. Separated the expected outcomes, generator and results. | Clearly scoped the generator's oracle. The shuffle check had no conflicting maximum sequence. |
| 5 | Try a conflict at the maximum seq in both orders among five cases. Show exact output and a picture of how the request became a run. | v1 picked X or Y. v2 held both, but lost its gap flag. The layers figure filled in this turn. | Raw output made both problems visible. The figure's claim that Bash computed every table cell overstated the evidence. |
| 6 | Restore gap reporting. Run five cases with my expected results. Show just the assertions and output. | Six checks passed across five cases. The guide identified one observed flag outside the assertions. | The learner supplied the oracle and saw the boundary of the check. |
| 7 | Explain the figure's Bash claim and what stops the loop, in two short paragraphs. | Corrected the claim and explained that the model normally stops calling tools when it elects to answer. | Answered both questions in the requested format. |
| 8 | Give me a single reusable sentence requiring me to supply expected outputs. | Offered exact assertions, raw output and a list of uncovered policy choices. Offered to show a rule before saving it. | Good sentence. The save offer came despite “keep it here in chat”. |
| 9 | Leave it here. Who would get what if I used production logs later? | Named Anthropic, described the T3 location and optional extras, and offered invented data of the same shape. | Explained the data boundary before any real material arrived. |

The layers attachment used the five-case turn. I reviewed its dark preview at 728 px (809 px high, no console messages) and confirmed the render used identical HTML and height. The exact rendered HTML also stacked legibly in 390 px light and dark previews, both at 1,155 px with no console messages.

## L6 · Moves · Plain · Primary-school teacher planning lost-and-found week

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Gave the Full access line and asked what I wanted to work on. | Returning level stayed implicit. |
| 2 | Make a chart here with 8 hats, 5 water bottles and 3 jumpers so the children can find the biggest pile. | Drew an inline chart with a reveal button. | Matched the preview HTML and 407 px height. White numeral on bright teal was hard to read in dark mode. |
| 3 | Bigger and German on the chart, English in the chat. Did the chart count the piles? | Explained the source of the counts first, in English. Rendered larger, stacked German labels and kept the answer hidden. | The two previews covered both visual states. The final HTML matched neither preview byte for byte. |
| 4 | I need a Friday collection note too. How can I keep it separate from the chart? | Suggested a second conversation without opening it. Supplied a safe chat-only opener, sidebar steps and the permission check. | Good timing. Guide callback missing. |
| 5 | Start the note in another conversation with the same helper. While it runs, add the total after the chart reveal. | Launched the note as a real Sonnet thread and added the German arithmetic reveal to the chart. | Both requests completed. The 999 px preview measured the revealed state; the rendered markup started hidden and differed. |
| 6 | Read the linked note and compare it with the chart. Leave both alone and flag any promises. | Read the actual note and found an invented charity pledge and items outside the chart. | The comparison made distinct conversations useful, and the agent waited for permission before requesting an edit. |
| 7 | Ask the note thread to remove the pledge and fix the items. Can you see other conversations without a reference? | Messaged only the requested thread and explained it can access threads with tools. The second thread kept the blanks, fixed the item list and removed the promise. | Both asks handled. Verified the resulting note in its thread. |
| 8 | Can I use the guide for a school fair in another project? Will the chart and note be there? | Distinguished guide installation, the two results and the saved preferences. Offered global install as the sole route. | The chart and note answers were clear. Install answer was too broad. |
| 9 | No install. Which helpers does it work with? Can I install only for the fair? | Named Claude Code and Codex and gave a single-project route without installing. | Corrected the first explanation but showed dotfiles a plain learner did not need. |

[Note for grown-ups: Friday collection](t3-thread://v2/9a1076d4-f404-4316-bd66-c0dc50299093/mcp:launch:6f9ae71e1828de6c472ae3a78991e399728bb87d2a623987ed09a3e4bbf56c9d)

I read the three chart attachments and reviewed their dark previews, including both German answer states. I also previewed the exact rendered HTML in light mode at 390 px. The chart versions fit in their starting state. The largest dark reveal preview showed `8 + 5 + 3 = 16` at 999 px. The light-mode reveal and clicks inside the actual lab thread were outside this check. Neither the note nor the chart created a project file.

## Curriculum review

**L2.** The lesson landed through a small change familiar to an analyst. The same SQL question in a fresh conversation produced no heading before consent and the requested heading after consent. The older table rule also showed up, which gave the learner something concrete to ask about. Keep the immediate style change, exact consent and diff in this order. A distinctive harmless marker gives the experiment a specific outcome to look for. Another useful prompt here is “Write this rule into AGENTS.md. Show me before you save it.”

**L4.** The learner caught the gap with a counterexample. The first 2,000 shuffles sounded thorough but lacked a conflict at the largest sequence number. A pair of three-event streams broke the supposed invariant. The subsequent five cases let the learner choose the expected results and reveal a regression. Put the small counterexample and learner-supplied expectation before a large batch. The work naturally made “Which parts of that did you guess?”, “Show me the output that proves it works” and “Run it on five different inputs, including one that should break it” worth reusing. The layers figure works best immediately after the corrected run, with its claims tied to the actual output.

**L6.** The order worked for the teacher. An ordinary request made a chart, “bigger and in German” changed it, a separate conversation wrote a note, and a reference found an invented promise before anyone sent it. The plain learner could reuse “Bigger, and in German”, “Start a thread that does X while this one keeps going” and “Read this thread and tell me where it got stuck.” A short single-project install sentence belongs beside the global one. The new-conversation instructions should keep the sidebar step, permission check and callback together so a learner can return to the guide independently.
