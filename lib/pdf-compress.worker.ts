/// <reference lib="webworker" />
/**
 * Web Worker that runs the PDF image compression off the main thread, posting
 * progress as it goes. Driven by compressPdfInWorker (lib/pdf-compress-client).
 */
import { compressPdfBytes } from "./pdf-compress";

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e: MessageEvent) => {
  const { buffer, quality, maxEdge } = e.data as {
    buffer: ArrayBuffer;
    quality?: number;
    maxEdge?: number;
  };
  try {
    const r = await compressPdfBytes(new Uint8Array(buffer), {
      quality,
      maxEdge,
      onProgress: (value) => self.postMessage({ type: "progress", value }),
    });
    self.postMessage({
      type: "done",
      changed: r.changed,
      originalBytes: r.originalBytes,
      compressedBytes: r.compressedBytes,
      bytes: r.bytes,
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : "compression failed",
    });
  }
};
