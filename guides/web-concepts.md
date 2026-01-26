# Basic Web Concepts

Understanding how the web works helps you communicate better with AI tools and debug problems faster.

## How Websites Work

When you visit a website, here's what happens:

```
You (Browser) → Request → Server → Response → You see the page
```

1. **You type a URL** (like `myapp.com`)
2. **Your browser sends a request** to a server somewhere in the world
3. **The server processes the request** and figures out what to send back
4. **The server sends a response** (HTML, CSS, JavaScript, images, data)
5. **Your browser renders** what it received into the page you see

This happens every time you:
- Load a page
- Click a link
- Submit a form
- Fetch new data

## Frontend vs Backend

### Frontend (Client-Side)

**What it is:** Everything that runs in the user's browser.

**Includes:**
- HTML (the structure of the page)
- CSS (how it looks)
- JavaScript (interactivity and behavior)
- Images, fonts, icons

**Key point:** Users can see and inspect all frontend code. Open any website, press F12, and you can see everything. This means:
- Never put secrets in frontend code
- Never trust frontend-only validation
- Assume users can modify anything on their end

### Backend (Server-Side)

**What it is:** Everything that runs on a server, hidden from users.

**Includes:**
- Database queries
- Business logic
- Authentication checks
- API endpoints
- Secret keys and credentials

**Key point:** Users cannot see backend code. This is where sensitive operations happen.

### The Analogy

Think of a restaurant:
- **Frontend** = The dining room (what customers see and interact with)
- **Backend** = The kitchen (where the real work happens, customers can't enter)
- **API** = The waiter (carries orders between dining room and kitchen)

## URLs and Routes

A URL (Uniform Resource Locator) is an address for something on the web.

```
https://myapp.com/recipes/pizza?servings=4#ingredients
  │       │         │      │         │          │
  │       │         │      │         │          └── Fragment (jump to section)
  │       │         │      │         └── Query params (extra info)
  │       │         │      └── Dynamic segment (which recipe)
  │       │         └── Path (what page)
  │       └── Domain (which website)
  └── Protocol (secure connection)
```

**Routes** are patterns that map URLs to pages or actions:
- `/recipes` → Show all recipes
- `/recipes/pizza` → Show the pizza recipe
- `/recipes/new` → Form to create a recipe
- `/api/recipes` → Get recipe data (for code, not humans)

## HTTP Methods

When your browser talks to a server, it uses different "verbs" for different actions:

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Read/fetch data | Loading a page, searching |
| **POST** | Create something new | Submitting a form, signing up |
| **PUT/PATCH** | Update something | Editing a profile |
| **DELETE** | Remove something | Deleting an account |

When you hear "REST API" or "HTTP endpoint," it's just these methods applied to URLs.

## Status Codes

Servers respond with status codes that tell you what happened:

| Code | Meaning | What to do |
|------|---------|------------|
| **200** | Success | Everything worked |
| **201** | Created | New thing was made |
| **400** | Bad Request | You sent invalid data |
| **401** | Unauthorized | You need to log in |
| **403** | Forbidden | You don't have permission |
| **404** | Not Found | That thing doesn't exist |
| **500** | Server Error | Something broke on the server |

When debugging, these codes tell you where to look for the problem.

## HTML, CSS, JavaScript

### HTML (Structure)

HTML defines what's on the page:

```html
<header>
  <h1>My Recipe App</h1>
  <nav>...</nav>
</header>
<main>
  <article>
    <h2>Pizza Recipe</h2>
    <p>Instructions here...</p>
  </article>
</main>
```

Think of it as the skeleton—the bones that give shape.

### CSS (Style)

CSS defines how things look:

```css
h1 {
  color: blue;
  font-size: 24px;
}
```

Think of it as the skin and clothes—appearance and presentation.

### JavaScript (Behavior)

JavaScript makes things interactive:

```javascript
button.addEventListener('click', () => {
  alert('You clicked!');
});
```

Think of it as the muscles and brain—action and logic.

## The DOM

The DOM (Document Object Model) is how JavaScript sees and manipulates the page.

When a page loads:
1. Browser reads the HTML
2. Creates a tree structure in memory (the DOM)
3. JavaScript can read and change this tree
4. Changes to the DOM update what you see

**Example:** When you click "Add to Cart" and a number updates without the page reloading—that's JavaScript changing the DOM.

## State

**State** is data that can change over time.

Examples of state:
- Is the user logged in? (yes/no)
- What's in their shopping cart? (list of items)
- What did they type in the search box? (text)
- Is this dropdown open? (yes/no)

State can live in different places:

| Where | Persists? | Shared? | Example |
|-------|-----------|---------|---------|
| **Component state** | No (gone on refresh) | No (one component) | Dropdown open/closed |
| **URL state** | Yes (bookmarkable) | Yes (share link) | Search filters |
| **Local storage** | Yes (browser) | No (one device) | Theme preference |
| **Database** | Yes (server) | Yes (all devices) | User profile |

## APIs

An **API** (Application Programming Interface) is how programs talk to each other.

**Web APIs** are URLs that return data instead of web pages:

```
GET https://api.myapp.com/recipes
→ Returns: [{ "id": 1, "name": "Pizza" }, ...]
```

Your frontend calls APIs to:
- Load data from the database
- Submit forms
- Check if user is logged in
- Any server operation

**JSON** is the most common format for API data:

```json
{
  "id": 1,
  "name": "Pizza",
  "ingredients": ["dough", "sauce", "cheese"],
  "servings": 4
}
```

## Loading and Rendering

### Server-Side Rendering (SSR)

Server builds the complete HTML before sending it:

```
Request → Server builds HTML → Send complete page → Browser displays
```

**Good for:** SEO, fast initial load, works without JavaScript

### Client-Side Rendering (CSR)

Server sends minimal HTML, JavaScript builds the page:

```
Request → Send shell + JS → Browser runs JS → Page appears
```

**Good for:** Highly interactive apps, faster navigation after initial load

### Modern Approach

Most frameworks (Next.js, Remix) combine both:
- First page load: Server-rendered (fast, SEO-friendly)
- Navigation: Client-rendered (instant, app-like)

## Common File Types

| Extension | What it is |
|-----------|------------|
| `.html` | Web page structure |
| `.css` | Styles |
| `.js` | JavaScript code |
| `.ts` | TypeScript (JavaScript with types) |
| `.jsx/.tsx` | React components |
| `.json` | Data/configuration |
| `.md` | Documentation (Markdown) |
| `.env` | Environment variables (secrets) |

## Browser DevTools

Press **F12** (or right-click → Inspect) to open DevTools.

**Key tabs:**
- **Elements:** See and edit the HTML/CSS live
- **Console:** See errors, run JavaScript, debug
- **Network:** See all requests (what's loading, what failed)
- **Application:** See cookies, local storage, etc.

**When something breaks:**
1. Open Console tab
2. Look for red errors
3. The error usually tells you what file and line number

---

**Next:** [Server, Client, and Database Apps](./fullstack-apps.md)
