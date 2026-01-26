# Authentication and Authorization

How users log in and what they're allowed to do.

## The Difference

**Authentication** = "Who are you?"
- Proving your identity
- Logging in with email/password
- Signing in with Google

**Authorization** = "What can you do?"
- Checking permissions
- Can this user edit this post?
- Is this user an admin?

You need both. Authentication without authorization means anyone who logs in can do anything.

## How Authentication Works

### The Flow

```
1. User enters email + password
2. Server checks credentials against database
3. If valid → server creates a session/token
4. Session/token sent to browser
5. Browser stores it (cookie or storage)
6. Every future request includes the token
7. Server validates token on each request
```

### Sessions vs Tokens

**Sessions:**
- Server stores session data
- Browser gets a session ID (cookie)
- Server looks up session on each request

**Tokens (JWT):**
- Token contains user info (signed/encrypted)
- Server doesn't store anything
- Server validates the signature on each request

Most auth services use tokens. You don't need to worry about the details.

## Auth Services

Don't build authentication yourself. Use a service:

| Service | Included In | Good For |
|---------|-------------|----------|
| **Supabase Auth** | Supabase | Already using Supabase |
| **Clerk** | Standalone | Great UI, many features |
| **Auth.js** | Next.js | Flexible, many providers |
| **Firebase Auth** | Firebase | Already using Firebase |

These handle:
- Secure password storage
- Email verification
- Password reset
- Social logins (Google, GitHub, etc.)
- Session management

## Basic Implementation

### With Supabase

**Sign up:**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
});
```

**Log in:**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});
```

**Log out:**
```javascript
await supabase.auth.signOut();
```

**Check if logged in:**
```javascript
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  // User is logged in
}
```

### Social Login (OAuth)

Let users sign in with Google, GitHub, etc.:

```javascript
await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

The service handles the entire flow—you just call one function.

## Protecting Pages

### Client-Side (Not Enough Alone)

Check auth in your component:

```javascript
function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Redirect to="/login" />;

  return <Dashboard />;
}
```

**Problem:** This only hides the UI. The page still loads. A clever user could bypass it.

### Server-Side (Required)

Check auth before the page renders:

```javascript
// Next.js App Router
async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <Dashboard user={user} />;
}
```

**This is secure.** The page never renders for unauthorized users.

### Middleware (Best for Many Pages)

Check auth before any route:

```javascript
// middleware.ts
export function middleware(request) {
  const user = getUser(request);

  if (!user && request.url.startsWith('/dashboard')) {
    return redirect('/login');
  }
}
```

Runs on every matching request.

## Protecting API Routes

**Always check auth in API routes:**

```javascript
// /api/recipes/route.ts
export async function POST(request) {
  const user = await getUser();

  if (!user) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // User is authenticated, proceed...
}
```

Never trust that the frontend already checked. Anyone can call your API directly.

## Authorization Patterns

### Role-Based Access

Users have roles (admin, member, guest):

```javascript
const user = await getUser();

if (user.role !== 'admin') {
  return Response.json(
    { error: 'Admin access required' },
    { status: 403 }
  );
}
```

### Resource-Based Access

Users own specific resources:

```javascript
const recipe = await db.recipes.findById(recipeId);

if (recipe.userId !== user.id) {
  return Response.json(
    { error: 'Not your recipe' },
    { status: 403 }
  );
}
```

### Row Level Security (Supabase)

Database-level protection. Even if your code has bugs, unauthorized queries fail:

```sql
-- Users can only see their own recipes
CREATE POLICY "Users see own recipes" ON recipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own recipes
CREATE POLICY "Users update own recipes" ON recipes
  FOR UPDATE
  USING (auth.uid() = user_id);
```

**Always enable RLS on Supabase tables with user data.**

## Common Patterns

### Auth State in React

Track user state across your app:

```javascript
// AuthContext.js
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

Use anywhere:
```javascript
const { user, loading } = useAuth();
```

### Protected Route Component

Reusable wrapper for protected pages:

```javascript
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;

  return children;
}

// Usage
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Login Redirect

Remember where the user wanted to go:

```javascript
// When redirecting to login
redirect(`/login?returnTo=${currentPath}`);

// After successful login
const returnTo = searchParams.get('returnTo') || '/dashboard';
redirect(returnTo);
```

## Security Checklist

### Do These Things

- [ ] Use a proven auth service (not custom)
- [ ] Check auth on the server for protected routes
- [ ] Check auth in every API endpoint that needs it
- [ ] Enable Row Level Security on database tables
- [ ] Use HTTPS everywhere
- [ ] Hash passwords (auth services do this)
- [ ] Validate email before allowing sensitive actions

### Never Do These Things

- [ ] Store passwords in plain text
- [ ] Check auth only on the client
- [ ] Trust user IDs from the frontend
- [ ] Expose user data in URLs unnecessarily
- [ ] Skip auth checks "for testing"
- [ ] Use the same token for all users

## Error Messages

### What to Show Users

Be helpful but not too specific:

```
Good: "Invalid email or password"
Bad:  "No user found with that email"  ← Reveals valid emails

Good: "Something went wrong. Please try again."
Bad:  "Database connection failed"  ← Reveals implementation
```

### What to Log (Server-Side)

Log detailed errors for debugging:

```javascript
console.error('Login failed:', {
  email: email,
  errorCode: error.code,
  timestamp: new Date()
});
```

But don't send these details to the user.

---

**Next:** [GitHub and Version Control](./version-control.md)
