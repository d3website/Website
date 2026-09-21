import type { ReactNode } from "react";

/**
 * Layout shell for the public marketing site (Track 1).
 * Global header/footer and the shared design system land here in Phase 3
 * once the Stitch designs are delivered. Kept minimal for now so Phase 1/2
 * work is not blocked on visual design.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}
