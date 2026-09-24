-- Site media — admin-managed image/video placeholders (Track 2).
-- Run in the Supabase SQL editor. Also folded into schema.sql.
--
-- Key-value: slot key (see lib/media.ts) -> uploaded url + type. A slot with no
-- row falls back to the bundled default.

create table if not exists site_media (
  slot text primary key,
  url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  updated_at timestamptz default now()
);

alter table site_media enable row level security;

drop policy if exists "public read site media" on site_media;
create policy "public read site media" on site_media
  for select using (true);

-- Storage bucket for uploaded site media (images + videos).
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

drop policy if exists "public read site media bucket" on storage.objects;
create policy "public read site media bucket" on storage.objects
  for select using (bucket_id = 'media');
