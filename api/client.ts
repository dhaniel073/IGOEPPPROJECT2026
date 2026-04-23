// api/client.ts
import { verifyResponseIntegrity } from '../security/responseIntegrity';

export async function secureFetch(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const text = await res.text();

  const sig = res.headers.get('x-signature');
  const ts = res.headers.get('x-timestamp');
  const nonce = res.headers.get('x-nonce');

  const ok = verifyResponseIntegrity(text, sig, ts, nonce);

  if (!ok) {
    // Central handling: maybe show toast, log out, etc.
    throw new Error('Response integrity failed');
  }

  try {
    return {
      json: JSON.parse(text),
      raw: text,
      response: res,
    };
  } catch (e) {
    return {
      json: null,
      raw: text,
      response: res,
    };
  }
}
