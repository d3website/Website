import Link from "next/link";
import { Button } from "@/components/ui/button";
import { company, type ServiceContent } from "@/lib/content";

/** Shared layout for the four Services landing pages (Track 1). */
export function ServicePageView({ service }: { service: ServiceContent }) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <header>
        <p className="eyebrow">Features</p>
        <h1 className="mt-4 text-4xl font-medium sm:text-5xl">
          {service.title}
        </h1>
        <p className="mt-3 font-serif text-xl italic text-muted-foreground">
          {service.subtitle}
        </p>
        <div className="mt-6 h-px w-14 bg-gold" />
      </header>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {service.intro}
      </p>

      <section className="mt-14">
        <h2 className="text-2xl font-medium">{service.featuresHeading}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {service.features.map((f) => (
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
      </section>

      <section className="mt-14 flex flex-col items-start gap-5 rounded-xl border bg-muted/40 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-medium">Ready to explore our collections?</p>
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
      </section>
    </main>
  );
}
