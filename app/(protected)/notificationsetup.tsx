import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { viewalertsetup } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import axios from 'axios'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, StyleSheet, Switch, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type Props = {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor?: { dark: string; light: string };
};

export default function NotificationSetup({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
  const router = useRouter()
  const {user, token, logout} = useAuth()
  const [isloading, setIsLoading] = useState(false)

  const [emailEnabled, setEmailEnabled] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const res = await viewalertsetup(user?.customer_id, decryptData(token))
        setEmailEnabled(res.data.email === 1 ? true : false)
        setSmsEnabled(res.data.sms === 1 ? true : false)
        setPushEnabled(res.data.pushN === 1 ? true : false)
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'Unable to load notification settings.')
        }
      }finally{
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

    const updateNotification = async (type: 'SA' | 'EA' | 'PA', alert_type: 'S' | 'E' | 'P',  enabled: boolean) => {
        const action = enabled ? 'custalertsetups' : 'removecustalertsetups';

        const url =
            action === 'custalertsetups'
            ? `https://phixotech.com/igoepp/public/api/auth/customer/custalertsetups`
            : `https://phixotech.com/igoepp/public/api/auth/customer/removecustalertsetups/${user?.customer_id}/${type}/${alert_type}`;


        const method = action === 'custalertsetups' ? 'post' : 'get';

        try {
            // ✅ build common payload and headers
            const payload = {
                customer_id: user?.customer_id,
                event_type: type,
                alert_type: alert_type,
            };

            const headers = {
                Accept: 'application/json',
                Authorization: `Bearer ${decryptData(token)}`,
            };

            // ✅ dynamic axios call
            const res = await axios({
                method,
                url,
                data: payload,
                headers,
            });

            console.log('Response:', res.data);
        } catch (err:any) {
            console.log(err.response.data);
            Alert.alert('Error', `Unable to set  ${type === 'EA' ? 'email' : type === 'PA' ? "push" : 'sms'} notifications.`);

            // revert state since request failed
            if (type === 'EA') setEmailEnabled((prev) => !prev);
            if (type === 'SA') setSmsEnabled((prev) => !prev);
            if (type === 'PA') setPushEnabled((prev) => !prev);
        }
    };


    if(isloading){
        return <LogoSpinner lightColor='' darkColor=''/>
    }


  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }}
      edges={['top']}
    >
      <Animated.ScrollView showsVerticalScrollIndicator={false}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>

        <View style={{ margin: 6 }} />
        <ThemedText type="titleMedium">Notification Setup</ThemedText>
        <ThemedText style={{ color: Colors.gray9 }}>Set notification by types</ThemedText>

        <View style={{ margin: 15 }} />

        <View style={styles.row}>
          <ThemedText>Email</ThemedText>
          <Switch
            value={emailEnabled}
            onValueChange={(val) => {
              setEmailEnabled(val)
              updateNotification('EA', 'E', val)
            }}
            trackColor={{ false: Colors.gray9, true: Colors.green }}
            thumbColor={emailEnabled ? Colors.white : "#f4f3f4"}
          />
        </View>

        <View style={{ margin: 15 }} />

        <View style={styles.row}>
          <ThemedText>SMS</ThemedText>
          <Switch
            value={smsEnabled}
            onValueChange={(val) => {
              setSmsEnabled(val)
              updateNotification('SA', 'S', val)
            }}
            trackColor={{ false: Colors.gray9, true: Colors.green }}
            thumbColor={emailEnabled ? Colors.white : "#f4f3f4"}
          />
        </View>

        <View style={{ margin: 15 }} />

        <View style={styles.row}>
          <ThemedText>Push Notifications</ThemedText>
          <Switch
            value={pushEnabled}
            onValueChange={(val) => {
              setPushEnabled(val)
              updateNotification('PA', 'P', val)
            }}
            trackColor={{ false: Colors.gray9, true: Colors.green }}
            thumbColor={emailEnabled ? Colors.white : "#f4f3f4"}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
