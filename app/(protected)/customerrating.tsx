import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerRequestRating, helperget, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CustomerRatingScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const { token, logout } = useAuth()
  const { assigned_helper, helper_rating, requestid } = useLocalSearchParams<any>()

  const bgColor = useThemeColor({}, 'background')
  const textColor = useThemeColor({}, 'text')

  const [helperDetails, setHelperDetails] = useState<any>({})
  const [defaultRating, setDefaultRating] = useState(0)
  const [rateComment, setRateComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const starFilled = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png'
  const starEmpty = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'

  // ------------------------
  // FETCH HELPER DETAILS
  // ------------------------
  useLayoutEffect(() => {
    const fetchHelper = async () => {
      try {
        setIsLoading(true)
        const response = await helperget(assigned_helper, decryptData(token))
        setHelperDetails(response.data.data)
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert('Session expired', 'Please log in again.')
          await logout()
          router.replace('/login')
        } else {
          Alert.alert('Error', 'Unable to load helper details')
        }
      } finally {
        setIsLoading(false)
      }
    }

    const unsubscribe = navigation.addListener('focus', fetchHelper)
    return unsubscribe
  }, [])

  // ------------------------
  // RATING COMPONENT
  // ------------------------
  const RatingStars = () => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((num) => (
        <TouchableOpacity key={num} onPress={() => setDefaultRating(num)} activeOpacity={0.7}>
          <Image
            resizeMode="cover"
            style={styles.star}
            source={{ uri: num <= defaultRating ? starFilled : starEmpty }}
          />
        </TouchableOpacity>
      ))}
    </View>
  )

  // ------------------------
  // SUBMIT RATING
  // ------------------------
  const submitRating = async () => {
    if (defaultRating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting.')
      return
    }

    try {
      setIsLoading(true)
      const response = await customerRequestRating(
        requestid,
        defaultRating,
        rateComment,
        decryptData(token)
      )

      Alert.alert('Success', 'Rating submitted successfully.', [
        { text: 'OK', onPress: () => router.push('/(protected)/(tabs)/bookings') },
      ])
    } catch (error: any) {
      console.log(error.response?.data)
      Alert.alert('Error', error.response?.data?.message || 'An error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  console.log(helper_rating)

  if (isLoading) return <LogoSpinner lightColor='' darkColor='' />

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >

        <ScrollView showsVerticalScrollIndicator={false}>
          <GoBack onClick={() => router.back()} lightColor='' darkColor=''>
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>

          <View style={{ marginVertical: 10 }}>
            <ThemedText type="titleMedium">Handyman Ratings</ThemedText>
            <ThemedText style={{ color: Colors.gray9, marginTop: 4 }}>
              Rate the handyman based on the services he performed.
            </ThemedText>
          </View>

          <Image
            style={styles.profile}
            source={
              helperDetails.picture
                ? { uri: `${PUBLIC_API_BASE_URL}customers/${helperDetails.picture}` }
                : require('@/assets/images/avatar1.png')
            }
          />

          {/* Existing Ratings */}
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            {helper_rating > 0 ? (
              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: helper_rating }).map((_, i) => (
                  <Image key={i} resizeMode="cover" style={styles.star} source={{ uri: starFilled }} />
                ))}
              </View>
            ) : (
              <ThemedText>No ratings yet</ThemedText>
            )}
            {helper_rating > 0 && <ThemedText style={{ marginTop: 5 }}>Helper Rating</ThemedText>}
          </View>

          {/* Helper Info */}
          <View style={styles.helperInfoBox}>
            {infoRow('First Name', helperDetails.first_name)}
            {infoRow('Last Name', helperDetails.last_name)}
            {infoRow('LGA', helperDetails.lga)}
            {infoRow('State', helperDetails.State)}
            {infoRow('Country', helperDetails.Country)}
          </View>

          {/* Rating Input */}
          <ThemedText style={styles.sectionTitle}>Rate the Handyman</ThemedText>

          <RatingStars />

          <View style={{ alignItems: 'center', marginVertical: 5 }}>
            {defaultRating === 1 && <Text style={styles.emoji}>😡</Text>}
            {defaultRating === 2 && <Text style={styles.emoji}>😥</Text>}
            {defaultRating === 3 && <Text style={styles.emoji}>🤨</Text>}
            {defaultRating === 4 && <Text style={styles.emoji}>😃</Text>}
            {defaultRating === 5 && <Text style={styles.emoji}>😎</Text>}
          </View>

          <Input
            multiline
            placeholder="Add comment"
            style={styles.commentBox}
            value={rateComment}
            onUpdateValue={setRateComment}
          />

          <ThemedButton style={styles.submitBtn} onPress={submitRating}>
            <ThemedText style={{ color: '#fff' }}>Confirm Rating</ThemedText>
          </ThemedButton>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// ------------------------
// Helper Functions
// ------------------------
const infoRow = (label: string, value: string) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profile: {
    height: 100,
    width: 100,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  star: {
    width: 30,
    height: 30,
    margin: 6,
  },
  helperInfoBox: {
    backgroundColor: Colors.white,
    padding: 20,
    borderWidth: 0.6,
    borderStyle: 'dashed',
    borderRadius: 5,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    fontFamily: 'poppinsRegular',
    fontSize: 13,
    color: '#000',
  },
  infoValue: {
    fontFamily: 'poppinsRegular',
    fontSize: 13,
    color: '#000',
  },
  sectionTitle: {
    textAlign: 'center',
    fontFamily: 'poppinsRegular',
    marginTop: 15,
  },
  emoji: {
    fontSize: 30,
  },
  commentBox: {
    backgroundColor: Colors.gray6,
    padding: 12,
    height: 80,
    borderRadius: 10,
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: Colors.green,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
})
