import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { BlogPost, Section } from "@/lib/supabase/database.types";

/**
 * Public (site-facing) data access. Uses the RLS-respecting server client, so
 * only active entries and public taxonomy are ever returned.
 */

export type PublicEntry = {
  id: string;
  collection_name: string;
  pdf_url: string;
  thumbnail_url: string;
  design_type: { id: string; name: string } | null;
  section: { id: string; name: string } | null;
};

export async function getSections(): Promise<Section[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Failed to load sections: ${error.message}`);
  return data ?? [];
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  const sections = await getSections();
  return sections.find((s) => slugify(s.name) === slug) ?? null;
}

const PUBLIC_SELECT =
  "id, collection_name, pdf_url, thumbnail_url, design_type:design_types(id,name), section:sections(id,name)";

/**
 * Active entries, optionally scoped to one section. Ordered newest first.
 * RLS guarantees is_active = true rows only.
 */
export async function getActiveEntries(
  sectionId?: string,
): Promise<PublicEntry[]> {
  const supabase = await createClient();
  let query = supabase
    .from("catalogue_entries")
    .select(PUBLIC_SELECT)
    .order("created_at", { ascending: false });

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load entries: ${error.message}`);
  return (data ?? []) as unknown as PublicEntry[];
}

// ---- Blog (public) --------------------------------------------------------

/** Published posts, newest first. RLS guarantees is_published = true. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return data ?? [];
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load post: ${error.message}`);
  return data ?? null;
}
