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
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <div style="background:#00b18d;padding:32px 32px 24px;text-align:center;">
      <span style="font-size:40px;">🦋</span>
    </div>
    <div style="padding:32px;">
      <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px;">We'll remind you on May 1st</h1>
      <p style="font-size:15px;color:#4d4d4d;line-height:1.65;margin:0 0 24px;">
        You signed up to be reminded about Butterfly Month. On May 1, 2026, we'll send you a link to take the challenge and share the gesture that saves lives.
      </p>
      <a href="${SITE_URL}" style="display:inline-block;background:#00b18d;color:#fff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:100px;text-decoration:none;">
        Visit the site
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e5e5ea;text-align:center;">
      <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="font-size:12px;color:#6e6e73;text-decoration:underline;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`;
}

function reminderHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <div style="background:#00b18d;padding:32px 32px 24px;text-align:center;">
      <span style="font-size:40px;">🦋</span>
    </div>
    <div style="padding:32px;">
      <h1 style="font-size:22px;font-weight:700;color:#111;margin:0 0 12px;">It's time.</h1>
      <p style="font-size:15px;color:#4d4d4d;line-height:1.65;margin:0 0 24px;">
        Butterfly Month starts today. Take 60 seconds to learn the gesture, record yourself doing it, and tag 3 people. You could save a life.
      </p>
      <a href="${SITE_URL}" style="display:inline-block;background:#00b18d;color:#fff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:100px;text-decoration:none;">
        Take the Challenge
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e5e5ea;text-align:center;">
      <p style="font-size:11px;color:#6e6e73;margin:0;">
        You received this because you signed up at thebutterflychallenge.com.
        <br>One Humanity Foundation · 501(c)(3)
      </p>
    </div>
  </div>
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
