import GoBack from '@/components/GoBack';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function Attachment() {
    const { url } = useLocalSearchParams<{ url: string }>();
    const router = useRouter();
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    console.log(url)
    // On Android, WebView often downloads PDFs instead of displaying them.
    // We use Google Docs Viewer to render the PDF inline.
    const pdfUrl = Platform.OS === 'android'
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
        : url;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <GoBack onClick={() => router.back()} lightColor={textColor} darkColor={textColor}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
            </View>
            <WebView
                source={{ uri: pdfUrl }}
                style={styles.pdf}
                startInLoadingState={true}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                mixedContentMode="always"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pdf: { flex: 1 },
});
