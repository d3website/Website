@AGENTS.md

# D3 Dynamic — project notes

Rebuild of d3dynamic.com (furnishing fabrics) + a self-serve admin panel for
publishing fabric e-catalogues. See `docs/` for the full plan and specs, and
`README.md` for setup.

## Environment gotcha (important)

Node is installed via **nvm** at `~/.nvm`; the loader lives in `~/.zshrc`. A
plain non-login shell will NOT have `node`/`npm` on PATH. Before any npm/node
command in such a shell, run:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
```

Node 24 LTS. There is no Homebrew on this machine.

## Stack facts

- Next.js 16 (App Router), React 19, TypeScript.
- Tailwind **v4** — configured in `app/globals.css`, there is NO
  `tailwind.config.ts`. shadcn/ui (style: base-nova, base color: neutral).
- Supabase for DB/Auth/Storage. Data layer in `lib/supabase/`:
  - `client.ts` browser (anon), `server.ts` server (cookie auth), both respect RLS.
  - `admin.ts` service-role, `server-only`, bypasses RLS — server writes only.
- `@/*` import alias → repo root.

## Layout

- `app/(public)/` — public site (Track 1). `app/admin/` — admin panel (Track 2).
- Public catalogue pages read from `catalogue_entries`; design-type filter pills
  are **section-scoped** (distinct design types within the active section only).

## Status

Phase 0 (foundation) done. Phase 1 = admin panel (login, taxonomy CRUD,
catalogue CRUD, uploads). Public pages (incl. the scroll-expansion hero) are
Phase 3, blocked on Stitch designs.
