import { AnimatedMarqueeHero } from "@/components/ui/animated-marquee-hero";

/**
 * Homepage "collection" section — animated marquee hero. Marquee images are
 * admin-managed (Manage Media → Explore the Collection).
 */
export default function HomepageCollection({ images }: { images: string[] }) {
  return (
    <AnimatedMarqueeHero
      tagline="Dynamic Designs Decor"
      title="The Art of Beautiful Interiors"
      description="A curated collection of exquisite curtain and upholstery fabrics, chosen to bring texture, elegance, and character to every space."
      ctaText="Explore the Collection"
      ctaHref="/catalogue"
      images={images}
    />
  );
}
