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
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {company.legalName}
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {company.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A stockist of curtain, upholstery and outdoor furnishing fabrics in
            the MENA region — with thousands of collections to choose from.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button nativeButton={false} render={<Link href="/catalogue" />}>
              Browse fabrics
            </Button>
            <Button
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
      <section className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">
          Best specializing in furnishing materials
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
          Founded in Dubai in 2019 and present in India since 2021, “D3” is one
          of the top brands specializing in furnishing materials. Our goal is to
          have our products inspire comfort — to make you feel at home wherever
          you are, with the newest blend of fashion trends and simplicity.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-sm italic text-muted-foreground">
          “An empty home is a story waiting to happen and you are the author.” —
          Charlotte Moss
        </p>
      </section>

      {/* Product teasers */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {teasers.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-xl border p-8 transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              <span className="mt-4 inline-block text-sm font-medium group-hover:underline">
                Explore {t.title.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-12 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">
          Curtain &amp; upholstery fabrics for every space
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Committed to unparalleled customer service and impeccable quality, and
          becoming the largest furnishing fabrics company in the world.
        </p>
        <div className="mt-8 flex justify-center">
          <Button nativeButton={false} render={<Link href="/contact" />}>
            Get in touch
          </Button>
        </div>
      </section>
    </main>
  );
}
