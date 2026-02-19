import { BookingCard } from '@/components/BookingCard'
import EmptyScreen from '@/components/EmptyScreen'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { showpendingrequestbycustomerid, walletbal } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useLayoutEffect } from 'react'
import { Alert, Animated, FlatList, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


export default function bookings({
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
    const [refreshing, setRefreshing] = React.useState(false);



    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await showpendingrequestbycustomerid(user?.customer_id, decryptData(token));
                console.log(response)
                setFetchedRequest(response);
            } catch (error: any) {
                console.log(user)
                console.log(error)
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'Unable to load requests.')
                }
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, [navigation, user?.customer_id, token]);

    const fetchData = async () => {
        setRefreshing(true);
        const response = await showpendingrequestbycustomerid(user?.customer_id, decryptData(token)); // your API call
        setFetchedRequest(response);
        setRefreshing(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await walletbal(user?.customer_id, decryptData(token));
                updateUserFields({ wallet_balance: response.wallet_balance })
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [])

    if (isFetching) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <View style={{ margin: 6 }} />
            <ThemedText type="titleMedium">Bookings</ThemedText>
            <ThemedText style={{ color: Colors.gray9 }}>View bookings</ThemedText>
            <View style={{ margin: 6 }} />
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
                        refreshing={refreshing}
                        onRefresh={fetchData}
                    />
                )
            }
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