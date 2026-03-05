import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GoBack from '@/components/GoBack';
import Input from '@/components/Input';
import LogoSpinner from '@/components/LoadingScreen';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, decryptData, encryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { customerresetpassword } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';

export type Props = {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor?: { dark: string; light: string };
};

export default function ResetPassword({
  lightColor,
  darkColor,
}: Props) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter();
  const { user, token, logout } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    // Basic validation
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await customerresetpassword(user?.email, encryptData(newPassword), decryptData(token));
      Alert.alert(
        'Success!',
        'Your password has been changed successfully.',
        [{ text: 'OK', onPress: () => router.push('/settings') }]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Unable to change password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LogoSpinner lightColor='' darkColor='' />
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color1 }]} edges={['top', 'bottom']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
          <ThemedText style={styles.backText}>Back</ThemedText>
        </GoBack>

        <View style={styles.headerSection}>
          <ThemedText type="titleMedium">Reset Password</ThemedText>
          <ThemedText style={styles.subText}>Enter your new password below</ThemedText>
        </View>

        <View style={{ marginVertical: 10 }}>
          <ThemedText>New Password</ThemedText>
          <Input
            placeholder="Enter new password"
            secure
            value={newPassword}
            onUpdateValue={setNewPassword}
          />

          <View style={{ marginVertical: 10 }} />
          <ThemedText>Confirm Password</ThemedText>
          <Input
            placeholder="Confirm new password"
            secure
            value={confirmPassword}
            onUpdateValue={setConfirmPassword}
          />
        </View>

        <ThemedButton
          disabled={isLoading}
          style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={handlePasswordReset}
        >
          <ThemedText type="smallBold" style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Proceed'}
          </ThemedText>
        </ThemedButton>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backText: {
    marginLeft: 5,
  },
  headerSection: {
    marginVertical: 20,
  },
  subText: {
    color: Colors.gray9,
    marginTop: 5,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: Colors.green,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
