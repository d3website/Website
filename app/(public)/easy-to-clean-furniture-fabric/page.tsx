import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteMedia } from "@/lib/data/site-media";
import { resolveMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: { absolute: "Stylish Easy to Clean Furniture Fabrics | D3" },
  description:
    "Easy-to-clean furniture fabrics from Dynamic Designs Decor — refined design and practical, low-maintenance performance for interiors made to be lived in.",
};

const features = [
  {
    title: "Made for Everyday Living",
    body: [
      "Life happens — especially around the furniture we use every day.",
      "Our easy-to-clean fabrics are selected with everyday living in mind, helping your upholstery stay looking fresh while making routine maintenance easier.",
    ],
  },
  {
    title: "Less Worry, More Living",
    body: [
      "Spills and everyday marks don’t have to become a reason to worry about your furniture.",
      "Easy-care fabric options make maintenance simpler, giving you greater freedom to enjoy your sofa, chairs and other upholstered pieces.",
    ],
  },
  {
    title: "Style Without Compromise",
    body: [
      "Practical doesn’t have to mean plain.",
      "Explore sophisticated textures, contemporary colours and versatile patterns designed to complement everything from modern interiors to timeless spaces.",
    ],
  },
  {
    title: "Comfort Meets Performance",
    body: [
      "A fabric can be practical and still feel luxurious.",
      "Our collection offers a balance of comfort, texture and performance, helping you create furniture that looks inviting and feels just as good.",
    ],
  },
  {
    title: "Quality You Can Trust",
    body: [
      "Every fabric is carefully selected for its combination of design, usability and quality.",
      "Whether you’re furnishing a home, specifying a project or creating bespoke furniture, our team can help you find an option suited to your requirements.",
    ],
  },
];

export default async function EasyToCleanPage() {
  const media = await getSiteMedia();
  const heroImg = resolveMedia(media, "feature.easy-to-clean.hero").url;
  const introImg = resolveMedia(media, "feature.easy-to-clean.intro").url;

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 text-center">
        <PageHeader
          eyebrow="Easy-to-Clean Furniture Fabrics"
          title="Beautifully Designed. Effortlessly Easy to Live With."
          align="center"
        />
      </section>

      {/* Hero image */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={heroImg}
            alt="Easy-to-clean furniture fabrics"
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </section>

      {/* Intro — two column */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <Image
              src={introImg}
              alt="Furniture made to be lived in"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="font-serif text-2xl italic text-foreground">
              Furniture should look beautiful without making everyday life
              complicated.
            </p>
            <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
              <p>
                At Dynamic Designs Decor, our collection of easy-to-clean
                furniture fabrics brings together refined design, practical
                performance and lasting comfort — helping you create interiors
                that look sophisticated while being easier to maintain.
              </p>
              <p>
                From everyday spills to the little marks that come with real
                life, these fabrics are selected to make caring for your
                furniture simpler, without compromising on the style or feel of
                your space.
              </p>
            </div>
            <p className="mt-6 border-l-2 border-gold pl-5 font-serif text-xl italic text-foreground">
              Because beautiful furniture should be enjoyed, not constantly
              protected.
            </p>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Why Choose</p>
            <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
              Why Choose Easy-to-Clean Fabrics?
            </h2>
            <div className="mt-4 h-px w-14 bg-gold" />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border bg-card p-6 transition-colors hover:border-gold/50"
              >
                <h3 className="text-lg font-medium">{f.title}</h3>
                <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                  {f.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where everyday living meets effortless style */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center lg:py-20">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Where Everyday Living Meets Effortless Style
        </h2>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-5 leading-relaxed text-muted-foreground">
          <p>A beautiful sofa shouldn’t need to be treated like a showpiece.</p>
          <p>
            Whether you’re enjoying coffee on a quiet morning, hosting friends
            for dinner or simply settling in at the end of a long day, your
            furniture is meant to be lived in.
          </p>
          <p>
            Our easy-to-clean fabrics are designed for spaces where comfort,
            style and everyday life come together.
          </p>
          <p>Because the best interiors aren’t just beautiful when they’re new.</p>
        </div>
        <p className="mx-auto mt-8 font-serif text-2xl italic text-foreground">
          They’re beautiful when they’re lived in.
        </p>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <div className="flex flex-col items-start gap-5 rounded-xl border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-medium">
              Find a Fabric That Works for Your Space
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover our collection of easy-to-clean furniture fabrics and find
              the textures, colours and designs that bring your space together.
            </p>
          </div>
          <div className="flex gap-3">
            <Button nativeButton={false} render={<Link href="/catalogue" />}>
              Browse fabrics
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
