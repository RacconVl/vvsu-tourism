---
name: Auth 304 cache bug
description: Why session-based auth showed "login required" after successful login, and how it was fixed
---

## The rule

`customFetch` (`lib/api-client-react/src/custom-fetch.ts`) must pass `cache: "no-store"` as the first option to `fetch()`:

```ts
const response = await fetch(input, { cache: "no-store", ...init, method, headers });
```

**Why:** Without this, the browser caches GET /api/auth/me with an ETag. After login, the browser sends `If-None-Match` → server returns 304 → `customFetch` sees 304 in `NO_BODY_STATUS` and returns `null` → TanStack Query resolves `useGetMe` with `null` → `RequireAuth` shows "Требуется вход" even though the user is authenticated.

**How to apply:** Any time session cookies are used for auth and you see "requires login" after a successful login/register flow, check that `customFetch` has `cache: "no-store"`. Also ensure login/register handlers call `qc.removeQueries({ queryKey: getGetMeQueryKey() })` before navigating so TanStack Query re-fetches fresh data.

Server-side hardening: also add `res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate")` to the GET /api/auth/me route — this prevents the browser from caching the response in the first place.
