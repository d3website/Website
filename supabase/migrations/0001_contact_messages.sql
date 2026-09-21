-- Contact form submissions (Track 1, Phase 3).
-- Run in the Supabase SQL editor. Also included in schema.sql for fresh setups.
--
-- Storing submissions in the DB is the least-assumption default. Email/CRM
-- forwarding of these rows can be added once the destination is confirmed
-- (Project Plan §7 open item).

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

-- RLS on, with no public policies: rows are written server-side with the
-- service-role key and read only by the admin (service role). Not public.
alter table contact_messages enable row level security;
