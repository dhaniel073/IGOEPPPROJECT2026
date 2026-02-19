import { BookingCard } from '@/components/BookingCard'
import EmptyScreen from '@/components/EmptyScreen'
import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { showcompletedrequestbycustomerid } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect } from 'react'
import { Alert, Animated, FlatList, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


export default function bookinghistory({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isFetching, setIsFetching] = React.useState(false);
    const [fetchedRequest, setFetchedRequest] = React.useState<any[]>([]);
    const navigation = useNavigation();
    const { user, token, updateUserFields, logout } = useAuth();

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await showcompletedrequestbycustomerid(user?.customer_id, decryptData(token));
                setFetchedRequest(response);
            } catch (error: any) {
                console.error("Error fetching pending requests:", error);
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'Unable to load notification settings.')
                }
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, [navigation, user?.customer_id, token]);

    if (isFetching) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>
            <View style={{ margin: 6 }} />
            <ThemedText type="titleMedium">Bookings</ThemedText>
            <ThemedText style={{ color: Colors.gray9 }}>View bookings</ThemedText>

            <View style={{ margin: 10 }} />


            {
                fetchedRequest.length === 0 ? (
                    <Animated.ScrollView showsVerticalScrollIndicator={false}>
                        <EmptyScreen
                            mainText="You have no booking yet"
                            subText="Your booking will appear once you add a new booking."
                            imageSource={require('@/assets/images/history.png')}
                        />
                    </Animated.ScrollView>
                ) : (
                    <FlatList
                        data={fetchedRequest}
                        renderItem={({ item }) => <BookingCard item={item} />}
                        keyExtractor={(item: any) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                )
            }
            <View style={{ paddingBottom: '10%' }} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        alignSelf: 'center'
    },
    line1: {
        marginTop: 15,
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray9
    },
})