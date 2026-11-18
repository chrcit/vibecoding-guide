# Ways of Working with Agents

The habits that matter when an agent can work unattended for an hour or more. Written for people who know how software gets built and want to know what changes when most of the typing is delegated. Numbers on this page are dated November 2026 and sourced in [Sources and Fact-Check](./fact-check.md).

## What Changed

For years people tried to systematise AI coding: one agent for architecture, one for code, one for tests, one for review. It mostly failed for a simple reason. The models lost the thread after a few dozen steps, so the pipeline needed a human to re-establish context at every handoff.

That limit moved gradually, and it is measurable. [METR](https://metr.org/time-horizons/) tracks a model's 50% time horizon: the length of task, measured in how long it takes a skilled human, that the model completes half the time. It went from about 1 hour in February 2025 to about 5 hours in November 2025, 12 hours in February 2026 and 17 hours in April 2026, doubling roughly every 129 days since 2023. Read those numbers with METR's own caveats: estimates above 16 hours are unreliable by their account, the task suite is mostly software and research engineering, and they stopped updating the page in September 2026, so there is no METR figure for the newest models.

The practical consequence is the size of the unit you hand over:

- **2023:** a function. "Change these five functions in these three files." You stitched the pieces together.
- **2025:** a feature. "Add CSV export to the results page, with tests."
- **Now:** a project. "Build the transit-data dashboard we discussed, deploy it to a preview, and tell me what you could not verify."

In our experience, runs of 30 to 60 minutes without input are routine, and longer ones work when the agent has a way to check itself. Writing code is no longer the expensive part. Knowing what to build, judging whether it is right, and getting people to use it still are.

## Talk, Don't Type

Context is capability. An agent with the same model gets markedly better when it knows who you are, what you are trying to do, why, what you already tried and what a good result looks like. Most disappointing first results trace back to a two-line prompt.

Voice is the cheapest way to give more context. In a Stanford study, speech input was about three times faster than typing on a phone keyboard: 153 against 52 words per minute for English ([Ruan et al., 2016](https://arxiv.org/abs/1608.07323)). Against a fast typist at a desk the gap is smaller. The larger effect is behavioural: people say more when they talk, including the hedges and side remarks that turn out to matter. Rambling is fine. The model sorts it.

Raw material beats summaries. Hand over the thing itself:

- screenshots of the error, the design you like, the plot that looks wrong
- transcripts of a meeting or a voice note from whoever has the problem
- the data file, or a sample of it, and the paper or spec it should follow
- links to the docs of the library you want used

For an expert, the context that pays off most is the part you take for granted:

- **Definition of done.** What has to be true at the end, stated so it can be checked.
- **Constraints.** Libraries you cannot add, files it must not touch, performance or numerical tolerances, the deployment target.
- **What was tried.** "I fitted this with least squares and the residuals have structure; I suspect the timing jitter model." This saves the agent from rediscovering your dead ends.
- **How to check.** The test command, the reference value, the plot you would look at first.

## Never Wait

A ten-minute run is short. Do not sit and watch it.

**Queue or steer.** When you send a message while the agent is working, it either waits for the next turn (queue) or goes into the running turn (steer). Claude Code and Codex queue a message you send while they work. T3 Code lets you choose per client, lets you edit or remove queued messages before they send, and has a shortcut for the opposite action. Steering only works when the provider supports it; otherwise T3 Code queues. Use steer for corrections ("the API key is in `.env.local`, not `.env`"), queue for the next task.

**Run threads in parallel.** Start a second and third thread on unrelated work. Give each its own branch or worktree (see [Git Hygiene](#git-hygiene-with-agents)).

**Your attention is the bottleneck.** Each thread runs for 10 to 60 minutes and then needs a few minutes of review. Past some number of threads, which in our experience is three to five, the agents start waiting on you instead of the other way round, and review quality drops. That number grows with how well each thread can verify itself.

**Ask for progress you can read in seconds.**

> Give me an update: what you have done, what you are doing now, what is blocking you, and what you have not verified yet. Make it visual and short.

## Self-Verification Is the Goal

This is the most important section on this page.

An agent is a loop: act, observe the result, decide the next action. The quality of the loop is bounded by the quality of the observation. If the only signal is the model rereading its own code, it will find what it expects to find. If the environment answers back with a failing test, a compiler error, a screenshot or a number that does not match, the model has ground truth at every step and can correct itself. Give it a judge and it will iterate until the judge is satisfied. Without one, you are the judge, and you become the slowest part of the loop.

Anthropic's own [best practices](https://code.claude.com/docs/en/best-practices) put the precondition for unattended work in one sentence: "Before a run goes unattended, make sure it knows what done looks like, can check its own work, and can only touch what it should."

Which judge fits depends on the work.

### Tests as the judge

Write the failing test first, or have the agent write it and review the test before any implementation exists. Then the instruction is simple: make it pass without changing the test.

```ts
// pendulum.test.ts
import { describe, expect, it } from "vitest";
import { period } from "./pendulum";

describe("period", () => {
  it("matches the small-angle limit", () => {
    // g = 9.81 m/s², L = 1 m: T0 = 2π√(L/g) = 2.0061 s
    expect(period({ length: 1, amplitudeDeg: 1 })).toBeCloseTo(2.0061, 4);
  });

  it("includes the large-angle correction", () => {
    // Exact period via the complete elliptic integral: T / T0 = 1.0313 at 40°
    expect(period({ length: 1, amplitudeDeg: 40 })).toBeCloseTo(2.0689, 3);
  });
});
```

> Make these tests pass. Do not edit the test file. If you think a test is wrong, stop and tell me why.

The last line matters. A model under pressure to get green will sometimes loosen a tolerance, skip a case or hard-code the expected value. Say up front that the test is fixed, and check the diff for test changes when it reports success.

### The type checker, linter and build

Cheap and fast. `tsc --noEmit`, the linter and a production build catch a large class of errors before anything runs. Put the exact commands in `AGENTS.md` so every thread runs them.

### A browser for UI

> Open the page in the browser, click through every state, check it at 375px and 1440px wide, and fix what looks broken. Loop until it does.

The agent looks at the rendered page, not its own JSX. This reliably gets a UI to correct and decent. It does not get it to "matches what I had in mind"; that judgement stays with you or a designer.

### Run it N times and compare

For anything stochastic (simulations, sampling, model fits with random initialisation, flaky integration tests):

> Before you come back, run it five times with different seeds and report the mean and spread of each output. Flag anything whose spread is larger than the effect you are claiming.

### A reference answer

A known analytic solution, a published value, a slow but obviously correct reference implementation, or a hand-computed case. Ask the agent to build the comparison into a script and run it after every change.

### A second model as reviewer

A fresh thread, ideally on a different model or provider, that sees only the diff and the task description. It has no stake in the first agent's reasoning. Codex has `/review` built in; in T3 Code you can hand the diff to another provider's agent.

### What a loop cannot judge

- **Taste.** Whether a page is good, as opposed to correct.
- **Whether the question was right.** A perfectly verified answer to the wrong question still passes every check.
- **Systematic error shared by every run.** If the model and the judge share a wrong assumption, the loop converges confidently on the wrong answer. See the pendulum example [below](#notebooks-and-explorables-for-scientific-work).

Your job moves from producing to verifying. Ask the agent for the best tool for you to verify its work: if it ran 20 variations, you want one overview of all 20, not 20 scripts to run.

## Tools for Checking: Dashboards, Inline Explainers

With several threads running it is easy to lose track. Ask for a page that keeps you oriented:

> Build a small dashboard for this thread: what you are doing, what you have finished, the results so far as charts, and for each result how I can check it. Keep it updated as you go.

It can be an HTML file in the project or an interactive page rendered inside the thread (T3 Code does this on every provider). Use the inline version for throwaway understanding ("make me something I can click through that explains how this caching layer decides what to evict") and a file when you want to keep it.

For a large diff, ask for a walkthrough instead of a summary: the changes grouped by intent, with the risky parts first and links into the code.

## Notebooks and Explorables for Scientific Work

Agents are good at building the scaffolding around an analysis: loaders, fits, plots, parameter sweeps. They are much less reliable at the physics or statistics itself. Structure the work so the scaffolding can be checked before the science depends on it.

### Synthetic data first

Before real data touches the tool, ask for a generator that produces data in exactly the shape of the real thing (same columns, units, sampling rate, noise model, the occasional missing value) with known true parameters. Then the pipeline has to recover parameters you chose. Only after that does it see a real file.

### Monte Carlo over single answers

> Generate 200 synthetic datasets with the noise level I gave you, run the full fit on each, and show me the distribution of each fitted parameter against its true value.

That shows bias and variance of the method in one plot, which a single run never does.

### Sliders to test understanding

Ask for an explorable: the model, its parameters on sliders, the data overlaid. Drag a parameter to an extreme and see whether the curve does what physics says it should. If it does not, the model misunderstood the problem, and you found out in a minute.

### Export a real notebook

When the exploration is worth keeping, ask for a Jupyter notebook that runs top to bottom from a clean kernel, with the data loading, the fit and the plots in order. A notebook is something a colleague can rerun; an HTML explorable usually is not.

### A replicated wrong answer is still wrong

Say you time a pendulum released at 40° and fit `g` with the textbook formula `T = 2π√(L/g)`. Five runs agree to the third decimal, the Monte Carlo spread is tight, and every result is about 6% low (roughly 9.2 m/s² instead of 9.81), because the small-angle formula ignores that the period at 40° is about 3% longer. Every check in the loop passes, because every check shares the same assumption. Domain expertise is the verifier here: somebody has to know that 40° is not a small angle.

### First answers to hard problems are probably wrong

Their value is diagnostic. Read them to see whether the model understood the problem, which assumptions it made, and which it did not state. Then tighten the problem and run again.

## From a Session to a Project

Most good projects start as a conversation. Start in a scratch thread with no repository (T3 Code calls these threads without a project), talk the problem through, and let the agent try a few things. When it is worth keeping:

> Turn this into a project: create a Git repository, move the useful code into it, and write an `AGENTS.md` that captures everything a new agent would need from this conversation.

In the next session, in a fresh thread:

> Help me get started with this project.

The agent reads `AGENTS.md` and picks up where the last one stopped.

What belongs in `AGENTS.md`:

- what the project is for and who uses it, in two or three sentences
- the commands: install, dev server, test, type check, build
- the verification recipe: which tests, which reference values, what to look at in the browser
- decisions already made and why ("we use the exact elliptic-integral period, not the small-angle formula")
- constraints and things not to touch
- open questions

Keep it short and current. A stale `AGENTS.md` is worse than none, because the agent trusts it. End sessions with:

> Update `AGENTS.md` with what changed today and anything the next agent should know. Remove what is no longer true.

Claude Code reads `CLAUDE.md` and only falls back to `AGENTS.md` when there is no `CLAUDE.md`; Codex reads `AGENTS.md`. See [Context Files](./agentic-coding.md#context-files) for how to serve both.

## Git Hygiene with Agents

Version control is your undo button for everything an agent does. A few habits make it reliable (the commands are in [Version Control](./version-control.md#worktrees-parallel-checkouts-for-parallel-agents)):

- **Commit before a long run, and at every green state.** Ask the agent to commit when tests pass, with a message that says what changed and why.
- **One branch or worktree per thread.** Two agents editing the same checkout overwrite each other's files and confuse each other's test runs. T3 Code can give each thread its own worktree; Claude Code has `claude --worktree`.
- **Small, reviewable commits.** A 3,000-line commit is a commit you will not read.
- **No history rewriting unasked.** Put "never force-push, rebase shared branches or delete branches without asking" in `AGENTS.md`.
- **Checkpoints are not a backup.** Claude Code's `/rewind` restores file edits the agent made through its edit tools, but not changes made by shell commands (a migration, `rm`, a code generator). Git covers both.

## Reviewing Agent Work

Agents report success and failure in the same confident tone. The summary at the end of a run is the agent's belief about what it did, not evidence.

- **Read the diff, not the summary.** In T3 Code the diff view per turn makes this quick.
- **Ask what was not verified.** "List everything you changed that no test or check covers." The answer is usually short and always useful.
- **Look for the usual shortcuts:** deleted or weakened tests, widened tolerances, `try/catch` blocks that swallow errors, hard-coded expected values, mock data or `TODO` stubs left in the real code path, new dependencies nobody asked for.
- **Get a second opinion from a different model.** A reviewer that did not write the code has no reason to defend it.
- **For big changes, ask for a walkthrough page** that groups the diff by intent and shows the risky parts first.

## Permissions and Sandboxing

An agent can run any command your user account can run, unless something stops it. Know what is stopping it.

- **T3 Code** has four permission modes: Supervised, Auto-accept edits, Auto and Full access. The initial default for new threads is Full access. T3 Code is not a sandbox; it passes the mode to the agent underneath.
- **Claude Code** has permission modes including plan mode (read and propose, no edits), and an optional OS-level sandbox for the commands it runs (`/sandbox`, on macOS and Linux).
- **Codex** runs commands in a sandbox with three modes: `read-only`, `workspace-write` (the default) and `danger-full-access`.

"Can only touch what it should" in practice:

- Run long unattended work in a worktree, a container or a separate machine, not in the checkout with your uncommitted thesis chapter.
- Keep production credentials out of the environment the agent runs in. Use separate, low-privilege keys for development, and never paste secrets into a prompt.
- Turn on the sandbox for work that touches untrusted input (scraped pages, third-party repositories). Prompt injection is real: text in a file can tell the agent to do things.
- Choose Full access deliberately, for a machine and a project where the worst case is acceptable.

## Orchestration: A Smart Manager and Cheaper Workers

List prices per million tokens, input / output, in November 2026: Claude Fable 5.2 $8 / $40, Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10 ([pricing](https://platform.claude.com/docs/en/about-claude/pricing)). Output is where the cost is, because output tokens cost five times input on every current Claude model and thinking is billed as output. Moving the bulk of the output from Fable to Sonnet cuts that part of the bill by a factor of four.

Anthropic's own [advice](https://platform.claude.com/docs/en/about-claude/models/overview) is to start with Opus 5.5 and move to Fable only when Opus at higher effort still falls short. Orchestration follows the same idea: put the expensive judgement where it matters.

> Create a fresh thread whose only job is to orchestrate. Use Opus as the orchestrator. Break the work into independent pieces, hand each to a Sonnet subthread running in parallel in its own worktree, and review what comes back against the tests. For decisions you are unsure about, start a separate Fable thread for a second opinion. Keep a dashboard of what each worker is doing.

In T3 Code the workers can be on a different provider than the orchestrator. See [Models and Costs](./models-and-costs.md#the-model-landscape) for what each is good at.

It is not worth it when:

- the task is small enough for one thread to finish in under an hour
- the pieces are tightly coupled, so workers keep colliding in the same files
- the cheaper model's mistakes cost you more review time than the token savings are worth
- there is no automated check, so the orchestrator cannot tell good work from bad any better than you can

## Be More Ambitious

The first result is usually not the best place to continue. A first draft of a research group's site might read like a job application when the people behind it run a serious lab. Polishing that draft is the wrong move. Aim higher instead.

- **Ask for more than you need.** "Do more than I asked; I don't know what you are capable of."
- **Find the goal beyond the goal.** What is this really for? The [Be Ambitious](../skills-table.md#recommended-external-skills) approach formalises this.
- **Borrow references, then go further.** Show work you admire and ask for something in that league.
- **Ask for problems, not just solutions.** "Find ten problems in this area worth solving, ranked by how checkable they are." Pick the good ones and dig in.

## Giving Feedback

Start with what you do not like. It narrows the space fastest.

- "The background is too busy."
- "The header looks squeezed at tablet width."
- "Why is this map a static image? Use a real interactive map."

Then say what to keep and what to add, and be concrete about behaviour: "When I hover or focus a station, show a small card with the next three departures. Use placeholder data for now."

References beat adjectives. A screenshot of a page you like, a plot style from a paper, a link to an app whose interaction you want: each says more than "make it cleaner". Changing course costs almost nothing now, so correct early. The one rule is to look at what it made before anyone else does.

## Be a Better Proxy (or Stop Being One)

A lot of agentic work looks like this: someone with a need sends a voice note, you transcribe it, paste it into a thread, the agent implements it, you check the result and report back. You are a **meat proxy**: a human relay between the person with the need and the model.

That is fine to start with. Better is to give that person direct access to the same setup, so they talk to the agent themselves and get the fast iteration loop. You stay involved where your judgement adds something: architecture, review, verification.

## The Laziness Trap

The tools make exploration cheap. Every idea can be tried in minutes, and a vague curiosity becomes an explorable before lunch. That is a real gain.

The trap is handing over judgement along with the typing. If you stop reading diffs, stop checking results and accept summaries, the work gets worse slowly enough that you do not notice. Stay in the loop on decisions. Read what it made. Check anything that matters twice, with a method the agent did not choose.

## Expertise Still Matters

The strongest position is a triangle:

1. **Software engineering sense**, to know what the agent is doing in code and where it cut corners
2. **Deep domain knowledge**, to judge whether the result is right
3. **The agent**, to do the bulk of the building

Agents accelerate the engineering. Domain knowledge is the verifier that no loop replaces, as the pendulum example shows. A scientist with real engineering experience is well placed: they can check both the code and the science.

## Privacy with Work Data

Having a private account is not permission to put an employer's or client's data into it. Check what your organisation allows first.

What the providers say (details and links in [Fact-Check](./fact-check.md#privacy)):

- Claude consumer plans (Free, Pro, Max, Ultra): training on your chats and code is a setting you choose. With it on, data is kept up to five years; off, 30 days.
- Claude Team, Enterprise and the API: no training unless the customer opts in.
- Zero data retention is a separate agreement for API and qualified Enterprise customers. It is not a consumer feature.
- OpenAI API and business plans: no training by default. For ChatGPT consumer plans, check the setting under Data Controls yourself.

When in doubt, do not send the real data. Ask the agent to generate synthetic data with the same shape and statistics, build and verify the tool on that, and run it on the real data locally.

## Sharing What You Built

The preview your agent opens runs on your machine. Nobody else can see it. Options, from most to least private (setup in [Cloud Infrastructure](./cloud-infrastructure.md#sharing-privately)):

- Your own devices: `tailscale serve` shares a local port with the devices on your Tailscale network. The Personal plan is free for up to six users.
- A private link for a few people: deploy to Cloudflare and put Cloudflare Access in front, with an email one-time code. Free for up to 50 users.
- Public: GitHub Pages, Cloudflare, Vercel. A GitHub Pages site is public even when its repository is private.

## Trying It Beats Reading About It

No article will teach you as much as an hour of trying this on your own problems. Pick one easy and one hard problem from your actual work, give the agent real context and a way to check itself, and see where it breaks.

If you want the tools to work differently, tell the agent. Nobody shipped a feature for answering an agent's clarifying questions as a clickable multiple-choice page; someone found plain-text questions tedious and asked for one. Models write code, and code can do almost anything, so most of what you would want from these tools is one request away.

---

**Related:**
- [T3 Code](./t3-code.md) - The workspace this guide uses
- [Models and Costs](./models-and-costs.md) - Picking models and thinking levels
- [Agentic Coding Basics](./agentic-coding.md) - Context files, prompts, reviews
- [Skills](../skills-table.md) - Reusable instructions, including how to write one
- [Sources and Fact-Check](./fact-check.md) - Where every number comes from
