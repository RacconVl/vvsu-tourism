# ВВГУ — Институт туризма и креативных индустрий

Immersive educational web platform for VVSU (Vladivostok State University) Institute of Tourism and Creative Industries. Full Russian-language UI with gamification, interactive map, narrative learning journey, and marine color palette.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/vvsu-tourism run dev` — run the frontend (Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + TanStack Query + Framer Motion + Tailwind v4 + shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for ALL API contracts
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (don't edit manually)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (don't edit manually)
- `lib/db/src/schema/` — Drizzle ORM table definitions
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/vvsu-tourism/src/pages/` — React page components
- `artifacts/vvsu-tourism/src/index.css` — VVSU theme (colors, dark mode, fonts)

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → Zod validators (server) + React Query hooks (client)
- `lib/api-zod/src/index.ts` must export ONLY `export * from "./generated/api"` — do NOT add `./generated/types` re-export, codegen will break
- Dark/light mode via `.dark` class on `<html>` root, stored in localStorage, toggled from Navbar
- All DB tables use snake_case columns; Drizzle auto-maps to camelCase in TypeScript
- Proxy routes: API at `/api/*`, frontend at `/`

## Product

- **Dashboard** — XP/level tracking, narrative journey map (5 stages from "Port of Departure" to "Pacific Horizon"), recent activity, deadlines, mini-leaderboard
- **Courses** (6 total) — tourism intro, marketing, route development, design, ecotourism, gastronomy. Each has modules with type (video/interactive/animation/test), duration, XP reward
- **Quests** — 6 practical assignments tied to real Vladivostok locations; filter by type; submit answers via dialog
- **Interactive Map** — SVG map of Vladivostok with clickable point markers, legend popups with local legends/folklore, tourist routes tab
- **Achievements** — 8 badges (3 unlocked); categorized by exploration/learning/social/mastery
- **Community** — forum posts + gallery of student works; create new posts
- **Library** — educational resources (video, infographic, presentation, database) with filter
- **Leaderboard** — 8 students with podium display for top 3, XP/level/quests stats

## Colors & Design

- Primary navy: `#172E46` (HSL 210 50% 18%)
- Royal blue: `#033F7E` (HSL 211 95% 25%)
- Accent orange: `#EB7124` (HSL 23 83% 53%)
- Font: IBM Plex Sans
- Border radius: 1rem (16px) throughout
- Dark mode: deep navy background (#0d1a25 equiv)

## User preferences

- Russian-language UI throughout
- Marine/nautical gamification theme (journey stages named after sea locations)
- 16px border radius on cards
- IBM Plex Sans font

## Gotchas

- Do NOT run `pnpm dev` at workspace root — use workflows or `--filter`
- After running codegen, `lib/api-zod/src/index.ts` is NOT overwritten — keep it as single export
- Modules table uses `"order"` (quoted) in SQL because `order` is a reserved keyword
- The `point_ids` column in `tourist_routes` is a text array in Postgres

## Pointers

- See `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Run `pnpm --filter @workspace/db run push` after schema changes before starting API server
