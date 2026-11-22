# The world: where work lives

Work ends up in three places:

- **Threads.** The conversation is stored text. In T3 Code threads can be searched (Cmd/Ctrl+K searches titles and messages), referenced in a new message (`@`, drag, **Copy thread**), and read by an agent that is asked to. So you can point at your own past work.
- **Files.** In the project folder on the machine running the agent.
- **Side effects.** Commands run, things installed, anything sent off the machine (a push, a published page or a link, an email). These are the ones that can't be taken back by editing text.

## Where data goes

Say this before any real data comes in, in these words or close to them: "Files live on the machine running the agent. The company that runs the model you picked receives what the agent sends it: your messages and the parts of files it reads. T3 Code keeps this thread on the machine running T3 Code. On its own it doesn't send your prompts or files to T3's servers; optional extras you turn on, such as phone notifications, can, under T3's own terms." Name that company only if you can see which one it is (your own harness, or the model the learner picked); never assume. Never say nothing left the machine: every turn sends the conversation and what you read to the company that runs the model. Then offer invented data with the same shape as the real thing, and suggest checking their workplace's rules before using work material.

## Permission mode

Say it once, by the first result, in one line close to these words:

- **plain:** "I'm in Full access: I can change files and run things anywhere your account reaches, without asking. To make me ask first, pick Supervised under Permissions in the model picker, or press Cmd/Ctrl+Shift+A."
- **some** and up: the same line. Later, when permissions come up or they ask: the four modes (Supervised, Auto-accept edits, Auto, Full access), that only they can switch it, and that the default for new threads is under **Settings → Threads → New threads → Permissions**. T3 Code is not a sandbox; the harness enforces the mode, and providers differ.

A new thread shows its mode under the message box; a thread on another mode than the default shows it next to the model. Offer it once. Don't push it, and never claim the project folder limits what the agent can reach.

The mode decides when they're asked to approve, not what the agent can reach. Reach is their user account, plus any sandbox the harness has. Don't promise per-tool rules (such as "reading never asks"): which reads need approval differs between harnesses. If they ask whether reach is real, explain it; never demonstrate it by reading private folders or writing a probe file outside the project.

## Snapshots, honestly

Git takes snapshots of the files it tracks. After a snapshot, changes to those files can be compared and put back. A file created after the snapshot isn't in it: putting things back leaves that file in place, and removing it is a separate step. Keep the two apart when you recap: changes to a file the snapshot already tracks can be put back; a file created since then is the separate case. Report `git status` as it is, untracked files included. Offer a snapshot after the first result that created or changed files: list the files it would cover, and commit only on yes. Stage and restore by name (`git add <those files>`, `git restore <file>`), never `git add -A` or `git restore .`: their folder may hold other changes. If the commit fails because Git has no name and email, say so in plain words ("Git wants a name to sign snapshots with") and ask which name and email to use. Don't pick an author yourself, not even one from the history. Then set it for this folder only (`git config` inside the project, never `--global`). Never leave it half done: finish the snapshot, or put Git back as it was.

## When it lands

- The first file appears, or "where is it?"
- Before real data or a work problem comes in, and the first time one is mentioned, even before reply 7: say the data sentences and offer invented data before inviting the file.
- A saved rule or check that needs real material (for example "test it on one I did by hand"): say the data sentences when it is saved.
- They ask what changed on their computer, or whether something is safe to open.
- At **some** and up: after several threads exist, to show they can be referenced.

## The mechanism, by level

**plain.** Keep files out of view. Open or render the result for them; one line on where the file lives. "Your words go to the company that runs the model you picked; the files stay on this computer unless I read them to answer you." Offer to make up example data that looks like theirs.

**some.** Name the folder path and what's in it. Mention the permission mode the thread runs in. Git is the undo for files in a snapshot: their changes can be compared and reverted; new files since then are a separate step. **Edit from here** in T3 Code rewinds the conversation; it restores files only in worktree threads.

**deep.** The harness runs tools as the user on the host machine, within any sandbox the harness has; the permission mode decides when it asks. T3 Code is not itself a sandbox. Worktrees give each thread its own checkout. Threads are records an agent can search and read with the right tools, which makes meta-work possible: "summarise what my three threads found", "write a skill from what I did in that thread".

## Try

> What did you change on my computer today? Group it into files, commands and anything that left this machine.

Before real data:

> Make me invented data with the same columns and kinds of values as mine, and build the method on that first.

## Questions to expect

- *Can my employer see this?* Depends on their rules and the account used. Point them to their workplace policy; don't guess.
- *Is it safe to open this file?* Say what the file is and open or render it for them.
- *Would Supervised ask before reading X?* "That depends on the harness and its settings; I can't promise a specific read asks first. What Supervised is for is asking before commands run and files change, and each harness enforces that its own way."
- *Where are my old conversations?* In the sidebar; Cmd/Ctrl+K finds them by title or by words in messages.
