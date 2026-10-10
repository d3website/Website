import type { Metadata } from "next";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dynamic Designs Decor (D3) collects, uses and protects your information.",
};

export default function PrivacyPage() {
  const updated = "October 2026";
  return (
    <main className="site-editorial mx-auto w-full max-w-3xl px-6 py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 text-4xl font-medium sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated {updated}
      </p>

      <div className="mt-10 flex flex-col gap-8 leading-relaxed text-muted-foreground">
        <section>
          <p>
            This policy explains what information Dynamic Designs Decor (“D3”,
            “we”, “us”) collects through this website and how we use it. We keep
            it simple: we only collect what you choose to send us, and we don’t
            sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground">
            Information we collect
          </h2>
          <p className="mt-3">
            When you submit our contact form, we collect the details you
            provide — your name, email address, phone number (if given) and your
            message. We don’t require you to create an account, and we don’t
            collect payment information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground">
            How we use it
          </h2>
          <p className="mt-3">
            We use your contact details solely to respond to your enquiry and,
            where relevant, to follow up about our fabrics and services. We do
            not send marketing messages without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground">
            Analytics & cookies
          </h2>
          <p className="mt-3">
            We use privacy-friendly, cookieless analytics to understand overall
            site traffic (such as page views and visitor counts). It does not
            use tracking cookies and does not identify you personally, so this
            site does not require a cookie-consent banner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground">
            Where your data is stored
          </h2>
          <p className="mt-3">
            Contact submissions are stored securely with our hosting and
            database providers. We retain them only as long as needed to handle
            your enquiry and for our legitimate business records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground">Your choices</h2>
          <p className="mt-3">
            You can ask us to access, correct or delete the personal information
            you’ve shared with us at any time. To make a request, email{" "}
            <a
              href={`mailto:${company.email}`}
              className="text-gold underline underline-offset-4"
            >
              {company.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-foreground">Contact</h2>
          <p className="mt-3">
            Questions about this policy? Reach us at{" "}
            <a
              href={`mailto:${company.email}`}
              className="text-gold underline underline-offset-4"
            >
              {company.email}
            </a>{" "}
            or {company.phone}.
          </p>
        </section>
      </div>
    </main>
  );
}
