-- Make a catalogue entry's design type optional.
-- Run in the Supabase SQL editor. Also folded into schema.sql.

alter table catalogue_entries
  alter column design_type_id drop not null;
