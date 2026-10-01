"use client";

import { createClient } from "@/lib/supabase/client";
import {
  createUpload,
  type UploadBucket,
} from "@/app/admin/(dashboard)/upload-actions";

function extFor(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop()! : "";
  if (fromName) return fromName;
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("video/")) return "mp4";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

type UploadOptions = {
  /** For PDFs: filename the public URL should download as (attachment). */
  downloadName?: string;
};

/**
 * Uploads a file straight to object storage from the browser (no Server Action
 * body-size limit). Routes to Cloudflare R2 when configured, else Supabase.
 * Returns the public URL.
 */
export async function uploadToStorage(
  bucketKey: UploadBucket,
  keyBase: string,
  file: File,
  opts: UploadOptions = {},
): Promise<string> {
  const contentType = file.type || undefined;
  const ticket = await createUpload(
    bucketKey,
    keyBase,
    extFor(file),
    contentType,
    opts.downloadName,
  );

  if (ticket.mode === "r2") {
    const res = await fetch(ticket.url, {
      method: "PUT",
      body: file,
      headers: ticket.headers,
    });
    if (!res.ok) {
      throw new Error(`Upload failed (${res.status}).`);
    }
    return ticket.publicUrl;
  }

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(ticket.bucket)
    .uploadToSignedUrl(ticket.path, ticket.token, file, {
      contentType: ticket.contentType,
    });
  if (error) throw new Error(error.message);
  return ticket.publicUrl;
}
