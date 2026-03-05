import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const NetworkMonitor = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let pingInterval: any;

        const checkConnection = async () => {
            try {
                // Try fetching a very small resource to verify actual internet access
                // We use a timeout to ensure we don't wait too long
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                await fetch('https://www.google.com', {
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-store',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                setIsConnected(true);
                setShowModal(false);
            } catch (error) {
                setIsConnected(false);
                setShowModal(true);
            }
        };

        // Initial check
        checkConnection();

        // Check every 10 seconds
        pingInterval = setInterval(checkConnection, 10000);

        return () => {
            if (pingInterval) clearInterval(pingInterval);
        };
    }, []);

    const handleReload = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await fetch('https://www.google.com', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            setShowModal(false);
        } catch (error) {
            console.log('Still no connection or reload failed');
        }
    };

    if (!showModal) return null;

    return (
        <Modal
            visible={showModal}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="wifi-off" size={60} color={Colors.green} />
                    </View>
                    <Text style={styles.title}>No Internet Connection</Text>
                    <Text style={styles.message}>
                        Please check your network settings and try again. Some features might not work without an active connection.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleReload}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Retry / Reload</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: Colors.green,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    fallbackText: {
        marginTop: 15,
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    }
});
