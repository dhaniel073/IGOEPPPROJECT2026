import GoBack from "@/components/GoBack";
import LogoSpinner from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, decryptData } from "@/constants/Colors";
import { useAuth } from "@/hooks/AuthContext";
import { helperget, PUBLIC_API_BASE_URL, YOUR_API_BASE_URL } from "@/hooks/AuthRoutes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Platform, StyleSheet, View } from "react-native";
import { Bubble, GiftedChat, Send, User } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ChatScreen() {
    const { id, helperId, helper_user_id } = useLocalSearchParams()
    const { token, user, logout } = useAuth();

    const [messages, setMessages] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const [previousMessages, setPreviousMessage] = useState<any>([])
    const navigation = useNavigation()
    const CustomerId = user?.userid.toString() || "";
    const [helperdata, setHelperData] = useState<any>([])
    const router = useRouter()

    useEffect(() => {
        helperInfo()
    }, [])

    const helperInfo = async () => {
        try {
            setLoading(true)
            const response = await helperget(helperId, decryptData(token))
            setHelperData(response.data.data)
        } catch (error: any) {
            Alert.alert('Error', 'An error occurred. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    // Fetch chat messages
    const fetchMessages = useCallback(async () => {
        try {
            const url = `${YOUR_API_BASE_URL}auth/hrequest/helpchatview/${id}/customer`;
            const response = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${decryptData(token)}`,
                },
            });
            var count = Object.keys(response.data).length;
            let stateArray = []
            for (var i = 0; i < count; i++) {
                stateArray.push({
                    _id: response.data[i].id,
                    createdAt: response.data[i].created_at,
                    text: response.data[i].message,
                    user: {
                        _id: `${response.data[i].from_user_id}`,
                        name: 'React Native',
                        avatar: null
                        // avatar: helper.photo === null ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLYtkaHut2_Xctb0hUZGZk7pbCbIzcoMSNA&usqp=CAU`: `${PUBLIC_API_BASE_URL}handyman/${helper.photo}`,
                    },
                },
                )
                setPreviousMessage(response.data[i].from_user_id)
            }
            const descArr = stateArray.sort().reverse();
            setMessages(descArr)
        } catch (error: any) {
            return;
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    const SendMessage = (text: any,) => {
        const url = `${YOUR_API_BASE_URL}auth/hrequest/helpchat`
        axios.post(url, {
            help_id: id,
            from_user_id: user?.userid,
            to_user_id: helper_user_id,
            message: text,
            user_type: 'helper'
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${decryptData(token)}`
            }
        }).then((res) => {
            return
        }).catch((error: any) => {
            return;
        })
    }

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages: any) => GiftedChat.append(previousMessages, messages))

        const { _id, createdAt, text, user } = messages[0]
        SendMessage(text)
    }, [])

    // Custom bubble styling
    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: Colors.green },
                left: { backgroundColor: "#E5E5EA" },
            }}
            textStyle={{
                right: { color: "#fff" },
                left: { color: "#000" },
            }}
        />
    );

    const scrollToBottomComponent = (props: any) => {
        return (
            <FontAwesome5 name="angle-double-down" size={22} color="#333" />
        )
    }

    // Custom send button
    const renderSend = (props: any) => (
        <Send {...props}>
            <View style={{ marginRight: 10, marginBottom: 5 }}>
                <Ionicons name="send" size={22} color={Colors.green} />
            </View>
        </Send>
    );

    if (loading) {
        return (
            <LogoSpinner lightColor="" darkColor="" />
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 10, backgroundColor: backgroundColor, }} edges={['top', 'bottom']}>
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginBottom: 10 }}>
                <GoBack onClick={() => router.push("/(protected)/(tabs)/bookings")} lightColor={""} darkColor={""}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
                {
                    helperdata.photo === null ?
                        <Image style={styles.image} source={require("@/assets/images/avatar1.png")} />
                        :
                        <Image style={styles.image} source={{ uri: `${PUBLIC_API_BASE_URL}handyman/${helperdata.photo}` }} />
                }
                <ThemedText style={{ fontSize: 14, fontFamily: 'poppinsSemiBold' }}>{helperdata.first_name} {helperdata.last_name}</ThemedText>
                {/* <Text style={styles.chattxt}>Chat</Text> */}
            </ThemedView>
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={false}
                onSend={onSend}
                user={{
                    _id: CustomerId,
                    name: user?.first_name,
                } as User}
                renderBubble={renderBubble}
                alwaysShowSend
                renderSend={renderSend}
                scrollToBottomComponent={() => null}
                keyboardShouldPersistTaps="handled"
                bottomOffset={Platform.OS === "ios" ? 20 : 0}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 35,
        height: 35,
        marginRight: 3,
        borderRadius: 100
    }
})