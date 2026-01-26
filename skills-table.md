# Skills Reference

System prompts that shape how AI coding assistants work with you. Stack them: base first, then specialized skills, then project context.

## How to Use

1. Copy the prompt from the skill file
2. Paste into your AI tool's custom instructions/system prompt
3. Add your project context at the end

## Skills Overview

| Skill | File | When to Use |
|-------|------|-------------|
| **Base** | [vibe-coder-base.md](./skills/vibe-coder-base.md) | Always — foundation for all interactions |
| **UI Builder** | [ui-builder.md](./skills/ui-builder.md) | Design, layout, and interaction polish |
| **Project Audit** | [project-audit.md](./skills/project-audit.md) | Pre-launch security and quality checks |
| **Web Fundamentals** | [web-fundamentals.md](./skills/web-fundamentals.md) | Learn while you build |

---

## Skill Details (Short)

### Base Prompt
- Clear, layered explanations
- Best practices by default
- Warns about security and accessibility
- Explains external tool steps (Vercel, Supabase, etc.)

### UI Builder
- Typography, color, spacing, layout
- Interaction and motion guidance
- Accessibility basics baked in

### Project Audit
- Security (secrets, auth, input validation)
- Accessibility (labels, contrast, keyboard)
- Code quality (unused code, errors)
- Clear report and action items

### Web Fundamentals
- Core web concepts as they appear
- State, data flow, requests
- Common patterns (forms, auth, fetching)

---

## Stacking Skills

Order matters:
```
[1. Base prompt]
[2. Specialized skill(s)]
[3. Your project context + current task]
```

**Example:**
```
[Base prompt]

[UI Builder prompt]

PROJECT:
- App: Task manager
- Tech: Next.js 14, Tailwind, Supabase
- Goal: Minimal, fast UI

TASK:
Build the main dashboard with a list of tasks and a quick-add form.
```

---

## Tool Notes

- **v0:** No persistent system prompts; paste skills per chat
- **Lovable:** Paste skills in the initial project prompt
- **Codex/ChatGPT:** Settings → Custom Instructions
- **Cursor/Windsurf:** Put prompts in tool-specific rules files
- **Claude:** Use Projects and Project Instructions

---

## Create Your Own Skill

Template:
```markdown
# [Skill Name]

You are helping with [specific task]. The person you're helping [context].

## How to Communicate
[Guidelines for explanation style]

## What to Do
[Specific instructions]

## What to Avoid
[Anti-patterns]

## Output Format
[How to structure results]
```
