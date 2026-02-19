import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Text, TouchableOpacity, View } from 'react-native';

export default function LockScreen() {
  const [hasPromptedOnce, setHasPromptedOnce] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showFingerprintIcon, setShowFingerprintIcon] = useState(false);

  const runBiometrics = useCallback(async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setShowFingerprintIcon(false);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock app',
        fallbackLabel: 'Use device PIN',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        // success → navigate back into app (e.g. router.replace or navigation.reset)
        // router.replace('/(protected)/home');
      } else {
        // canceled / failed → stay on this screen and show icon
        setShowFingerprintIcon(true);
      }
    } finally {
      setIsAuthenticating(false);
      setHasPromptedOnce(true);
    }
  }, [isAuthenticating]);

  // Auto-run only once when first mounted
  useEffect(() => {
    if (!hasPromptedOnce) {
      runBiometrics();
    }
  }, [hasPromptedOnce, runBiometrics]);

  // Disable hardware back on Android so user cannot leave lock screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // block back
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        subscription.remove(); // ✅ correct cleanup
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {isAuthenticating ? (
        <>
          <ActivityIndicator />
          <Text style={{ marginTop: 16 }}>Authenticating…</Text>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 24 }}>App locked</Text>

          {showFingerprintIcon && (
            <TouchableOpacity onPress={runBiometrics} style={{ alignItems: 'center' }}>
              <MaterialIcons name="fingerprint" size={56} color="#007AFF" />
              <Text style={{ marginTop: 8 }}>Tap to try again</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
