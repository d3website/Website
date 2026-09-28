import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import type { ResolvedMedia } from "@/lib/media";

/**
 * Homepage gallery section (bento). Tile media (image or video per tile) and
 * the heading/subheading are admin-managed (Manage Media → Gallery); only the
 * tile spans (layout) are fixed here.
 */
const tileSpans = [
  "col-span-2 row-span-4",
  "col-span-2 row-span-2",
  "col-span-1 row-span-2",
  "col-span-1 row-span-2",
  "col-span-2 row-span-3",
  "col-span-2 row-span-3",
];

export default function HomepageGallery({ media }: { media: ResolvedMedia[] }) {
  const items = tileSpans.map((span, i) => ({
    id: i + 1,
    type: media[i]?.type ?? "image",
    title: media[i]?.title ?? "",
    desc: media[i]?.subtitle ?? "",
    url: media[i]?.url ?? "",
    poster: media[i]?.poster,
    span,
  }));

  return (
    <section className="border-b">
      <InteractiveBentoGallery
        mediaItems={items}
        title="A Curated Collection"
        description="Explore fabrics and finishes across curtains, upholstery and outdoor living."
      />
    </section>
  );
}
