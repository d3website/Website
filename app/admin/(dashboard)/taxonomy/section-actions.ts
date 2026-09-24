"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as data from "@/lib/data/admin";
import { uploadThumbnail } from "@/lib/data/storage";

export type SectionHeroResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function revalidateCatalogue() {
  revalidatePath("/admin/taxonomy");
  revalidatePath("/catalogue");
  revalidatePath("/curtains");
  revalidatePath("/upholstery");
  revalidatePath("/outdoor-fabric");
}

export async function setSectionHero(
  sectionId: string,
  formData: FormData,
): Promise<SectionHeroResult> {
  await requireUser();
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { ok: false, error: "Choose an image." };
  }
  try {
    const url = await uploadThumbnail(image, "section-hero");
    await data.updateSectionHeroImage(sectionId, url);
    revalidateCatalogue();
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload failed." };
  }
}

export async function removeSectionHero(sectionId: string): Promise<void> {
  await requireUser();
  await data.updateSectionHeroImage(sectionId, null);
  revalidateCatalogue();
}
