# Walkthrough report: `w2-neon-a`

- **Agent:** `neon` · **Pass:** 2 · **Inner model:** `codex/gpt-6.2-astra`
- **Runs:** 2 done (`w2-neon-a-L1`, `w2-neon-a-L3`), 1 failed (`w2-neon-a-L5`, Codex workspace credit limit on Turn 1)
- **Findings logged to `inbox.jsonl`:** 21 total — `1` bug, `7` papercuts, `2` curriculum, `11` works

## Pass-1 / Pass-2 fix re-check summary

| Fix | Exercised in | Result | Evidence |
|---|---|---|---|
| **F1** (CSS variable cycle) | L1 T2–T4, L3 T2 | **Holds** | All rendered inline pages used `var(--token, fallback)` or `--g-*` aliases cleanly; no self-referential `:root` overrides. |
| **F2** (390px layout / height) | L1 T2–T4, T8, L3 T2 | **Holds** | Simple fluid layouts, 4-col table in L3 T2, responsive layers diagram in L1 T4, `max-width:595px` image in L1 T8. |
| **F5** (data sentences early + T3 caveat) | L1 T2, T10 | **Holds** | Fired proactively on L1 T2 when the shop was mentioned (all 4 sentences incl. T3 optional-extras caveat) and used invented prices; repeated on L1 T10. |
| **F6** (second unrelated job) | L3 T4 | **Failed (bug)** | Given a growing 2-day department symposium (schedule, budget, invite to tweak over days), it drafted all three deliverables immediately instead of pausing with one line first ("New thread for this?"). |
| **F7** (returning session + handover completeness) | L3 T2, T4–T7, T10 | **Mixed** | Returning reply-2 boilerplate suppression and Turn 7 handover completeness (sidebar New thread, permission mode under message box, `$agentic-guide` callback) **held**; however, zero `Guide · <topic>` asides or `Try:` lines fired across all 8 turns of the main returning thread. |
| **F9** (global install qualifies Claude Code & Codex) | L1 T10 | **Partly holds** | Offered installing across projects at handover, but omitted "for Claude Code and Codex" and that `AGENTS.md` preferences stay with this project folder. |
| **F11** (exact `AGENTS.md` paragraph only) | L1 T5–T6, T9–T10 | **Holds** | Wrote verbatim shown paragraphs under `## How I want to learn` and `## Checks for tasting cards`, nothing fabricated; created minor tension with saving confirmed level (see L1 T6). |
| **F12 / G6** (missing Git identity; no history author; clean status) | L1 T7–T8 | **Holds** | Asked in plain words for folder-only name/email, did not pick `Lab <lab@example.invalid>`, left `AGENTS.md` unstaged (`?? AGENTS.md`), then set repo-local `git config` only and committed only `AGENTS.md`. |
| **F13** (reworded Try; one question at plain) | L1 T3–T4 | **Holds** | One suggestion/question per reply at `plain` through T4; T7 asked two questions only because the user asked two things. |
| **F14** (own check sentence; don't force Try it N times) | L1 T9 | **Holds** | Turned her print-and-biro check into her own check sentences rather than forcing repetition. |
| **F18** (single next step + plain New project how-to) | L1 T10 | **Partly holds** | Single next step held; omitted the `plain` `Cmd/Ctrl+K` → **New project** (`~/.t3/projects`) instruction. |
| **F19** (style question on reply 3 or 4) | L1 T4 | **Holds** | Asked a tailored style question ("Would you like me to use shop examples when I explain things like this?") on Reply 4. |
| **G1** (returning session skips level & reply-2 block) | L3 T2 | **Holds** | Wrote only the single Full access / Supervised permission line on Turn 2; no level re-announcement. |
| **G2** (safe on-machine handover opener + publish warning) | L1 T10–T11, L3 T7–T8 | **Holds** | Both openers stayed on-machine (no "page"/"link"), used invented/placeholder data only, contained no personal/third-party details, and L1 included the publish/share warning. |
| **G5** (computed vs written; values from tool output) | L1 T2–T3, L3 T3 | **Holds** | Scripts ran (`dilutions.R` with `stopifnot` assertions in temporary R runtime); table values matched R printed output exactly. |
| **G7** (direct question answered first) | L1 T4, L3 T5–T6 | **Holds** | Answered learner's direct questions before moving on. |
| **G8** (one mechanism per reply at plain) | L1 T2–T4 | **Holds** | Loop alone on T3–T4, persistence alone on T5–T6, snapshot on T6–T8. |
| **F3, F4, F17, G3, G4** | L5 | **Not exercised** | `w2-neon-a-L5` failed on Turn 1 due to Codex workspace credit limit before any L5 turns ran. |

---

## Run 1: `w2-neon-a-L1` — L1 First session (`plain`, small-shop owner)

- **Thread:** `mcp:9e3eb773-c9cf-44a2-936e-8557025b2ede` · **Fresh-thread proof:** `mcp:20a946e3-f35e-439e-8433-f6af4cb81b49`
- **Status:** `done` (11 turns total: 10 in main thread + 1 fresh-thread check)
- **Inline pages inspected:** 3 rendered HTML attachments (`c2d4ce59` shopping list, `4b8c123e` £5 chart, `82594f74` layers diagram, plus `68c2907e` inline image preview of `autumn-tasting-card.pdf` = 4 inline renders total). All rendered cleanly without CSS cycles or clipping.

| Turn | What you typed | What happened | Verdict |
|---|---|---|---|
| 1 | `$agentic-guide` | 3-line warm opener asking for one small thing, mentioning mic and invented/non-sensitive example. | **Works** |
| 2 | Rambling plain request: tiny tea & spice shop planning a Saturday autumn tasting for ≤18 people (4 loose-leaf teas, 2 biscuits, quantities & rough ticket price). | Rendered clean inline shopping-list page (accurate €21 total / €1.17 break-even / €2 ticket -> 11 seats cover 18; no CSS cycle [F1], 390px-friendly [F2]; no files written). Emitted 2 pre-reply commentary bubbles (18w status + 68w proactive F5 privacy block with T3 optional-extras caveat) before a crisp 52w 4-line Reply 2 (permission line, "A tool calculated break-even", inferred `plain`, "Anything you'd change?"). | **Works + Papercut** (F1/F2/F5 held; 3 visible bubbles ~138w total + "A tool" wording at `plain`) |
| 3 | Asked for £ instead of €, oat milk alongside regular milk, and £5 tickets towards part-timer's hours. | Rendered updated inline page with proportional bar chart (10/14/18 seats -> £29/£49/£69 left, 14 bookings cover £45 shift + £21 stock). Added `Guide · How the revision worked` quoting her sentence with no counts and `Try: "Show me that loop as a picture."` Did not stack diagram onto result. | **Works** |
| 4 | Said yes to the picture and asked what "the program around it" meant. | Rendered `figures/layers.html` filled with her £5 turn, plain row labels ("The program", "Its actions"), no counts. Answered her direct question first [G7] with a till/calculator analogy, and asked style preference question ("use shop examples?") [F19], keeping to one mechanism/question [G8, F13]. Slipped in harness name **Codex** at `plain`. | **Works + Papercut** (F19/G7/G8 held; named "Codex" at `plain`) |
| 5 | Said yes to shop examples; asked for super-short bullet points and always British pounds (£). | Immediately switched to short bullets, showed exact `AGENTS.md` quote block without unconfirmed level, asked "I've been assuming no coding background. Does that fit?", did not write file yet. | **Works** |
| 6 | Confirmed saving and confirmed no coding background ("barely fight with spreadsheets"). | Wrote exact shown paragraph to `AGENTS.md` [F11] (omitting confirmed `plain` level due to strict F11 wording). Offered Git snapshot listing `AGENTS.md` with honest later-files caveat. | **Works + Papercut** (F11 held; tension left confirmed level unsaved in `AGENTS.md`) |
| 7 | Said yes to snapshot and asked what else to do for the tea tasting. | Hit missing Git identity: did not pick `Lab` from history, left `AGENTS.md` unstaged (`??`), asked plainly for folder-local name & made-up email [F12, G6]. Suggested guess-the-aroma round and asked Step 5 ("What would impress a regular who already knows your teas?"). | **Works** |
| 8 | Gave `Bramble and Leaf` / `hello@brambleleaf.example` for snapshot; asked for a printable 1-page tasting card with aroma tick boxes, brew temp/steep time, and £2-off voucher. | Set local-only `git config` (global untouched), committed snapshot `f4ab19a` covering only `AGENTS.md`, created `autumn-tasting-card.pdf`, rendered it inline as an embedded image preview, noted card was created after snapshot, asked Step 6 ("How would you check the card before printing all 18?"). Linked file as "Download..." with raw path rather than saying in one plain line it lives in the practice folder. | **Works + Papercut** (F12/G6/inline PDF great; "Download" wording implies internet) |
| 9 | Described physical check: print 1 copy, fold/tear £2 voucher, ask part-timer to tick boxes with a normal biro, verify margin after £2 off. | Turned her words into two check sentences ("Your check" and "At the till") instead of forcing *Try it N times* [F14], asked before saving. | **Works + Curriculum** (F14 held; saving offline human checklist verbatim into `AGENTS.md` isn't an agent-facing check rule) |
| 10 | Confirmed saving checks; asked how to carry on independently for next week's real winter spice order and shop-window poster. | Appended exact checks to `AGENTS.md`. Handover gave safe invented on-machine opener (no "page"/"link", no personal details, no mention of bullets) [G2], publish/share warning, all 4 data sentences, sidebar New chat + Supervised permission check, `$agentic-guide` callback, single next step [F18]. Omitted plain `Cmd/Ctrl+K` → New project how-to [F18] and Claude Code/Codex qualifier + local-`AGENTS.md` note on global install [F9]. | **Works + Papercut** (G2 held; F18/F9 partly missed) |
| 11 | *(Fresh plain thread `mcp:20a946e3`)* Sent exact Turn 10 opener verbatim. | Replied immediately in 2 super-short bullets using `£12` (`Order 2 bags for £12 total. You need 800 g − 300 g = 500 g.`). | **Works** (fresh-thread proof succeeded) |

---

## Run 2: `w2-neon-a-L3` — L3 One thread is one window (`some`, lab biologist with Excel & a bit of R)

- **Thread:** `mcp:808adac2-0b66-47d7-901f-31b6a8488eb9` · **Fresh symposium thread:** `mcp:05341773-b205-49e4-b624-b0dbbeb9a863`
- **Status:** `done` (10 turns total: 8 in main thread + 2 in fresh thread)
- **Inline pages inspected:** 1 rendered HTML attachment (`47f1d086` interactive serial-dilution calculator — accurate math, live inputs, no CSS cycle [F1], 4-col table fits 390px [F2]).

| Turn | What you typed | What happened | Verdict |
|---|---|---|---|
| 1 | `$agentic-guide` (folder pre-seeded with `AGENTS.md`: `Level: some (confirmed)`, short explanations, table when comparing). | Asked what small thing she wants to get done today (no level announcement; slight Reply-1 wording carryover). | **Works** |
| 2 | Wet-lab biologist (Excel + tiny bit of R); asked for 8-point 3-fold serial-dilution calculator (10 mM imaginary compound X, 150 µL, 3 replicates + DMSO control, 10% margin) and comparison of multichannel vs separate tubes. | Rendered interactive inline calculator with accurate 3-fold math and real pipetting caveat on sub-µL volumes. Reply wrote **only** the single Full access / Supervised permission line — no level re-announcement, no 4-line reply-2 block [G1, F7]. Comparison was prose rather than a table despite `AGENTS.md`. | **Works + Papercut** (G1 held cleanly; missed comparison table) |
| 3 | Added real constraints (≤0.5% DMSO final, <200 µL max volume); asked for `dilutions.R` outputting 200× intermediate & final CSV, run it, plus comparison table. | Wrote `dilutions.R` with `stopifnot` checks, ran it via temporary R runtime, generated `dilutions.csv`, copied printed values accurately into reply table [G5], added requested comparison table, offered Git snapshot with later-files caveat. Zero leftover `/tmp` clutter. | **Works** |
| 4 | Declined snapshot; introduced clearly growing, unrelated second job (2-day department spring symposium: 60 people, 3 sessions, poster tea, budget, invite email to tweak over days). | Immediately drafted full schedule, 9-row budget, and full invite email instead of pausing with one line first ("New thread for this? (it keeps the two from mixing)") [F6]. Only mentioned a separate thread mildly in line 1; zero `Guide ·` aside or `Try:` line. | **Bug + Curriculum** (re-check F6 failed; returning session dropped proactive asides) |
| 5 | Asked directly why a separate thread helps vs keeping all work in one chat; gave €2,500 ceiling + poster blurb request. | Answered direct question first [G7]: explained long-chat summarization and named `AGENTS.md` as carrying short/table preferences across threads. Revised budget accurately (€2,453, €47 under ceiling) and drafted poster blurb. Still no `Guide ·` aside or `Try:` line. | **Works** |
| 6 | Asked if summarization explains why last week's long ELISA chat forgot column names; asked what her two assay limits from earlier were. | Explained compaction honestly without guessing about last week's chat, gave a strong ELISA header-checking prompt, recalled both limits accurately in a table. Still no `Guide ·` aside or `Try:`. | **Works** |
| 7 | Asked to move symposium to a fresh thread with a starter message + how to start it, and asked whether a new thread can see this one without copy-pasting. | Complete handover [F7, G2]: self-contained on-machine starter message (placeholders only, "Keep the drafts here. Please leave sending the invite to me"), sidebar **New thread**, permission mode check beneath message box, `$agentic-guide` callback, plus `@`-mention / sidebar drag thread referencing with a concrete €223 contingency example. Tiny slip: opened with "Yes." right after "can a new thread see this one?" before sentence 2 clarified "It doesn't automatically see this conversation." | **Works + Papercut** (F7/G2 held; ambiguous leading "Yes.") |
| 8 | *(Fresh thread `mcp:05341773`)* Sent Turn 7 starter message verbatim. | Clean schedule table, budget table, save-the-date email; zero dilution/DMSO leakage; respected `AGENTS.md` short/table style. | **Works** |
| 9 | *(Fresh thread `mcp:05341773`)* Asked it to look at earlier thread `mcp:808adac2` and compare original €3,696 budget vs trimmed €2,453 budget side-by-side. | Read earlier thread on demand, pulled every exact original line item, computed all reductions (€1,243 total) accurately, linked source thread, presented crisp comparison table. | **Works** |
| 10 | *(Main thread `mcp:808adac2`)* Asked tiny unrelated one-off question: 37°C in Fahrenheit + one-line formula. | Answered cleanly in one line (`37°C = 98.6°F. Formula: °F = (°C × 9/5) + 32.`), no unnecessary thread split. Confirmed zero `Guide ·` asides / `Try:` lines across all 8 turns of the returning session. | **Papercut** (returning session never emitted `Guide ·` / `Try:`) |

---

## Run 3: `w2-neon-a-L5` — L5 Where work lives (`deep`, sceptical backend engineer)

- **Thread:** `mcp:57313b93-556e-4026-8b14-ecbc06a1be6b`
- **Status:** `failed` (Turn 1 — Codex workspace credit limit)

| Turn | What you typed | What happened | Verdict |
|---|---|---|---|
| 1 | `$agentic-guide` (folder pre-seeded with `AGENTS.md` at `deep`). | Thread failed immediately with: `Your workspace is out of credits. Ask your workspace owner to refill in order to continue.` Stopped per walkthrough rules without retrying. | **Failed (usage/credit limit)** |

---

## Curriculum review (L1 `plain`, L3 `some`)

### Does the material teach the mechanism through the learner's work?

- **L1 (`plain`) — Yes, strongly.** The progression from her messy shop tasting request → inline shopping list → £5 bar chart → loop explanation & layers diagram filled with her exact £5 turn → bending via `AGENTS.md` → A4 PDF tasting card → fresh-thread cinnamon order proof is genuinely persuasive. Every mechanism surfaced directly from something she cared about, and seeing the fresh thread reply in 2 short bullets with `£12` made "it's just text in `AGENTS.md`" click viscerally without jargon.
- **L3 (`some`, returning session) — Only when the learner pushes.** The core L3 insight (separate threads prevent compaction/drift; `AGENTS.md` bridges preferences; `@`-referencing pulls exact facts from an earlier thread on demand) landed brilliantly once she *asked* for it on Turns 5–9 — the cross-thread €3,696 → €2,453 budget diff on Turn 9 was a standout "aha" moment. However, the guide failed to *initiate* L3 when the textbook trigger arrived on Turn 4 (growing unrelated symposium job), and never emitted a single `Guide · <topic>` aside or `Try:` line across the entire returning session. A quieter returning learner would never discover the window mechanism or `@`-referencing.

### What is missing, redundant, or in the wrong order?

1. **Returning-session over-suppression (`SKILL.md` Setup 2 + `window.md` F6):** Fix G1 solved the Pass-1 returning-session boilerplate problem cleanly, but Codex over-generalised "returning session: skip reply-2 lines" into "act like a silent normal assistant unless asked." Meanwhile, `SKILL.md`'s top rule ("The work comes first, every turn.") still overrode `window.md`'s F6 pause ("New thread for this?" before starting a growing unrelated job). Both need one explicit sentence of priority: *except when offering a fresh thread before a growing unrelated job; and in returning sessions, still emit a short `Guide · <topic>` aside and one `Try:` line when a mechanism trigger fires.*
2. **`AGENTS.md` confirmed-level catch-22 (`text.md` Persistence 1 vs 2 / F11):** On L1 Turn 5, the guide correctly omitted the unconfirmed `plain` level from the preview quote block and asked to confirm it in the same turn. On Turn 6, obeying F11 strictly ("exact paragraph you showed, nothing more"), it saved only the style sentences and dropped the confirmed level. A small tweak to `text.md` — telling the guide to preview the optional level line explicitly when asking to confirm it, or confirm first before previewing — closes that gap cleanly.
3. **Human checklist vs agent check rule (`SKILL.md` Step 6):** At `plain`, asking "How would you check this?" naturally elicits offline physical checks ("print one copy, fold the voucher, ask staff to tick with a biro"). Saving those verbatim into `AGENTS.md` stores reminders for the *human* rather than instructions for future *agents*. Step 6 should distinguish: turn their domain check into what the *agent* should verify or flag before showing output (e.g., "Before showing a printable card, check margins/cut lines and remind me to verify the £2 voucher against my pouch cost").
4. **Pre-reply Codex commentary bubbles on Turn 2 (`SKILL.md` Reply 2 + `world.md` F5):** Even when the final Reply 2 obeys the ≤60-word / 4-line cap, Codex's visible pre-tool commentary bubbles (including an early 68-word F5 privacy block) almost tripled the text on screen on a `plain` learner's very first task. Either tighten early F5 on Reply 2 to 1–2 lines when invented data is already being used (reserving the full 4 sentences for when real data is about to enter or handover), or remind the agent not to narrate before Reply 2.
5. **Handover checklist drop-offs at `plain` (`window.md` Handover 5):** The handover block has 5 dense sub-items; under a "keep replies super short" preference, Codex cleanly kept items 1–4 and dropped the `Cmd/Ctrl+K` → **New project** how-to (F18) and the Claude Code/Codex qualifier on global install (F9). Putting the `New project` line only when the learner explicitly mentions a new/separate real project (as she did here) with a bold checklist cue would help it survive short-reply preferences.

### Which `moves.md` sentences would a learner at these levels actually reuse?

- **`plain` (small-shop owner — L1):**
  - **Would reuse immediately:**
    - `"Which parts of that did you guess?"` / `"What did you assume? List it."` — crystal clear, directly maps to invented stock prices and shift costs.
    - `"Show this as a chart."` / `"As a table."` / `"Bigger, and in [language/£]."` — natural, short, zero jargon.
    - `"Stop."` / `"Undo that."` — immediately memorable.
    - `"Use the mic button and ramble"` — hugely valuable for a busy shop owner between customers.
  - **Would struggle with or ignore:**
    - `"Start a fresh thread for this. Write me the first message for it first."` — she would naturally say *"let's start a new chat for my spice order — write me what to paste in"* rather than using "thread".
    - `"Put the files back the way they were in the snapshot, and show me."` — only usable if she knows what files exist; on a mostly inline-page session, "snapshot" feels abstract until she has real files she cares about.
    - `"Install the agentic-guide skill for all my projects."` — feels like a magic incantation at `plain` ("skill", "install").
- **`some` (lab biologist with Excel & a bit of R — L3):**
  - **Would reuse immediately:**
    - `"Show me the output that proves it works."` and `"Run it on five different inputs, including one that should break it."` — natural fit for someone writing R scripts / dilution calculators (echoed by `stopifnot` checks in `dilutions.R`).
    - `"@thread-name: what did it find? Compare it with what we have here."` and dragging a thread from the sidebar — genuinely high-leverage; immediately understood once shown with her €223 contingency / €3,696 budget diff.
    - `"Summarise what the next thread needs to know from this one, in one paragraph."` — directly solves her real pain point (long ELISA chat forgetting column headers).
    - `"Make me a page that shows what you did and how I could check it."` — fits bench/protocol work well.
  - **Less likely to reuse as written:**
    - `"Start a thread that does X while this one keeps going. Tell me when it's done."` / `"Ask another model for a second opinion..."` — feels premature in L3 before single-thread hygiene and `@`-referencing are habitual; better kept for L4/later.
    - `"While that runs: ..."` — only relevant once she hits genuinely slow analysis runs; fine to hold until a slow turn actually happens.
