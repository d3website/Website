"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import * as data from "@/lib/data/admin";

export type TaxonomyResult =
  | { ok: true; item: { id: string; name: string } }
  | { ok: false; error: string };

type TaxonomyKind = "section" | "feature" | "design_type";

/** Inline "add new" for the three taxonomy dropdowns. */
export async function addTaxonomy(
  kind: TaxonomyKind,
  rawName: string,
): Promise<TaxonomyResult> {
  await requireUser();
  const name = rawName.trim();
  if (!name) return { ok: false, error: "Name is required." };

  try {
    let item: { id: string; name: string };
    if (kind === "section") item = await data.createSection(name);
    else if (kind === "feature") item = await data.createFeature(name);
    else item = await data.createDesignType(name);

    revalidatePath("/admin", "layout");
    return { ok: true, item: { id: item.id, name: item.name } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not create.";
    // unique_violation
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return { ok: false, error: `"${name}" already exists.` };
    }
    return { ok: false, error: msg };
  }
}

export type EntryFormState = { error: string | null };

/**
 * Create or update a catalogue entry. Presence of a hidden `id` field switches
 * to update mode. Files are optional on update (existing URLs are kept).
 * `publish` controls is_active.
 */
export async function saveEntry(
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const isUpdate = id.length > 0;

  const collection_name = String(formData.get("collection_name") ?? "").trim();
  const section_id = String(formData.get("section_id") ?? "").trim();
  const design_type_id = String(formData.get("design_type_id") ?? "").trim();
  const rawFeature = String(formData.get("feature_id") ?? "").trim();
  const feature_id = rawFeature && rawFeature !== "none" ? rawFeature : null;
  const is_active = String(formData.get("publish") ?? "true") === "true";

  if (!collection_name) return { error: "Collection name is required." };
  if (!section_id) return { error: "Section is required." };
  if (!design_type_id) return { error: "Design type is required." };

  const thumbnail_url = String(formData.get("thumbnail_url") ?? "").trim();
  const pdf_url = String(formData.get("pdf_url") ?? "").trim();

  if (!isUpdate && !thumbnail_url) {
    return { error: "A thumbnail image is required." };
  }
  if (!isUpdate && !pdf_url) return { error: "A PDF catalogue is required." };

  try {
    if (isUpdate) {
      await data.updateEntry(id, {
        collection_name,
        section_id,
        design_type_id,
        feature_id,
        is_active,
        ...(thumbnail_url ? { thumbnail_url } : {}),
        ...(pdf_url ? { pdf_url } : {}),
      });
    } else {
      await data.insertEntry({
        collection_name,
        section_id,
        design_type_id,
        feature_id,
        is_active,
        thumbnail_url,
        pdf_url,
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save entry." };
  }

  revalidatePath("/admin");
  revalidatePath("/curtains");
  revalidatePath("/upholstery");
  revalidatePath("/outdoor-fabric");
  redirect("/admin");
}

export async function setEntryActive(id: string, active: boolean) {
  await requireUser();
  await data.updateEntry(id, { is_active: active });
  revalidatePath("/admin");
}

export async function removeEntry(id: string) {
  await requireUser();
  await data.deleteEntry(id);
  revalidatePath("/admin");
}
