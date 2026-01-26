# Workflows: Web Tools vs Agentic Coding

There are two distinct ways to vibe code. Understanding when to use each—and how to move between them—is key.

## The Two Modes

### Mode 1: Web-Based Tools (Vibe Coding)

**Tools:** v0, Lovable, Bolt, Replit

**How it works:**
- You describe what you want in a chat interface
- AI generates code with live preview
- You iterate by chatting more
- Deploy directly to the tool's hosting

**Characteristics:**
- Zero setup required
- See results instantly
- Limited customization
- Code lives on their platform

**Best for:**
- Starting from nothing
- Rapid prototyping
- Non-developers
- Simple to medium complexity apps

---

### Mode 2: Agentic Coding

**Tools:** Codex, Claude Code, Cursor, Windsurf, aider

**How it works:**
- You connect to an existing codebase (local or GitHub)
- AI reads and understands your project
- You give tasks, AI makes changes across files
- You review and commit changes yourself

**Characteristics:**
- Works with any codebase
- Full control over code
- More complex setup
- You manage hosting/deployment

**Best for:**
- Existing projects
- Complex features
- Custom requirements
- Professional development

---

## Workflow 1: Web-Based Tools

### The Cycle

```
Describe → Preview → Iterate → Deploy
    ↑__________________________|
```

### Step by Step

**1. Start with a Description**
```
Build a landing page for a recipe sharing app.
Include:
- Hero section with headline and CTA
- Features grid (3 columns)
- Testimonials carousel
- Pricing table
- Footer with links

Style: Clean, modern, use warm colors.
```

**2. Review the Preview**
The tool generates code and shows you a live preview. Look at it critically:
- Does it match your vision?
- Is anything missing?
- What feels off?

**3. Iterate with Feedback**
```
Good start! Changes needed:
- Make the hero headline bigger
- Add more whitespace between sections
- Change the CTA button to orange
- The testimonials look cramped, give them more room
```

**4. Repeat Until Done**
Keep iterating until you're happy. Each round should be smaller refinements.

**5. Deploy**
Most web tools have one-click deploy:
- **v0:** Exports to Vercel or gives you code to copy
- **Lovable:** Has built-in hosting, one click to deploy
- **Bolt:** Deploys to Netlify or similar

### Limitations of Web Tools

- **Code is locked in:** Hard to customize beyond what the tool supports
- **Limited backend:** Some tools (v0) are frontend-only
- **Debugging is hard:** When something breaks, you can't easily inspect the code
- **Scaling is limited:** Complex apps outgrow these tools

**When you hit these limits, it's time to export.**

---

## Workflow 2: Agentic Coding

### The Cycle

```
Task → AI Changes → Review → Test → Commit
  ↑__________________________________|
```

### Step by Step

**1. Set Up Your Environment**

First, you need:
- Code on your computer or in GitHub
- An agentic tool connected to it

**For Codex (web):**
1. Go to [chatgpt.com/codex](https://chatgpt.com/codex)
2. Connect your GitHub account
3. Select your repository

**For Cursor (local):**
1. Install Cursor
2. Open your project folder
3. Configure your API keys in settings

**For Claude Code (CLI):**
1. Install: `npm install -g @anthropic-ai/claude-code`
2. Set up your API key
3. Run `claude` in your project folder

**2. Give a Focused Task**
```
Add a "save to favorites" feature to the recipe detail page.
When a logged-in user clicks the heart icon:
- Save the recipe ID to their favorites in Supabase
- Update the UI to show it's saved
- Show an error if they're not logged in
```

**3. Review the Changes**
The AI will make changes across multiple files. Review each one:
- Does this make sense?
- Is anything unexpected?
- Are there security concerns?

**4. Test Locally**
Run your app and test the feature:
- Does it work?
- What about edge cases?
- Check the browser console for errors

**5. Commit If It Works**
```bash
git add .
git commit -m "Add save to favorites feature"
git push
```

**6. If It Doesn't Work**
Don't commit broken code. Either:
- Ask the AI to fix it
- Roll back: `git checkout .`
- Try a different approach

### Why Commits Matter

Every commit is a save point. If something breaks later, you can:
- See what changed: `git diff`
- Go back: `git checkout [commit]`
- Undo recent changes: `git reset --hard HEAD~1`

**Rule: Only commit working code.**

---

## Moving Between Tools

The superpower of version control is **tool independence**. Your code isn't locked to any tool.

### Export from Web Tool → Agentic Coding

**Why do this:**
- Web tool is too limited
- Need custom backend work
- Want more control
- Project has grown complex

**How to do it:**

**From Lovable:**
1. Connect GitHub in Lovable settings
2. Lovable automatically syncs your code
3. Clone the repo: `git clone [url]`
4. Open in Cursor or connect with Codex

**From v0:**
1. Click "Export" or copy the code
2. Create a new GitHub repo
3. Paste/save the code
4. Push to GitHub
5. Continue with Codex or Cursor

**From Bolt:**
1. Use their GitHub export feature
2. Clone the repo locally
3. Continue development

**After exporting:**
```bash
# Clone your repo
git clone https://github.com/you/your-project

# Open in Cursor
cursor your-project/

# Or connect to Codex via GitHub
```

### Agentic Tool → Different Agentic Tool

Since everything is in Git, switching is easy:

**Codex → Cursor:**
1. Clone your repo locally (if not already)
2. Open the folder in Cursor

**Cursor → Claude Code:**
1. Navigate to your project folder
2. Run `claude`

**Any tool → Codex:**
1. Push your latest changes to GitHub
2. Connect Codex to that repo

### Back to Web Tool?

Generally **not recommended** once you've exported. Web tools work best for fresh starts, not importing complex existing code.

If you need to:
- Use the web tool for design mockups
- Copy generated code manually into your repo
- Don't try to sync bidirectionally

---

## GitHub as Your Hub

Think of GitHub as the central hub that connects everything.

```
        ┌─────────────┐
        │   GitHub    │
        │  (your hub) │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌───────┐  ┌───────┐  ┌───────┐
│Lovable│  │ Codex │  │Cursor │
│(start)│  │ (web) │  │(local)│
└───────┘  └───────┘  └───────┘
```

### Setting Up GitHub

**If starting fresh:**
1. Create a repo on [github.com](https://github.com)
2. Clone it locally or connect your web tool

**If starting from a web tool:**
1. Enable GitHub sync in the tool
2. Create a repo when prompted
3. Your code is now backed up and portable

### Basic Git Commands

You don't need to be an expert. These five commands handle 90% of cases:

```bash
# See what changed
git status

# Save all changes locally
git add .
git commit -m "Describe what you changed"

# Send to GitHub
git push

# Get latest from GitHub
git pull

# Undo uncommitted changes
git checkout .
```

### When Things Go Wrong

**"I broke something and want to go back"**
```bash
# Undo uncommitted changes
git checkout .

# Or go back to last commit
git reset --hard HEAD
```

**"I need to see what I changed"**
```bash
git diff
```

**"I want to save my current state before trying something risky"**
```bash
git add .
git commit -m "Working state before [experiment]"
```

---

## Recommended Paths

### Path A: Pure Vibe Coding (Simplest)

```
Lovable → Deploy on Lovable Cloud
```

Best for: Simple apps, MVPs, non-technical founders

Stay here if: The app is simple enough that Lovable handles everything

### Path B: Vibe to Agentic (Common)

```
Lovable → Export to GitHub → Cursor/Codex
```

Best for: Apps that outgrow web tools

When to switch:
- Need custom backend logic
- Hit limitations of the web tool
- Want more control over deployment

### Path C: Agentic from Start (Technical)

```
Create GitHub repo → Cursor/Codex from day one
```

Best for: Developers, complex requirements, enterprise apps

Why: Maximum control, but requires more setup and knowledge

### Path D: Hybrid (Flexible)

```
v0 for UI components → Paste into Cursor project → Codex for features
```

Best for: Using each tool's strengths

How it works:
- Use v0 when you need quick UI mockups
- Copy the code into your main project
- Use Cursor/Codex for logic and features

---

## Quick Reference

### Web Tools

| Tool | Backend? | Deploy | Export |
|------|----------|--------|--------|
| v0 | No | Vercel | Copy code |
| Lovable | Yes (Supabase) | Lovable Cloud | GitHub sync |
| Bolt | Limited | Netlify | GitHub |
| Replit | Yes | Replit | GitHub |

### Agentic Tools

| Tool | Interface | Works With |
|------|-----------|------------|
| Codex | Web | GitHub repos |
| Cursor | Desktop IDE | Local folders |
| Windsurf | Desktop IDE | Local folders |
| Claude Code | Terminal | Local folders |
| aider | Terminal | Local folders |

### When to Switch

| Signal | Action |
|--------|--------|
| "I can't do X in this tool" | Export to agentic tool |
| "I need custom backend logic" | Export to agentic tool |
| "I want to change hosting" | Export to GitHub |
| "The tool keeps breaking my code" | Export to agentic tool |
| "I need a quick UI mockup" | Use v0, copy to project |

---

**Related:**
- [The Guide](./guide.md) - Full vibe coding workflow
- [Skills](./skills-table.md) - System prompts for your tools
- [Web Rules](./web-rules.md) - What to check before deploying
