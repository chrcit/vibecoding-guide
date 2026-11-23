# Design: the guide as installable skills (technical)

Date: 2026-11-21. Labels: **[doc]** official docs (URL given), **[obs]** observed here (T3 Code server 0.1.9, Claude Code, Codex), **[unv]** unverified.

## 1. Packaging

### One folder, two agents

Both agents read the Agent Skills layout: a folder holding `SKILL.md` (YAML frontmatter + body) and its files.

| | Claude Code ([skills](https://code.claude.com/docs/en/skills)) | Codex ([skills](https://developers.openai.com/codex/skills)) |
|---|---|---|
| User scope | `~/.claude/skills/<name>/` | `$HOME/.agents/skills/<name>/` |
| Project scope | `.claude/skills/<name>/` | `.agents/skills/<name>/` |
| Plugin | `.claude-plugin/plugin.json` + `skills/`; namespaced `/plugin:skill` ([ref](https://code.claude.com/docs/en/plugins-reference)) | `/plugins` from a marketplace ([doc](https://learn.chatgpt.com/docs/plugins)); no shell install command found |
| Invoke | `/name` or by description | `$name`, `/skills`, or by description |
| Up front | name + description | name + description + path, about 2% of context |

Codex follows symlinked skill folders [doc], and `~/.agents/skills` is already shared that way here [obs]. So one checkout plus symlinks serves both agents.

```
plugin/
├── .claude-plugin/plugin.json      # { "name": "agentic-guide" }
└── skills/
    ├── learn/      SKILL.md, lessons/*.md, figures/*.html, facts.json
    ├── visualize/  SKILL.md, assets/viewer.html, scripts/{inline,serve}.mjs
    ├── overview/ what-happened/ what-did-i-do/ what-went-wrong/ trace/
    └── _shared/    scripts/sessions.mjs, trace.v1.schema.json
.claude-plugin/marketplace.json     # one plugin, source "./plugin"
install.sh                          # symlinks plugin/skills/* for both agents
```

**Portability rules**

- Frontmatter holds only `name` and `description`, which both agents require.
- Leave out the Claude-only features: `` !`cmd` `` injection, `${CLAUDE_SKILL_DIR}`, `allowed-tools`, `context: fork` [doc]. Codex would read them as literal text. Write paths as "relative to this SKILL.md".
- Codex extras go in `agents/openai.yaml` [doc].
- Scripts are dependency-free Node `.mjs`. Each SKILL.md also describes the steps in prose, so the agent can do them by hand if `node` is absent. Node is not guaranteed on PATH [unv].

### Install

- **Claude Code, plugin route** ([marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)): `claude plugin marketplace add <owner>/<repo> && claude plugin install agentic-guide@agentic-guide`. It updates through the marketplace.
- **Both agents, one line:** `git clone --depth 1 https://github.com/<owner>/<repo> ~/.local/share/agentic-guide && sh ~/.local/share/agentic-guide/install.sh`.
  - The script symlinks each skill into `~/.claude/skills` and `~/.agents/skills`.
  - `--project` links into the current repo's `.claude/skills` and `.agents/skills` instead.
  - It never overwrites a same-named folder and lists what it skipped.
  - Update with `git pull`. Avoid `curl | sh`, since this audience will read the script first.
- **T3 Code:** nothing extra. T3 runs Claude Code and Codex, which load their own skill dirs [obs]. T3 documents no skills feature of its own ([docs index](https://github.com/pingdotgg/t3code/blob/main/docs/README.md)).

### Detecting T3 Code

Detect by capability, stated in each SKILL.md:

1. **T3 mode** if a tool whose name contains `html_render` exists. In Claude Code it is `mcp__t3-code__html_render`, and it may be deferred, so search for it once [obs]. T3 says these tools "only work for an agent running inside a T3 thread" ([outside-agents.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md)).
2. **Hint only:** `T3CODE_THREAD_ID` is set in T3 threads [obs, undocumented].
3. **Terminal mode** otherwise. Write the same HTML file, print its absolute path, and offer `open`/`xdg-open` after asking. Read transcripts directly instead of `t3_thread_read`. Never fail because T3 is absent.

## 2. The "use" skills

**Shared engine.** `_shared/scripts/sessions.mjs` parses transcripts locally into the trace schema (§2.6) and writes a small `summary.json`. Agents read the summary and never the raw files: one transcript here is 22 MB [obs]. Output goes to `<project>/.agentic-guide/`. That folder holds a `.gitignore` containing `*`, so it can't be committed, and it sits inside Codex's writable workspace.

**Sources**

- **Claude:** `~/.claude/projects/<cwd, / → ->/<session>.jsonl`. Records carry `type`, timestamps, `message.usage` and `model` [obs].
- **Codex:** `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`. It has `session_meta` (cwd, git), `response_item`, `event_msg/token_count` and `token_usage_record` [obs].
- **T3:** `t3_thread_list` (`includeSubagents`) and `t3_thread_read` (`view: activity`). These are provider-neutral and include child threads [obs]. The CLI fallback is `t3 thread list|show` [obs].
- **Repo:** `git log` and `git status`.

Neither transcript format is documented, so the parser tolerates unknown records. Inside T3, prefer the T3 reads.

### 2.1 visualize

```yaml
name: visualize
description: Show data or an idea as a picture - chart, diagram, timeline. Renders a self-contained HTML page inline in T3 Code (a file in a terminal) and can open it full screen in a side tab. Use for "show me", "visualize", "draw".
```
1. Pick the form from the request.
2. Write the data to `.agentic-guide/viz/<slug>.json`.
3. Start from `assets/viewer.html`. It reads `<script type="application/json" id="data">` and falls back to `fetch('<slug>.json')`.
4. `scripts/inline.mjs <slug>` produces one self-contained `<slug>.html`. No CDN scripts.
5. Style with T3 theme variables plus fallbacks (`var(--foreground, #111)`), so the site can embed the same file.
6. In T3: run `html_preview(path)` to get the height and console errors, fix any errors, then `html_render(path, height)`.
7. Add the full-screen line (§3). Offer it once; don't open it unasked.
8. In a terminal: print the absolute path.
9. No dev server. Only `serve.mjs` (static, loopback, on request).
10. Keep the JSON beside the HTML so it can be re-rendered or analysed.

**Reads** user data or another skill's `summary.json`. **Writes** `<slug>.html`, `<slug>.json` and an inline render.

### 2.2 overview

```yaml
name: overview
description: Plain-language overview of this project and what is running now - stack, scripts, servers, threads, agents. Use for "what is this", "where am I", "what's running".
```
1. Read the README, manifests, the tree to depth 2, `git status` and `git log -10`.
2. In T3: `t3_thread_list` (running or waiting) and `t3_preview_list`.
3. In a terminal: `ss -ltnp` or `lsof -i -P`, showing only the user's own processes.
4. Answer in 5 to 10 lines: what it is, how it runs, what is live, what changed.
5. Offer a map of folders, threads and servers via `visualize`.

### 2.3 what-happened

```yaml
name: what-happened
description: Explain what an agent session or T3 thread did - steps, tools, files, sub-agents, outcome - in plain terms. Use for "what just happened", "what is this agent doing".
```
1. Target: this thread by default, or a given thread id, or the last session in this project.
2. In T3: `t3_thread_read`, activity view, paged with small limits, including child threads so the nesting shows.
3. Otherwise: `sessions.mjs --session <id|latest> --summary`.
4. Tell it as a story: goal, steps grouped by intent, what was checked, result, what's open.
5. Define agent terms on first use and link the matching lesson id.
6. Offer a timeline or thread tree via `visualize`.

### 2.4 what-did-i-do

```yaml
name: what-did-i-do
description: Recap your own session - what you asked for, decided, verified and learned. Use for "recap", "what did I do today".
```
1. Scope: today and this project, across Claude and Codex sessions and T3 threads.
2. Gather the user turns, approvals, interrupts, commits and changed files.
3. Group them into tasks. For each: intent, what the agent did, whether you verified it.
4. Name one habit used well and one to try next, with its lesson.
5. With consent, append to `.agentic-guide/journal.md`, the learner's knowledge base.

### 2.5 what-went-wrong

```yaml
name: what-went-wrong
description: Retro on a session or thread - where it stalled, looped, burned tokens or waited on you, with evidence and one fix each. Use for "why did that take so long", "retro".
```
1. Run `sessions.mjs --findings`. It flags:
   - ≥3 identical tool calls
   - one file edited ≥5 times
   - the same test or build failing repeatedly
   - gaps over 2 minutes waiting on the user or a permission prompt
   - compactions
   - turns using more than 3× the median tokens
   - a low cache-read share
   - sub-agent results that were never read
2. For each finding: when, 2 lines of evidence, likely cause, one fix (a context file, a check, a split, a model or effort change).
3. Rank by time lost, then by tokens.
4. Offer a waterfall via `visualize`.

### 2.6 trace

```yaml
name: trace
description: Export a session or thread tree as a JSONL trace other agents or scripts can analyse for bottlenecks. Use for "export a trace", "analyse performance".
```
1. Write `.agentic-guide/trace/<id>.trace.jsonl` with one event per line:
   `{v:1, source, session, thread, parent, turn, t, kind, tool, ok, dur_ms, tokens:{in,cached_in,out,reasoning}, model}`.
   `kind` is one of `user_msg|assistant_msg|tool_call|tool_result|subagent_start|subagent_end|compaction|error`.
2. No message text by default. `--with-text` adds 200-character previews after a secrets scrub.
3. Also write `<id>.meta.json`: tool versions, parser version, counts of unknown records.
4. Print the path and one follow-up prompt.

For teams, Claude Code's OpenTelemetry export ([monitoring](https://code.claude.com/docs/en/monitoring-usage)) is an alternative, but it needs a collector.

## 3. "Open full screen", concretely

**Constraints**

- `html_render` takes inline HTML or an absolute `.html` path, 80 to 2000 px tall, with HTML up to 512,000 characters [obs, schema].
- The rendered page is "sandboxed away from T3 Code and your session". It can load public resources "but nothing on your local network", and "links you click in a page open in your browser" ([html-renders.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/html-renders.md)).
- So the page can't open T3's side tab, can't message the agent, and can't fetch a local JSON file. That is why the data is inlined.
- `preview_open` takes an "absolute http(s) URL, or a bare host", or `target: {kind: "environment-port", port, path}` [obs, schema]. `file://` is not accepted.

**Recommended mechanism**

1. The page ends with "Full screen → ask: *open full screen*" and a copy-prompt button. Clipboard access in the sandbox is [unv]. If copying fails, the button shows the text to type.
2. When asked, the agent runs `node scripts/serve.mjs .agentic-guide/viz`.
   - It is a 30-line static server on `127.0.0.1`, port 0, and prints the port it got.
   - It runs as a background command, with its PID kept in `.agentic-guide/serve.pid`.
3. `preview_open({ target: { kind: "environment-port", port, path: "/<slug>.html" } })`. The port target is how T3 reaches servers on its host when the UI is remote; it is the fallback this machine's setup already uses [obs].
4. The tab serves the same file. Its `fetch` fallback works there, so a page can refresh its data without a re-render.
5. The server stops when the thread finishes or the next time `visualize` runs.

**Secondary path.** While the server runs, the inline page may carry `<a href="http://127.0.0.1:<port>/<slug>.html">`. That opens the system browser [doc] and works only on the same machine. Label it "open in your browser", never as the main button.

**Not possible with static files.** No button can trigger the agent directly. T3's "MCP apps" can "post a message to the thread" ([html-renders.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/html-renders.md)), but that means shipping an MCP server. Revisit later.

## 4. Lesson file format

`plugin/skills/learn/lessons/<id>.md`. The site adds an Astro `glob` collection pointing there, as it already does for `guides/` and `wiki/` (`site/src/content.config.ts`): one source.

```markdown
---
id: parallel-agents
title: Run agents side by side
concept: parallel-agents            # wiki slug
summary: One agent waits on a test; you start a second on something else.
prerequisites: [agent-loop, context-window]
triggers:
  phrases: ["while it runs", "in parallel", "this is slow"]
  signals: [turn-over-90s, delegate-task-used, user-idle-in-running-thread]
levels: [new, practiced, expert]
figure: ../figures/parallel-agents.html
figure_height: 640
facts: [t3.delegate-task, pricing.opus-5-5]   # ids from site/src/data
updated: 2026-11-21
---
## new
You just sent a task and you're watching it scroll. ...
## practiced
## expert
## Try
- "Split this into two threads: one fixes the test, one writes the docs."
## Notice
What to look for, and how it may feel when it happens.
```

**How the format works**

- **Levels.** `## <level>` headings let both readers slice the text. The site shows all levels as tabs. The skill shows the learner's level from `.agentic-guide/progress.json` (or `~/.local/state/agentic-guide/` for a cross-project profile).
- **Signals.** `triggers.signals` come from a fixed vocabulary, checked against `summary.json` and T3 thread state. Unknown signals are ignored.
- **Figures.** They obey the `html_render` rules: no page background, fluid width, no `vh`. The site iframes them and defines the same CSS variable names.
- **Dated facts** stay in `site/src/data/*.ts`. A build step emits `learn/facts.json` with dates and statuses, so the installed skill says "as of 2026-11".

## 5. Risks

**Token cost**

- Scripts summarise; the agent reads only `summary.json` (under 10 KB).
- `t3_thread_read` runs paged.
- `learn` loads one lesson at a time.
- Keep each description under about 300 characters: Claude truncates the listing at 1,536 characters, and Codex budgets about 2% of context [doc].

**Privacy**

- Transcripts hold everything the agent saw: secrets, tool output, file contents. They also hold account identifiers: the `session-owner` account and org UUIDs in Claude, `creator_account_id` in Codex [obs].
- Defaults:
  - this project only; ask before reading other projects
  - no network
  - no text in traces unless asked, scrubbed if included
  - no CDN in figures, because rendered pages can reach public URLs [doc]
- Claude Code prunes old transcripts (`cleanupPeriodDays`, [settings](https://code.claude.com/docs/en/settings)), so a past session may be gone [unv: default value].

**Codex vs Claude**

- Skill dirs and invocation syntax differ, and plugin namespacing exists only in Claude.
- Claude-only SKILL.md features are excluded (see §1).
- The Codex sandbox may block reading `~/.claude`, writing outside the repo, or binding a port [unv]. Hence output lives in the project. If `serve.mjs` is blocked, the skill says so and keeps the inline view.
- T3 tool names as Codex sees them are [unv], so detect by substring.

**Drift**

- T3's agent tools are observed but not documented by name: pin "tested with T3 0.1.9" and re-check each release.
- The parser records its version and counts unknown records, so format changes show up as numbers instead of wrong answers.

**Naming**

- `trace` and `overview` will clash with users' own skills. The plugin namespace fixes this for Claude. For the symlink install, use an `ag-` prefix if collisions prove common.
