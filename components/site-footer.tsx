import Link from "next/link";
import Image from "next/image";
import { catalogueSections, company, offices, services } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/d3-logo.png"
            alt={`${company.brand} — ${company.legalName}`}
            width={498}
            height={228}
            className="h-16 w-auto"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            {company.legalName} — furnishing fabrics stockist serving the MENA
            region.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-foreground">
                Blog
              </Link>
            </li>
          </ul>
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
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-6 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((o) => (
            <div key={o.city}>
              <p className="font-semibold text-foreground">{o.city}</p>
              {o.entity && <p className="text-foreground/80">{o.entity}</p>}
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
