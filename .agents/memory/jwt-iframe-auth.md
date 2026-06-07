---
name: JWT auth in Replit iframe
description: Why session cookies don't work in Replit preview and how JWT localStorage solves it.
---

Session cookies fail in Replit's canvas/preview iframe because the proxy doesn't consistently forward `X-Forwarded-Proto: https`, so `express-session` with `secure: true` never sends Set-Cookie. Even without `secure`, cross-origin iframe cookie policies block them.

**Solution:** JWT tokens stored in `localStorage`.
- Server: `signJwt(userId)` / `verifyJwt(token)` via `jsonwebtoken` using `SESSION_SECRET` env var. `loadUser` middleware checks `Authorization: Bearer <token>` first, then falls back to session cookie.
- Client: on login/register success, store `token` in `localStorage("vvsu_auth_token")` and call `setAuthTokenGetter(() => localStorage.getItem("vvsu_auth_token"))`. On logout, `localStorage.removeItem("vvsu_auth_token")` + `setAuthTokenGetter(null)`.
- App startup: call `setAuthTokenGetter(() => localStorage.getItem("vvsu_auth_token"))` in `App.tsx` before render so refreshes are authenticated.
- `setAuthTokenGetter` is exported from `@workspace/api-client-react` and wires into the `customFetch` interceptor.

**Why:** Cookie-based sessions are unreliable in Replit's proxied iframe environment. JWT in localStorage with Bearer headers always works regardless of proxy or iframe context.

**How to apply:** Any new protected API route already works via the `loadUser` middleware. No additional changes needed for new routes.
