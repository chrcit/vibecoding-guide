# The wiki

Short reference articles, one idea each, linked to each other. The explainers on the site are the guided path; the wiki is what every page can link into when a word needs defining. On the site the articles live at `/wiki/<slug>/`, with a list by cluster at `/wiki/` and a map of all the links at `/wiki/graph/`. Here on GitHub each file reads on its own.

## An article

```markdown
---
title: "Context window"
summary: "The context window is everything the model can see at once; whatever is not in it does not exist for the agent."
cluster: context
updated: 2026-11-18
aliases: ["context", "working memory"]
---

# Context window

The context window is everything the model can see at once; whatever is not in it does not exist for the agent.

The plain explanation…

> [!technical] A title for the deeper part
> …

> [!engineer] A title for the full detail
> …
```

- `title`: the name of the thing, in sentence case. The body starts with the same `# Title`.
- `summary`: one plain sentence. It is used on cards, in search and in the graph, and it is also the first paragraph of the body, word for word. The build fails if the two differ.
- `cluster`: one of `basics`, `context`, `working`, `models`, `checking`, `teams`, `web`, `shipping`.
- `updated`: the day the article was last changed in substance, as `YYYY-MM-DD`.
- `aliases`: other names for the same thing, used by search. Optional.

The file name is the slug: `context-window.md` becomes `/wiki/context-window/`.

## Writing rules

- We don't explain the things. We tell you how. The reader has an agent that can explain anything at their own level, so an article says what the thing is in a sentence or two, then how to use it or what to ask the agent, usually with a prompt they can copy in a `text` code block. It does not try to teach everything.
- One idea per article. If a section could be linked to on its own, it is probably its own article.
- The plain layer comes first, about 100 to 250 words that someone new to all of this can follow without the rest. Deeper material goes in `> [!technical]` and `> [!engineer]` blocks, which the site folds or opens by reader level. A fact a beginner needs is never only in a deeper block.
- No number that goes out of date: no price, limit, score, version, release date or list of a product's features. Link the explainer, the models page (`/models/`) or the sources page (`/sources/`) that carries it; those read their numbers from the site's data files, where every value has a source and a date. Facts that do not change, such as an HTTP status code, are fine.
- No ranking of labs, models or tools.
- Use the guide's three running examples where an example helps: the club list, the holiday hours bug and the contact tidy (see `site/AGENTS.md`).
- Plain, dry, British spelling. Explain a term the first time it appears, or link the article that does.

## Links

- To another article: a relative link to its file, `[compaction](./compaction.md)` or `[compaction](./compaction.md#a-heading)`. These work on GitHub, and the site turns them into `/wiki/compaction/`. A link to a file that does not exist fails the build.
- To a page on the site: a root-relative path, `[the context explainer](/explain/context/)`. The site adds its base path.
- To anything else: a full `https://` URL.

Write links inline in the prose. The graph and the "Linked from" lists are built from them, so an article is connected only through the links it actually makes.

An article that is still an outline carries a `<!-- stub -->` marker. Remove it when the article is written.
