import type { ReactNode } from "react";

/**
 * Layout shell for the authenticated admin panel (Track 2).
 *
 * Auth gating (Supabase Auth, single admin role) and the admin chrome
 * (nav, sign-out) are added in Phase 1. The admin panel is intentionally
 * utilitarian and does not depend on the public design system.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background text-foreground">{children}</div>;
}
