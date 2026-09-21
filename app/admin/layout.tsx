import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

/**
 * Root shell for the admin area (Track 2). Wraps both the login page and the
 * authenticated dashboard (which has its own nested layout + auth guard under
 * the (dashboard) route group). Utilitarian by design — no public design deps.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}
