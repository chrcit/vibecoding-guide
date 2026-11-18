---
title: "Preview deployment"
summary: "A preview deployment is a copy of the site built from a branch at its own address, so a change can be seen and checked before it goes live."
cluster: shipping
updated: 2026-11-18
aliases: ["preview URL", "deploy preview", "staging"]
---

<!--
Sources: guides/cloud-infrastructure.md "Continuous Deployment"; guides/web-rules.md "Use Preview Deployments", "Test the Deployed Version".
-->

# Preview deployment

A preview deployment is a copy of the site built from a branch at its own address, so a change can be seen and checked before it goes live.

The football club's treasurer wants the members list to show who has paid this season. An agent builds it on a [branch](./branch.md), and it works on your machine. That proves less than it seems. Your machine has your settings, your files and your browser; the live site runs somewhere else, built from scratch, with its own configuration. Things that break only there are common: a missing setting, a file that was never committed, a page that is fine on a laptop and unusable on a phone.

Most hosts that [deploy](./deployment.md) from a repository will also build every branch on its own. Push the branch and shortly afterwards the change is running at a separate address, while the live site stays exactly as it was. That copy is the preview.

It is useful three ways. You can open it on your phone and click through it as a member would. The treasurer can try it and say whether it is what she meant, before anyone else sees it. And an agent can open it in a browser and [check it](./browser-check.md) the same way it checks your local copy, which catches the class of bug that only appears once deployed.

When you open a [pull request](./pull-request.md) for the branch, the preview's address usually appears on it next to the [diff](./diff.md), so the [review](./review.md) can look at the code and the running result together. Merge when both look right; the live site then rebuilds from the main line.

A preview is only as safe as what it is connected to. If it talks to the real database, trying out the new feature changes real members' records. Give previews their own test data.

Previews are often reachable by anyone who has the link. That is fine for a change to the club's colour scheme and not fine for a page that lists members' names. For anything private, see [sharing privately](./sharing-privately.md).

> [!technical] Setting previews up
> - Connect the repository to a host that builds branches, and check in its settings that preview builds are on and which branches they cover.
> - Give the preview environment its own [environment variables](./secrets.md): a test database, test payment keys, and nothing that can reach production data.
> - Turn on the host's protection for previews if it has one, or put the preview behind a login.
> - Ask the agent to finish a task by pushing the branch, waiting for the preview, opening it at a phone width and a desktop width, and reporting the address with what it checked.
>
> Some teams also keep a long-lived staging site that mirrors production more closely. A preview per branch is the lighter version of the same idea, and enough for most small projects.

> [!engineer] Where previews mislead
> A preview reproduces the build and the code. It does not automatically reproduce the data, the traffic or the integrations, and that is where the bugs it misses live.
>
> - Database migrations. If the branch changes the schema, the preview needs its own database or a branch-scoped copy; pointing a migrating preview at a shared database breaks every other branch using it.
> - Webhooks and callbacks. Payment providers and login services call back to a fixed address. Previews at a new address each time need either a wildcard allow-list or a mock.
> - Cookies and domains. A preview on the host's domain rather than yours can behave differently for logins and anything set per domain. See [domains and DNS](./domain-and-dns.md).
> - Cost and load. A preview with no traffic says nothing about performance under real use, and caches start cold.
>
> Treat a green preview as evidence the build and the change are sound, not that production will behave the same. Keep the rollback path for the live deploy simple: redeploying the previous commit should be one step.
