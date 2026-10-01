import "server-only";

import { AwsClient } from "aws4fetch";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Best-effort deletion of an uploaded file from object storage, with a
 * reference check so a file still used by any row is never removed. Call it
 * AFTER the DB change (delete/replace) so the reference count reflects the new
 * state. Never throws — a cleanup failure must not break the user's action.
 *
 * Handles both current R2 URLs and any leftover Supabase Storage URLs. Local
 * bundled defaults (/images/…) and empty values are ignored.
 */

const R2 = {
  endpoint: process.env.R2_ENDPOINT,
  bucket: process.env.R2_BUCKET,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, ""),
};

// Every column across the schema that can hold an uploaded file URL.
const URL_COLUMNS: Array<[table: string, column: string]> = [
  ["catalogue_entries", "thumbnail_url"],
  ["catalogue_entries", "pdf_url"],
  ["new_arrivals", "image_url"],
  ["blog_posts", "cover_image_url"],
  ["site_media", "url"],
  ["site_media", "poster_url"],
  ["sections", "hero_image_url"],
];

function isUploadedUrl(url: string): boolean {
  if (R2.publicBaseUrl && url.startsWith(R2.publicBaseUrl)) return true;
  return url.includes("supabase.co/storage/v1/object/public/");
}

/** True if any row still references this exact URL. */
async function isReferenced(url: string): Promise<boolean> {
  const db = createAdminClient();
  for (const [table, column] of URL_COLUMNS) {
    const { data, error } = await db
      .from(table)
      .select(column === "url" ? "slot" : "id")
      .eq(column, url)
      .limit(1);
    if (!error && data && data.length > 0) return true;
  }
  return false;
}

async function deleteFromR2(url: string): Promise<void> {
  if (!R2.endpoint || !R2.bucket || !R2.accessKeyId || !R2.secretAccessKey) {
    return;
  }
  const key = url.slice(R2.publicBaseUrl!.length).replace(/^\//, "");
  if (!key) return;
  const aws = new AwsClient({
    accessKeyId: R2.accessKeyId,
    secretAccessKey: R2.secretAccessKey,
    region: "auto",
    service: "s3",
  });
  await aws.fetch(
    `${R2.endpoint.replace(/\/$/, "")}/${R2.bucket}/${key}`,
    { method: "DELETE" },
  );
}

async function deleteFromSupabase(url: string): Promise<void> {
  const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!m) return;
  const [, bucket, path] = m;
  const db = createAdminClient();
  await db.storage.from(bucket).remove([decodeURIComponent(path)]);
}

export async function deleteStoredFile(
  url: string | null | undefined,
): Promise<void> {
  if (!url || !isUploadedUrl(url)) return;
  try {
    if (await isReferenced(url)) return; // still in use — keep it
    if (R2.publicBaseUrl && url.startsWith(R2.publicBaseUrl)) {
      await deleteFromR2(url);
    } else {
      await deleteFromSupabase(url);
    }
  } catch (e) {
    console.error("[storage-cleanup] failed to delete", url, e);
  }
}

/** Delete several files (e.g. a catalogue's thumbnail + pdf). */
export async function deleteStoredFiles(
  urls: Array<string | null | undefined>,
): Promise<void> {
  await Promise.all(urls.map((u) => deleteStoredFile(u)));
}
