"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { deleteSiteMedia, setSiteMedia } from "@/lib/data/site-media";
import { MEDIA_SLOTS, type MediaType } from "@/lib/media";

export type MediaActionResult =
  | { ok: true; url: string; type: MediaType }
  | { ok: false; error: string };

/**
 * Persist a media slot after the browser has uploaded the file directly to
 * Storage (see lib/upload-client.ts). Only the URL travels through the Server
 * Action, so there's no body-size limit.
 */
export async function setMediaSlot(
  slot: string,
  url: string,
  type: MediaType,
): Promise<MediaActionResult> {
  await requireUser();
  const def = MEDIA_SLOTS[slot];
  if (!def) return { ok: false, error: "Unknown media slot." };
  if (def.accept === "image" && type !== "image") {
    return { ok: false, error: "This slot accepts images only." };
  }
  if (def.accept === "video" && type !== "video") {
    return { ok: false, error: "This slot accepts videos only." };
  }
  try {
    await setSiteMedia(slot, url, type);
    revalidatePath("/", "layout");
    return { ok: true, url, type };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function resetMediaSlot(slot: string): Promise<void> {
  await requireUser();
  await deleteSiteMedia(slot);
  revalidatePath("/", "layout");
}
