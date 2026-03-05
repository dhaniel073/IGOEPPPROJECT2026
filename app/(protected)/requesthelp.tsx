import CustomDropdown from '@/components/CustomDropdown'
import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { validateRequest } from '@/components/validateRequest'
import { Colors, decryptData, DIMENSION } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { requestinfo, YOUR_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Entypo, EvilIcons, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, ImageBackground, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'


const data = [
  {
    id: "Y",
    name: "Yes"
  },
  {
    id: "N",
    name: "No"
  },
]
const { height } = Dimensions.get('window');

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};

export default function categoryScreen({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {


  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const router = useRouter()
  const { user, token, logout } = useAuth()
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const { request_type, catid, subcatid, preassessment_flg, name, helperid, enable_go_to_artisan } = useLocalSearchParams()
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);

  const [country, setCountry] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null)
  const [isAddressModalVisble, setIsAddressModalVisible] = useState(false)
  const [isloading, setisloading] = useState(false)

  const [gotoArtisanLocation, setgotoArtisanLocation] = useState<any>('')
  const [formData, setFormData] = useState<any>({
    interest: "",
    addressfield: "",
    countryName: "",
    stateName: "",
    cityName: "",
    landmark: "",
    helpsize: "",
    vehiclerequest: "",
    description: "",
    helptime: "",
    helpdate: "",
    frequency: "",
    uploadUrl: "",
    start_date: "",
    end_date: "",
    payment_frequency: "",
    no_of_helper: ""
  });

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

  const openPopup1 = () => {
    setModalVisible1(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to the screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePopup1 = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Slide back down
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible1(false)); // Close after animation
  };

  const toggleModal = () => {
    setIsAddressModalVisible(!isAddressModalVisble)
  }


  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setFormData({ ...formData, helpdate: formattedDate });
    }
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowDatePickerStart(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setFormData({ ...formData, start_date: formattedDate });
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowDatePickerEnd(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setFormData({ ...formData, end_date: formattedDate });
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios"); // keep open on iOS
    if (selectedTime) {
      // Format time as "hh:mm AM/PM"
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setFormData({ ...formData, helptime: formattedTime });
    }
  };


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
      } catch (error: any) {
        Alert.alert('Error', 'Unable to request help.')
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


  const captureImage = async () => {
    try {
      // ✅ Ask for camera permission properly
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera access is required to take a picture.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.75,
        base64: true,
      });

      if (result.canceled) {
        toggleModal();
        return;
      }

      const image = result.assets[0];
      closePopup1();
      setFormData({ ...formData, uploadUrl: `data:image/jpeg;base64,${image.base64}` })
      setImage(image.uri)
    } catch (error) {
      Alert.alert('Error', 'Unable to open camera.');
    }
  };


  const pickImage = async () => {
    try {
      // ✅ Ask for media library permission properly
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Photo library access is required to select an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.75,
        base64: true,
      });

      if (result.canceled) {
        toggleModal();
        return;
      }

      const image = result.assets[0];
      closePopup1();
      setImage(image.uri)
      setFormData({ ...formData, uploadUrl: `data:image/jpeg;base64,${image.base64}` })
    } catch (error) {
      Alert.alert('Error', 'Unable to select image.');
    }
  };

  const deleteImage = () => {
    Alert.alert("Remove Image", "Do you want to delete selected Image", [
      {
        text: "No",
        onPress: () => { }
      },
      {
        text: "Yes",
        onPress: () => [
          setImage(null),
          setFormData({ ...formData, uploadUrl: "" }),
        ]
      },
    ])
  }

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRequest = () => {
    const validationErrors = validateRequest(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // stop signup — show all errors

      // Join all error messages together
      const allErrors = Object.values(validationErrors).join("\n");

      Alert.alert("❌ Validation Errors", allErrors);
      return;
    }

    // proceed to API call, etc.
    return makerequest();
  };

  const makerequest = async () => {
    try {
      setisloading(true)
      const response = await requestinfo(user?.customer_id, formData.interest, formData.no_of_helper, formData.addressfield, formData.countryName, formData.stateName, formData.cityName, formData.landmark,
        formData.helpsize, formData.vehiclerequest, formData.description, catid, subcatid, formData.helptime, formData.helpdate, formData.frequency, formData.start_date, formData.end_date,
        formData.payment_frequency, preassessment_flg, request_type, helperid, formData.uploadUrl, enable_go_to_artisan, decryptData(token)
      )
      return openPopup()
    } catch (error: any) {
      alert("Booking failed. Please try again or contact support if the issue continues.")
      return;
    } finally {
      setisloading(false)
    }
    // return openPopup()
  }

  if (isloading) {
    return <LogoSpinner lightColor='' darkColor='' />
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >
        <Animated.ScrollView showsVerticalScrollIndicator={false}>
          <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>
          <View style={{ margin: 15 }} />

          <ThemedText type="titleMedium">Make a Booking</ThemedText>

          {
            !enable_go_to_artisan || enable_go_to_artisan === 'N' ? "" :
              <>
                <ThemedText>Do you wish to go to the artisan's shop address:</ThemedText>
                <View style={{ flexDirection: 'row', padding: 10, }}>
                  {data.map((item: any, key: any) =>
                    <>
                      <View style={{ marginRight: 10, flexDirection: 'row' }}>
                        <TouchableOpacity style={[styles.outer, { marginRight: 4, borderColor: color }]} onPress={() => setgotoArtisanLocation(item.id)}>
                          {gotoArtisanLocation === item.id && <View style={styles.inner} />}
                        </TouchableOpacity>
                        <ThemedText style={{ marginTop: 5 }}> {item.name}</ThemedText>
                      </View>
                    </>
                  )}
                </View>
                <View style={{ marginTop: 5 }} />
              </>
          }
          <ThemedText>Date for service</ThemedText>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowDatePicker(true)}>
            <Input
              placeholder="Please select"
              value={formData.helpdate}
              editable={false}
              // isInvalid={!!errors.helpdate}
              rightIcon={<MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.gray9} />}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.helpdate ? new Date(formData.helpdate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {showDatePicker && Platform.OS === "ios" && (
            <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
              <TouchableOpacity style={[{ backgroundColor: "#11182711" }]}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={[{ fontFamily: 'poppinsRegular' }]}>Close</ThemedText>
              </TouchableOpacity>


              {/* <TouchableOpacity style={{}}
              onPress={confirmIOSTime}
            >
              <ThemedText style={[{fontFamily: 'poppinsRegular'}]}>Confirm</ThemedText>
            </TouchableOpacity> */}
            </View>
          )}

          <View style={{ margin: 5 }} />

          <ThemedText>Time for service</ThemedText>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setShowTimePicker(true)}>
            <Input
              placeholder="Please select"
              value={formData.helptime}
              editable={false}
              // isInvalid={!!errors.helptime}
              rightIcon={<MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.gray9} />}
            />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={formData.helptime ? new Date(`1970-01-01T${formData.helptime}`) : new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}

          {showTimePicker && Platform.OS === "ios" && (
            <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
              <TouchableOpacity style={{ backgroundColor: "#11182711" }} onPress={() => setShowTimePicker(false)}>
                <ThemedText style={{ fontFamily: 'poppinsRegular' }}>Close</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ margin: 5 }} />

          <ThemedText>Address</ThemedText>
          <Input
            placeholder="Enter Address"
            value={formData.addressfield}
            onUpdateValue={(text) => setFormData({ ...formData, addressfield: text })}
            keyboardType="default"
            multiline
            // isInvalid={!!errors.addressfield}
            rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Country</ThemedText>
          <View style={{ margin: 5 }} />
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={countryData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            maxHeight={300}
            value={formData.countryName}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item: any) => {
              setFormData({ ...formData, countryName: item.label, stateName: "", cityName: "" });
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
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={stateData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            value={formData.stateName}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item: any) => {
              setFormData({ ...formData, stateName: item.label, cityName: "" });
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
            style={[styles.dropdown]}
            // placeholderStyle={{ color: Colors.gray9 }}
            // selectedTextStyle={{ color: "#000" }}
            data={cityData}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            value={formData.cityName}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item: any) => {
              setFormData({ ...formData, cityName: item.label });
              setCity(item.label)
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Size of help</ThemedText>
          <View style={{ margin: 5 }} />
          <CustomDropdown
            label=""
            data={[
              { label: 'Small', value: 'Small' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Large', value: 'Large' },
            ]}
            value={formData.helpsize}
            onChange={(value: any) => setFormData({ ...formData, helpsize: value })}
            error={""}

          />
          <View style={{ margin: 5 }} />

          <ThemedText>Landmark</ThemedText>
          <Input
            placeholder="Enter Landmark"
            value={formData.landmark}
            onUpdateValue={(text) => setFormData({ ...formData, landmark: text })}
            keyboardType="default"
            // isInvalid={!!errors.landmark}
            rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Task Frequency</ThemedText>
          <View style={{ margin: 5 }} />

          <CustomDropdown
            label=""
            data={[
              { label: 'One-off', value: 'One-off' },
              { label: 'Daily', value: 'Daily' },
              { label: 'Weekly', value: 'Weekly' },
              { label: 'Bi-Weekly', value: 'Bi-Weekly' },
              { label: 'Monthly', value: 'Monthly' },
              { label: 'Bi-Monthly', value: 'Bi-Monthly' },
              { label: 'Quarterly', value: 'Quarterly' },
              { label: 'Yearly', value: 'Yearly' }
            ]}
            value={formData.frequency}
            onChange={(value: any) => setFormData({ ...formData, frequency: value })}
            error={""}
          />
          <View style={{ margin: 5 }} />

          {
            formData.frequency && formData.frequency !== "One-off" ? (
              <>
                <ThemedText>Start Date</ThemedText>

                <TouchableOpacity onPress={() => setShowDatePickerStart(true)}>
                  <Input
                    placeholder="Please select"
                    value={formData.start_date}
                    editable={false}
                    rightIcon={<MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.gray9} />}
                  />
                </TouchableOpacity>

                {showDatePickerStart && (
                  <DateTimePicker
                    value={formData.start_date ? new Date(formData.start_date) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeStartDate}
                    minimumDate={new Date()}
                  />
                )}

                {showDatePickerStart && Platform.OS === "ios" && (
                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress={() => setShowDatePickerStart(false)}>
                      <ThemedText>Close</ThemedText>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{ margin: 5 }} />

                <ThemedText>End Date</ThemedText>

                <TouchableOpacity onPress={() => setShowDatePickerEnd(true)}>
                  <Input
                    placeholder="Please select"
                    value={formData.end_date}
                    editable={false}
                    rightIcon={<MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.gray9} />}
                  />
                </TouchableOpacity>

                {showDatePickerEnd && (
                  <DateTimePicker
                    value={formData.end_date ? new Date(formData.end_date) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChangeEndDate}
                    minimumDate={new Date()}
                  />
                )}

                {showDatePickerEnd && Platform.OS === "ios" && (
                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress={() => setShowDatePickerEnd(false)}>
                      <ThemedText>Close</ThemedText>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{ margin: 5 }} />

                <ThemedText>Payment Frequency</ThemedText>

                <View style={{ margin: 5 }} />

                <CustomDropdown
                  label=""
                  data={[
                    { label: "Daily", value: "Daily" },
                    { label: "Weekly", value: "Weekly" },
                    { label: "Monthly", value: "Monthly" },
                  ]}
                  value={formData.payment_frequency}
                  onChange={(value: any) => setFormData({ ...formData, payment_frequency: value })}
                  error={""}
                />
              </>
            ) : null
          }

          <ThemedText>No of helper</ThemedText>
          <Input
            placeholder="No of helper"
            keyboardType="default"
            onUpdateValue={(text) => setFormData({ ...formData, no_of_helper: text })}
            value={formData.no_of_helper}
            // isInvalid={!!errors.description}
            rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Additional info</ThemedText>
          <Input
            placeholder="Help description"
            keyboardType="default"
            onUpdateValue={(text) => setFormData({ ...formData, description: text })}
            value={formData.description}
            multiline
            // isInvalid={!!errors.description}
            rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Vehicle Req:</ThemedText>
          <View style={{ margin: 5 }} />

          <CustomDropdown
            label=""
            data={[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            value={formData.vehiclerequest}
            onChange={(value: any) => setFormData({ ...formData, vehiclerequest: value })}
            error={""}
          />

          <View style={{ margin: 5 }} />

          <ThemedText>Request Period:</ThemedText>
          <View style={{ margin: 5 }} />
          <CustomDropdown
            label=""
            data={[
              { label: 'Request for help now', value: 'Request for help now' },
              { label: 'Request for help later', value: 'Request for help later' },
            ]}
            value={formData.interest}
            onChange={(value: any) => setFormData({ ...formData, interest: value })}
            error={""}

          />
          <View style={{ margin: 10 }} />

          <ThemedText>Sample Image:</ThemedText>
          {
            !image ?
              <TouchableOpacity onPress={openPopup1} style={{ backgroundColor: Colors.offwhite1, paddingHorizontal: 18, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderRadius: 7 }}>
                <View>
                  <ThemedText style={{ color: "#000" }}>Upload Image</ThemedText>
                  <ThemedText type='small' style={{ color: Colors.gray9 }}>Upload Image</ThemedText>
                </View>
                <EvilIcons name="image" size={24} color={Colors.gray9} />
              </TouchableOpacity>
              :
              <ImageBackground
                source={{ uri: image }}
                style={{ height: DIMENSION.HEIGHT * 0.5, width: DIMENSION.WIDTH * 0.88, borderWidth: 1, borderRadius: 15, margin: 1, gap: 15 }}
                imageStyle={{ borderRadius: 15, }}
              >
                <TouchableOpacity onPress={() => deleteImage()} style={{ backgroundColor: Colors.wallet, padding: 10, borderRadius: 10, position: 'absolute' }}>
                  <Ionicons name='trash' color='#fff' size={24} />
                </TouchableOpacity>
              </ImageBackground>

          }

          <View style={{ margin: 15 }} />

          <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center', backgroundColor: Colors.green }} onPress={() => handleRequest()}>
            <ThemedText type='smallBold' style={{ color: "#fff" }}>Proceed</ThemedText>
          </ThemedButton>

          <View style={{ margin: 15 }} />

        </Animated.ScrollView>

        <Modal
          transparent
          visible={modalVisible1}
          animationType="slide"
          onRequestClose={closePopup1}
        >
          <TouchableOpacity style={styles.overlay} onPress={closePopup1} />

          <Animated.View
            style={[
              styles.popup1,
              { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
            ]}
          >
            <ThemedText style={{ textAlign: 'center' }}>Choose Image Source</ThemedText>

            <View style={{ margin: 10 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray7, width: '40%', padding: 30, borderRadius: 5 }} onPress={captureImage}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[{ marginLeft: 15, marginRight: 10 }]}>📸 Camera</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray7, width: '40%', borderRadius: 5 }} onPress={pickImage}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[{ marginLeft: 15, marginRight: 10 }]}>🖼️ Libraries</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>

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

            <Feather name="check-circle" size={120} color={Colors.green} />

            <View style={{ margin: 15 }} />

            <ThemedText>Booking Sent</ThemedText>
            <ThemedText>Congratulations, your booking</ThemedText>
            <ThemedText>has been submitted.</ThemedText>

            <View style={{ margin: 15 }} />
            <ThemedText>A notification will be sent to you</ThemedText>
            <ThemedText>shortly once an artisan make</ThemedText>
            <ThemedText>a bid</ThemedText>

            <View style={{ margin: 15 }} />

            <ThemedButton onPress={() => [closePopup(), router.push("/")]}>
              <ThemedText style={{ color: Colors.green }}>Go to Home</ThemedText>
            </ThemedButton>
          </Animated.View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  outer: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    width: 15,
    height: 15,
    backgroundColor: Colors.green,
    borderRadius: 10
  },
  dropdown: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'poppinsRegular'
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'poppinsRegular'
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    // justifyContent:'center'
    alignItems: 'center'
  },

  popup1: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px 2px 5px rgba(0,0,0,0.25)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})