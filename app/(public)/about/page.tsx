import type { Metadata } from "next";
import Image from "next/image";
import { stats } from "@/lib/content";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Dynamic Designs Decor (D3) — a premium furnishing-fabric brand founded in Dubai in 2019, curating curtain, upholstery and outdoor fabrics for beautifully considered spaces.",
};

const collections = [
  {
    title: "Curtain Fabrics",
    body: "Elegant sheers, sophisticated drapes and statement textiles designed to frame a space beautifully.",
    image: "/images/teasers/curtains.jpg",
  },
  {
    title: "Upholstery Fabrics",
    body: "Rich textures, refined patterns and durable constructions created to bring character and comfort to furniture.",
    image: "/images/teasers/upholstery.jpg",
  },
  {
    title: "Outdoor Fabrics",
    body: "Beautiful, functional textiles designed to extend sophisticated interiors into outdoor living spaces.",
    image: "/images/teasers/outdoor.jpg",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 text-center">
        <PageHeader
          eyebrow="Our Story"
          title="About Dynamic Designs Decor"
          align="center"
        />
      </section>

      {/* Hero image */}
      <section className="mx-auto mt-10 w-full max-w-6xl px-6">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src="/images/about/about-hero.jpg"
            alt="D3 furnishing fabrics"
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Where Fabric Becomes Part of the Story
        </h2>
        <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
          <p>
            Dynamic Designs Decor, known as D3, is a premium furnishing-fabric
            brand built around a simple belief: the right fabric can transform
            the way a space feels.
          </p>
          <p>
            Our journey began in 2019 in Dubai, under the banner of Dynamic
            Fabrics FZCO. In 2021, D3 established its presence in India under
            Dynamic Designs Decor LLP, bringing together an appreciation for
            refined design, quality textiles and thoughtful interiors.
          </p>
          <p>
            Today, D3 brings together a team of industry professionals,
            designers and fabric specialists with a shared passion for
            exceptional materials and evolving design. We continuously explore
            new textures, patterns, colours and finishes to create collections
            that balance timeless elegance with contemporary expression.
          </p>
          <p>
            From sophisticated curtains and refined upholstery to versatile
            outdoor fabrics, our collections are carefully selected for
            designers, architects, interior professionals and homeowners who
            value quality and individuality.
          </p>
          <p>
            Whether the brief calls for understated neutrals, expressive
            patterns, rich textures or functional performance fabrics, our
            collection is designed to offer the freedom to create spaces that
            feel distinctly their own.
          </p>
        </div>
        <p className="mt-8 border-l-2 border-gold pl-5 font-serif text-xl italic text-foreground">
          From a single metre to a complete interior, every project deserves
          exceptional fabric.
        </p>
      </section>

      {/* Our Philosophy */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 lg:py-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
            <Image
              src="/images/about/about-philosophy.jpg"
              alt="Considered fabrics and finishes"
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <Eyebrow>Our Philosophy</Eyebrow>
            <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
              Designed to Elevate Everyday Living
            </h2>
            <div className="mt-6 flex flex-col gap-5 leading-relaxed text-muted-foreground">
              <p>
                We believe luxury is not simply about how something looks. It is
                about how it feels, how it lives and how it lasts.
              </p>
              <p>
                That philosophy guides everything we do — from the fabrics we
                source and the collections we curate to the way we work with our
                customers.
              </p>
              <p>
                We look beyond fleeting trends to discover fabrics that bring
                depth, warmth, character and enduring beauty to interiors.
              </p>
              <p>
                Our goal is simple: to make exceptional design more accessible,
                one beautiful fabric at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Collections */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <Eyebrow>Our Collections</Eyebrow>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
            Fabrics for Beautifully Considered Spaces
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Our collections encompass a carefully curated selection of:
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {collections.map((c) => (
            <div
              key={c.title}
              className="overflow-hidden rounded-xl border bg-card"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl leading-relaxed text-muted-foreground">
          Across every collection, we seek the same qualities — exceptional
          texture, considered colour, distinctive design and enduring quality.
        </p>
      </section>

      {/* Our Reach + stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center lg:py-20">
          <Eyebrow>Our Reach</Eyebrow>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
            Creating Spaces, One Fabric at a Time
          </h2>
          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-5 leading-relaxed text-muted-foreground">
            <p>
              From individual residences to expansive hospitality and commercial
              projects, D3 fabrics have found their place in spaces designed to
              be lived in, experienced and remembered.
            </p>
            <p>
              Our growing presence across markets reflects a shared appreciation
              for quality, design and thoughtful interiors.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl font-medium sm:text-5xl">
                  {s.value}
                </p>
                <p className="eyebrow mt-3">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-8">
            <Eyebrow>Our Mission</Eyebrow>
            <h2 className="mt-4 text-2xl font-medium sm:text-3xl">
              To Make Every Space More Beautiful
            </h2>
            <div className="mt-5 flex flex-col gap-4 leading-relaxed text-muted-foreground">
              <p>
                Our mission is to inspire better interiors through exceptional
                fabrics.
              </p>
              <p>
                We aspire to bring beauty, comfort and individuality to homes and
                spaces everywhere — creating collections that allow every room to
                express its own character.
              </p>
              <p>
                From the smallest detail to the defining element of an interior,
                we believe every space deserves to be thoughtfully considered.
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-8">
            <Eyebrow>Our Vision</Eyebrow>
            <h2 className="mt-4 text-2xl font-medium sm:text-3xl">
              A World Shaped by Beautiful Interiors
            </h2>
            <div className="mt-5 flex flex-col gap-4 leading-relaxed text-muted-foreground">
              <p>
                To become a trusted name in soft furnishings and furnishing
                fabrics, known for exceptional design, uncompromising quality and
                a deep understanding of the way people live.
              </p>
              <p>
                We envision a world where beautifully considered fabrics are at
                the heart of every inspiring interior — bringing together
                comfort, craftsmanship and contemporary design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 text-center">
          <h2 className="text-3xl font-medium sm:text-4xl">
            Made for Spaces That Matter
          </h2>
          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-5 leading-relaxed text-muted-foreground">
            <p>
              A home is more than the space around us. It is where life happens.
            </p>
            <p>
              At D3, we create and curate fabrics that become part of those
              moments — adding texture to a room, warmth to a home and character
              to the spaces we live in.
            </p>
          </div>
          <div className="mx-auto mt-8 h-px w-14 bg-gold" />
          <p className="mt-8 font-serif text-2xl italic text-foreground">
            Dynamic Designs Decor.
          </p>
          <p className="eyebrow mt-2">Fabrics for beautifully considered spaces</p>
        </div>
      </section>
    </main>
  );
}
