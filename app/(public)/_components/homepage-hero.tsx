"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import type { MediaType } from "@/lib/media";

/**
 * Homepage scroll-expansion hero (see docs/D3-Dynamic-Hero-Component-Spec.md).
 * Background + foreground media are admin-managed (Manage Media → Homepage —
 * Hero); the foreground can be an image or a video.
 */
export default function HomepageHero({
  background,
  media,
  mediaType,
}: {
  background: string;
  media: string;
  mediaType: MediaType;
}) {
  return (
    <ScrollExpandMedia
      mediaType={mediaType}
      mediaSrc={media}
      posterSrc={background}
      bgImageSrc={background}
      title="Spaces Redefined"
      scrollToExpand="Explore curated fabrics"
    />
  );
}
