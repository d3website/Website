import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Keep-alive endpoint hit by a Vercel Cron (see vercel.json). A tiny DB read
 * resets Supabase's free-tier inactivity timer so the project never pauses —
 * before launch (quiet periods) and after, regardless of domain.
 *
 * If a CRON_SECRET env var is set, requests must carry it (Vercel Cron sends
 * `Authorization: Bearer <CRON_SECRET>`); otherwise the endpoint is open but
 * only performs a harmless `select`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const db = createAdminClient();
    const { error } = await db.from("sections").select("id").limit(1);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "failed" },
      { status: 500 },
    );
  }
}
