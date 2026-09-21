import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Layout shell for the public marketing site (Track 1). Header + footer wrap
 * every public page. The full visual design system is applied in the Phase 3
 * Stitch pass; this is the structural groundwork.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-editorial flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
