import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { company, stats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Premium Home Decor Fabric Selections",
  description:
    "Dynamic Designs Decor (D3) — a leading stockist of curtain, upholstery and outdoor furnishing fabrics in the MENA region, with thousands of collections.",
};

const teasers = [
  {
    title: "Curtain Fabric",
    body: "Gorgeous jacquards in a symphony of patterns and colours, chosen carefully to match the state of an elegant interior.",
    href: "/curtains",
  },
  {
    title: "Upholstery Fabric",
    body: "Be part of an experience like no other, with our distinctively sophisticated collection of prints, weaves and textures.",
    href: "/upholstery",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/*
        PHASE 3 HERO SLOT.
        In Phase 3 this band is replaced by the scroll-expansion hero
        (see docs/D3-Dynamic-Hero-Component-Spec.md → HomepageHero), which
        needs real hero photography and the Stitch design. Simple band for now.
      */}
      <section className="border-b border-border/60 bg-muted/40">
        <div className="mx-auto flex min-h-[78vh] max-w-4xl flex-col items-center justify-center px-6 py-28 text-center">
          <p className="eyebrow">{company.legalName}</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-medium sm:text-6xl md:text-7xl">
            {company.tagline}
          </h1>
          <div className="mt-8 h-px w-16 bg-gold" />
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A stockist of curtain, upholstery and outdoor furnishing fabrics in
            the MENA region — with thousands of collections to choose from.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/catalogue" />}>
              Browse fabrics
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/about" />}
            >
              About D3
            </Button>
          </div>
        </div>
      </section>

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

      {/* Product teasers */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {teasers.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-md border bg-card p-10 transition-colors hover:border-gold/60"
            >
              <h3 className="text-2xl font-medium">{t.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.body}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold">
                Explore {t.title.toLowerCase()}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
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

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Curtain &amp; upholstery fabrics for every space
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          Committed to unparalleled customer service and impeccable quality, and
          becoming the largest furnishing fabrics company in the world.
        </p>
        <div className="mt-10 flex justify-center">
          <Button size="lg" nativeButton={false} render={<Link href="/contact" />}>
            Get in touch
          </Button>
        </div>
      </section>
    </main>
  );
}
