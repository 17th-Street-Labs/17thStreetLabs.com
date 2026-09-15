import { checkBotId } from 'botid/server';

export function createBotProtection(check = checkBotId) {
  return async (request: Request): Promise<Response | null> => {
    try {
      const result = await check({
        advancedOptions: { checkLevel: 'basic', headers: Object.fromEntries(request.headers) },
        // Explicitly restrict the SDK's development bypass to Astro development.
        developmentOptions: { isDevelopment: import.meta.env?.DEV === true, bypass: 'HUMAN' },
      });
      if (result.isBot === false) return null;
      return Response.json({ ok: false, error: 'We couldn’t verify this request. Please reload the page and try again.' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } });
    } catch {
      return Response.json({ ok: false, error: 'Verification is unavailable. Please try again shortly.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  };
}

export const protectSubmission = createBotProtection();
