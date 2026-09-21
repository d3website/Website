-- Blog (admin-managed CMS). Track 1, Phase 3.
-- Run in the Supabase SQL editor. Also folded into schema.sql for fresh setups.

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

-- reuse the shared updated_at trigger function (defined in schema.sql)
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists blog_posts_set_updated_at on blog_posts;
create trigger blog_posts_set_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- RLS: public reads published posts; writes are server-side via service role.
alter table blog_posts enable row level security;

drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts" on blog_posts
  for select using (is_published = true);

-- Storage bucket for blog cover images.
insert into storage.buckets (id, name, public)
  values ('blog', 'blog', true)
  on conflict (id) do nothing;

drop policy if exists "public read blog" on storage.objects;
create policy "public read blog" on storage.objects
  for select using (bucket_id = 'blog');
