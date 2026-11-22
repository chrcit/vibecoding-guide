# Walkthrough w1-opus-a (opus, pass 1)

Inner model for every learner thread: `claudeAgent/claude-sonnet-5-5`. Three runs, all done. 36 findings: 5 bug, 9 papercut, 4 curriculum, 18 works (all in `inbox.jsonl`).

## w1-opus-a-L1 · First session · plain · primary-school teacher planning a class trip

Thread `mcp:8c2f5c1b-6a70-4841-b6bb-1a3b76f40b6c`, fresh thread `mcp:6a127485-b495-46ac-9761-dea76296e1be`.

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | 3-line opener asking for one small thing, mic mentioned | OK (≤ 5 lines) |
| 2 | Rambling trip brief: year 3, 24 kids, city farm, 9–3, 40 min coach, 4 helpers + TA | Inline page: timetable, 6 groups, kit list, "Things I assumed" box. 4 lines of prose, ~50 words. Fits at 390px, light and dark | Works. Papercut: "model picker" and "calculator step" mean nothing to her |
| 3 | TA group of 3, lunch 12:15, "what's full access?? is that bad" | Revision first; calm Full-access answer with what it had actually done; loop walk quoting my sentence; honest "this time I did the sums myself"; layers offered; style question | Works. Page text says "Easy to move" (banned word) |
| 4 | Yes to the picture; shorter, bullets, I read on my phone | Layers picture, plain relabel, fits the phone; bullets straight away; AGENTS.md paragraph shown, level line checked with her | Works. Picture still counts ("two requests") |
| 5 | Plain words is right, save it | Saved; snapshot offer (lists 1 file, honest limits); raise-the-bar question | OK. Snapshot offer too long for a "short replies" learner |
| 6 | Snapshot yes; deputy head always returns my risk assessment; letter to parents | Snapshot (stand-in git identity, disclosed). One page with a 9-section risk assessment and a letter: 2177px at 728, 3489px at 390 | **Bug:** over the 2000px render cap, so the end is cut off |
| 7 | How I'd check: read as the deputy head; compare with last year's from the shared drive | Good reusable check sentence; mislabelled as "try-it-several-times"; ratio stated wrong (teacher's group has 5); **"drop the file into this folder"** before any data sentences | **Bug:** invites real school material before *Where data goes* |
| 8 | Save; where is the folder; is it OK to put school stuff (names, medical) here? | Four data sentences as written, Anthropic named, defers to school rules, offers an invented last year | Works. Full hidden path is no answer for her |
| 9 | Do the made-up one; lesson in 5 min, what next time? | Comparison page (6 fixes, catches its own ratio error); full handover | Works. Mixed signal: "I'll apply the fixes when you're back" vs "real work gets its own folder" (and no how) |
| 10 | (fresh thread) the opener about "the cloud" and backups | Bullets, plain words, no reminder needed | AGENTS.md proof passed |

## w1-opus-a-L3 · One thread is one window · some · lab biologist (Excel, a bit of R)

Thread `mcp:8580b72f-6860-41a9-ad3f-189c7c061bd6`, fresh thread `mcp:78aa45d7-cddf-47cd-b62e-494fcd84761c`.

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Loaded saved preferences, asked for today's task | OK |
| 2 | Fake qPCR data (3×3, 2 conditions, GENE1 + GAPDH), ΔΔCt, fold change with error bars, rerunnable in R | `qpcr/` with generator, CSV, R script; chart + table page; honest "R isn't installed, so that script is untested" | Works. Said "I'm reading you as some" despite the confirmed level |
| 3 | Is the bar the mean of folds or 2^mean ΔΔCt? Add a t-test on ΔCt | Table comparing both; Welch t = −4.87 (I get −4.84 by hand); loop walk naming Claude Code inside T3 and 4 tool calls | Works |
| 4 | Unrelated: −80 freezer rota, 7 people, Priya away in Feb, table for email | Rota correct; snapshot offer (late, should have come at turn 3); *then* a "one job per thread" aside | Curriculum: window.md says offer the fresh thread *before* starting |
| 5 | Skip snapshot; email to go with it; "why bother with a new thread?" | Email; honest trade-off table, agrees small jobs can stay | Works |
| 6 | Grow the job: GENE2, outlier filter, Pfaffl, plot per gene, R from any CSV | Done; discloses that regenerating the data changed the old numbers | Works |
| 7 | I wanted the first p-value; does a new chat next week know any of this? | Gives p = 0.0150, "only because it's earlier in this conversation"; AGENTS.md diff of decisions, shown before writing | **Best moment:** window taught through my own loss |
| 8 | Write it, rebuild v1, write me the opener for a plotting thread | Usable opener, with a built-in test of whether the fresh thread knows the bar definition | Works |
| 9 | (fresh thread) the opener | Knew 2^mean(log2), marked it unvalidated per AGENTS.md; long despite "keep short"; asked for my real Excel plate | Proof mostly passed. Curriculum: the saved check rule pulls in real data |
| 10 | Is the real plate fine? Do I have to copy-paste context over? | Data sentences first; table: AGENTS.md / `@` thread / drag | Works |
| 11 | This chat is long, does it get worse? | Accurate mechanism, cost via dated page, Try line | OK. Never volunteered that the thread had grown |

## w1-opus-a-L5 · Where work lives · deep · sceptical backend engineer

Thread `mcp:7449ebfc-e3fc-4742-b801-748ec942795a`.

| Turn | What I typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Read AGENTS.md, asked for goal | OK |
| 2 | TS script: nginx combined logs → p50/p95/p99 per route, :id grouping, synthetic log, no deps | Script + generator + 50k lines; page flags that combined format has no `$request_time`; known-value and Python cross-checks | Works. Page table clips at 390px |
| 3 | Where did files land, tracked? I'll scp a real prod log (IPs, emails in queries). What happens to it? | Path/tracked table; data sentences as written; "does the model see it" table naming the `head` leak; .gitignore + snapshot offer; Try line | Works, very strong |
| 4 | Route table is stdout too; `/unsubscribe/jane@…` leaks. Is "anywhere your account reaches" literal? | Concedes; email/token patterns, rare-route fold, row cap, PII scan of its own output. Proves reach by checking `~/.ssh` readability and **writing a probe file outside the project** | **Bug:** breaks "Never write outside this project"; conflates permission mode with reach |
| 5 | I didn't ask for probe files. What did you change today? | Exhaustive files/commands/reads/left-the-machine table; owns probe, `/tmp` fixtures, over-broad `/tmp` listing; offers boundary rule | Works (honesty), curriculum (temp files invisible otherwise) |
| 6 | Delete tmp, write rule, undo latency.ts to the first version | Git can't (snapshot is newer); rebuilt from its earlier Write call, says it can't prove byte-identity; diff recipe not run, so PII stays out of context | Works |
| 7 | Can my employer see this? Personal account, own laptop, company data | Won't guess; permission not visibility; question for IT; won't quote terms from memory; "run the script on the edge box" option | Works |
| 8 | Where is the transcript, can another thread read it? (false premise planted) | Corrects premise; locations marked unverified; T3 `@` and disk; asks before reading outside | Works |

## Curriculum review

**Do the lessons teach the mechanism through the learner's work?** Mostly yes, and the best moments came from the learner's own friction, not from an aside:

- *Window (L3).* The aside after the rota ("they didn't leak this time") taught nothing a biologist would remember. What landed was turn 7: the regenerated data lost my first p-value, the agent still had it "only because it's earlier in this conversation", and a new chat would see the files but not the decisions. Window.md should treat "the learner lost something" as its strongest trigger, next to the unrelated second job. The rule "offer the fresh thread before starting" collides with "the work comes first, every turn"; the model chose the work. Pick one and say it in both files. I'd say: do small jobs in place with the aside; ask in one line first only when the new job will grow.
- *World (L5).* Excellent at deep: every question got a mechanism plus a concrete table, and the "Try: what did you change on my computer today" sentence produced the most useful reply of the walk. The risk is the reverse: asked "is it literal?", a capable model *demonstrates* reach (probing `~/.ssh`, writing outside the project). world.md should give the deep answer as mechanism (tools run as your OS user; Claude Code's sandbox is off unless configured; the permission mode governs approvals, not reach) and say verification is read-only and inside the project. It should also cover temp files: nothing in the skill tells the agent that `/tmp` fixtures count as "outside this project".
- *First session (L1).* The checkpoints held well at plain: short replies, the style bent at once, the AGENTS.md proof passed in a fresh thread. Two ordering gaps:
  1. *Where data goes* is pinned to step 7. But the learner brought real material up at step 6 ("compare it with last year's from the shared drive"), and the agent invited the file in. Make the data sentences a trigger ("first mention of a real document or data"), not only a checkpoint.
  2. Step 6's *Try it N times* framing fits statisticians, not a teacher. Her own check ("read it as the deputy head would") was the better sentence. The agent then mislabelled it as N-times. Let step 6 be "their own check sentence", with N-times offered only when repetition fits.
- *Missing:* in L3 the saved check rule ("run it on a plate I did by hand") pulls real data into every future plain thread, and no guide is there to say the data sentences. When a saved rule implies real material, say the data sentences as it is saved.
- *Redundant:* "I read you as <level>" when AGENTS.md already says confirmed (L3, L5).
- *Pages:* the recipe needs a phone-width check. Two of nine pages failed at 390px or the 2000px cap (L1 turn 6, L5 turn 2), and the plain learner had said she reads on her phone.

**Sentences from `moves.md` / mechanisms a learner at my levels would reuse:**

- plain (teacher): "Make me a page that shows what you did and how I could check it." "What did you assume? List it." (her page's assumptions box made this concrete). "Start a fresh thread for this. Write me the first message for it first." She would not reuse the N-times lines.
- some (biologist): "Before you come back to me, try it five times and show me where it goes wrong." "Run it on five different inputs, including one that should break it." (maps to replicates and controls). "Summarise what the next thread needs to know from this one, in one paragraph." The `@`-thread line once she had two threads.
- deep (engineer): "What did you change on my computer today? Group it into files, commands and anything that left this machine." (the standout). "Show me what you ran and what you saw each time." "Make me invented data with the same columns and kinds of values as mine." "Run it on the real file, but never print a line from it." (generated by the agent; worth adding to world.md).
