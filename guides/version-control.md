# GitHub and Version Control

How to save your work, undo mistakes, and collaborate with AI tools.

## Why Version Control Matters

Without version control:
- One bad change can destroy everything
- You can't undo mistakes easily
- You can't see what changed when something breaks
- Your code exists only on one computer

With version control (Git + GitHub):
- Every change is saved with a timestamp
- You can go back to any previous version
- You can see exactly what changed
- Your code is backed up in the cloud
- You can work with AI tools that need GitHub access

## The Basics

### Git vs GitHub

**Git** = The version control system (runs on your computer)
**GitHub** = A website that stores your Git repositories online

Think of it like:
- Git = The save system in a video game
- GitHub = The cloud where your save files are backed up

### Key Concepts

**Repository (repo):** A folder tracked by Git. Contains your code and its history.

**Commit:** A saved snapshot of your code at a point in time. Like a save point in a game.

**Branch:** A parallel version of your code. Lets you experiment without affecting the main code.

**Push:** Send your commits to GitHub.

**Pull:** Get commits from GitHub to your computer.

**Clone:** Download a repository from GitHub to your computer.

## Setting Up

### Create a GitHub Account

1. Go to [github.com](https://github.com)
2. Sign up with your email
3. Verify your email

### Install Git

**Mac:**
```bash
# Usually pre-installed. Check with:
git --version

# If not installed, you'll be prompted to install Xcode tools
```

**Windows:**
Download from [git-scm.com](https://git-scm.com)

### Configure Git

Tell Git who you are (do this once):

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Essential Commands

You only need to know a few commands for 90% of situations:

### Starting Fresh

**Create a new repo on GitHub:**
1. Go to GitHub → New Repository
2. Give it a name
3. Choose Public or Private
4. Don't add README yet if starting from existing code
5. Copy the URL

**Connect your local folder:**
```bash
cd your-project-folder
git init
git remote add origin https://github.com/you/your-repo.git
```

**Or clone an existing repo:**
```bash
git clone https://github.com/you/your-repo.git
cd your-repo
```

### Daily Workflow

**See what changed:**
```bash
git status
```

**Save your changes:**
```bash
git add .                    # Stage all changes
git commit -m "What you did" # Commit with a message
```

**Send to GitHub:**
```bash
git push
```

**Get latest from GitHub:**
```bash
git pull
```

### The Flow

```
Make changes → git add . → git commit -m "message" → git push
     ↑                                                    │
     └────────────────────────────────────────────────────┘
```

## Commit Messages

Write messages that explain what you did:

```bash
# Good
git commit -m "Add recipe search feature"
git commit -m "Fix login button not working on mobile"
git commit -m "Update colors to match brand guidelines"

# Bad
git commit -m "stuff"
git commit -m "fix"
git commit -m "asdfasdf"
```

Your future self will thank you when debugging.

## Undoing Things

### Undo Changes Not Yet Committed

**Discard all uncommitted changes:**
```bash
git restore .
```

**Discard changes to one file:**
```bash
git restore path/to/file.js
```

### Undo the Last Commit

**Keep the changes, just undo the commit:**
```bash
git reset --soft HEAD~1
```

**Completely undo the commit and changes:**
```bash
git reset --hard HEAD~1
```

### Go Back to a Previous State

**See commit history:**
```bash
git log --oneline
```

Output:
```
abc1234 Add search feature
def5678 Fix login bug
ghi9012 Initial commit
```

**Go back to a specific commit:**
```bash
git checkout def5678
```

**Go back to latest:**
```bash
git checkout main
```

## Branches

Branches let you work on features without affecting the main code.

### Why Use Branches

```
main (stable) ─────────────────────────────────────►
                  │                    │
                  │   feature-search   │
                  └────────────────────┘
                    (experimental)
```

- `main` stays stable
- Experiment on a branch
- Merge back when it works

### Branch Commands

**Create and switch to a new branch:**
```bash
git checkout -b feature-search
```

**Switch between branches:**
```bash
git checkout main           # Go to main
git checkout feature-search # Go to your branch
```

**List branches:**
```bash
git branch
```

**Merge branch into main:**
```bash
git checkout main
git merge feature-search
```

**Delete branch after merging:**
```bash
git branch -d feature-search
```

## .gitignore

Files you don't want in version control:

```gitignore
# Environment variables (secrets!)
.env
.env.local
.env*.local

# Dependencies (can be reinstalled)
node_modules/

# Build output
.next/
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
```

Create `.gitignore` in your project root before committing secrets!

## Working with AI Tools

### Tools That Need GitHub

| Tool | How It Connects |
|------|-----------------|
| **Lovable** | Syncs automatically |
| **Codex** | Connects to your repos |
| **Vercel** | Deploys from repos |
| **Railway** | Deploys from repos |

### The Handoff Pattern

```
Web Tool (Lovable)
       │
       ▼ [Export/Sync to GitHub]
    GitHub
       │
       ▼ [Clone/Connect]
Local Tool (Cursor/Codex)
```

### Best Practices with AI

1. **Commit before AI changes:** Create a save point
2. **Review AI changes:** Use `git diff` to see what changed
3. **Commit working states:** Don't let AI make many uncommitted changes
4. **Use branches for experiments:** Keep main stable

## Common Situations

### "I made changes but want to start over"

```bash
git restore .
```
Discards all uncommitted changes.

### "I committed but it's wrong"

```bash
git reset --soft HEAD~1  # Undo commit, keep changes
# Fix things
git add .
git commit -m "Fixed version"
```

### "I need to see what I changed"

```bash
git diff              # Uncommitted changes
git diff HEAD~1       # Changes since last commit
git log --oneline -10 # Last 10 commits
```

### "I accidentally committed secrets"

1. **Remove the file from tracking:**
```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
```

2. **The secret is still in history.** You need to:
   - Rotate/regenerate the secret immediately
   - Consider using [git-filter-repo](https://github.com/newren/git-filter-repo) to clean history

3. **Prevent future accidents:**
   - Add to `.gitignore` first
   - Use environment variables in hosting platforms

### "My push was rejected"

Usually means GitHub has changes you don't have:

```bash
git pull          # Get the changes
# Resolve any conflicts if prompted
git push          # Try again
```

## GitHub Features

### Pull Requests

When using branches, open a Pull Request to merge:

1. Push your branch to GitHub
2. GitHub shows "Compare & pull request" button
3. Review the changes
4. Click "Merge pull request"

This creates a record of what changed and why.

### Issues

Track bugs and features:

1. Go to your repo → Issues → New Issue
2. Describe the problem or feature
3. Reference in commits: `git commit -m "Fix login bug, closes #123"`

### GitHub Actions

Automated tasks when you push:

- Run tests
- Deploy to Vercel
- Check for security issues

You don't need to set these up immediately, but know they exist.

## Quick Reference

### Daily Commands
```bash
git status              # What changed?
git add .               # Stage all changes
git commit -m "message" # Save snapshot
git push                # Send to GitHub
git pull                # Get from GitHub
```

### Recovery Commands
```bash
git restore .           # Discard uncommitted changes
git reset --soft HEAD~1 # Undo last commit, keep changes
git reset --hard HEAD~1 # Undo last commit and changes
git log --oneline       # See history
```

### Branch Commands
```bash
git checkout -b name    # Create and switch to branch
git checkout main       # Switch to main
git merge branch-name   # Merge branch into current
git branch -d name      # Delete branch
```

---

**Next:** [Cloud Infrastructure](./cloud-infrastructure.md)
