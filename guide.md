# The Vibe Coder's Guide

A practical guide to building web apps with AI tools—without becoming a programmer.

## Table of Contents

1. [Understanding AI Coding Tools](#understanding-ai-coding-tools)
2. [Setting Up Your Prompts](#setting-up-your-prompts)
3. [Tool-Specific Setup](#tool-specific-setup)
4. [The Vibe Coding Workflow](#the-vibe-coding-workflow)
5. [Common Scenarios](#common-scenarios)
6. [When Things Go Wrong](#when-things-go-wrong)
7. [Leveling Up](#leveling-up)

---

## Understanding AI Coding Tools

AI coding tools come in a few flavors. Understanding the difference helps you pick the right one for the job.

### Chat-Based Tools

**Examples:** ChatGPT, Claude, Gemini

You have a conversation. You describe what you want, the AI writes code, you copy it into your project. Good for learning, explaining code, and getting help with specific problems.

**Best for:** Understanding code, fixing bugs, learning concepts, one-off code generation.

### Component Builders

**Examples:** v0 (Vercel), Loveable

You describe a component or page, the AI generates it visually. You can see the result immediately and iterate on it. Often exports directly to your codebase.

**Best for:** UI design, building new pages, prototyping, visual iteration.

### Agent-Based Tools

**Examples:** Codex (OpenAI), Claude Code, Cursor, Windsurf

The AI can read your entire codebase, make changes across multiple files, run commands, and complete complex tasks with less back-and-forth. Most powerful, but requires more setup and trust.

**Best for:** Complex features, refactoring, bug fixes across multiple files, project-wide changes.

### How to Choose

| Task | Best Tool |
|------|-----------|
| "Explain what this code does" | Chat-based |
| "Build me a pricing page" | Component builder |
| "Add user authentication to my app" | Agent-based |
| "Why isn't this working?" | Chat-based or Agent-based |
| "Make my app mobile responsive" | Agent-based |
| "Create a signup form" | Component builder |

You'll probably use multiple tools. That's normal.

---

## Setting Up Your Prompts

### Where to Put System Prompts

Every AI tool has a place for "system prompts" or "custom instructions"—text that shapes how the AI behaves for all your conversations. This is where you put the skills from this repository.

### The Stacking Method

Layer prompts from general to specific:

```
1. [Base vibe coder prompt]    ← Always include this
2. [Specialized skill prompt]   ← Add based on current task
3. [Your project context]       ← Specific to your project
4. [Current task]               ← What you're working on now
```

**Example:**

```
[Paste vibe-coder-base.md content here]

[Paste ui-builder.md content here]

---

MY PROJECT:
- App: Recipe sharing platform
- Tech: Next.js 14 with App Router, Tailwind CSS, Supabase
- Deployed on: Vercel
- Database: Supabase (PostgreSQL)

CURRENT TASK:
Building the recipe detail page. Should show the recipe title,
image, ingredients list, and step-by-step instructions.
Users should be able to save recipes to their collection.
```

---

## Tool-Specific Setup

### v0 (v0.dev)

v0 doesn't have persistent system prompts, but you can include instructions at the start of your conversation.

**How to use it:**

1. Start a new chat
2. Before describing what you want, paste the relevant skills
3. Add your project context
4. Then describe what you want built

**Example first message:**
```
I want you to help me with these guidelines in mind:

[Paste ui-builder.md prompt here]

My project uses Next.js 14 and Tailwind CSS.

Build me a user profile card that shows:
- Avatar image
- Name and username
- Bio
- Follow button
- Stats (posts, followers, following)

Make it feel premium and modern.
```

**Tips for v0:**
- v0 is best for individual components and pages
- Export your components and integrate them into your codebase
- Use the "Edit in v0" button from Vercel deployments to iterate
- v0 understands Tailwind CSS natively

### Loveable (loveable.dev)

Loveable builds full applications from descriptions.

**How to use it:**

1. Go to loveable.dev
2. When creating a new project, include the base prompt in your initial description
3. For ongoing work, paste relevant skills at the start of conversations

**Example initial prompt:**
```
[Paste vibe-coder-base.md here]

Build me a simple invoicing app for freelancers. Features:
- Create and send invoices
- Track payment status
- Basic client management
- Dashboard showing outstanding invoices

Use a clean, professional design. I'll be deploying this on Vercel.
```

**Tips for Loveable:**
- Great for full app scaffolding
- Connect to GitHub early to save your work
- Use the Supabase integration for database features
- Export regularly and commit to Git

### Codex (chatgpt.com/codex)

OpenAI's Codex is an agent that can work on your entire codebase.

**Setup:**

1. Connect your GitHub repository to Codex
2. Go to Settings or use the system prompt area
3. Paste your skills as custom instructions

**Using custom instructions:**

In ChatGPT/Codex, go to Settings → Personalization → Custom Instructions

Paste the base prompt, then add:
```
When working on code projects, also follow these guidelines:

[Paste any specialized skills here]
```

**Example task:**
```
I just pushed a new feature for user profiles. Can you:
1. Review it for security issues
2. Add proper error handling
3. Make sure it's accessible

[Paste project-audit.md if not in custom instructions]
```

**Tips for Codex:**
- Works best with clear, specific tasks
- Let it read and understand your codebase first
- Review changes before accepting them
- Use for multi-file changes and refactoring

### Other Tools

**Cursor / Windsurf:**
- Put prompts in `.cursorrules` or settings file
- These tools have excellent codebase understanding
- Good for ongoing development work

**Claude (claude.ai):**
- Use Projects to save system prompts
- Add skills to Project Instructions
- Good for complex reasoning and explanations

**ChatGPT:**
- Use Custom Instructions in settings
- Or create a Custom GPT with your prompts built in
- Good for explanations and one-off code help

---

## The Vibe Coding Workflow

### Phase 1: Planning

Before asking the AI to build anything:

1. **Describe what you want in plain English.** Not technical requirements, but what the user should be able to do.

2. **List the must-haves.** What absolutely needs to work?

3. **Note any constraints.** Budget, timeline, tools you're already using.

**Example:**
> "I want a page where users can see all their saved recipes. They should be able to filter by category (breakfast, lunch, dinner, dessert) and search by name. Each recipe card should show the image, name, and cook time. Clicking it goes to the full recipe."

### Phase 2: Building

**Start small.** Don't ask for everything at once.

Good: "Build me the recipe card component first"
Bad: "Build me the entire recipe app with all features"

**Iterate visually.** Look at what's generated. Does it match your vision? Give specific feedback:

Good: "The cards are too close together. Add more spacing between them."
Bad: "Make it better."

**Test as you go.** Click around. Try edge cases. What happens with no recipes? With 100 recipes? With a really long recipe name?

### Phase 3: Review

Before sharing your app with users:

1. **Run an audit.** Use the project-audit skill
2. **Test on mobile.** Resize your browser or use a real phone
3. **Try breaking it.** Enter weird data, click things fast, use the back button
4. **Check the basics:**
   - Does it work without logging in? (if it shouldn't, that's a bug)
   - Can users do what they came to do?
   - Is the text readable?
   - Do buttons and links work?

### Phase 4: Ship & Iterate

**Deploy early and often.** Modern hosting (Vercel, Railway) makes this free and easy. Every push to main can be live in minutes.

**Collect feedback.** Watch people use your app. Their confusion is your next todo list.

**Keep improving.** Vibe coding is iterative. Version 1 won't be perfect. That's fine.

---

## Common Scenarios

### "The AI keeps doing weird things"

**Reset context.** Start a new conversation. AI tools accumulate confusion over long chats.

**Be more specific.** Instead of "that's not right," explain exactly what you expected vs. what happened.

**Provide examples.** "I want it to look more like [this site]" or "The animation should feel like [this]"

### "I don't understand what it wrote"

**Ask for explanation.** "Explain this code to me like I'm not a developer. What does each part do and why?"

**Ask for analogies.** "Compare how this authentication system works to something in the real world."

**Ask about risks.** "What could go wrong with this code? What should I watch out for?"

### "Something broke and I don't know why"

**Describe the symptom.** "When I click the save button, nothing happens" is better than "it's broken."

**Share the error.** If there's a red error message, copy the whole thing.

**Note what changed.** "It worked yesterday. Since then I added the profile feature."

**Use the audit skill.** It might catch the problem automatically.

### "I need to do something on Vercel/Supabase/GitHub but don't know how"

**Ask the AI.** "Give me step-by-step instructions to add an environment variable in Vercel. Assume I've never done this before."

The prompts tell the AI to give you click-by-click instructions for platform tasks.

### "The app is slow"

Ask: "My app feels slow when loading the recipes page. What could be causing this and how do we fix it?"

Common causes:
- Loading too much data at once (need pagination)
- Images not optimized (need compression)
- Too many database queries (need optimization)
- Too much JavaScript (need code splitting)

The AI should identify and fix these automatically with the base prompt.

---

## When Things Go Wrong

### The Codebase is a Mess

This happens. Vibe coding can accumulate technical debt fast.

**Recovery steps:**
1. **Commit what works.** Make sure your current (working) code is saved
2. **Start an audit.** Let the AI identify the biggest problems
3. **Pick one thing.** Don't try to fix everything at once
4. **Refactor incrementally.** Small improvements over time

### You're Stuck on a Bug

1. **Describe everything:** What you expected, what happens, when it started
2. **Share context:** Recent changes, full error messages, what you tried
3. **Try a different AI tool:** Sometimes fresh context helps
4. **Ask for debugging help:** "How would you approach debugging this?"

### The App Won't Deploy

**Check the build logs.** Vercel/Netlify show you exactly what failed.

**Share the error.** Copy the entire error message to your AI tool.

**Common causes:**
- Missing environment variables (need to set them in Vercel)
- TypeScript errors (code issues that need fixing)
- Missing dependencies (packages not installed)
- File path issues (works on your computer, not on server)

### You Lost Code

**Check Git history.** If you've been committing, your code is saved.

**On GitHub:** Look at the commit history, you can restore old versions.

**On Vercel:** Each deployment is saved, you can roll back.

**Prevention:** Commit early, commit often. Every meaningful change should be a commit.

---

## Leveling Up

### Skills Worth Learning

You don't need to become a developer. But knowing a bit helps:

**Git basics:**
- `git add` and `git commit` (saving work)
- `git push` and `git pull` (syncing with GitHub)
- How to read a diff (what changed between versions)

**Browser DevTools:**
- How to open them (F12 or right-click → Inspect)
- Console tab (shows errors)
- Network tab (shows what's loading)
- Elements tab (shows the page structure)

**Reading error messages:**
- The file name and line number tell you where
- The message tells you what
- Stack traces read bottom-to-top

### Recognizing AI Mistakes

Common AI errors to watch for:

**Hallucinated features:** AI invents APIs or functions that don't exist. If something doesn't work, ask "Does this API/function actually exist?"

**Outdated patterns:** AI training data has a cutoff. Ask "Is this the current recommended way to do this?"

**Over-engineering:** AI loves adding "just in case" code. Ask "Do we actually need this? What's the simplest version?"

**Inconsistent style:** AI might mix patterns. Watch for sudden changes in how code is written.

### Building Judgment

Over time, you'll develop intuition for:

- When to trust the AI vs. when to question it
- What "good code" looks like (consistent, readable, not overly complex)
- When something will cause problems later
- What questions to ask before implementing

This comes from experience. Keep building, keep learning.

---

## Quick Reference

### Starting a New Project

```
1. Create repo on GitHub
2. Clone locally or use tool's GitHub integration
3. Set up system prompts with vibe-coder-base + relevant skills
4. Describe project context (tech stack, requirements)
5. Start with the core feature first
6. Deploy early (even if incomplete)
7. Iterate based on feedback
```

### Before Every Session

```
1. Pull latest changes (if collaborating)
2. Run the app locally
3. Note what you want to accomplish
4. Clear/focused conversation with AI
5. Test changes before committing
6. Push working code to GitHub
```

### Before Going Live

```
1. Run project audit skill
2. Fix all critical and important issues
3. Test on mobile
4. Check authentication/authorization works
5. Verify environment variables are set in hosting
6. Test the deployed version (not just local)
```

### When Stuck

```
1. Step back and describe the actual goal
2. Ask AI to explain the problem in simple terms
3. Try a simpler approach
4. Start a new conversation if context is polluted
5. Take a break (seriously)
```

---

That's it. Happy building.
