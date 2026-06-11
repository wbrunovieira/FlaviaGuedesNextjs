// src/lib/admin-auth.ts
// Signed session token for the admin area.
// Uses Web Crypto so it runs both in Node API routes and in the middleware.

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sign(
  value: string,
  secret: string
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(value)
  );
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(
  secret: string,
  maxAgeSeconds: number = ADMIN_SESSION_MAX_AGE
): Promise<string> {
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  const signature = await sign(String(expiresAt), secret);
  return `${expiresAt}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) return false;
  if (
    !/^\d+$/.test(expiresAt) ||
    Number(expiresAt) < Date.now()
  ) {
    return false;
  }
  const expected = await sign(expiresAt, secret);
  return timingSafeEqual(signature, expected);
}
