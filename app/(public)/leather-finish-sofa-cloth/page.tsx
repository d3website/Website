import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: { absolute: "Leather Finish Sofa Cloth | D3" },
  description:
    "Leather finish sofa cloth from Dynamic Designs Decor — the distinctive character of leather with the versatility and comfort of upholstery fabric.",
};

const features = [
  {
    title: "A Sophisticated Leather-Look Finish",
    body: [
      "Create the distinctive visual appeal of leather with fabrics designed to add richness and character to your furniture.",
      "From subtle finishes to more pronounced leather-inspired textures, the collection offers options for a range of interior styles.",
    ],
  },
  {
    title: "Style With Everyday Practicality",
    body: [
      "Furniture should look beautiful and still be comfortable to live with.",
      "Our collection combines a sophisticated appearance with the practical versatility of upholstery fabric, making it suitable for a variety of residential and commercial interiors.",
    ],
  },
  {
    title: "Rich Textures & Contemporary Colours",
    body: [
      "The right upholstery can transform an entire room.",
      "Explore a considered selection of colours, textures and finishes designed to complement modern interiors, statement furniture and timeless spaces.",
    ],
  },
  {
    title: "Comfort That Invites You In",
    body: [
      "Sophisticated doesn’t have to mean formal.",
      "Leather finish fabrics bring visual richness to your furniture while retaining the welcoming quality expected from upholstered seating.",
    ],
  },
  {
    title: "Made for Beautiful Furniture",
    body: [
      "Whether you’re refreshing an existing sofa, creating bespoke furniture or specifying upholstery for a larger interior project, the right fabric can define the character of the finished piece.",
      "Our team can help you explore options based on your design, application and performance requirements.",
    ],
  },
];

export default function LeatherFinishPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 text-center">
        <PageHeader
          eyebrow="Leather Finish Sofa Cloth"
          title="The Look of Leather. The Comfort of Fabric."
          align="center"
        />
      </section>

      {/* Hero image */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src="/images/features/leather-finish-hero.jpg"
            alt="Leather finish sofa cloth"
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
          <div>
            <p className="font-serif text-2xl italic text-foreground">
              Great furniture brings together sophistication, comfort and
              everyday practicality.
            </p>
            <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
              <p>
                At Dynamic Designs Decor, our leather finish sofa cloth
                collection captures the distinctive character of leather while
                retaining the versatility and inviting feel of upholstery fabric.
                With rich textures, refined finishes and contemporary colours,
                these fabrics bring depth and character to sofas, chairs and
                other upholstered furniture.
              </p>
              <p>
                Designed for interiors that call for a sophisticated finish
                without losing the comfort of fabric.
              </p>
            </div>
            <p className="mt-6 border-l-2 border-gold pl-5 font-serif text-xl italic text-foreground">
              A refined alternative for beautifully considered spaces.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted md:order-first">
            <Image
              src="/images/features/leather-finish-detail.jpg"
              alt="Rich leather-look upholstery texture"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Why Choose</p>
            <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
              Why Choose Leather Finish Sofa Cloth?
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

      {/* Where character meets comfort */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center lg:py-20">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Where Character Meets Comfort
        </h2>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-5 leading-relaxed text-muted-foreground">
          <p>There is something timeless about the look of leather.</p>
          <p>
            Its depth, texture and understated sophistication can instantly give
            a piece of furniture more presence. Our leather finish sofa cloth
            collection takes inspiration from that distinctive aesthetic and
            brings it into a versatile fabric format.
          </p>
          <p>
            Use it to create a statement sofa, add character to an occasional
            chair or bring a more refined finish to an entire interior.
          </p>
        </div>
        <p className="mx-auto mt-8 font-serif text-2xl italic text-foreground">
          Sophisticated in appearance. Comfortable in character. Designed to be
          lived with.
        </p>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-20">
        <div className="flex flex-col items-start gap-5 rounded-xl border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-medium">
              Find the Right Finish for Your Furniture
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore our leather finish sofa cloth collection and discover
              textures, colours and finishes designed to give your furniture a
              distinctive character.
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
