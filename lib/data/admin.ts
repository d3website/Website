import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteStoredFile,
  deleteStoredFiles,
} from "@/lib/data/storage-cleanup";
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

/** One page of catalogue entries (newest first) plus the total count. */
export async function listEntriesPage(
  page: number,
  pageSize: number,
): Promise<{ entries: EntryWithRelations[]; total: number }> {
  const db = createAdminClient();
  const from = (page - 1) * pageSize;
  const { data, error, count } = await db
    .from("catalogue_entries")
    .select(ENTRY_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);
  if (error) throw new Error(`Failed to load entries: ${error.message}`);
  return {
    entries: (data ?? []) as unknown as EntryWithRelations[],
    total: count ?? 0,
  };
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
  const { data: prev } = await db
    .from("sections")
    .select("hero_image_url")
    .eq("id", id)
    .single();
  const { error } = await db
    .from("sections")
    .update({ hero_image_url })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (prev?.hero_image_url && prev.hero_image_url !== hero_image_url)
    await deleteStoredFile(prev.hero_image_url);
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
  design_type_id: string | null;
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
  // Capture old media so a replaced thumbnail/PDF can be cleaned up.
  const replacing =
    input.thumbnail_url !== undefined || input.pdf_url !== undefined;
  let prev: { thumbnail_url: string; pdf_url: string } | null = null;
  if (replacing) {
    const { data } = await db
      .from("catalogue_entries")
      .select("thumbnail_url, pdf_url")
      .eq("id", id)
      .single();
    prev = data;
  }
  const { data, error } = await db
    .from("catalogue_entries")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (input.thumbnail_url && prev && prev.thumbnail_url !== input.thumbnail_url)
    await deleteStoredFile(prev.thumbnail_url);
  if (input.pdf_url && prev && prev.pdf_url !== input.pdf_url)
    await deleteStoredFile(prev.pdf_url);
  return data;
}

export async function deleteEntry(id: string): Promise<void> {
  const db = createAdminClient();
  const { data: prev } = await db
    .from("catalogue_entries")
    .select("thumbnail_url, pdf_url")
    .eq("id", id)
    .single();
  const { error } = await db.from("catalogue_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  // Runs after the cascade, so a thumbnail no longer used by any arrival is
  // removed, while one still shared stays.
  await deleteStoredFiles([prev?.thumbnail_url, prev?.pdf_url]);
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
  let prevCover: string | null = null;
  if (input.cover_image_url !== undefined) {
    const { data } = await db
      .from("blog_posts")
      .select("cover_image_url")
      .eq("id", id)
      .single();
    prevCover = data?.cover_image_url ?? null;
  }
  const { data, error } = await db
    .from("blog_posts")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (input.cover_image_url && prevCover && prevCover !== input.cover_image_url)
    await deleteStoredFile(prevCover);
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = createAdminClient();
  const { data: prev } = await db
    .from("blog_posts")
    .select("cover_image_url")
    .eq("id", id)
    .single();
  const { error } = await db.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStoredFile(prev?.cover_image_url);
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
  let prevImg: string | null = null;
  if (input.image_url !== undefined) {
    const { data } = await db
      .from("new_arrivals")
      .select("image_url")
      .eq("id", id)
      .single();
    prevImg = data?.image_url ?? null;
  }
  const { data, error } = await db
    .from("new_arrivals")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (input.image_url && prevImg && prevImg !== input.image_url)
    await deleteStoredFile(prevImg);
  return data;
}

export async function deleteNewArrival(id: string): Promise<void> {
  const db = createAdminClient();
  // Only a manual arrival owns its image_url; a catalogue arrival stores null
  // and shows the catalogue's thumbnail, so nothing is deleted here.
  const { data: prev } = await db
    .from("new_arrivals")
    .select("image_url")
    .eq("id", id)
    .single();
  const { error } = await db.from("new_arrivals").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await deleteStoredFile(prev?.image_url);
}
