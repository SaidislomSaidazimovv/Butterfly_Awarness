import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FUNCTION_SECRET = Deno.env.get("FUNCTION_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const FROM = "Butterfly Challenge <hello@thebutterflychallenge.com>";
const SITE_URL = "https://thebutterflychallenge.com";

function confirmationHTML(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Butterfly Challenge</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0a2a2a 0%,#0d3d3d 100%);padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🦋</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">The Butterfly Challenge</h1>
              <p style="margin:8px 0 0;color:#32C189;font-size:13px;font-weight:500;letter-spacing:1px;text-transform:uppercase;">1 Billion Hands Campaign</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#0a0a0a;font-size:26px;font-weight:700;line-height:1.2;">You're in 🎉</h2>
              <p style="margin:0 0 16px;color:#444;font-size:16px;line-height:1.6;">We'll remind you on <strong style="color:#0a0a0a;">May 1st</strong> — the start of Butterfly Month.</p>
              <p style="margin:0 0 28px;color:#666;font-size:15px;line-height:1.6;">You signed up to be reminded about Butterfly Month. On May 1, 2026, we'll send you a link to take the challenge and share the gesture that saves lives.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf8;border:1.5px solid #32C189;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;color:#0a0a0a;font-size:14px;font-weight:600;">The Butterfly Gesture 🦋</p>
                    <p style="margin:0;color:#555;font-size:14px;line-height:1.5;">Cross your thumbs, spread your fingers wide — a 60-second act of solidarity that connects 1 billion people worldwide.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}" style="display:inline-block;background:#32C189;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 40px;border-radius:50px;letter-spacing:0.2px;">Visit the Site →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"></td></tr>
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;color:#999;font-size:12px;line-height:1.5;">You're receiving this because you signed up at thebutterflychallenge.com</p>
              <p style="margin:0;color:#bbb;font-size:12px;"><a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#bbb;text-decoration:underline;">Unsubscribe</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function reminderHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Butterfly Challenge</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0a2a2a 0%,#0d3d3d 100%);padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🦋</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">The Butterfly Challenge</h1>
              <p style="margin:8px 0 0;color:#32C189;font-size:13px;font-weight:500;letter-spacing:1px;text-transform:uppercase;">Butterfly Month Starts Now</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#0a0a0a;font-size:26px;font-weight:700;line-height:1.2;">It's time. 🦋</h2>
              <p style="margin:0 0 16px;color:#444;font-size:16px;line-height:1.6;">Butterfly Month starts <strong style="color:#0a0a0a;">today</strong>. This is the moment you signed up for.</p>
              <p style="margin:0 0 28px;color:#666;font-size:15px;line-height:1.6;">Take 60 seconds to learn the gesture, record yourself doing it, and tag 3 people. You could save a life.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf8;border:1.5px solid #32C189;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;color:#0a0a0a;font-size:14px;font-weight:600;">60 seconds. 3 names. 24 hours.</p>
                    <p style="margin:0;color:#555;font-size:14px;line-height:1.5;">Make the sign. Say their name. Pass it forward. One gesture, one billion hands.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}" style="display:inline-block;background:#32C189;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 40px;border-radius:50px;letter-spacing:0.2px;">Take the Challenge →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"></td></tr>
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px;color:#999;font-size:12px;line-height:1.5;">You received this because you signed up at thebutterflychallenge.com</p>
              <p style="margin:0;color:#bbb;font-size:11px;">One Humanity Foundation · 501(c)(3)</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { success: false, error: `Resend error ${res.status}: ${body}` };
  }
  return { success: true };
}

Deno.serve(async (req) => {
  const allowedOrigins = [
    "https://thebutterflychallenge.com",
    "https://www.thebutterflychallenge.com",
    "http://localhost:5173",
  ];
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { secret, action, email } = body;

    if (secret !== FUNCTION_SECRET) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    if (!action || !email) {
      return Response.json({ success: false, error: "Missing action or email" }, { status: 400, headers: corsHeaders });
    }

    // Rate limiting: max 3 emails per IP per 10 minutes
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";

    const { count: recentCount } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip", clientIp)
      .eq("action", "send_email")
      .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

    if ((recentCount ?? 0) >= 3) {
      return Response.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429, headers: corsHeaders }
      );
    }

    // Log this request for rate limiting
    await supabase.from("rate_limits").insert({ ip: clientIp, action: "send_email" });

    if (action === "confirmation") {
      const result = await sendEmail(
        email,
        "You're in — Butterfly Challenge reminder set 🦋",
        confirmationHTML(email)
      );
      if (result.success) {
        await supabase
          .from("email_reminders")
          .update({ sent_confirmation: true })
          .eq("email", email);
      }
      return Response.json(result, { headers: corsHeaders });
    }

    if (action === "reminder") {
      const result = await sendEmail(
        email,
        "Today is Butterfly Month — take the challenge 🦋",
        reminderHTML()
      );
      if (result.success) {
        await supabase
          .from("email_reminders")
          .update({ sent_reminder: true })
          .eq("email", email);
      }
      return Response.json(result, { headers: corsHeaders });
    }

    return Response.json({ success: false, error: `Unknown action: ${action}` }, { status: 400, headers: corsHeaders });
  } catch (e) {
    return Response.json({ success: false, error: (e as Error).message }, { status: 500, headers: corsHeaders });
  }
});
