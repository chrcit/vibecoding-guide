# Second opinion: pivoting the guide to a T3 Code skill

## Strongest

- **Killing the simulation tax.** `site/` spends heavy effort faking a chat screen beside the Journey (`site/JOURNEY.md`). Teaching inside T3 Code lets readers hit context bloat, nested `delegate_task` confusion, and missing check gates on real work instead of staged diagrams.
- **Scoping skills to observability, not agent behavior.** "Visualize," "overview," "what went wrong," and "find bottlenecks" are model-agnostic and won't rot on the next Claude or Codex release.

## Weakest

- **Upside-down funnel.** Your primary reader (`CLAUDE.md`) is a skeptical engineer who hasn't adopted agents yet. A hero asking them to install T3 Code, configure a provider, and add a skill before trusting you will bounce most visitors. The static site must still pay off in two minutes with zero setup.
- **Unverified T3 Code plumbing.** Two UX promises look shaky on T3 Code 0.1.9:
  1. *Inline button opening the side browser tab:* `preview_open` is an agent MCP tool taking an `http(s)` URL or dev-server port, not `file://`. An `html_render` iframe directly opening a side tab is unverified and likely unsupported.
  2. *Static HTML reading a local data file:* browsers block `file://` `fetch()`. Without a server, the agent must inline the data inside the HTML passed to `html_render`.
- **Two products in one skill.** A guided course and a daily toolkit have opposite lifecycles; bundling them bloats context and leaks tutorial voice into real work.
- **Single-client lock-in.** T3 Code is 0.1.9. Treating it as the inevitable standard IDE is a bet, not a fact.

## What I'd do differently

1. **Split into two skill packs:** `learn-agentic` (disposable course, removed after week one) and `agent-lens` (permanent skills: visualize, debrief, bottleneck trace).
2. **CLI baseline, T3-enhanced.** Every skill works in plain Claude Code or Codex (markdown + standalone HTML) and upgrades when `html_render`, `delegate_task`, or `t3_thread_*` exist.
3. **Earn the install mid-lesson.** Keep the web Journey as zero-install proof; put "Try this live in T3 Code" at the end of each lesson, not just the hero.
4. **Fix fullscreen honestly.** Link to the hosted static page with URL state, or drop the button until an `html_render` to `preview_open` path is verified.

## Three ideas you probably haven't thought of

1. **Real-thread autopsies via `t3_thread_list` and `t3_thread_read`.** Teach "where things went wrong" on the user's *own* last finished thread and its children, rendering an `html_render` timeline of context spikes, wasted turns, and stalled subagents.
2. **A planted-trap breakage sandbox.** The Journey's best mechanic is letting readers break things. Ship a tiny scratch-repo generator with traps—flaky test, merge-conflict bait, oversized log—so learners trigger real multi-agent failures in 60 seconds safely.
3. **Friction logs that compile into `AGENTS.md`.** Have the post-mortem skill append short local entries (task, failure mode, fix). After five sessions, one command distills those failures into `AGENTS.md`—turning notes directly into better runs.
