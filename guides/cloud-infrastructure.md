# Cloud Infrastructure

Deploying your app: Vercel, Railway, domains, DNS, and how it all works.

## The Big Picture

Your app needs to live somewhere people can access it:

```
Your Code → Hosting Platform → Domain Name → Users
              (Vercel)         (myapp.com)
```

## Hosting Platforms

### What They Do

- Run your code on their servers
- Handle traffic (many users at once)
- Provide URLs for your app
- Manage HTTPS (secure connections)
- Scale automatically as needed

### Popular Options

| Platform | Good For | Free Tier |
|----------|----------|-----------|
| **Vercel** | Next.js, React, frontend | Generous |
| **Railway** | Backends, databases, any language | $5/month credit |
| **Netlify** | Static sites, frontend | Generous |
| **Render** | Full-stack, databases | Limited |
| **Fly.io** | Global distribution | Limited |
| **Cloudflare** | Static sites, Workers, storage, anything small | Very generous |
| **GitHub Pages** | Static sites straight from a repo | Free |

### Cloudflare

Cloudflare started as a network and security company for big enterprises and runs its own global cloud (not on AWS). Because enterprises are the paying customers, a lot is free for everyone else:

- Static hosting with unlimited bandwidth (Cloudflare Pages / Workers static assets)
- Serverless functions (Workers), storage (R2), databases (D1), key-value (KV)
- Access control: put a login in front of a site so only you (or your team) can see it

Connecting a GitHub repo takes a few clicks; it detects how to build most projects. Dozens of small projects can run for a few dollars a month. Ask your agent to set it up.

### GitHub Pages

The simplest way to put a static site (HTML, an Astro build, an exported notebook) online. Turn it on in the repo settings, or ask your agent to "deploy this to GitHub Pages". Restricting who can see a Pages site needs GitHub Enterprise Cloud, so on normal plans assume the site is public, even when the repo is private.

### Previewing Agent Work From Another Device

Your agent's browser sees your dev server; your phone and colleagues don't. Options:

- **Deploy** to Cloudflare or GitHub Pages (with access control if it's private)
- **Private network:** run the dev server on a machine in a Tailscale network and open it from any of your devices
- **Download and run it locally:** fine for notebooks and one-off tools

### Vercel (Most Common for Vibe Coding)

**What it is:** Hosting platform made by the creators of Next.js.

**Good for:**
- Next.js apps (built-in optimization)
- React apps
- Static websites
- Serverless functions

**How it works:**
1. Connect your GitHub repo
2. Vercel detects your framework
3. Every push to main deploys automatically
4. Get a URL like `your-app.vercel.app`

**Key features:**
- **Preview Deployments:** Every branch/PR gets its own URL
- **Serverless Functions:** Backend code without managing servers
- **Edge Functions:** Code that runs close to users globally
- **Environment Variables:** Secure secret storage

### Railway

**What it is:** Platform for deploying anything—backends, databases, services.

**Good for:**
- Backend APIs
- Databases (PostgreSQL, MySQL, Redis)
- Services that need to run continuously
- Python, Go, Ruby, etc.

**How it works:**
1. Connect your GitHub repo or use their templates
2. Railway detects your stack
3. Deploys with a URL
4. Can add databases with one click

**Key features:**
- **One-click databases:** PostgreSQL, MySQL, Redis, MongoDB
- **Private networking:** Services can talk to each other securely
- **Persistent storage:** Data survives restarts
- **Usage-based pricing:** Pay for what you use

## Deployment Concepts

### Build vs Runtime

**Build time:** When your code is compiled/prepared for production
```
Source code → Build process → Production files
```

**Runtime:** When your app is actually running and serving users
```
User request → Your running app → Response
```

Some things happen at build time (static pages), others at runtime (dynamic data).

### Environment Variables

Different values for different environments:

```
Local development:
  DATABASE_URL=localhost:5432/mydb

Production (Vercel):
  DATABASE_URL=production-db.railway.app:5432/mydb
```

**Setting them:**

**Vercel:**
1. Project → Settings → Environment Variables
2. Add name and value
3. Choose environments (Production, Preview, Development)
4. Redeploy to apply

**Railway:**
1. Service → Variables tab
2. Add variables
3. Service restarts automatically

### Continuous Deployment

Every push to main automatically deploys:

```
Push to GitHub → Platform detects → Builds → Deploys → Live
```

**Preview deployments:**
- Push to a branch → Gets its own URL
- Test before merging
- URL like `your-app-feature-xyz.vercel.app`

## Domains and DNS

### How Domains Work

When someone visits `myapp.com`:

```
Browser: "What's the IP for myapp.com?"
    │
    ▼
DNS Server: "It's 76.76.21.21"
    │
    ▼
Browser: Connects to 76.76.21.21
    │
    ▼
Vercel: Serves your app
```

**DNS (Domain Name System)** translates human-readable names to IP addresses.

### Getting a Domain

**Where to buy:**
- [Namecheap](https://namecheap.com) - Good prices, easy to use
- [Cloudflare](https://cloudflare.com) - At-cost pricing
- [Squarespace Domains](https://domains.squarespace.com) - Simple
- [Porkbun](https://porkbun.com) - Affordable

**Typical cost:** $10-15/year for a `.com`

### DNS Records

DNS records tell the internet where to find your stuff:

| Record Type | Purpose | Example |
|-------------|---------|---------|
| **A** | Points domain to IP address | `myapp.com → 76.76.21.21` |
| **CNAME** | Points domain to another domain | `www.myapp.com → myapp.vercel.app` |
| **TXT** | Verification, email settings | Proving you own the domain |
| **MX** | Email routing | Where to deliver emails |

### Connecting Domain to Vercel

1. **In Vercel:**
   - Project → Settings → Domains
   - Add your domain
   - Vercel shows you what DNS records to add

2. **In your domain registrar (Namecheap, etc.):**
   - Go to DNS settings
   - Add the records Vercel told you

3. **Wait for propagation:**
   - DNS changes take time (minutes to 48 hours)
   - Usually fast, sometimes slow

**Vercel will show:**
```
Add an A record:
  Name: @
  Value: 76.76.21.21

Add a CNAME record:
  Name: www
  Value: cname.vercel-dns.com
```

### SSL/HTTPS

HTTPS = Secure connection (the padlock icon)

**Good news:** Vercel, Railway, Netlify all provide free SSL automatically. You don't need to do anything.

**Make sure:**
- Your site works on `https://` (not just `http://`)
- Links within your site use HTTPS
- API calls use HTTPS

### Subdomains

Parts before your main domain:

```
app.mycompany.com     ← subdomain "app"
docs.mycompany.com    ← subdomain "docs"
api.mycompany.com     ← subdomain "api"
```

Each can point to a different service/platform.

## Common Setups

### Simple: Everything on Vercel

```
myapp.com → Vercel (Next.js app with API routes)
```

Good for: Most apps, especially starting out

### Split: Frontend + Separate Backend

```
myapp.com       → Vercel (Next.js frontend)
api.myapp.com   → Railway (Backend API)
```

Good for: When you need a dedicated backend

### With External Database

```
myapp.com       → Vercel (Next.js)
                     │
                     ▼
              Supabase (Database)
```

Good for: Using Supabase, PlanetScale, etc.

## Vercel Configuration

### vercel.json

Optional configuration file in your project root:

```json
{
  "redirects": [
    { "source": "/old-page", "destination": "/new-page" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

### Environment Variable Naming

In Next.js:
- `NEXT_PUBLIC_*` → Exposed to browser (public)
- Everything else → Server only (private)

```env
# Public (browser can see)
NEXT_PUBLIC_SITE_URL=https://myapp.com

# Private (server only)
DATABASE_URL=postgresql://...
API_SECRET=...
```

## Railway Configuration

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

### Adding a Database

1. Project → New Service → Database
2. Choose PostgreSQL, MySQL, etc.
3. Railway creates it with a connection URL
4. Add `DATABASE_URL` to your service's variables
5. Reference in your code: `process.env.DATABASE_URL`

## Troubleshooting Deployments

### Build Fails

Check the build logs:
1. Vercel → Project → Deployments → Click failed deploy → View logs
2. Look for red error text
3. Usually: missing dependency, TypeScript error, wrong Node version

**Common fixes:**
```bash
# Missing dependency
npm install missing-package

# TypeScript error
# Fix the error in your code

# Node version
# Add to package.json:
"engines": {
  "node": "18.x"
}
```

### App Works Locally But Not Deployed

**Check environment variables:**
- Are they set in the platform?
- Are the values correct for production?
- Did you redeploy after adding them?

**Check the logs:**
- Vercel: Deployments → Functions tab
- Railway: Service → Logs

**Common issues:**
- Hardcoded `localhost` URLs
- Missing environment variables
- Database connection blocked (check firewall/network settings)

### Domain Not Working

**DNS not propagated yet:**
- Wait up to 48 hours (usually faster)
- Check with [dnschecker.org](https://dnschecker.org)

**Wrong DNS records:**
- Double-check what the platform told you to add
- Make sure there are no conflicting records

**SSL certificate pending:**
- Platforms need to verify domain ownership
- Can take a few minutes after DNS is correct

## Cost Awareness

### Free Tiers

Free tiers change often. Check current limits before launching anything public.

**Common patterns:**
- Bandwidth and function limits on app hosting
- Usage-based billing for databases
- Easy to exceed limits on active projects

### When You'll Pay

- High traffic
- Large databases
- Many serverless function invocations
- Custom domains (the domain itself, not hosting)

### Monitoring Usage

**Vercel:** Project → Analytics and Usage tabs
**Railway:** Project → Usage tab

Set up billing alerts before you're surprised.

## Quick Reference

### Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Platform connected to repo
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] App works on preview URL
- [ ] Domain configured (if using custom)
- [ ] HTTPS working

### DNS Record Quick Reference

| Want to... | Record Type | Example |
|------------|-------------|---------|
| Point domain to Vercel | A | `@ → 76.76.21.21` |
| Point www to Vercel | CNAME | `www → cname.vercel-dns.com` |
| Verify domain ownership | TXT | `@ → vercel-verification=...` |
| Point subdomain | CNAME | `api → your-api.railway.app` |

---

**Next:** [Vibe Coding with Web Builders](./vibe-coding-web.md)
