import type { APIRoute } from "astro";

export const prerender = false;

const LIMITS = { name: 120, email: 160, focus: 80, context: 4000 };
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const recent = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) {
    for (const [ip, stamps] of recent)
      if (stamps.every((at) => now - at >= WINDOW_MS)) recent.delete(ip);
  }
  return hits.length > MAX_PER_WINDOW;
}

function field(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function readSubmission(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    const data = new FormData();
    for (const [key, value] of Object.entries(body))
      if (value != null) data.set(key, String(value));
    return data;
  }
  return request.formData();
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // import.meta.env covers dev and build-time vars; process.env covers runtime
  // values set in the Vercel dashboard after the build.
  const token =
    import.meta.env.TELEGRAM_BOT_TOKEN ?? process.env.TELEGRAM_BOT_TOKEN;
  const chatId =
    import.meta.env.TELEGRAM_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID;

  let data: FormData;
  try {
    data = await readSubmission(request);
  } catch {
    return json({ ok: false, error: "Could not read that submission." }, 400);
  }

  // Honeypot: real people leave it empty.
  if (field(data.get("company"), 200)) return json({ ok: true }, 200);

  const name = field(data.get("name"), LIMITS.name);
  const email = field(data.get("email"), LIMITS.email);
  const focus = field(data.get("focus"), LIMITS.focus);
  const context = field(data.get("context"), LIMITS.context);
  const page = field(data.get("page"), 200);

  if (!name || !email || !context)
    return json({ ok: false, error: "Name, email, and context are required." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return json({ ok: false, error: "That email address looks incomplete." }, 400);

  const ip = clientAddress ?? request.headers.get("x-forwarded-for") ?? "unknown";
  if (rateLimited(ip))
    return json({ ok: false, error: "Too many messages. Try again shortly." }, 429);

  if (!token || !chatId) {
    console.error("contact: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return json({ ok: false, error: "Messaging is offline right now." }, 503);
  }

  const lines = [
    "<b>New project brief — 17thstreetlabs.com</b>",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    ...(focus ? [`<b>Focus:</b> ${escapeHtml(focus)}`] : []),
    ...(page ? [`<b>Page:</b> ${escapeHtml(page)}`] : []),
    "",
    escapeHtml(context),
  ];

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          text: lines.join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) {
      console.error("contact: telegram rejected the message", response.status, await response.text());
      return json({ ok: false, error: "Delivery failed. Email us directly." }, 502);
    }
  } catch (error) {
    console.error("contact: telegram request failed", error);
    return json({ ok: false, error: "Delivery failed. Email us directly." }, 502);
  }

  return json({ ok: true }, 200);
};

export const GET: APIRoute = () => json({ ok: false, error: "POST only." }, 405);
