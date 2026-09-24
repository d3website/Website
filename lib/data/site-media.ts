import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { MediaMap, MediaType } from "@/lib/media";

function toMap(
  rows: { slot: string; url: string; media_type: string }[] | null,
): MediaMap {
  const map: MediaMap = {};
  for (const r of rows ?? []) {
    map[r.slot] = { url: r.url, type: (r.media_type as MediaType) || "image" };
  }
  return map;
}

/**
 * Public read of all managed media overrides. Resilient: returns {} if the
 * table doesn't exist yet (before the migration), so pages never break and
 * every placeholder falls back to its bundled default.
 */
export async function getSiteMedia(): Promise<MediaMap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_media")
      .select("slot, url, media_type");
    if (error) return {};
    return toMap(data);
  } catch {
    return {};
  }
}

// ---- Admin ----------------------------------------------------------------

export async function listSiteMedia(): Promise<MediaMap> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("site_media")
    .select("slot, url, media_type");
  if (error) throw new Error(error.message);
  return toMap(data);
}

export async function setSiteMedia(
  slot: string,
  url: string,
  media_type: MediaType,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("site_media")
    .upsert(
      { slot, url, media_type, updated_at: new Date().toISOString() },
      { onConflict: "slot" },
    );
  if (error) throw new Error(error.message);
}

export async function deleteSiteMedia(slot: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("site_media").delete().eq("slot", slot);
  if (error) throw new Error(error.message);
}
