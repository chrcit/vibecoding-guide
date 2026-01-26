# Web Development Rules

Non-negotiable rules for building web apps that work in production. Break these and bad things happen.

## Security Rules

### Never Expose Secrets

**The Rule:** API keys, passwords, and database credentials never go in code files.

**Why It Matters:** If someone finds your API key (and they will—GitHub is constantly scanned), they can:
- Use your services and you get the bill
- Access your users' data
- Take actions as your app

**What To Do:**
```
✅ Store secrets in environment variables
✅ Add .env to .gitignore before creating it
✅ Use your hosting platform's secret storage (Vercel, Railway, etc.)
✅ Use NEXT_PUBLIC_ only for values that can be public

❌ Hardcode API keys in code files
❌ Commit .env files to Git
❌ Put secrets in frontend code (users can see it)
```

**If You Already Exposed a Secret:**
1. The secret is compromised—assume someone has it
2. Go to the service and regenerate the key immediately
3. Update your environment variables with the new key
4. Add the file to `.gitignore`
5. Consider using [git-filter-repo](https://github.com/newren/git-filter-repo) to remove from history

---

### Validate All User Input

**The Rule:** Never trust data from users. Validate and sanitize everything.

**Why It Matters:**
- **SQL Injection:** Malicious input can delete your entire database
- **XSS (Cross-Site Scripting):** Attackers can inject code that runs in other users' browsers
- **Data Corruption:** Invalid data breaks your app in unexpected ways

**What To Do:**
```
✅ Validate on the server (client validation can be bypassed)
✅ Use parameterized queries (ORMs like Prisma do this automatically)
✅ Sanitize HTML before displaying user content
✅ Set length limits on text inputs
✅ Validate file types and sizes for uploads

❌ Build SQL queries with string concatenation
❌ Use dangerouslySetInnerHTML with user content
❌ Trust client-side validation alone
```

---

### Protect Your Database

**The Rule:** Users should only access data they're allowed to see.

**Why It Matters:** Without protection, anyone can read, modify, or delete all your data.

**What To Do (Supabase):**
```
✅ Enable Row Level Security (RLS) on all tables
✅ Create policies that check user authentication
✅ Test by trying to access data you shouldn't be able to

❌ Leave RLS disabled "for testing"
❌ Use service role key in frontend code
```

**What To Do (General):**
```
✅ Check authentication before database operations
✅ Verify user owns/can access the resource
✅ Use the principle of least privilege
```

---

### Authenticate Server-Side

**The Rule:** Authentication checks must happen on the server, not just the client.

**Why It Matters:** Client-side checks can be bypassed. If your API doesn't check authentication, anyone can call it.

**What To Do:**
```
✅ Check auth in API routes/server actions
✅ Redirect unauthorized users on the server
✅ Use middleware for protected routes

❌ Only check auth in the UI
❌ Hide buttons instead of protecting endpoints
❌ Trust data from the client about who the user is
```

---

## Accessibility Rules

### Every Image Needs Alt Text

**The Rule:** All `<img>` elements need descriptive `alt` attributes.

**Why It Matters:** Screen readers read alt text to visually impaired users. Without it, they don't know what's in the image.

**What To Do:**
```
✅ Describe what's in the image: alt="Golden retriever playing fetch"
✅ For decorative images: alt="" (empty, but present)
✅ For logos/icons with text: include the text

❌ alt="image" or alt="photo"
❌ Missing alt attribute entirely
```

---

### Forms Need Labels

**The Rule:** Every form input needs a connected `<label>` element.

**Why It Matters:** Screen readers use labels to announce what each input is for. Clicking the label also focuses the input (better UX for everyone).

**What To Do:**
```html
✅ <label htmlFor="email">Email</label>
   <input id="email" type="email" />

✅ <label>
     Email
     <input type="email" />
   </label>

❌ <input placeholder="Email" />  <!-- placeholder is not a label -->
```

---

### Interactive Elements Need Focus Styles

**The Rule:** Users must be able to see which element is focused when using keyboard navigation.

**Why It Matters:** Keyboard users (including many with motor disabilities) need to see where they are on the page.

**What To Do:**
```
✅ Keep default focus outlines, or replace with visible alternatives
✅ Test by pressing Tab through your entire interface
✅ Use focus-visible for styling (only shows for keyboard, not mouse)

❌ outline: none without a replacement
❌ Hiding focus indicators for aesthetic reasons
```

---

### Text Needs Contrast

**The Rule:** Text must have sufficient contrast against its background.

**Why It Matters:** Low contrast text is hard to read for everyone, impossible for some.

**What To Do:**
```
✅ Use a contrast checker tool
✅ Minimum ratio: 4.5:1 for normal text, 3:1 for large text
✅ Test with different monitors/lighting

❌ Light gray text on white backgrounds
❌ Relying on color alone to convey meaning
```

---

## Performance Rules

### Optimize Images

**The Rule:** Images should be appropriately sized and compressed.

**Why It Matters:** Images are often the biggest files on a page. Unoptimized images = slow pages.

**What To Do:**
```
✅ Use next/image in Next.js (auto-optimizes)
✅ Serve appropriate sizes (don't load 4000px images for thumbnails)
✅ Use modern formats (WebP, AVIF)
✅ Add width/height to prevent layout shift

❌ Upload photos directly from phone
❌ Load full-size images for small displays
```

---

### Don't Block Rendering

**The Rule:** The page should show something quickly, even if data is still loading.

**Why It Matters:** Users leave pages that take too long to show anything.

**What To Do:**
```
✅ Show skeletons/loading states immediately
✅ Prioritize above-the-fold content
✅ Load data incrementally (show what you have)

❌ Blank screens while loading
❌ Loading everything before showing anything
```

---

## Deployment Rules

### Test the Deployed Version

**The Rule:** Always test the live deployed version, not just localhost.

**Why It Matters:** Many things work locally but break in production:
- Missing environment variables
- Different file paths
- API URLs hardcoded to localhost

**What To Do:**
```
✅ Click through key flows after every deploy
✅ Check browser console for errors
✅ Test on actual mobile devices

❌ Assuming it works because it works locally
```

---

### Use Preview Deployments

**The Rule:** Test changes in preview before merging to production.

**Why It Matters:** Catch problems before they affect real users.

**What To Do:**
```
✅ Enable preview deployments (Vercel does this automatically)
✅ Test the preview URL before merging
✅ Share preview URLs for feedback

❌ Pushing directly to main/production
```

---

### Have a Rollback Plan

**The Rule:** Know how to undo a bad deploy quickly.

**Why It Matters:** Things break. Recovery speed matters more than perfection.

**What To Do:**
```
✅ Know where the rollback button is (Vercel: Deployments → ... → Redeploy)
✅ Commit frequently so you have good restore points
✅ Test rollback before you need it

❌ Making many changes without commits
❌ Not knowing how to rollback
```

---

## Quick Reference

### Before Every Deploy
- [ ] No secrets in code files
- [ ] Environment variables set in hosting platform
- [ ] RLS enabled on database tables (Supabase)
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Focus styles visible
- [ ] Tested on mobile

### When Something Breaks
1. Check browser console (F12 → Console)
2. Check Vercel/hosting logs
3. Roll back if needed
4. Fix in a branch, test in preview
5. Deploy fix

### Security Checklist
- [ ] Secrets in environment variables only
- [ ] Server-side auth on all protected routes
- [ ] Input validation on server
- [ ] RLS policies on database
- [ ] No `dangerouslySetInnerHTML` with user content
