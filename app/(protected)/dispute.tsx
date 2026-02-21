import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { disputelog } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Animated, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor?: { dark: string; light: string };
};

export default function dispute({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    const router = useRouter()
    const { token } = useAuth()
    const { requestid } = useLocalSearchParams()
    const [isloading, setisloading] = useState(false)
    const [formData, setFormData] = useState<any>({
        description: "",
    })


    const handleRequest = async () => {
        try {
            setisloading(true)
            const response = await disputelog(requestid, formData.description, decryptData(token))
            Alert.alert('Success', 'Your dispute has been logged successfully', [
                {
                    text: "OK",
                    onPress: () => router.push('/(protected)/(tabs)/bookings')
                }
            ])
        } catch (error: any) {
            Alert.alert('Error', error.response.data.message || 'An error occured try again later', [
                {
                    text: "OK",
                    onPress: () => router.push('/(protected)/(tabs)/bookings')
                }
            ])
        } finally {
            setisloading(false)
        }
    }

    if (isloading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }


    return (
        <SafeAreaView
            style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }}
            edges={['top', 'bottom']}
        >
            <Animated.ScrollView showsVerticalScrollIndicator={false}>
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>

                <View style={{ margin: 6 }} />
                <ThemedText type="titleMedium">Request Dispute</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>Log a dispute concerning a request</ThemedText>

                <View style={{ margin: 15 }} />

                <ThemedText>Reason for dispute</ThemedText>
                <Input
                    placeholder="Reason for making a dispute"
                    keyboardType="default"
                    onUpdateValue={(text) => setFormData({ ...formData, description: text })}
                    value={formData.description}
                    multiline
                // isInvalid={!!errors.description}
                />

                <View style={{ margin: 15 }} />

                <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center', backgroundColor: Colors.green }} onPress={() => !formData.description ? alert("Please enter a reason for making this dispute") : handleRequest()}>
                    <ThemedText type='smallBold' style={{ color: "#fff" }}>Proceed</ThemedText>
                </ThemedButton>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({})