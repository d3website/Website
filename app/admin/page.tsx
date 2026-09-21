import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin panel entry (Track 2, Phase 1).
 *
 * Placeholder. Phase 1 replaces this with the authenticated dashboard:
 * catalogue entry CRUD, section/feature/design-type management, and file
 * uploads to Supabase Storage. Route is currently unguarded — auth gating
 * is added with the Supabase Auth wiring in Phase 1.
 */
export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">D3 Dynamic — Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Catalogue management panel. Login, entry CRUD and uploads are built in
        Phase 1.
      </p>
    </main>
  );
}
