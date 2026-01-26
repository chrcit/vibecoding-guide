# Vibe Coding Guide

System prompts and guides for non-developers building web apps with AI tools.

## What is Vibe Coding?

Vibe coding is building software by describing what you want to AI assistants, rather than writing code yourself line by line. You focus on the *what* and *why*, and the AI handles the *how*.

The term was coined by Andrej Karpathy (co-founder of OpenAI) to describe a new way of programming where you "fully give in to the vibes, embrace exponentials, and forget that the code even exists."

**You don't need to become a programmer.** You need to become good at:
- Describing what you want clearly
- Understanding enough to spot when something's wrong
- Knowing what questions to ask
- Reviewing and testing what the AI produces

## Who This Is For

You're a good fit for these guides if you:
- Work on the web and are comfortable with digital tools
- Have used AI coding tools like v0, Loveable, or ChatGPT for code
- Maybe have a project or two deployed on Vercel
- Understand that GitHub stores your code, but aren't a git expert
- Know what a database is, even if SQL looks like gibberish
- Want to build real things, not just toy demos

You don't need to:
- Have a computer science degree
- Know how to code from scratch
- Understand every line of code in your project
- Be an expert in any specific technology

## The Skills

These system prompts tell AI assistants how to help you effectively. Use them individually or combine them.

### [Vibe Coder Base](./skills/vibe-coder-base.md)
Your foundation prompt. Sets up the AI to communicate clearly, follow best practices, and explain things progressively—giving you the quick version first, with details available if you want them.

**Use this for:** Everything. This is your default.

### [UI Builder](./skills/ui-builder.md)
Adds design sensibility to your coding assistant. Helps create interfaces that feel polished and professional, not like generic AI output.

**Use this for:** Building new pages, improving how things look, adding animations, making your app "feel right."

### [Project Audit](./skills/project-audit.md)
Turns the AI into a security and quality reviewer. Scans your code for common vulnerabilities, accessibility problems, and mistakes—then fixes what it can and tells you what to do about the rest.

**Use this for:** Before launching, after big changes, monthly check-ups, when adding sensitive features like login or payments.

## Quick Start

1. Copy the [base prompt](./skills/vibe-coder-base.md)
2. Paste it into your AI tool's system prompt / custom instructions
3. Add any task-specific skill prompts below it
4. Add context about your project
5. Start building

See the [full guide](./guide.md) for detailed setup instructions for v0, Loveable, Codex, and other tools.

## Combining Skills

You can stack these prompts. Order matters—put the base first, then add specialized skills:

```
[Vibe Coder Base prompt]

[UI Builder prompt]

---

My project: A recipe sharing app built with Next.js and Supabase.
Currently working on: The recipe detail page.
I want it to feel: Warm, inviting, like a well-designed cookbook.
```

## Philosophy

These prompts are built on a few principles:

**Progressive disclosure.** You get the summary first, details if you want them. You shouldn't need to read a wall of text to understand what happened.

**Best practices by default.** The AI should automatically follow good patterns without you needing to know what they are. Security, accessibility, and code quality should be built in.

**Honest about complexity.** Some things are genuinely complicated. The prompts tell the AI to acknowledge this rather than pretending everything is simple.

**You're in control.** These prompts help the AI help you better, but you still make the decisions. The AI explains, recommends, and implements—you approve.

## Contributing

Found an issue? Have a suggestion? Open an issue or PR on GitHub.

## License

MIT License - Use these however you want.
