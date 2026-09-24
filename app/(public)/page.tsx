import type { Metadata } from "next";
import { stats } from "@/lib/content";
import { getSiteMedia } from "@/lib/data/site-media";
import { resolveMedia } from "@/lib/media";
import { FabricCard } from "@/components/ui/fabric-card";
import { FractalBloomCanvas } from "@/components/ui/fractal-bloom";
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

      {/* Intro / brand blurb — dark editorial moment with a growing fractal */}
      <section className="relative isolate overflow-hidden bg-[#1c1917] text-[#f5f0e8]">
        <FractalBloomCanvas className="absolute inset-0 z-0 h-full w-full" />
        {/* Vignette so the copy stays legible over the branches */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(28,25,23,0.35)_0%,rgba(28,25,23,0.75)_65%,rgba(28,25,23,0.95)_100%)]" />
        <div className="relative z-20 mx-auto w-full max-w-3xl px-6 py-28 text-center sm:py-32">
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-5 text-3xl font-medium sm:text-4xl">
            Curators of Distinctive Furnishing Textiles
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-[#d8cfc2]">
            D3 crafts premier interior fabrics designed to transform spaces from
            the ground up. We believe true luxury lies in effortless comfort —
            merging runway-inspired aesthetics with understated simplicity to
            create environments that welcome you in.
          </p>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-xl italic text-[#c9beac]">
            “An empty room is a story waiting to happen, and you are the author.”
          </p>
          <p className="eyebrow mt-3">Charlotte Moss</p>
        </div>
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
              <p className="font-serif text-4xl font-medium tabular-nums lining-nums sm:text-5xl">
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
