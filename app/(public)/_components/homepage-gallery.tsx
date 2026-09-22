"use client";

import InteractiveBentoGallery, {
  type MediaItemType,
} from "@/components/ui/interactive-bento-gallery";

/**
 * Homepage gallery section (below the hero). Placeholder media — swap the URLs
 * for real fabric/interior photography and video. Item 1 reuses the hero
 * placeholder video to show the video tile; the rest are placeholder images
 * under /public/images/gallery/.
 */
const galleryItems: MediaItemType[] = [
  {
    id: 1,
    type: "video",
    title: "Curtain Collections",
    desc: "Jacquards, sheers and elegant drapes.",
    url: "/videos/hero-placeholder.mp4",
    span: "col-span-2 row-span-4",
  },
  {
    id: 2,
    type: "image",
    title: "Upholstery",
    desc: "Sofa and seating fabrics.",
    url: "/images/gallery/g2.jpg",
    span: "col-span-2 row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Outdoor Fabric",
    desc: "Weather-ready textiles.",
    url: "/images/gallery/g3.jpg",
    span: "col-span-1 row-span-2",
  },
  {
    id: 4,
    type: "image",
    title: "Textures",
    desc: "Weaves that invite touch.",
    url: "/images/gallery/g4.jpg",
    span: "col-span-1 row-span-2",
  },
  {
    id: 5,
    type: "image",
    title: "Living Spaces",
    desc: "Fabrics for every room.",
    url: "/images/gallery/g5.jpg",
    span: "col-span-2 row-span-3",
  },
  {
    id: 6,
    type: "image",
    title: "Colour Stories",
    desc: "Palettes for your interior.",
    url: "/images/gallery/g6.jpg",
    span: "col-span-2 row-span-3",
  },
];

export default function HomepageGallery() {
  return (
    <section className="border-b">
      <InteractiveBentoGallery
        mediaItems={galleryItems}
        title="A Curated Collection"
        description="Explore fabrics and finishes across curtains, upholstery and outdoor living."
      />
    </section>
  );
}
