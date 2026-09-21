import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/data/public";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, guides and inspiration on furnishing fabrics from Dynamic Designs Decor (D3).",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogsPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <PageHeader
        eyebrow="Journal"
        title="Blog"
        description="News, guides and inspiration on furnishing fabrics."
        className="mb-12"
      />

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-16 text-center text-sm text-muted-foreground">
          No posts yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-gold/50"
            >
              <div className="relative aspect-[16/9] bg-muted">
                {post.cover_image_url && (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="eyebrow">
                  {formatDate(post.published_at ?? post.created_at)}
                </p>
                <h2 className="mt-2 text-xl font-medium">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
