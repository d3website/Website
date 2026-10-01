"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { FabricCard } from "@/components/ui/fabric-card";
import type { PublicEntry } from "@/lib/data/public";

/** Force the browser to download (not preview) the PDF via Supabase's
 * `?download` Content-Disposition, named after the collection. */
function downloadHref(pdfUrl: string, collectionName: string): string {
  const name = `${collectionName || "catalogue"}.pdf`;
  const sep = pdfUrl.includes("?") ? "&" : "?";
  return `${pdfUrl}${sep}download=${encodeURIComponent(name)}`;
}

type SectionTab = { id: string; name: string };

const ALL = "all";

export function CatalogueBrowser({
  sections,
  activeSlug,
  entries,
}: {
  sections: SectionTab[];
  /** null → the "All" tab is active */
  activeSlug: string | null;
  entries: PublicEntry[];
}) {
  const [designType, setDesignType] = useState<string>(ALL);

  // Section-scoped filter options: distinct design types present in THIS result
  // set (Plan §4.3), not the global design_types table.
  const designTypes = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of entries) {
      if (e.design_type) map.set(e.design_type.id, e.design_type.name);
    }
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [entries]);

  const visible = useMemo(
    () =>
      designType === ALL
        ? entries
        : entries.filter((e) => e.design_type?.id === designType),
    [entries, designType],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Section tabs */}
      <nav className="flex flex-wrap gap-x-8 gap-y-2 border-b">
        <TabLink href="/catalogue" active={activeSlug === null}>
          All
        </TabLink>
        {sections.map((s) => {
          const slug = slugify(s.name);
          return (
            <TabLink key={s.id} href={`/${slug}`} active={activeSlug === slug}>
              {s.name}
            </TabLink>
          );
        })}
      </nav>

      {/* Design-type filter pills (section-scoped) */}
      {designTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Pill active={designType === ALL} onClick={() => setDesignType(ALL)}>
            All designs
          </Pill>
          {designTypes.map((dt) => (
            <Pill
              key={dt.id}
              active={designType === dt.id}
              onClick={() => setDesignType(dt.id)}
            >
              {dt.name}
            </Pill>
          ))}
        </div>
      )}

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No collections to show here yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((e) => (
            <FabricCard
              key={e.id}
              imageUrl={e.thumbnail_url ?? ""}
              title={e.collection_name}
              subtitle={e.design_type?.name ?? e.section?.name ?? ""}
              href={downloadHref(e.pdf_url, e.collection_name)}
              themeColor="30 26% 20%"
              actionLabel="Download Ebook"
              download
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "-mb-px border-b-2 pb-3 text-sm font-medium tracking-wide transition-colors",
        active
          ? "border-gold text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-colors",
        active
          ? "border-gold bg-gold text-gold-foreground"
          : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
