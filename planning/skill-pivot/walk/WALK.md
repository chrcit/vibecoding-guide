# Walkthroughs: agents take the lessons as learners

The skill is stable (see [../LOOP.md](../LOOP.md)). In this phase, agents play learners and take every lesson by driving real T3 threads the way a person would. They report paper cuts and bugs as they go, and review the curriculum. Goal: every lesson taken at least twice by each agent (Opus, Sol, Neon), or until the plan limits run out.

## The lessons

The skill teaches four mechanisms through the learner's own work, plus a set of moves. A "lesson" here is a stretch of a session where one of them should land. Each run steers toward its lesson the way a real learner would get there: by doing work and asking honest questions, never by saying "teach me lesson 3".

| Id | Lesson | Start state | Get there by | Check especially |
| --- | --- | --- | --- | --- |
| L1 | First session (replies 1–8) | Fresh folder | `$agentic-guide`, then a small task of your own. Go through to the handover, then open the fresh thread it hands you and send the opener. | Reply 1 ≤ 5 lines; reply 2 is a real inline result plus ≤ 4 short lines; layers picture only on yes; AGENTS.md paragraph shown before writing; data sentences in reply 7; handover is complete and the fresh thread is plain. |
| L2 | It's all text (`mechanisms/text.md`) | Returning learner (`AGENTS.md` seeded) | Want different behaviour; have it forget something across threads; ask "how does it know what I like?"; ask what a skill is. | Persistence only with consent; the diff is shown; the level-appropriate account of what the model actually sees. |
| L3 | One thread is one window (`mechanisms/window.md`) | Returning learner | Do one job, then a second unrelated one in the same thread; let a job grow long; ask why it forgot something from early on. Take the fresh-thread move and a handover. | It suggests a fresh thread at the right moment, not too early; the handover is usable as-is; referencing an earlier thread instead of repeating. |
| L4 | The loop (`mechanisms/loop.md`) | Returning learner | Give a one-sentence task that needs several steps; ask "how did you know that?"; catch an assumption; ask it to check its work. Ask for the layers picture. | The walk-through quotes your sentence; computed vs written by hand is honest; Check it / Try it N times moves offered and usable. |
| L5 | The world: where work lives (`mechanisms/world.md`) | Returning learner | Ask where a file is; say you're about to use real data (don't paste any); ask what changed on your computer today; ask to undo something; ask whether your employer can see this. | Data sentences as written (incl. the T3 optional-extras caveat); permission line accurate; snapshot offered honestly and committed only on yes; undo explained honestly. |
| L6 | Moves: pages, parallel threads, referencing threads | Returning learner | Ask for a page (a form, a chart of invented data) and change it ("bigger", "in German"); ask to keep going on two things at once; ask it to look at what another thread found; ask about using the guide in another project. | `html_preview` then `html_render` with the right height; no page files written unasked; starts or messages threads only when asked; honest about what it can and can't reach. |

## Levels and personas

Each run gets a level and a persona. Invent the details yourself, keep them plausible, and stay in character the whole run. Never use real people, employers or data.

- **plain** (doesn't write code): a primary-school teacher, a community-garden coordinator, a retired nurse, a small-shop owner, a field ecologist who only uses spreadsheets. Doesn't know words like repository, terminal, commit; asks what they mean; may ramble or type loosely.
- **some** (technical work, little code): a UX designer at Figma/Notion level, a lab biologist with Excel and a bit of R, a marketing analyst with basic SQL.
- **deep** (builds software): a sceptical backend engineer, a computational physicist, a data engineer. Pushes on precision, asks how it actually works, tries to catch the guide out.

## How to drive a thread

```sh
T3=~/.t3/runtime/versions/0.1.9/t3
LAB="--base-dir $HOME/.local/share/agentic-guide-t3-lab"
FIX=~/.local/state/agent-artifacts/vibecoding-guide/skill-loop/walk/fixture.sh
REPORT=~/.local/state/agent-artifacts/vibecoding-guide/skill-loop/walk/report.mjs

dir=$($FIX <run-id>)            # L1: fresh folder
dir=$($FIX <run-id> some)       # L2–L6: returning learner at that level
cd "$dir"

# First message; prints the thread id and the reply
$T3 thread start $LAB --provider <inner-provider> --model <inner-model> --title "<run-id>" --wait . '$agentic-guide'
# Each learner turn
$T3 thread send $LAB --wait <thread-id> '<what the learner types>'
# What happened, with tool calls
$T3 thread show $LAB --messages 6 <thread-id>
# A second thread in the same project, like pressing "new thread" in the sidebar
$T3 thread start $LAB --provider <inner-provider> --model <inner-model> --title "<run-id> fresh" --wait . '<opener>'
```

- Each run gets its own fresh folder from `fixture.sh`, so parallel runs never collide. Never touch another run's folder or the old `agentic-coding-lab` folder.
- Use the inner provider and model given in your assignment. If a send fails because of a usage limit, report the run as `failed` with the reason and stop that run.
- **See the pages like a learner would.** Every inline page is saved at `~/.local/share/agentic-guide-t3-lab/userdata/attachments/mcp-<thread-id>-*-html.html`. Look at each one (render it with your own `html_preview` if you have it, or read the HTML) and judge it the way your persona would see it: readable, fits, light and dark, nothing clipped.
- Keep each run to about 8–14 learner turns. A `--wait` that exits 2 means the agent asked for approval or an answer: answer as your persona.
- Read `skills/agentic-guide/` (SKILL.md, mechanisms/, moves.md, figures/) before your first run, so you can tell when the agent departs from it. Don't let that knowledge leak into how your persona talks.

## How to report

Report as you go, not only at the end, so the dashboard shows progress:

```sh
node $REPORT '{"type":"run","run":"<run-id>","agent":"<opus|sol|neon>","pass":1,"lesson":"L3","level":"plain","persona":"retired nurse sorting family recipes","inner":"codex/gpt-6.2-astra","status":"started","thread":"<thread-id>"}'
node $REPORT '{"type":"finding","run":"<run-id>","agent":"<opus|sol|neon>","lesson":"L3","kind":"papercut","severity":"low","area":"skills/agentic-guide/mechanisms/window.md","turn":4,"text":"Expected …; got …","fix":"…"}'
node $REPORT '{"type":"run","run":"<run-id>","agent":"<opus|sol|neon>","pass":1,"lesson":"L3","level":"plain","status":"done","thread":"<thread-id>","turns":11,"note":"one line on how it went"}'
```

- `kind`: `bug` (the skill or site does something wrong or untrue), `papercut` (small friction a learner would feel), `curriculum` (what is taught, in what order, what's missing or redundant), `works` (something good that must not be changed by accident).
- Every finding names the turn and quotes or paraphrases what the agent said. Use repo-relative paths for `area`.
- Write one file per assignment: `planning/skill-pivot/walk/<assignment-id>.md`, with a short table per run (turn, what you typed, what happened, verdict) and a **Curriculum review** section: for your lessons, does the material teach the mechanism through the learner's work; what is missing, redundant or in the wrong order; which sentences in `moves.md` a learner at your level would actually reuse.
- Don't edit the skill, the site or anything else in the repo except your own report file and the inbox (through the script). Don't commit. Leave the run folders in place.
