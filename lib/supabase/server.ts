import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Reads/writes the auth session from Next's cookie store, so it stays in sync
 * with the signed-in admin user. Respects Row Level Security.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` was called from a Server Component. Safe to ignore when
          // middleware is refreshing the session; otherwise handle in a
          // Route Handler / Server Action where cookies are writable.
        }
      },
    },
  });
}
