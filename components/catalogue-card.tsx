import Image from "next/image";

/**
 * Presentational catalogue card — thumbnail + collection name linking to the
 * PDF. Shared between the admin preview and the public catalogue grid so the
 * "preview shows the card exactly as it will render" requirement (Plan §4.2)
 * holds by construction. Visual styling gets the full design pass in Phase 3.
 */
export function CatalogueCard({
  thumbnailUrl,
  collectionName,
  pdfUrl,
  designType,
}: {
  thumbnailUrl: string | null;
  collectionName: string;
  pdfUrl?: string | null;
  designType?: string | null;
}) {
  const inner = (
    <div className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={collectionName}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium">
          {collectionName || "Untitled collection"}
        </p>
        {designType && (
          <p className="mt-0.5 text-xs text-muted-foreground">{designType}</p>
        )}
      </div>
    </div>
  );

  if (pdfUrl) {
    return (
      <a href={pdfUrl} target="_blank" rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}
