"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as data from "@/lib/data/admin";

function revalidateCatalogue() {
  revalidatePath("/admin/taxonomy");
  revalidatePath("/catalogue");
  revalidatePath("/curtains");
  revalidatePath("/upholstery");
  revalidatePath("/outdoor-fabric");
}

/** Persist a section banner after the browser uploaded it directly to Storage. */
export async function setSectionHeroUrl(
  sectionId: string,
  url: string,
): Promise<void> {
  await requireUser();
  await data.updateSectionHeroImage(sectionId, url);
  revalidateCatalogue();
}

export async function removeSectionHero(sectionId: string): Promise<void> {
  await requireUser();
  await data.updateSectionHeroImage(sectionId, null);
  revalidateCatalogue();
}
