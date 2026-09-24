import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: { absolute: "Fire Retardant Fabric Suppliers in India | D3" },
  description:
    "Fire retardant furnishing fabrics from Dynamic Designs Decor — considered design and enhanced fire-performance for hospitality, commercial, residential and contract interiors.",
};

const features = [
  {
    title: "Designed With Safety in Mind",
    body: [
      "Our fire retardant fabrics are selected for applications where resistance to ignition and fire-performance requirements are an important part of the specification.",
      "Depending on the application and market, upholstery fabrics may be assessed against standards such as EN 1021 and BS 5852. The appropriate requirement depends on the intended use and project specification.",
    ],
  },
  {
    title: "Performance Without Compromising Style",
    body: [
      "Fire retardant does not have to mean functional-looking.",
      "Explore a considered selection of textures, colours and patterns designed to complement contemporary hospitality, commercial, residential and contract interiors.",
    ],
  },
  {
    title: "Built for Demanding Spaces",
    body: [
      "From upholstered seating and sofas to hospitality and commercial interiors, our fabrics are selected with performance and everyday use in mind.",
      "Durability, appearance and maintenance are considered alongside fire performance to help create fabrics that work beautifully over time.",
    ],
  },
  {
    title: "Specification Support",
    body: [
      "Choosing the right fabric involves more than selecting a colour.",
      "Our team can help you identify suitable fabric options based on your application, performance requirements, design direction and project specifications — making the specification process simpler and more informed.",
    ],
  },
];

export default function FireRetardantPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 text-center">
        <PageHeader
          eyebrow="Fire Retardant Fabrics"
          title="Designed for Beautiful Spaces. Specified for Safety."
          align="center"
        />
      </section>

      {/* Hero image */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src="/images/features/fire-retardant-hero.jpg"
            alt="Fire retardant furnishing fabrics"
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
              Performance should never come at the expense of design.
            </p>
            <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
              <p>
                At Dynamic Designs Decor, we believe safety and beauty belong
                together. Our fire retardant fabric collection brings together
                considered aesthetics and enhanced fire-performance
                requirements, giving designers, architects, furniture
                manufacturers and commercial spaces access to fabrics that are
                made for demanding environments.
              </p>
              <p>
                From sophisticated upholstery textures to versatile colours and
                contemporary designs, our collection is selected to help you
                create interiors that feel as beautiful as they perform.
              </p>
            </div>
            <p className="mt-6 border-l-2 border-gold pl-5 font-serif text-xl italic text-foreground">
              Because safety should be part of the design — not an afterthought.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted md:order-first">
            <Image
              src="/images/features/fire-retardant-space.jpg"
              alt="A considered contract interior"
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
              Why Choose Fire Retardant Fabrics?
            </h2>
            <div className="mt-4 h-px w-14 bg-gold" />
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
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

      {/* Performance meets design */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center lg:py-20">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Performance Meets Design
        </h2>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-5 leading-relaxed text-muted-foreground">
          <p>A beautiful interior should also be a responsible one.</p>
          <p>
            Whether you’re specifying fabrics for a hotel, restaurant, office,
            residential development or bespoke furniture project, the right
            fabric can bring together aesthetics, comfort and performance.
          </p>
          <p>
            Our fire retardant collection gives you more possibilities when
            designing spaces where safety requirements are an essential part of
            the brief.
          </p>
        </div>
        <p className="mx-auto mt-8 font-serif text-2xl italic text-foreground">
          Thoughtfully specified. Beautifully designed. Made for real spaces.
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
