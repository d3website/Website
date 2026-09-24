import { AnimatedMarqueeHero } from "@/components/ui/animated-marquee-hero";

/**
 * Homepage "collection" section — animated marquee hero. Placeholder marquee
 * images (warm placeholders); swap for real fabric/interior photography.
 */
const marqueeImages = [
  "/images/teasers/curtains.jpg",
  "/images/gallery/g2.jpg",
  "/images/teasers/upholstery.jpg",
  "/images/gallery/g4.jpg",
  "/images/teasers/outdoor.jpg",
  "/images/gallery/g6.jpg",
];

export default function HomepageCollection() {
  return (
    <AnimatedMarqueeHero
      tagline="Dynamic Designs Decor"
      title="The Art of Beautiful Interiors"
      description="A curated collection of exquisite curtain and upholstery fabrics, chosen to bring texture, elegance, and character to every space."
      ctaText="Explore the Collection"
      ctaHref="/catalogue"
      images={marqueeImages}
    />
  );
}
