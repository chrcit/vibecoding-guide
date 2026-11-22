# Adapting the lessons to the picture-only layout

The shared layout is merged on `skill-and-mobile-lessons`: no chat screen, no caption, a speech bubble and a counter chip on the picture, the narration and readout in the step text, a stepper on phones (`site/src/journey/overlay.ts`, `steps.ts`, `run.ts`). Your job is to adapt a group of lessons to it.

Read first:
- [SPEC.md](SPEC.md), especially **For chapter authors**: the speaker map, `speakers`, `counter`, line lengths (bubble lines about 38 characters, chip about 24).
- The phone test report for your lessons ([test-opus.md](test-opus.md) for 1–7, [test-sol.md](test-sol.md) for 8–14, [test-neon.md](test-neon.md) for 15–21). It has, per step, what the old screen and caption said, what the reader needs, and a proposal for the minimal version in the picture. It also lists bugs to fix.
- `site/JOURNEY.md` for the rules of a chapter (one readout per chapter, numbers counted from what happened, one meaning per colour, levels).

Per lesson:
1. Delete every `ctx.screen` call. Anything the reader needs from it (a file name, a failed test, the tool sequence in lesson 6) moves into a bubble, a label on the picture, or the narration.
2. Make every step read in the picture alone: at most one bubble and one chip at a time, pointing at the right part, with no line cut mid-thought. Shorten lines; set `speakers` and `counter` where the defaults are wrong.
3. The step text (in `site/src/pages/journey/<id>.astro`) may get one short sentence if the picture lost something it can't carry. Keep JOURNEY.md's limits (a heading, two short sentences, one control).
4. Fix the bugs your test report names for your lessons, for example label overlaps, a caption number that doesn't match the readout, or lines printed twice.
5. Make the picture fill its stage: if a scene leaves a large empty band, adjust the camera or scene for that step, using only that chapter's settings.

Rules:
- Edit only your lessons' chapter scripts (`site/src/journey/chapters/<file>.ts`) and pages (`site/src/pages/journey/<id>.astro`). Don't edit `overlay.ts`, `run.ts`, `steps.ts`, `scene.ts`, `picture.ts`, `presets.ts`, `Journey.astro` or `journey.css`. Other agents are working in the same checkout. If a shared change is needed, describe it in your report with the exact diff you'd want.
- Another agent is redesigning the desktop left column and the lesson menu in its own worktree. Don't touch that.
- Don't commit, don't stop or restart any server. The shared dev server runs at `http://127.0.0.1:<port>/`; find the port with `portless list` (route `agentic-coding-guide-site`). It reloads on save.
- Check every step of every lesson you change at 390×844 and 1440×900, light and dark, with Playwright (pinned in `site/package.json`; never `--no-sandbox`), and look at the screenshots yourself. Save them under `~/.local/state/agent-artifacts/vibecoding-guide/journey-mobile/chapters-<group>/`. Be economical: a screenshot after each step's script has played is enough, plus extra ones where a control changes the picture.
- Run `cd site && npx astro check` or at least `pnpm build` once at the end. If the build fails because of another group's file, say so and don't fix it.
- Write `planning/journey-mobile/chapters-<group>.md`: per lesson, what changed, what you moved where, the bugs fixed, and anything left over.
