import CryptoJS from 'crypto-js';
import { REQUEST_SIGNING_KEY } from '../config/security';

/**
 * Signs an outgoing request body with HMAC-SHA256.
 * @param data The request body (object or string)
 * @returns Headers containing signature, timestamp, and nonce.
 */
export function signRequest(data: any): { 'x-signature': string; 'x-timestamp': string; 'x-nonce': string } {
  const timestamp = Date.now().toString();
  
  // Use a more robust random generation compatible with React Native
  let nonce = '';
  try {
    const bytes = new Uint8Array(16);
    if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
      global.crypto.getRandomValues(bytes);
      nonce = CryptoJS.lib.WordArray.create(Array.from(bytes), bytes.length).toString();
    } else {
      // Fallback if crypto is unavailable (unlikely if react-native-get-random-values is imported)
      nonce = Math.random().toString(36).substring(2, 15);
    }
  } catch (e) {
    nonce = Math.random().toString(36).substring(2, 15);
  }
  
  // Convert data to string for signing
  const bodyString = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : '';
  
  // Construct message to sign: timestamp + nonce + body
  const message = timestamp + nonce + bodyString;
  
  // Create HMAC-SHA256 signature
  const hash = CryptoJS.HmacSHA256(message, REQUEST_SIGNING_KEY);
  const signature = CryptoJS.enc.Base64.stringify(hash);
  
  return {
    'x-signature': signature,
    'x-timestamp': timestamp,
    'x-nonce': nonce,
  };
}
