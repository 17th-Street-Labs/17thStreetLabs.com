type Configuration = { token?: string; chatId?: string };
type Message = { text: string; format?: 'HTML' };
type DeliveryResult = { delivered: true } | { delivered: false; reason: 'unconfigured' | 'rejected' | 'unavailable' };

function configuration(): Configuration {
  // Astro supplies build-time values; server deployments can supply runtime values.
  return {
    token: import.meta.env?.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN,
    chatId: import.meta.env?.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID,
  };
}

export function createTelegramDelivery({
  configure = configuration,
  transport = fetch,
}: { configure?: () => Configuration; transport?: typeof fetch } = {}) {
  return async ({ text, format }: Message): Promise<DeliveryResult> => {
    const { token, chatId } = configure();
    if (!token || !chatId) return { delivered: false, reason: 'unconfigured' };
    try {
      const response = await transport(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, ...(format ? { parse_mode: format } : {}), disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return { delivered: false, reason: 'rejected' };
      const body = await response.json();
      if (body?.ok !== true) return { delivered: false, reason: 'rejected' };
      return { delivered: true };
    } catch {
      // Transport errors can contain the token-bearing URL; callers get a safe result.
      return { delivered: false, reason: 'unavailable' };
    }
  };
}

export const sendTelegramMessage = createTelegramDelivery();
