# Round 3: static verification (Neon)

Neon sent this review in its completion message without writing a file. The lead saved it here for the record, shortened.

Of the 11 round-3 fixes, 8 are verified and 3 are partly fixed. There are no regressions, and no wrong claims about T3 Code v0.1.9. Neon checked against the v0.1.9 user docs (welcome page, permission modes, FAQ, telemetry, composer, source control, prompt links, voice input, HTML renders) and against the live `html_preview` and `html_render` schemas. `check-facts.mjs` reports 0 warnings and 0 errors.

| # | Status | Note |
| --- | --- | --- |
| 1 | verified | Reply 2 ends with "Anything you'd change?". Reply 3 acts on what the learner asked first. |
| 2 | verified | The style question is asked once after a content-only change. |
| 3 | verified | The level is confirmed in the same message as the proposed note. |
| 4 | verified | The closing matches the plain new-thread test. |
| 5 | verified in code | The permission line is about 35 words. In Sol's live run, reply 2 still came to 128 words; fixed in round 4. |
| 6 | partly | "tool call" was still in layers.html's Model row and caption. Fixed in round 4. |
| 7 | verified in code | world.md keeps the files, the provider, T3's local storage and optional extras apart. In Sol's live run, the agent dropped the caveat; fixed in round 4. |
| 8 | verified | text.md matches `harnesses.ts`. |
| 9 | partly | The install prompt didn't say to replace an earlier install, or to clean up when it stops on a conflict. Fixed in round 4. |
| 10 | verified | `--dir` with `--global` exits 2. `installTerminal`'s EXIT trap cleans up its temp folder. |
| 11 | partly | The sidebar new-thread hint was missing from /start/ step 4. Fixed in round 4. |

```json
[
  {"severity":"low","area":"site/src/pages/start/index.astro","text":"Step 4 lacks the sidebar new-thread button hint.","fix":"Tell the learner to click the new-thread button on practice in the sidebar."},
  {"severity":"low","area":"skills/agentic-guide/figures/layers.html","text":"'tool call' still shows in the Model row and caption at the plain level.","fix":"Add plain replacements for both to the relabel instructions."},
  {"severity":"low","area":"site/src/lib/start.ts","text":"installPrompt step 4 doesn't say to replace an earlier install or clean up the temp folder when it stops on a conflict.","fix":"State both explicitly."}
]
```
