# D3 Dynamic (d3dynamic.com)

Rebuild of the **Dynamic Designs Decor** furnishing-fabrics website, plus a
self-serve admin panel for publishing fabric e-catalogues. Single Next.js app,
Supabase backend, deployed on Vercel.

- **Track 1 — Public site:** the full marketing site (`app/(public)/`) — home,
  about, features, catalogue, blog, contact.
- **Track 2 — Admin panel:** authenticated catalogue + blog management
  (`app/admin/`), feeding the dynamic Curtains / Upholstery / Outdoor Fabric
  pages.

Full plan: [`docs/D3-Dynamic-Website-Project-Plan.md`](docs/D3-Dynamic-Website-Project-Plan.md).
Hero spec: [`docs/D3-Dynamic-Hero-Component-Spec.md`](docs/D3-Dynamic-Hero-Component-Spec.md).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 + shadcn/ui (base-nova) |
| Animation | framer-motion |
| Database / Auth / Storage | Supabase (Postgres) |
| Email | Resend (contact-form notifications, optional) |
| Blog rendering | react-markdown + remark-gfm + @tailwindcss/typography |
| Hosting | Vercel (frontend, auto-deploy on push to `main`), Supabase (backend) |

> Tailwind v4 is CSS-configured in `app/globals.css` — there is **no**
> `tailwind.config.ts`.

## Design system

Warm, editorial, minimal-luxury. Defined as design tokens in `app/globals.css`,
so palette/typography cascade across the site:

- **Palette:** warm neutrals (cream / sand / taupe / espresso) with a brass/gold
  accent (`--gold`). Light theme; warm dark tokens defined for future use.
- **Type:** Cormorant Garamond (serif display) + Manrope (body). Public
  headings render serif via the `.site-editorial` scope; `.eyebrow` is the brass
  uppercase label.

## Prerequisites

Node is managed with **nvm** (installed under `~/.nvm`; loader in `~/.zshrc`).
A fresh terminal has `node` on the PATH; in a non-login shell load it first:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
```

Node 24 LTS. No Homebrew on the dev machine.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Supabase project, then set env vars:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API). Optional:
   `RESEND_API_KEY` / `CONTACT_NOTIFY_FROM` / `CONTACT_NOTIFY_TO` to enable
   contact-form emails.
3. Apply the database. In the Supabase SQL editor, run in order:
   - [`supabase/schema.sql`](supabase/schema.sql) — tables, RLS, storage buckets
   - [`supabase/migrations/0001_contact_messages.sql`](supabase/migrations/0001_contact_messages.sql)
   - [`supabase/migrations/0002_blog.sql`](supabase/migrations/0002_blog.sql)

   (`schema.sql` already folds in the contact + blog tables for a fresh setup.)
4. Seed the taxonomy (sections / features / design types):
   ```bash
   node --env-file=.env.local scripts/seed-taxonomy.mjs
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:3000/
   - Admin panel: http://localhost:3000/admin (create an admin user in
     Supabase → Authentication → Users; there is no public sign-up)

## Project structure

```
app/
  (public)/                Public marketing site (Track 1)
    _components/           Homepage sections (hero, collection, gallery, cta)
    _catalogue/            Shared catalogue section view
    about/ contact/ blogs/ curtains/ upholstery/ outdoor-fabric/ catalogue/
    <feature pages>        pet-friendly / fire-retardant / leather-finish / easy-to-clean
    layout.tsx             Header + footer shell (.site-editorial)
  admin/
    login/                 Supabase Auth sign-in
    (dashboard)/           Auth-gated: catalogue CRUD, blog CRUD, taxonomy
  layout.tsx globals.css   Root layout, fonts, theme tokens
components/
  ui/                      shadcn + vendored components (scroll hero, gallery,
                           marquee, fabric card, …)
  site-header/footer, page-header, catalogue-*, service-page, catalogue-card
lib/
  supabase/                client (anon/RLS), server (cookie auth), admin
                           (service-role), env, database.types
  data/                    admin.ts, public.ts, storage.ts (data access)
  content.ts               company facts, offices, stats, features copy
  email.ts auth.ts slug.ts
proxy.ts                   Session refresh + /admin gate (Next 16 proxy)
supabase/                  schema.sql, migrations/, seed.sql
scripts/                   seed-taxonomy.mjs, demo-entries.mjs (dev)
public/images, public/videos  placeholder media (swap for real assets)
docs/                      project plan & component specs
```

## Public site

Homepage sections: scroll-expansion **hero** (video), animated **marquee
collection**, interactive **bento gallery**, brand intro, **fabric category
cards**, impact **stats**, animated rotating-word **CTA**. Plus About, four
Feature pages, Blog, Contact, and the dynamic catalogue pages (`/curtains`,
`/upholstery`, `/outdoor-fabric`, `/catalogue`) with section-scoped design-type
filters. Legacy `.html` URLs 301-redirect to the new slugs (`next.config.ts`).

## Admin panel

Supabase-Auth login gating `/admin`. Manage the catalogue (create/edit/publish/
delete entries with thumbnail + PDF upload, live preview), the blog (Markdown
posts with cover images, draft/publish), and taxonomy (sections / features /
design types, with inline "add new"). Writes use the service-role client;
public reads respect RLS.

> Placeholder media (hero video, gallery/teaser/about images) lives under
> `public/`. Swap for real photography — no code change needed.

## Status

Phases 0–3 complete and deployed on Vercel: foundation, admin panel, dynamic
catalogue pages, the full public site, and the visual design pass.

Outstanding inputs: real photography/hero video, Facebook + Pinterest URLs,
Resend key for contact emails, and migrating existing catalogue PDFs/thumbnails
as seed data. Remaining: custom-domain cutover (`d3dynamic.com`) and final QA.
