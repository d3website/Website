"use server";

import { AwsClient } from "aws4fetch";
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

/** Discriminated upload ticket — R2 (presigned PUT) or Supabase (signed URL). */
export type UploadTicket =
  | {
      mode: "r2";
      url: string;
      publicUrl: string;
      headers: Record<string, string>;
    }
  | {
      mode: "supabase";
      bucket: string;
      path: string;
      token: string;
      publicUrl: string;
      contentType?: string;
    };

const R2 = {
  endpoint: process.env.R2_ENDPOINT,
  bucket: process.env.R2_BUCKET,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
};

function r2Configured(): boolean {
  return Boolean(
    R2.endpoint &&
      R2.bucket &&
      R2.accessKeyId &&
      R2.secretAccessKey &&
      R2.publicBaseUrl,
  );
}

function objectBase(keyBase: string, ext: string) {
  const safeExt = (ext || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${Date.now()}-${slugify(keyBase)}.${safeExt}`;
}

/**
 * Create an upload ticket so the browser can upload a file directly to object
 * storage — bypassing the Next/Vercel request-body size limits. Uses Cloudflare
 * R2 (zero egress) when the R2_* env vars are set, otherwise Supabase Storage.
 *
 * `contentType` is baked into the stored object; `downloadName` (PDFs) sets a
 * Content-Disposition so the public URL downloads with that filename.
 */
export async function createUpload(
  bucketKey: UploadBucket,
  keyBase: string,
  ext: string,
  contentType?: string,
  downloadName?: string,
): Promise<UploadTicket> {
  await requireUser();
  const bucket = BUCKETS[bucketKey];
  if (!bucket) throw new Error("Unknown upload bucket.");
  const base = objectBase(keyBase, ext);
  // R2 uses a single bucket, so namespace by type; Supabase has per-type
  // buckets, so keep the bare path (unchanged from before).
  const key = r2Configured() ? `${bucketKey}/${base}` : base;

  if (r2Configured()) {
    const aws = new AwsClient({
      accessKeyId: R2.accessKeyId!,
      secretAccessKey: R2.secretAccessKey!,
      region: "auto",
      service: "s3",
    });
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (downloadName) {
      headers["Content-Disposition"] =
        `attachment; filename="${downloadName.replace(/"/g, "")}"; ` +
        `filename*=UTF-8''${encodeURIComponent(downloadName)}`;
    }
    // R2 uses a single bucket (R2.bucket); the per-type name is the key prefix.
    const objectUrl = `${R2.endpoint!.replace(/\/$/, "")}/${R2.bucket}/${key}`;
    const signed = await aws.sign(objectUrl, {
      method: "PUT",
      headers,
      aws: { signQuery: true },
    });
    return {
      mode: "r2",
      url: signed.url.toString(),
      publicUrl: `${R2.publicBaseUrl!.replace(/\/$/, "")}/${key}`,
      headers,
    };
  }

  // Fallback: Supabase signed upload (existing behaviour).
  const db = createAdminClient();
  const { data, error } = await db.storage
    .from(bucket)
    .createSignedUploadUrl(key);
  if (error) throw new Error(error.message);
  const publicUrl = db.storage.from(bucket).getPublicUrl(key).data.publicUrl;
  return {
    mode: "supabase",
    bucket,
    path: key,
    token: data.token,
    publicUrl,
    contentType,
  };
}
