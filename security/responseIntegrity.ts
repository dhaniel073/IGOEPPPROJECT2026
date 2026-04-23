// security/responseIntegrity.ts
import CryptoJS from 'crypto-js';
import { RESPONSE_SIGNING_KEY } from '../config/security';

const MAX_SKEW_SECONDS = 60;

const seenNonces = new Set<string>();
const NONCE_CLEAR_MS = 5 * 60_000;
setInterval(() => seenNonces.clear(), NONCE_CLEAR_MS);

function isFreshTimestamp(tsHeader: string | null): boolean {
  if (!tsHeader) return false;
  const ts = parseInt(tsHeader, 10);
  if (Number.isNaN(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - ts) <= MAX_SKEW_SECONDS;
}

export function verifyResponseIntegrity(
  body: string,
  signature: string | null,
  tsHeader: string | null,
  nonce: string | null,
): boolean {
  if (!signature || !tsHeader || !nonce) return false;
  if (!isFreshTimestamp(tsHeader)) return false;
  if (seenNonces.has(nonce)) return false; // replay
  seenNonces.add(nonce);

  const payload = `${tsHeader}.${nonce}.${body}`;

  const hmac = CryptoJS.HmacSHA256(payload, RESPONSE_SIGNING_KEY);
  const expected = CryptoJS.enc.Hex.stringify(hmac); // hex string

  return expected === signature;
}
