/**
 * Public homepage (Track 1, Phase 3).
 *
 * Placeholder scaffold only. The real homepage is designed in Stitch and
 * built in Phase 3, and its first section becomes the scroll-expansion hero
 * (see D3-Dynamic-Hero-Component-Spec.md). Structure below just confirms the
 * public route group renders.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Dynamic Designs Decor
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        D3 Dynamic
      </h1>
      <p className="text-lg text-muted-foreground">
        Curtain, upholstery and outdoor furnishing fabrics for the MENA region.
      </p>
      <p className="text-sm text-muted-foreground">
        Public site rebuild is in progress. This placeholder will be replaced by
        the designed homepage in Phase 3.
      </p>
    </main>
  );
}
