# Skills Reference

System prompts that shape how AI coding assistants work with you. These are designed to be stacked—start with the base, add specialized skills as needed.

## How to Use

1. **Copy the prompt** from the skill file
2. **Paste into your AI tool's** custom instructions or system prompt field
3. **Stack skills** by putting base first, then adding specialized skills below
4. **Add your project context** at the end

## Skills Overview

| Skill | File | When to Use |
|-------|------|-------------|
| **Base** | [vibe-coder-base.md](./skills/vibe-coder-base.md) | Always—foundation for all interactions |
| **UI Builder** | [ui-builder.md](./skills/ui-builder.md) | Building interfaces, improving design |
| **Project Audit** | [project-audit.md](./skills/project-audit.md) | Before launch, after big changes |
| **Web Fundamentals** | [web-fundamentals.md](./skills/web-fundamentals.md) | Learning web dev patterns |

---

## Detailed Descriptions

### Base Prompt
**File:** [skills/vibe-coder-base.md](./skills/vibe-coder-base.md)

The foundation for all interactions. Sets up the AI to:
- Communicate in layers (summary → details → action items)
- Avoid jargon or explain it when necessary
- Follow best practices without being asked
- Warn about security, performance, and accessibility issues
- Explain what needs to happen in external tools (Vercel, Supabase, etc.)

**Always include this.** Other skills build on top of it.

**Example combined prompt:**
```
[Base prompt]

My project is a recipe app using Next.js and Supabase.
I'm deploying on Vercel.
Help me add a feature for users to save favorites.
```

---

### UI Builder
**File:** [skills/ui-builder.md](./skills/ui-builder.md)

Design-focused guidance for building interfaces. Covers:
- Typography and font selection
- Color and theming
- Spacing and layout
- Animation and interaction
- Accessibility requirements
- Common mistakes to avoid

**Use when:**
- Building new pages or components
- Making something "look more professional"
- Adding animations and micro-interactions
- Fixing design issues

**Example combined prompt:**
```
[Base prompt]

[UI Builder prompt]

Build a pricing page for a SaaS product.
Should feel modern and trustworthy.
Three tiers: Free, Pro, Enterprise.
```

---

### Project Audit
**File:** [skills/project-audit.md](./skills/project-audit.md)

Security and quality review. Checks for:
- **Security:** Exposed secrets, XSS vulnerabilities, unvalidated inputs, database security
- **Next.js specific:** Server/client boundary issues, exposed server data
- **Accessibility:** Missing alt text, keyboard navigation, color contrast
- **Code quality:** Console logs, unused code, missing error handling

Fixes issues automatically when safe, generates a report explaining what was found and what you need to do.

**Use when:**
- Before launching publicly
- After adding authentication or payments
- Monthly check-ups
- Before sharing code with others

**Example combined prompt:**
```
[Base prompt]

[Project Audit prompt]

Audit my project before I share it with beta testers.
I just added user authentication with Supabase.
```

---

### Web Fundamentals
**File:** [skills/web-fundamentals.md](./skills/web-fundamentals.md)

Essential web development patterns explained for non-developers. Covers:
- How the web works (servers, browsers, requests)
- Frontend vs backend
- State and data flow
- Common patterns (authentication, forms, data fetching)
- Environment variables and secrets
- Deployment basics

**Use when:**
- You want to understand what's happening, not just get it working
- Learning web development concepts
- Confused about how pieces fit together

**Example combined prompt:**
```
[Base prompt]

[Web Fundamentals prompt]

Explain how authentication works in my app.
I'm using Supabase Auth with Next.js.
Walk me through what happens when a user logs in.
```

---

## Stacking Skills

You can combine multiple skills. Order matters—put base first:

```
[1. Base prompt - always first]

[2. Specialized skill(s)]

[3. Your project context]
- What tech you're using
- What you're trying to build
- Any constraints or preferences

[4. Current task]
```

**Example with multiple skills:**
```
[Base prompt]

[UI Builder prompt]

---

PROJECT:
- App: Task management tool
- Tech: Next.js 14, Tailwind CSS, Supabase
- Deployed on: Vercel
- Feel: Clean and minimal, not cluttered

CURRENT TASK:
Build the main dashboard showing today's tasks.
Should have a simple way to check off completed items.
```

---

## Tool-Specific Notes

### v0
No persistent system prompts. Paste skills at the start of each conversation.

### Loveable
Include skills in your initial project description, or paste at conversation start.

### Codex / ChatGPT
Go to Settings → Personalization → Custom Instructions. Paste base prompt here.

### Cursor / Windsurf
Create a file at `.cursor/rules/base.md` (or similar) with your prompts.

### Claude (claude.ai)
Use Projects to save system prompts. Add skills to Project Instructions.

---

## Creating Your Own Skills

Skills are just structured prompts. A good skill includes:

1. **Role definition:** What perspective should the AI take?
2. **Communication style:** How should it explain things?
3. **Specific guidelines:** What should it do/not do?
4. **Output format:** How should results be structured?

**Template:**
```markdown
# [Skill Name]

You are helping with [specific task type]. The person you're helping [context about their experience level].

## How to Communicate
[Guidelines for explanation style, detail level]

## What to Do
[Specific instructions, patterns to follow]

## What to Avoid
[Anti-patterns, common mistakes]

## Output Format
[How to structure responses, reports, etc.]
```
