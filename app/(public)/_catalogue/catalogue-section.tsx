import { notFound } from "next/navigation";
import { getActiveEntries, getSectionBySlug, getSections } from "@/lib/data/public";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { PageHeader } from "@/components/page-header";

/**
 * Shared server view for a catalogue page. Pass a section `slug` for a single
 * section, or omit it for the "All" view. Reused by the /curtains, /upholstery,
 * /outdoor-fabric and /catalogue routes so they stay in sync.
 */
export async function CatalogueSection({
  slug,
  description,
}: {
  slug?: string;
  description?: string;
}) {
  const sections = await getSections();

  let activeSlug: string | null = null;
  let title = "All Collections";
  let sectionId: string | undefined;

  if (slug) {
    const section = await getSectionBySlug(slug);
    if (!section) notFound();
    activeSlug = slug;
    title = section.name;
    sectionId = section.id;
  }

  const entries = await getActiveEntries(sectionId);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14">
      <PageHeader
        eyebrow="Collections"
        title={title}
        description={description}
        className="mb-10"
      />

      <CatalogueBrowser
        sections={sections.map((s) => ({ id: s.id, name: s.name }))}
        activeSlug={activeSlug}
        entries={entries}
      />
    </main>
  );
}
