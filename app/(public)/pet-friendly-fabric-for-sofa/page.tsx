import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/content";
import { getSiteMedia } from "@/lib/data/site-media";
import { resolveMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: { absolute: "Pet Friendly Fabric for Sofa in India | D3" },
  description:
    "Pet-friendly upholstery fabrics from Dynamic Designs Decor — refined design, easy-care practicality and lasting comfort for beautiful homes shared with pets.",
};

const features = [
  {
    title: "Made for Everyday Living",
    body: "Thoughtfully selected fabrics designed to handle the everyday demands of a home with pets, while maintaining their refined appearance.",
  },
  {
    title: "Easy to Live With",
    body: "Practical, easy-care options make everyday spills, marks and maintenance simpler — so you can spend less time worrying about your furniture.",
  },
  {
    title: "Style Without Compromise",
    body: "Pet-friendly does not have to look utilitarian. Discover sophisticated textures, colours and patterns created to complement contemporary and timeless interiors.",
  },
  {
    title: "Comfort They’ll Love",
    body: "Soft, inviting textures create a comfortable place for your pets to rest, relax and feel at home.",
  },
  {
    title: "Quality You Can Trust",
    body: "Every fabric in our collection is carefully selected for its combination of aesthetic appeal, performance and quality, helping you choose with confidence.",
  },
];

export default async function PetFriendlyPage() {
  const media = await getSiteMedia();
  const heroImg = resolveMedia(media, "feature.pet-friendly.hero").url;
  const introImg = resolveMedia(media, "feature.pet-friendly.intro").url;

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 text-center">
        <PageHeader
          eyebrow="Pet-Friendly Fabrics"
          title="Beautifully Designed for Life With Pets"
          align="center"
        />
      </section>

      {/* Hero image */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={heroImg}
            alt="Pet-friendly upholstery fabrics"
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
              alt="A home lived in with pets"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="font-serif text-2xl italic text-foreground">
              Luxury should be lived in.
            </p>
            <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
              <p>
                At Dynamic Designs Decor, we believe a beautiful home should also
                be a comfortable one — for every member of the family, including
                the four-legged ones.
              </p>
              <p>
                Our collection of pet-friendly upholstery fabrics brings together
                refined design, everyday practicality and lasting comfort,
                allowing you to create sophisticated interiors without worrying
                about the realities of life with pets.
              </p>
              <p>
                From elegant textures to versatile tones and easy-care
                constructions, these fabrics are selected to complement
                beautifully considered spaces while standing up to everyday
                living.
              </p>
            </div>
            <p className="mt-6 border-l-2 border-gold pl-5 font-serif text-xl italic text-foreground">
              Designed for homes that are truly lived in.
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
              Why Choose Pet-Friendly Fabrics?
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where luxury meets real life */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center lg:py-20">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Where Luxury Meets Real Life
        </h2>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-5 leading-relaxed text-muted-foreground">
          <p>A beautiful sofa shouldn’t have to be off-limits.</p>
          <p>
            Whether it’s a quiet afternoon with your dog curled up beside you or
            a cat claiming its favourite corner of the room, our pet-friendly
            fabrics are designed for homes where life happens.
          </p>
          <p>
            Because the most beautiful spaces aren’t simply made to be admired.
          </p>
        </div>
        <p className="mx-auto mt-8 font-serif text-2xl italic text-foreground">
          They’re made to be lived in.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <div className="flex flex-col items-start gap-5 rounded-xl border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-medium">
              Ready to explore our collections?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse our fabrics or get in touch on {company.phone}.
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
