# PLAN-2 pre-build review

## Part A · Advice

1. **Prove install to first reply before building the site.** Test on a clean profile with one provider, a pinned skill release, and a visibly offered copy-prompt fallback. `app.t3.codes/new?prompt=…` opens a destination picker. With no repo, the draft opens without a project on the last-used machine. Show the destination and which provider’s skill directory will change before sending. Require the skill to appear in `$` in the intended project, then send it. OpenAI lists Codex on Free, but its Free entitlement describes desktop access subject to rollout. Test Free in T3 before recommending it. [T3 prompt links](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/prompt-links.md) · [T3 composer](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/composer.md#commands-and-skills) · [OpenAI pricing](https://learn.chatgpt.com/docs/pricing)

2. **Deliver something personal before asking about level or editing preferences.** Open with one small, non-sensitive thing the learner wants done. Let them type or dictate, produce a usable result on the next reply, then offer a sentence they can adapt to change it. Name the model, harness and tool using what just happened. Let “shorter, in German” change the next reply, then ask whether to save that wording. PLAN-2 puts three questions, a diagram and a file edit between the learner and their first result.

3. **Make persistence a visible, consented experiment.** Show the exact preference paragraph before writing, then test it in a fresh thread in the same folder. Codex loads layered instructions at startup, and `AGENTS.override.md` can displace `AGENTS.md`. Claude Code’s fallback depends on version and settings (native support starts at 2.1.277). Use an explicit `@AGENTS.md` import in `CLAUDE.md` where needed. T3 documents the `$` skill picker, while native Claude Code uses `/agentic-guide` and native Codex supports `$agentic-guide`. Test explicit invocation first. Description matching is opportunistic. [Codex instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md) · [Codex skills](https://learn.chatgpt.com/docs/build-skills) · [Claude memory](https://code.claude.com/docs/en/memory#when-claude-code-reads-agents-md) · [Claude skills](https://code.claude.com/docs/en/skills)

4. **Say where data can go before asking for a work example.** Replace “files stay here” with “Files live on the machine running the agent. The provider can receive excerpts when the agent reads them.” Ask for invented columns and values before any work description that could contain sensitive details. Use an empty practice folder. T3’s documented initial Full access mode allows commands and edits without approval prompts. The guide’s instructions are behavioral guidance. [T3 FAQ](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md#does-my-code-go-to-t3-servers) · [T3 permission modes](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/permission-modes.md)

5. **Build one adaptable visual and make teaching work in the chat.** Check each optional capability. Give the actual result in text if the renderer or temp write fails. Resolve the OS temp directory instead of requiring `$TMPDIR`. Ordinary renders are sandboxed, so let learners request changes in chat. Drop the zero-output-token claim for rendering by path, exact cue counts without an event source, and cross-thread recall as a prerequisite. The exposed search schema includes assistant hits, skips subagents and is non-exhaustive. Keep `/side` skill discovery and the `token_count` budget provisional. App Server documents `thread/tokenUsage/updated`. [T3 visuals](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/html-renders.md) · [T3 side chats](https://github.com/pingdotgg/t3code/blob/v0.1.9/docs/user/thread-sidebar.md#side-chats) · [Codex App Server](https://learn.chatgpt.com/docs/app-server)

**What breaks first.** The learner follows the install link, lands on a destination or sign-in screen, and cannot tell when setup succeeded. If they send on the wrong machine, the skill can be absent in the project they open next. Put a real novice through the clean setup before the simulations. Watch for unaided recovery and a useful result on their first request.

## Part B · This Codex session in T3 Code

### 1. Tool names

The deferred-tool catalog exposed these 68 exact identifiers through `functions.exec`. The direct tool visible separately was `mcp__t3_code_direct.t3_thread_wait`. This is an availability check. Tool execution and the lab server’s catalog were untested.

```text
mcp__t3_code__create_threads
mcp__t3_code__delegate_task
mcp__t3_code__delete_scheduled_task
mcp__t3_code__device_close
mcp__t3_code__device_list
mcp__t3_code__device_open
mcp__t3_code__device_screenshot
mcp__t3_code__html_preview
mcp__t3_code__html_render
mcp__t3_code__link_pull_request
mcp__t3_code__link_pull_requests
mcp__t3_code__list_scheduled_tasks
mcp__t3_code__list_thread_pull_requests
mcp__t3_code__orchestrator_capabilities
mcp__t3_code__preview_act
mcp__t3_code__preview_dialog
mcp__t3_code__preview_evaluate
mcp__t3_code__preview_navigate
mcp__t3_code__preview_open
mcp__t3_code__preview_recording_start
mcp__t3_code__preview_recording_stop
mcp__t3_code__preview_resize
mcp__t3_code__preview_set_appearance
mcp__t3_code__preview_snapshot
mcp__t3_code__preview_status
mcp__t3_code__preview_wait_for
mcp__t3_code__read_pull_request_guide
mcp__t3_code__request_secret
mcp__t3_code__run_scheduled_task_now
mcp__t3_code__schedule_task
mcp__t3_code__t3_attachment_discard
mcp__t3_code__t3_attachment_prepare_upload
mcp__t3_code__t3_background_wait
mcp__t3_code__t3_environment_link
mcp__t3_code__t3_environment_links
mcp__t3_code__t3_environment_preferences_update
mcp__t3_code__t3_environment_read
mcp__t3_code__t3_environment_unlink
mcp__t3_code__t3_pending_request
mcp__t3_code__t3_preview_close
mcp__t3_code__t3_preview_list
mcp__t3_code__t3_project_clone
mcp__t3_code__t3_project_create
mcp__t3_code__t3_project_delete
mcp__t3_code__t3_project_list
mcp__t3_code__t3_project_read
mcp__t3_code__t3_project_update
mcp__t3_code__t3_queue
mcp__t3_code__t3_thread_configure
mcp__t3_code__t3_thread_interrupt
mcp__t3_code__t3_thread_launch
mcp__t3_code__t3_thread_list
mcp__t3_code__t3_thread_organize
mcp__t3_code__t3_thread_read
mcp__t3_code__t3_thread_search
mcp__t3_code__t3_thread_send
mcp__t3_code__t3_thread_send_attachments
mcp__t3_code__t3_thread_transfer
mcp__t3_code__t3_thread_update
mcp__t3_code__t3_workflow_stop
mcp__t3_code__t3_worktree_handoff
mcp__t3_code__t3_worktree_list
mcp__t3_code__t3_worktree_status
mcp__t3_code__task_cancel
mcp__t3_code__task_status
mcp__t3_code__unlink_pull_request
mcp__t3_code__unlink_pull_requests
mcp__t3_code__write_pull_request_guides
```

### 2. Filesystem

| Check | Observed |
| --- | --- |
| `$TMPDIR` | Unset in the shell, so there was no configured path to test. I wrote, read back and deleted a tiny file in the default temp directory, `/tmp`. |
| `~/Developer/agentic-coding-lab` | I wrote, read back and deleted a tiny file. |
| `~/.agents/skills` | Exists as a directory at `~/.agents/skills`. |
| Lab project’s `.agents/skills` | Absent at the time of the check. |

The write results apply to this unrestricted session. A supervised lab session can have different permissions.

### 3. Lab project skill discovery

**Yes, per Codex docs**, if Codex runs with the lab as its working directory or from a descendant in the same Git checkout, and the skill is enabled and has a valid manifest, for example `.agents/skills/agentic-guide/SKILL.md`. Codex scans `.agents/skills` from its working directory up to the Git root and separately scans `$HOME/.agents/skills`. This review ran from the guide checkout, which is a sibling of the lab. The answer describes documented discovery. Loading a lab skill was untested. [Codex skill locations](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills)
