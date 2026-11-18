# Figures

One house style for every figure on the site. The house skill at `../skills/figures/SKILL.md` walks an agent through building one; this file holds the rules and numbers.

Two figures are the references to copy: Fig. 2, the loop (`src/components/fig/loop/`), and Fig. 8, a meter and a tank (`src/components/fig/meter-tank/`). Look at both on the review page, `/dev/figures/`, before you start.

## Two modes

- **Object.** An isometric SVG object whose parts are the parts of the idea: a small machine or scene. Use it for anything about how something works.
- **Chart.** A flat chart in the same frame, tokens and line weights. Use it when the figure shows measured data (a score against a cost, a time horizon). Never force data into isometric.

## The frame

Every figure sits in `Figure.astro`. From top to bottom:

| Part | Rule |
|---|---|
| Number | `Fig. 8`, mono, muted. Links to the figure's anchor, `#fig-8`. |
| Title | A few words, serif, 20px, no full stop. |
| Hint | One line that says what to do: "Drag the slider to add hours of steady work." |
| Drawing | The object or chart. Its text alternative (`alt`) says what the first frame shows. |
| Legend | Only at narrow widths: the label names, numbered. |
| Control | At most one: step buttons, one slider, or one toggle (`.seg`). Hidden until the script runs. |
| Readout | The current state in words, in full sentences. It is the `aria-live="polite"` region. |
| Caption | Optional, true and short: the lesson in two or three sentences. |
| Source | Required when the figure shows data. Given as `source={{ label, href }}`. |

The root carries `data-figure="<n>"` and `id="fig-<n>"`. A comparison of two objects uses two `Pane`s inside `<div class="fig-panes">`: side by side when wide, stacked when narrow, at one shared scale.

## Objects

**Camera.** Fixed for every figure: azimuth 45°, elevation 30°. The kit has no way to change it.

**Parts.** 12 to 25 per figure. A part that carries no meaning goes. No screws, knurls, rulers or label plates unless they say something (the tank's fill marks say "this is a level").

**World units.** Roughly one unit per pixel at a 640px drawing. Plates are 90 to 200 units across; a station or housing 30 to 45; the smallest part that must read at 390px is about 6 units.

**Tones.** Defined in `fig.css` from the site tokens, three times (light, system dark, forced dark). Never write a colour in a figure.

| Tone | Used for | Light | Dark |
|---|---|---|---|
| `top` | top faces, the default fill | `--card` | ink 17% over card |
| `left` | faces towards the light | ink 8% over card | ink 10% over card |
| `right` | faces away from it | ink 17% over card | ink 5% over card |
| `shadow` | faces turned furthest away | ink 27% over card | `--card` |
| `base` | plates and plinths (`tone: 'base'`) | darker, from `--paper` | from `--paper` |
| `lit` | the one part to watch (`tone: 'lit'`) | from `--accent` | from `--accent` |
| water | levels in glass (`.k-water`) | from `--blue` | from `--blue` |
| pass | a check that passed | `--green` | `--green` |

One lit part per pane. Green and blue only for state and data. Light faces get darker as they turn from the light; dark faces fall towards the page colour.

**Lines.** Outlines `--fig-edge` at 1.25px; creases and detail `--fig-line` at 1px; faint marks `--fig-faint` at 1px; lit and state lines 2px. All strokes are `non-scaling-stroke`, so they keep their width at any size.

**Corners.** Plates `r: 8` to `14`, blocks `r: 2` to `3`, glass `r: 0`. The frame is 14px, like `.widget`.

**Labels.** No text inside the SVG. Labels are HTML laid over the drawing at kit anchors (`anchor()`), mono, 14px. Below a 34rem frame width they become numbered keys and the names move to the legend. A label sits above or beside its part, never on a face.

**Size budget.** Drawing 640 × 400 or less (a pane 340 × 290). The object fills 55 to 65% of it. Build-time SVG stays under 40 kB per drawing or pane (Fig. 2 is about 37 kB). Cylinders default to 24 sides; raise it only for a part drawn large.

## Charts

`kit/chart.ts`: `linear`, `log`, `yAxis`, `xAxis`, `series`, `points`. Draw once at build time for the no-JS frame, then redraw at the drawing's real pixel width so labels are a true 13px (see `fig/sample/`). Gridlines faint, axis 1px, series 2px, the series to watch in `lit`. Follow the `dataviz` skill for the choice of form.

## Text, motion, input

- No text below 13px at any width. The check measures SVG text at its rendered size.
- No tiny uppercase labels.
- Motion: `transform` and `opacity` only. Moving parts are drawn once at rest and moved with `shift()`; a level drops by translating the water inside a clip (`glass()`); a needle turns with CSS `rotate` inside `planeMatrix()`. Transitions 400 to 600ms with `--fig-ease`; a path move up to 1.4s.
- Under `prefers-reduced-motion` nothing autoplays and state changes jump. Scripts set `--fig-ms: 0ms`.
- Every control works from the keyboard and is at least 40px. Use real `<button>` and `<input>` elements.
- The readout updates once a slider settles (about 350ms), not on every step of a drag.
- Examples are the three running examples in `AGENTS.md`. No pendulums.
- No price, limit, score or date in a figure. They arrive as props from `src/data/`. A review page passes illustrative values and says so in the source line.

## Building a figure

1. Write the spec in the component's header comment: the idea in one sentence, three to seven elements, the states, the data source, the one interaction, the alt text.
2. Write `model.ts`: a pure module with the states (or a function of the control's value) and a `describe()` that turns a state into the readout. The drawing and the words both read from it.
3. Invent the object. Say in one sentence what moves and what the motion means. List the parts; stop at 25.
4. Write `draw.ts`: plan the world, `fit()` the drawing, build each part with the kit, paint back to front (`byDepth` when it matters), wrap moving parts in groups with `data-*` hooks and `class="k-move"`. Return the SVG, label anchors and the motion constants.
5. Write the `.astro` component: `Figure` with the drawing, labels, control, first readout and caption, plus one `<script>` that loops over every instance, unhides the control and moves the hooks.
6. Add it to `src/dev/figures.astro` with illustrative props.
7. Run `pnpm check-figures` and read every screenshot in `.figures/shots/`, light and dark, 390 and 1280, first frame and after. Then try it with the keyboard only and with reduced motion on.

## Checklist

- [ ] The object is the explanation; a reader names what it is at a glance.
- [ ] 12 to 25 parts, one lit part per pane.
- [ ] Frame complete: number, title, hint, drawing with alt, one control, readout, caption, source if data.
- [ ] First frame makes sense with no JavaScript.
- [ ] No colour outside the tones; both themes designed and looked at.
- [ ] No text below 13px; labels move to the legend when narrow; no sideways scroll at 390px.
- [ ] Keyboard only works; focus ring visible; readout announces the change.
- [ ] Reduced motion: nothing moves on its own; changes jump.
- [ ] No hard-coded price, limit, score or date.
- [ ] `pnpm check-figures` passes, and `pnpm judge` in both base paths.

## The seventeen figures

| # | Figure | Mode | The object |
|---|---|---|---|
| 1 | Three agents, one of you | object | Three small terminals on a desk, one cursor arm that swings between them. |
| 2 | The loop | object | A round track past read, act and check stations; the task leaves through a gate when the check passes. Built. |
| 3 | The window fills up | object | A glass container on a scale; files, tool output, connectors and skills drop in as blocks, compaction presses them down. |
| 4 | Same prompt, with and without context | object | Two identical workbenches, one with a drawer of notes open; the two recorded outputs sit on each. |
| 5 | Steer or queue | object | Two conveyor belts of work; a correction joins the running belt or waits at the next one's start. |
| 6 | You are the bottleneck | object | Several belts feeding one inspection desk; finished boxes pile up in front of it. |
| 7 | How long a task can be | chart | Time horizon against release date, linear to log toggle, the 80% line. |
| 8 | A meter and a tank | object | An API meter with a coin stack beside a tank that drains, refills on a clock and draws on a weekly trough. Built. |
| 9 | What your plan runs | chart | A grid of plan against model; a cell opens its rule and source. |
| 10 | Score against cost | chart | Scatter of score against price, filter to what a plan includes. |
| 11 | The effort dial | chart | Two models' curves of score against effort, cost in money and in share of a window. |
| 12 | Six ways to run a team | object | Pipework between agent stations in six layouts; tokens flow through, a gauge shows the burn. |
| 13 | One bug, three judges | object | The holiday hours page on three benches: no judge, a test rig, a browser on a stand. |
| 14 | Noise and bias | object | A target board; reruns land as pins round a spot, and the hidden assumption moves the spot. |
| 15 | The summary and the diff | object | A note card beside an open drawer of changed lines; the drawer holds what the card left out. |
| 16 | How a skill loads | object | A shelf of closed cards showing labels; a request arrives and one card opens onto the bench. |
| 17 | What you can wire in | object | A panel of sockets; plugging one in adds tools to a rack and takes room in the window from Fig. 3. |

## Credit

The kit in `src/components/fig/kit/iso.ts` is adapted from the iso-kit in [Anatomy](https://skills.wheresryan.sh/anatomy) by Ryan (@wheresryan22), MIT licence, kept in `kit/LICENSE-anatomy.txt`. The site's version fixes the camera, cuts the parts library to what the figures use, and derives every tone, light and dark, from the site tokens in place of Anatomy's own grey palette.
