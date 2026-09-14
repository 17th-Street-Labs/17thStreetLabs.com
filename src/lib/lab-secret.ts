import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
let developmentSecret: string | undefined;
export function labSecret() {
  const configured = import.meta.env.LAB_ACCESS_SECRET || process.env.LAB_ACCESS_SECRET;
  if (configured) return configured;
  if (!import.meta.env.DEV) return '';
  if (!developmentSecret) {
    mkdirSync('.local', {recursive: true, mode: 0o700});
    const filename = '.local/lab-access-secret';
    try { writeFileSync(filename, randomBytes(32).toString('hex'), {flag:'wx', mode:0o600}); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
    developmentSecret = readFileSync(filename, 'utf8').trim();
  }
  return developmentSecret;
}
