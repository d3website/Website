import { BlogForm } from "../blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">New post</h1>
        <p className="text-sm text-muted-foreground">
          Write a blog post. Save as a draft or publish straight away.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
