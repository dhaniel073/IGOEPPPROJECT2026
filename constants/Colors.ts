/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import CryptoJS from "crypto-js";
import Constants from 'expo-constants';
import { Dimensions, Platform, StatusBar } from "react-native";
import 'react-native-get-random-values';

const tintColorLight = '#4F772D';
const tintColorDark = '#fff';

export const marginStyle = {
  marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 10) + 0 : 50,
};

export const DIMENSION = {
  HEIGHT: Dimensions.get('window').height,
  WIDTH: Dimensions.get('window').width
}


const base64Key = Constants.expoConfig?.extra?.aesBase64Key;

if (typeof base64Key !== 'string' || !base64Key.length) {
  throw new Error('Missing expo.extra.aesBase64Key (base64 AES key) in app config');
}

const keyBytes = CryptoJS.enc.Base64.parse(base64Key);

function generateIv() {
  if (!global.crypto || typeof global.crypto.getRandomValues !== 'function') {
    throw new Error('crypto.getRandomValues is not available; ensure react-native-get-random-values is imported at app entry.');
  }

  const bytes = new Uint8Array(16);
  global.crypto.getRandomValues(bytes);
  return CryptoJS.lib.WordArray.create(Array.from(bytes), bytes.length);
}

export const encryptData = (text: any): string => {
  const iv = generateIv();

  const encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const combined = iv.clone().concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
};

export const decryptData = (payload: any): string => {
  const raw = CryptoJS.enc.Base64.parse(payload);
  const iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, 4), 16);
  const ct = CryptoJS.lib.WordArray.create(raw.words.slice(4), raw.sigBytes - 16);

  const decrypted = CryptoJS.AES.decrypt({ ciphertext: ct } as any, keyBytes, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptAmount = (text: any) => {
  const iv = CryptoJS.lib.WordArray.random(16); // random IV each time
  const encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const combined = iv.clone().concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
};

// Decrypt Base64(iv + ciphertext) -> number (0 if invalid)
export const decryptamount = (payload: any): number => {
  if (!payload) return 0;
  if (typeof payload === 'number') return payload; // Return as-is if already a number
  if (typeof payload !== 'string') return 0; // consistent fallback


  const raw = CryptoJS.enc.Base64.parse(payload); // WordArray
  // First 16 bytes (4 * 4 bytes) as IV
  const iv = CryptoJS.lib.WordArray.create(raw.words.slice(0, 4), 16);
  // Remaining bytes as ciphertext
  const ct = CryptoJS.lib.WordArray.create(raw.words.slice(4), raw.sigBytes - 16);

  const decrypted = CryptoJS.AES.decrypt({ ciphertext: ct } as any, keyBytes, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  const amount = Number(decryptedString);

  return Number.isNaN(amount) ? 0 : amount;
};

export const convertToReadableDateTime = (dateStr: string, timeStr: string): string => {
  try {
    // Combine the date and time strings
    const combined = `${dateStr} ${timeStr}`;

    // Convert to Date
    const date = new Date(combined);

    // Handle cases where the Date constructor fails (especially on iOS)
    if (isNaN(date.getTime())) {
      const [year, month, day] = dateStr.split("-");
      return `${day} ${new Date(dateStr).toLocaleString("default", { month: "short" })}, ${year} at ${timeStr.toUpperCase()}`;
    }

    // Format date and time
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate.replace(',', '')} at ${formattedTime}`;
  } catch (error) {
    console.error("Date conversion error:", error);
    return `${dateStr} at ${timeStr}`;
  }
};

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};

export const toCamelCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const extractInsideParentheses = (text: any) => {
  if (!text) return null;

  const match = text.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};


export const removeLastChar = (text: any) => {
  if (!text || text.length === 0) return null;
  return text.slice(0, -1);
};





export const Colors = {
  yellow: "#FFCC00B2",
  yellow1: "#FFCC00",
  yellow2: "#C4BD02",
  yellow3: "#fffee6",
  shadow: "#f1f7fceb",
  white: '#fff',
  gray6: "#f2f2f2",
  gray7: "#d9d9d9",
  gray9: "#8C8A93",
  gray10: "#D6D6D6",
  gray11: "#EDEEF2",
  gray8: "#E1E6EF",
  wallet: "#90A955",
  custicon: "#FD6922B2",
  helmet: "#FFF1B7",
  helmetbackground: "#fff7d7",
  blacktext: "#5A5B78",
  bookingbackground: "#eaf4f0",
  bookingoutline: "#15aa5b",
  clock: "#cedfd6",
  clock1: "#d5e7de",
  gold: '#FF9A3E',
  marker: '#FF7043',
  green: "#4F772D",
  green1: "#94BC06",
  green2: "#198754",
  green3: "#D1E7DD75",
  green4: "#27C153",
  green5: "#299A33",
  green6: "#e9f3ef",
  green7: "#edefe5",
  green8: "#4F6400",
  green9: '#00860C',
  green10: '#daeae5',
  green11: '#5b8135',
  clock2: "#eaf4f0",
  clock3: "#aec594",
  offwhite: "#eef0e6",
  offwhite1: "#EFEFEF",
  offwhite2: "#E7E7E7",
  offwhite3: "#FAFAFA",
  error100: '#fcdcbf',
  error200: "#FEE4E2",
  error300: "#FEF3F2",
  gray: "#f2f2f2",
  gray1: "#A0A0AA",
  lightgray: "#F6F7F9",
  red: "#ED2F46",
  red2: "#FDE8EA",
  brown: "#865300",
  brown1: "#FFECC6",
  lemon: "#808500",
  lemon1: "#fffee8",
  primary4: '#27C153',
  primary5: '#e2f2e9',
  invoicebrg: "#D1E7DD75",


  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

