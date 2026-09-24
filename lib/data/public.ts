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

// ---- New Arrivals (public) ------------------------------------------------

export type ArrivalCard = {
  id: string;
  kind: "catalogue" | "manual";
  title: string;
  subtitle: string;
  imageUrl: string | null;
  actionText: string;
  actionHref: string;
  actionNewTab: boolean;
  detailHref: string | null;
};

type RawArrival = {
  id: string;
  kind: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  entry: {
    collection_name: string;
    thumbnail_url: string;
    pdf_url: string;
    section: { name: string } | null;
  } | null;
};

/**
 * Active homepage "New Arrivals", resolved into card data. Resilient: returns
 * [] if the table doesn't exist yet (before the migration is run), so the
 * homepage never breaks.
 */
export async function getActiveNewArrivals(): Promise<ArrivalCard[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("new_arrivals")
      .select(
        "id, kind, title, subtitle, image_url, entry:catalogue_entries(collection_name, thumbnail_url, pdf_url, section:sections(name))",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return [];

    const rows = (data ?? []) as unknown as RawArrival[];
    const cards: ArrivalCard[] = [];
    for (const r of rows) {
      if (r.kind === "catalogue") {
        if (!r.entry) continue; // entry inactive/removed — skip
        const sectionName = r.entry.section?.name ?? "Fabrics";
        cards.push({
          id: r.id,
          kind: "catalogue",
          title: r.entry.collection_name,
          subtitle: sectionName,
          imageUrl: r.entry.thumbnail_url,
          actionText: "Download PDF",
          actionHref: r.entry.pdf_url,
          actionNewTab: true,
          detailHref: `/${slugify(sectionName)}`,
        });
      } else {
        cards.push({
          id: r.id,
          kind: "manual",
          title: r.title ?? "New Collection",
          subtitle: r.subtitle ?? "",
          imageUrl: r.image_url,
          actionText: "Contact us",
          actionHref: "/contact",
          actionNewTab: false,
          detailHref: null,
        });
      }
    }
    return cards;
  } catch {
    return [];
  }
}
