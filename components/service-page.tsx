import Link from "next/link";
import { Button } from "@/components/ui/button";
import { company, type ServiceContent } from "@/lib/content";

/** Shared layout for the four Services landing pages (Track 1). */
export function ServicePageView({ service }: { service: ServiceContent }) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {service.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{service.subtitle}</p>
      </header>

      <p className="mt-8 text-muted-foreground">{service.intro}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">{service.featuresHeading}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {service.features.map((f) => (
            <div key={f.title} className="rounded-lg border p-5">
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col items-start gap-4 rounded-xl border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Ready to explore our collections?</p>
          <p className="text-sm text-muted-foreground">
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
