# Round 1: what the build takes from the advice

The lead's reconciliation of [advice-sol.md](./advice-sol.md), [advice-neon.md](./advice-neon.md) and [take-fable-2.md](../take-fable-2.md) against [PLAN-2.md](../PLAN-2.md) and [BRIEF-2.md](../BRIEF-2.md). Where this file and PLAN-2 disagree, this file wins.

## Accepted

1. **Their own work first.** The first message asks for one small, non-sensitive thing they want done. The result arrives on the next reply. Then the agent names the model, the harness and the tools using what just happened. The level is inferred from how they write and can be changed with one sentence. No self-rating picker, no diagram, no file edit before the first result. (Sol, Neon, Fable agree.)
2. **The real problem goes in a fresh thread.** One job, one thread, taught by doing it, not by saying it. (Neon; matches the context bleed in mindset.md.)
3. **Inline HTML on demand, not a template pipeline.** Drop the six templates, `fill.mjs` and the `$TMPDIR` dependency. SKILL.md carries a short recipe for themed `html_render` pages (T3's CSS variables, no fixed colours, fluid width). One exemplar file, the layers figure (model, harness, tools, world), stays as the quality reference. If rendering fails, the agent gives the result in text. (Neon, Sol.)
4. **Four mechanisms and a sentence bank instead of eleven modules.** Mechanism files: *it's all text*, *the window*, *the loop* (model writes, harness acts, tools touch the world), *the world* (where work lives: files, threads, side effects, and threads as searchable text). Verification, parallel threads, orchestration and ad hoc artifacts are taught as **moves**: sentences in `moves.md` offered one at a time, shown as words to reword. (Neon, Fable.)
5. **No exact counting.** Triggers are "after a turn, if you notice…", never "after exactly 3 tool calls". At most one aside per turn, at the end. (Sol, Neon.)
6. **Say precisely where data goes.** "Files live on the machine running the agent. The provider receives the parts the agent reads." Invented data first, in an empty practice folder, before anything from real work. (Sol.)
7. **Install with a visible result and a safety net.** The install is project-scoped into the practice folder by default (`.claude/skills/` and `.agents/skills/`), not the home folder, so a first install under Full access touches one folder. Global install is offered later as a move. The practice folder gets `git init`, so anything the agent does can be undone; that is the recovery story. The install ends by telling the learner exactly how to check it worked (the skill shows up when they type `$`). Prompt link first, with a copy-prompt fallback. (Sol, Neon.)
8. **Persistence with consent.** The agent shows the exact AGENTS.md paragraph before writing it, then proves it in a fresh thread. For Claude Code, a `CLAUDE.md` containing `@AGENTS.md`. (Sol.)
9. **Recovery is taught early.** Sentences for "stop", "undo that", "what did you assume?", plus the git safety net. (Neon.)
10. **Tool detection by substring.** Claude sees `mcp__t3-code__html_render`, Codex sees `mcp__t3_code__html_render`; detect any tool whose name ends in `html_render`. (Observed by Sol and the lead.)

## Rejected or reduced

- **"Prove install before building the site"** (Sol): reduced. The site page is small. Both get built; the install path is tested in the lab first.
- **No dated facts in the skill.** Prices and plans stay on the site; the skill links there. Removes `build-skill-facts.mjs`. (Fable's earlier rule.)
- **Simulated learners** (Neon: over-built at nine): three runs, one per level, on Codex in the lab T3. One real person is the owner's call and is recommended before launch.
- **Token benchmarks**: dropped; SKILL.md stays under about 2,000 tokens, checked by word count.
- **Dependence on `/side`, thread search across sessions, `⌘⇧D`**: removed as prerequisites. "Use the mic button" instead of a shortcut.
- **Codex Free**: not recommended until tested; the page says "a paid plan" and links to the site's dated plan facts.

## Owner defaults (until told otherwise)

- Install link: this repo's public GitHub path.
- The learner's level goes into their practice folder's AGENTS.md, with consent.
- The lowest level is offered Supervised mode, not forced into it.
