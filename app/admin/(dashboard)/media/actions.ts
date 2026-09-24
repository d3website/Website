"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { deleteSiteMedia, setSiteMedia } from "@/lib/data/site-media";
import { uploadSiteMedia } from "@/lib/data/storage";
import { MEDIA_SLOTS, type MediaType } from "@/lib/media";

export type MediaActionResult =
  | { ok: true; url: string; type: MediaType }
  | { ok: false; error: string };

export async function uploadMediaSlot(
  slot: string,
  formData: FormData,
): Promise<MediaActionResult> {
  await requireUser();
  const def = MEDIA_SLOTS[slot];
  if (!def) return { ok: false, error: "Unknown media slot." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a file." };
  }

  try {
    const { url, type } = await uploadSiteMedia(file, slot);
    if (def.accept === "image" && type !== "image") {
      return { ok: false, error: "This slot accepts images only." };
    }
    if (def.accept === "video" && type !== "video") {
      return { ok: false, error: "This slot accepts videos only." };
    }
    await setSiteMedia(slot, url, type);
    revalidatePath("/", "layout");
    return { ok: true, url, type };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload failed." };
  }
}

export async function resetMediaSlot(slot: string): Promise<void> {
  await requireUser();
  await deleteSiteMedia(slot);
  revalidatePath("/", "layout");
}
