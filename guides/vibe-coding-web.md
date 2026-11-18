# Vibe Coding with Web Builders

Using v0, Lovable, Bolt, and Replit to build apps by describing what you want.

## What Are Web Builders?

Web-based tools where you:
1. Describe what you want in natural language
2. See a live preview immediately
3. Iterate with more prompts
4. Deploy directly or export code

No local setup. No terminal. Just chat and build.

## The Tools

### v0 (v0.dev)

**Made by:** Vercel (creators of Next.js)

**What it builds:** Full-stack Next.js apps and UI components (React, Tailwind, shadcn/ui by default)

**Best for:**
- Full-stack prototypes (data + UI)
- UI components and pages
- Landing pages and dashboards
- New Next.js projects

**Limitations:**
- Best results with Next.js; other frameworks are less reliable
- Complex backends or non-Next stacks may require exporting

**Pricing:**
- Free tier available
- Paid plans for more generations

### Lovable (lovable.dev)

**What it builds:** Full-stack applications with frontend, backend, and database

**Best for:**
- Complete apps (not just UI)
- MVPs and prototypes
- Apps needing authentication
- Non-technical founders

**Key features:**
- **Lovable Cloud:** Built-in database, auth, and storage
- **Supabase integration:** Connect a managed PostgreSQL backend
- **Agent Mode:** AI works autonomously to debug and fix issues
- **GitHub sync:** Export and two-way sync with your repo
- **Visual editing:** Drag-and-drop alongside chat

**Limitations:**
- Can get stuck in debugging loops
- Complex customization may require exporting

**Pricing:**
- Free tier (limited messages)
- Paid plans for more usage

### Bolt (bolt.new)

**Made by:** StackBlitz

**What it builds:** Full-stack web apps in the browser

**Best for:**
- Quick prototypes
- Learning and experimentation
- Simple full-stack apps

**Key features:**
- Runs entirely in browser (WebContainers)
- Built-in hosting with a `.bolt.host` domain
- Optional Netlify publishing

**Limitations:**
- Smaller context window than competitors
- Less polished than Lovable

### Replit (replit.com)

**What it builds:** Any kind of application (web, backend, bots, etc.)

**Best for:**
- Learning to code
- Quick experiments
- Multi-language projects
- Collaboration

**Key features:**
- Built-in IDE
- Deployments (static or server-backed)
- Built-in databases (key-value and SQL)
- AI assistant (Replit Agent)

**Limitations:**
- Less AI-focused than others
- Can feel more technical

## The Workflow

### 1. Start with Clear Intent

**Bad prompt:**
```
Make me a website
```

**Good prompt:**
```
Build a recipe sharing app where users can:
- Browse recipes by category
- Save favorites (requires login)
- Submit their own recipes

Use a clean, modern design with warm colors.
Target audience: home cooks, 25-45 years old.
```

### 2. Preview and Evaluate

The tool generates code and shows a preview.

**Ask yourself:**
- Does this match what I described?
- What's obviously wrong?
- What's missing?
- What feels off?

### 3. Iterate with Specific Feedback

**Bad feedback:**
```
Make it better
```

**Good feedback:**
```
Changes needed:
1. Make the header sticky (stays at top when scrolling)
2. Add more space between recipe cards
3. The search box should be more prominent
4. Change the primary button color to orange (#f97316)
```

### 4. Handle the Unexpected

AI will make changes you didn't ask for. Plan for it:

- **Review every generation** before accepting
- **Rollback** if something good got broken
- **Be specific** about what NOT to change

### 5. Know When You're Done

You're done with the web builder when:
- Core features work
- Design is close to your vision
- You've exported to GitHub

You're NOT done when:
- You're in an endless fixing loop
- Each fix breaks something else
- You need capabilities the tool doesn't have

Time to export.

## Tool-Specific Tips

### v0

**Prompting tips:**
- Describe the component, who uses it, and design constraints
- Attach screenshots or images of designs you like
- v0 can use images as visual references

**Using projects:**
1. Create a project for related work
2. Add custom instructions in project settings
3. All chats in the project follow those instructions

**Exporting & publishing:**
- Publish to Vercel from v0 for a live URL
- Connect GitHub to sync code and pull it locally

### Lovable

**First prompt matters:**
Be comprehensive in your initial description. Lovable works best when it understands the full picture.

**Using Agent Mode:**
- Agent Mode lets AI work autonomously
- Good for: "Fix all the TypeScript errors"
- Risky for: Unspecified changes

**Database setup:**
Lovable supports both Lovable Cloud and Supabase:
1. Use Lovable Cloud for built-in database/auth/storage
2. Or connect a Supabase project via the integration

**Exporting to GitHub:**
1. Go to project settings
2. Connect GitHub
3. Choose/create a repository
4. Code syncs automatically

### Bolt

**Best practices:**
- Keep prompts focused on one feature
- Test in the preview before continuing
- Use "Enhance" for improvements to existing code

**Deploying:**
- Use built-in hosting for a quick live URL
- Or publish to Netlify from the Deploy menu

## Common Patterns

### Starting a New App

**Step 1: Planning prompt**
```
I want to build [app idea].

Ask me questions one at a time to understand:
- The core problem it solves
- Who the users are
- Must-have features vs nice-to-have
- Any design preferences

Then create a simple spec we can use to build it.
```

**Step 2: Build core first**
```
Based on our spec, build the [core feature] first.
Don't worry about [secondary features] yet.
```

**Step 3: Iterate**
Add features one at a time, testing between each.

### Recreating a Design

```
Recreate this design: [attach screenshot]

Match:
- Layout and spacing
- Colors and typography
- All visible elements

Don't add features not shown in the image.
```

### Debugging

```
The [feature] isn't working.
When I [action], I expect [expected result] but instead [actual result].

The browser console shows: [paste error if any]

What's wrong and how do we fix it?
```

## Limitations and Workarounds

### "It keeps breaking things"

**Workaround:**
1. Use rollback/history to go back to working state
2. Start a new chat with clearer instructions
3. Be explicit: "Don't change [X], only modify [Y]"

### "It can't do [advanced feature]"

**Workaround:**
1. Export to GitHub
2. Open in Cursor or connect with Codex
3. Implement with agentic tools

### "I'm stuck in a loop"

**Signs:**
- Fixing one thing breaks another
- Going back and forth on the same issue
- Been on the same problem for 30+ minutes

**Solutions:**
1. Rollback to last working state
2. Simplify—remove the problematic feature
3. Try a completely different approach
4. Export and fix with better tools

### "The design looks generic"

**Workaround:**
- Provide specific design references (screenshots)
- Name exact colors, fonts, spacing values
- Reference specific websites: "Style it like [site]"

## When to Export

Export from web builders when:

| Signal | Action |
|--------|--------|
| Need custom backend logic | Export → Cursor |
| Need specific hosting setup | Export → Your platform |
| Hit feature limitations | Export → Agentic tools |
| Want more control | Export → Any tool |
| Endless debugging loops | Export → Fix properly |
| Project getting complex | Export → Better tooling |

### How to Export

**Lovable → GitHub → Cursor:**
1. In Lovable: Settings → GitHub → Connect/Sync
2. Clone repo: `git clone [url]`
3. Open in Cursor: `cursor your-project`

**v0 → GitHub/Vercel:**
1. Connect GitHub from Project Settings or the GitHub icon in chat
2. Publish to Vercel from v0 (creates/updates a Vercel project)
3. Pull the repo locally if you need deeper control

**Bolt → GitHub:**
1. Use Bolt's export feature
2. Connect to GitHub
3. Clone and continue locally

## Cost Management

### Free Tier Strategies

- **Plan your prompts** before using credits
- **Batch feedback** instead of many small changes
- **Export early** if you're burning through credits

### When Free Isn't Enough

If you're regularly hitting limits:
- Consider paid tier (often worth it)
- Export to free agentic tools (Cursor free tier)
- Use ChatGPT/Claude for planning, web tools for building

## Best Practices Summary

1. **Start with planning**, not building
2. **One feature at a time**, test between each
3. **Be specific** in your prompts
4. **Use screenshots** for design references
5. **Rollback early** if things break
6. **Export when stuck**, don't fight the tool
7. **Commit to GitHub** regularly (if supported)

---

**Next:** [Agentic Coding Basics](./agentic-coding.md) · [Ways of Working](./ways-of-working.md)
**Publishing & GitHub:**
- Publish to Vercel directly from v0
- Connect GitHub to sync code and use Vercel deploys
