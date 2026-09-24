import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import type { ResolvedMedia } from "@/lib/media";

/**
 * Homepage gallery section (bento). Tile media (image or video per tile) is
 * admin-managed (Manage Media → Gallery); titles/spans are fixed here.
 */
const tileMeta = [
  { title: "Curtain Collections", desc: "Jacquards, sheers and elegant drapes.", span: "col-span-2 row-span-4" },
  { title: "Upholstery", desc: "Sofa and seating fabrics.", span: "col-span-2 row-span-2" },
  { title: "Outdoor Fabric", desc: "Weather-ready textiles.", span: "col-span-1 row-span-2" },
  { title: "Textures", desc: "Weaves that invite touch.", span: "col-span-1 row-span-2" },
  { title: "Living Spaces", desc: "Fabrics for every room.", span: "col-span-2 row-span-3" },
  { title: "Colour Stories", desc: "Palettes for your interior.", span: "col-span-2 row-span-3" },
];

export default function HomepageGallery({ media }: { media: ResolvedMedia[] }) {
  const items = tileMeta.map((m, i) => ({
    id: i + 1,
    type: media[i]?.type ?? "image",
    title: m.title,
    desc: m.desc,
    url: media[i]?.url ?? "",
    span: m.span,
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
