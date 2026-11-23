# Round 3 verification · field biologist

2026-11-21 · T3 Code 0.1.9 · `--provider codex --model gpt-6.2-astra` · One learner session using invented frog counts. Turns 1–9 ran with the guide. Turn 10 was the plain fresh-thread test in the same lab folder.

| Bug # | Status | Turn and evidence |
| --- | --- | --- |
| 1 | verified | T2 ended with “Anything you'd change?” T3 moved Sedge to the first line, then quoted the learner’s request and described how that edit was made and checked. |
| 2 | verified | T3 asked “And how I explained it: shorter, another language, bigger text, a table?” after the content-only change. The question appeared once. |
| 3 | verified | T4 showed the style note and asked in the same reply for the learner to say if the guide should assume they did not write code. The learner confirmed in T5. The guide showed the updated note, then wrote it verbatim only after approval in T6. |
| 4 | verified | T9 closed by telling the learner to open a new chat from the sidebar in the same folder, send just the opener, and use the separate folder for real work after the test. T10 followed that handover. |
| 5 | still open | T2 put Full access and the switch to Supervised in a single 23-word paragraph. The final reply still ran to 128 words. The 49-word result paragraph repeated the page’s Sedge recommendation, and the 26-word snapshot offer made the reply longer. |
| 6 | verified | The T3 walkthrough and T4 layers picture used plain wording. The picture used “The program” and “Its actions.” Neither exposed “harness,” “tool call,” or counts of actions. |
| 7 | still open | T8 distinguished the crew sheet on the agent’s machine, the text and file contents OpenAI can receive, and the chat stored on the machine running T3 Code. It said T3’s own servers do not receive the chat or files without qualifying that statement for enabled T3-operated features. |

The T3 v0.1.9 FAQ describes the ordinary path from the user’s machine to the provider. The background service docs locate the conversation database on the environment host. Section 3 of T3’s terms covers optional T3-operated features that transmit or process user content. [FAQ](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/faq.md#does-my-code-go-to-t3-servers) · [Background service docs](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/background-service.md#reclaim-database-space) · [T3 terms](https://t3.codes/terms-of-service)

## Condensed turn log

| Turn | Learner request and observed response |
| --- | --- |
| 1 | Invoked `$agentic-guide`. The guide asked for a small, non-sensitive task in the learner’s own words. |
| 2 | Asked where to go next and for a file for next week. The guide made `pond-card.txt` and rendered **Pond visits** with the learner’s own data. It recommended Sedge to fill the missed visit and kept Reed’s observed zeros distinct. It stated the plain level, offered a snapshot of the card, and ended with the short question. |
| 3 | “Put the pond I should go to first at the top of the card.” The guide changed and read back the first line, **SEDGE — FIRST STOP**, on that reply. It walked the edit, offered a picture, and asked about explanation style. |
| 4 | Asked for short words, one step at a time, and a final line starting “Field note:”. Accepted the picture and declined the snapshot. The guide used the requested sign-off, proposed the exact style note, asked for the level in the same reply, and rendered **How your card changed**. |
| 5 | Confirmed the level and asked to see the updated wording before saving. The guide showed the revised note. I also asked to see the change again because the CLI reply omitted the inline attachment. That second request produced **How the first line changed**. |
| 6 | Approved the note and asked how to compare visits of different lengths. The guide saved the note under `## How I want to learn` and added a frogs-per-10-minutes field and a worked example to the card. |
| 7 | Asked for a check of every entry and a sentence to reuse. The guide checked all six entries, preserved zero versus no visit, and gave a reusable check request. |
| 8 | Asked who would see a real crew sheet. The guide explained file location, OpenAI’s receipt of content, and T3’s local chat storage. It offered a made-up sheet with the same columns. It omitted the optional-features qualification. |
| 9 | Asked for a test opener before moving real work to a separate folder. The guide gave a standalone rate question and separately explained what to check, where permissions appear, how to recall the guide, and how to ask for global installation. The closing matched the handover. |
| 10 | Sent the T9 opener verbatim in a fresh thread. The first reply correctly gave **4 frogs per 10 minutes** in plain words and ended with “Field note: That’s an average rate.” The opener contained no style hint or skill invocation. The Codex record shows the saved note in startup context and zero actions before the reply. |

The learner’s own result on T2, one-sentence edit on T3, and first-reply carryover on T10 all passed. The three inline attachments used preview before render at the measured heights of 232, 333, and 101 px, respectively, with one attachment per reply. The session records show the attachments and their contents. Browser inspection was outside this pass.

Reset the lab after T10 by removing the generated card and preference note. Verified the original README and both matching project-scoped skill installs remained, with no Git branch commit. T3’s session records were retained. [Guide thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3A14f8767c-df74-4858-bb95-c5f17d93c1ba) · [Plain fresh thread](https://app.t3.codes/threads/9a1076d4-f404-4316-bd66-c0dc50299093/mcp%3A40fca9c8-3ebd-4b2a-9748-d06dc4759f20)

```json
[
  {
    "severity": "low",
    "area": "Reply 2 length",
    "text": "On T2 the permission explanation fit in a single 23-word paragraph, but the final reply still ran to 128 words. It repeated the inline page’s Sedge recommendation before the teaching aside and the snapshot offer.",
    "fix": "Once the page renders, keep the file link and omit the repeated result prose. Keep the permission note to one line and the snapshot offer short while preserving what it covers and when a later file needs separate removal."
  },
  {
    "severity": "medium",
    "area": "Data handling",
    "text": "On T8 the guide separated the file, OpenAI, and T3’s chat storage, then said T3’s own servers do not receive chats or files. It omitted the qualification for enabled T3-operated features.",
    "fix": "Keep the three destinations distinct. Scope the statement about T3’s own servers to the ordinary provider path and add one plain sentence explaining that enabled T3-operated features are covered by T3’s terms."
  }
]
```
