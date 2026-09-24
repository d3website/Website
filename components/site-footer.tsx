import Link from "next/link";
import Image from "next/image";
import { catalogueSections, company, offices, services } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/d3-lockup.png"
            alt={`${company.brand} — ${company.legalName}`}
            width={464}
            height={228}
            className="h-16 w-auto"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Fabrics That Define Beautiful Spaces
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
          <SocialLinks />
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
          <p className="text-sm font-semibold">Features</p>
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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-6 py-5 text-sm text-muted-foreground">
          <span className="eyebrow">Offices</span>
          {offices.map((o, i) => (
            <span key={o.city} className="flex items-center gap-3">
              {i > 0 && <span className="text-border">·</span>}
              {o.city}
            </span>
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

function SocialLinks() {
  const socials = [
    { label: "Instagram", href: company.instagram, Icon: InstagramIcon },
    { label: "Facebook", href: company.facebook, Icon: FacebookIcon },
    { label: "Pinterest", href: company.pinterest, Icon: PinterestIcon },
  ];
  return (
    <div className="mt-6 flex items-center gap-4">
      {socials.map(({ label, href, Icon }) =>
        href && href !== "#" ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon />
          </a>
        ) : (
          <span
            key={label}
            aria-label={`${label} (coming soon)`}
            className="text-muted-foreground/70"
          >
            <Icon />
          </span>
        ),
      )}
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 4.84 2.87 9.01 7 10.88-.1-.92-.18-2.35.04-3.36.19-.87 1.25-5.55 1.25-5.55s-.32-.64-.32-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .92-.58 2.29-.89 3.56-.25 1.07.54 1.94 1.59 1.94 1.91 0 3.38-2.01 3.38-4.92 0-2.57-1.85-4.37-4.49-4.37-3.06 0-4.86 2.29-4.86 4.66 0 .92.36 1.91.8 2.45.09.11.1.2.07.31-.08.34-.26 1.07-.3 1.22-.05.2-.15.24-.36.15-1.34-.62-2.18-2.58-2.18-4.15 0-3.38 2.46-6.48 7.08-6.48 3.72 0 6.61 2.65 6.61 6.19 0 3.69-2.33 6.67-5.56 6.67-1.08 0-2.1-.56-2.45-1.23l-.67 2.54c-.24.93-.9 2.11-1.34 2.82.99.3 2.05.47 3.15.47 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
    </svg>
  );
}
