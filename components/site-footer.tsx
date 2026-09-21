import Link from "next/link";
import { catalogueSections, company, offices, services } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">{company.brand}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {company.legalName} — furnishing fabrics stockist serving the MENA
            region.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Fabrics</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {catalogueSections.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-foreground">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Services</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="hover:text-foreground">
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Get in touch</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-foreground">
                {company.email}
              </a>
            </li>
            <li>
              <a href={company.phoneHref} className="hover:text-foreground">
                {company.phone}
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-6 text-xs text-muted-foreground sm:grid-cols-3">
          {offices.map((o) => (
            <div key={o.label}>
              <p className="font-semibold text-foreground">{o.label}</p>
              {o.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {company.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
