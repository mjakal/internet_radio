// lib/validate_url.ts
import { isIP } from 'node:net';

export function isValidPublicUrl(url: string): boolean {
  if (!url) return false;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false; // invalid URL
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return false; // only http/https allowed
  }

  const host = parsed.hostname;

  if (isIP(host)) {
    const parts = host.split('.').map(Number);

    // Block loopback
    if (host === '127.0.0.1' || host === '0.0.0.0') return false;

    // Block private ranges
    if (host.startsWith('10.')) return false;
    if (host.startsWith('192.168.')) return false;
    if (host.startsWith('172.') && parts[1] >= 16 && parts[1] <= 31) return false;
  }

  return true;
}
