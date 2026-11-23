# Moves

Sentences the learner can say. Offer one at a time, when the work calls for it, as a **Try:** line in an aside. Show it as words to reword, never as a command to memorise. Each group says what the move unlocks; the mechanism behind it is in `mechanisms/`.

After they've used a move once, say in one line that it was just a sentence, and that they can write their own.

## Check it

Unlocks: checking, the learner's actual job. The agent says "done" in the same tone whether it worked or not; these make it prove it. Offer after a result that matters, or when you said done without running anything.

- "Show me the output that proves it works."
- "How would you check this? Do that before you show me."
- "Make me a page that shows what you did and how I could check it."
- "Which parts of that did you guess?"

## Try it N times

Unlocks: verification in the learner's own terms. Lands hard with anyone who knows statistics or experiments. Help them write their own version, then offer to save it to `AGENTS.md`.

- "Before you come back to me, try it five times and show me where it goes wrong."
- "Run it on five different inputs, including one that should break it."
- "Do it three different ways and tell me which you'd pick and why."

## Fresh thread

Unlocks: one job, one thread; clean context for real work. Offer at a second, unrelated request, or before their real work.

- "Start a fresh thread for this. Write me the first message for it first."
- "Summarise what the next thread needs to know from this one, in one paragraph."

Only start a thread when they ask.

## Ask another thread, reference a thread

Unlocks: orchestration. Needs two or more threads and the window mechanism first. T3 Code only (in text mode, say so in one line).

- "@thread-name: what did it find? Compare it with what we have here."
- Drag a thread from the sidebar onto the message box, then: "Read this thread and tell me where it got stuck."
- "Start a thread that does X while this one keeps going. Tell me when it's done."
- "Ask another model for a second opinion on this, and show me where they disagree."

Message or start other threads only when asked.

## Make me a page

Unlocks: any view of their work, on demand, worth the tokens. No feature needed; it's a sentence.

- "Make me a page of what you did today and where to look first."
- "Show this as a chart." / "As a table." / "Bigger, and in German."
- "Turn these questions into a form I can click through."
- "Draw how the parts of this fit together."

### The recipe (for you, the agent)

One inline page per reply at most. In T3 Code:

1. Write self-contained HTML: inline `<style>` (and `<script>` only if it needs one), no CDNs or network calls, semantic markup, a short text summary for screen readers, `prefers-reduced-motion` respected. Values and quoted output come from the tool output, copied, never retyped or trimmed. Derived numbers (differences, shares, bar widths) come from a run too: add them to the script's output first.
2. Theme: use T3's variables, never fixed colours: `--foreground`, `--muted-foreground`, `--card`, `--border`, `--primary`, `--accent`, `--success`, `--warning`, `--destructive`, `--chart-1` to `--chart-6`, `--radius`, `--font-sans`, `--font-mono`. Text on a `--primary`, `--accent`, `--destructive` or `--warning` background uses that colour's `-foreground` (`--accent-foreground`). Give each a fallback (`var(--border, #d4d4d8)`) so the page also works opened as a file. Never declare a T3 variable under its own name: `:root{--card: var(--card, #18181b)}` is a cycle that drops the theme. Use `var(--card, #fallback)` where it's used, or a prefixed alias (`--g-card: var(--card, #fallback)`).
3. Layout: no background on `html`, `body` or the outer element; no outer card, border, banner title or side padding. No `vh` units and no `height: 100%` on `html` or `body` (T3 rejects them or loops). Lay out for about 390px wide: fluid widths, tables with more than 4 columns stack or scroll inside their own box, chart labels stay readable at that width. Charts get fixed pixel heights. A box with its own background gets 16px padding and `var(--radius)` corners.
4. Call `html_preview` with the HTML inline. It returns a picture, `contentHeight` and console output. Fix any error, clipped text or overflow and preview again. Preview again after every later change too, before rendering; never guess the height. If `contentHeight` is over 2000, split the page or ask which part comes first.
5. Call `html_render`. The HTML you render is exactly the HTML you last previewed. For interactive pages, size the height to the tallest state. Pass a short `title`, and `height` set to that `contentHeight` (80 to 2000).
6. Don't announce or restate the page in your reply. Write no page file into the project unless they ask.

If `html_preview` itself fails (its browser cannot start), estimate the height: about 24px per line of text plus each chart's fixed height. Say the page may be cut off, and offer text.

## Undo, stop, what did you assume

Unlocks: recovery. Teach early, before anything goes wrong. Mistakes are cheap while nothing has left the machine.

- "Stop." (or the stop button while it works)
- "Undo that." After a Git snapshot: "Put the files back the way they were in the snapshot, and show me." Git restores the files the snapshot holds; a file created since then stays until it is removed, which is a separate step.
- "Take a snapshot of these files first." (The agent lists them and commits only on yes.)
- "What did you assume? List it."
- "What does this do, and why do you need it?" (before approving something they don't follow)
- In T3 Code, **Edit from here** under an earlier message rewinds the conversation; files only in worktree threads.

## Keep going without waiting

Unlocks: never waiting. Offer when they're watching a long run.

- Type the next thought now: it queues or steers the running turn.
- "While that runs: …"
- Use the mic button and ramble; it's faster than typing. (Voice needs a one-time choice in **Settings → Voice**.)

## Install globally, later

Unlocks: the guide in every project, for Claude Code and Codex, not just in the practice folder. Offer at the end of the first session, not before.

- "Install the agentic-guide skill for all my projects." The agent copies this skill folder into two places in the home folder, `.claude/skills/agentic-guide` and `.agents/skills/agentic-guide`, with whatever the machine has (`install.sh --global` does it on macOS and Linux). It replaces only an earlier agentic-guide there, stops at anything else, and shows that both copies hold a `SKILL.md`. Offer it when a new project folder is next, with this sentence, used as written: "The guide works in a project when it's installed there, or in every project once it's installed in your home folder; that works in Claude Code and Codex." The saved preference stays with the project whose `AGENTS.md` holds it.
- "Whenever I ask how something works, use the agentic-guide skill." (Offer to add that line to `AGENTS.md`.)
