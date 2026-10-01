"use client";

import type { CompressResult } from "./pdf-compress";

const unchanged = (file: File): CompressResult => ({
  file,
  originalBytes: file.size,
  compressedBytes: file.size,
  changed: false,
});

/**
 * Compress a PDF in a Web Worker (non-blocking), reporting 0–1 progress.
 * Falls back to the main thread if workers aren't available, and always
 * resolves — on any failure it returns the original file unchanged so an
 * upload is never blocked.
 */
export function compressPdfInWorker(
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<CompressResult> {
  if (file.type !== "application/pdf") return Promise.resolve(unchanged(file));

  const fallback = async (): Promise<CompressResult> => {
    try {
      const { compressPdf } = await import("./pdf-compress");
      return await compressPdf(file, { onProgress });
    } catch {
      return unchanged(file);
    }
  };

  let worker: Worker;
  try {
    worker = new Worker(new URL("./pdf-compress.worker.ts", import.meta.url));
  } catch {
    return fallback();
  }

  return new Promise<CompressResult>((resolve) => {
    let settled = false;
    const finish = (r: CompressResult) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      resolve(r);
    };

    worker.onmessage = (e: MessageEvent) => {
      const d = e.data;
      if (d?.type === "progress") {
        onProgress?.(d.value);
      } else if (d?.type === "done") {
        const out = d.changed
          ? new File([d.bytes], file.name, {
              type: "application/pdf",
              lastModified: Date.now(),
            })
          : file;
        finish({
          file: out,
          originalBytes: d.originalBytes,
          compressedBytes: d.compressedBytes,
          changed: d.changed,
        });
      } else if (d?.type === "error") {
        finish(unchanged(file));
      }
    };
    worker.onerror = () => finish(unchanged(file));

    file
      .arrayBuffer()
      .then((buffer) =>
        worker.postMessage({ buffer, quality: 0.6, maxEdge: 1100 }, [buffer]),
      )
      .catch(() => finish(unchanged(file)));
  });
}
