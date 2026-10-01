import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  deleteStoredFile,
  deleteStoredFiles,
} from "@/lib/data/storage-cleanup";
import type { MediaMap, MediaType } from "@/lib/media";

type Row = {
  slot: string;
  url: string | null;
  media_type: string;
  poster_url?: string | null;
  title?: string | null;
  subtitle?: string | null;
};

// Full column set, and a legacy subset used as a fallback if the 0006
// migration (poster_url/title/subtitle) hasn't been applied yet.
const COLUMNS = "slot, url, media_type, poster_url, title, subtitle";
const COLUMNS_LEGACY = "slot, url, media_type";

function toMap(rows: Row[] | null): MediaMap {
  const map: MediaMap = {};
  for (const r of rows ?? []) {
    map[r.slot] = {
      url: r.url,
      type: (r.media_type as MediaType) || "image",
      poster: r.poster_url ?? null,
      title: r.title ?? null,
      subtitle: r.subtitle ?? null,
    };
  }
  return map;
}

/**
 * Public read of all managed media overrides. Resilient: returns {} if the
 * table is missing, and falls back to the legacy columns if the poster/text
 * migration hasn't run — so pages never break and placeholders fall back to
 * their bundled defaults.
 */
export async function getSiteMedia(): Promise<MediaMap> {
  try {
    const supabase = await createClient();
    let { data, error } = await supabase.from("site_media").select(COLUMNS);
    if (error) {
      ({ data, error } = await supabase
        .from("site_media")
        .select(COLUMNS_LEGACY));
      if (error) return {};
    }
    return toMap(data as Row[] | null);
  } catch {
    return {};
  }
}

// ---- Admin ----------------------------------------------------------------

export async function listSiteMedia(): Promise<MediaMap> {
  const db = createAdminClient();
  let { data, error } = await db.from("site_media").select(COLUMNS);
  if (error) {
    ({ data, error } = await db.from("site_media").select(COLUMNS_LEGACY));
    if (error) throw new Error(error.message);
  }
  return toMap(data as Row[] | null);
}

/** Set (or replace) a slot's media. Leaves poster/title/subtitle untouched. */
export async function setSiteMedia(
  slot: string,
  url: string,
  media_type: MediaType,
): Promise<void> {
  const db = createAdminClient();
  const { data: prev } = await db
    .from("site_media")
    .select("url")
    .eq("slot", slot)
    .single();
  const { error } = await db
    .from("site_media")
    .upsert(
      { slot, url, media_type, updated_at: new Date().toISOString() },
      { onConflict: "slot" },
    );
  if (error) throw new Error(error.message);
  if (prev?.url && prev.url !== url) await deleteStoredFile(prev.url);
}

/** Set a video slot's poster (thumbnail). Leaves the media/text untouched. */
export async function setSiteMediaPoster(
  slot: string,
  poster_url: string,
): Promise<void> {
  const db = createAdminClient();
  const { data: prev } = await db
    .from("site_media")
    .select("poster_url")
    .eq("slot", slot)
    .single();
  const { error } = await db
    .from("site_media")
    .upsert(
      { slot, poster_url, updated_at: new Date().toISOString() },
      { onConflict: "slot" },
    );
  if (error) throw new Error(error.message);
  if (prev?.poster_url && prev.poster_url !== poster_url)
    await deleteStoredFile(prev.poster_url);
}

/** Set a tile's heading/subheading. Empty strings clear back to the default. */
export async function setSiteMediaText(
  slot: string,
  title: string | null,
  subtitle: string | null,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("site_media")
    .upsert(
      {
        slot,
        title: title || null,
        subtitle: subtitle || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slot" },
    );
  if (error) throw new Error(error.message);
}

export async function deleteSiteMedia(slot: string): Promise<void> {
  const db = createAdminClient();
  const { data: prev } = await db
    .from("site_media")
    .select("url, poster_url")
    .eq("slot", slot)
    .single();
  const { error } = await db.from("site_media").delete().eq("slot", slot);
  if (error) throw new Error(error.message);
  await deleteStoredFiles([prev?.url, prev?.poster_url]);
}
