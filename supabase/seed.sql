-- D3 Dynamic — taxonomy seed data.
-- Safe to re-run: inserts are ignored on name conflict.
-- Run in the Supabase SQL editor, or via scripts/seed-taxonomy.mjs.

insert into sections (name, sort_order) values
  ('Curtains', 1),
  ('Upholstery', 2),
  ('Outdoor Fabric', 3)
on conflict (name) do nothing;

insert into features (name) values
  ('Pet Friendly'),
  ('Fire Retardant'),
  ('Leather Finish'),
  ('Easy to Clean')
on conflict (name) do nothing;

insert into design_types (name) values
  ('Plain'),
  ('Textured'),
  ('Floral'),
  ('Abstract'),
  ('Damask'),
  ('Geometric'),
  ('Leaves'),
  ('Paisley'),
  ('Stripes & Checks')
on conflict (name) do nothing;
