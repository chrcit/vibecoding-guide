# Round 4 final live check · field biologist

2026-11-21 · T3 Code 0.1.9 · `--provider codex --model gpt-6.2-astra` · One eight-turn learner session with invented frog counts. [Learner session](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3A9fdd94df-ce6d-47e9-8945-9e7c78fd3fa2)

## Checks

| Check | Status | Turn and evidence |
| --- | --- | --- |
| At most 60 words after the page | Pass | T2 had **54 words** across four lines (26 + 15 + 10 + 3). The separate 16-word progress message came before the page. |
| Text after the page avoids repetition | Fail | T2’s 54 words included “I prioritized survey coverage.” The page already gave filling the survey gap as the reason to visit Fern first. The reply repeated neither the pond recommendation nor the counts. |
| No snapshot offer in Reply 2 | Pass | T2, 54 words. The final line was “Anything you’d change?” and there was no snapshot offer. |
| Snapshot offered on the first later reply that changes a file | Pass | T3, 84 words. The guide updated `frog-field-card.html` and then offered a Git snapshot of that card. It explained what restoring would cover and how files created later would be handled. I declined on T4. |
| Data answer keeps the optional-feature caveat | Pass | T7, 136 words. “Optional T3 features, such as phone notifications, are covered by T3’s own terms.” |
| Data answer avoids a blanket claim about T3’s servers | Fail | T7, 136 words. “It doesn’t send your prompts or files to T3’s own servers.” The sentence gave no scope for that claim. The separate terms caveat did not expressly qualify it. |
| Plain layers picture avoids “tool call” | Pass | T4, 16 words of final chat text. The attachment contained zero occurrences of “tool call” or “tool calls.” Its labels included “The program” and “Its actions,” and the Model row said “Writes a reply or asks the program to act.” |
| The learner gets a result from their own data on Reply 2 | Pass | T2, 54 words after the page. The inline card recommended Fern first to fill the missed Thursday visit, gave Alder as the choice if the goal was to hear frogs, and kept both observed zeros at Rush distinct from “Unvisited” at Fern. The printable file was present. |
| A one-sentence request changes the result | Pass | T3, 84 words. “Put the pond I should visit first right at the top of the card.” The saved card and revised inline page both opened with **Fern Pond**, followed by **Visit first next week**. |

Word counts use the final chat text, count visible link labels, and skip Markdown list markers and attachment content.

## Turn log

| Turn | Words | What happened |
| --- | ---: | --- |
| 1 | 54 | Invoked `$agentic-guide`. It asked for a small task in my own words and invited an invented example. |
| 2 | 54 | Gave two days of counts for three ponds and asked for a first stop and a card to keep. It saved the card and rendered **Frog listening card** at 456 px. |
| 3 | 84 | Asked for the first-stop pond at the top. It edited the file, rendered the updated card at 480 px, walked through the edit, and offered a layers picture and a snapshot. |
| 4 | 16 | Asked for the picture and declined the snapshot. It rendered **How your field-card edit happened** at 662 px, then asked how I wanted future explanations. |
| 5 | 80 | Asked for short words, one step at a time, and help comparing different visit lengths. It worked through a per-minute example and proposed a wording preference to save with approval. |
| 6 | 68 | Answered the example and kept the preference in this chat. It checked my answer and explained why both visits need the same counting method. |
| 7 | 136 | Asked where a real crew sheet would go before sharing anything. It described the file, OpenAI and the stored chat, mentioned optional T3 features, and offered to use made-up rows with the same columns. |
| 8 | 17 | Asked for a short reusable question. It gave one about comparing visits given what I counted and how long I listened. |

Verified the three inline pages from the lab’s saved HTML and tool records. Each used `html_preview` before `html_render` and matched the measured height. Skipped the fresh-thread test as requested. Removed the generated card and verified that the lab returned to its starting state with the original README and both matching skill installs. No skill or site edits or commits were made.

```json
[
  {
    "severity": "low",
    "area": "Reply 2 repetition",
    "text": "T2 passed the 60-word cap at 54 words, but 'I prioritized survey coverage' repeated the page’s reason for choosing Fern first.",
    "fix": "Keep the after-page line about what the agent wrote and what the tool did. Use the card instructions and count dots as examples, and leave the choice and its rationale on the page."
  },
  {
    "severity": "medium",
    "area": "Data handling",
    "text": "T7 included the optional-features caveat but still said 'It doesn’t send your prompts or files to T3’s own servers' without limiting that claim to the ordinary provider path.",
    "fix": "Revise the prescribed wording in mechanisms/world.md, which currently contains the same unqualified sentence. Scope the server claim to ordinary model requests and explain that enabled T3-operated features can transmit or process content under T3’s terms."
  }
]
```
