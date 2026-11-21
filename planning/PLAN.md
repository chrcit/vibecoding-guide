# Agentic Coding Guide: plan for the next version

Proposal dashboard, 18 November 2026. Branch `next-version-plan`, based on `agentic-coding-guide @ f20e1a2`. Nothing here is built yet. The interactive version is [dashboard.html](./dashboard.html); both files are generated from `plan.data.mjs` by `node planning/build.mjs`.

**Decided.** Owner answered all twelve questions on 2026-11-18: pared-down Anatomy figures everywhere with no trial; Playwright allowed for checks; sourced facts only, with the owner's own opinions in a marked box; practitioner estimates in a marked box; plain level first with a picker offered once; hand-written graph and `three` for the hero and showcase only; web-foundation guides rewritten at three levels; Artificial Analysis numbers refreshed by hand; fresh demo pieces for the showcase; hosting moves to Cloudflare; foundations first.

## Where the current version falls short

- Most figures are a paragraph dressed as a widget. `Stack` is three tabs of text, `Ladder` is an accordion, `Triangle` and `Proxy` are static pictures. Only `Horizon`, `Attention`, `Thinking` and `ModelPicker` are driven by real data or a real simulation.

- The cost figures price everything at API list rates and default to Fable, although nothing earlier explains API billing against a subscription, and most readers start on a $20 plan. `Orchestra` ends in a monthly figure in the thousands of dollars that means nothing on a plan.

- Six figures reuse the same pendulum physics example. It suits one kind of reader and shuts out beginners.

- Model names and prices are typed into six components separately. There is no single dated data file, so the next model release means hunting through the code.

- Text inside figures is 10 to 12 px. It is hard to read at 390 px and unreadable in a video.

- The essay states "Anthropic for judgement, OpenAI for grinding" as a working split. You asked for no claims of that kind.

- There is nothing on connectors and MCP, no account of nested subagents or cross-provider handoff, no voice tooling, no T3 Code page of its own, and "Theo" is named in the essay without a link.

- Search and sharing basics are missing: no canonical link, social image, sitemap, robots file or structured data.

## Principles for the next version

- Plain explanation first, at every level. The deeper layer is offered after it, with a two-line extract showing what is in there.

- Assume a $20 plan. Top models and big teams are shown as something you grow into, with what each plan realistically allows.

- Fundamentals carry no numbers. Every price, limit, score and feature lives in a typed data file with a source and a "last verified" date.

- No lab-against-lab verdicts in our own voice. Opinions are attributed to a named person with a link, and the reader is shown how to run their own comparison.

- One figure style across the site, lighter than a showpiece illustration, legible in a video frame.

- Every source credited where it is used and again in one reference list.

- The site follows its own advice: no small uppercase labels over headings, no tagline under every title, prose that reads like a person wrote it.

## Ranked changes

Score = impact squared ÷ (effort + accuracy risk), each on a 1 to 5 scale. Higher is better. Accuracy risk is the chance the item ships something wrong or soon stale. The roadmap orders by dependency as well as score.

| # | Change | Group | Impact | Effort | Risk | Score | Phase |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Typed data files with a source and a "last verified" date** (F1) | Foundations | 5 | 2 | 1 | 8.3 | Phase 2a: foundations |
| 2 | **Take out the lab-against-lab claims** (C9) | Content | 4 | 1 | 1 | 8.0 | Phase 2a: foundations |
| 3 | **Fact-check page generated from the data, with a build check** (F2) | Foundations | 4 | 2 | 1 | 5.3 | Phase 2a: foundations |
| 4 | **Dev-only comment tool** (F5) | Foundations | 4 | 2 | 1 | 5.3 | Phase 2a: foundations |
| 5 | **Design system pass** (F6) | Foundations | 4 | 2 | 1 | 5.3 | Phase 2a: foundations |
| 6 | **Search and sharing basics** (D1) | Distribution | 4 | 2 | 1 | 5.3 | Phase 2c: wiki and reach |
| 7 | **Reader levels, saved in the browser** (F3) | Foundations | 5 | 3 | 2 | 5.0 | Phase 2a: foundations |
| 8 | **One figure style, settled by a three-way trial on one figure** (F4) | Foundations | 5 | 3 | 2 | 5.0 | Phase 2a: foundations |
| 9 | **Link every named person, tool and source** (C11) | Content | 3 | 1 | 1 | 4.5 | Phase 2a: foundations |
| 10 | **Copy buttons on prompts, and one page listing every prompt** (X6) | Experience | 3 | 1 | 1 | 4.5 | Phase 2c: wiki and reach |
| 11 | **Credits and a reference list** (D3) | Distribution | 3 | 1 | 1 | 4.5 | Phase 2c: wiki and reach |
| 12 | **The basics, rebuilt as six layers** (C3) | Content | 5 | 4 | 2 | 4.2 | Phase 2b: the core |
| 13 | **Explainer: skills, and which to install** (C6) | Content | 4 | 2 | 2 | 4.0 | Phase 2b: the core |
| 14 | **Explainer: a subscription and the API are different ways to pay** (C1) | Content | 5 | 3 | 4 | 3.6 | Phase 2b: the core |
| 15 | **Explainer: the orchestration layer** (C2) | Content | 5 | 4 | 3 | 3.6 | Phase 2b: the core |
| 16 | **Rebuild the figures** (X1) | Experience | 5 | 5 | 2 | 3.6 | Phase 2b: the core |
| 17 | **A page of its own for T3 Code** (C4) | Content | 4 | 2 | 3 | 3.2 | Phase 2b: the core |
| 18 | **Voice input, with the tools named** (C8) | Content | 3 | 1 | 2 | 3.0 | Phase 2b: the core |
| 19 | **Replace the pendulum with examples a beginner can follow** (C10) | Content | 3 | 2 | 1 | 3.0 | Phase 2b: the core |
| 20 | **Graph view of the wiki** (X3) | Experience | 3 | 2 | 1 | 3.0 | Phase 2c: wiki and reach |
| 21 | **A first hour that branches by level** (X7) | Experience | 3 | 2 | 1 | 3.0 | Phase 2b: the core |
| 22 | **`llms.txt` and a markdown twin of every page** (D2) | Distribution | 3 | 2 | 1 | 3.0 | Phase 2c: wiki and reach |
| 23 | **A video-ready pass** (D6) | Distribution | 3 | 2 | 1 | 3.0 | Phase 2d: showcase and polish |
| 24 | **Explainer: connectors and MCP** (C7) | Content | 4 | 3 | 3 | 2.7 | Phase 2b: the core |
| 25 | **Turn the markdown reference into a wiki** (X2) | Experience | 4 | 4 | 2 | 2.7 | Phase 2c: wiki and reach |
| 26 | **Model cards** (C5) | Content | 4 | 3 | 4 | 2.3 | Phase 2b: the core |
| 27 | **Showcase pages** (X4) | Experience | 3 | 3 | 1 | 2.3 | Phase 2d: showcase and polish |
| 28 | **Some 3D in the main experience** (X5) | Experience | 3 | 4 | 1 | 1.8 | Phase 2d: showcase and polish |
| 29 | **A script that refreshes the Artificial Analysis numbers** (D4) | Distribution | 3 | 2 | 3 | 1.8 | Phase 2c: wiki and reach |
| 30 | **Decide what happens to the web-builder and web-foundation guides** (D5) | Distribution | 2 | 2 | 1 | 1.3 | Phase 2d: showcase and polish |

### What each change is

#### Foundations

**F1 · Typed data files with a source and a "last verified" date** (rank 1, Phase 2a: foundations)

Move every model, price, plan, limit, benchmark score and tool feature out of the components and the prose into `site/src/data/*.ts`. Each entry carries `value`, `source`, `verified` and a status (verified, observation, unverified). Figures and tables import from there and nowhere else. A short `UPDATE.md` gives the procedure for a model release.

Why: This is what lets the guide survive next month. A release becomes an edit to one file and a rebuild.

Risk: Low. The work is mechanical: the numbers already exist in the fact-check table.

**F2 · Fact-check page generated from the data, with a build check** (rank 3, Phase 2a: foundations)

Keep the claim, status, source table as the source-of-truth pattern, but render it from the data files plus a small file of prose claims. Add `pnpm check-facts` to the build judge: it fails when an entry has no source or date and warns when a date is older than 45 days. Apply the ten corrections listed under Research.

Why: Today the table and the figures can drift apart without anyone noticing. Generated, they cannot.

Risk: Low.

Needs: F1

**F5 · Dev-only comment tool** (rank 4, Phase 2a: foundations)

An Astro integration that is only registered when the command is `dev`. Select text on any page, press a key, type a comment. It is written to `comments/<page>/<id>.json` by a Vite dev middleware. `pnpm comments` prints the open ones as a task list for an agent. Design is in its own section below.

Why: It makes your review of every later phase cheaper, so it should exist before the content does.

Risk: Low. A build check asserts that nothing from it reaches `dist/`.

**F6 · Design system pass** (rank 5, Phase 2a: foundations)

Raise figure text to at least 14 px. Stronger colour contrast that survives video compression. Self-hosted fonts in place of the render-blocking Google Fonts link. Remove the patterns you ban: mono chapter numbers used as labels, a subtitle under every card title. Fix `Term` so a definition is not read twice by a screen reader and can be closed on touch.

Why: The current palette is fine in print and weak on screen. This is the base every figure sits on.

Risk: Low.

**F3 · Reader levels, saved in the browser** (rank 7, Phase 2a: foundations)

Three levels with your wording in the picker. Stored in `localStorage` inside try/catch and applied before first paint as `data-level` on the root element. Every section opens with the plain version, shown to everyone. Deeper blocks are tagged for the technical or the engineer level: at or below your level they are open, above it they show a two-line extract and a button. Nothing is removed from the HTML, so search engines, language models and screen readers get everything. `?level=` in the URL overrides for sharing and recording.

Why: One text cannot serve a beginner and a staff engineer. The extract is what pulls a beginner one layer down.

Risk: Writing cost: each section needs a plain layer that stands alone. A weak plain layer makes every level worse.

**F4 · One figure style, settled by a three-way trial on one figure** (rank 8, Phase 2a: foundations)

Build the plans-and-API figure three ways before committing to anything: a pared-down Anatomy object (12 to 25 parts, SVG only, fixed camera), a flat diagram in the diagram-design manner, and the current hand-rolled style at a larger type size. Pick one, then write `site/FIGURES.md` (tokens, card frame, type sizes, motion rules) and a small house skill that every figure build must read.

Why: You asked for one style and not too much detail. Anatomy has no light mode of its own and resists cutting parts, so the trial tells us whether a wrapper is enough or a fork is needed before 15 figures depend on it.

Risk: Anatomy checks its work with headless Chrome. See the questions.

#### Content

**C9 · Take out the lab-against-lab claims** (rank 2, Phase 2a: foundations)

Remove "Anthropic for judgement, OpenAI for grinding" from the essay, the guide and the fact-check table, and delete the `ModelPicker` quiz that marks the reader wrong for disagreeing. Replace with a short method: run the same task on two models and compare the diffs.

Why: You asked for it. Theo's own picks changed three times across the 41 videos I read, which is a good argument that such claims do not keep.

Risk: None.

**C11 · Link every named person, tool and source** (rank 9, Phase 2a: foundations)

A small registry (`site/src/data/links.ts`) of canonical URLs. A build check flags a known name in prose that is not linked on its first mention on a page. Fixes "Theo" in the essay.

Why: My reading of "fee is not linked". It also keeps the credits complete without anyone remembering to.

Risk: None. The current `youtube.com/@theo` link is correct.

**C3 · The basics, rebuilt as six layers** (rank 12, Phase 2b: the core)

Replace the 16-chapter essay with a shorter home page organised on the six layers from Emily Campbell's article: interface, context, harness, model, governance, emergence. One figure per layer and a link into the explainer and wiki for each. The long-form habits (never wait, read the diff, aim higher) move into the wiki, where they can be linked one at a time.

Why: Sixteen chapters is a list. Six layers is a model a reader can hold in their head, and it gives every other page a place.

Risk: Rewriting loses some good paragraphs unless they are moved, not deleted.

Needs: F3, F4

**C6 · Explainer: skills, and which to install** (rank 13, Phase 2b: the core)

At `/explain/skills/`: what a skill is, how only the name and description sit in context until one is needed, where the folders are for each agent, how to install and invoke, how to write one. Then recommended skills with author, licence and install line: Humanizer, Grill Me (and its newer sibling `grilling`), Be Ambitious (Felix Rieseberg's article plus the two published skills built on it), Anatomy, and the ones this site was built with.

Why: The current skills page is a table. The mechanism is the interesting part and the current figure teaches a wrong one.

Risk: Low to medium. Install commands change.

**C1 · Explainer: a subscription and the API are different ways to pay** (rank 14, Phase 2b: the core)

Its own page at `/explain/plans-and-api/`. A plan is a flat fee against limits that refill: a five-hour window and a weekly allowance. The API is a meter. The page covers what "usage" means, why model choice and effort level change how fast it drains, what happens at the limit, the $20, $100 and $200 tiers at both labs, and which models each tier runs. Every later mention of cost links here.

Why: You named this as the gap. The orchestration, effort and model figures all depend on it.

Risk: High. Anthropic publishes no figure for what a plan holds; OpenAI publishes only estimated message ranges per five hours. The page has to say so and work in relative units, with practitioner estimates in a marked box.

Needs: F1, F4

**C2 · Explainer: the orchestration layer** (rank 15, Phase 2b: the core)

Its own page at `/explain/orchestration/`. Thread, parallel threads, subagent, subagent of a subagent, orchestrator and workers, a small model calling a large one for advice, a second lab reviewing, cross-provider handoff. For each pattern: what it is, when it earns its overhead, what it costs on a plan and on the API, and how it goes wrong.

Why: The current guide has one paragraph and one calculator. The docs now state the mechanics precisely (a Claude Code subagent can spawn its own, three layers deep; every subagent counts against the same limits), so this can be exact.

Risk: Medium. Agent teams and the T3 Code orchestrator are still changing.

Needs: C1

**C4 · A page of its own for T3 Code** (rank 17, Phase 2b: the core)

At `/t3-code/`: what it is, how it differs from a harness, setup, threads and worktrees, queue and steer, inline pages, remote machines and the phone app, cross-provider handoff, permission modes, and where it hits walls. Feature claims come from the data file with the version they were checked against. Theo and the project are linked at first mention.

Why: You asked for it, and the guide is written around this tool.

Risk: Medium. T3 Code ships weekly. The data file and a version stamp keep the page honest.

Needs: F1

**C8 · Voice input, with the tools named** (rank 18, Phase 2b: the core)

A wiki article and a short section in the interface layer: why dictating intent works when dictating code does not, the built-in options (Claude Code `/voice`, T3 Code's microphone with a local model, the ChatGPT desktop app) and third-party tools with price and whether audio stays on the machine.

Why: Talking is the first habit the guide teaches, and it names no tool for it.

Risk: Low. Prices come from each tool's own site and are dated.

**C10 · Replace the pendulum with examples a beginner can follow** (rank 19, Phase 2b: the core)

Each figure gets a fictional scenario anyone can picture (a booking page, a list of cafés, a CSV of orders). The physics example stays in one place, at the engineer level, where it makes the point about shared wrong assumptions.

Why: Six figures on one physics problem is the main reason the essay reads as written for one person.

Risk: Low.

**C7 · Explainer: connectors and MCP** (rank 24, Phase 2b: the core)

At `/explain/connectors/`: what MCP is in one sentence, the difference between a tool, a connector and a skill, where servers are configured in Claude Code and Codex, the official registry and the directories, what a connector costs in context, and the safety rule (a connector gives the agent your access).

Why: The capabilities layer is missing entirely today.

Risk: Medium. OpenAI has started calling its packaging "plugins"; names are moving.

**C5 · Model cards** (rank 26, Phase 2b: the core)

One short card per model at `/models/<id>/` and an index. Each card: what the maker says it is for, list price, which plans include it, context window, effort levels, its Artificial Analysis score and cost per task, and "where to verify" links. No field is filled without a source; an empty field says "not published".

Why: It gives the model facts one home that is designed to be refreshed.

Risk: High. This is the most perishable page on the site. It is safe only because it is generated from dated data.

Needs: F1

#### Experience

**X6 · Copy buttons on prompts, and one page listing every prompt** (rank 10, Phase 2c: wiki and reach)

A `Prompt` component for the essay and a matching treatment for quoted prompts in the wiki. `/prompts/` collects every prompt on the site, grouped by layer.

Why: The guide is full of prompts worth stealing and none can be copied in one tap.

Risk: None.

**X1 · Rebuild the figures** (rank 16, Phase 2b: the core)

Seventeen figures in the settled style, listed in the Figures section: four kept and polished, eight reworked, five new. Each is driven by a small model module so the picture and the numbers cannot disagree, works by keyboard, goes still under reduced motion and reads at 390 px.

Why: This is the largest single piece of work and the one your verdict was about.

Risk: Time. A careful figure is one to three hours of agent work plus your review. Built in order of the roadmap, with the cost figures first.

Needs: F4, F1

**X3 · Graph view of the wiki** (rank 20, Phase 2c: wiki and reach)

A build step reads the links between articles and writes `graph.json`. `/wiki/graph/` draws it on a canvas with a small hand-written force layout, coloured by layer. Each article shows its own neighbourhood. A plain list of links sits underneath for keyboard and screen-reader use.

Why: You asked for it, and it is the cheapest "wow" on the list because the data falls out of the wiki for free.

Risk: Low. About 200 lines, no dependency.

Needs: X2

**X7 · A first hour that branches by level** (rank 21, Phase 2b: the core)

Replace the single seven-step checklist with three paths: chat app only, a command-line agent, T3 Code with two threads. Progress is saved in the browser.

Why: The current checklist assumes a terminal, which is exactly what the first level does not have.

Risk: Low.

Needs: F3

**X2 · Turn the markdown reference into a wiki** (rank 25, Phase 2c: wiki and reach)

Split the long guides into about 50 short articles, one idea each, at `/wiki/<slug>/`. Ordinary relative markdown links between them, so they still read on GitHub. Each page lists what links to it. The six web-foundation guides move in as they are, as one cluster.

Why: A 317-line page cannot be linked to from a figure. A page called "Queue and steer" can.

Risk: Splitting is mechanical, but the link checker has to stay green throughout.

**X4 · Showcase pages** (rank 27, Phase 2d: showcase and polish)

`/showcase/` with four subpages: 3D playgrounds, mini apps, web pages, automations and tools. Each entry: what it is, the prompt that started it (with a copy button), how long it took, what had to be fixed by hand. Built as a content collection so entries are added as files.

Why: Readers need to see what is possible before they believe the rest.

Risk: Needs material from you. Ships with placeholders until then.

**X5 · Some 3D in the main experience** (rank 28, Phase 2d: showcase and polish)

One piece on the home page, and one or two in the showcase. Loaded only when scrolled into view, with a still image as fallback and under reduced motion.

Why: It is the moment someone screenshots.

Risk: Weight and taste. A 3D library is the first real dependency the site would take on. See the questions.

Needs: F4

#### Distribution

**D1 · Search and sharing basics** (rank 6, Phase 2c: wiki and reach)

Canonical links, Open Graph and Twitter tags, a generated social image per page, `sitemap.xml`, `robots.txt`, structured data, a `theme-color`, and page titles that say what the page is. `SITE_URL` switches everything to the new domain when it arrives.

Why: A domain is coming and none of this exists.

Risk: Low.

**D3 · Credits and a reference list** (rank 11, Phase 2c: wiki and reach)

`/sources/` generated from the data files: every source, what it is used for, and when it was last checked. A credits section for people whose ideas the guide uses (Emily Campbell, Theo, Felix Rieseberg, Matt Pocock, the skill authors, Artificial Analysis, METR).

Why: It is a free resource built on other people's work. Artificial Analysis also requires visible attribution for its data.

Risk: None.

Needs: F1

**D2 · `llms.txt` and a markdown twin of every page** (rank 22, Phase 2c: wiki and reach)

`/llms.txt` following llmstxt.org, and each page also served as clean markdown at the same URL with `.md` appended, which is part of that proposal. The wiki twins are the source files; the essay and explainer twins are generated with every level expanded.

Why: People will ask a model about this guide more often than they will read it.

Risk: Low. I would skip `llms-full.txt`: it is not in the proposal.

Needs: X2

**D6 · A video-ready pass** (rank 23, Phase 2d: showcase and polish)

Check every figure in a 1920 by 1080 frame and at 390 px: type size, contrast, a clean state to open on, a `?level=` and `?figure=` URL that lands on it. Add a presenter mode that hides the page chrome.

Why: You want this to be something Theo would put on screen.

Risk: Low.

**D4 · A script that refreshes the Artificial Analysis numbers** (rank 29, Phase 2c: wiki and reach)

`pnpm refresh:aa` pulls index scores and prices from the free Artificial Analysis API into the data file, shows a diff, and updates the dates. Run by hand at each model release.

Why: The benchmark figures are the ones you said hold up. This keeps them current in a minute.

Risk: Medium. The free tier allows 100 requests a day and does not obviously expose tokens used or cost per task, which two figures need. Those may stay manual.

Needs: F1

**D5 · Decide what happens to the web-builder and web-foundation guides** (rank 30, Phase 2d: showcase and polish)

Six guides from the Vibe Coding 101 era (web concepts, full-stack, authentication, version control, cloud, web rules) plus the v0 and Lovable page. Keep as a wiki cluster, rewrite, or retire.

Why: They are a third of the word count and were not part of your brief.

Risk: Low. Needs a decision, not work.

## Information architecture

The structure follows [The Layers of AI experience](https://emilycampbell.co/writing/layers-of-ai-experience) by Emily Campbell (3 June 2026), the article you pointed me to. She describes six layers; four are how an AI product is composed and two are the conditions it runs in. They map onto this guide almost without bending, and they give every page a place. The model is credited where it is introduced and paraphrased, not copied.

| Layer | In the article | In the guide | Pages |
| --- | --- | --- | --- |
| **Interface** | Where people direct and oversee the AI | Chat app, command line and the agent workspace. Threads, voice, queue and steer, pages rendered in the thread. Moving from directing to overseeing. | Home part 1, `/t3-code/`, wiki: voice input, queue and steer, threads |
| **Context** | What the system knows and infers about you | The first message, raw material, `AGENTS.md`, the context window and what happens when it fills. | Home part 2, wiki: context window, context files, definition of done |
| **Harness** | Connectors, tools, skills, agents | The loop that turns text into actions. Tools, connectors and MCP, skills, subagents and orchestration. | Home part 3, `/explain/orchestration/`, `/explain/skills/`, `/explain/connectors/` |
| **Model** | Training, capabilities, behaviour | What a model is, effort levels, benchmarks and their limits, how to compare two models on your own work. | Home part 4, `/models/` |
| **Governance** | Rules, standards and preferences | What you pay and what limits you: plans against the API. Permissions and sandboxes. Privacy and work data. | Home part 5, `/explain/plans-and-api/`, wiki: permissions, privacy |
| **Emergence** | Variance and unknown behaviour, found through use | Why you cannot trust a summary. Giving the agent a judge, running it more than once, reading the diff, a second model as reviewer. | Home part 6, `/explain/verification/` |

Three kinds of page hang off this. The home page is the showcase: six parts, one figure each, plain first. Explainers go deep on one mechanism with a figure at the top. Wiki articles are short, one idea each, and link to each other; the graph view is drawn from those links.

## Route map

| Route | What it is | Source | Status |
| --- | --- | --- | --- |
| `/` | The basics as six layers. Hero, level picker, one figure per layer, links onward. | `src/pages/index.astro`, rewritten | rewrite |
| `/start/` | Choose a level; a first hour that branches by level. | new page, `OneHour` reworked | new |
| `/explain/plans-and-api/` | Subscription against API billing; tiers, windows, what usage means. | new; numbers from `data/plans.ts` | new |
| `/explain/orchestration/` | Every pattern from one thread to a cross-lab team, with cost on a plan and on the API. | new; replaces the `Orchestra` chapter | new |
| `/explain/skills/` | The skill system and recommended skills with credit. | `skills-table.md`, rewritten | moved |
| `/explain/connectors/` | MCP, connectors, tools; what you can wire in and what it costs. | new | new |
| `/explain/context/` | The context window, context files, what to put in the first message. | from `ways-of-working.md`, `agentic-coding.md` | moved |
| `/explain/verification/` | Judges: tests, a browser, repeated runs, a second model. What no loop can judge. | from `ways-of-working.md` | moved |
| `/t3-code/` | The dedicated T3 Code page. | `guides/t3-code.md` + `data/t3code.ts` | moved |
| `/models/` | All models compared: score against cost, filtered by plan. | `data/models.ts`, `data/benchmarks.ts` | new |
| `/models/[id]/` | One card per model. | generated from data | new |
| `/wiki/` | Index of articles by layer, with search. | replaces `/guide/` | moved |
| `/wiki/[slug]/` | One idea per article, with backlinks and a local graph. | `wiki/*.md` in the repo root, split from `guides/` | moved |
| `/wiki/graph/` | Graph of every article and link. | built from the markdown links | new |
| `/showcase/ and four subpages` | What people have built, with the prompt and the honest cost. | content collection, placeholders at first | new |
| `/prompts/` | Every prompt on the site with a copy button. | collected at build | new |
| `/sources/` | Fact-check table, reference list, credits. | generated from data; replaces `guides/fact-check.md` | moved |
| `/llms.txt, /*.md` | Index for language models and a markdown twin of each page. | generated | new |
| `/guide/...` | The old reference routes. | removed; the site has not been deployed publicly, so no redirects are owed | removed |

## Reader levels

- The picker uses your wording: "Vibe coding: I have no idea what I'm doing", "Some technical background: I use a terminal, know Git and basic deployment", "Serious engineer: give me the full weight". It sits in the top bar and is offered once, without blocking, on a first visit.

- Saved as `acg-level` in `localStorage`, read inside try/catch by an inline script before first paint, so there is no flash. With storage blocked the page still works and simply forgets.

- Every section is written in up to three layers. The plain layer is always shown, to everyone, first. Layers at or below your level are open. Layers above show a two-line extract and a button that opens that one block without changing your level.

- Figures read the level too: the diff figure shows "what the summary said against what changed" in plain words at level one and real TypeScript at level three.

- In the essay this is a `<Deeper level="engineer">` component. In wiki markdown it is a quoted block starting `[!engineer]`, which GitHub renders as an ordinary quote.

- All text is in the HTML at every level, so nothing is hidden from search, from language models or from a screen reader. Without JavaScript every layer is open.

## Figures

Seventeen figures. The audit read every current component; its short verdict is in the "old figure" column. Sizes: S is under an hour of agent work, M one to two, L three or more. Each figure names the one thing the reader does with it.

| # | Figure | Lesson | Form and interaction | Data | Fate of the old one | Size |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **Three agents, one of you** | Work runs in parallel; your attention does not. | Home hero. Three terminals fill while one cursor moves between them. The 3D piece if we do one. | none | `Hero`: rework. The pill text is unreadable in a video. | L |
| 2 | **The loop** | A harness turns a model's text into actions and feeds the result back. | One request travels model → tool call → result → model. Step through it or let it run. | none | `Stack`: replace. It is three tabs of text. | M |
| 3 | **The window fills up** | Context is finite, and everything loaded takes room: files, tool output, connectors, skills. | A container that fills as a session runs. Add a connector, read a file, watch the room go. Then compaction. | context sizes from `data/models.ts` | `ContextMeter`: rework. It crosses items off a list and shows no consequence. | M |
| 4 | **Same prompt, with and without context** | Context changes the result more than the model does. | Two recorded outputs side by side for one request; toggle what the agent was told. | recorded once, kept as files | new | S |
| 5 | **Steer or queue** | A correction can enter the running turn or wait for the next one. | Two timelines side by side; send one message and compare how much work is thrown away. | none | `ThreadSim`: keep and polish. Real mechanism, too many clicks. | S |
| 6 | **You are the bottleneck** | Past a few threads, finished work queues behind your review. | Time runs; the queue visibly builds as you add threads. | a real queue simulation | `Attention`: keep and animate. The second-best figure today. | S |
| 7 | **How long a task can be** | The length of task models can finish has doubled about every four months. | The axis morphs from linear to log; an 80% line shows why checking still matters. | METR, dated; they stopped updating in September 2026 | `Horizon`: keep and animate. | S |
| 8 | **A meter and a tank** | The API bills per token. A plan is a tank that refills every five hours and every week. | Pick a plan and a model, press work, watch each drain. Relative units only, with the published multipliers. | `data/plans.ts`; only what the labs publish | new. The explainer you asked for. | L |
| 9 | **What your plan runs** | Which models each tier includes, and where the top model costs extra. | A grid of plan against model. Tap a cell for the rule and its source. | `data/plans.ts` | new | S |
| 10 | **Score against cost** | Models sit on a curve of capability against price; most of the curve is cheap. | A scatter. Filter to "included on my plan". Tap a point for the card. | Artificial Analysis, with attribution | `ModelPicker`: rework. Shows score or price, never both; the quiz goes. | M |
| 11 | **The effort dial** | Higher effort buys a little more for a lot more. | Turn the dial; two models' curves on one chart; cost shown both in dollars and as share of a window. | Artificial Analysis per-effort data | `Thinking`: keep the data, change the framing. | M |
| 12 | **Six ways to run a team** | Each orchestration pattern has a shape, a price and a failure mode. | Choose a pattern; tokens flow through it; a gauge shows the burn on a $20 plan, a $200 plan and the API. | `data/plans.ts`, `data/models.ts` | `Orchestra`: replace. It defaults to Fable and reports API dollars. | L |
| 13 | **One bug, three judges** | An agent is as good as what it can check its work against. | The same bug with no judge, with tests, with a browser. Three outcomes side by side. | none | `VerifyLab`: rework. Clever but crowded. | M |
| 14 | **Noise and bias** | Running it again removes noise, never a mistake every run shares. | Dots pile up around the wrong answer; flip the hidden assumption and the pile moves. | simulated in the page | `MonteCarlo`: rework with a scenario that needs no physics. | M |
| 15 | **The summary and the diff** | The summary is the agent's opinion. The diff is the work. | Find what the summary left out. Plain-language version at level one, real code at level three. | none | `DiffReview`: keep for engineers, add the plain version. | M |
| 16 | **How a skill loads** | Only the label is in context until a task matches it. | A shelf of cards showing labels only; a request arrives, one card opens. Then the same task with the skill off and on. | recorded outputs | `SkillEditor`: rework. It teaches a word-overlap rule that is not how loading works. | M |
| 17 | **What you can wire in** | A connector gives the agent a new set of actions, and takes context to describe them. | A panel of sockets: plug one in, the agent's tool list grows and the window from figure 3 shrinks. | `data/connectors.ts` | new | M |

### House style and tooling

- **Cut:** `Ladder` (an accordion; becomes prose with before and after screenshots), `Proxy` (two static pictures), `Triangle` (decoration). Their points survive as wiki articles.

- **My recommendation for the style:** objects, in the Anatomy manner, but pared down. Same fixed camera, solid shaded parts, one lit part the eye should follow, no words inside the drawing, numbers in a readout driven by the same model that moves the parts. 12 to 25 parts where Anatomy asks for 40 to 80. SVG only: no shaders and no turning 3D outside the showcase.

- **Charts** (figures 7, 10, 11) stay flat but share the frame, the inks, the line weight and the type, following the method in the dataviz skill. One card frame for everything: title, hint and live readout in fixed places.

- **Why not Anatomy as it comes:** its smallest size is 40 to 80 parts and 30 to 90 minutes, its own page says it will not trade detail for speed, and it has no lighter mode. Asking it to draw less contradicts its instructions, so the dependable route is a house skill in this repo that wraps its kit (MIT, credited) with our own size table and tokens.

- **Why not all flat diagrams:** they are quicker and safer, and they are what every other explainer looks like. They would not give you the video moment.

- **One style is enforced by files, not by intent:** `site/FIGURES.md` (tokens, frame, sizes, motion, the 390 px rule), a figure spec template (one-sentence idea, three to seven elements, states, data source, the one interaction, alt text), and a build check that figure components import colours only from the tokens.

- **Motion** follows the rules in Emil Kowalski's animation skills: time-based, interruptible, off when out of view, a still final frame under reduced motion.

### Figure skills compared

| Skill | By | Output | Good for | Against | Verdict |
| --- | --- | --- | --- | --- | --- |
| [Anatomy](https://skills.wheresryan.sh/anatomy) | Ryan (@wheresryan22), MIT | Isometric SVG objects; optional WebGL and 3D | Abstract ideas as a machine you can operate. The strongest "wow" of any candidate. No site dependency. | 40+ parts minimum, 30 min to hours per figure, no light mode. Checks need headless Chrome. | **Use, pared down**, through a house skill. Full detail for one or two showcase pieces at most. |
| [diagram-design](https://github.com/cathrynlavery/diagram-design) | Cathryn Lavery, MIT | Inline SVG in one HTML file; about 45 diagram types | Semantic colour tokens, reveal and step motion, contrast checked, reduced-motion aware. Fast. | Boxes and arrows, however well drawn. PNG export uses Playwright (not needed for SVG). | **Fallback style** and the second entry in the trial. |
| [concept-diagrams](https://github.com/NousResearch/hermes-agent) | Nous Research, MIT | Flat SVG | Strict restraint: two or three hues, two type sizes, no gradients. Closest to "clear and elegant". | No motion or accessibility guidance. Not checked first-hand beyond its listing. | Borrow its rules for `FIGURES.md`; do not install. |
| [dataviz](https://skillsdirectory.com/skills/gtapps-dataviz) | gtapps (a copy is already installed here) | Method for charts in any library or plain SVG | Chooses the chart form first, validates the palette for colour-blind separation and contrast, designs dark mode on purpose. | Charts only; says so itself. | **Use** for the three data figures. |
| [Emil Kowalski's animation skills](https://github.com/emilkowalski/skills) | Emil Kowalski, MIT (installed here) | Guidance; no drawing | When to animate, easing, interruption, performance, what to remove. | Does not make figures. | **Use** for the motion pass. |
| [visual-explainer](https://github.com/nicobailon/visual-explainer) | Nico Bailon, MIT | Self-contained HTML with SVG | Good for throwaway architecture and diff explainers in a thread. | Built for one-off pages, not a site's house style. Sheets need Playwright. | Recommend in the guide as a working tool; not for the site. |
| [impeccable](https://github.com/pbakaus/impeccable) | Paul Bakaus, Apache-2.0 (installed here) | Design audit and polish commands | Catches the tics you ban. Writes a design reference file. | Not a figure maker. | Use for the design system pass (F6). |
| [Remotion skills](https://github.com/remotion-dev/skills) | Remotion | Video | Clips for a YouTube video. | Not on-page. Adds React. Licence terms for larger companies. | Not for the site. Possibly later for a trailer. |
| [r3f-best-practices](https://skills.sh) | emalorenzo (licence not shown) | WebGL via React Three Fiber | Real 3D for showcase pieces. | Brings React and three.js. Small project. | Only if you want true 3D in the showcase; see the questions. |

## Fast-changing data and stable fundamentals

Two kinds of content with different lifetimes. The first changes with every release and is kept as data. The second should read the same in a year and contains no model names, prices or version numbers at all.

| File | Holds | Source | When it changes |
| --- | --- | --- | --- |
| `site/src/data/models.ts` | Model id, maker, release date, context window, effort levels, list prices, maker's own description | Anthropic and OpenAI model and pricing pages | Each model release |
| `site/src/data/plans.ts` | Tiers, prices, multipliers, window rules, which models each includes, what happens at the limit | Claude and ChatGPT pricing and help pages | When a lab changes plans; check monthly |
| `site/src/data/benchmarks.ts` | Artificial Analysis index, per-effort scores, tokens and cost per task; METR horizons | Artificial Analysis API and pages; METR results file | Each model release |
| `site/src/data/t3code.ts` | Version checked, supported agents, features, limits, install commands | T3 Code README and user docs | Monthly; it ships weekly |
| `site/src/data/harnesses.ts` | Claude Code and Codex: skill folders, context files, subagent rules, permission modes, voice | Official docs | Monthly |
| `site/src/data/skills.ts` | Recommended skills: author, licence, repository, install line | Each repository | Quarterly |
| `site/src/data/connectors.ts` | Example connectors, registries, where each agent configures them | modelcontextprotocol.io, lab docs | Quarterly |
| `site/src/data/observations.ts` | Practitioner numbers, each with who said it, where and when | Linked videos and write-ups | When worth adding |
| `site/src/data/links.ts` | Canonical URL for every named person, tool and source | Their own sites | Rarely |

- Every entry has the shape `{ value, source, verified, status }`. `status` is verified, observation or unverified, the same three the fact-check table uses now.

- Fundamentals (the loop, context, verification, orchestration patterns, review) are written without a single model name or price. Where an example needs one, it reads it from data, so the sentence updates itself.

- A practitioner's number is never shown as a fact. It appears in a marked box with the name, the link and the date. Theo's own estimates of what a $200 plan is worth range from about $8,000 to $14,700 a month across the videos I read, which is the reason.

- `UPDATE.md` is one page: what to open when a model ships, which script to run, which figures to look at, and how to stamp the new date.

- `pnpm check-facts` joins the build judge alongside `check-links`.

## The dev-only comment tool

- **Only in dev.** The integration is added in `astro.config.mjs` only when the command is `dev`. It injects one small script and registers one endpoint. A build check greps `dist/` for its marker and fails if found.

- **Using it.** Select text on any page and press `c` (or use the button that appears by the selection). Type the comment, press Enter. Existing comments on a page show as highlights with a count in a corner panel. Works by keyboard.

- **Where it goes.** `POST /__comments` is handled by a Vite dev middleware that writes `comments/<page-slug>/<timestamp>-<short-id>.json` at the repo root. One comment per file, so two sessions never conflict and Git shows each one.

- **What a comment holds.** The page route, the quoted text with about 40 characters before and after (so it can be found again after edits), the nearest heading, the source file when the page is a wiki article, the active reader level, the viewport width, the comment, a timestamp and `status: open`.

- **How an agent uses them.** `pnpm comments` prints open comments grouped by source file as a checklist. The agent fixes one, sets `status: resolved` with a one-line note of what it did, and commits both.

- **What it will not do.** No accounts, no network, no database, nothing on the deployed site. If the quoted text can no longer be found, the comment is listed as orphaned, not dropped.

- **Size.** About 150 lines of client script and 60 of middleware. No dependency.

## Roadmap

### Phase 2a: foundations

Everything later phases stand on, plus the quick fixes. Nothing here changes what a reader sees much.

- F1 Typed data files with a source and a "last verified" date
- C9 Take out the lab-against-lab claims
- F2 Fact-check page generated from the data, with a build check
- F5 Dev-only comment tool
- F6 Design system pass
- F3 Reader levels, saved in the browser
- F4 One figure style, settled by a three-way trial on one figure
- C11 Link every named person, tool and source

Done when: the data files exist and the old figures read from them; levels switch on the current essay; the figure style is chosen from the trial; you can comment on any page in dev; the build judge passes with `check-facts` added.

### Phase 2b: the core

The explainers you asked for and the rebuilt home page, with their figures. Cost and orchestration first.

- C3 The basics, rebuilt as six layers
- C6 Explainer: skills, and which to install
- C1 Explainer: a subscription and the API are different ways to pay
- C2 Explainer: the orchestration layer
- X1 Rebuild the figures
- C4 A page of its own for T3 Code
- C8 Voice input, with the tools named
- C10 Replace the pendulum with examples a beginner can follow
- X7 A first hour that branches by level
- C7 Explainer: connectors and MCP
- C5 Model cards

Done when: a reader on a $20 plan can go from the home page to knowing what their plan runs and what a team of agents would cost them, at any of the three levels.

### Phase 2c: wiki and reach

The reference becomes a linked wiki with a graph. The site becomes findable by people and by models.

- D1 Search and sharing basics
- X6 Copy buttons on prompts, and one page listing every prompt
- D3 Credits and a reference list
- X3 Graph view of the wiki
- D2 `llms.txt` and a markdown twin of every page
- X2 Turn the markdown reference into a wiki
- D4 A script that refreshes the Artificial Analysis numbers

Done when: every old guide page has a home in the wiki, the graph draws, and the site passes a search and sharing audit on the new domain.

### Phase 2d: showcase and polish

What you can build, some 3D, and a pass for video.

- D6 A video-ready pass
- X4 Showcase pages
- X5 Some 3D in the main experience
- D5 Decide what happens to the web-builder and web-foundation guides

Done when: every figure holds up in a 1080p frame and the showcase has real entries.

## Research gathered

### The article

[The Layers of AI experience](https://emilycampbell.co/writing/layers-of-ai-experience), Emily Campbell, 3 June 2026. Read in full. Six layers: user interface, context, harness (connectors, tools, skills, agents), model, governance, emergence. It builds on Jesse James Garrett's planes of user experience. It is written for designers, so the guide borrows the structure and writes its own content. My own search before you sent the link did not find it; the nearest wrong candidate was Microsoft's "AX stack" series.

### Theo's videos

The 42 most recent videos on [youtube.com/@theo](https://www.youtube.com/@theo), 13 September to 18 November 2026. Captions for 41 were saved outside the repo, about 273,000 words, with per-video notes and timestamps. Today's video on GPT-6.2 Astra had no captions yet. Ideas worth using, each to be cited by link and paraphrased:

- Harness and model as kitchen and chef; MCP as the cookbook, tools as what is in the kitchen. And T3 Code as a workspace, not a harness. [My last video about AI harnesses](https://www.youtube.com/watch?v=ebILGCoN4UU)
- Effort levels are a ceiling on thinking, and the top setting forces a floor. His advice is high by default, almost never the maximum. [Getting the most out of Opus 5.5](https://www.youtube.com/watch?v=ejjBbaq9RmY), [I think I figured it out](https://www.youtube.com/watch?v=XtykeVoSmP8)
- Cost per task matters, not price per token, and cache reads make up most of an agent's bill. [The hard truth about token spend](https://www.youtube.com/watch?v=FHGfSjDGUIw)
- What a plan is worth against the API, the five-hour window as a slice of the week, and why the windows exist. His numbers vary between videos, so they belong in a marked box. [Anthropic can't stop winning](https://www.youtube.com/watch?v=y5TEATUDDfc), [Nobody Is Competing With Anthropic](https://www.youtube.com/watch?v=yh5IAUow4Hc)
- A strong orchestrator with ten small-model subagents finished faster and cheaper than the strong model alone; and a failing small model can cost more than a good one. [Finally a good small model](https://www.youtube.com/watch?v=38_6C0dkKmU)
- The council: several labs' models review one change and score it. With the warning that it ran to 50 rounds and 600 subagents until capped. [Stop Searching For the Perfect Model](https://www.youtube.com/watch?v=TWoS5Nmyoc8)
- Fix the room, not the sign on the door: when an agent keeps failing, change the codebase before the instructions. And the engineer as gardener. [How Claude Fixes Its Own Code](https://www.youtube.com/watch?v=TFCDWrEBaFM), [Coding Isn't About Code Anymore](https://www.youtube.com/watch?v=GtJKFhztgdM)
- A prompt has three parts: what you want, what done means, when to stop and ask. [Getting the most out of Opus 5.5](https://www.youtube.com/watch?v=ejjBbaq9RmY)
- Skill descriptions are triggers, not summaries; write your own and patch them after asking "why did you do that?". [These 3 skills changed my life](https://www.youtube.com/watch?v=5Bmp9cz1JN8)
- Threads are tasks, not histories: working or gone. Humans are single-threaded. [If you have a Claude sub, watch this](https://www.youtube.com/watch?v=D8PikZ1KhUo)
- Dictate intent, never code; a custom dictionary for names; a quiet microphone. [How I Code Without Typing](https://www.youtube.com/watch?v=NvVbCqDgfCs)
- What T3 Code does and where it falls short, in his own words. [T3 Code broke me](https://www.youtube.com/watch?v=uLGxb4F3SyI)
- His model preferences changed during these ten weeks: from Fable as daily driver in September to Opus in October and November, with the OpenAI models moving in and out of the reviewer role. That is the case against printing anyone's picks as fact.

### The source session

The coaching session of 18 November 2026, read in full. It supplied the order in which a newcomer meets things (the tool, voice, context, a long run, the dashboard, verification, effort, cost, skills, orchestration) and the questions an experienced engineer asks first: is it free, who makes it, what does a plan give me, will my employer see it. No names, employers, research topics or machine names from it appear in the repo.

### The talk material

The agentic coding talk folder, read for context and not changed. It already uses the six-layer model. Worth carrying over: "control moves down" as a through-line (autocomplete, multi-file edit, goals, scheduled agents); writing code got cheap while shipping got riskier; the agent only works when plugged into the real loop of test, review and deploy; do the task breakdown yourself before handing out subagents; edit your last message and retry instead of fixing a bad run. Its tone rules match your brief: a field report, dry, no hype, no doom.

### What the docs now say

- A Claude Code subagent runs in its own context, can be given its own model, and "can spawn subagents of its own, up to three layers below the main conversation". Each one "counts toward the same usage limits as your main conversation". ([docs](https://code.claude.com/docs/en/sub-agents))
- Agent teams are experimental, off by default, and use "approximately 7x more tokens than standard sessions" in plan mode. ([docs](https://code.claude.com/docs/en/costs))
- Verified Ultra accounts have no five-hour limit. Weekly limits are shared across models, so switching model does not restore access. ([help](https://support.claude.com/en/articles/11647753))
- OpenAI publishes estimated messages per five hours on Plus: 6 to 50 on GPT-6.2 Astra, 17 to 180 on Sol, 35 to 285 on Terra, 350 to 3,000 on Luna. Anthropic publishes no such figure. ([pricing](https://learn.chatgpt.com/docs/pricing))
- T3 Code hands a "budgeted selection, not an agent-written summary" to the next provider, and a delegated agent does not receive the parent's history. ([docs](https://github.com/pingdotgg/t3code/blob/main/docs/user/portable-handoffs.md))
- MCP in the standard's own words: "an open-source standard for connecting AI applications to external systems". ([site](https://modelcontextprotocol.io/))
- Artificial Analysis has a free API (100 requests a day) and requires a visible credit wherever its data is shown. ([docs](https://artificialanalysis.ai/data-api/docs))
- The `.md` twin of each page is part of the llms.txt proposal; `llms-full.txt` is not. ([llmstxt.org](https://llmstxt.org/))

### Voice tools found

- Claude Code: `/voice`, push to talk. Audio is sent to Anthropic, needs a claude.ai login, uses no plan usage.
- T3 Code: microphone button; a downloadable local model or your own API key; five-minute limit per recording.
- ChatGPT desktop app: Dictate in the composer. Nothing documented for the Codex command line.
- [Wispr Flow](https://wisprflow.ai/pricing): free tier, Pro $15 a month. [Superwhisper](https://superwhisper.com/): free tier, works offline. [Handy](https://handy.computer/): free, MIT, fully offline.

## The dictated items

| Heard | My reading | Confidence | What I would do |
| --- | --- | --- | --- |
| "Fee is not linked" | "Theo is not linked." The essay names Theo and T3 Code in running text; T3 Code is linked, Theo is not. | High | Change C11: a link registry and a check that every named person and tool is linked at first mention on each page. |
| "Invoice should be referenced" | "Voice should be referenced": the guide tells people to talk to the agent and names no tool for it. | Medium | Change C8. If you meant something else (an invoice-style cost breakdown, perhaps), the plans explainer would cover that reading too. |
| A dedicated subpage for T3 Code | As said. | Certain | Change C4, at `/t3-code/`. |
| Is the YouTube handle `@theo` wrong? | It is right. `youtube.com/@theo` is "Theo - t3.gg", about 581,000 subscribers, and t3.gg links to it. `@t3dotgg` on YouTube is an unrelated account with two subscribers; `t3dotgg` is his GitHub name. | Verified | Keep the link. Record it in `links.ts`. |

## Corrections the fact-check table needs

- "A session limit that resets every five hours" is not true of verified Ultra accounts, which have none.

- Haiku 5.5 costs $0.10 / $0.50 only for prompts up to 100,000 tokens; above that it is $0.50 / $2.50.

- The per-effort token and cost figures for Opus 5.5 at low to xhigh could not be re-read from the page today. Low showed a 21.1M total against the 19.1k per task in the table. Needs a manual look.

- The Anthropic models overview link now redirects; the new address is `platform.claude.com/docs/en/models/overview`.

- "The FAQ links his accounts" overstates it: the T3 Code FAQ links one video and one post. Theo's own site, t3.gg, is the better source for his links.

- "Neither lab publishes a figure for plan limits" is wrong for OpenAI, which publishes estimated message ranges per five hours on Plus and Business.

- Grill Me now has a sibling: `grilling` is the model-invoked version in the same repository.

- Be Ambitious: Felix Rieseberg still publishes no skill but does publish a prompt, and two MIT skills built on the article now exist (robonuggets, DannyMac180).

- Max and Ultra include $100 and $200 of API credit a month, which cannot be spent in Claude Code or the apps. Worth a row, because it confuses the plan-against-API picture.

- Links to `developers.openai.com/codex/...` now redirect to `learn.chatgpt.com/docs/...`.

## Questions for the owner

**1. Which figure style?**

You said one style and not too detailed. I can only show you the difference by building one figure three ways, which is the first thing I would do in the next phase.

- (my default) Run the three-way trial on the plans figure and let me pick from real examples.
- Pared-down Anatomy objects everywhere; skip the trial.
- Flat diagrams everywhere; keep Anatomy for one showcase piece.
- Full-detail Anatomy for a few hero figures, flat for the rest.

**2. Where may figure checks run a headless browser?**

Anatomy verifies its drawings by taking screenshots with headless Chrome, driven directly and not through Playwright. Your laptop rule bans Playwright and tells me to use an approved remote environment for browser work, so I have not run it here.

- (my default) On your remote machine only.
- Locally is fine as long as it is plain Chrome and not Playwright.
- No browser checks; I review figures by eye in the dev preview.

**3. Did I read the two dictated items correctly?**

"Fee is not linked" as "Theo is not linked", and "Invoice should be referenced" as "voice should be referenced".

- (my default) Both right.
- First right, second wrong (tell me in the note).
- Both wrong (tell me in the note).

**4. How should the guide handle "which model is better"?**

You ruled out sweeping claims. Readers will still ask.

- (my default) No verdicts in our voice. Named people's views with links and dates, plus how to run your own comparison.
- As above, and a clearly labelled "what the author uses this month" box that you maintain.
- No opinions at all, sourced facts only.

**5. Show practitioner estimates of what a plan is worth in API dollars?**

Anthropic publishes no figure. Theo's estimates range from $8,000 to $14,700 a month for the $200 plan, and your own reading was about $30 per five-hour window on the $20 plan. They are the only numbers that make the plan-against-API gap concrete, and none is official.

- (my default) Yes, in a marked box with name, link and date, apart from the sourced facts.
- Only the published OpenAI message ranges; no dollar estimates.
- Yes, and include your own usage chart as one more data point.

**6. What does a first-time visitor see?**

The level decides how much of each section is open.

- (my default) The plain level, with a small picker offered once.
- The middle level by default.
- A full-screen choice before anything else.

**7. How strict is "few dependencies" for 3D and the graph?**

The site has one dependency today. A hand-written graph is easy. Real 3D is not.

- (my default) Hand-written graph; `three` allowed for the showcase and hero only, loaded on demand, version pinned.
- No 3D library: isometric SVG and CSS transforms only.
- Use what makes it best; I will review the list.

**8. What happens to the web-foundation and web-builder guides?**

Seven guides from the Vibe Coding 101 era, about a third of the words, outside this brief.

- (my default) Move into the wiki as they are, as one cluster, and revisit later.
- Rewrite them at the three levels as part of this version.
- Retire them.

**9. Can you get an Artificial Analysis API key?**

It is free and makes the refresh a one-line command. Without it the numbers are copied by hand from their pages at each release.

- (my default) Manual for now; add the script when a key exists.
- I will create a key; build the script in phase 2c.

**10. What can go in the showcase?**

It needs real things someone built with an agent, with permission to show them. Nothing from the source session can be used.

- (my default) Ship with placeholders; I will send entries later.
- Build three or four fresh demo pieces for it as part of phase 2d.
- Both.

**11. Domain and hosting?**

The search work needs the final address. The current workflow deploys to GitHub Pages under a sub-path.

- (my default) Keep GitHub Pages; I will give you the domain when I have it.
- Move to Cloudflare with the domain.
- Decide later; build so that either works.

**12. Where should the rebuild start?**

My order is foundations, then the cost and orchestration explainers, then the home page.

- (my default) As proposed: 2a foundations first.
- Comment tool and the figure trial only, then stop for review.
- Straight to the plans explainer and its figure; foundations alongside.
