import type { NextConfig } from "next";

// Old static-site URLs (with .html) → new extensionless routes. Preserves SEO
// at domain cutover. 308 permanent redirects.
const legacyPaths = [
  ["/about.html", "/about"],
  ["/contact-us.html", "/contact"],
  ["/curtains.html", "/curtains"],
  ["/upholstery.html", "/upholstery"],
  ["/outdoor-fabric.html", "/outdoor-fabric"],
  ["/pet-friendly-fabric-for-sofa.html", "/pet-friendly-fabric-for-sofa"],
  ["/fire-retardant-fabric-suppliers.html", "/fire-retardant-fabric-suppliers"],
  ["/leather-finish-sofa-cloth.html", "/leather-finish-sofa-cloth"],
  ["/easy-to-clean-furniture-fabric.html", "/easy-to-clean-furniture-fabric"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public URLs (catalogue thumbnails, blog covers).
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async redirects() {
    return legacyPaths.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
