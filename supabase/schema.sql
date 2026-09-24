-- D3 Dynamic — catalogue schema (Project Plan §4.3)
-- Run in the Supabase SQL editor (or via `supabase db push`) after creating the
-- project. Idempotent-ish: safe to re-run in a fresh project.

-- ---------------------------------------------------------------------------
-- Taxonomy tables
-- ---------------------------------------------------------------------------
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int default 0,
  hero_image_url text
);

create table if not exists features (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists design_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- ---------------------------------------------------------------------------
-- Catalogue entries
-- ---------------------------------------------------------------------------
create table if not exists catalogue_entries (
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

create index if not exists catalogue_entries_section_idx
  on catalogue_entries (section_id);
create index if not exists catalogue_entries_active_idx
  on catalogue_entries (is_active);

-- keep updated_at fresh on modify
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists catalogue_entries_set_updated_at on catalogue_entries;
create trigger catalogue_entries_set_updated_at
  before update on catalogue_entries
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--   Public site reads active entries + all taxonomy (anon).
--   Writes are performed server-side with the service-role key, which bypasses
--   RLS, so no write policies are defined here.
-- ---------------------------------------------------------------------------
alter table sections enable row level security;
alter table features enable row level security;
alter table design_types enable row level security;
alter table catalogue_entries enable row level security;

drop policy if exists "public read sections" on sections;
create policy "public read sections" on sections
  for select using (true);

drop policy if exists "public read features" on features;
create policy "public read features" on features
  for select using (true);

drop policy if exists "public read design_types" on design_types;
create policy "public read design_types" on design_types
  for select using (true);

drop policy if exists "public read active entries" on catalogue_entries;
create policy "public read active entries" on catalogue_entries
  for select using (is_active = true);

-- ---------------------------------------------------------------------------
-- Storage buckets (Project Plan §4.5)
--   Run these too, or create the buckets in the Storage UI.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('thumbnails', 'thumbnails', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('catalogues', 'catalogues', true)
  on conflict (id) do nothing;

-- Public read for both buckets; uploads happen server-side via service role.
drop policy if exists "public read thumbnails" on storage.objects;
create policy "public read thumbnails" on storage.objects
  for select using (bucket_id = 'thumbnails');

drop policy if exists "public read catalogues" on storage.objects;
create policy "public read catalogues" on storage.objects
  for select using (bucket_id = 'catalogues');

-- ---------------------------------------------------------------------------
-- Contact form submissions (Track 1, Phase 3)
--   Written server-side via service role; read only by admin. Not public.
-- ---------------------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

-- ---------------------------------------------------------------------------
-- Blog (admin-managed CMS). Track 1, Phase 3.
-- ---------------------------------------------------------------------------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text not null,
  cover_image_url text,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists blog_posts_published_idx
  on blog_posts (is_published, published_at desc);

drop trigger if exists blog_posts_set_updated_at on blog_posts;
create trigger blog_posts_set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

alter table blog_posts enable row level security;

drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts" on blog_posts
  for select using (is_published = true);

insert into storage.buckets (id, name, public)
  values ('blog', 'blog', true)
  on conflict (id) do nothing;

drop policy if exists "public read blog" on storage.objects;
create policy "public read blog" on storage.objects
  for select using (bucket_id = 'blog');

-- ---------------------------------------------------------------------------
-- New Arrivals — homepage featured cards (Track 2)
-- ---------------------------------------------------------------------------
create table if not exists new_arrivals (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'catalogue' check (kind in ('catalogue', 'manual')),
  entry_id uuid references catalogue_entries(id) on delete cascade,
  title text,
  subtitle text,
  image_url text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists new_arrivals_active_idx
  on new_arrivals (is_active, sort_order);

drop trigger if exists new_arrivals_set_updated_at on new_arrivals;
create trigger new_arrivals_set_updated_at
  before update on new_arrivals
  for each row execute function set_updated_at();

alter table new_arrivals enable row level security;

drop policy if exists "public read active arrivals" on new_arrivals;
create policy "public read active arrivals" on new_arrivals
  for select using (is_active = true);
