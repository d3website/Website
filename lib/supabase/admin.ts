import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseServiceRoleKey, supabaseUrl } from "./env";

/**
 * Privileged Supabase client using the service-role key. BYPASSES Row Level
 * Security, so it must only ever run on the server (guarded by `server-only`).
 * Use for admin writes (catalogue CRUD, storage uploads) after the request has
 * been authenticated as the admin user.
 */
export function createAdminClient() {
  return createClient<Database>(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
