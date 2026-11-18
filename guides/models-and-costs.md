# Models and Costs

Which model to use for what, what "thinking levels" mean, and what this all costs.

> **Snapshot: November 2026.** Model names, prices and limits change every few months. The principles below last longer than the numbers.

## The Model Landscape

There are two classes of model right now:

**Top class:** Claude **Opus 5.5** and Claude **Fable 5.2** (Anthropic), plus some OpenAI models for specific jobs.

**Everything else:** Still good, often much cheaper, fine for simple tasks.

### Anthropic models: judgement over long work

Hard to describe. People call it taste. In practice they make better decisions over long stretches of work:

- They stay coherent across hours and across 50 problems at once.
- They spot dead ends early and notice when a "problem" isn't a real one.
- They handle qualitative work: anything that needs intuition or judgement.

Fable is the strongest and roughly twice the price of Opus. Opus is still excellent and better than almost everything else. An example from the community: a large codebase port that OpenAI models ground on for weeks without finishing was done by Opus in about nine days.

### OpenAI models: grinding

OpenAI's models are very goal-driven and token-efficient. Give one a checkable problem (a maths problem, 10,000 test variations) and it will grind on it for hours until it gets there. Good for quantitative work with a clear pass/fail.

### Benchmarks are not your problem

[Artificial Analysis](https://artificialanalysis.ai) is an independent benchmarking site. Its **Intelligence Index** combines many benchmarks into one score, and it shows cost, speed and token usage per model. Useful as a map.

But a high score on many small and medium tasks does not mean a model is better at long, complex work. At the time of writing, OpenAI's newest flagship scores above Opus 5.5 on the index, yet people who use both day to day agree Opus is far better in practice. Try models on **your** work.

### Cheap models got very good

The cost of a given level of intelligence has dropped by something like 100x in a year. ChatGPT's current cheap model scores close to last year's flagship on the index at around 50 to 60 times less cost, which is why the free tier feels nearly unlimited. If you tried ChatGPT a year ago and were disappointed, try again.

## Thinking Levels

### What "thinking" is

Before a model answers you (or writes code), it can write to itself first: an internal dialogue where it works through the problem, checks its understanding and feeds back on its own ideas. This is "thinking" or "reasoning". It is what pushed AI forward so much in the last year.

### What the levels mean

Most tools let you pick **low, medium, high, xhigh** or **max**. That setting is simply how much text the model is allowed to generate while thinking.

Token usage on the Artificial Analysis benchmark suite for Claude Opus (a token is roughly part of a word):

| Level | Tokens generated |
|-------|-----------------|
| max | ~173,000 |
| xhigh | ~103,000 |
| high | ~60,000 |
| medium | ~44,000 |

More thinking is **often** better, but not always much better, and sometimes the model overthinks. Max Opus scores only a couple of points above xhigh on the index for nearly twice the cost.

**Default to medium.** Go higher for hard problems, long autonomous runs, or orchestrators.

### Why it drives cost

Generating text (output tokens) is the expensive part. Reading text (input tokens) is cheaper. Roughly **80% of your cost is output**, and thinking is output. Your thinking level is the biggest knob on your bill.

## What It Costs

### Subscriptions vs. API prices

Tools show a "list price" for the tokens you use: what a company would pay through the API. On a subscription you don't pay that. You pay a flat monthly fee and get usage limits per 5-hour window and per week.

Rough observations with Claude plans (your mileage will vary):

| Plan | Monthly | Usage per 5-hour window (at API prices) |
|------|---------|----------------------------------------|
| Pro | $20 | ~$30 |
| Max | $100 | ~$150 |

A full afternoon session with several parallel agents used about 20% of a $100 plan's window.

**Recommendation:** Start on $20. If you're doing a lot, $100 gets you very far. Between $20 and $100 a month is all most people need. Note that the very top model may not be included on the cheapest plan, or may burn through it fast; check before you rely on it.

### Save money without losing smarts

- Use a cheaper strong model for the bulk of the work and the top model only to orchestrate and give second opinions (see [Ways of Working](./ways-of-working.md#orchestration-a-smart-manager-and-cheaper-workers)).
- Keep thinking on medium unless the task needs more.
- Watch your usage dashboard. Mistakes like a runaway loop can cost real money on pay-as-you-go APIs.
- Check for startup or education programmes; some providers give free credits.

### Privacy

Know whether your account trains on your data, and whether zero data retention is on. Do not put employer or client data into a private account without permission.

## Hardware: Linux vs. Mac

**For heavy agentic work, Linux is noticeably faster.** A plain, cheap Linux box (or a rented server) running your agents all day is a good investment. You connect to it from your laptop or phone, and work continues when the laptop is closed.

**MacBooks are still excellent personal machines:** build quality, longevity, battery life. Their unified memory (the same RAM for CPU and GPU) means they can run sizeable local models, slowly. Handy for things like local transcription.

**Good setup:** Linux server for the agents, MacBook (or whatever you like) for everything else.

---

**Related:**
- [T3 Code](./t3-code.md) - Run models from different providers side by side
- [Ways of Working](./ways-of-working.md) - Orchestration, verification, ambition
