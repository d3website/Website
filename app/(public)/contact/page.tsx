import type { Metadata } from "next";
import { company, offices } from "@/lib/content";
import { ContactForm } from "./contact-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Dynamic Designs Decor (D3). Offices in Bhiwandi and Panipat. Call, email or send us a message — we reply within 24 hours on business days.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Give us a call or drop us a mail anytime — we endeavour to answer all enquiries within 24 hours on business days. We’ll be happy to answer your questions."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-medium">Send a message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-semibold">Get in touch</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Email: </span>
                <a href={`mailto:${company.email}`} className="hover:text-foreground">
                  {company.email}
                </a>
              </li>
              <li>
                <span className="font-medium text-foreground">Phone: </span>
                <a href={company.phoneHref} className="hover:text-foreground">
                  {company.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Our offices</h2>
            <div className="mt-3 flex flex-col gap-4 text-sm text-muted-foreground">
              {offices.map((o) => (
                <div key={o.city}>
                  <p className="font-medium text-foreground">{o.city}</p>
                  {o.entity && (
                    <p className="text-foreground/80">{o.entity}</p>
                  )}
                  {o.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
