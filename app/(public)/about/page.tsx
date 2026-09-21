import type { Metadata } from "next";
import { stats } from "@/lib/content";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Dynamic Designs Decor (D3) — a leading furnishing fabrics brand founded in Dubai in 2019, with operations in India since 2021.",
};

const MISSION = [
  "Enhancing the aesthetics of residences in every neighbourhood, every city, and every nation on earth.",
  "Adding an inch of beauty to every home across the country.",
  "Embellishing houses on every street, in every city, and in every nation.",
];

const VISION = [
  "To provide comfortable soft-furnishing choices across the globe.",
  "Becoming the ultimate choice for soft-furnishing solutions across the globe.",
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <PageHeader eyebrow="Our Story" title="About Dynamic Designs Decor" />

      <div className="mt-10 flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground">
        <p>
          Dynamic Designs Decor is one of the leading brands specializing in
          furnishing fabrics. Founded in 2019 under the banner of Dynamic Fabrics
          FZCO, it earned the title Dynamic Designs Decor, or “D3”, from its
          headquarters in Dubai, United Arab Emirates. The history of “D3” in
          India started in 2021 under the banner of Dynamic Designs Decor LLP.
        </p>
        <p>
          Today, “D3” is recognised both nationally and internationally. Our
          business is run by a group of professionals with extensive industry
          understanding. Our teams of skilled designers share a desire to be on
          the cutting edge of evolving trends, always looking for the latest and
          most creative ideas for you. We provide textiles in a variety of
          styles — from classic and modern patterns to functional plains — with
          our elegant colour palettes.
        </p>
        <p>
          D3 is a major supplier of premium curtains, upholstery and outdoor
          fabrics, with a global presence spanning three nations. We have a
          solid reputation for offering cutting-edge and fashionable items that
          satisfy the expectations of our clients. Depending on your specific
          requirements, we accept fabric orders from one metre upward.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-8 border-y py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-4xl font-medium sm:text-5xl">
              {s.value}
            </p>
            <p className="eyebrow mt-3">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <section className="rounded-lg border bg-card p-8">
          <p className="eyebrow">Our Mission</p>
          <ul className="mt-5 flex flex-col gap-3 text-muted-foreground">
            {MISSION.map((m) => (
              <li key={m} className="border-l-2 border-gold/50 pl-4">
                {m}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border bg-card p-8">
          <p className="eyebrow">Our Vision</p>
          <ul className="mt-5 flex flex-col gap-3 text-muted-foreground">
            {VISION.map((v) => (
              <li key={v} className="border-l-2 border-gold/50 pl-4">
                {v}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
