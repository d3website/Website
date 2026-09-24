import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  BlogPost,
  CatalogueEntry,
  DesignType,
  Feature,
  NewArrival,
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

export async function updateSectionHeroImage(
  id: string,
  hero_image_url: string | null,
): Promise<void> {
  const db = createAdminClient();
  const { error } = await db
    .from("sections")
    .update({ hero_image_url })
    .eq("id", id);
  if (error) throw new Error(error.message);
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

// ---- Blog (admin) ---------------------------------------------------------

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
};

export async function listBlogPosts(): Promise<BlogPost[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return data ?? [];
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load post: ${error.message}`);
  return data ?? null;
}

/** Whether a slug is already taken (optionally excluding one post id). */
export async function blogSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const db = createAdminClient();
  let q = db.from("blog_posts").select("id").eq("slug", slug);
  if (excludeId) q = q.neq("id", excludeId);
  const { data, error } = await q.maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function insertBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("blog_posts")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateBlogPost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("blog_posts")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- New Arrivals (admin) -------------------------------------------------

export type ArrivalWithEntry = NewArrival & {
  entry: {
    id: string;
    collection_name: string;
    thumbnail_url: string;
    pdf_url: string;
    section: { id: string; name: string } | null;
  } | null;
};

const ARRIVAL_SELECT =
  "*, entry:catalogue_entries(id, collection_name, thumbnail_url, pdf_url, section:sections(id,name))";

export async function listNewArrivals(): Promise<ArrivalWithEntry[]> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("new_arrivals")
    .select(ARRIVAL_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load arrivals: ${error.message}`);
  return (data ?? []) as unknown as ArrivalWithEntry[];
}

export async function getNewArrival(
  id: string,
): Promise<ArrivalWithEntry | null> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("new_arrivals")
    .select(ARRIVAL_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as ArrivalWithEntry) ?? null;
}

export type NewArrivalInput = {
  kind: "catalogue" | "manual";
  entry_id: string | null;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function insertNewArrival(
  input: NewArrivalInput,
): Promise<NewArrival> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("new_arrivals")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateNewArrival(
  id: string,
  input: Partial<NewArrivalInput>,
): Promise<NewArrival> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("new_arrivals")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteNewArrival(id: string): Promise<void> {
  const db = createAdminClient();
  const { error } = await db.from("new_arrivals").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
