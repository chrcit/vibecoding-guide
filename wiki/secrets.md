---
title: "Secrets and environment variables"
summary: "A secret, such as a database password or an API key, has to stay on the server and out of the repository, and environment variables are how code uses it without containing it."
cluster: web
updated: 2026-11-19
aliases: ["environment variable", ".env", "credentials", "secret key"]
---

<!--
Sources: guides/web-rules.md "Never Expose Secrets"; guides/fullstack-apps.md "Environment Variables"; guides/cloud-infrastructure.md "Environment Variables", "Environment Variable Naming"; guides/version-control.md ".gitignore", "I accidentally committed secrets"; guides/ways-of-working.md "Permissions and Sandboxing".
-->

# Secrets and environment variables

A secret, such as a database password or an API key, has to stay on the server and out of the repository, and environment variables are how code uses it without containing it.

The club list's [database](./database.md) password is a secret: whoever has it can read every member's details and change who has paid. A secret belongs in three places only: a file called `.env` on your machine, the settings of the host you [deploy](./deployment.md) to, and the service that issued it. It never goes into the [frontend](./frontend.md), where any visitor can read it, into the repository, where [version control](./version-control.md) keeps it in the history after you delete the line, or into a prompt.

Code that needs it runs on the [backend](./backend.md) and reads it by name, as an environment variable: "use the value called `DATABASE_URL`". `.env` is listed in `.gitignore`, so it is never committed, and each place can hold a different value, a test database on your laptop and the real one on the live site.

Agents paste keys into code and print them while debugging more often than you would like. Say in your [instruction file](./instruction-file.md) that secrets only ever come from environment variables, search every diff for anything that looks like a key when you [review](./review.md), and now and then ask:

```text
Check this repository and its history for secrets: keys, passwords, tokens, connection strings. List each with its file and commit. Do not print the values.
```

If a secret leaks, replace it at the service that issued it first, then clean up.

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
