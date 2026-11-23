---
title: "Tray"
summary: "The tray is the place beside you where an agent leaves what you need to look at: proof, a question or a plan, one card each."
cluster: checking
updated: 2026-11-19
aliases: ["the board", "inbox", "review queue"]
---

# Tray

The tray is the place beside you where an agent leaves what you need to look at: proof, a question or a plan, one card each.

In the picture it is the plate beside your pawn, and the cards stand on it. A blue edge means a card waits for you; an orange one shows something wrong. It is a picture of a habit, not one product's feature: in a coding tool it might be the list of threads, a pull request's page, a progress file or a message on your phone.

What makes a tray work is that each card answers one question at a glance, so you can look without reading the whole change. The cards that do this are [proof cards](./proof-card.md): a summary, a test run, a screenshot, a link to try. A question card lets the agent carry on while it waits for your answer ([queue and steer](./queue-and-steer.md)).

Ask for the tray in the request:

```text
When you finish, leave me: a three-line summary, the test output, a screenshot at phone width, and a link I can open. If you need a decision, ask it as one question and carry on with the rest.
```

> [!technical] With several jobs
> With several jobs at once the tray is the board you work from: one card per job, each with its name, its state and the next thing it needs from you. Keep the cards short; a long card is a window you have to read.
