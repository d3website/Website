import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/data/admin";
import { BlogForm } from "../../blog-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Edit post</h1>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>
      <BlogForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: post.body,
          cover_image_url: post.cover_image_url,
          is_published: post.is_published,
        }}
      />
    </div>
  );
}
