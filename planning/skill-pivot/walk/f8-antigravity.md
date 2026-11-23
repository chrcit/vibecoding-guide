# F8: what Antigravity puts in a new thread's context

Observed 2026-11-21 in the lab T3 (`t3` 0.1.9, `--base-dir ~/.local/share/agentic-guide-t3-lab`), Antigravity provider `agy_acp_server_1.1.1`, T3 runtime mode full access.

## Result

In a new Antigravity thread, none of these files is in the context the harness sends to the model on the first turn: `AGENTS.md`, `GEMINI.md`, `.agents/rules/*.md`, `.agent/rules/*.md`. The model sees them only if it reads them with a tool. The project's skills are in that first context: their names and descriptions are listed from `<project>/.agents/skills` (and `.gemini/skills`, plus two provider-managed folders).

So on Antigravity under T3, a rule saved in `AGENTS.md` works only when the model decides to open the file. We found no project file it loads by itself.

## Setup

Three fresh fixtures from `walk/fixture.sh` (each has `README.md`, `.git`, the skill in `.claude/` and `.agents/`), each with marker rules committed:

| Fixture | Files and marker rule |
| --- | --- |
| `f8-agents` | `AGENTS.md`: "End every reply with the emoji 🌿 on its own line." |
| `f8-gemini` | the same `AGENTS.md`, plus `GEMINI.md`: "Start every reply with the word "Ahoy"." |
| `f8-rules` | both of the above, plus `.agents/rules/house.md` ("Mention the number 42 somewhere in every reply.") and `.agent/rules/legacy.md` with `trigger: always_on` frontmatter ("Put the word PELICAN in capitals somewhere in every reply.") |

`.agents/rules/` is the path named in the docs bundled inside Antigravity's harness binary (`localharness_external`); `.agent/rules/` is the older path, tried too.

Each fixture got a new thread with a task that doesn't mention any file: `What is 17 times 23? Answer in one short sentence.` First on `gemini-4-neon-medium`, then again on `gemini-3.8-flash-high`.

## What happened

**Every turn failed with a quota error** before the model answered: "Individual quota reached … Resets in 1h54m" (HTTP 429), on both models. The account's Antigravity quota was spent by the walkthrough runs. So the planned second message ("which files were already in your context, and which did you read with a tool?") could not be sent, and we have no model self-report.

**The harness still recorded what it sent.** Antigravity stores each conversation as SQLite under `userdata/providers/antigravity/<id>/antigravity-acp/conversations/<conversation-id>.db`. The `gen_metadata` table holds, per model request, the full system prompt and the request. For all six f8 conversations (three fixtures × two models), the first request contains:

- the sections `<identity>`, `<user_information>` (workspace paths), `<mcp_servers>`, `<skills>`, `<subagents>`, `<artifacts>`, `<messaging>`, `<communication_style>`, and the user message with T3's `<t3_code_instructions>`;
- the skill description of `agentic-guide` (so project skills are discovered from `.agents/skills`);
- **none** of the marker sentences, and no section for rules or memory.

Search used the marker text (`End every reply with the emoji`, `Start every reply with the word`, `Mention the number 42`, `PELICAN`) over every step payload and every request in the six databases: no hits.

**Cross-check with the walkthrough runs.** The same tables for the earlier Antigravity walk threads (`w1-neon-c-*`, `w1-opus-c-*`), whose fixtures seed `AGENTS.md` with `## How I want to learn`: the text first appears in a step that is a `client_view_file` or `view_file` tool call on `AGENTS.md` (for example `w1-neon-c-L2`, conversation `90e557a2`, step 5–6, after a `list_dir`), never in the first request. That matches the testers' reports (#87, #103, #122).

## A contradiction worth knowing

The docs bundled in Antigravity's harness binary say: "The system walks up from the current working directory to the repository root and loads these files" (`GEMINI.md` / `AGENTS.md`), and name `.agents/rules/*.md`. In this setup (Antigravity's ACP server driven by T3 Code) that did not happen. It may behave differently in Antigravity's own app or CLI; we did not test that.

## Limits

- One harness version, one machine, ACP mode through T3. No model replies because of the quota, so we can't say what the model does with a file it later reads; only what was in its context before the first tool call.
- We didn't test a `GEMINI.md` in `~/.gemini/` (home folder), which writes outside the project.

## What this changes in the skill

- `mechanisms/text.md`: which harnesses load `AGENTS.md` by themselves; on Antigravity, observed 2026-11-21, it is not loaded and the model reads it only if it chooses to.
- `mechanisms/window.md`, *Handover*: if you can't tell that this harness loads `AGENTS.md`, say so, and make the fresh-thread check honest.
- `mechanisms/loop.md`: the harness named generically.
- `site/src/data/observations.ts`: one dated observation.

Raw evidence: `~/.local/state/agent-artifacts/vibecoding-guide/skill-loop/walk/f8/` (thread outputs) and the conversation databases named above. Fixtures: `~/.local/state/agent-artifacts/vibecoding-guide/lab-projects/f8-{agents,gemini,rules}`.
