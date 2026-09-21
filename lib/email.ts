import "server-only";

/**
 * Sends contact-form notifications by email via Resend's HTTP API.
 *
 * Configured through env vars (all optional — if RESEND_API_KEY is unset, email
 * is skipped and the submission is still stored in the DB):
 *   RESEND_API_KEY      — Resend API key
 *   CONTACT_NOTIFY_FROM — verified sender, e.g. "D3 Website <noreply@d3dynamic.com>"
 *   CONTACT_NOTIFY_TO   — recipient inbox, e.g. "info@d3dynamic.com"
 *
 * Never throws: email failures must not fail the form submission.
 */
export async function sendContactNotification(input: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_NOTIFY_FROM;
  const to = process.env.CONTACT_NOTIFY_TO;

  if (!apiKey || !from || !to) {
    // Not configured yet — submission is already stored in the DB.
    return;
  }

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(input.phone ?? "—")}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `New enquiry from ${input.name}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Contact email failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Contact email error:", err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
