import * as CryptoJS from 'crypto-js';

// The key from config/security.ts
const RESPONSE_SIGNING_KEY = 'kVGlKQ72B2OIRvc9UyTXyGMCiZF3cpA72fC8CKKL7S0=';

// Logic from responseIntegrity.ts
const MAX_SKEW_SECONDS = 60;
const seenNonces = new Set<string>();

function isFreshTimestamp(tsHeader: string | null): boolean {
  if (!tsHeader) return false;
  const ts = parseInt(tsHeader, 10);
  if (Number.isNaN(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - ts) <= MAX_SKEW_SECONDS;
}

function verifyResponseIntegrity(
  body: string,
  signature: string | null,
  tsHeader: string | null,
  nonce: string | null,
): boolean {
  if (!signature || !tsHeader || !nonce) return false;
  if (!isFreshTimestamp(tsHeader)) return false;
  if (seenNonces.has(nonce)) return false;
  seenNonces.add(nonce);

  const payload = `${tsHeader}.${nonce}.${body}`;
  const hmac = CryptoJS.HmacSHA256(payload, RESPONSE_SIGNING_KEY);
  const expected = CryptoJS.enc.Hex.stringify(hmac);

  return expected === signature;
}

