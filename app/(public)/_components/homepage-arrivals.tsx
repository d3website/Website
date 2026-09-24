import { getActiveNewArrivals } from "@/lib/data/public";
import { InteractiveCard } from "@/components/ui/interactive-card";

/**
 * "New Arrivals" homepage section — 3D tilt cards managed from the admin panel.
 * Renders nothing when there are no active arrivals (or before the migration).
 */
export default async function HomepageArrivals() {
  const arrivals = await getActiveNewArrivals();
  if (arrivals.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
      <div className="mb-12 text-center">
        <p className="eyebrow">New Arrivals</p>
        <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
          Latest Collections
        </h2>
        <div className="mx-auto mt-4 h-px w-14 bg-gold" />
      </div>

      <div
        style={{ perspective: "1200px" }}
        className="flex flex-wrap justify-center gap-8"
      >
        {arrivals.map((a) => (
          <InteractiveCard
            key={a.id}
            title={a.title}
            subtitle={a.subtitle}
            imageUrl={a.imageUrl}
            actionText={a.actionText}
            actionHref={a.actionHref}
            actionNewTab={a.actionNewTab}
            detailHref={a.detailHref}
          />
        ))}
      </div>
    </section>
  );
}
