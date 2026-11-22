# Round 2 Advice (Neon)

## Disagreements

1. **Item 2 (`html_preview` only when height is uncertain) — wrong call.** Keep `html_preview` → `html_render` mandatory. T3 Code's system prompt and `html_render` schema both require previewing first; contradicting them causes prompt conflict. Worse, `html_preview` catches JS errors, broken layout, and clipping before Reply 2 lands. One preview PNG in a short session is cheap; a broken first visual kills the pitch.
2. **Item 3 (`$agentic-guide` or plain fresh thread) — pick plain.** Starting Thread 2 with `$agentic-guide` muddles setup rules and undercuts proving `AGENTS.md` works alone. Finish "How would you check this?" and the handover *inside* Thread 1, then hand over a **plain, preference-free** opener (repeating the preference fakes the proof).
3. **Item 9 (install fallback).** Reuse an existing `practice` project or ask the user to pick it; don't blindly call `t3_project_create("practice")`, which collides with Step 3.1.
4. **"Not doing."** Agreed on Windows and no new features. Unpinned `main` is fine for lab tests, **not** public launch — pin a tag before shipping under `Full access`.

## Single most important thing

**Lock the Thread 1 → plain Thread 2 arc.** Copy bugs can be patched later; session architecture cannot. Learners must hit four beats cleanly: Reply 2's verified wow result → Reply 3's style tweak saved to `AGENTS.md` → checking and handover finished in Thread 1 → plain Thread 2 proving `AGENTS.md` carried over on its own.
