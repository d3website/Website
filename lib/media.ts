/**
 * Site media registry — the single source of truth for every admin-managed
 * image/video placeholder. Drives both the public rendering (each placeholder
 * resolves its slot, falling back to a bundled default) and the admin
 * "Manage Media" UI (grouped list of slots).
 *
 * New Arrivals media is managed separately (Admin → Arrivals); catalogue
 * section banners are managed under Admin → Taxonomy → Sections.
 */

export type MediaType = "image" | "video";
export type MediaAccept = MediaType | "both";

/** Client-side upload size caps (bytes). Mirror lib/data/storage.ts. */
export const MEDIA_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5 MB
  video: 50 * 1024 * 1024, // 50 MB
};

export interface MediaSlotDef {
  key: string;
  label: string;
  accept: MediaAccept;
  defaultUrl: string;
  defaultType?: MediaType;
}

export interface MediaGroupDef {
  id: string;
  label: string;
  note?: string;
  slots: MediaSlotDef[];
}

const img = (
  key: string,
  label: string,
  defaultUrl: string,
): MediaSlotDef => ({ key, label, accept: "image", defaultUrl });

export const MEDIA_GROUPS: MediaGroupDef[] = [
  {
    id: "home-hero",
    label: "Homepage — Hero",
    note: "Background photo and the foreground media (image or video).",
    slots: [
      img("home.hero.background", "Background image", "/images/hero/hero-background.jpg"),
      {
        key: "home.hero.media",
        label: "Foreground image / video",
        accept: "both",
        defaultUrl: "/videos/hero-placeholder.mp4",
        defaultType: "video",
      },
    ],
  },
  {
    id: "home-marquee",
    label: "Homepage — Explore the Collection",
    note: "Up to 12 images scroll across the marquee. Empty slots are skipped.",
    slots: [
      img("home.marquee.1", "Image 1", "/images/teasers/curtains.jpg"),
      img("home.marquee.2", "Image 2", "/images/gallery/g2.jpg"),
      img("home.marquee.3", "Image 3", "/images/teasers/upholstery.jpg"),
      img("home.marquee.4", "Image 4", "/images/gallery/g4.jpg"),
      img("home.marquee.5", "Image 5", "/images/teasers/outdoor.jpg"),
      img("home.marquee.6", "Image 6", "/images/gallery/g6.jpg"),
      img("home.marquee.7", "Image 7", ""),
      img("home.marquee.8", "Image 8", ""),
      img("home.marquee.9", "Image 9", ""),
      img("home.marquee.10", "Image 10", ""),
      img("home.marquee.11", "Image 11", ""),
      img("home.marquee.12", "Image 12", ""),
    ],
  },
  {
    id: "home-gallery",
    label: "Homepage — Gallery (A Curated Collection)",
    note: "Six bento tiles. Tile 1 is the large feature tile. Each tile accepts an image or a video.",
    slots: [
      {
        key: "home.gallery.1",
        label: "Tile 1 (large)",
        accept: "both",
        defaultUrl: "/videos/hero-placeholder.mp4",
        defaultType: "video",
      },
      { key: "home.gallery.2", label: "Tile 2", accept: "both", defaultUrl: "/images/gallery/g2.jpg" },
      { key: "home.gallery.3", label: "Tile 3", accept: "both", defaultUrl: "/images/gallery/g3.jpg" },
      { key: "home.gallery.4", label: "Tile 4", accept: "both", defaultUrl: "/images/gallery/g4.jpg" },
      { key: "home.gallery.5", label: "Tile 5", accept: "both", defaultUrl: "/images/gallery/g5.jpg" },
      { key: "home.gallery.6", label: "Tile 6", accept: "both", defaultUrl: "/images/gallery/g6.jpg" },
    ],
  },
  {
    id: "home-fabrics",
    label: "Homepage — Our Fabrics",
    slots: [
      img("home.fabric.curtains", "Curtains", "/images/teasers/curtains.jpg"),
      img("home.fabric.upholstery", "Upholstery", "/images/teasers/upholstery.jpg"),
      img("home.fabric.outdoor", "Outdoor Fabric", "/images/teasers/outdoor.jpg"),
    ],
  },
  {
    id: "about",
    label: "About Page",
    slots: [
      img("about.hero", "Hero banner", "/images/about/about-hero.jpg"),
      img("about.philosophy", "Philosophy image", "/images/about/about-philosophy.jpg"),
      img("about.collection.curtains", "Collection — Curtains", "/images/teasers/curtains.jpg"),
      img("about.collection.upholstery", "Collection — Upholstery", "/images/teasers/upholstery.jpg"),
      img("about.collection.outdoor", "Collection — Outdoor", "/images/teasers/outdoor.jpg"),
    ],
  },
  {
    id: "feat-pet",
    label: "Feature — Pet Friendly",
    slots: [
      img("feature.pet-friendly.hero", "Hero banner", "/images/features/pet-friendly-hero.jpg"),
      img("feature.pet-friendly.intro", "Intro image", "/images/features/pet-friendly-life.jpg"),
    ],
  },
  {
    id: "feat-fire",
    label: "Feature — Fire Retardant",
    slots: [
      img("feature.fire-retardant.hero", "Hero banner", "/images/features/fire-retardant-hero.jpg"),
      img("feature.fire-retardant.intro", "Intro image", "/images/features/fire-retardant-space.jpg"),
    ],
  },
  {
    id: "feat-leather",
    label: "Feature — Leather Finish",
    slots: [
      img("feature.leather-finish.hero", "Hero banner", "/images/features/leather-finish-hero.jpg"),
      img("feature.leather-finish.intro", "Intro image", "/images/features/leather-finish-detail.jpg"),
    ],
  },
  {
    id: "feat-easy",
    label: "Feature — Easy to Clean",
    slots: [
      img("feature.easy-to-clean.hero", "Hero banner", "/images/features/easy-clean-hero.jpg"),
      img("feature.easy-to-clean.intro", "Intro image", "/images/features/easy-clean-life.jpg"),
    ],
  },
];

export const MEDIA_SLOTS: Record<string, MediaSlotDef> = Object.fromEntries(
  MEDIA_GROUPS.flatMap((g) => g.slots).map((s) => [s.key, s]),
);

export type MediaMap = Record<string, { url: string; type: MediaType }>;
export interface ResolvedMedia {
  url: string;
  type: MediaType;
}

/** Resolve a slot to its admin value, or the bundled default. */
export function resolveMedia(map: MediaMap, key: string): ResolvedMedia {
  const def = MEDIA_SLOTS[key];
  const set = map[key];
  if (set?.url) return { url: set.url, type: set.type };
  return { url: def?.defaultUrl ?? "", type: def?.defaultType ?? "image" };
}
