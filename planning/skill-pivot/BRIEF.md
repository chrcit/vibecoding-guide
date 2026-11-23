# Brief: the guide becomes a skill you run in T3 Code

Date: 2026-11-21. Repo: `<repo>`, branch `next-version`. This brief is shared by several agents. Each writes **one** file in this folder (named in its task) and touches nothing else: no commits, no edits to other files.

## What exists today

- An open-source guide, "Agentic Coding Guide" (see `CLAUDE.md`, `README.md`). Audience: experienced engineers and scientists who haven't kept up with agents; motivated newcomers welcome.
- Prose guides in `guides/`, a glossary in `wiki/`, four prompt "skills" in `skills/` (plain markdown, not packaged).
- A static Astro site in `site/`. Its centrepiece is "the journey" (`site/JOURNEY.md`, `site/src/journey/`): 17+ scroll lessons with one drawn scene (you, a model, a context window, tools, a project, a check gate) that grows from one chat to twenty agents in a loop. Recently a fake chat "screen" was added next to the picture so readers coming from ChatGPT-web see what the real tool looks like.
- Dated facts live in `site/src/data/*.ts` with source, date and status.
- The guide recommends T3 Code (an open-source, multi-provider agentic development environment by Theo / t3.gg; https://t3.codes) with Claude Code and Codex underneath.

## The owner's new direction (their words, lightly cleaned up from voice)

> The ideal version of this experience is seamless, as a skill, with a little setup for T3 Code, and we should package it as such. The web part is just an artifact of it.
>
> Teach the concept and, while doing it, let people use T3 Code to go back and forth with the lessons and the AI. Instead of "take one of these three examples", you tell it: "these are many things you can do, pick one and do it." The skill plus the agent shows the right lessons, and lets them write back and forth with the lessons in natural text. It can also let them build up a knowledge base. The site stays static, the skills stay static, and we still teach the concepts immediately.
>
> Change the voice: talk directly to the person reading instead of being general. Talk about how they are using the tools, how they will experience things, how they may feel in these moments. That allows more personal context and interaction, not only an informational guide.
>
> No longer tell them "you can have an informational dashboard". Tell them to choose some work (or one of our off-the-top examples), and do it in the chat. While that happens the lesson says: "sometimes it's very useful to have an informational dashboard. Why don't you prompt it?"
>
> Use inline HTML in T3 Code to show the things we showcase. For any interaction or animation shown inline, there is always a button to open it full screen in the side browser tab.
>
> Concepts stop being abstract: e.g. an inline chat experience of parallel agents doesn't seem like much until you see it's nested and can go many levels deep; at that point it also breaks down the understanding of what's happening (and that is the lesson).
>
> Include a generalised "T3 visualize" skill: opens an HTML tab or a local browser tab, maybe an HTML page reading a data file. Whatever is least resource-heavy and standard.
>
> Generalised "use" skills — not deep agent-behaviour skills (others do that better). Focus on:
> - visualize
> - get an overview
> - understand what's happening
> - understand what you did
> - understand where things didn't go so well
> - leave something agents can use to analyse deeper and find bottlenecks
>
> T3 Code is the perfect surface: it will be one of the standard IDEs. Credit Theo for T3 Code; it's a resource the owner learned a lot from.
>
> The website stays as a thing to link to and explain things, but the top becomes a hero, marketing-style, asking: read it on the web, or install the skill and do it interactively in T3 Code?

## What T3 Code gives an agent running inside it (observed on this machine, T3 Code server 0.1.9)

An agent in a T3 Code thread has MCP tools that a plain terminal agent lacks. Treat these as observed, not documented guarantees:

- `html_preview` / `html_render`: render a self-contained HTML page **inline in the chat thread**, themed with T3's CSS variables, up to 2000 px tall.
- `preview_open` / `preview_navigate` / `preview_snapshot` / `preview_act`: a **side browser tab** in the T3 UI the agent can open at a URL, inspect and click; the user sees it too.
- `delegate_task`: start child agents on any configured provider/model (Claude, Codex/GPT, Gemini, Grok…), nested, in the shared checkout or a separate worktree; `t3_thread_*` to start, read and message threads.
- `schedule_task`: scheduled agent runs. `request_secret`: a secure card for tokens/passwords. Device tools for phone emulators.
- Threads, projects and worktrees are first-class in the UI; the user can watch child threads.
- Skills: Claude Code and Codex both load skills (a folder with `SKILL.md` + files) from user or project skill directories; T3 runs those agents underneath, so a skill installed for them is available in T3 threads.

## Constraints

- Accuracy first (P0): never invent T3 Code, Claude Code or Codex features. Mark anything unverified.
- No private details about the owner or anyone else in outputs.
- Plain, human prose. No hype, no stock AI phrasing.
- Site stays static; skills stay static files (markdown + small HTML/JS assets). No backend.
