---
title: "Preview deployment"
summary: "A preview deployment is a copy of the site built from a branch at its own address, so a change can be seen and checked before it goes live."
cluster: shipping
updated: 2026-11-19
aliases: ["preview URL", "deploy preview", "staging"]
---

<!--
Sources: guides/cloud-infrastructure.md "Continuous Deployment"; guides/web-rules.md "Use Preview Deployments", "Test the Deployed Version".
-->

# Preview deployment

A preview deployment is a copy of the site built from a branch at its own address, so a change can be seen and checked before it goes live.

Working on your machine proves less than it seems. The live site is built from scratch somewhere else, with its own settings, and some bugs only appear there: a missing setting, a file that was never committed, a page that is unusable on a phone. Most hosts that [deploy](./deployment.md) from a repository also build every [branch](./branch.md) at its own address while the live site stays as it was. That copy is the preview.

Use it three ways. Open it on your phone and click through it as a member of the club would. Send it to the treasurer who asked for the paid-members list, so they can say whether it is what they meant. And have the agent [check it in a browser](./browser-check.md) the way it checks your local copy:

```text
Push this branch, wait for the preview to build, open it at phone and desktop width, try the change as a member would, and send me the address with what you checked and what you could not.
```

On a [pull request](./pull-request.md) the preview's address usually sits next to the [diff](./diff.md), so [review](./review.md) covers the code and the running result together. Merge when both look right.

Give previews their own test data; a preview wired to the real database changes real members' records. Previews are often open to anyone with the link, which is fine for a colour change and not for a page of members' names: see [sharing privately](./sharing-privately.md).

> [!technical] Setting previews up
> - Connect the repository to a host that builds branches, and check in its settings that preview builds are on and which branches they cover.
> - Give the preview environment its own [environment variables](./secrets.md): a test database, test payment keys, and nothing that can reach production data.
> - Turn on the host's protection for previews if it has one, or put the preview behind a login.
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
