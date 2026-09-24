"use client";

import { createClient } from "@/lib/supabase/client";
import {
  createSignedUpload,
  type UploadBucket,
} from "@/app/admin/(dashboard)/upload-actions";

function extFor(file: File): string {
  const fromName = file.name.includes(".")
    ? file.name.split(".").pop()!
    : "";
  if (fromName) return fromName;
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("video/")) return "mp4";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

/**
 * Uploads a file straight to Supabase Storage from the browser using a signed
 * URL (no Server Action body-size limit). Returns the public URL.
 */
export async function uploadToStorage(
  bucketKey: UploadBucket,
  keyBase: string,
  file: File,
): Promise<string> {
  const { bucket, path, token, publicUrl } = await createSignedUpload(
    bucketKey,
    keyBase,
    extFor(file),
  );
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(path, token, file, {
      contentType: file.type || undefined,
    });
  if (error) throw new Error(error.message);
  return publicUrl;
}
