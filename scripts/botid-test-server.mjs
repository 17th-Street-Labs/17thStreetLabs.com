import { dev } from 'astro';

// Keep the process attached to Playwright; Astro's CLI detaches in agent environments.
const server = await dev({ server: { host: '127.0.0.1', port: 4368 } });
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, async () => { await server.stop(); process.exit(0); });
}
