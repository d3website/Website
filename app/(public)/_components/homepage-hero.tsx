"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

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
    />
  );
}
