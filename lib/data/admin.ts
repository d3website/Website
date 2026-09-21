import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CatalogueEntry,
  DesignType,
  Feature,
  Section,
} from "@/lib/supabase/database.types";

/**
 * Admin-side data access. Uses the service-role client (bypasses RLS) so the
 * panel can see inactive entries and manage taxonomy. Only import from
 * auth-gated Server Components / Server Actions.
 */

export type EntryWithRelations = CatalogueEntry & {
  section: Pick<Section, "id" | "name"> | null;
  feature: Pick<Feature, "id" | "name"> | null;
  design_type: Pick<DesignType, "id" | "name"> | null;
};

// ---- Taxonomy reads -------------------------------------------------------

export async function listSections(): Promise<Section[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("sections")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to load sections: ${error.message}`);
  return data ?? [];
}

export async function listFeatures(): Promise<Feature[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("features")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to load features: ${error.message}`);
  return data ?? [];
}

export async function listDesignTypes(): Promise<DesignType[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("design_types")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to load design types: ${error.message}`);
  return data ?? [];
}

// ---- Entry reads ----------------------------------------------------------

const ENTRY_SELECT =
  "*, section:sections(id,name), feature:features(id,name), design_type:design_types(id,name)";

export async function listEntries(): Promise<EntryWithRelations[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("catalogue_entries")
    .select(ENTRY_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load entries: ${error.message}`);
  return (data ?? []) as unknown as EntryWithRelations[];
}

export async function getEntry(id: string): Promise<EntryWithRelations | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("catalogue_entries")
    .select(ENTRY_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load entry: ${error.message}`);
  return (data as unknown as EntryWithRelations) ?? null;
}

// ---- Taxonomy writes (inline "add new") -----------------------------------

export async function createSection(name: string): Promise<Section> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("sections")
    .insert({ name })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createFeature(name: string): Promise<Feature> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("features")
    .insert({ name })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createDesignType(name: string): Promise<DesignType> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("design_types")
    .insert({ name })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ---- Entry writes ---------------------------------------------------------

export type EntryInput = {
  collection_name: string;
  section_id: string;
  feature_id: string | null;
  design_type_id: string;
  thumbnail_url: string;
  pdf_url: string;
  is_active: boolean;
};

export async function insertEntry(input: EntryInput): Promise<CatalogueEntry> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("catalogue_entries")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEntry(
  id: string,
  input: Partial<EntryInput>,
): Promise<CatalogueEntry> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("catalogue_entries")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEntry(id: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("catalogue_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
