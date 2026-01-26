# Vibe Coding 101

A beginner's guide to building web apps with AI—no programming experience required.

## What is Vibe Coding?

Vibe coding is building software by describing what you want in plain language, and letting AI write the code for you. The term was [coined by Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383) in 2025:

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

**You don't need to become a programmer.** You need to learn:
- How to describe what you want clearly
- When to trust the AI and when to question it
- How to test that things actually work
- Where the dangerous pitfalls are

## The 70% Problem

Here's the hard truth: AI tools can get you 70% of the way to a working product surprisingly fast. But that last 30%—the edge cases, error handling, security, accessibility—is where things get frustrating.

This is called the **70% problem**. You'll hit a wall where:
- Fixing one bug creates two new ones
- The AI confidently produces code that doesn't work
- You don't understand enough to know what's wrong

These guides exist to push that number higher and help you recognize when you're stuck.

## Who This Is For

You're a good fit if you:
- Are comfortable using web tools (Notion, Figma, etc.)
- Have built something with v0, Loveable, Bolt, or Replit
- Understand GitHub holds your code (even if git commands are confusing)
- Know databases store data (even if SQL looks alien)
- Want to build real products, not just demos

You don't need to:
- Know how to code from scratch
- Understand every line of code
- Have a technical background

## How AI Coding Actually Works

Think of AI as an **overconfident intern** who:
- Works incredibly fast
- Has read a lot of documentation
- Will confidently do the wrong thing if you're not specific
- Needs clear instructions and frequent check-ins
- Can't be left unsupervised on important work

The AI isn't magic. It predicts what code probably comes next based on patterns it learned. It doesn't understand your business, your users, or whether the code actually works.

## The Two Modes

**AI as Copilot:** You're in charge. You use AI to speed up specific tasks—generating a component, explaining an error, writing boilerplate. You review everything.

**AI as Pilot (Vibe Coding):** You describe, AI builds. You accept code without fully understanding it. Great for prototypes and experiments, risky for production.

**The rule:** The more important the project, the more you should be copiloting. The more throwaway it is, the more you can let the AI pilot.

## What's In This Guide

### [Skills](./skills/) — System Prompts for AI Tools
Copy these into your AI tool's custom instructions to shape how it helps you.

| Skill | Purpose |
|-------|---------|
| [Base](./skills/vibe-coder-base.md) | Foundation for all interactions—clear communication, progressive detail |
| [UI Builder](./skills/ui-builder.md) | Design-focused help for building polished interfaces |
| [Project Audit](./skills/project-audit.md) | Security and quality review before shipping |
| [Web Fundamentals](./skills/web-fundamentals.md) | Learn web dev concepts while building |

→ [Full skills reference](./skills-table.md)

### [Workflows](./workflows.md) — Web Tools vs Agentic Coding
Understanding the two distinct modes of AI coding:
- **Web tools** (v0, Lovable): Live preview, one-click deploy, great for starting
- **Agentic tools** (Codex, Cursor): Work with existing code, full control
- **Moving between tools**: Using GitHub to keep your code portable
- **When to switch**: Signs it's time to export from web tools

### [The Guide](./guide.md) — Complete Walkthrough
Step-by-step instructions covering:
- Detailed tool breakdown (what each tool does and doesn't do)
- Setting up system prompts in each tool
- The build workflow (plan → build → test → audit)
- Common problems and solutions
- Learning to evaluate AI output

### [Web Rules](./web-rules.md) — Non-Negotiable Standards
Rules for production apps:
- Security (don't get hacked)
- Accessibility (don't exclude users)
- Performance (don't be slow)
- Deployment (don't break production)

## Quick Start

### 1. Pick Your Tool

**Never coded before:**
- [Loveable](https://lovable.dev) - Full apps from descriptions
- [v0](https://v0.dev) - UI components with Next.js
- [Bolt](https://bolt.new) - Quick prototypes
- [Replit](https://replit.com) - Learning-friendly environment

**Ready for more control:**
- [Cursor](https://cursor.com) - AI-powered code editor
- [Windsurf](https://windsurf.com) - Alternative to Cursor
- [Codex](https://chatgpt.com/codex) - OpenAI's agent (works on your codebase)

### 2. Set Up Your System Prompt

Copy the [base prompt](./skills/vibe-coder-base.md) into your tool's custom instructions. This teaches the AI how to communicate with you effectively.

### 3. Plan Before You Build

Don't just type "build me an app." Start with a conversation:

```
I want to build [your idea].

Ask me questions one at a time to understand:
- What problem this solves
- Who will use it
- What features are essential vs nice-to-have
- Any technical constraints I should know about

After we discuss, create a simple spec document.
```

### 4. Build in Small Steps

Never ask for everything at once. Instead:

1. Get the core feature working first
2. Test it actually works
3. Add the next feature
4. Test again
5. Repeat

### 5. Test Like a User

After every change:
- Click through everything
- Try to break it (weird inputs, fast clicking, back button)
- Check on mobile
- Look for error messages in the browser console (F12 → Console tab)

### 6. Audit Before Sharing

Before anyone else uses your app, run the [project audit](./skills/project-audit.md) to catch security issues and common mistakes.

## The Golden Rules

1. **Plan before prompting.** Spend 20% of your time on specs, save 80% on debugging.

2. **Build throwaway projects first.** Your first attempt teaches you the tool's limitations. Plan to delete it.

3. **Small steps, frequent tests.** One feature → test → commit. Repeat.

4. **Commit working versions.** Git is your save game. Commit before trying anything risky.

5. **Screenshots > descriptions.** Show the AI what you want, don't just describe it.

6. **Simple > clever.** The fancier the solution, the more ways it can break.

7. **Ask "why?" not just "fix it."** Understanding problems prevents them from recurring.

8. **Never ship secrets.** API keys, passwords, and database credentials never go in code files.

## When You're Stuck

1. **Start a new conversation.** AI context gets polluted over long chats.
2. **Be more specific.** "It doesn't work" tells the AI nothing.
3. **Roll back and try again.** Sometimes the cleanest fix is undoing the last few changes.
4. **Ask a different AI.** Claude, ChatGPT, and Gemini have different strengths.
5. **Take a break.** Seriously. Fresh eyes find problems faster.

## Learning More

You don't need to learn programming, but understanding a few concepts helps:

- **How to read error messages** (the file and line number, what it's complaining about)
- **How to use browser DevTools** (F12 → Console shows errors, Network shows loading)
- **How Git works** (commits save versions, push sends to GitHub, pull gets latest)
- **How environment variables work** (secrets go in .env files, not code)

The [guide](./guide.md) covers these in detail.

## Resources

### Essential Reading
- [The 70% Problem](https://addyo.substack.com/p/the-70-problem-hard-truths-about) - Why AI coding is harder than it looks
- [Not All AI Programming is Vibe Coding](https://simonwillison.net/2025/Mar/19/vibe-coding/) - When to vibe and when to verify
- [Using LLMs for Code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) - Practical tips from an expert
- [My LLM Codegen Workflow](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) - A structured approach
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Official guidance (applies to all AI tools)

### Comprehensive Guides
- [AI Code Guide](https://github.com/automata/ai-code-guide) - Deep dive for all skill levels
- [12 Rules to Vibe Code](https://creatoreconomy.so/p/12-rules-to-vibe-code-without-frustration) - Practical rules

### Courses
- [Vibe Coding 101 with Replit](https://www.deeplearning.ai/short-courses/vibe-coding-101-with-replit/) - Free intro course
- [Intro to Vibe Coding](https://www.codecademy.com/learn/intro-to-vibe-coding) - Codecademy's course

## Contributing

Found a problem? Have a suggestion? [Open an issue](https://github.com/chrcit/vibecoding-guide/issues).

## License

MIT - Use however you want.
