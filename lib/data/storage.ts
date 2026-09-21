import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export const THUMBNAIL_BUCKET = "thumbnails";
export const CATALOGUE_BUCKET = "catalogues";
export const BLOG_BUCKET = "blog";

// Size caps (Project Plan §4.5). PDF cap is generous; tune to real files.
export const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

function extensionFor(file: File): string {
  const fromName = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";
  if (fromName) return fromName;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "file"
  );
}

async function uploadTo(
  bucket: string,
  file: File,
  keyBase: string,
): Promise<string> {
  const db = createAdminClient();
  const path = `${Date.now()}-${slugify(keyBase)}.${extensionFor(file)}`;
  const { error } = await db.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = db.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadThumbnail(
  file: File,
  collectionName: string,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Thumbnail must be an image file.");
  }
  if (file.size > MAX_THUMBNAIL_BYTES) {
    throw new Error("Thumbnail must be 5 MB or smaller.");
  }
  return uploadTo(THUMBNAIL_BUCKET, file, collectionName);
}

export async function uploadPdf(
  file: File,
  collectionName: string,
): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("Catalogue must be a PDF file.");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("PDF must be 25 MB or smaller.");
  }
  return uploadTo(CATALOGUE_BUCKET, file, collectionName);
}

export async function uploadBlogImage(
  file: File,
  title: string,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Cover image must be an image file.");
  }
  if (file.size > MAX_THUMBNAIL_BYTES) {
    throw new Error("Cover image must be 5 MB or smaller.");
  }
  return uploadTo(BLOG_BUCKET, file, title);
}
