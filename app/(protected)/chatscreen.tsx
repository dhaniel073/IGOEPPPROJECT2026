import axiosClient from "@/api/axiosClient";
import GoBack from "@/components/GoBack";
import LogoSpinner from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, decryptData } from "@/constants/Colors";
import { useAuth } from "@/hooks/AuthContext";
import { helperget, PUBLIC_API_BASE_URL, YOUR_API_BASE_URL } from "@/hooks/AuthRoutes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Bubble, GiftedChat, IMessage, InputToolbar, Send } from "react-native-gifted-chat";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ExtendedMessage extends IMessage {
    pending?: boolean;
    sent?: boolean;
}

export type Props = {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor?: { dark: string; light: string };
};

export default function chatscreen({
    lightColor,
    darkColor,
}: Props) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const { helperId, helper_user_id, id } = useLocalSearchParams();
    const { token, user, logout } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    id




    const [messages, setMessages] = useState<ExtendedMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [helperData, setHelperData] = useState<any>(null);

    const backgroundColor = useThemeColor({}, "background");
    const HelperId = user?.userid?.toString() || "";

    useEffect(() => {
        const fetchHelperInfo = async () => {
            try {
                setLoading(true);
                const response = await helperget(helperId, decryptData(token));
                setHelperData(response.data.data);
                console.log(response.data)
            } catch (error: any) {
                if (error.response?.status !== 401) {
                    console.log("Error fetching helper info:", error.response || error.response);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHelperInfo();
    }, [helperId, token, logout, router]);

    const fetchMessages = useCallback(async () => {
        try {
            const url = `${YOUR_API_BASE_URL}auth/hrequest/helpchatview/${id}/customer`;
            const response = await axiosClient.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${decryptData(token)}`,
                },
            });

            const data = response.data;
            if (Array.isArray(data)) {
                const formattedMessages: IMessage[] = data.map((msg: any) => {
                    const msgFromIdStr = msg.from_user_id?.toString();
                    // If it matches the customer's ID, it's not me. Otherwise, it's me.
                    const isMe = msgFromIdStr !== helper_user_id;

                    return {
                        _id: msg.id,
                        createdAt: new Date(msg.created_at),
                        text: msg.message,
                        user: {
                            _id: isMe ? HelperId : msgFromIdStr,
                            name: isMe ? (user?.first_name || 'Me') : (helperData?.first_name || 'Customer'),
                            avatar: isMe ? undefined : (helperData?.photo ? `${PUBLIC_API_BASE_URL}handyman/${helperData.photo}` : undefined),
                        },
                    };
                });


                // Sort by newest first
                formattedMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setMessages(prevMessages => {
                    // Keep pending messages that are not yet in the server response
                    const serverIds = new Set(formattedMessages.map(m => m._id));
                    const pendingMessages = prevMessages.filter(m => m.pending && !serverIds.has(m._id));

                    const combined = [...pendingMessages, ...formattedMessages];
                    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    return combined;
                });
            }
        } catch (error: any) {
            // console.log("Error fetching messages:", error.response?.data || error.message);
        }
    }, [id, token, helper_user_id, HelperId, helperData]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const sendMessageToApi = useCallback(async (localMessage: IMessage) => {
        try {
            const url = `${YOUR_API_BASE_URL}auth/hrequest/helpchat`;
            const response = await axiosClient.post(url, {
                help_id: id,
                from_user_id: user?.userid,
                to_user_id: helper_user_id,
                message: localMessage.text,
                user_type: 'helper'
            }, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${decryptData(token)}`
                }
            });

            if (response.data && response.data.id) {
                setMessages((previousMessages) => {
                    return previousMessages.map(msg =>
                        msg._id === localMessage._id
                            ? { ...msg, _id: response.data.id, sent: true, pending: false } // Update ID to match server
                            : msg
                    );
                });
            } else {
                // Just mark sent
                setMessages((previousMessages) => {
                    return previousMessages.map(msg =>
                        msg._id === localMessage._id
                            ? { ...msg, sent: true, pending: false }
                            : msg
                    );
                });
            }

        } catch (error: any) {
            console.log(error.response)
            console.log("Error sending message:", error.response?.data);
            Alert.alert("Error", "Failed to send message");
            // Mark as not pending (or error state?)
            setMessages((previousMessages) => {
                return previousMessages.map(msg =>
                    msg._id === localMessage._id
                        ? { ...msg, pending: false, error: true } // Or keep pending?
                        : msg
                );
            });
        }
    }, [id, user?.userid, helper_user_id, token, HelperId]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        // Add pending flag
        const messagesWithStatus = newMessages.map(msg => ({ ...msg, pending: true, sent: false }));

        setMessages((previousMessages) => GiftedChat.append(previousMessages, messagesWithStatus));
        // const { text } = newMessages[0];
        sendMessageToApi(messagesWithStatus[0]);
    }, [sendMessageToApi]);

    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: Colors.green,
                    borderRadius: 15,
                    borderBottomRightRadius: 2,
                    padding: 2,
                },
                left: {
                    backgroundColor: "#F0F0F0",
                    borderRadius: 15,
                    borderBottomLeftRadius: 2,
                    padding: 2,
                },
            }}
            textStyle={{
                right: { color: "#fff", fontFamily: 'poppinsRegular', fontSize: 14 },
                left: { color: "#000", fontFamily: 'poppinsRegular', fontSize: 14 },
            }}
        />
    );

    const renderSend = (props: any) => (
        <Send {...props}>
            <View style={{ marginRight: 10, marginBottom: 5 }}>
                <Ionicons name="send" size={24} color={Colors.green} />
            </View>
        </Send>
    );

    // const scrollToBottomComponent = () => (
    //     <FontAwesome5 name="angle-double-down" size={22} color="#333" />
    // );

    if (loading && !helperData) {
        return <LogoSpinner lightColor="" darkColor="" />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <View style={{ flex: 1 }}>

                <ThemedView style={styles.header}>
                    <GoBack onClick={() => router.back()} lightColor="" darkColor=""></GoBack>

                    {helperData?.photo ? (
                        <Image style={styles.avatar} source={{ uri: `${PUBLIC_API_BASE_URL}handyman/${helperData.photo}` }} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={28} color={color} />
                    )}

                    <ThemedText style={styles.headerTitle}>
                        {helperData ? `${helperData.first_name} ${helperData.last_name}` : 'Chat'}
                    </ThemedText>
                </ThemedView>

                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: HelperId,
                        name: user?.first_name || 'Me',
                    }}
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    bottomOffset={insets.bottom}
                    keyboardShouldPersistTaps="handled"
                    renderInputToolbar={props => (
                        <InputToolbar
                            {...props}
                            containerStyle={{
                                borderTopWidth: 1,
                                borderTopColor: '#eee',
                                paddingHorizontal: 5,
                                paddingVertical: 2,
                            }}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Consider theming this border color if needed
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#eee',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'poppinsSemiBold',
        flex: 1,
    }
});