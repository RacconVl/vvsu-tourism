---
name: Auth 304 cache bug
description: Why session-based auth showed "login required" after successful login, and the correct fix
---

## The rules

### 1. customFetch must use `cache: "no-store"`

In `lib/api-client-react/src/custom-fetch.ts`, the fetch call must have `cache: "no-store"` as the first option:

```ts
const response = await fetch(input, { cache: "no-store", ...init, method, headers });
```

**Why:** Without this, the browser caches GET /api/auth/me with an ETag. After login, the browser sends `If-None-Match` → server returns 304 → `customFetch` sees 304 in `NO_BODY_STATUS` and returns `null` → auth state broken.

### 2. After login/register — use `setQueryData`, NOT `removeQueries`

In login.tsx and register.tsx, on mutation success:

```ts
onSuccess: (userData) => {
  qc.setQueryData(getGetMeQueryKey(), { user: userData });
  setLocation("/cabinet");
}
```

**Why:** `removeQueries` deletes the cache entry but does NOT trigger a refetch of active TanStack Query observers (like `useGetMe()` in AuthProvider). The observer just sees `{ data: undefined, isLoading: false }` → `user = null` → RequireAuth shows "Требуется вход". No GET /api/auth/me is ever fired after removeQueries. `setQueryData` writes directly into the cache and instantly notifies all observers — `user` is set before the navigation even happens.

**How to apply:** Any time a mutation changes the auth state (login, register, logout), use `setQueryData` (or `removeQueries` only for logout where you want `null`). Never use `removeQueries` expecting it to trigger a refetch.

### 3. Server-side hardening

Add `Cache-Control: no-store, no-cache, must-revalidate` to GET /api/auth/me to prevent the browser from caching unauthenticated responses in the first place.

## Login/logout response shapes

- `login()` → `AuthUser` (direct object, no wrapper)
- `register()` → `AuthUser` (direct object, no wrapper)  
- `getMe()` cache shape → `{ user: AuthUser | null }`

So on login success: `qc.setQueryData(getGetMeQueryKey(), { user: userData })`
On logout success: `qc.setQueryData(getGetMeQueryKey(), { user: null })`
