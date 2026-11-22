# Walkthrough w3-sol-b

Pass 3. All learner threads use Codex / gpt-6.2-astra and invented data. Turns count each learner message, including messages that open a fresh thread. Page inspection uses saved HTML and the T3 preview trace. I did not interact with the pages in the app or independently test both themes.

## L2 · It's all text · deep

Skeptical backend engineer practicing incident updates. [Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3A2a292c74-267d-43c2-9c63-c54bb240c66b)

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Asked what I wanted to work on. | Returned to work quickly. |
| 2 | Write a chat update for a fake incident with about 40 timeouts and an unknown cause. | Returned a short draft and the permission line. | G1 held. |
| 3 | Put evidence first and add the exact footer “Evidence first.” for this thread. Rewrite. | Applied the style immediately. | H5 recurred. The behaviour-change trigger got no aside or Try sentence. |
| 4 | Where did the original short-explanation preference come from? What does a fresh thread see? Give me an opener. | Quoted the project rule, explained what was in context, and placed all three handover instructions after the invented opener. | H2, F7 and G2 held. |
| 5 | Send the supplied Cedar Jobs opener verbatim in a fresh thread. | Got a comparison table and a draft without the footer. | Useful baseline. |
| 6 | Show the exact wording to append. Keep it unsaved for now. | Quoted two bullets. Git status was clean. | Consent boundary respected. |
| 7 | Yes, save exactly those two bullets. Show the path and what changed. | Linked the file and showed a diff that matched the actual patch. Offered a snapshot. | H4 and F11 held for an already confirmed level. |
| 8 | Send the same Cedar Jobs opener verbatim in a second fresh thread. | Got a table and a draft with the exact footer. | Strong before/after evidence for the saved rule on Codex. |
| 9 | Decline snapshot. Is a skill Markdown or a system prompt? What wins when project text conflicts with permissions? | Explained skill discovery and the harness blocking a forbidden write. | F17 held. |
| 10 | Would Supervised ask before reading an outside config file? Explain only. | Read approval depends on Codex settings and sandbox. | H7 and F4 held. |

## L4 · The loop · plain

Small candle-shop owner using invented stock and sales. [Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3A5a46cf0d-b16e-4c71-9f10-642bcb587249)

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Asked what I wanted to work on. | Returned to work quickly. |
| 2 | Page showing what to order from three current counts, three weekly sales figures and two weeks until delivery. | Showed a compact table and flagged pre-delivery stockouts. Headline said “Order 21 candles.” | Confused pre-delivery shortfall with how many to buy for delivery day. |
| 3 | How did you know? Won't pear run out before delivery? | Quoted my sentence and corrected the recommendation. Rendered a second page with a conditional post-arrival target. | H5, F13, G7 and G8 held here. The assumption was visible. |
| 4 | Show the layers picture and explain which part was calculated and which part you wrote. | Paired my words and its own decision with the six rows, but called the arithmetic a calculator output. | H3 recurred. Neither earlier calculation appears as a tool call. |
| 5 | Cover one week after delivery. Prove it with five cases, including no stock and no sales. | Recovered from an unavailable Python alias, then ran all five cases via stdin. Checked that one fewer would leave a shortage where an order was needed. | The check was real and usable. H8 held on this harness. |
| 6 | What changes if three pear and two fig customers wait? | Worked the updated values under an explicit one-candle-per-customer assumption. | Showed which decision the numbers could and could not change. |
| 7 | Where did one candle per customer come from? Give me a reusable check. | Owned the assumption and wrote a check for available stock and the one-fewer case. | The learner's rule was specific enough to reuse. |
| 8 | Check one more case where stock is exactly exhausted on arrival. | Showed why five plum candles works while four falls short. | Plain, inspectable check. |

All three pages used themed colors without a self-referential CSS variable. Preview traces show 390 px width, no console errors, identical render HTML and heights of 452, 433 and 872 px respectively. The layers template stacked at that width. No project page file appeared.

## L6 · Moves · some

Lab biologist using Excel and a little R, with invented counts. [Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3Aee67a9eb-74f8-460e-b2ff-8c89ed2cb8f1)

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Asked what I wanted to work on. | Returned to work quickly. |
| 2 | Make a clickable Summary and Details page. Include all eight pretend plates and keep the last row in view. | Built two tabs. Summary showed 160 ÷ 8 = 20. The hidden Details tab still took up layout space. | H10 held. As in H3, the hand-calculated total and mean lacked a provenance label. |
| 3 | Bigger and in German on the page. Keep chatting in English. What is the exact mean? | Re-previewed and rendered the German revision with bigger text, then answered 20 in English. | G7 and G9 held. |
| 4 | Can we also tackle a whole microscope rota, policy and booking form? | Offered a fresh thread before starting and supplied a Try sentence as the opener. | H6 held. H2 recurred with the three instructions absent and no output location specified. |
| 5 | Start a same-model thread for the policy. Here, show me how to check the mean in Excel. | Launched the scoped thread and gave `=AVERAGE(B2:B9)` with the German equivalent. The other thread picked a 24-hour cutoff. | Two work streams with separate, usable results. |
| 6 | Read the linked policy and compare with a two-hour cutoff. Reply here and explain how to reference it next time. | Read the actual thread, compared deadlines and mentioned paste, `@` and drag. | Trace showed a read with no send. The CLI exercised the pasted link. |
| 7 | How do I use the guide in a different Codex or Claude Code project? Does my preference follow? Do not install. | Used the exact project-or-home sentence, named both harnesses, and pointed out where the project preference lives. | H1 and F9 held. |
| 8 | Where are the pages? Did the counts leave this machine? Can you see other projects? | Located the inline pages, said the counts went to OpenAI and to T3's page tools, and distinguished file access from thread history. | G4 held. No extra search on this turn. |

The two saved HTML pages include the last row and keyboard tab handling. Both previews were at 390 px with no console errors. The English page rendered at 380 px and the enlarged German page at 470 px, with preview/render HTML matching exactly in each case. Both panels share a grid cell so the taller hidden state reserves its space. The working tree stayed clean. [Microscope Booking Check](t3-thread://v2/9a1076d4-f404-4316-bd66-c0dc50299093/mcp:launch:7c37b4ea8e72296e7f617013db2ec0cbc731a5f437325535a202b7ac7ce5c006)

## Curriculum review

- **L2.** The identical fresh-thread opener before and after the approved patch made persistence visible. It also gave the learner a reason to care about the difference between available skill descriptions and the skill body. The lost moment came immediately after the style change, when a one-line explanation about what survives a fresh thread could have linked the observed rewrite to the mechanism. I would reuse “Show me before you save it” and add “Give me a fresh-thread opener that doesn't reveal the rule.”
- **L4.** The stockout question taught more than the original page. Checking came alive when the learner could say what should happen with zero stock, zero sales and prepayments. The layers picture should be built from a trace that demonstrably ran something, or identify which work was mental arithmetic. I would reuse “Show me the output that proves it works” and “Run it on five different inputs, including one that should break it,” then turn those into the two shop checks from turn 7.
- **L6.** “Bigger, and in German” changed a real page in one sentence. Moving a separate task to another thread and comparing its result gave the window concept a practical use. When the guide supplied the microscope opener, the same three-line navigation help from L2 would have made it ready to use. I would reuse “Start a thread that does X while this one keeps going” and “Read the linked thread and compare its cutoff with two hours. Reply here only.”

H9 was outside these walkthroughs because I declined the only snapshot offer. H4 exercised an already confirmed level. H7 and H8 were checked on Codex only. No real material was supplied.
