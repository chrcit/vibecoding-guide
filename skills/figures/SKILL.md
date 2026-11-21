---
name: figures
description: Build or rework a figure for the Agentic Coding Guide site in its house style, a pared-down isometric object (or a flat chart for measured data) in one shared frame, using the kit in site/src/components/fig/. Use whenever a task adds, replaces or polishes a figure, diagram, interactive explainer or chart on the site, including the legacy figures in site/src/components/legacy/.
---

# Figures for the Agentic Coding Guide

Every figure on the site is one small object whose parts are the parts of the idea, drawn in one fixed isometric camera, in one frame, with one control and a readout in words. Data figures are flat charts in the same frame. The style is adapted from [Anatomy](https://skills.wheresryan.sh/anatomy) by Ryan (@wheresryan22, MIT), pared down to 12 to 25 parts.

## Read first

1. `site/FIGURES.md`: the rules, tone table, sizes and the list of seventeen planned figures. It wins over anything here.
2. `site/AGENTS.md`: site rules (tokens, 13px minimum, running examples, no hard-coded facts).
3. The two references: `site/src/components/fig/loop/` (step buttons) and `site/src/components/fig/meter-tank/` (slider, two panes). Copy their file layout: `model.ts`, `draw.ts`, `<Name>.astro`.
4. The kit: `site/src/components/fig/kit/iso.ts` and `chart.ts`. Both are short; read them whole.

## Rules that are easy to break

- The object is the explanation. No boxes-and-arrows diagram, no floating slabs standing for "layers".
- 12 to 25 parts. Cut any part that carries no meaning.
- Fixed camera. Never add a rotation or a different elevation.
- Colours only through kit tones and `fig.css` variables. One lit part per pane (`tone: 'lit'`).
- No text in the SVG. Labels are `Label`s at `anchor()` points; they fall back to numbered keys and a legend when narrow.
- Motion is transform and opacity only, and jumps under reduced motion.
- At most one control. The readout is full sentences and comes from `model.ts`.
- Prices, limits, scores and dates arrive as props from `site/src/data/`. Examples are the club list, the holiday hours bug or the contact tidy.

## Steps

1. Spec in the component's header comment: one-sentence idea, three to seven elements, states, data source, the one interaction, alt text.
2. `model.ts`: pure states plus `describe(state)` for the readout.
3. Invent the object; say what moves and what that means; list the parts.
4. `draw.ts`: `fit()` the world into the drawing, build parts with `box`, `cylinder`, `pipe`, `glass`, `arrow`, `annulus`, paint back to front, wrap moving parts in groups with `data-*` hooks and `class="k-move"`. Return the SVG, labels and motion constants.
5. `<Name>.astro`: `Figure` (or `Pane`s for a comparison) with drawing, labels, control, first readout, caption, source. One `<script>` that handles every instance on the page, unhides `[data-fig-control]`, and moves the hooks.
6. Add it to `site/src/dev/figures.astro` with illustrative props, labelled as illustrative.

## Checks

From `site/`:

```sh
pnpm check-figures          # screenshots and checks every [data-figure]
pnpm judge
BASE_PATH=/agentic-coding-guide/ pnpm judge
```

Then open the screenshots in `site/.figures/shots/` (390 and 1280, light and dark, first frame and after) and look at them as the owner would: would he show this in a video? Is it obviously the same style as Fig. 2 and Fig. 8? Is the point clear before reading the caption? Try it with the keyboard only and with reduced motion. Go through the checklist at the end of `site/FIGURES.md` before you call it done.
