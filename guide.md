# The Vibe Coder's Guide

Everything you need to start building web apps with AI tools.

**What this covers:**
1. [Understanding Your Tools](#understanding-your-tools)
2. [Setting Up](#setting-up)
3. [The Workflow](#the-workflow)
4. [Common Problems](#common-problems)
5. [Learning to Evaluate AI Output](#learning-to-evaluate-ai-output)

---

## Understanding Your Tools

AI coding tools come in different flavors. Understanding the differences helps you pick the right one.

### Tool Categories

| Type | Examples | Best For |
|------|----------|----------|
| **Chat-based** | ChatGPT, Claude | Learning, explanations, one-off code |
| **Component builders** | v0, Lovable, Bolt | UI design, new pages, prototyping |
| **Agent-based** | Codex, Cursor, Claude Code | Complex features, working with existing code |

### Detailed Tool Breakdown

#### v0 (v0.dev)
**What it does:** Generates React components and pages using Next.js, Tailwind CSS, and shadcn/ui.

**How it works:**
- Describe a component or page in natural language
- v0 generates code you can preview immediately
- Iterate with follow-up prompts
- Export code to your project

**Key features:**
- Attach screenshots and v0 will recreate the design
- Organize chats into projects with custom instructions
- Generates complete, copy-paste-ready code
- Built-in preview rendering

**Good for:** UI components, landing pages, forms, dashboards. Starting new projects with Next.js.

**Limitations:** Frontend-focused. For backend/database functionality, you'll need to add that yourself or use another tool.

**Prompting tips:** Be specific about what you're building, who uses it, and design constraints. Attach reference images when possible.

---

#### Lovable (lovable.dev)
**What it does:** Full-stack app generation from natural language descriptions.

**How it works:**
- Describe your app in plain English
- Lovable generates frontend, backend, and database
- Built-in Supabase integration for data and auth
- Deploy directly from the platform

**Key features:**
- **Lovable Cloud:** Built-in databases, authentication, storage, and edge functions
- **Agent Mode:** Autonomous AI development with debugging and problem-solving
- **GitHub integration:** Sync your code to a repository
- **Visual editing:** Modify UI through conversation or drag-and-drop

**Good for:** MVPs, full-stack apps, dashboards, admin tools, SaaS prototypes. Non-technical founders.

**Limitations:** Can get stuck in debugging loops. Minor changes sometimes cascade to unexpected files. More complex customization may require exporting to Cursor.

**Prompting tips:** Start with your core use case. Be clear about user flows. Describe what success looks like.

---

#### Codex (OpenAI)
**What it does:** AI agent that works on your existing codebase through GitHub.

**How it works:**
- Connect your GitHub repository
- Ask Codex to work on tasks (features, bugs, reviews)
- Codex creates pull requests with its changes
- Review and merge like normal code

**Key features:**
- **GitHub integration:** PR reviews, issue work, CI/CD automation
- **Cloud tasks:** Runs in isolated sandboxes with your repo
- **Context preservation:** Move work between web, terminal, and IDE
- **Automatic environment setup:** Detects and runs setup scripts

**Good for:** Adding features to existing projects, code reviews, bug fixes, working with established codebases.

**Limitations:** Requires GitHub account and repo. More complex setup than web-based tools. Works best with well-organized codebases.

**How to use it:**
1. Go to [chatgpt.com/codex](https://chatgpt.com/codex)
2. Connect your GitHub account
3. Select a repository
4. Describe your task

---

#### Cursor / Windsurf
**What they do:** AI-powered code editors. You write code with AI assistance.

**How they work:**
- Open your project in the editor
- AI suggests completions, answers questions, makes changes
- Agent mode can make multi-file changes autonomously
- You review and accept changes

**Good for:** Developers who want AI assistance. More control than web tools. Working with any tech stack.

**Limitations:** More of a learning curve. Requires local development setup. Better with some coding knowledge.

---

### Choosing Your Tool

**Just starting out?**
→ Start with Lovable or v0. Build something simple. Learn how AI coding feels.

**Have a working prototype?**
→ Export to GitHub. Use Cursor or Codex for more complex work.

**Existing codebase?**
→ Codex or Cursor. They understand project context.

**Just need a component?**
→ v0 is fastest. Copy the code into your project.

---

## Setting Up

### Using the System Prompts

Every tool has a place for "system prompts" or "custom instructions" that shape how the AI behaves.

#### v0
v0 supports project-level custom instructions:
1. Create a new project in v0
2. Open project settings
3. Add your custom instructions there
4. All chats in that project use those instructions

For one-off chats, paste your system prompt at the start of the conversation before your actual request.

#### Lovable
Include system prompts in your initial project description, or paste them at the start of conversations for ongoing projects.

#### Codex
Uses `AGENTS.md` file in your repository root for persistent instructions:
1. Create `AGENTS.md` in your repo
2. Add your guidelines and preferences
3. Codex reads this file for every task

For web interface, paste instructions in the task description.

#### Cursor / Windsurf
Create rules files in your project:
- Cursor: `.cursor/rules/*.md`
- Windsurf: `.windsurf/rules/*.md`

These are automatically applied to all AI interactions in that project.

### The Stacking Method

Layer prompts from general to specific:

```
1. [Base prompt]           ← Always include
2. [Specialized skill]     ← Add for specific tasks
3. [Project context]       ← Your tech stack, constraints
4. [Current task]          ← What you're doing now
```

**Example:**
```
[Paste vibe-coder-base.md]

[Paste ui-builder.md]

---
PROJECT CONTEXT:
- App: Recipe sharing platform
- Tech: Next.js 14, Tailwind, Supabase
- Deployed: Vercel
- Style: Clean and minimal

TASK:
Build the recipe detail page with:
- Large hero image
- Ingredients list
- Step-by-step instructions
- Save to favorites button
```

---

## The Workflow

### Phase 1: Planning (20% of your time)

Don't skip this. Good planning prevents most debugging.

**Start a conversation:**
```
I want to build [your idea].

Ask me questions one at a time to understand:
- What problem this solves
- Who will use it
- What features are essential vs nice-to-have
- Any constraints I should know about

After we discuss, create a simple spec document.
```

Let the AI ask questions. Answer thoroughly. When done, save the spec as `docs/spec.md` in your project.

**Then get a task list:**
```
Based on this spec, create a step-by-step build plan.
Break it into small tasks that build on each other.
Each task should be testable before moving to the next.
Use a checklist format.
```

Save this as `docs/tasks.md`.

### Phase 2: Building (60% of your time)

**One feature at a time:**
1. Pick the first task from your list
2. Ask the AI to implement it
3. Test that it works
4. Commit the working code
5. Move to next task

**Do not:**
- Ask for multiple features at once
- Skip testing between features
- Make many changes without committing

**When something breaks:**
1. Stop adding features
2. Describe the problem specifically
3. Fix it before continuing
4. Commit the fix

### Phase 3: Testing (15% of your time)

After each feature and before sharing:

**Basic testing:**
- Click through everything
- Try on mobile (resize browser or use a real phone)
- Check browser console for errors (F12 → Console)
- Try to break it (weird inputs, fast clicking, back button)

**Edge cases:**
- What happens with no data?
- What happens with lots of data?
- What happens with very long text?
- What if the network is slow?

### Phase 4: Audit (5% of your time)

Before sharing your app, use the [project audit skill](./skills/project-audit.md):

```
[Base prompt]

[Project audit prompt]

Audit this project before I share it with users.
Check for security issues, accessibility problems,
and common mistakes.
```

Fix critical issues before deploying.

---

## Common Problems

### "The AI keeps breaking things"

**Symptom:** Fixing one bug creates new bugs. Endless loops.

**Solutions:**
1. **Roll back.** Return to the last working version.
2. **Start fresh.** New conversation, clearer prompt.
3. **Smaller steps.** Break the feature into smaller pieces.
4. **Different approach.** Ask for an alternative solution.

**Prevention:** Commit working code frequently. Test after every change.

---

### "I don't understand what it built"

**Symptom:** The code works but you have no idea why.

**Solutions:**
1. Ask: "Explain this code to me like I'm not a developer. What does each part do?"
2. Ask: "What happens when a user does X? Walk me through the code path."
3. Ask: "What could go wrong with this code?"

**The goal:** You should be able to explain the general structure to someone else, even if you don't understand every line.

---

### "Something broke and I can't find why"

**Symptom:** Error messages you don't understand. Things stopped working.

**How to get help:**

1. **Copy the full error.** Include everything in the red text.
2. **Note what changed.** What did you do right before it broke?
3. **Describe the symptom.** "When I click X, nothing happens" is better than "it's broken."

**Ask the AI:**
```
I'm getting this error:
[paste full error]

This started after I [what you changed].
I expected [what should happen] but instead [what actually happens].

What's wrong and how do I fix it?
```

---

### "I need to do something on Vercel/Supabase/GitHub"

**Symptom:** The code works locally but you need to configure something on a platform.

**Solution:** Ask the AI for step-by-step platform instructions.

```
I need to [what you need to do] on Vercel.
Give me click-by-click instructions.
Assume I've never done this before.
Include where to find each setting.
```

The base prompt tells the AI to give platform instructions in this format.

---

### "The app is slow"

**Symptom:** Pages take a long time to load. Interactions feel sluggish.

**Common causes:**
- Loading too much data at once (need pagination)
- Unoptimized images (need compression)
- Too many database queries (need optimization)
- Heavy JavaScript bundles (need code splitting)

**Ask the AI:**
```
The [page name] feels slow to load.
Help me identify what's causing the slowness
and how to fix it.
```

---

### "I'm stuck and nothing is working"

**Symptom:** Tried everything. Going in circles.

**Solutions:**
1. **Take a break.** Seriously. 15 minutes away helps.
2. **Start over.** New conversation, explain the problem fresh.
3. **Try a different AI.** Claude, ChatGPT, and Gemini have different strengths.
4. **Simplify.** Remove features until something works, then add back gradually.
5. **Ask for alternatives.** "Give me 3 different ways to solve this problem."

---

## Learning to Evaluate AI Output

The AI will make mistakes. Learning to spot them is a core skill.

### Red Flags

**Hallucinated features:**
- AI invents APIs or functions that don't exist
- References libraries or methods that sound real but aren't
- **Check:** Search for the function/library name. If you can't find documentation, it might not exist.

**Outdated patterns:**
- AI training data has a cutoff date
- May use old versions of libraries
- **Check:** "Is this the current recommended way to do X in [library name]?"

**Over-engineering:**
- AI loves adding "just in case" code
- Creates abstractions for one-time uses
- **Check:** "Do we actually need this? What's the simplest version?"

**Subtle bugs:**
- Code looks correct but has edge case issues
- Logic errors that aren't obvious
- **Check:** Test edge cases. What happens with empty data? With too much data?

### Questions to Ask

After the AI generates code, ask:

1. "What could go wrong with this code?"
2. "Are there any security concerns?"
3. "What happens if [edge case]?"
4. "Is there a simpler way to do this?"
5. "What dependencies does this add and why?"

### Building Judgment

Over time, you'll develop intuition for:
- When to trust the AI vs. when to question it
- What "good code" looks like (consistent, readable, not overly complex)
- When something will cause problems later
- What questions to ask

This comes from experience. Keep building, keep questioning, keep learning.

---

## Quick Reference

### Starting a Project
1. Plan with AI (spec + task list)
2. Set up version control (Git + GitHub)
3. Configure system prompts
4. Build one feature at a time
5. Test after each feature
6. Deploy early (even if incomplete)

### Daily Workflow
1. Pull latest changes (if using Git)
2. Review task list
3. Pick one task
4. Build it
5. Test it
6. Commit it
7. Push to GitHub

### Before Sharing
1. Run project audit
2. Fix critical issues
3. Test on mobile
4. Check deployed version (not just local)

### When Stuck
1. Roll back to working version
2. Start new conversation
3. Be more specific
4. Try different AI
5. Take a break

---

**Next steps:**
- [Skills Reference](./skills-table.md) - All available system prompts
- [Web Development Rules](./web-rules.md) - Non-negotiable rules for production apps
- [README](./README.md) - Quick start guide
