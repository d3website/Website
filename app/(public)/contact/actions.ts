"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactNotification } from "@/lib/email";

export type ContactState = { ok: boolean; error: string | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Stores a contact-form submission. Default destination is the database
 * (contact_messages). Email/CRM forwarding can be layered on once the
 * destination is confirmed (Plan §7).
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot: bots fill hidden fields; humans leave it blank.
  const website = String(formData.get("website") ?? "").trim();

  if (website) return { ok: true, error: null }; // silently drop bots

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email and message." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const record = { name, email, phone: phone || null, message };

  try {
    const db = createAdminClient();
    const { error } = await db.from("contact_messages").insert(record);
    if (error) throw new Error(error.message);
  } catch {
    return {
      ok: false,
      error: "Sorry, something went wrong. Please try again or email us directly.",
    };
  }

  // Fire off the email notification; never let it fail the submission.
  await sendContactNotification(record);

  return { ok: true, error: null };
}
