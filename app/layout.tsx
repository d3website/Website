import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Body / UI sans
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Serif display for headings
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "D3 Dynamic — Furnishing Fabrics",
    template: "%s | D3 Dynamic",
  },
  description:
    "Dynamic Designs Decor (D3 Dynamic) — curtain, upholstery and outdoor furnishing fabrics stockist serving the MENA region.",
  metadataBase: new URL("https://d3dynamic.com"),
  openGraph: {
    type: "website",
    siteName: "D3 Dynamic",
    title: "D3 Dynamic — Furnishing Fabrics",
    description:
      "Premium curtain, upholstery and outdoor furnishing fabrics. India · UAE · Saudi Arabia.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Dynamic Designs Decor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "D3 Dynamic — Furnishing Fabrics",
    description:
      "Premium curtain, upholstery and outdoor furnishing fabrics. India · UAE · Saudi Arabia.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
