# Guide v2: lessons 7 and 8 (range `l7-8`)

Built from `lessons-3-8.md` ("Lesson 7", "Lesson 8") on 2026-11-23. Chapter 2, "Why it goes wrong", second half. Friday 19:00 to 22:45 at the Lantern. The cast is the script's: Sami (door), Noor and Kai (promoters), Ana Lopez, "Zed", Rico Vance (do-not-admit). The bar and rota threads are mentioned only in passing. All of it is made up.

## What I built

### Lesson 7, Your turn: where the agent stops for you

The lesson is one thread, "Do-not-admit list", with four turns. Each turn is a different request that moves the story forward. The script sent the same request four times, which `review-design.md` #3 warned against.

1. **It asks before it acts** (Supervised).
   - You switch the thread to Supervised, because the job sits next to tonight's real list.
   - The agent asks to run `node scripts/mark.js --live "Rico Vance"`. The approval appears as a row in the work log, and the sidebar row says **Approval**.
   - You decline by typing a reply. Your reply appears mid-turn as your own bubble.
   - It then asks for a file change, which you approve. Then it asks to run `npm test`: Supervised asks before every command.
2. **A question instead of a guess** (back in Full access).
   - The fork: hide do-not-admit guests from the search, or show them in red. T3 Code's question panel opens inside the composer and the row says **Input**.
   - You pick red. Preview: the door shows Rico's red row, and a tap on it counts nobody.
3. **A plan before the build.** The request asks for the plan in words. The reply is four numbered steps, and the row says Done. Step 3 is a guess, and you fix it in one sentence before any code exists.
4. **Ask first, then don't wait for me.**
   - Three questions come one at a time in the same panel ("1/3", "2/3", "3/3"). Then a 9m 30s run follows that needs nothing from you.
   - Preview: tapping Rico opens a sheet that says what to do: the reason, "nobody who came with them", and security on shift.

### Lesson 8, Proof you can read

The lesson is one thread, "Door ready for tonight".

1. **"Done." tells you nothing.** The work log fills, and the reply is "Done. Everything works." Three empty question cards appear on the tray.
2. **Ask for the proof.**
   - A follow-up asks for what changed, what was left out, the check output, and the door at phone size.
   - In Preview the agent tries four cases in the shared browser: Ana tapped in, Zed not listed, Ana refused a second time, Rico red. The bar reads "4 of 4 passed".
   - The reply has a "Not done: offline" line.
3. **When the reply and the log disagree.** One row is a red `Ran command` (the browser failed to start), and the reply says "All checks pass." `look: 'log'` marks the red row. The last point says to ask about the row, not the reply.
4. **The last check is yours.**
   - Practice mode in Preview: a yellow bar ticks off the four cases as the reader taps through them.
   - Practice really does leave tonight's arrivals alone. They are set aside on entry and restored on exit.
   - The human finding: Kai's coral list colour sits close to the do-not-admit red. You queue that for next Friday.

### The door app (extended; no existing stage changed)

- **New stages** (`preview/index.ts` `DoorStage`):
  - `listed`: Rico is on Noor's list, unmarked and still tappable.
  - `dna`: a red row with no tap-in.
  - `dnaFull`: a tap opens the "what to do" sheet.
  - `proof`: the agent's four-case run.
  - `practice`: practice mode.
- **New files:**
  - `preview/door/late.ts`: markup for the red row, the deck line, the sheet, the lists line and the practice bar.
  - `preview/door/proof.ts`: the four-case run, modelled on `door/agent.ts`.
  - `preview/door-late.css`.
- **`door/guests.ts`:** adds `LATER` (Rico Vance, Noor's list, +1), shown only from `listed` on. The comment there already said lesson 7 adds him.

## Shared-file changes (all additive, commented)

- **`v2/content.ts`** (types only):
  - `Point.ask?: Ask` and the `Ask` interface (header, question, options, pick, `of`).
  - `Row.approval?: { kind, until }`: a pending-approval row, shown from `at` until the point you answer.
  - `Row.you?: boolean`: your own message mid-turn.
- **`pages/v2/index.astro`:**
  - The work-log row map renders `you` rows as a bubble and `approval` rows in T3 Code's layout: the command in mono, "Waiting for approval", then Decline, Approve and More.
  - An empty `[data-ask]` box at the top of the composer.
  - Imports `styles/v2-stops.css`, plus one `shield` icon.
- **`v2/player.ts`:**
  - `fillTurn` hides an approval row once `point >= until`, and doesn't shine rows without a label.
  - A new `showAsk()` renders the question panel and is called from `show()`.
  - `statusKey` is generalised to `status.toLowerCase()`, so any T3 Code status word gets a key. Lesson 3's Goal will need the same.
  - An `input` icon (lucide MessageCircleQuestion) is added to `STATUS_ICON`.
- **`styles/v2-stops.css`** (new file rather than edits to `v2.css`, to merge cleanly): the approval row, your mid-turn bubble, the question panel, and the Input status colour (indigo, as in `SidebarThreadRow.tsx`).
- **`data/t3code.ts`:** a block of new facts after `claudePermissionsStillApply` (see below).
- **`preview/door.ts`:** small hooks for the new stages:
  - `pool()` for who is on tonight's lists;
  - `isDna()`;
  - a `dna` deck kind and `openDna()`;
  - the practice snapshot and ticks;
  - `startProof()`;
  - `deck()` and `view()` on the page object for the proof run;
  - `refusesSecondTap` also covers the later stages.

## New facts (`t3code.ts`, read on main at 7b47a21, 2026-11-23)

- **`approvalRow`.** A pending approval is a work-log row, not a panel above the composer. It reads "Waiting for approval" with Decline, Approve and More (Cancel, Always allow this session). Its aria labels are "Command approval" and "File change approval". Sources: `TimelinePendingApprovalRow.tsx` and `ComposerPendingApprovalActions.tsx`.
  - This contradicts the script and the task brief, which both expected an approval panel above the composer. `ComposerPendingApprovalPanel.tsx` exists only in the October clone; on main it is gone.
- **`declineWithText`.** A text reply declines a pending Claude approval. The composer placeholder then reads "Send feedback to decline this request".
- **`questionPanel`.**
  - The question opens inside the composer, with its header, the question, radio options and number keys 1 to 9.
  - Several questions come one at a time with an "n/N" count. The buttons read "Next question" and "Submit answers", and there is "Dismiss question without answering".
  - This answers the script's open point: several questions don't all show at once; they come one by one in the same panel.
- **`modeQuestions`.** Permission modes don't stop the agent asking questions.
- **`supervisedReads`.** Some read-only actions can go ahead in Supervised.
- **`proposedPlan`.** See the plan-mode answer below.

`guides/fact-check.md` is regenerated: 0 warnings, 0 errors.

## The plan-mode question (script's open question 1)

Read on main at 7b47a21:

- **No plan toggle in the composer.** The composer has no plan-mode switch.
- **No `/plan` in the web composer.** Its slash commands are model, side, btw and clear (`composer-logic.ts`).
- **No plan status in the sidebar row.** `resolveSidebarThreadStatus` has none.
- **"Plan Ready" only in the command palette.** It survives only in `resolveThreadStatusPill`, which only the command palette uses. It requires `interactionMode === 'plan'`, and on main the UI has no way to set that.
- **The "Proposed plan" card is real.** It appears when a provider hands over a formal plan. For example, `ClaudeAdapterV2.ts` captures Claude's ExitPlanMode as a `proposed_plan`.

So part 3 asks for the plan in words, draws the reply as text with the row at Done, and mentions the card only in the engineer note. I did not draw the card, because asking in words does not reliably produce it.

## Open questions

1. **Approval panel position.** The owner's brief said "approval and user-input panels above the composer". On main, only the question is in the composer; the approval is in the log. I drew what main does. If the owner wants the October look, that is a choice against the source.
2. **The 7.3 follow-up.** Your one-sentence fix to step 3 appears only in the composer words, not as a chat bubble. A follow-up after a reply is a new turn, and adding a fifth part just for it felt like padding. Lesson 7.4's lede says the plan was built.
3. **The 8.3 rerun.** "Ask about the row" is the last point of 8.3. The rerun's success is told in 8.4's lede rather than shown.
4. **Door clock.** The door app's clock still starts at 22:41 (the simulated night from lesson 2) while lesson 7 runs at 19:00. This is pre-existing.

## Critique log

### Round 1: three Haiku testers

The testers ran at 1440 light, 390 dark and 1024 dark. Screenshots are in `~/.local/state/agent-artifacts/vibecoding-guide/guide-v2/l7-8/haiku-1..3/`.

- **Real, fixed:**
  - At 7.2, the door said Rico was "Not on tonight's list" although 7.1 says he's on Noor's list. I added the `listed` stage, used through 7.1 and the first four points of 7.2. Now the reader can see that, before the mark, nothing stops Sami tapping him in. The 7.1 lede points at it.
  - The engineer-level claim "checkIn() refuses the guest on the server" had no log row behind it. I added it to the row's engineer detail.
  - The practice labels were clipped at 390 px. I shortened them.
  - The red pill crowded the name at 1024 px. I made it smaller.
- **Not real:**
  - The "clipped dock" and the "unclickable forward button" are Astro's dev toolbar and the dev-only comments button. They are not in the build.
  - "The do-not-admit sheet can't be closed": Escape and a tap outside both close it, and round 2 confirmed this.
  - "Anthropic advice without a source": it is in the part's sources (`harnesses.claudeCode.askForEvidence`).

### My own critique, before and after the testers

- Annotations anchored right of "you" ran across the gate rail ("you approve each action", "every action went past you", "“Done.”"). I moved them left of the gate. Tool annotations moved below their tool, and card annotations alternate above and below (v1's `proof.ts` approach).
- The plan reply was one run-on paragraph "1. … 2. …". I split it into one paragraph per step.
- The practice card was drawn in the `you` colour (black) and the coral-vs-red point vanished. It is now a tool card.
- "Kai's coral dots" assumed the reader knows Kai. It now reads "the coral dots that mark Kai's list".
- The script's 8.4 finding was "the search box is at the top, out of reach". That is false for this door app: the search sits in the thumb zone. I replaced it with something a reader can actually see in the Preview, Kai's coral near the do-not-admit red.

### Round 2: two Haiku testers (390 dark, 1440 light)

All five targeted checks passed: the unmarked Rico at 7.1, the red row at 7.2, the sheet at 7.4, the practice bar unclipped and fully ticked, and the question panel unclipped. No console errors and no sideways scroll at any size. The story was judged consistent from 7 to 8. After round 2 I moved the remaining labels by "you" left of the gate.

## What I still don't like

- **Card annotations still sit on neighbouring cards.** On the tray, "you try it", "coral, close to red" and "proof you can read" lie across the next card. A fix would need the engine's label placement, or fewer cards.
- **Lesson 8's picture without the project is lopsided.** The tray and tools are far apart, with lots of empty canvas. The tray never gets the room v1's `proof.ts` gave it.
- **The sidebar says Working while a lesson plays, even after a part's reply has landed.** That is the player's rule (Working = playing). The testers read it as stale.
- **The question panel on a phone takes about a third of the screen** above the controls. It is real T3 Code behaviour, but it squeezes the thread.
- **Approval rows show the buttons but never show which one you pressed.** The row just leaves the log, as on main. A reader may miss that the decline happened, apart from your bubble.
- **Your mid-turn reply sits inside the work log.** That is my guess at how T3 Code shows a sent message during a pending approval. I didn't find the exact timeline treatment.
- **The 7.3 fix and the 8.3 rerun happen between parts** and are told in the next lede, not shown.
- **The door clock (22:41) disagrees with lesson times (19:00 to 22:30).** This is pre-existing from lesson 2.
