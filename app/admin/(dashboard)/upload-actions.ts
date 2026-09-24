"use server";

import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

const BUCKETS = {
  thumbnails: "thumbnails",
  catalogues: "catalogues",
  blog: "blog",
  media: "media",
} as const;

export type UploadBucket = keyof typeof BUCKETS;

export type SignedUpload = {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
};

/**
 * Creates a short-lived signed upload URL so the browser can upload a file
 * directly to Supabase Storage — bypassing the Next/Vercel request-body size
 * limits that block large files (e.g. hero videos) from going through a
 * Server Action.
 */
export async function createSignedUpload(
  bucketKey: UploadBucket,
  keyBase: string,
  ext: string,
): Promise<SignedUpload> {
  await requireUser();
  const bucket = BUCKETS[bucketKey];
  if (!bucket) throw new Error("Unknown upload bucket.");

  const safeExt = (ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${Date.now()}-${slugify(keyBase)}.${safeExt}`;

  const db = createAdminClient();
  const { data, error } = await db.storage
    .from(bucket)
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);

  const publicUrl = db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  return { bucket, path, token: data.token, publicUrl };
}
