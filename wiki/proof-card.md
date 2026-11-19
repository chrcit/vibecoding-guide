---
title: "Proof card"
summary: "A proof card is one piece of evidence that arrives with the work, a summary, a test run, a screenshot or a link to try, each showing one kind of wrong."
cluster: checking
updated: 2026-11-19
aliases: ["proof", "evidence", "review artifact", "receipt"]
---

# Proof card

A proof card is one piece of evidence that arrives with the work, a summary, a test run, a screenshot or a link to try, each showing one kind of wrong.

"Done" is one word, and an agent says it whether or not the work is right. Proof turns it into something you can check at a glance, and each card catches something the others miss:

- A summary shows whether it did what you asked, or something near it.
- A test run shows whether the behaviour holds, with the output, not a claim about it.
- A screenshot shows what the page really looks like, at the width your users have.
- A link lets you try the thing yourself, which catches what nobody thought to test.

Passing the [check](./verification.md) is not the same as being what you wanted: the tests can all pass on the wrong feature. The cards land on your [tray](./tray.md); ask for them with the work ([definition of done](./definition-of-done.md)):

```text
With the work, give me: what you changed in three lines, the test output as it printed, a screenshot of the page at phone width, and a link to try it.
```

> [!technical] Proof for different kinds of work
> Ask for the proof that fits the change. A page: screenshots at two widths. A script: the rows before and after. A bug fix: the test that failed before the fix and passes after it. A refactor: the same tests passing before and after, untouched.
