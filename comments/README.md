# Review comments

Comments left on the site with the dev-only comment tool. Run `pnpm dev` in `site/`, select text on any page, press `c` or the Comment button, type, and save with Cmd/Ctrl+Enter. The **Review** button in the bottom-right corner lists the page's comments, where you can show, edit, resolve or delete them.

Everything in this folder except this README is ignored by Git, so comments stay on the machine where they were written. The tool exists only in `astro dev`; `scripts/check-dist.mjs` fails the build if any trace of it reaches `dist/`.

## Files

One comment per file, at `comments/<page-slug>/<timestamp>-<id>.json`:

```json
{
  "id": "08de18ee",
  "created": "2026-11-18T18:56:58.546Z",
  "page": "/guide/guides/ways-of-working/",
  "quote": {
    "type": "TextQuoteSelector",
    "exact": "people tried to systematise AI coding",
    "prefix": " and Fact-Check. What Changed For years ",
    "suffix": ": one agent for architecture, one for co"
  },
  "heading": { "text": "What Changed", "id": "what-changed" },
  "sourceFile": "guides/ways-of-working.md",
  "sourceLoc": null,
  "pageFile": "guides/ways-of-working.md",
  "level": "technical",
  "theme": "light (system)",
  "viewport": { "width": 1280, "height": 800 },
  "comment": "Tighten this sentence.",
  "status": "open"
}
```

- `page` is the route without the base path.
- `quote` is a W3C text quote selector: the selected text with whitespace collapsed, and up to 40 characters either side, so it can be found again after small edits.
- `heading` is the nearest heading above the selection.
- `sourceFile` is the best guess at the file to edit, relative to the repo root. When the selection starts in markup written in an `.astro` file, it is that file and `sourceLoc` is the line and column. Otherwise the text came from markdown and it is the page's markdown file. `pageFile` is the file behind the route as a whole.
- `level` is the reader level (`data-level` on `<html>`) and `theme` the colour scheme at the time.
- Resolving adds `status: "resolved"`, an `updated` time, and optionally a `note`.

## Working through comments (for agents)

1. `pnpm comments` in `site/` lists open comments by page, each with its quote, heading, source file and text. `--json` gives the raw data, `--page /guide/x/` narrows to one page, `--all` includes resolved ones.
2. For each comment, open `sourceFile`, find the `quote.exact` text (search for it; use `prefix`, `suffix` and `heading` when it appears more than once), and make the change the comment asks for. If the text comes from data or a prop, follow it to where it is defined.
3. Check the change: `pnpm judge` from `site/`, and look at the page if it is visual.
4. `pnpm comments resolve <id> --note "what you did"`, one comment at a time.
5. Commit the fix. The comment files themselves are not committed.

If a comment is unclear or asks for something that conflicts with `site/AGENTS.md`, leave it open and say so instead of guessing.
