# Basic Web Concepts

Understanding how the web works helps you prompt AI tools better and debug faster.

## How Websites Work

```
Browser → Request → Server → Response → Browser renders
```

Every page load, link click, or form submit is a request/response cycle.

## Frontend vs Backend

**Frontend (client):** Runs in the browser. Users can see and modify it.
- HTML (structure), CSS (style), JavaScript (behavior)
- Never put secrets here

**Backend (server):** Runs on a server. Hidden from users.
- Database queries, auth checks, API endpoints
- Secrets and trusted logic live here

**Analogy:** Frontend = dining room, Backend = kitchen, API = waiter.

## URLs and Routes

```
https://myapp.com/recipes/pizza?servings=4#ingredients
  └─ protocol  └ domain └── path └─ query params └ fragment
```

Routes map URLs to pages or actions:
- `/recipes` (list)
- `/recipes/pizza` (detail)
- `/api/recipes` (data endpoint)

## HTTP Methods

| Method | Purpose |
|--------|---------|
| GET | Read data |
| POST | Create |
| PUT/PATCH | Update |
| DELETE | Remove |

## Status Codes (Common)

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |

## HTML, CSS, JavaScript

- **HTML:** Structure (skeleton)
- **CSS:** Appearance (skin)
- **JS:** Behavior (muscles/brain)

## The DOM

The DOM is the browser’s in-memory tree of the page. JavaScript reads and updates it to change what you see.

## State

State is data that changes over time (logged-in user, cart items, form values).

| Where | Persists? | Example |
|-------|-----------|---------|
| Component state | No (refresh clears) | Dropdown open/closed |
| URL | Yes | Filters in query params |
| Local storage | Yes (device) | Theme preference |
| Database | Yes (all devices) | User profile |

## APIs

APIs are URLs that return data (usually JSON):

```json
{ "id": 1, "name": "Pizza" }
```

Your frontend calls APIs to load data, submit forms, and check auth.

## Rendering: SSR vs CSR

- **SSR:** Server builds HTML first (fast initial load, SEO)
- **CSR:** Browser builds HTML with JS (interactive)
- **Modern:** Most frameworks do both

## Common File Types

| Extension | Use |
|-----------|-----|
| .html | Page structure |
| .css | Styles |
| .ts/.tsx | TypeScript code |
| .json | Data/config |
| .env | Secrets (never commit) |
| .md | Docs |

## Browser DevTools

Open DevTools (F12 or Inspect) to debug:
- **Elements:** HTML/CSS
- **Console:** Errors, logs
- **Network:** Requests and failures
- **Application:** Storage, cookies

---

**Next:** [Server, Client, and Database Apps](./fullstack-apps.md)
