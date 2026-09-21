"use client";

import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Button } from "@/components/ui/button";

/**
 * Homepage scroll-expansion hero (see docs/D3-Dynamic-Hero-Component-Spec.md).
 *
 * On load, a background photo fills the screen with the title. As the visitor
 * scrolls, the centered media grows until it fills the viewport, then the page
 * unlocks and reveals the content below. This is a deliberate, distinctive
 * interaction (scroll is locked until the media fully expands) — not a bug.
 *
 * PLACEHOLDER MEDIA: /public/videos/hero-placeholder.mp4 and the hero images
 * under /public/images/hero/ are generated placeholders. Drop the real hero
 * video in at /public/videos/hero-placeholder.mp4 (and real photography for the
 * background/poster) to go live — no code change needed.
 */
export default function HomepageHero() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/videos/hero-placeholder.mp4"
      posterSrc="/images/hero/hero-poster.jpg"
      bgImageSrc="/images/hero/hero-background.jpg"
      title="New Level of Interior"
      scrollToExpand="Scroll to explore our fabrics"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Dynamic Designs Decor</p>
        <h2 className="mt-5 text-3xl font-medium sm:text-4xl">
          Curtain &amp; Upholstery Fabrics
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          Choose from thousands of styles of curtain and sofa fabrics for your
          living room, bedroom, dining room and lounge. A stockist of furnishing
          fabrics in the MENA region, committed to unparalleled customer service
          and impeccable quality.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" nativeButton={false} render={<Link href="/catalogue" />}>
            Browse fabrics
          </Button>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
