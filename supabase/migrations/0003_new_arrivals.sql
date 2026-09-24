-- New Arrivals — homepage featured cards (Track 2). Run in the Supabase SQL
-- editor. Also folded into schema.sql for fresh setups.
--
-- Each row is one homepage card:
--   kind = 'catalogue' -> references a catalogue_entries row (entry_id);
--                         title/subtitle/image/PDF derive from that entry.
--   kind = 'manual'    -> a showcased product entered directly
--                         (title, subtitle, image_url); action = Contact us.

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

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists new_arrivals_set_updated_at on new_arrivals;
create trigger new_arrivals_set_updated_at
  before update on new_arrivals
  for each row execute function set_updated_at();

alter table new_arrivals enable row level security;

drop policy if exists "public read active arrivals" on new_arrivals;
create policy "public read active arrivals" on new_arrivals
  for select using (is_active = true);
