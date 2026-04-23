// api/axiosClient.ts
import { signRequest } from '@/security/requestIntegrity';
import axios from 'axios';
import { verifyResponseIntegrity } from '../security/responseIntegrity';

// You can export your base URLs from here or keep them in AuthRoutes.tsx
export const YOUR_API_BASE_URL = `https://phixotech.com/igoeppms/public/api/`;

const axiosClient = axios.create({
  baseURL: YOUR_API_BASE_URL,
  // Bypass default JSON parsing to preserve exact formatting for signature verification
  transformResponse: [(data) => data],
});

// Interceptor to sign outgoing requests
axiosClient.interceptors.request.use(
  (config) => {
    // Sign request body to ensure integrity (only if data is present and not FormData)
    if (config.data && !(config.data instanceof FormData)) {
      const authHeaders = signRequest(config.data);
      Object.assign(config.headers, authHeaders);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Interceptor to verify response integrity
axiosClient.interceptors.response.use(
  (response) => {
    const sig = response.headers['x-signature'];
    const ts = response.headers['x-timestamp'];
    const nonce = response.headers['x-nonce'];

    // Since transformResponse is disabled, response.data is the raw string
    const bodyString = response.data;

    const ok = verifyResponseIntegrity(bodyString, sig, ts, nonce);

    if (!ok) {
      console.error('Response integrity failed for:', response.config.url);
      return Promise.reject(new Error('Response integrity failed'));
    }

    // Now securely parse the raw JSON string back into an object for the app
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        // Not JSON, leave as is
      }
    }

    return response;
  },
  (error) => {
    // Also parse error data if it's a string (since transformResponse is disabled)
    if (error.response && typeof error.response.data === 'string') {
      try {
        error.response.data = JSON.parse(error.response.data);
      } catch (e) {
        // Not JSON, leave as is
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
