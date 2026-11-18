# Building the site

Rules for anyone, person or agent, who changes the site. The repo-wide rules in `../AGENTS.md` still apply; this file adds what is specific to `site/`.

## What the site is

A dashboard you learn from by poking at it. The owner's words: "more like an analysis dashboard: everything a bit tighter, less text, and more of the illustrations actually showing something, being a bit deeper, and allowing for more boundary testing", "concepts explained to me visually in different examples", "click something, and it opens up like a side view, which I can maximize, minimize, and then close again".

Three rules follow from that, and they outrank habits you bring from writing articles:

1. Picture first. A concept is shown by something the reader can operate, with controls that go to the extremes (one agent and sixteen, an empty context window and a full one, the cheapest plan and the dearest), so they can find where it breaks. Words come second and stay short.
2. We tell people how; we do not explain everything. The guide teaches the reader to use a machine that can explain things at their own level. Give the move and the prompt. The long explanation is one click away in the side view, never in the way.
3. "Cut taglines, helper text and secondary labels. If a screen needs them to make sense, fix the layout." No line under a title, no hint under a control ("drag the slider"), no caption that repeats the picture, no label on top of a label.

## Boards

The start page, the explainers, the model pages and the home page are boards: `src/layouts/Board.astro`, a title and a 12-column grid of tiles.

```astro
<Board title="Orchestration" description="…" section="explain">
  <Tile title="Sixteen agents, one of you" span={8} side="wiki/parallel-work/">…figure…</Tile>
  <Tile title="What it costs" span={4}><dl class="stats"><Stat name="Tokens" id="tok">1.2M</Stat></dl></Tile>
  <Tile title="Cache reads" span={6} level="engineer">…</Tile>
  <Verified slot="foot" ids={factIds} />
</Board>
```

- `Tile` (`src/components/board/Tile.astro`): `title` states the point in a few words; `span` is columns out of 12; `side` adds the button that opens a page in the side view; `level` shows the tile to readers at or above `technical` or `engineer` only. Same board for everyone, more tiles and controls as the level goes up; never a different path per level.
- A tile holds one thing: a figure, a control strip, a few stats, a prompt to copy. At most about forty words of running text. If you need more, it belongs in a wiki article or the page's long read, opened in the side view.
- Parts in `src/styles/board.css`: `<Stat>` in `<dl class="stats">`, `.controls` and `.control` for sliders and selects, `.pick` for one-of-several, `.finding` for the sentence a script rewrites as the reader moves a control, `.hot` for a numbered marker on a drawing, `<Explain to="wiki/…">word</Explain>` for a word that opens in the side view.
- A figure inside a tile uses `<Figure bare …>`: the tile is the frame and carries the title.
- Board text is set in `--sans` at 16px; numbers in `--mono`. The serif is for page titles and the long reads.

### The side view

`src/components/site/SideView.astro`, one instance in `Base`. Anything with `data-side` opens in it: a link (`<a href={url('wiki/worktree/')} data-side>`), or any element, SVG parts included (`<g data-side={url('…')} tabindex="0" role="button" aria-label="…">`). It shows the target page in a frame with the site chrome removed, and has minimise, maximise, open-as-page and close. Use it for every "what is this" moment: a term, a part of a drawing, a number's source. Do not write the explanation into the board.

### The long read

Each explainer keeps its full text at `/explain/<slug>/read/` on the `Article` layout, with the reader levels. The board links to it once, through the side view. Sourced facts and the three levels live there; the board shows the same facts through `<Fact>` and the data files.

## The judge

Nothing is done until this passes, from `site/`:

```sh
pnpm judge                                    # check-facts, build, check-dist, check-links
BASE_PATH=/agentic-coding-guide/ pnpm judge   # the same under a sub-path
```

Every internal link goes through `url()` from `src/lib/nav.ts` so both runs pass. Commit small, in the imperative ("Add the plans explainer"). Never push or open a pull request unless the owner asks.

## Stack

Astro 5 building static HTML, TypeScript, plain CSS, small client scripts in Astro `<script>` tags. No UI framework and no CSS framework.

Dependencies stay few. Pin exact versions that are at least two weeks old. Ask the lead before adding one. Today: `astro`, and `playwright` as a dev dependency for the figure checks. `three` is approved for the home hero and the showcase only, loaded on demand.

## Where things live

| Path | What | 
|---|---|
| `src/layouts/Base.astro` | The one page shell |
| `src/layouts/Board.astro`, `src/components/board/`, `src/styles/board.css` | Boards: the dashboard pages |
| `src/layouts/Article.astro` | Long reads, wiki articles, reference |
| `src/styles/global.css` | Tokens and base styles |
| `src/components/site/` | Header, footer, boxes, cards, copy-prompt, terms |
| `src/components/level/` | Reader levels |
| `src/components/data/` | Components that render sourced facts |
| `src/components/fig/` | Figure frame, drawing kit, the figures. See `FIGURES.md` |
| `src/components/legacy/` | First-version figures, kept only until each is replaced |
| `src/data/` | Everything that goes out of date. See `../UPDATE.md` |
| `src/pages/essays/` | The author's first-person essays, on the `Essay` layout |
| `src/dev/` | Review pages, routed at `/dev/<name>/` in `astro dev` only |
| `integrations/` | Dev-only comment tool, dev pages |
| `scripts/` | The checks |

Shared wiring belongs to the lead: `astro.config.mjs`, `package.json`, `src/layouts/Base.astro`, `src/lib/nav.ts`, `src/content.config.ts`. If your work needs a change there, make the smallest one you can and say so in your report.

## Design

Tokens are CSS custom properties in `global.css`: `--paper`, `--card`, `--ink`, `--ink-2`, `--muted`, `--rule`, `--accent`, `--accent-soft`, `--green`, `--green-soft`, `--blue`, `--blue-soft`, `--serif`, `--mono`, `--measure`, `--gutter`. Use them; never write a raw colour in a component. Each colour is defined three times (light, system dark, forced dark), so add new ones in all three places.

- One accent colour. Green and blue are for data and state, used sparingly.
- No text below 13px anywhere, figure labels included. Body text is about 19px.
- Prose lines stay within `--measure`.
- Works at 390px wide with no horizontal scroll. Wide tables and code scroll inside their own box.
- Light and dark both designed, not inverted.
- Everything works from the keyboard, with a visible focus ring.
- Motion respects `prefers-reduced-motion`. Animate `transform` and `opacity` only.
- Touch targets are at least 40px.
- No tiny uppercase labels above headings. No tagline under a title, no helper text, no secondary labels.

## Reader levels

Three levels, stored in `localStorage` under `acg-level`, mirrored to `data-level` on `<html>` before first paint:

| id | The reader says |
|---|---|
| `plain` (default) | Vibe coding. I have no idea what I'm doing. |
| `technical` | Some technical background. I use a terminal, know Git and basic deployment. |
| `engineer` | Serious engineer. Give me the full weight. |

On a board, the level adds tiles and controls (`<Tile level="engineer">`). In a long read or a wiki article, every section leads with the plain explanation, which everyone sees, and deeper material goes in a block tagged with the lowest level it is written for:

```astro
<Deeper level="technical" title="What a token is">…</Deeper>
<Deeper level="engineer" title="Cache reads and why they dominate">…</Deeper>
```

In markdown the same thing is a blockquote: `> [!technical] What a token is` followed by the content.

A reader at or above the block's level sees it open. A reader below it sees the first two lines and a button to open it. All text is always in the HTML, so search engines, the `.md` twins and readers without JavaScript get everything. `<ForLevel is="plain">` shows content to one level only. Use it for wording (a prompt that speaks to the reader's level), never to send levels down different paths: everyone does the same exercises, and higher levels get more on top.

Write the plain layer so it stands alone. A deeper block may not be the only place a fact a beginner needs is stated.

## Facts and data

A page never hard-codes a price, limit, score, version, date or product claim. It reads it from `src/data/`, where every entry carries its source:

```ts
{ value: 20, source: 'https://…', verified: '2026-11-18', status: 'verified' }
```

`status` is `verified` (checked against a primary source), `observation` (someone's dated, attributed measurement) or `unverified` (do not publish without the lead's say). `pnpm check-facts` fails the build when an entry lacks a source or date. The `/sources/` page is generated from the same files.

Fundamentals (how a loop works, what context is) stay in prose and stay free of numbers that expire.

## Opinions

The guide states sourced facts. It does not rank labs or models in its own voice, and never says "X is better for Y".

- The owner's own opinions go in an `<Opinion>` box, visibly his, with a date. Only opinions the owner has given. The essays under `/essays/` are his views throughout and say so at the top; they still rank labs or models only where he has approved the opinion for print (`src/data/observations.ts`).
- A practitioner's estimate goes in an `<Estimate>` box with the person's name, a link and the date, kept apart from the sourced facts.

## Writing

Plain and human. The site should practise what it preaches.

- Say the thing. Short sentences, concrete nouns, British spelling.
- No hype, no doom. The tone is a dry field report.
- No "not X but Y", no groups of three for rhythm, no one-line closers, no rhetorical questions as headings, no em-dash habit, no bold labels starting list items.
- Explain a term the first time it appears, in the sentence that uses it.
- Run the `humanizer` skill over prose before you commit it, if you have it.
- Quote sparingly and attribute. Cite videos by URL; do not copy long passages.

## The running examples

All examples are fictional. Use these three so the guide feels like one piece:

- **The club list.** A small web app where a neighbourhood football club tracks which members have paid this season. A form, a list, a database, a login. The build-something example.
- **The holiday hours bug.** A bakery's website shows the wrong opening hours on public holidays. The fix-something and check-the-work example.
- **The contact tidy.** A script that cleans a messy exported contact spreadsheet: duplicates, mixed date formats, stray whitespace. The automation example.

No pendulums, no to-do apps.

## Privacy

This repo is public. No real names of private people, no employers, research topics, hostnames or email addresses. Public figures and projects are credited by name with a link.

## Review pages and checks

`pnpm dev` serves review pages under `/dev/` (registered when the server starts, so restart it after adding one). To look at your work in a real browser, use Playwright (`import { chromium } from 'playwright'`) against the dev server and take screenshots at 390px and 1280px, light and dark. Look at them before you say a visual change is done.
