# Agentic Coding with Codex and Claude on the Web

Using OpenAI Codex and Anthropic Claude through web interfaces to work with your existing code.

> **Note:** Web interfaces are the no-install option. For daily work, running agents in a desktop ADE like [T3 Code](./t3-code.md) (on your machine or a server) gives you parallel threads, a built-in browser for self-verification, and models from several providers. Claude Code is also available on the web at claude.ai/code and can work directly on GitHub repos.

## Overview

These tools connect to your GitHub repositories and work on your code through a web interface—no terminal or local setup required.

| Tool | Made By | Access Via |
|------|---------|-----------|
| **Codex** | OpenAI | chatgpt.com/codex |
| **Claude** | Anthropic | claude.ai (Projects) |

## OpenAI Codex

### What It Is

Codex is an AI agent that:
- Connects to your GitHub repositories
- Works on tasks in isolated cloud environments
- Creates pull requests with its changes
- Can review PRs, work on issues, and automate workflows

### Getting Started

1. **Go to** [chatgpt.com/codex](https://chatgpt.com/codex)
2. **Connect GitHub** when prompted
3. **Select a repository** you want to work on
4. **Give a task** in natural language

### How It Works

```
You describe task → Codex clones your repo → Works in sandbox → Creates PR
```

**Key points:**
- Codex works in an isolated copy of your code
- Changes are delivered as pull requests
- You review and merge like any other PR
- Your main branch stays safe

### Task Examples

**Add a feature:**
```
Add a search bar to the recipes page that filters recipes by name.
The search should be instant (no button needed).
Put it above the recipe grid.
```

**Fix a bug:**
```
The login button doesn't work on mobile.
When I tap it on my phone, nothing happens.
The console shows no errors.
Fix this issue.
```

**Review code:**
```
@codex review this PR
```
(Use in PR comments on GitHub)

**Refactor:**
```
The UserProfile component is too long (400+ lines).
Break it into smaller, focused components.
Keep the same functionality.
```

### AGENTS.md

Create an `AGENTS.md` file in your repo root to guide Codex:

```markdown
# Project: Recipe App

## Overview
A recipe sharing platform built with Next.js 14 and Supabase.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth, database)

## Structure
- /src/app - Pages and routes
- /src/components - UI components
- /src/lib - Utilities and Supabase client

## Conventions
- Use TypeScript strict mode
- Components are functional with hooks
- Use Tailwind for styling
- Tests go in __tests__ folders

## Priorities
- P0: Security issues, data loss bugs
- P1: User-facing bugs, broken features
- P2: Minor bugs, polish

## When reviewing PRs
- Check for TypeScript errors
- Verify error handling exists
- Flag any security concerns
```

Codex reads this automatically when working on your repo.

### GitHub Integration

**Working with Issues:**
```
Fix issue #42
```

Codex reads the issue, works on it, and references it in the PR.

**PR Reviews:**

In any PR comment:
```
@codex review
```

Codex provides a code review with suggestions.

**Automated with GitHub Actions:**

You can set up Codex to run automatically on PRs, issues, etc.

### Best Practices

**Do:**
- Give specific, scoped tasks
- Reference specific files when helpful
- Let it create PRs (easier to review)
- Use AGENTS.md for project context

**Don't:**
- Ask for vague improvements
- Let it make massive changes without review
- Merge PRs without testing
- Give it access to repos with secrets in code

## Claude (Web Interface)

### What It Is

Claude's web interface at claude.ai can work with your code through:
- **Projects:** Upload files and set system prompts
- **Chat:** Paste code and ask questions
- **Artifacts:** Generate and preview code

### Using Projects

Projects give Claude persistent context about your codebase:

1. **Create a Project** at claude.ai
2. **Add files** to the project (upload or paste)
3. **Set Project Instructions** (like a system prompt)
4. **Chat** with the project context always available

### Project Instructions

Set up instructions that apply to all chats in the project:

```markdown
# Recipe App Project

You're helping me build a recipe sharing app.

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase

## My Skill Level
I'm not a professional developer. Explain things clearly.
When making changes, tell me which files to modify.

## Code Style
- Use functional components
- Add TypeScript types
- Include error handling
- Comment complex logic

## When I Ask for Help
1. Explain the approach first
2. Show the code changes
3. Tell me how to test it
4. Warn me about potential issues
```

### Workflow

Since Claude can't directly access GitHub, the workflow is:

```
1. Copy relevant code to Claude
2. Discuss and get changes
3. Copy changes back to your files
4. Test locally
5. Commit to GitHub
```

### Task Examples

**Understanding code:**
```
Here's my RecipeCard component:
[paste code]

Explain what it does and how the data flows.
```

**Adding features:**
```
I want to add a "favorite" button to this component.
Here's the current code:
[paste code]

When clicked, it should save to the user's favorites in Supabase.
Show me the changes needed.
```

**Debugging:**
```
This code throws an error:
[paste code]

Error: Cannot read property 'map' of undefined

Why is this happening and how do I fix it?
```

**Code review:**
```
Review this code for issues:
[paste code]

Check for:
- Bugs
- Security problems
- Performance issues
- Best practices
```

### Using Artifacts

Claude can create "artifacts"—preview windows showing:
- React components (interactive preview)
- HTML/CSS (rendered preview)
- Mermaid diagrams
- Code files

Ask: "Create an artifact with a preview" to see your component live.

### Best Practices

**Do:**
- Use Projects for ongoing work
- Include relevant context (related files)
- Ask for explanations, not just code
- Iterate on suggestions

**Don't:**
- Paste your entire codebase (too much noise)
- Expect Claude to remember previous sessions (without Projects)
- Blindly copy code without understanding it

## Comparing the Tools

| Aspect | Codex | Claude (Web) |
|--------|-------|--------------|
| **GitHub Integration** | Direct (connects to repos) | Manual (copy/paste) |
| **Output** | Pull requests | Code in chat |
| **Best For** | Large changes, PRs | Understanding, planning |
| **Automation** | Yes (Actions, webhooks) | No |
| **Persistent Context** | AGENTS.md | Projects |

### When to Use Which

**Use Codex when:**
- Making changes to existing repos
- You want PRs for review
- Working on GitHub Issues
- Automating workflows

**Use Claude when:**
- You need explanations
- Planning before implementing
- You're not sure what approach to take
- Learning new concepts
- Quick questions about code

### Using Both Together

A powerful pattern:

```
1. Plan with Claude
   - Discuss the feature
   - Understand the approach
   - Get code suggestions

2. Implement with Codex
   - Give the refined task
   - Let it create the PR
   - Review the changes

3. Debug with Claude
   - If something's wrong, discuss with Claude
   - Understand the issue
   - Have Codex fix it
```

## Common Issues

### Codex: PR Has Conflicts

The repo changed while Codex was working:

1. Close the PR
2. Make sure your main branch is up to date
3. Ask Codex to try again

### Codex: Changes Too Many Files

Be more specific in your prompt:

```
Only modify the RecipeCard component in /src/components/RecipeCard.tsx
Don't change any other files.
```

### Claude: Lost Context

Claude's memory is limited to the current conversation (unless using Projects):

1. Use Projects for ongoing work
2. Re-share relevant context when starting new chats
3. Keep important decisions documented in your repo

### Both: Wrong Approach

The AI is going in the wrong direction:

```
Stop. That's not the approach I want.
Instead, I need [explain what you actually want].
Let's start over with this approach.
```

## Security Reminders

**With Codex:**
- It has access to your repo code
- Don't store secrets in your repo
- Review all PRs before merging
- Check that secrets aren't exposed in changes

**With Claude:**
- Don't paste API keys or passwords
- Be careful with proprietary code
- Remove sensitive data before sharing

---

**Related:**
- [Agentic Coding Basics](./agentic-coding.md) - Core concepts
- [T3 Code](./t3-code.md) - Run agents from several providers in one place
- [Version Control](./version-control.md) - Git and GitHub basics
- [Vibe Coding with Web Builders](./vibe-coding-web.md) - v0, Lovable, etc.
