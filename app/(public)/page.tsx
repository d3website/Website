import type { Metadata } from "next";
import { stats } from "@/lib/content";
import { FabricCard } from "@/components/ui/fabric-card";
import HomepageHero from "./_components/homepage-hero";
import HomepageCollection from "./_components/homepage-collection";
import HomepageGallery from "./_components/homepage-gallery";
import HomepageCta from "./_components/homepage-cta";

export const metadata: Metadata = {
  title: "Premium Home Decor Fabric Selections",
  description:
    "Dynamic Designs Decor (D3) — a leading stockist of curtain, upholstery and outdoor furnishing fabrics in the MENA region, with thousands of collections.",
};

const teasers = [
  {
    title: "Curtains",
    subtitle: "Jacquards, sheers & elegant drapes",
    href: "/curtains",
    imageUrl: "/images/teasers/curtains.jpg",
    themeColor: "26 32% 19%",
  },
  {
    title: "Upholstery",
    subtitle: "Sofa & seating fabrics",
    href: "/upholstery",
    imageUrl: "/images/teasers/upholstery.jpg",
    themeColor: "32 24% 24%",
  },
  {
    title: "Outdoor Fabric",
    subtitle: "Durable, weather-ready textiles",
    href: "/outdoor-fabric",
    imageUrl: "/images/teasers/outdoor.jpg",
    themeColor: "40 30% 24%",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Scroll-expansion hero (docs/D3-Dynamic-Hero-Component-Spec.md).
          Placeholder media until real hero video/photography is provided. */}
      <HomepageHero />

      {/* Collection section — animated marquee hero */}
      <HomepageCollection />

      {/* Interactive bento gallery (placeholder media) */}
      <HomepageGallery />

      {/* Intro / brand blurb */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">Who we are</p>
        <h2 className="mt-5 text-3xl font-medium sm:text-4xl">
          Best specializing in furnishing materials
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          Founded in Dubai in 2019 and present in India since 2021, “D3” is one
          of the top brands specializing in furnishing materials. Our goal is to
          have our products inspire comfort — to make you feel at home wherever
          you are, with the newest blend of fashion trends and simplicity.
        </p>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-xl italic text-muted-foreground">
          “An empty home is a story waiting to happen and you are the author.”
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
