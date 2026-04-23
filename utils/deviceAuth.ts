import * as SecureStore from 'expo-secure-store';

function generateFallbackUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  try {
    let deviceId = await SecureStore.getItemAsync('app_device_id');
    if (!deviceId) {
      deviceId = generateFallbackUUID();
      await SecureStore.setItemAsync('app_device_id', deviceId);
    }
    return deviceId;
  } catch (error) {
    console.error('Failed to get or set device ID from SecureStore:', error);
    // Fallback to generating a session-based random UUID if SecureStore fails
    return generateFallbackUUID();
  }
}
