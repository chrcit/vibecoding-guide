# Agentic Coding: The Basics

How AI agents work with your code: the concepts behind Claude Code, Codex, Cursor, and the tools that run them, like [T3 Code](./t3-code.md).

## What Is Agentic Coding?

**Vibe coding:** You describe, AI builds from scratch. Usually in a web interface.

**Agentic coding:** AI agents work in a real project. They read files, make changes across them, run commands, open a browser to check their work, and keep going for long stretches without you.

The agent is more like a team of collaborators than a generator. The length of task the best models can finish has roughly doubled every four months since 2023 ([METR](https://metr.org/time-horizons/); see [What Changed](./ways-of-working.md#what-changed)), so you can hand over whole features or whole apps and spend your time directing and verifying.

## How Agents Work

### The Agent Loop

```
You give a task
     │
     ▼
Agent reads relevant files
     │
     ▼
Agent plans approach
     │
     ▼
Agent makes changes
     │
     ▼
Agent tests/validates its own work
     │
     ▼
You review and approve
     │
     ▼
Repeat or commit
```

### What Agents Can Do

| Capability | Example |
|------------|---------|
| **Read files** | Understand your codebase |
| **Edit files** | Make changes to existing code |
| **Create files** | Add new files as needed |
| **Delete files** | Remove unnecessary code |
| **Run commands** | Execute tests, builds, etc. |
| **Search code** | Find relevant files and patterns |
| **Web access** | Look up documentation and research |
| **Use a browser** | Open your app, click through it, fix what looks wrong |
| **Start subagents** | Split work into parallel tasks |

### What Agents Need

**Context:** The more the agent knows about your project, the better it performs.

Context sources:
- Files it reads
- Instructions you give (CLAUDE.md, AGENTS.md)
- Conversation history (talk a lot; voice-to-text helps)
- Screenshots, transcripts, voice notes, data files you add
- Skills (see [Skills](../skills-table.md))
- Project structure

## Setting Up for Success

### Project Structure

Agents work better with well-organized projects:

```
my-project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── utils/
├── tests/
├── docs/
├── CLAUDE.md or AGENTS.md  ← Instructions for AI
├── README.md
├── package.json
└── .gitignore
```

### Context Files

Create a file that tells agents about your project. Which file depends on the agent ([Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude Code](https://code.claude.com/docs/en/memory)):

- **Codex** reads `~/.codex/AGENTS.md`, then every `AGENTS.md` from the repository root down to the folder it works in, so a subfolder can add its own rules.
- **Claude Code** reads `CLAUDE.md`. It reads `AGENTS.md` only when there is no `CLAUDE.md`.

To serve both from one source, keep the content in `AGENTS.md` and make `CLAUDE.md` a single line that imports it:

```markdown
@AGENTS.md
```

A typical context file:

```markdown
# Project Overview

This is a recipe sharing app built with Next.js 14 and Supabase.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database, auth)
- Deployed on Vercel

## Key Directories
- `/src/app` - Pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and Supabase client
- `/src/types` - TypeScript types

## Conventions
- Use TypeScript for all new files
- Components use named exports
- API routes return JSON
- Use Supabase client from `/src/lib/supabase.ts`

## Common Tasks
- To add a new page: Create a folder in `/src/app`
- To add a component: Add to `/src/components`
- To modify database: Update Supabase dashboard, then update types
```

### Rules and Conventions

You can also specify coding standards:

```markdown
## Code Style
- Use functional components with hooks
- Prefer `const` over `let`
- Use early returns to reduce nesting
- Add error handling to all async functions
- Keep components under 200 lines

## What NOT to Do
- Don't modify `.env` files
- Don't change the Supabase schema without asking
- Don't remove existing error handling
- Don't add new dependencies without explaining why
```

## Working with Agents

### Good Tasks for Agents

| Task | Why It Works |
|------|--------------|
| Add a feature | Clear scope, builds on existing code |
| Fix a bug | Specific problem to solve |
| Refactor code | Improves existing patterns |
| Add tests | Follows existing code |
| Update multiple files | Agents handle multi-file changes well |

### Hard Tasks for Agents

| Task | Why It's Hard |
|------|---------------|
| "Make it better" (with no way to check) | Nothing to verify against; tell it what "better" means or how to check |
| Taste and vision | Models get to "decent", not to "exactly what I imagined" |
| Security-critical code | Requires careful human review |
| Anything you can't verify yourself | You can't tell if it's right |

Notice the pattern: hard tasks are the ones without a way to verify the result. Give the agent that way and most "hard" tasks become doable. See [Self-Verification](./ways-of-working.md#self-verification-is-the-goal).

### Writing Good Prompts

**Structure your prompts:**

```
## Task
[What you want to accomplish]

## Context
[Relevant background the agent might not know]

## Constraints
[What NOT to do, what to preserve]

## Files
[Specific files to focus on, if known]
```

**Example:**

```
## Task
Add a "duplicate recipe" feature to the recipe detail page.

## Context
- Users should be able to duplicate any recipe to their own collection
- The duplicated recipe should be editable
- The original recipe should be unchanged

## Constraints
- Don't modify the recipe database schema
- Keep the existing RecipeDetail component structure
- Use the existing Supabase client in /src/lib/supabase.ts

## Files
- /src/components/RecipeDetail.tsx (add button here)
- /src/app/api/recipes/route.ts (add duplicate endpoint)
```

### The Review Loop

Never blindly accept AI changes:

```
1. Agent proposes changes
2. You review:
   - Does this do what I asked?
   - Did it change things it shouldn't?
   - Are there obvious bugs?
   - Any security concerns?
3. Request adjustments if needed
4. Test locally
5. Commit if working
```

Make tests the judge wherever you can. Write the failing test first (or have the agent write it and review the test before any implementation), then ask the agent to make it pass without editing the test. When it reports success, check the diff for weakened or deleted tests, widened tolerances and hard-coded expected values. More on this in [Self-Verification](./ways-of-working.md#self-verification-is-the-goal) and [Reviewing Agent Work](./ways-of-working.md#reviewing-agent-work).

### When to Intervene

**Stop the agent and redirect when:**
- It's going in the wrong direction
- It's over-engineering a simple problem
- It's making changes you didn't ask for
- It seems stuck in a loop

**How to intervene:**
- "Stop. Let's try a different approach."
- "That's not what I need. Instead, do X."
- "You're overcomplicating this. Just do the minimum to solve Y."

## Debugging with Agents

### Give Good Error Context

```
I'm getting this error when I click the save button:

Error: Cannot read properties of undefined (reading 'id')
    at saveRecipe (RecipeForm.tsx:45)
    at onClick (RecipeForm.tsx:78)

The error started after I added the duplicate feature.
I expected it to save the recipe and show a success message.
```

### Ask for Explanations

```
Before you fix this, explain:
1. What do you think is causing this error?
2. What approach will you take to fix it?
```

This helps you verify the agent's understanding before it makes changes.

## Managing Complexity

### Break Down Large Tasks

Instead of: "Build the entire user profile system"

Do:
1. "Create the user profile database schema"
2. "Build the profile display component"
3. "Add the profile edit form"
4. "Implement the profile update API"
5. "Add profile image upload"

Each step:
- Is testable independently
- Can be committed separately
- Is easier for the agent to get right

### Maintain Working State

```
Task → Agent changes → Test → Works? → Commit
                              │
                              ▼ Doesn't work?
                         Rollback → Try again
```

Never continue building on broken code.

## Security Considerations

### What Agents Might Do Wrong

- Expose secrets in frontend code
- Skip authentication checks
- Trust user input without validation
- Log sensitive information

### Always Review

**Before committing, check:**
- [ ] No secrets in code (search for API keys, passwords)
- [ ] Auth checks on protected routes
- [ ] Input validation present
- [ ] No sensitive data in logs or errors

### Set Boundaries

In your context file:

```markdown
## Security Rules
- Never put secrets in client-side code
- Always validate user input
- Always check authentication on API routes
- Never expose user data without authorization check
```

### Sandboxing and Permissions

An agent can run whatever your user account can, unless a permission mode or sandbox stops it. Claude Code has permission modes (including a read-only plan mode) and an optional OS sandbox; Codex runs commands in a sandbox whose default only allows writes inside the workspace; T3 Code starts new threads in Full access and is not itself a sandbox. Keep production secrets out of the agent's environment and run long unattended work in a worktree, container or separate machine. Details in [Permissions and Sandboxing](./ways-of-working.md#permissions-and-sandboxing).

## The Mindset Shift

### From "Write Code" to "Direct AI"

Your job becomes:
- **Director:** Give context, set the goal, aim high
- **Orchestrator:** Keep several agents busy in parallel
- **Verifier:** Make sure the agent can check its work, then check the result yourself
- **Domain expert:** Judge whether the result is actually right

### What to Learn

You don't need to write perfect code, but you should understand:
- What good code looks like (patterns, readability)
- Common bugs and security issues
- How to test effectively
- When the AI is wrong

### Building Judgment

Over time, you'll develop intuition for:
- Which tasks AI handles well vs. poorly
- When to trust AI output vs. question it
- How to phrase prompts for better results
- When to stop iterating and ship

---

**Next:** [Ways of Working](./ways-of-working.md) · [T3 Code](./t3-code.md) · [Codex and Claude on the Web](./agentic-coding-web.md)
