import type { Metadata } from "next";
import { stats } from "@/lib/content";
import { getSiteMedia } from "@/lib/data/site-media";
import { resolveMedia } from "@/lib/media";
import { FabricCard } from "@/components/ui/fabric-card";
import HomepageHero from "./_components/homepage-hero";
import HomepageCollection from "./_components/homepage-collection";
import HomepageGallery from "./_components/homepage-gallery";
import HomepageArrivals from "./_components/homepage-arrivals";
import HomepageCta from "./_components/homepage-cta";

export const metadata: Metadata = {
  title: "Premium Home Decor Fabric Selections",
  description:
    "Dynamic Designs Decor (D3) — a leading stockist of curtain, upholstery and outdoor furnishing fabrics in the MENA region, with thousands of collections.",
};

const teaserMeta = [
  { title: "Curtains", subtitle: "Jacquards, sheers & elegant drapes", href: "/curtains", slot: "home.fabric.curtains", themeColor: "26 32% 19%" },
  { title: "Upholstery", subtitle: "Sofa & seating fabrics", href: "/upholstery", slot: "home.fabric.upholstery", themeColor: "32 24% 24%" },
  { title: "Outdoor Fabric", subtitle: "Durable, weather-ready textiles", href: "/outdoor-fabric", slot: "home.fabric.outdoor", themeColor: "40 30% 24%" },
];

export default async function HomePage() {
  const media = await getSiteMedia();

  const heroBg = resolveMedia(media, "home.hero.background").url;
  const heroMedia = resolveMedia(media, "home.hero.media");

  const marqueeImages = Array.from({ length: 12 }, (_, i) =>
    resolveMedia(media, `home.marquee.${i + 1}`).url,
  ).filter(Boolean);

  const galleryMedia = Array.from({ length: 6 }, (_, i) =>
    resolveMedia(media, `home.gallery.${i + 1}`),
  );

  const teasers = teaserMeta.map((t) => ({
    ...t,
    imageUrl: resolveMedia(media, t.slot).url,
  }));

  return (
    <main className="flex flex-1 flex-col">
      <HomepageHero
        background={heroBg}
        media={heroMedia.url}
        mediaType={heroMedia.type}
      />

      <HomepageCollection images={marqueeImages} />

      <HomepageGallery media={galleryMedia} />

      {/* Intro / brand blurb */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">Who we are</p>
        <h2 className="mt-5 text-3xl font-medium sm:text-4xl">
          Curators of Distinctive Furnishing Textiles
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          D3 crafts premier interior fabrics designed to transform spaces from
          the ground up. We believe true luxury lies in effortless comfort —
          merging runway-inspired aesthetics with understated simplicity to
          create environments that welcome you in.
        </p>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-xl italic text-muted-foreground">
          “An empty room is a story waiting to happen, and you are the author.”
        </p>
        <p className="eyebrow mt-3">Charlotte Moss</p>
      </section>

      {/* Product teasers — fabric category cards */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="mb-10 text-center">
          <p className="eyebrow">Explore</p>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">Our Fabrics</h2>
          <div className="mx-auto mt-4 h-px w-14 bg-gold" />
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {teasers.map((t) => (
            <FabricCard key={t.href} {...t} />
          ))}
        </div>
      </section>

      {/* New Arrivals — admin-managed 3D cards (renders when arrivals exist) */}
      <HomepageArrivals />

      {/* Stats bar */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-4xl font-medium sm:text-5xl">
                {s.value}
              </p>
              <p className="eyebrow mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA — animated rotating-word headline */}
      <HomepageCta />
    </main>
  );
}
