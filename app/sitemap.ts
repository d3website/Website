import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data/public";

const BASE = "https://d3dynamic.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/blogs",
    "/catalogue",
    "/curtains",
    "/upholstery",
    "/outdoor-fabric",
    "/pet-friendly-fabric-for-sofa",
    "/fire-retardant-fabric-suppliers",
    "/leather-finish-sofa-cloth",
    "/easy-to-clean-furniture-fabric",
    "/privacy",
  ];
  const now = new Date();
  const routes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  // Published blog posts (resilient — never fail the sitemap).
  try {
    const posts = await getPublishedPosts();
    for (const post of posts) {
      routes.push({
        url: `${BASE}/blogs/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // ignore
  }

  return routes;
}
