---
title: "Branch"
summary: "A branch is a separate line of work on the project; main is the line everything lands on, and a branch joins it when it is merged."
cluster: shipping
updated: 2026-11-19
aliases: ["main", "merge", "feature branch"]
---

<!--
Sources to draw on:
- guides/version-control.md: "Branches", "Why Use Branches", "Branch Commands", ""My push was rejected""
-->

# Branch

A branch is a separate line of work on the project; main is the line everything lands on, and a branch joins it when it is merged.

In the picture, main is the plate every finished piece lands on ([chapter 7](/journey/parallel/), [chapter 8](/journey/lead/)). Work happens on a branch, so main keeps working while a change is half done. When the change passes its checks it is merged into main. A [pull request](./pull-request.md) is the usual place to look at it first, and a [preview](./preview-deployment.md) lets you click through it.

A branch is not a copy: one folder shows one branch at a time. Two agents at once need a [worktree](./worktree.md) each.

Set the rule once, in [AGENTS.md](./instruction-file.md):

```text
Never commit to main. Start each task on a new branch named after it,
commit when the checks pass, and tell me when it is ready to merge.
```

Branches are part of [version control](./version-control.md); that article covers commits and history.

> [!technical] The commands
> ```sh
> git switch -c holiday-hours   # a new branch from where you are
> git switch main               # back to main
> git merge holiday-hours       # bring the finished work in
> git branch -d holiday-hours   # tidy up once it is merged
> ```
>
> If main moved on while you worked, bring it into the branch (`git merge main`) and run the checks again before merging back.
