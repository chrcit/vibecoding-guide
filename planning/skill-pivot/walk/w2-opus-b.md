# w2-opus-b: walkthrough pass 2 (Opus as tester)

Inner model for every learner thread: `claudeAgent/claude-sonnet-5-5` (Claude Code under T3 Code 0.1.9, lab base dir). Runs were taken one after another, each in its own fixture folder under `~/.local/state/agent-artifacts/vibecoding-guide/lab-projects/<run-id>`. Every inline page was previewed at 390px (light or dark) with `html_preview`. All findings are in `inbox.jsonl` under these run ids.

## w2-opus-b-L2: It's all text (plain, community-garden coordinator)

Thread `mcp:b160acd3-b4ed-4057-8fbc-0e9010e7c9ab`; learner-started fresh threads `mcp:cdc11a42-…` and `mcp:727b9e13-…`.

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | 4 lines: names saved preferences, asks what to work on today | works (re-check F7 opener) |
| 2 | Watering rota, 8 invented names, Greta away first 2 weeks of July | Clean rota page (fits 390px, assumptions box names the uncovered days). Then the full first-session reply-2 block, including "I'm pitching this at plain" | page works; **bug**: level re-announced (re-check F7) |
| 3 | "what does pitching at plain mean?? … talk over the garden fence, important thing first … make week 1 longer" | Week 1 fixed first, plain words, exact AGENTS.md line shown before writing. Said the level was "guessed from how you wrote" (false: it came from AGENTS.md). Three questions in one reply | style **works**; **bug**: false provenance; papercut: re-check F13 fails |
| 4 | "yes write it down … stretch week 8" | Wrote exactly the shown line; said the rota isn't a file; offered snapshot listing AGENTS.md with the later-files caveat | works (re-check F11) |
| 5 | "yes ok take the snapshot" | No Git identity on the machine: "Git wants a name to sign snapshots with", unstaged, offered folder-only name | works (re-check F12) |
| 6 | "the placeholder is fine" | Committed with folder-local `Linden Garden` identity | works |
| — | Fresh thread: "add Iris to the watering rota" | Didn't know the rota; did talk garden-fence style, important thing first | the learner's own experiment |
| 7 | "how does it know how I like to be talked to but not the rota?" | Note is a file every new chat reads; rota lived only in the first chat; "new helper finds the notice board". Try line says "pick that chat from the sidebar to attach it" | works; papercut: no `@`/drag gesture |
| 8 | "what is this guide thing actually?" | Instructions in plain text files, "a how-to card pinned to the shed"; "I don't know who put it there" | works |
| 9 | "show me a bit of the card … could I change it? one thing to try, in garden words" | Quoted two SKILL.md lines word for word, admitted "I'm not always doing it", steered the change into the note, showed it first | works (Bending the lesson at plain) |
| 10 | "yes … and I never said I like tables, make it forget that" | Removed the seeded line, added the new one, owned the earlier error | works |
| — | Fresh thread: "compare tomatoes and courgettes" | No table, important thing first, ends with "Try next:" in garden words | proof: AGENTS.md alone shaped it |

## w2-opus-b-L4: The loop (some, marketing analyst with basic SQL)

Thread `mcp:b19da01a-f5a6-4fb0-9f9a-51450375f333`; learner-started fresh thread `mcp:3327f183-…`.

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Saved preferences named, what today? | works |
| 2 | One sentence: invent a month of plant-shop sends, which subject style wins | Python made the CSV and stats; page says "No overall winner on revenue". Reply: "I wrote the page and the p-value for the last row by hand." Level re-announced again | page and computed/typed split **work**; **bug**: re-check F7 (2nd run) |
| 3 | "you wrote the p-value by hand?? walk me through what you did" | Call table; admitted it first typed 0.50 "from my sense of the t-distribution", then computed 0.514 (I confirmed: t=-0.69, df 7); bootstrap behind the interval explained. Says "five calls", lists four rows | **works** (re-check F16); papercut: count, unlabelled bootstrap interval |
| 4 | Catches the assumption: ESP sends question style to engaged, discount to lapsed | Page "Yes, it wrecks the comparison", as-is vs randomise-within-segment; aside on silent defaults; snapshot offer with honest caveat | works |
| 5 | "how do I know the tie isn't one random draw? check your own work" | 1,000 simulated reruns: null false-winner 4.2%, power for a 4% edge, ESP design crowns question 100% under the null; the manager sentence; limits; "it's just a sentence" payoff; rule offered | **works** (Try it N times) |
| 6 | "save it, 200 runs, say 'before you show me'; I could paste real warehouse data next week" | Saved with diff; four data sentences as written, workplace rules, invented table offered first; explained why confounded real data can't settle it. Added an unshown heading | **works** (re-check F5); papercut: re-check F11 partial |
| 7 | "show me that layers picture" | Filled template for the 1,000-runs turn, 390px fine | works |
| 8 | "what decides when it stops? why didn't you check segments yourself?" | "The moment the model writes an answer with no call in it, the loop ends"; owned the miss; Try: "What would done have to include?"; second rule offered | works |
| 9 | "yes add that one" | Diff shown; then "That ends the practice session" and an offer of the full handover | papercut: returning learner, unasked end |
| 10 | "sure, go" | Complete handover: opener, what to look for, permission mode, `$` call-back, global install | works |
| — | Fresh thread: bakery opener | Ran the 200-rerun null check and listed 7 assumptions with questions, unprompted | proof: text moved the loop's stop point |

## w2-opus-b-L6: Moves (deep, data engineer)

Thread `mcp:f291ab44-f299-4863-ac73-383debcfc704`; child thread "On-call Runbook: Silent Row-Count Drop" (started by the agent on request).

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` + chart of invented row counts per source, one silently dropping | Strong page: % of own baseline, 25% line, correct note that a rolling median would stop flagging on Nov 20 (checked), Kafka/S3 labelled illustrative; 390px fine. Then "Level: deep, from how you described the pipeline" | page **works**; **bug**: re-check F7 (3rd run), false provenance |
| 2 | "taller, labels in German … is that actually where 'level deep' came from?" | Chart 400px, de-DE formats. Ignored the direct question; switched its own prose to German | **bug**: direct question skipped; papercut: re-check F2 partial (German table nearly clips at 390px) |
| 3 | "English in chat … you skipped my question … two things at once?" | "came from AGENTS.md … my earlier line was wrong"; 3-way table (queue, subagents, two threads), opener for the runbook thread, "I haven't started a thread". No start/permission/call-back tail | works; papercut: re-check F7 fresh-thread tail missing |
| 4 | "Do it: start the runbook thread, write the SQL here" | Thread started via T3 tool, linked, not polled. SQL with "Not run … untested", then "on your invented data it would fire on 16 Nov" (false) | works; **bug**: hand-reasoned output claim |
| 5 | Points out HAVING >= 14 on a 14-day series; "run it locally"; "compare with the runbook thread" | Ran on SQLite in memory, 3 setups, conceded; read the runbook thread and tabled 5 disagreements (threshold, rolling average, zero rows, UTC); payoff line | **works** (reference a thread, check it) |
| 6 | "Can you read my billing project's threads? Don't do it. How do I get the guide there?" | Yes technically, untested boundary, won't demonstrate; data sentences for "real work"; global vs per-project install compared | **works** (re-check F3/F4/F5) |
| 7 | Checklist form from the runbook's confirm steps, German, loss per hop | 6-step form with live loss table; flagged its own departures; 1902px; date input shows mm/dd/yyyy | works; papercut |
| 8 | "Bigger for phones at 3am; fix the date" | TT.MM.JJJJ field, Heute/Gestern (UTC), one step open at a time to stay under 2000px. "I did not preview those edits again" | works; papercut: render without re-preview |

## w2-opus-b-L6b: Moves (some, UX designer)

Thread `mcp:6e72ede4-4cc3-468a-a19d-d39f22d5c235`; child thread "Recruiting-Post Kochgruppe" (started by the agent on request).

| Turn | Learner typed | What happened | Verdict |
| --- | --- | --- | --- |
| 1 | `$agentic-guide` | Saved preferences named; what today? | works |
| 2 | Typeform-style screener for a recipe-app study | One question per screen, letter keys, 390px fine; "html_preview checked only the first screen". "I read you as **some**" | page works; **bug**: re-check F7 (4th of 4) |
| 3 | "bigger and in German; 'press Enter' makes no sense on a phone" | du-form, bigger, Enter hint hidden on touch; reply lists only its unasked choices | works |
| 4 | "keep going on two things at once? how does that work?" | Same thread vs two threads table, concrete slip named, asks first, full tail (sidebar, mode, `$agentic-guide`) | **works** (re-check F6, F7) |
| 5 | "start that thread for me; meanwhile thicker bar and a Danke screen" | Child started on ask; both changes reported; qualify result moved behind a button; height estimated (+6px) without re-preview | works; papercut |
| 6 | "@Recruiting-Post Kochgruppe what did it write? does it match the form?" | Read it, "nothing was run", 4-row table, two real gaps (phone type, no contact field) | **works** |
| 7 | "Fix the form … can I use this guide in Notion, can you read Notion?" | Fixes done with untested paths named; data sentences verbatim; can't read Notion (connector not authorised); "the guide skill you saved stays with this project" | works (re-check F5); papercut: guide-in-Notion confusion |
| 8 | "so the guide doesn't live in Notion? can I keep the form?" | Where-it-runs table; form only in the chat; offers to save a file | works |
| 9 | "yes save it" | One standalone `screener.html` in the project; snapshot offered with the file listed | works |

## Pass-1 fixes re-checked

| Fix | Result in these runs |
| --- | --- |
| F1 self-referencing variables | Holds: every page used prefixed aliases (`--g-card: var(--card, …)`, `--s-card`). |
| F2 390px / 2000px | Mostly holds: all pages fit except a near-clip after translating to German (L6 t2); two pages came close to 2000px and the agent split one by collapsing steps. |
| F3 writes outside the project | Holds: no probe or temp files; reach explained, not demonstrated (L6 t6); global install only offered. |
| F4 mode vs reach | Holds: "Full access decides when I'm asked to approve, not what I can reach." |
| F5 data sentences on first real material | Holds in all three cases (warehouse data, billing project, Notion participant notes), verbatim with the T3 clause, invented data first. |
| F6 second job | Holds (L6b t4). |
| F7 returning learner | **Does not hold for the level line**: 4 of 4 runs re-announced the confirmed level in the reply-2 format, twice with a false source ("guessed from how you wrote", "from how you described the pipeline"). Opener half holds. Fresh-thread tail: present in L6b, missing in L6. |
| F11 write only what was shown | Holds at plain (L2); partial at some (L4: an unshown heading). |
| F12 Git identity | Holds (L2 t5). |
| F13 one question per reply at plain | Does not hold: three questions in L2 t3. |
| F16 hand-written page text checked | Holds when asked (L4 t3); but an untested SQL claim in prose was false (L6 t4). |

## Curriculum review

**It's all text (L2, plain).** The mechanism landed through the learner's own work, not explanation: the strongest moment was the learner starting a fresh chat, seeing it keep the garden-fence style but forget the rota, and asking why. The "notice board" answer is the lesson in one line. *Bending the lesson* at plain (quote two lines, keep the change in the note) worked as written. What hurt it: the agent twice hid the file behind "I guessed", which is the opposite of the lesson. The fix belongs in Setup 2 (don't announce a confirmed level; if asked, cite the file), and text.md could add one *Question to expect*: "Why do you talk to me like this?" → "It's written in a note in this folder; I read it at the start." Missing for plain: a sentence for "forget this" (the learner had to invent "make it forget that one"); "Take that out of my note" belongs in moves.md *Undo*.

**The loop (L4, some).** This is the best-built lesson. One sentence → many steps → "how did you know?" → caught assumption → check it → the stop point moved by text, proven in a fresh thread. The order in loop.md matches how a real analyst gets there. Missing: loop.md says computed vs written for pages, but the riskiest hand-written text was in prose (a p-value typed from memory, a claimed SQL result). Extend the F16 line from "on a page" to "in the reply too". The layers picture came late and added little after the walk-through had already taught it; at some, offer it on the first "how did you know?", not later.

**Moves (L6, deep and some).** Pages, adapting ("bigger", "in German"), starting a thread only on ask, and referencing a thread all worked on both levels, and the cross-check between two threads (runbook vs SQL, post vs form) is the orchestration payoff the skill wants. Gaps: (1) the recipe doesn't cover multi-screen pages, so the agent previews one state and estimates the height (twice); (2) translations change layout and the agent didn't re-preview at 390px; (3) a "where does the guide run?" line is missing for people whose work lives in web apps (Notion, Figma), not folders.

**Sentences from moves.md a learner at my levels would reuse.** Plain: "Undo that", "Make me a page of …", "Which parts of that did you guess?". Some (analyst): "Run it on five different inputs, including one that should break it" (became "rerun 200 times with one where nothing differs"), "What did you assume? List it.", "Show me what you ran and what you saw each time." Some (designer): "@thread-name: what did it find? Compare it with what we have here", "Bigger, and in German." Deep: "Start a thread that does X while this one keeps going", "Show me the output that proves it works" (the learner had to push for it with the SQL; it would have come sooner as a Try line on unrun code).
