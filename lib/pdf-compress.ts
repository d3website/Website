/**
 * Client-side PDF compressor (permissive deps only: pdf-lib MIT, pako MIT).
 *
 * Catalogue e-catalogues are image-heavy look-books — most of the weight is
 * embedded JPEGs. This downscales + re-encodes those JPEGs in place, keeping
 * the PDF's text, vectors and layout intact. It never corrupts a file: any
 * image it can't safely handle is left untouched, and if the result isn't
 * meaningfully smaller the original bytes are returned.
 *
 * Needs createImageBitmap + OffscreenCanvas — available on the main thread and
 * inside a Web Worker (see workers/pdf-compress.worker.ts).
 */
import {
  PDFDocument,
  PDFName,
  PDFRawStream,
  PDFNumber,
  type PDFRef,
} from "pdf-lib";
import * as pako from "pako";

export type CompressOptions = {
  /** JPEG quality 0–1 for re-encoded images (default 0.6). */
  quality?: number;
  /** Downscale images whose longest edge exceeds this, in px (default 1100). */
  maxEdge?: number;
  /** Keep the result only if it saves at least this fraction (default 0.1). */
  minSaving?: number;
  /** 0–1 progress callback as images are processed. */
  onProgress?: (fraction: number) => void;
};

export type CompressBytesResult = {
  bytes: Uint8Array;
  originalBytes: number;
  compressedBytes: number;
  changed: boolean;
};

async function reencodeJpeg(
  jpeg: Uint8Array,
  quality: number,
  maxEdge: number,
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(
      new Blob([jpeg as BlobPart], { type: "image/jpeg" }),
    );
  } catch {
    return null; // CMYK / unsupported — leave the original image alone
  }
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return null;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return { bytes, width: w, height: h };
}

/**
 * Core: compress raw PDF bytes by downscaling/re-encoding embedded JPEGs.
 * Returns the original bytes unchanged if nothing helps or on any error.
 */
export async function compressPdfBytes(
  src: Uint8Array,
  opts: CompressOptions = {},
): Promise<CompressBytesResult> {
  const quality = opts.quality ?? 0.6;
  const maxEdge = opts.maxEdge ?? 1100;
  const minSaving = opts.minSaving ?? 0.1;
  const originalBytes = src.length;
  const unchanged: CompressBytesResult = {
    bytes: src,
    originalBytes,
    compressedBytes: originalBytes,
    changed: false,
  };

  try {
    const doc = await PDFDocument.load(src, { updateMetadata: false });

    // Collect image streams first so progress is meaningful.
    const images: Array<[PDFRef, PDFRawStream]> = [];
    for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
      if (!(obj instanceof PDFRawStream)) continue;
      const d = obj.dict;
      if (d.get(PDFName.of("Subtype"))?.toString() !== "/Image") continue;
      if (d.get(PDFName.of("SMask"))) continue; // transparency — skip
      const filter = d.get(PDFName.of("Filter"))?.toString() ?? "";
      if (!filter.includes("DCTDecode")) continue; // JPEGs only
      images.push([ref, obj]);
    }

    let done = 0;
    for (const [ref, obj] of images) {
      const filter = obj.dict.get(PDFName.of("Filter"))?.toString() ?? "";
      let jpeg = obj.contents;
      if (filter.includes("FlateDecode")) {
        try {
          jpeg = pako.inflate(obj.contents);
        } catch {
          done++;
          opts.onProgress?.(done / images.length);
          continue;
        }
      }
      if (jpeg[0] === 0xff && jpeg[1] === 0xd8) {
        const out = await reencodeJpeg(jpeg, quality, maxEdge);
        if (out && out.bytes.length < jpeg.length) {
          const newDict = obj.dict.clone();
          newDict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
          newDict.delete(PDFName.of("DecodeParms"));
          newDict.set(PDFName.of("ColorSpace"), PDFName.of("DeviceRGB"));
          newDict.set(PDFName.of("BitsPerComponent"), PDFNumber.of(8));
          newDict.set(PDFName.of("Width"), PDFNumber.of(out.width));
          newDict.set(PDFName.of("Height"), PDFNumber.of(out.height));
          doc.context.assign(ref, PDFRawStream.of(newDict, out.bytes));
        }
      }
      done++;
      opts.onProgress?.(done / images.length);
    }

    const outBytes = await doc.save({ useObjectStreams: true });
    if (outBytes.length >= originalBytes * (1 - minSaving)) return unchanged;
    return {
      bytes: outBytes,
      originalBytes,
      compressedBytes: outBytes.length,
      changed: true,
    };
  } catch {
    return unchanged; // never block an upload on a compression failure
  }
}

export type CompressResult = {
  file: File;
  originalBytes: number;
  compressedBytes: number;
  changed: boolean;
};

/** Convenience wrapper that compresses a File on the current thread. */
export async function compressPdf(
  file: File,
  opts: CompressOptions = {},
): Promise<CompressResult> {
  if (file.type !== "application/pdf") {
    return {
      file,
      originalBytes: file.size,
      compressedBytes: file.size,
      changed: false,
    };
  }
  const src = new Uint8Array(await file.arrayBuffer());
  const r = await compressPdfBytes(src, opts);
  const out = r.changed
    ? new File([r.bytes as BlobPart], file.name, {
        type: "application/pdf",
        lastModified: Date.now(),
      })
    : file;
  return {
    file: out,
    originalBytes: r.originalBytes,
    compressedBytes: r.compressedBytes,
    changed: r.changed,
  };
}
