-- Video thumbnails + editable tile text for managed media slots.
-- Run in the Supabase SQL editor. Also folded into schema.sql.
--
-- * poster_url — a video slot's thumbnail, shown while the video is paused or
--   buffering (e.g. the homepage gallery tiles). NULL = no poster.
-- * title / subtitle — editable heading + subheading for tiles that show text
--   (the homepage gallery). NULL = use the bundled default.
-- url is relaxed to nullable so a slot can override just text/poster while
-- keeping the bundled default media.

alter table site_media
  add column if not exists poster_url text;

alter table site_media
  add column if not exists title text;

alter table site_media
  add column if not exists subtitle text;

alter table site_media
  alter column url drop not null;
