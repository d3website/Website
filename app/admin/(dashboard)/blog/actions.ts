"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import * as data from "@/lib/data/admin";
import { slugify } from "@/lib/slug";

export type BlogFormState = { error: string | null };

/** Find a unique slug based on `base`, excluding the post being edited. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 2;
  while (await data.blogSlugTaken(candidate, excludeId)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

export async function saveBlogPost(
  _prev: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "").trim();
  const isUpdate = id.length > 0;

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const publish = String(formData.get("publish") ?? "false") === "true";

  if (!title) return { error: "Title is required." };
  if (!body) return { error: "Body is required." };

  const uploadedCover = String(formData.get("cover_image_url") ?? "").trim();
  const cover_image_url = uploadedCover || undefined;

  try {
    const slug = await uniqueSlug(slugInput || title, isUpdate ? id : undefined);

    if (isUpdate) {
      const existing = await data.getBlogPost(id);
      if (!existing) return { error: "Post not found." };
      const published_at =
        publish && !existing.published_at
          ? new Date().toISOString()
          : existing.published_at;

      await data.updateBlogPost(id, {
        title,
        slug,
        excerpt: excerpt || null,
        body,
        is_published: publish,
        published_at,
        ...(cover_image_url ? { cover_image_url } : {}),
      });
    } else {
      await data.insertBlogPost({
        title,
        slug,
        excerpt: excerpt || null,
        body,
        cover_image_url: cover_image_url ?? null,
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null,
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save post." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blogs");
  redirect("/admin/blog");
}

export async function setBlogPublished(id: string, published: boolean) {
  await requireUser();
  const existing = await data.getBlogPost(id);
  const published_at =
    published && existing && !existing.published_at
      ? new Date().toISOString()
      : (existing?.published_at ?? null);
  await data.updateBlogPost(id, { is_published: published, published_at });
  revalidatePath("/admin/blog");
  revalidatePath("/blogs");
}

export async function removeBlogPost(id: string) {
  await requireUser();
  await data.deleteBlogPost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blogs");
}
