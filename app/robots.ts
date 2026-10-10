import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: "https://d3dynamic.com/sitemap.xml",
    host: "https://d3dynamic.com",
  };
}
