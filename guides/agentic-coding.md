# Agentic Coding: The General Guide

Understanding how AI agents work with your code—the concepts behind Codex, Claude, Cursor, and similar tools.

## What Is Agentic Coding?

**Vibe coding:** You describe, AI builds from scratch. Usually in a web interface.

**Agentic coding:** AI works with your existing code. It reads your project, understands context, makes changes across files, and can run commands.

The agent is more like a collaborator than a generator.

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
Agent tests/validates (optional)
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
| **Web access** | Look up documentation (some agents) |

### What Agents Need

**Context:** The more the agent knows about your project, the better it performs.

Context sources:
- Files it reads
- Instructions you give (CLAUDE.md, AGENTS.md)
- Conversation history
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

Create a file that tells agents about your project:

**CLAUDE.md** (for Claude-based tools) or **AGENTS.md** (for Codex):

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
| "Make it better" | Too vague |
| Architectural decisions | Needs human judgment |
| Complex debugging | May not have full context |
| Security-critical code | Requires careful review |

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

## The Mindset Shift

### From "Write Code" to "Direct AI"

Your job becomes:
- **Architect:** Design the overall structure
- **PM:** Break down tasks clearly
- **Reviewer:** Evaluate AI output critically
- **Tester:** Verify things actually work

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

**Next:** [Agentic Coding with Codex and Claude](./agentic-coding-web.md)
