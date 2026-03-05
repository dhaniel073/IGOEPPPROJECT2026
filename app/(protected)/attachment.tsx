import GoBack from '@/components/GoBack';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function Attachment() {
    const { url } = useLocalSearchParams<{ url: string }>();
    const router = useRouter();
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    console.log(url)

    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);

    // On Android, WebView often downloads PDFs instead of displaying them.
    // We use Google Docs Viewer to render the PDF inline.
    const pdfUrl = Platform.OS === 'android'
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
        : url;

    const images = [{
        url: url,
    }];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <GoBack onClick={() => router.back()} lightColor={textColor} darkColor={textColor}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
            </View>
            <View style={styles.content}>
                {isImage ? (
                    <ImageViewer
                        imageUrls={images}
                        enableSwipeDown={true}
                        onSwipeDown={() => router.back()}
                        loadingRender={() => <ActivityIndicator color={textColor} size="large" />}
                        renderIndicator={() => <></>}
                    />
                ) : (
                    <WebView
                        source={{ uri: pdfUrl }}
                        style={styles.webview}
                        startInLoadingState={true}
                        originWhitelist={['*']}
                        allowsInlineMediaPlayback={true}
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                        mixedContentMode="always"
                    />
                )}
            </View>
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
        zIndex: 10,
    },
    content: { flex: 1 },
    webview: { flex: 1 },
});
