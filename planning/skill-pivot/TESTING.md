# How reviewers test the skill as a learner

The lab is a separate T3 Code server (0.1.9) with its own data folder and one project, the practice folder `~/Developer/agentic-coding-lab`. The skill is installed project-scoped there. Reviewers play the learner and drive real T3 threads from the command line; the owner can watch the same threads in the lab's web UI.

```sh
T3=~/.t3/runtime/versions/0.1.9/t3
LAB="--base-dir $HOME/.local/share/agentic-guide-t3-lab"
cd ~/Developer/agentic-coding-lab

# Start a learner thread on Codex (cheaper than Claude for test runs) and wait for the reply
$T3 thread start $LAB --provider codex --model gpt-6.2-astra --title "Test: <level> learner" --json --wait . '$agentic-guide'

# Answer as the learner; repeat for each turn
$T3 thread send $LAB --wait <thread-id> 'I am a hydrologist and I want my weekly gauge plots done automatically'

# Read back what happened, including tool calls
$T3 thread show $LAB --messages 20 <thread-id>
$T3 thread list $LAB
```

## Rules

- Use only invented data. Never paste anything real into a learner thread.
- Play the persona honestly: a non-technical learner doesn't know words like "repository", and asks what they mean.
- Keep each run to about 8–12 turns.
- Before each run, reset the practice folder to a clean state (`git -C ~/Developer/agentic-coding-lab status`). Then remove anything the previous run created, except `.claude/skills`, `.agents/skills` and the README.
- Note which inline pages were rendered. They are visible in the web UI; the CLI shows tool calls only.

## What to report

For each finding, give its severity (high / medium / low), the area, the exact turn, what you expected and what happened. Also report anything that worked well, so it isn't changed by accident.
