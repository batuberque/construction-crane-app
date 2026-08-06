# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing/portfolio site for a Turkish construction crane company, with an admin panel for managing projects. Three Docker services: React/Vite frontend (`:8080`), Express/Mongoose backend (`:3005`), MongoDB (host `:37017` → container `27017`). Code comments, UI copy and API error messages are largely in Turkish — keep that convention.

## Commands

Development runs through Docker Compose from the repo root (the frontend service uses `dev.Dockerfile`, i.e. the Vite dev server):

```bash
docker-compose up --build     # start all three services (hot reload via bind mounts)
docker-compose logs -f backend
docker-compose down
```

`docker-compose.yml` mounts `./backend/gloud.json:/app/gloud.json` — a Google Cloud service-account key that is not in the repo. Without it, remove that volume line or the backend container will not start.

**Production frontend image** (`frontend/Dockerfile`) is separate: it builds a static bundle and serves it from `nginx:alpine`. `VITE_*` values are inlined at *build* time, so they must be passed as build args — setting them as Cloud Run runtime env vars does nothing. The build fails loudly if the backend URL is missing:

```bash
docker build -t frontend-prod \
  --build-arg VITE_REACT_APP_BACKEND_URL=https://api.example.com \
  --build-arg VITE_CAPTCHA_KEY=... ./frontend
```

nginx renders `frontend/nginx.conf.template` through the base image's `envsubst` entrypoint, so it listens on Cloud Run's `$PORT` with no custom entrypoint. That config owns the SPA fallback, gzip, and the `immutable` cache header on `/assets/*` — the latter is only safe because everything Vite emits there is content-hashed, so **never put unhashed files under `/assets/`** (unhashed public assets live at the root: `/favicon.png`, `/hero-*.webp`, `/fonts/*`).

Frontend (from `frontend/`, requires `npm install` locally):

```bash
npm run dev        # vite on :8080
npm run build
npm run lint       # eslint --quiet over src
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write
```

Backend (from `backend/`): `npm start` → `node --watch .bin/www`.

**There is no test suite and no test runner configured** in either package. Don't claim tests pass; verify by exercising the running app.

## Environment

`frontend/.env` and `backend/.env` are gitignored and required. Frontend: `VITE_REACT_APP_BACKEND_URL`, `VITE_CAPTCHA_KEY`. Backend: `MONGODB_CONNECTION_STRING`, `JWT_TOKEN`, `USERNAME`, `PASSWORD`, `ROLE`, `FRONTEND_DOMAIN`, `REAL_DOMAIN` (both CORS origins), `RECAPTCHA_SECRET_KEY`, `TARGET_EMAIL`, `TARGET_EMAIL_PASS`, `GCLOUD_KEY_FILE`, `GCLOUD_STORAGE_BUCKET`.

Note `backend/index.js` calls `require("dotenv").config()` *after* requiring `mongoose-connection` and `fileSync`, so those two modules read `process.env` before the `.env` file is parsed. It works in Docker only because Compose injects env vars via `env_file`. Anything that must work outside Docker has to load its config later, or the require order needs fixing.

## Backend architecture

`.bin/www` (listen) → `index.js` (app + middleware) → `routes/*` → `services/*` → `models/*`.

- **Services** — `services/base-service.js` is a thin CRUD wrapper over a Mongoose model; `project-service.js` extends it and is exported as a *singleton instance* (`new ProjectService(Project)`), re-exported from `services/index.js`. New collections should follow the same pattern rather than calling models from routes.
- **Auth** — `lib/auth.js` exports `generateToken` and an `authenticateToken` middleware. `routes/auth.js` compares credentials directly against `USERNAME`/`PASSWORD` env vars; there is no user collection. Be aware that `authenticateToken` is currently **not applied to any route** — the project write endpoints are open. Adding it to `routes/project.js` is the intended fix if auth work comes up.
- **Contact** — `routes/contact.js` keeps submissions in a module-level in-memory array (lost on restart) and emails them via `lib/email`. reCAPTCHA is verified by the `verifyRecaptcha` middleware on POST only.

### Image pipeline (the non-obvious part)

Uploads go through three places and the path prefixes differ at each hop:

1. `lib/multerConfig.js` writes to local `uploads/` (jpg/png/jpeg only); `file.path` — e.g. `uploads/images-1705063864626.png` — is what gets stored in the Mongo `images` array.
2. `fileSync.js` is a chokidar watcher on `uploads/` that mirrors add/unlink to GCS at `uploads/<basename>`. It's started by a bare `require` in `index.js` — nothing calls it explicitly.
3. The frontend never reads `/uploads` from the backend; it builds URLs against the hardcoded `imageBaseURL` in `frontend/src/services/queries.ts` (`https://storage.googleapis.com/vinc-key-images`). **That bucket name must match `GCLOUD_STORAGE_BUCKET`.**

Image deletion is where the prefixes collide: `DELETE /project/:id/images/*` prepends `uploads/` to the wildcard, so the incoming `uploads/foo.png` becomes `uploads/uploads/foo.png`; `project-service.js` then strips the doubled prefix for the DB `$pull` and strips the leading `uploads/` again for the GCS delete. Changing any one of these three strings breaks the other two.

## Frontend architecture

- `src/App.tsx` is the entry point (not `main.tsx`) and `vite.config.js` sets `root: 'src'`, so `index.html` lives in `src/`. `publicDir` is pinned to `frontend/public` because the default would resolve to the non-existent `src/public`.
- **Routing** — `components/AnimatedRouter.tsx` owns all routes. `Home` and the shell (`NavBar`/`Footer`) are **eager on purpose**: `AnimatedRouter` contains the `lazy()` calls, so lazying it too meant none of them could be discovered until its own chunk executed. Every other page is lazy behind a single `<Suspense>`. Route chunks are declared once in the exported `pageImports` map, which `NavBar` reuses to prefetch on hover/focus.
- **Page transitions are CSS**, not a library — a `.page-enter` animation keyed on `location.pathname`. framer-motion was removed; it cost ~34 KB gzip on the critical path for one fade and its `mode="wait"` delayed every incoming page.
- **Design system** — `src/index.css` defines the tokens. The site is **uniformly dark**: graphite page, steel raised, hazard yellow as the single accent (used only on load-bearing points: active nav, primary CTA, section eyebrows, service icons, focus ring). `lib/ui/Page.tsx` owns the surface and the fixed-nav offset — pages must not hand-roll a top margin.
- **Grids use borders on the cells, never `gap-px` over a coloured parent.** The pattern is `ul: grid border-l border-t` + `li: border-b border-r`. The parent-background trick paints empty filler blocks whenever the item count isn't a multiple of the column count (7 services in 3 columns, 14 logos in 4, and any dynamic project count).
- **Reference logos sit on a light plate** (`bg-signal`). Measured: most are dark artwork on transparency and are invisible directly on graphite; polarity is mixed across the set, so inverting them is not an option.
- **Type** — Archivo (variable, display+body) and IBM Plex Mono (the `.spec` class: uppercase technical data only, never prose), self-hosted from `public/fonts` with `latin` + `latin-ext` subsets. Turkish needs both — `ı` is in latin, `İ/ş/ğ` in latin-ext — and `<html lang="tr">` is what makes CSS `uppercase` produce `İNŞAAT` rather than `INŞAAT`. Don't drop that attribute.
- **Signature element** — `lib/ui/RadiusArcs.tsx`, concentric arcs from a crane's working-radius diagram. Its hairlines default to translucent white because they sit over photography; a solid token colour disappears into the dark half of the image.
- **Auth on the client** — `Login.tsx` writes `token` and a hardcoded `role: 'editor'` to `localStorage`; `ProtectedRouter.tsx` gates `/admin` on both. This is a UI convenience, not a security boundary — localStorage is user-writable and the API does not enforce anything either.
- **Data layer** — `services/queries.ts` holds all API functions and the shared `IProject`/`Email` types. Query keys are `['projects']` (list, shared by `Project.tsx` and `AdminPanel`) and `['projects', id]` (detail, seeded from the list cache via `initialData` so navigating from the grid renders with no spinner). Mutations invalidate `['projects']`.
- **No global state library.** zustand was removed — login fields, the slider index, and contact form state are local `useState`; static config lives in `lib/site.ts` (contact details, the reference list, nav links) and `lib/services.ts`.
- Icons come from **one** pack, `react-icons/tb`. The old code pulled 10 icons from 6 different barrels via an `IconUtils` switch.
- Use relative imports. The unused Vite path aliases were deleted.

### Known issue, deliberately not fixed

`PUT /project/:id` replaces the whole `images` array whenever files are attached (`backend/routes/project.js:41-44` — `{...req.body, images}`), so editing a project with new images orphans the existing ones. This cannot be worked around from the client; `ProjectModal` warns the user before saving instead. Fixing it properly needs a backend change.

`frontend/README.md` is a leftover Create React App template and is inaccurate — this project is Vite.
