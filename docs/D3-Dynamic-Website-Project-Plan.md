# D3 Dynamic (d3dynamic.com) — Website Rebuild & Admin Panel

**Project plan — for implementation in Claude Code**
Prepared: 21 Sep 2026

---

## 1. Project Overview

D3 Dynamic (Dynamic Designs Decor) is a furnishing-fabrics company with an existing static site at d3dynamic.com. This project rebuilds the site and adds a self-serve admin panel so non-technical staff can publish new fabric e-catalogues (PDF + thumbnail) without a developer touching code.

Two tracks, built together as one codebase:

- **Track 1 — Public website rebuild:** new front-end for all existing pages, styled from designs Shevam is creating in Stitch (to be provided separately).
- **Track 2 — Admin panel:** authenticated internal web app for managing catalogue entries, which the public "Discover" pages (Curtains / Upholstery / Outdoor Fabric) read from live.

---

## 2. Current Site — Reference Sitemap

Captured from the live site (d3dynamic.com). Rebuild should preserve URLs/slugs and existing SEO metadata (titles, meta descriptions) unless redesign requires otherwise.

| Page | Current URL | Notes |
|---|---|---|
| Home | `/` | Hero slider, about blurb, product teasers, stats (1800+ customers, 4+ yrs, 3500+ fabric collections, 3 offices) |
| About Us | `/about.html` | Company history (founded Dubai 2019 as Dynamic Fabrics FZCO; India entity 2021) |
| Pet Friendly Fabric | `/pet-friendly-fabric-for-sofa.html` | Services sub-page |
| Fire Retardant Fabric | `/fire-retardant-fabric-suppliers.html` | Services sub-page |
| Leather Finish Sofa Cloth | `/leather-finish-sofa-cloth.html` | Services sub-page |
| Easy to Clean Fabrics | `/easy-to-clean-furniture-fabric.html` | Services sub-page |
| **Curtains** | `/curtains.html` | **Catalogue page — becomes data-driven (Track 2)** |
| **Upholstery** | `/upholstery.html` | **Catalogue page — becomes data-driven (Track 2)** |
| **Outdoor Fabric** | `/outdoor-fabric.html` | **Catalogue page — becomes data-driven (Track 2)** |
| Blogs | `/blogs/` | Blog listing |
| Contact Us | `/contact-us.html` | Contact form + address (Bhiwandi, Maharashtra) |

Note: the four "Services" pages map directly onto the **Feature** taxonomy used in the admin panel (Pet Friendly, Fire Retardant, Leather Finish, Easy to Clean) — a possible future enhancement is pulling matching catalogue entries into those pages too (out of scope for v1 unless requested).

---

## 3. Track 1 — Public Website Rebuild

**Status: blocked on design.** Shevam is designing pages in Stitch; visual design, layout, and component styling will be provided separately and applied on top of the structure below. This track should not block Track 2 (see §6 phasing).

### Scope
- Rebuild all pages listed in §2 as components/pages in the new stack.
- Carry over existing copy, metadata (title, meta description), and image/content assets from the live site.
- Replace the three hardcoded catalogue pages (Curtains/Upholstery/Outdoor Fabric) with the dynamic, database-driven version described in §5.
- Preserve URL slugs for SEO continuity, or set up 301 redirects if slugs change.
- Contact form should submit to a working backend (email or DB) — confirm desired handling.
- Responsive, mobile-first build (current site is used for organic search traffic).

### Not yet decided (flag for Shevam)
- Final design system/component library — driven by Stitch output once ready.
- Whether Blog stays as-is, migrates into the new stack as a CMS-backed section, or is deferred to a later phase.

---

## 4. Track 2 — Admin Panel (Web App)

### 4.1 Purpose
Let non-technical staff add, edit, and remove fabric e-catalogue entries (PDF + thumbnail) for the Curtains, Upholstery, and Outdoor Fabric pages, with zero code changes.

### 4.2 Confirmed feature spec

**Add/Edit entry form:**
1. **Section / Product type** — dropdown (Curtains, Upholstery, Outdoor Fabric, ...) + "Add new" inline
2. **Feature** — dropdown (Pet Friendly, Fire Retardant, Leather Finish, Easy to Clean, None, ...) + "Add new" inline
3. **Design type** — dropdown (Plain, Textured, Floral, Abstract, Damask, Geometric, Leaves, Paisley, Stripes & Checks, ...) + "Add new" inline
4. **Collection name** — text field
5. **Thumbnail image** — file upload
6. **PDF e-catalogue** — file upload
7. **Preview** — shows the card exactly as it will render on the public page, before publishing
8. **Publish to site** — commits the entry; appears live immediately
9. **Existing entries list** — table/list with **Modify** and **Delete** per entry

**Public catalogue page behavior:**
- Section tabs (All / Curtains / Upholstery / Outdoor Fabric)
- Design-type filter pills **scoped to the active section** — i.e. only design types that actually exist within that section are shown as filter options, and switching section resets the design filter to "All"
- Grid of collection cards (thumbnail + name), each linking to its PDF

### 4.3 Data model (proposed — Postgres/Supabase)

```sql
create table sections (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int default 0
);

create table features (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table design_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table catalogue_entries (
  id uuid primary key default gen_random_uuid(),
  collection_name text not null,
  section_id uuid references sections(id) not null,
  feature_id uuid references features(id),
  design_type_id uuid references design_types(id) not null,
  thumbnail_url text not null,
  pdf_url text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Public page query pattern: `select * from catalogue_entries where section_id = :section and is_active = true` — design-type filter options for the pills are the **distinct `design_type_id`s present within that result set**, not the global `design_types` table (this is what makes the filter section-scoped, per §4.2).

### 4.4 Admin auth
- Single admin role is sufficient for v1 (no multi-user roles requested).
- Email/password login via Supabase Auth, gating the `/admin` route.
- Session-based; no public sign-up.

### 4.5 File storage
- Supabase Storage bucket(s) for `thumbnails/` and `catalogues/` (PDFs).
- On upload: validate file type (image/* for thumbnail, application/pdf for catalogue) and a reasonable size cap (recommend 20–25MB per PDF to start; confirm against real catalogue file sizes).

---

## 5. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | Next.js (React) | SSR/SSG for SEO continuity, fast, works cleanly with Claude Code |
| Database | Supabase (Postgres) | Managed, generous free tier, works well for this scale |
| File storage | Supabase Storage | Same platform as DB, simple signed-URL access |
| Auth | Supabase Auth | Handles admin login without building auth from scratch |
| Hosting (frontend) | Vercel | Zero-config Next.js deploys, previews per branch |
| Hosting (backend) | Supabase (managed) | No server to maintain |

---

## 6. Build Phases

**Phase 0 — Foundation**
- Scaffold Next.js project, repo structure, CI/deploy pipeline (Vercel)
- Provision Supabase project; create tables in §4.3; set up storage buckets + auth

**Phase 1 — Admin panel (can start immediately, not blocked on design)**
- Admin login
- Section / Feature / Design-type management (incl. "add new" inline creation)
- Catalogue entry CRUD: add, preview, publish, modify, delete
- File upload handling (thumbnail + PDF) to Supabase Storage

**Phase 2 — Dynamic public catalogue pages**
- Curtains / Upholstery / Outdoor Fabric pages rebuilt to read from `catalogue_entries`
- Section-scoped design-type filter pills
- Migrate existing live catalogue PDFs/thumbnails into the new system as seed data

**Phase 3 — Rest of public site**
- Home, About, 4x Services pages, Blog, Contact — rebuilt against Stitch designs once delivered
- Apply final design system across Phase 1/2 pages too (admin panel can stay utilitarian/unstyled-priority, public pages need full design pass)

**Phase 4 — QA, SEO, cutover**
- Metadata parity check against current live pages
- 301 redirects for any changed slugs
- Cross-device/browser QA
- DNS/domain cutover

---

## 7. Open Items / Inputs Needed From Shevam

- [ ] Stitch designs for public pages (blocking Phase 3, not Phases 0–2)
- [ ] Confirm whether current hosting/domain registrar can be reused or needs migration
- [ ] Existing catalogue PDF/thumbnail library — location/format for migration into Phase 2 seed data
- [ ] Contact form destination (email inbox? CRM? just store in DB?)
- [ ] Decision on Blog: keep/replace/defer
- [ ] Confirm max PDF file size expected (largest current e-catalogue) to size storage limits correctly
- [ ] Any additional admin users beyond a single login, and whether role separation is ever needed

---

## 8. Notes for Claude Code

- Repo suggestion: single Next.js app, with `/app/(public)/...` for the public site and `/app/admin/...` for the admin panel, sharing the same Supabase client/data layer.
- Environment variables needed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-side only, for admin writes).
- Start with Phase 0 + Phase 1 (admin panel) since it has zero design dependency — this lets staff start using the upload flow well before the public redesign ships.
- Phase 2's public catalogue pages can launch with placeholder/utility styling first, then receive the final design pass in Phase 3 once Stitch output is ready — avoids blocking the self-serve upload capability on design timelines.
- When Stitch designs are provided, treat them as the source of truth for layout/visual styling only — data model, routes, and admin panel logic in this document stay as specified unless Shevam says otherwise.
