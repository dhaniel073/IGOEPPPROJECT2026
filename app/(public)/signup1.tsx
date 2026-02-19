import GoBack from '@/components/GoBack'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Dimensions, Modal, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};

export default function signup1({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen

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

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <View style={{ flex: 1 }}>
                <GoBack lightColor='' darkColor='' onClick={() => router.back()}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
                <View style={{ margin: 15 }} />

                <ThemedText type="titleMedium">Let's get started</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>Signup as a new business or existing</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>business ( add a new user to an entity )</ThemedText>

                <View style={{ margin: 15 }} />

                <ThemedView>
                    <ThemedView style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.offwhite3, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <ThemedText type='titleLight' style={{ color: '#000' }}>Signup as a personal account</ThemedText>
                        <ThemedText style={{ color: Colors.blacktext, textAlign: 'justify' }}>
                            Ideal for individuals who need artisan services like home cleaning, repairs, or tailoring. Create jobs, track progress, and request invoices, right from your phone.
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.clock2 }}>
                        <ThemedButton style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: Colors.green, borderRadius: 40, alignSelf: 'flex-end' }} onPress={() => router.push("/signupPersonal")}>
                            <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
                        </ThemedButton>
                    </ThemedView>
                </ThemedView>

                <View style={{ margin: 10 }} />

                <ThemedView style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ borderBottomWidth: 1, width: "40%", borderBottomColor: Colors.gray9 }} />
                    <ThemedText style={{ width: "20%", textAlign: 'center' }}>Or</ThemedText>
                    <View style={{ borderBottomWidth: 1, width: "40%", borderBottomColor: Colors.gray9 }} />
                </ThemedView>

                <View style={{ margin: 10 }} />


                <ThemedView>
                    <ThemedView style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.offwhite3, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <ThemedText type='titleLight' style={{ color: '#000' }}>Signup as a new business</ThemedText>
                        <ThemedText style={{ color: Colors.blacktext, textAlign: 'justify' }}>
                            For companies registering for the first time. Hire artisans for office tasks like fumigation or maintenance and generate invoices for internal processing.
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.clock2 }}>
                        <ThemedButton style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: Colors.green, borderRadius: 40, alignSelf: 'flex-end' }} onPress={() => openPopup()}>
                            <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
                        </ThemedButton>
                    </ThemedView>
                </ThemedView>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
                <ThemedText >Already have an account? </ThemedText>
                <ThemedButton onPress={() => router.push("/login")}><ThemedText style={{ color: Colors.green }}>Login</ThemedText></ThemedButton>
            </View>

            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closePopup}
            >
                <TouchableOpacity style={styles.overlay} onPress={() => [closePopup()]} />

                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                    ]}
                >
                    <TouchableOpacity onPress={closePopup} style={{ alignSelf: 'flex-end' }}>
                        <MaterialIcons name="cancel" size={24} color={Colors.green} />
                    </TouchableOpacity>

                    <ThemedText type='subtitle' style={{ textAlign: 'center' }}>Select a request type</ThemedText>

                    <View style={{ margin: 10 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>

                        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.yellow3, padding: 12, borderRadius: 12 }]} onPress={() => router.push("/(public)/signupBusiness")}>
                            <Text style={styles.cardTitle}>
                                A New Business
                            </Text>
                            <Text style={styles.cardText}>Create a new business account.</Text>
                        </TouchableOpacity>

                        <View style={{ marginHorizontal: 5 }} />

                        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.green6, padding: 12, borderRadius: 12 }]} onPress={() => router.push("/(public)/signupBusinessEntity")}>
                            <Text style={styles.cardTitle}>
                                An Entity Account
                            </Text>
                            <Text style={styles.cardText}>Create an account under a business enity.</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 15 }} />
                </Animated.View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    cardTitle: {
        color: '#000',
        marginBottom: 6,
        fontSize: 12,
        fontFamily: 'poppinsMedium'
    },
    cardText: {
        color: Colors.blacktext,
    },
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: {
        flex: 1,
    },
})