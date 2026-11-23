# Pre-build review: PLAN-2.md

## 5 changes before building

1. **Deliver work on Turn 2; move `layers` and `AGENTS.md` after the wow.**
   *Why:* §4 opens with a 3-part intake (plus a broken self-rating picker), then dumps a 6-box diagram and a preferences interview before doing anything. Nobody can choose tone or visuals before seeing one output, and `BRIEF-2.md` demands immediate wow. Ask one personal problem, infer level, render a surprising result, then let them critique and rewrite the guide's rules.

2. **Put the work problem in a fresh thread.**
   *Why:* §4 runs the allotment plan and work spreadsheets in one thread—reproducing the context bleed that embarrassed the scientist in `mindset.md`, while preaching "one job, one thread." Switching threads for the real task teaches isolation through use.

3. **Delete the 6 HTML templates and `scripts/fill.mjs`; generate inline HTML ad hoc.**
   *Why:* Pre-built templates plus a Node/`$TMPDIR` injector contradict `BRIEF-2.md`'s on-demand-artifacts thesis, add fragile sandbox dependencies, and bloat QA. Ship a 15-line `html_render` CSS-token recipe in `SKILL.md` instead.

4. **Collapse 11 cue-counted modules into 4 core mechanisms + a sentence bank.**
   *Why:* Models fail at deterministic turn-counting ("3+ tool calls", "never twice in a row", prerequisite DAGs across 11 files) during real work. Per `take-fable-2.md`, knowing mechanisms won't produce the ask; stock concrete, rewordable sentences ("try five times", "do more than asked", "what did you guess?").

5. **Run the `[unv]` lab checks before writing code.**
   *Why:* `t3_thread_search` on assistant text, Codex tool naming, `$TMPDIR` sandbox writes, `npx skills add`, and cold-start prompt-link install are all unverified load-bearing assumptions. Test first or rewrite later.

## Where Session 1 loses a non-technical scientist

Two turns of intake, self-rating ("some technical work" stalls scientists who once ran MATLAB/Python), a Mac-only shortcut (`⌘⇧D`), and an architecture diagram before any payoff. By Turn 3 it feels like software onboarding, not solving their problem.

## Over-built for v1

- 6 templated figures, `fill.mjs`, and a 4-viewport light/dark a11y matrix.
- 11 module files, `build-skill-facts.mjs`, `check-skill.mjs`, and token-overhead benchmarks.
- 9 simulated MCP persona runs (S1–S9) ahead of testing one real human.

## Under-built

**Cold-start trust and failure recovery.** Installing via an agent prompt mutating `~/.claude/skills/` under Full Access (punted to "Owner decisions") is scary. `mindset.md` shows newcomers cannot tell agent errors from their own—yet recovery is just a memorized phrase (`that's not what I see`) and "Restart agent session."

## Observed T3 Code tools (`t3-code` MCP: 69 lazy via `call_mcp_tool`, 0 eager)

`preview_dialog`, `preview_status`, `preview_open`, `preview_navigate`, `preview_resize`, `preview_set_appearance`, `preview_act`, `preview_evaluate`, `preview_wait_for`, `preview_recording_start`, `preview_recording_stop`, `preview_snapshot`, `orchestrator_capabilities`, `delegate_task`, `task_status`, `task_cancel`, `t3_workflow_stop`, `t3_background_wait`, `schedule_task`, `list_scheduled_tasks`, `delete_scheduled_task`, `request_secret`, `create_threads`, `t3_thread_list`, `t3_thread_read`, `t3_thread_update`, `t3_thread_send`, `t3_thread_wait`, `t3_thread_interrupt`, `t3_environment_links`, `t3_environment_link`, `t3_environment_unlink`, `run_scheduled_task_now`, `t3_thread_search`, `t3_thread_configure`, `t3_thread_transfer`, `t3_thread_organize`, `t3_pending_request`, `t3_queue`, `t3_attachment_prepare_upload`, `t3_attachment_discard`, `t3_thread_send_attachments`, `t3_thread_launch`, `t3_project_list`, `t3_project_read`, `t3_project_create`, `t3_project_update`, `t3_project_delete`, `t3_project_clone`, `t3_environment_read`, `t3_environment_preferences_update`, `t3_preview_list`, `t3_preview_close`, `t3_worktree_handoff`, `t3_worktree_status`, `t3_worktree_list`, `link_pull_request`, `link_pull_requests`, `unlink_pull_request`, `unlink_pull_requests`, `list_thread_pull_requests`, `write_pull_request_guides`, `read_pull_request_guide`, `device_list`, `device_open`, `device_close`, `device_screenshot`, `html_render`, `html_preview`.
