# The window

The agent knows only what is in its window: this thread's messages, the files and tool results it has read in it, and any context files the harness loaded at the start. Nothing else. A fresh thread starts with those context files and an empty conversation. One job, one thread.

## When it lands

- A second, unrelated request arrives in the same thread. A small job: do it, then the aside. A job that will grow, or would mix with the first: one line before starting, "New thread for this? (it keeps the two from mixing)", and do it here if they say no.
- Details from the first job leak into the second (a page about job B mentions job A). Stop and make that the lesson: it was in the window.
- "How does it know that?" or "Why did it forget?"
- At the handover, the end of the first session (see *Handover*).

## The mechanism, by level

**plain.** "I only see what's in this conversation, plus the instruction files I've read. That's why rambling about yourself helps, and why your work problem should get its own conversation: so today's first task doesn't leak into it."

**some.** Each thread is a separate agent session with its own window. Long threads fill up; the harness then compacts or drops older parts, and quality can drift. Starting fresh is cheap where the harness loads `AGENTS.md` by itself (Codex, Claude Code; see `text.md`, **deep**): it carries what should survive. Elsewhere, the new thread has to be told to read it. Rambling context in the first message (who you are, what you know, what good looks like) is the single biggest lever.

**deep.** The window is a token budget: system prompt, tools, context files, the conversation, every tool result. Every request resends it, so a long thread costs more per turn as well as drifting. Subagents and delegated tasks get their own fresh windows and return a summary. Context is capability, and also a cost; point to the guide's dated Models and Costs page for numbers.

## The fresh-thread move

In T3 Code, a new thread in the same project is one click (or ask: "Start a new thread for this"; only do it when asked). Tell them what to bring: one paragraph of context, or a reference to this thread. Any opener you write follows *Handover* 1: output that stays on the machine, no real or personal data. Every time you send them to a fresh thread, in any session, put these three lines below the opener, outside its quote block, as written:

- Start it: the new-thread button next to this project in the sidebar.
- Check the mode under the message box before sending.
- To get the guide there, start your message with `$agentic-guide`.

Elsewhere (text mode), replace the first two lines with: start a new session in the same folder.

## Handover

At the end of the first session, say everything in this thread. The fresh thread is plain: no guide, no hint of the saved rule. It is a test the learner runs, not a place where steps of this session continue. If they saved no rule, skip the test and give a plain opener for their next task. End with one next step, the fresh thread; don't also promise to continue work here when they're back.

1. **The opener.** A ready-to-send first message for a new thread in this project, in a quote block: a small invented task, no mention of the guide, nothing about their saved rule. Pick a task where the rule would show in the first reply: for "one thing at a time", a task that tempts a list of steps; for "answer in German", any question. Ask only for output that stays on the machine: an answer in the thread, or a file in the project; never "a page" or "a link". Never invite real or personal data, and carry no one else's personal or health details.
2. **How to start it.** The new-thread button on this project in the sidebar. Before sending, look under the message box: a new thread starts on their default permission mode, so they switch it there if they want Supervised.
3. **What to look for.** Does the first reply follow their rule without being told? Then `AGENTS.md` did it. If not, they come back here and you sharpen the wording together. If you can't tell that this harness loads `AGENTS.md` by itself (`text.md`, **deep**), say so, and make the check honest: "If it didn't follow it, your harness may not read that file by itself." Also say: "If a reply offers to publish or share something, that sends it off this computer; say no unless you mean it."
4. **Calling the guide back, separately and for later.** "Type `$` in the message box, pick agentic-guide from the list, press Enter. Or write `$agentic-guide` and your question." Never inside the opener.
5. **Another project.** Unless it is already in `~/.claude/skills` or `~/.agents/skills`, the guide is installed in this project only. If a new project folder is next, offer the global install now with the sentence in `moves.md`, *Install globally, later*, word for word; don't paraphrase it. The saved preference stays with this project's `AGENTS.md`. At **plain**, say how to make one: in T3 Code, Cmd/Ctrl+K, **New project**, give it a name; T3 makes the folder in `~/.t3/projects` with a first snapshot and opens a thread in it.

## Referencing instead of repeating

In T3 Code a thread can be put into a message: type `@` and part of its title, drag it from the sidebar onto the message box, or use **Copy thread** and paste. The agent reads that thread's history on demand, so a long thread costs nothing until it looks. This is the bridge to orchestration (see `moves.md`). Teach it once they have two threads.

## Try

> Start a fresh thread for my work problem. Write me the first message for it: who I am, what I want, and what I already told you that it needs, apart from what AGENTS.md already says.

## Questions to expect

- *Can a new thread see this one?* Not by itself. Reference it with `@`, or put what matters in `AGENTS.md` (which a new thread reads by itself only in harnesses that load it).
- *Should I keep one thread forever?* No. One job each. Old threads stay searchable (Cmd/Ctrl+K searches titles and messages).
- *Why does it get worse after a long time?* The window fills; start fresh with a summary.
