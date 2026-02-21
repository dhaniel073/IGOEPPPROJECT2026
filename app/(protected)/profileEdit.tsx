import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerinfocheck, profileupdate, YOUR_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'


const { height } = Dimensions.get('window');

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};

export default function profileEdit({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const [isloading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const { user, token, updateUser, logout } = useAuth()
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);

  const [country, setCountry] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    phone: "",
    country: "",
    state: "",
    lga: "",
    address: "",
  });

  const openPopup = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePopup = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setFormData({ ...formData, dob: formattedDate });
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      const response = await customerinfocheck(user?.customer_id, decryptData(token));
      updateUser(response)
      router.replace("/(protected)/profile")
    } catch (error: any) {
      return;
    } finally {
      setIsLoading(false);
    }
  };
  // ✅ Fetch current user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const res = await customerinfocheck(user?.customer_id, decryptData(token));


        if (res) {
          const user = res;

          setFormData({
            dob: user.dob || "",
            gender: user.sex || "",              // ✅ maps API field "sex"
            phone: user.phone || "",
            country: user.Country || "",         // ✅ maps "Country"
            state: user.State || "",             // ✅ maps "State"
            lga: user.lga || "",
            address: user.address || "",
          });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'Unable to fetch profile data.')
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (countryData.length > 0 && formData.country && typeof formData.country === 'string') {
      // find the country ID that matches the customer's country name
      const matched = countryData.find(
        (item) => item.label.toLowerCase() === formData.country.toLowerCase()
      );

      if (matched) {
        setFormData((prev) => ({ ...prev, country: matched.value }));
        setCountry(matched.label)
        handleState(matched.value); // fetch states for that country
      }
    }
  }, [countryData]);


  useEffect(() => {
    if (stateData.length > 0 && formData.state && typeof formData.state === 'string') {
      const matched = stateData.find(
        (item) => item.label.toLowerCase() === formData.state.toLowerCase()
      );

      if (matched) {
        setFormData((prev) => ({ ...prev, state: matched.value }));
        setState(matched.label)
        handleCity(matched.value); // fetch LGAs for that state
      }
    }
  }, [stateData]);

  useEffect(() => {
    if (cityData.length > 0 && formData.lga && typeof formData.lga === 'string') {
      const matched = cityData.find(
        (item) => item.label.toLowerCase() === formData.lga.toLowerCase()
      );

      if (matched) {
        setFormData((prev) => ({ ...prev, lga: matched.value }));
        setCity(matched.label)
      }
    }
  }, [cityData]);



  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const config = {
          method: 'get',
          url: `${YOUR_API_BASE_URL}auth/general/country`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        };
        const response = await axios(config);
        const data = response.data.data;
        const countryArray = data.map((item: any) => ({
          label: item.country_name,
          value: item.id,
        }));
        setCountryData(countryArray);
      } catch (error) {
        return;
      }
    };
    fetchCountries();
  }, []);

  const handleState = async (countryCode: string) => {
    try {
      const response = await axios.get(
        `${YOUR_API_BASE_URL}auth/general/state/${countryCode}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        }
      );

      const data = response.data.data;
      const stateArray = data.map((item: any) => ({
        label: item.state_name,
        value: item.id,
      }));
      setStateData(stateArray);
    } catch (error) {
      return;
    }
  };

  const handleCity = async (stateCode: string) => {
    try {
      const response = await axios.get(
        `${YOUR_API_BASE_URL}auth/general/lga/${stateCode}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        }
      );

      const data = response.data.data;
      const cityArray = data.map((item: any) => ({
        label: item.lga_name,
        value: item.id,
      }));
      setCityData(cityArray);
    } catch (error) {
      return;
    }
  };


  function isDate(value: unknown): value is Date {
    return value instanceof Date;
  }


  const updateProfile = async () => {
    // Validate required fields
    if (
      !formData.dob ||
      !formData.gender ||
      !formData.phone ||
      !formData.country ||
      !formData.state ||
      !formData.lga ||
      !formData.address
    ) {
      Alert.alert('Validation Error', 'Please fill out all fields before proceeding.');
      return;
    }

    // Clean phone input
    let cleanedPhone = formData.phone.replace(/\D/g, ''); // Remove non-digit characters

    if (cleanedPhone.length === 11 && cleanedPhone.startsWith('0')) {
      // Remove leading 0 if phone is 11 digits
      cleanedPhone = cleanedPhone.substring(1);
    }

    if (cleanedPhone.length !== 10) {
      Alert.alert('Validation Error', 'Phone number must be 10 digits after removing the starting 0.');
      return;
    }

    try {
      setIsLoading(true);

      // Format DOB to "YYYY-MM-DD"
      const dobFormatted = isDate(formData.dob)
        ? formData.dob.toISOString().split('T')[0]
        : formData.dob;


      // Send update request
      const response = await profileupdate(
        user?.customer_id,
        country,
        state,
        city,
        formData.address,
        dobFormatted,
        formData.gender,
        cleanedPhone,
        decryptData(token)
      );

      openPopup()
      // Alert.alert('Success', 'Your profile has been updated successfully!');

    } catch (err: any) {
      Alert.alert('Error', 'Something went wrong while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };


  if (isloading) {
    return <LogoSpinner lightColor='' darkColor='' />
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Animated.ScrollView showsVerticalScrollIndicator={false}>
          <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>
          <View style={{ margin: 6 }} />
          <ThemedText type="titleMedium">Edit Profile</ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>Edit your profile details here</ThemedText>

          <View style={{ margin: 10 }} />

          <ThemedText>Date Of Birth</ThemedText>
          <View style={{ margin: 5 }} />
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowDatePicker(true)}>
            <Input
              placeholder="Please select"
              value={formData.dob}
              editable={false}
              rightIcon={<MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.gray9} />}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dob ? new Date(formData.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()} // user can't pick a future date
            />
          )}

          <View style={{ margin: 5 }} />

          <ThemedText>Sex</ThemedText>
          <View style={{ margin: 5 }} />
          <Dropdown
            style={
              styles.dropdown
            }
            placeholderStyle={{ color: "#000" }}
            selectedTextStyle={{ color: "#000" }}
            data={[
              { label: 'Male', value: 'M' },
              { label: 'Female', value: 'F' },
            ]}
            labelField="label"
            valueField="label"
            placeholder="Please select"
            value={formData.gender}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item) => {
              setFormData({ ...formData, gender: item.value });
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Country</ThemedText>
          <View style={{ margin: 5 }} />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={{ color: Colors.gray9 }}
            selectedTextStyle={{ color: "#000" }}
            data={countryData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            maxHeight={300}
            value={formData.country}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item) => {
              setFormData({ ...formData, country: item.label, state: "", lga: "" });
              setCountry(item.label)
              setStateData([]);
              setCityData([]);
              handleState(item.value);
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />


          <View style={{ margin: 5 }} />

          <ThemedText>State</ThemedText>
          <View style={{ margin: 5 }} />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={{ color: Colors.gray9 }}
            selectedTextStyle={{ color: "#000" }}
            data={stateData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            value={formData.state}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item) => {
              setFormData({ ...formData, state: item.label, lga: "" });
              setCityData([]);
              setState(item.label)
              handleCity(item.value);
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />


          <View style={{ margin: 5 }} />

          <ThemedText>Local Government Area</ThemedText>
          <View style={{ margin: 5 }} />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={{ color: Colors.gray9 }}
            selectedTextStyle={{ color: "#000" }}
            data={cityData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            value={formData.lga}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item) => {
              setFormData({ ...formData, lga: item.label });
              setCity(item.label)
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />

          <View style={{ margin: 5 }} />
          <ThemedText>Phone</ThemedText>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Country Code Box */}
            <ThemedView
              style={{
                paddingHorizontal: 12,
                paddingVertical: 14,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.gray9,
                marginRight: 10, // space between code box and input
              }}
            >
              <Image
                source={require("@/assets/images/flag.png")}
                style={{ width: 20, height: 15, resizeMode: "contain" }}
              />
              <ThemedText style={{ marginLeft: 6, fontSize: 16 }}>+234</ThemedText>
            </ThemedView>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Enter Phone"
                value={formData.phone}
                onUpdateValue={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="number-pad"
              />
            </View>
          </View>


          <View style={{ margin: 5 }} />

          <ThemedText>Address</ThemedText>
          <Input
            placeholder="Enter Address"
            value={formData.address}
            onUpdateValue={(text) => setFormData({ ...formData, address: text })}
            keyboardType="default"
            multiline
          />

          <View style={{ margin: 15 }} />

          <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center', backgroundColor: Colors.green }} onPress={updateProfile}>
            <ThemedText type='smallBold' style={{ color: "#fff" }}>{isloading ? "Updating..." : "Proceed"}</ThemedText>
          </ThemedButton>

          <View style={{ margin: 15 }} />

          <Modal
            transparent
            visible={modalVisible}
            animationType="slide"
          >
            <TouchableOpacity style={styles.overlay} onPress={() => { }} />

            <Animated.View
              style={[
                styles.popup,
                { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' },
              ]}
            >
              <View style={{ margin: 15 }} />

              <ThemedText style={{ textAlign: 'center' }}>Profile Updated</ThemedText>
              <ThemedText style={{ textAlign: 'center' }}>Your profile has been updated successfully</ThemedText>

              <View style={{ margin: 15 }} />

              <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center', backgroundColor: Colors.green, flex: 1 }} onPress={() => [closePopup(), fetchPendingRequests()]} >
                <ThemedText style={{ color: "#fff" }}>Go to Home</ThemedText>
              </ThemedButton>
            </Animated.View>
          </Modal>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    height: 60,
    borderColor: Colors.gray8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.offwhite
  },

})
