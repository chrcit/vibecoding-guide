---
title: "Secrets and environment variables"
summary: "A secret, such as a database password or an API key, has to stay on the server and out of the repository, and environment variables are how code uses it without containing it."
cluster: web
updated: 2026-11-18
aliases: ["environment variable", ".env", "credentials", "secret key"]
---

<!--
Sources: guides/web-rules.md "Never Expose Secrets"; guides/fullstack-apps.md "Environment Variables"; guides/cloud-infrastructure.md "Environment Variables", "Environment Variable Naming"; guides/version-control.md ".gitignore", "I accidentally committed secrets"; guides/ways-of-working.md "Permissions and Sandboxing".
-->

# Secrets and environment variables

A secret, such as a database password or an API key, has to stay on the server and out of the repository, and environment variables are how code uses it without containing it.

The football club's members list keeps its data in a [database](./database.md). The app needs a password to reach it. Whoever has that password can read every member's details and change who has paid. That makes it a secret, and there are three places it must never end up.

The first is the [frontend](./frontend.md). Anything that runs in the visitor's browser can be read by the visitor: open the browser's developer tools and it is there. A secret belongs on the [backend](./backend.md), on a server you control.

The second is the repository. [Version control](./version-control.md) keeps every version of every file, and repositories get shared, copied and made public. A password typed into the code stays in its history even after you delete the line.

The third is a prompt. Paste a production key into a conversation with an agent and it is now in a transcript you do not control.

An environment variable solves the first two. The code says "use the value called `DATABASE_URL`" and the actual value lives outside the code: in a file called `.env` on your machine, which is listed in `.gitignore` so it is never committed, and in the settings of your host when you [deploy](./deployment.md). Each place can hold a different value, so your laptop talks to a test database and the live site to the real one.

Agents get this wrong more often than you would like. Asked to make something work, an agent may paste a key straight into a component, or log it while debugging. When you [review](./review.md) a change, search the diff for anything that looks like a key, and say in your instruction file that secrets only ever come from environment variables.

If a secret does leak, change it first. Replace the key or password with a new one at the service that issued it, then clean up.

> [!technical] Variables the browser can see
> Most frameworks have a way to expose an environment variable to the browser on purpose, usually by giving its name a special prefix. Anything with that prefix is copied into the frontend code at build time and is public, whatever the name says. Use it only for values that are meant to be public, such as a site's analytics ID.
>
> Keep a `.env.example` in the repository with every variable name and no values, so a new checkout (or a new [worktree](./worktree.md)) knows what to fill in. When something works on your machine and fails once deployed, a variable missing from the host's settings is the first thing to check.
>
> Your agent counts as an environment too. Give it development keys with the least access that works, never production credentials, and keep it in a [permission mode](./permission-mode.md) that matches what is within its reach. Text the agent reads can try to make it send those keys somewhere: see [prompt injection](./prompt-injection.md).

> [!engineer] After a leak, and before one
> Order matters after a leak. Revoke and reissue the credential first, because rewriting history does not reach clones, forks, caches or anyone who already copied it. Then check the service's access logs for use of the old one. Only then remove it from history, if at all, and tell collaborators to re-clone.
>
> Prevention is cheaper:
>
> - Turn on the secret scanning your Git host offers, and add a pre-commit hook that looks for key patterns, so a mistake is caught before it leaves your machine.
> - Scope each credential to one purpose and one environment, so a leaked development key cannot touch production. For a model's [API key](./api-key.md), set a spending limit as well.
> - Prefer short-lived credentials issued at run time (a deploy platform's own identity, or a secrets manager) over long-lived keys pasted into settings.
> - Remember that build logs, error reports and analytics can capture environment values. Check what your logging records before an agent adds "print everything" while debugging.
