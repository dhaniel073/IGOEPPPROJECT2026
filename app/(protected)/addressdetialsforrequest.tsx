import GoBack from '@/components/GoBack';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { Colors, decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { YOUR_API_BASE_URL } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import axiosClient from '@/api/axiosClient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, StyleSheet, TextProps, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};

export default function addressdetialsforrequest({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {


  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const [countryData, setCountryData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [country, setCountry] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const { token, logout } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<any>({
    countryName: "",
    stateName: "",
    cityName: "",
  });


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
        const response = await axiosClient(config);
        const data = response.data.data;
        const countryArray = data.map((item: any) => ({
          label: item.country_name,
          value: item.id,
        }));
        setCountryData(countryArray);
      } catch (error: any) {
        Alert.alert('Error', 'An error occurred. Please try again later.')
      }
    };
    fetchCountries();
  }, []);

  const handleState = async (countryCode: string) => {
    try {
      const response = await axiosClient.get(
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
      const response = await axiosClient.get(
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

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
        <View style={{ margin: 6 }} />

        <ThemedText type='titleMedium'>Enter Location</ThemedText>
        <ThemedText type='small' style={{ fontSize: 12 }}>This will help us tailor available help categories</ThemedText>
        <ThemedText type='small' style={{ fontSize: 12 }}>close to you</ThemedText>

        <View style={{ margin: 10 }} />
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

        <View style={{ margin: 10 }} />

        {/* <View style={{margin:15}}/> */}

        <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center', backgroundColor: Colors.green }} onPress={() => !formData.cityName ? alert("Please select one of the following to continue") : [router.push({ pathname: "/categoryScreen", params: { lga: formData.cityName } })]}>
          <ThemedText type='smallBold' style={{ color: "#fff" }}>Proceed</ThemedText>
        </ThemedButton>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
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
})