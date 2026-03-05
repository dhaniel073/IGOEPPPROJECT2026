import { Colors } from '@/constants/Colors';
import * as Device from 'expo-device';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface SecurityWrapperProps {
    children: React.ReactNode;
}

/**
 * SecurityWrapper checks for device integrity.
 * Currently it checks if the app is running on a physical device.
 * Real-world production apps would also use libraries like 'react-native-jailbreak-detector'
 * or 'expo-secure-store' combined with server-side attestation.
 */
export const SecurityWrapper: React.FC<SecurityWrapperProps> = ({ children }) => {
    const [isSecure, setIsSecure] = useState<boolean | null>(null);

    useEffect(() => {
        const checkSecurity = async () => {
            // In production, you might want to allow emulators during development
            // but block them in the production build.
            const isEmulator = !Device.isDevice;

            // NOTE: Root/Jailbreak detection usually requires native modules or 3rd party libs
            // that might not be available in Expo Go without custom devs. 
            // For this implementation, we focus on Emulator detection as a proxy for dev environments.

            if (__DEV__) {
                // Allow emulators in development mode for easier testing
                setIsSecure(true);
                return;
            }

            if (isEmulator) {
                setIsSecure(false);
                Alert.alert(
                    'Security Warning',
                    'This application cannot run on an emulator or a compromised device for security reasons.',
                    [{ text: 'Exit', onPress: () => BackHandler.exitApp() }]
                );
            } else {
                setIsSecure(true);
            }
        };

        checkSecurity();
    }, []);

    if (isSecure === null) {
        return null; // Or a loading spinner
    }

    if (isSecure === false) {
        return (
            <View style={styles.container}>
                <ThemedText type="subtitle" style={styles.text}>
                    Device Security Violation
                </ThemedText>
                <ThemedText style={styles.subtext}>
                    Please run the app on a secure, physical device.
                </ThemedText>
            </View>
        );
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    text: {
        color: Colors.red,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtext: {
        textAlign: 'center',
        color: '#666',
    },
});
