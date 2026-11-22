# The loop

The model only writes text. Some of that text is a tool call: "read this file", "run this command", "render this page". The harness, the program you run the model in (such as Codex or Claude Code), runs the call, feeds the result back, and the model writes again. This repeats until the model writes an answer instead of a call. T3 Code sits on top as the place where threads from several providers live.

Four layers: **model** (writes), **harness** (gives it hands), **tools** (the hands), **world** (what they touch: files, commands, other threads, the internet). `figures/layers.html` draws them, with the learner and T3 Code (which keeps the thread) on top: six rows, the loop boxed.

## When it lands

- On the reply after the first result (reply 3 of the first session): name each layer with what happened in the turn that just ran, the result or the revision they asked for. At **plain**, no counts: "Your sentence went to the model. It asked the program around it to act; one of those actions put this page on your screen." At **some** and up, say how many tool calls it made and name the harness you are actually running in.
- On the result turn, separate computed from written: which call did the computation (a script that counted, a command that ran) and which parts of the page you typed by hand (headings, labels, a summary sentence). At **plain**: "I counted these with a small program; the headings and the advice I wrote myself." Summaries, footnotes and labels on a page are text you wrote: check them against what the tool computed before you show the page. The same holds for your reply text. Name only calls that appear in this turn's trace; if you did arithmetic yourself, say "I worked that out myself". Derived values on a page (percentages, differences, a verdict label) come from a run, or are marked as written by hand. A claim about what untested code would output is written by hand too: run it on the invented data, or don't state the result.
- Many steps came from one sentence.
- "How does it know?" or it assumed something: the model guesses when the window doesn't say.
- It said done without running anything: the loop stopped because the model chose to stop.

## The mechanism, by level

**plain.** "You talk. A model writes. The program around it lets it act on your computer: read, write, run things, show you a page. It loops until it thinks it's finished. That picture came from one of those actions."

**some.** The harness is the loop: send the window to the model, run what it asks, append the result, repeat. Permission modes decide which calls need your OK (Supervised asks before commands and file changes; Full access asks for nothing). The model can be confidently wrong; the loop only checks what someone told it to check.

**deep.** Tools are described to the model as schemas in its context; the model emits a structured call; the harness executes and returns the output as the next message. MCP servers add tools (T3 Code's own tools, such as the one that renders pages, arrive this way). Checking is an instruction to the loop: "run the tests and don't stop until they pass" changes when the model decides to stop. Thinking is extra text the model writes before answering; the effort setting decides how much. Models differ in temperament: judgement over long context versus grinding through many variants.

## Filling the figure

Offer it; don't stack it onto a result. On yes, read `figures/layers.html` as a template, replace the example "this turn" lines with this turn (their sentence shortened, the model, the harness, the tools used, what changed) and pass the filled HTML inline to `html_preview`, then `html_render`. The tools row lists only this turn's calls and what they actually output; anything you derived or judged goes in the model row. Write no file into their project. At **plain**, use the everyday row labels the template gives for the harness and tools rows, and no counts ("ran a small program, showed you this page"). Render it once; again only if asked.

## Try

> Which parts of that did you guess? List them, and ask me about the ones that matter.

At **some** and up:

> Show me what you ran and what you saw each time, as a short list.

## Questions to expect

- *Is it thinking?* It writes text, some of it before answering. That text can be wrong and still sound sure.
- *Can it do anything on my computer?* What its tools allow, anywhere your user account reaches. The permission mode decides when it asks first, not what it can reach.
- *Why did it stop?* It decided it was done. Tell it what "done" means (see `moves.md`, *Check it*).
