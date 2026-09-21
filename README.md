# D3 Dynamic (d3dynamic.com)

Rebuild of the Dynamic Designs Decor furnishing-fabrics website, plus a
self-serve admin panel for publishing fabric e-catalogues. Single Next.js app,
Supabase backend.

- **Track 1 — Public site:** rebuild of all pages from d3dynamic.com (`app/(public)/`).
- **Track 2 — Admin panel:** authenticated catalogue management (`app/admin/`),
  feeding the dynamic Curtains / Upholstery / Outdoor Fabric pages.

Full plan: [`docs/D3-Dynamic-Website-Project-Plan.md`](docs/D3-Dynamic-Website-Project-Plan.md).
Homepage hero spec: [`docs/D3-Dynamic-Hero-Component-Spec.md`](docs/D3-Dynamic-Hero-Component-Spec.md).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database / Auth / Storage | Supabase (Postgres) |
| Hosting | Vercel (frontend), Supabase (backend) |

> Note: Tailwind v4 is CSS-configured (`app/globals.css`), there is no
> `tailwind.config.ts`.

## Prerequisites

Node is managed with **nvm** (installed under `~/.nvm`; loader is in `~/.zshrc`).
A fresh terminal has `node` on the PATH. In a non-login shell, load it first:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
```

This project uses Node 24 LTS.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project, then copy env vars:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` from Supabase → Project Settings → API.
3. Apply the schema: run [`supabase/schema.sql`](supabase/schema.sql) in the
   Supabase SQL editor (creates tables, RLS policies, and storage buckets).
4. Run the dev server:
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:3000/
   - Admin panel: http://localhost:3000/admin

## Project structure

```
app/
  (public)/        Public marketing site (Track 1)
  admin/           Authenticated admin panel (Track 2)
  layout.tsx       Root layout, fonts, global metadata
  globals.css      Tailwind v4 + theme tokens
components/ui/      shadcn components (+ vendored UI like the hero)
lib/
  supabase/        Data layer
    client.ts      Browser client (anon key, RLS)
    server.ts      Server client (cookie-based auth, RLS)
    admin.ts       Service-role client (server-only, bypasses RLS)
    env.ts         Validated env accessors
    database.types.ts  Typed schema (regenerate from Supabase later)
supabase/schema.sql   DDL: tables, RLS, storage buckets
docs/              Project plan & component specs
```

## Build phases

See the project plan for detail. Current status: **Phase 0 (foundation) complete.**
Next: Phase 1 (admin panel) — login, taxonomy management, catalogue CRUD, uploads.
