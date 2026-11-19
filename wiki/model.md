---
title: "Model"
summary: "The model is the part of an agent that reads and writes text; everything else is built around it."
cluster: basics
updated: 2026-11-19
aliases: ["LLM", "large language model", "AI model"]
---

<!--
Sources to draw on:
- guides/t3-code.md: "Harness vs. ADE"
- guides/models-and-costs.md: "The Model Landscape", "Comparing two models yourself"
-->

# Model

The model is the part of an agent that reads and writes text; everything else is built around it.

In the picture it is the cap on the glass column. It reads everything in its [window](./context-window.md), in pieces called [tokens](./token.md), writes the next part, and keeps nothing between turns ([Chat, lesson 5](/journey/chat/)). Opening files and running commands is the [harness](./harness.md)'s work; model and harness together make the [agent](./agent.md).

You choose two things: which model, and how hard it thinks on a job ([effort](./effort.md)). Models differ in skill, speed and price, and the line-up changes every few months, so it lives on the [models page](/models/) with sources. Scores from [benchmarks](./benchmarks.md) are a start. Your own work is the better test: give the same small task to two models in two threads and keep the one whose result you had to fix less.

A common split is a stronger model for planning and review and a faster one for searching and routine edits; see [orchestration](./orchestration.md). You pay through a [subscription plan](./subscription-plan.md) or an [API key](./api-key.md).
