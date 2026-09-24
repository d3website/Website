import Image from "next/image";
import { notFound } from "next/navigation";
import { getActiveEntries, getSectionBySlug, getSections } from "@/lib/data/public";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { PageHeader } from "@/components/page-header";

// Sections that ship with a placeholder banner under /public/images/sections.
const PLACEHOLDER_SLUGS = new Set(["curtains", "upholstery", "outdoor-fabric"]);

/**
 * Shared server view for a catalogue page. Pass a section `slug` for a single
 * section, or omit it for the "All" view. The header renders over a background
 * banner — the section's admin-set `hero_image_url`, or a bundled placeholder.
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
  let heroImage: string | null = "/images/sections/all.jpg";

  if (slug) {
    const section = await getSectionBySlug(slug);
    if (!section) notFound();
    activeSlug = slug;
    title = section.name;
    sectionId = section.id;
    heroImage =
      section.hero_image_url ||
      (PLACEHOLDER_SLUGS.has(slug) ? `/images/sections/${slug}.jpg` : null);
  }

  const entries = await getActiveEntries(sectionId);

  return (
    <main className="flex-1">
      {heroImage ? (
        <section className="relative overflow-hidden border-b">
          <Image
            src={heroImage}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/35" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              Collections
            </p>
            <h1 className="mt-4 text-4xl font-medium text-white sm:text-5xl">
              {title}
            </h1>
            <div className="mt-5 h-px w-14 bg-gold" />
            {description && (
              <p className="mt-6 max-w-2xl leading-relaxed text-white/85">
                {description}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-6xl px-6 pt-14">
          <PageHeader eyebrow="Collections" title={title} description={description} />
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <CatalogueBrowser
          sections={sections.map((s) => ({ id: s.id, name: s.name }))}
          activeSlug={activeSlug}
          entries={entries}
        />
      </section>
    </main>
  );
}
