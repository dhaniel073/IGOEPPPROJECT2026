import EmptyScreen from '@/components/EmptyScreen';
import GoBack from '@/components/GoBack';
import LogoSpinner from '@/components/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import { Colors, decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { notification, notificationbyid } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get("window")

export type Props = {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor?: { dark: string; light: string };
};

export default function notificationview({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    const router = useRouter()
    const { user, token, logout } = useAuth()
    const [isFetching, setIsFetching] = useState(false)
    const [fetchedmessage, setFetchedMessage] = useState<any>([])
    const [fetchedmessagebyid, setFetchedMessageById] = useState<any>([])
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await notification(user?.userid, decryptData(token));
                setFetchedMessage(response);
            } catch (error: any) {
                Alert.alert('Error', 'An error occurred. Please try again later.')
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, [navigation, user?.customer_id, token]);

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    const reload = async () => {
        try {
            const response = await notification(user?.userid, decryptData(token))
            setFetchedMessage(response)
        } catch (error: any) {
            Alert.alert('Error', 'Sorry an error occured')
            return;
        }
    }

    const getnotificationbyid = async (id: any) => {
        try {
            setIsFetching(true)
            const response = await notificationbyid(id, decryptData(token))
            setFetchedMessageById(response)
        } catch (error: any) {
            Alert.alert('Error', 'Sorry an error occured')
            return;
        } finally {
            setIsFetching(false)
        }
    }

    const openPopup = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0, // Slide to the screen
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closePopup = () => {
        Animated.timing(slideAnim, {
            toValue: height, // Slide back down
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false)); // Close after animation
    };

    if (isFetching) {
        return <LogoSpinner lightColor='' darkColor='' />
    }


    return (
        <SafeAreaView
            style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }}
            edges={['top', 'bottom']}
        >
            <Animated.View>
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>

                <View style={{ margin: 6 }} />
                <ThemedText type="titleMedium">Notifications</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>View your app activities here</ThemedText>

                <View style={{ margin: 15 }} />

                {
                    fetchedmessage.length === 0 ? (
                        <Animated.ScrollView showsVerticalScrollIndicator={false}>
                            <EmptyScreen
                                mainText="You have no notification"
                                subText="Your notification will appear here when they arrive."
                                imageSource={require('@/assets/images/notification.png')}
                            />
                        </Animated.ScrollView>
                    ) : (
                        <FlatList
                            keyExtractor={(item: any) => item.id.toString()}
                            data={fetchedmessage}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            renderItem={({ item }) => (

                                <TouchableOpacity onPress={() => [openPopup(), getnotificationbyid(item.id)]} activeOpacity={0.3} style={{ marginHorizontal: 10, paddingHorizontal: 15, paddingVertical: 15, boxShadow: '2px 4px 6px rgba(0,0,0,0.35)', borderRadius: 6, marginBottom: 15 }}>
                                    <ThemedText>#{item.id}</ThemedText>
                                    <ThemedText style={{ textAlign: 'justify', fontSize: 12 }}>{item.message}</ThemedText>
                                    <ThemedText type='small' style={{ alignSelf: 'baseline', color: Colors.gray1 }}>{formatDate(item.message_date)}</ThemedText>
                                </TouchableOpacity>
                            )}
                        />
                    )
                }

                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={closePopup}
                >

                    <TouchableOpacity style={styles.overlay} onPress={() => [closePopup(), reload()]} />

                    <Animated.View
                        style={[
                            styles.popup,
                            { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' },
                        ]}
                    >
                        <View style={{ margin: 5 }} />
                        <ThemedText style={{ textAlign: 'justify' }}>{fetchedmessagebyid.message}</ThemedText>

                    </Animated.View>
                </Modal>

            </Animated.View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    popup: {
        // position: 'absolute',
        // bottom: 0,
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})