-- Section hero background image (Track 2). Run in the Supabase SQL editor.
-- Adds an optional banner image shown behind the catalogue page header.

alter table sections add column if not exists hero_image_url text;
