import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublishedPostBySlug } from "@/lib/data/public";

type Params = { slug: string };

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: { absolute: `${post.title} | D3 Dynamic` },
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/blogs"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to blog
      </Link>

      <header className="mt-6">
        <p className="text-sm text-muted-foreground">
          {formatDate(post.published_at ?? post.created_at)}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
      </header>

      {post.cover_image_url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      <article className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </article>
    </main>
  );
}
