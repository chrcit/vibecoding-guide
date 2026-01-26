# Server, Client, and Database Apps

How the pieces of a modern web app fit together.

## The Three Layers

```
┌─────────────────────────────────────┐
│           Frontend (Client)          │  ← What users see
│         React, Next.js, etc.         │
└─────────────────┬───────────────────┘
                  │ API calls
                  ▼
┌─────────────────────────────────────┐
│           Backend (Server)           │  ← Business logic
│      API routes, server actions      │
└─────────────────┬───────────────────┘
                  │ Database queries
                  ▼
┌─────────────────────────────────────┐
│             Database                 │  ← Data storage
│       Supabase, PostgreSQL, etc.     │
└─────────────────────────────────────┘
```

## The Frontend

### What It Does

- Displays the user interface
- Handles user interactions (clicks, typing, etc.)
- Sends requests to the backend
- Updates the display based on responses

### Common Tools

| Tool | What it is |
|------|------------|
| **React** | Library for building UIs with components |
| **Next.js** | React framework with routing, SSR, and more |
| **Tailwind CSS** | Utility classes for styling |
| **TypeScript** | JavaScript with type checking |

### Components

Modern frontends are built from **components**—reusable pieces of UI.

```
Page
├── Header
│   ├── Logo
│   └── Navigation
├── Main Content
│   ├── RecipeCard
│   ├── RecipeCard
│   └── RecipeCard
└── Footer
```

Each component:
- Has its own file
- Can have its own state
- Receives data through "props"
- Can be reused anywhere

### Data Flow

```
User clicks "Save"
    → Component handles click
    → Calls API endpoint
    → Receives response
    → Updates state
    → UI re-renders
```

## The Backend

### What It Does

- Receives requests from the frontend
- Validates and processes data
- Talks to the database
- Enforces business rules
- Returns responses

### API Routes

API routes are endpoints that handle requests:

```
POST /api/recipes
→ Create a new recipe

GET /api/recipes
→ Get all recipes

GET /api/recipes/123
→ Get recipe with ID 123

PUT /api/recipes/123
→ Update recipe 123

DELETE /api/recipes/123
→ Delete recipe 123
```

### Server Actions (Next.js)

In Next.js, "server actions" let you write server code that looks like regular functions:

```javascript
// This runs on the server, not in the browser
async function saveRecipe(formData) {
  'use server';

  // Validate data
  // Save to database
  // Return result
}
```

The framework handles the API call automatically.

### What Belongs on the Server

- Database queries
- Authentication checks
- Secret API keys
- Business logic validation
- Sensitive calculations

**Rule:** If it involves secrets or needs to be trusted, it goes on the server.

## The Database

### What It Does

- Stores data permanently
- Retrieves data when requested
- Ensures data consistency
- Handles multiple users accessing data simultaneously

### Tables and Records

Databases organize data into **tables** (like spreadsheets):

**users table:**
| id | email | name | created_at |
|----|-------|------|------------|
| 1 | alice@example.com | Alice | 2024-01-15 |
| 2 | bob@example.com | Bob | 2024-01-16 |

**recipes table:**
| id | title | user_id | ingredients |
|----|-------|---------|-------------|
| 1 | Pizza | 1 | ["dough", "sauce"] |
| 2 | Salad | 2 | ["lettuce", "tomato"] |

### Relationships

Tables connect to each other:
- Each recipe has a `user_id` that links to the users table
- This lets you query "all recipes by Alice"

### Common Database Services

| Service | Type | Good for |
|---------|------|----------|
| **Supabase** | PostgreSQL + extras | Full-featured, good free tier |
| **PlanetScale** | MySQL | Scalable, branching |
| **Neon** | PostgreSQL | Serverless, scales to zero |
| **MongoDB Atlas** | NoSQL | Flexible schema |

### Supabase Specifics

Supabase is popular for vibe coding because it provides:
- **Database:** PostgreSQL with a nice UI
- **Auth:** Built-in user authentication
- **Storage:** File uploads
- **Realtime:** Live updates
- **Edge Functions:** Server-side code

## Putting It Together

### Example: Saving a Recipe

```
1. User fills out recipe form (Frontend)
2. User clicks "Save" (Frontend)
3. Frontend sends POST request to /api/recipes (Frontend → Backend)
4. Backend receives request (Backend)
5. Backend validates the data (Backend)
6. Backend checks user is authenticated (Backend)
7. Backend inserts record into database (Backend → Database)
8. Database confirms save (Database → Backend)
9. Backend returns success response (Backend → Frontend)
10. Frontend shows "Recipe saved!" message (Frontend)
```

### Example: Loading Recipes

```
1. User visits /recipes page (Frontend)
2. Page component requests data (Frontend)
3. Backend receives GET request (Backend)
4. Backend queries database for recipes (Backend → Database)
5. Database returns recipe records (Database → Backend)
6. Backend formats and returns data (Backend → Frontend)
7. Frontend renders recipe cards (Frontend)
```

## Data Fetching Patterns

### Server-Side (at page load)

Data is fetched on the server before the page is sent:

```javascript
// Next.js App Router
async function RecipesPage() {
  const recipes = await db.recipes.findMany();
  return <RecipeList recipes={recipes} />;
}
```

**Good for:** Initial page load, SEO, data that doesn't change often

### Client-Side (after page load)

Data is fetched in the browser after the page loads:

```javascript
function RecipesPage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  return <RecipeList recipes={recipes} />;
}
```

**Good for:** User-specific data, frequently changing data, interactive features

### Hybrid

Most apps use both:
- Server-side for initial data
- Client-side for updates and interactions

## Environment Variables

Secrets and configuration go in environment variables, not code:

```env
# .env.local (never commit this file!)
DATABASE_URL=postgresql://user:password@host:5432/db
SUPABASE_KEY=your-secret-key
```

Access in code:
```javascript
const dbUrl = process.env.DATABASE_URL;
```

**Rules:**
- `.env.local` is for local development
- Add `.env*` to `.gitignore`
- Set production values in your hosting platform (Vercel, Railway, etc.)
- `NEXT_PUBLIC_` prefix exposes to browser (use sparingly)

## Common Patterns

### CRUD Operations

Most apps are variations of Create, Read, Update, Delete:

| Operation | HTTP Method | Example |
|-----------|-------------|---------|
| **Create** | POST | Add new recipe |
| **Read** | GET | View recipe(s) |
| **Update** | PUT/PATCH | Edit recipe |
| **Delete** | DELETE | Remove recipe |

### Optimistic Updates

Update the UI immediately, assuming the server will succeed:

```
1. User clicks "Like"
2. UI immediately shows +1 like (optimistic)
3. Request sent to server
4. If server fails → roll back the UI
```

Makes apps feel faster.

### Loading States

Always show users what's happening:

```
1. User clicks "Save"
2. Button shows spinner, disables
3. Request sent
4. On success: show confirmation
5. On error: show error message, re-enable
```

### Error Handling

Things will fail. Plan for it:

```javascript
try {
  const result = await saveRecipe(data);
  showSuccess('Recipe saved!');
} catch (error) {
  showError('Failed to save. Please try again.');
  console.error(error); // For debugging
}
```

---

**Next:** [Authentication and Authorization](./authentication.md)
