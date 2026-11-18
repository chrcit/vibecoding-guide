# Ways of Working with Agents

The tools changed a lot in 2026. This page covers the habits that matter now.

## What Changed

People tried to systematise AI coding for years: one agent for architecture, one for coding, one for tests, one for review. It mostly did not work. The models lost the thread after a while.

Around June 2026 that changed. The best models now stay coherent for **hours**. Personal usage went from a flat line to a steep climb in a few weeks, because suddenly long, unattended work was possible.

The unit of work keeps growing:

- **2023:** "Change these five functions in these three files." You stitched small units together yourself.
- **Now:** "Build this app." A full habit tracker with friends, shared progress, photo check-ins and a phone app came out of about two prompts on the side.

The cost of software has dropped close to zero. What is still hard: knowing what to build, judging whether it is right, and getting people to use it.

## Talk, Don't Type

Use voice-to-text. When you speak you say more than when you type. You will be messy and unstructured, and that is fine. The model handles it.

**The more context you give, the more capable the agent becomes.** Who you are, what you are trying to do, why, what you already tried, what good looks like. All of it helps.

You can also feed it raw material:
- Screenshots (a LinkedIn profile, a design you like, an error)
- Voice notes from clients or colleagues, transcribed
- Meeting transcripts
- Existing documents, data files, links

## Never Wait

A run of 10 minutes is short now. 30 to 60 minutes is common for real work. Do not sit and watch.

- Add more information while it runs. Good models fold it in.
- Start a second and third thread on something else.
- Ask for progress updates when you want them: "Give me an update. What are you doing, why, and what are you trying to achieve? Make it visual and quick."

A typical day might have 3 to 5 experiments going at once. Each runs for 10 to 30 minutes and needs 1 to 5 minutes of your attention when it finishes. An hour of your attention stretches a long way.

## Self-Verification Is the Goal

This is the most important lesson on this page.

An agent can only use its full potential if it has some way to check its own work. Give it a way to tell good from bad and it will loop until it gets there. Without that, you are the only check.

**For design and UI:**
> Review your own work in the browser. Test the interactions and animations. Find the problems and fix them. Loop until it looks right.

The agent opens its own browser, looks at the page, and fixes what it sees. This gets you to "correct and decent" reliably. It does not get you to "special" or "matches my vision": models cannot judge taste at that level yet. That part stays with you (or your designer).

**For technical, data or science work:**
> Before you come back to me, run it five times and compare the results.

> Build a small tool that checks whether the output is correct, then use it.

This is very strong for statistics, simulations and anything with a checkable answer.

**Your job becomes verifying, not producing.** Ask the agent for the best tool for you to verify its work: a dashboard, a table of variations, a notebook you can poke at. If it ran 20 variations, you want one overview of all 20, not 20 scripts to run by hand.

## Dashboards and Inline Explainers

With several things running it is easy to get lost. Ask for a page that keeps you oriented:

> Give me a dashboard that shows what you're doing, explains it, and gives me ways to verify it. Keep it updated.

It can be an HTML file in the project or an interactive view right in the thread. Use the inline version for throwaway understanding ("make me something I can click through that explains this concept") and a file when you want to keep it.

The same goes for thinking tools. A research problem can come back as an interactive notebook with sliders, charts and synthetic data in the right shape. The answer itself may be wrong, especially on hard problems. The value is in seeing whether the model understood the problem at all, and in tweaking variables until **you** understand it better.

## Orchestration: A Smart Manager and Cheaper Workers

The very best model is often about twice the price of the next best one. You can keep most of the intelligence for much less:

> Create a fresh thread whose whole job is to orchestrate. Use [top model] as the orchestrator. Hand the actual work to [strong but cheaper model] subthreads running in parallel. Occasionally start a [top model] thread for a second opinion on hard decisions.

In T3 Code these can even be models from different providers. Use each for what it is good at (see [Models and Costs](./models-and-costs.md)).

## Be More Ambitious

The first result is usually not the best place to continue. A first draft of a portfolio site might look like "someone looking for a job" when the person is a serious researcher. Don't polish that draft. Aim higher.

- **Ask for more than you need.** "Do more than I asked, because I don't know what you're capable of."
- **Find the goal beyond the goal.** What is this really for? (The [Be Ambitious](../skills-table.md#recommended-external-skills) skill does this.)
- **Get inspiration, then take it 30% further.** If you're not a designer, you look for what to fix, not for what's possible. Show it work you admire and ask for something in that league.
- **Ask for problems, not just solutions.** "Find 10 interesting problems in this area worth solving." Swipe yes/no/maybe through them and dig into the good ones.

## Giving Feedback

Start with what you **don't** like. It is the fastest way to narrow things down.

- "I don't like the background."
- "The header looks squished."
- "Why is this map fake? Use a real interactive 3D globe."

Then say what to keep and add. Be concrete about behaviour: "Animate a small plane between the places I've lived. When it lands, or when I hover or focus a place, show a short info card. Use placeholder text for now."

Changing things costs almost nothing now. If you see something odd, say "remove it" and move on. The only rule: **look at what it made before you ship it.**

## Be a Better Proxy (or Stop Being One)

A lot of agentic work looks like this: a client sends a voice note, you transcribe it, paste it into a thread, the agent implements it, you check the result. You are a **meat proxy**: a human relay between the person with the need and the AI.

That is fine to start with. Better: give the other person direct access to the same setup so they can talk to the agent themselves. It saves you little time, but it makes them far more capable because they get the same fast iteration loop.

## Stay Sharp

The tools speed up thinking a lot. Every idea can be explored in minutes, which makes you mentally nimble. Procrastinating on something hard to grasp? Throw a one-liner at it: "Give me this, this and that so I can understand it."

There is a trap. If you stop paying attention and hand over all control, you get lazy and the results get worse. Stay in the loop on decisions. Read what it made. Double-check, then triple-check anything that matters.

## Expertise Still Matters

The strongest position is a triangle:

1. **Software engineering sense** to know what the agent is doing in code
2. **Deep domain knowledge** to judge whether the result is right
3. **The agent** to do the bulk of the building

AI accelerates the engineering. Your domain knowledge is the part it cannot replace. A scientist with some engineering background is in the ideal spot: they can check both the code and the science.

## Trying It Beats Reading About It

There is no article or video that will teach you more than an hour of trying things on your own problems. Nobody is smarter than you about what you want to do. Want to change how your tools work? Tell the agent. Nobody showed anyone how to make a multiple-choice questionnaire out of an agent's clarifying questions; someone just found plain-text questions annoying and asked for it.

**Models can write code, and code can do almost anything. So you can do almost anything by telling the model to do it.**

---

**Related:**
- [T3 Code](./t3-code.md) - The workspace this guide uses
- [Models and Costs](./models-and-costs.md) - Picking models and thinking levels
- [Agentic Coding Basics](./agentic-coding.md) - Context files, prompts, reviews
