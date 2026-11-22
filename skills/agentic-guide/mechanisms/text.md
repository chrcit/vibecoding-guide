# It's all text

A request, the model's thinking, a skill, a context file and a whole thread are words. Words can be read, written, changed and pointed at, by the learner or by the agent on request. Most "features" are a sentence somebody wrote down.

## When it lands

- They want the lesson, a page or the agent itself to behave differently.
- It forgot something they said in another thread.
- They ask what a skill is, or how the guide works.
- Best moment: right after they told you how they want to be spoken to and the next reply already followed it.
- If their feedback was only about the content, ask once about the explanation too: "And how I explained it: shorter, another language, bigger text, a table?" Style is what makes the moment, so give it one chance to come up.

## The mechanism, by level

**plain.** "Everything I do here comes from text. This guide is a page of instructions I read when you typed `$agentic-guide`. You just changed how I talk with one sentence. If we write that sentence into a file called `AGENTS.md`, every new conversation in this folder starts by reading it." Say "starts by reading it" only if your harness loads `AGENTS.md` by itself (Codex and Claude Code do; see **deep**). Otherwise: "…new conversations here can read it, but the program I run in doesn't open it by itself. The test at the end shows whether it works."

**some.** A skill is a folder with a `SKILL.md`: a name, a one-line description, then instructions. The agent sees every installed skill's description and loads the full text when you call it by name or the description matches. `AGENTS.md` is the project's standing context, loaded at the start of each session by harnesses that support it (Codex, and Claude Code directly or through `CLAUDE.md`). Others may not load it, and the model then reads it only if it chooses to. The model weighs this text; permission modes are different, enforced by the harness in code, and no text overrides them. Both are plain Markdown you can open and edit, or ask the agent to edit.

**deep.** The context the model sees is assembled text: system prompt, tool definitions, context files, skill descriptions, the conversation, tool results. Codex reads `AGENTS.md` files from the repository root down to the working folder. Claude Code reads `CLAUDE.md`, and reads `AGENTS.md` only when no `CLAUDE.md` exists; otherwise a `CLAUDE.md` containing the line `@AGENTS.md` imports it, so one file serves both. Antigravity under T3 Code (observed 2026-11-21) put none of `AGENTS.md`, `GEMINI.md` or `.agents/rules/` into a new thread's context; the model read `AGENTS.md` only when it chose to. For any other harness, say you don't know rather than guess. Harness memory is a second channel: a rule saved there would also reach the fresh thread and confound the `AGENTS.md` test. Context files are text the model weighs, so they can conflict or drift; permission modes are enforced by the harness in code, and no text overrides them. Skills follow an open format (agentskills.io), so this one works in both harnesses. Invite them to read this skill and change their copy.

## Persistence, with consent

1. Show the exact paragraph you'd add under `## How I want to learn` in `AGENTS.md`, in a quote block: their preference in their words, and the level once they've confirmed it. If it is still unconfirmed, ask in the same message ("I've been explaining for someone who doesn't write code. Is that right?"). An unconfirmed level stays out.
2. Write it only on yes: exactly the paragraph you showed, nothing more. If anything changes after you showed it, show the new paragraph again and ask again. One exception: if their yes also confirms the level you asked about, add that one level line and say you added it. At **some** and **deep**, show the path and the diff after writing. For Claude Code, if a `CLAUDE.md` exists, make sure it has the line `@AGENTS.md` (show that first too); without one, Claude Code reads `AGENTS.md` directly.
3. Prove it at the handover: a plain fresh thread in this folder, given a task with no hint of the rule, should follow it on its first reply (`window.md`, *Handover*). Don't repeat the rule in the opener; that would fake the proof. If your harness doesn't load `AGENTS.md` by itself, say so now, before they rely on it.
4. **"Everywhere."** If they want a rule in every project, this project's `AGENTS.md` is still the default. For every project, name the home-folder file for the harness you're in (`~/.codex/AGENTS.md` for Codex, `~/.claude/CLAUDE.md` for Claude Code; for another harness, say you don't know it), say it may already hold their own rules, show what's in it and the diff, and write only on an explicit yes. This is the only write outside the project besides the global install.

Some harnesses keep their own memory (such as Claude Code's auto-memory). Don't save there: rules go in `AGENTS.md`, shown first and written only on yes.

Never write work data or other people's details into it.

## Bending the lesson

Show two lines of this skill that shaped your last reply (for example the opening instruction in `SKILL.md`). "This lesson is a page of sentences like these. Tell me how you'd change it." At **some** and **deep**, offer to edit their project's copy of the skill and show the diff. At **plain**, keep it in `AGENTS.md`; files are a detour.

## Try

> Write into AGENTS.md that you should explain things in short sentences, in German, with a picture when it helps. Show me before you save it.

## Questions to expect

- *Why do you do that? How do you know my level?* If the reason is a file, name it: "It's in a note in this folder, `AGENTS.md`; I read it at the start." This is the lesson moment, so never hide it.
- *Does it remember me?* Only what is written down: this thread, and files the harness loads at the start, such as `AGENTS.md` in Codex.
- *Can I break it?* Changing text costs nothing. After a Git snapshot, files in it can be put back; files created later need removing separately (`world.md`, *Snapshots*).
- *Is the skill code?* No, instructions in Markdown. A skill can include scripts; read one before installing it.
