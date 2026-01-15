import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { validateComplaince } from '@/components/validateComplaince'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerinfocheck, customerupdateid, customeruploadAddressproof, customeruploadCAC, customeruploadIdcard } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Octicons } from '@expo/vector-icons'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, Modal, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'


const { height } = Dimensions.get('window');

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor?: { dark: string; light: string };
};

export default function complaince({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {
    
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
    const router = useRouter()
    const {user, token, logout} = useAuth()
    const [isloading, setIsLoading] = useState(false)
    const [isIdCardModalVisble, setIdCardModalVisible] = useState(false)
    const [isCACModalVisble, setCACModalVisible] = useState(false)
    const [isAddressModalVisble, setIsAddressModalVisible] = useState(false)
    const [isIdCardNumberModalVisble, setIdCardNumberModalVisible] = useState(false)
    const slideAnim = React.useRef(new Animated.Value(height)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);

    const [ids, setids] = useState<any>([])
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        idnum: "",
        idtype: ""
    });

    const [fetchedInfo, setFetchedInfo] = useState<any>([])
    const navigation = useNavigation()

    const openPopup= () => {
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

    const openPopup2 = () => {
        setModalVisible3(true);
        Animated.timing(slideAnim, {
        toValue: 0, // Slide to the screen
        duration: 300,
        useNativeDriver: true,
        }).start();
    };
    
    const closePopup2 = () => {
        Animated.timing(slideAnim, {
        toValue: height, // Slide back down
        duration: 300,
        useNativeDriver: true,
        }).start(() => setModalVisible3(false)); // Close after animation
    };
    
    const toggleAddressModal = () => {
        setIsAddressModalVisible(!isAddressModalVisble)
    }

    const toggleIdcardnumberModal = () => {
        setIdCardNumberModalVisible(!isIdCardNumberModalVisble)
    }

    const toggleIdCardModal = () => {
        setIdCardModalVisible(!isIdCardModalVisble)
    }

    const toggleCACModal = () => {
        setCACModalVisible(!isCACModalVisble)
    }

    useEffect(() => {
        const fetchBillers = async () => {
        try {
            setIsLoading(true)
            const config = {
                method: 'get',
                url: `https://igoeppms.com/igoepp/public/api/getid`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${decryptData(token)}`,
                },
            };
                const response = await axios(config);
                console.log(response.data)
                const data = response.data;
                const countryArray = data.map((item: any) => ({
                label: item.Identification_name,
                value: item.identification_prefix,
            
            }));
            setids(countryArray);
        } catch (error: any) {
            console.error("An error occured:", error.response);
        }finally{
            setIsLoading(false)
        }
        };
        fetchBillers();
    }, []);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsLoading(true);
                const response = await customerinfocheck(user?.customer_id, decryptData(token));
                console.log(response);
                setFetchedInfo(response);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'Unable to load notification settings.')
                }
                console.error("Error fetching pending requests:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, []);

    const captureAddressImage = async () => {
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
                closePopup();
                return;
            }

            const image = result.assets[0];
            closePopup();
            await uploadAddress(image.base64);
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Unable to open camera.');
        }
    };

   
    const pickAddressImage = async () => {
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
                closePopup();
                return;
            }

            const image = result.assets[0];
            closePopup();
            await uploadAddress(image.base64);
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Unable to select image.');
        }
    };

    const captureIdCardImage = async () => {
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
                closePopup1();
                return;
            }

            const image = result.assets[0];
            closePopup1();
            uploadIdCard(image.base64);
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Unable to open camera.');
        }
    };

   
    const pickIdCardImage = async () => {
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
                closePopup1();
                return;
            }

            const image = result.assets[0];
            closePopup1();
            uploadIdCard(image.base64);
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Unable to select image.');
        }
    };


    const captureCACImage = async () => {
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
                closePopup2();
                return;
            }

            const image = result.assets[0];
            closePopup2();
            await uploadCAC(image.base64);
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert('Error', 'Unable to open camera.');
        }
    };

   
    const pickCACImage = async () => {
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
                closePopup2();
                return;
            }

            const image = result.assets[0];
            closePopup2();
            await uploadCAC(image.base64);
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Unable to select image.');
        }
    };


    const handleUpload = async ({
            image,
            uploadFn,
            successMessage,
        }: {
            image: string;
            uploadFn: (url: string) => Promise<any>;
            successMessage: string;
        }) => {
        const imageUrl = `data:image/jpeg;base64,${image}`;

        try {
            setIsLoading(true);

            const response = await uploadFn(imageUrl);
            console.log("Upload response:", response);

            Alert.alert("Success", successMessage, [
            { text: "Ok", onPress: reload },
            ]);
        } catch (error: any) {
            console.error("Upload failed:", error.response?.data || error.message);
            Alert.alert("Error", "An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleValidation = () => {
        console.log(formData)
        const validationErrors = validateComplaince(formData);
        setErrors(validationErrors);
    
        // Handle errors
        if (Object.keys(validationErrors).length > 0) {
          console.log("Validation Errors:", validationErrors);
    
          const allErrors = Object.values(validationErrors).join("\n");
          Alert.alert("❌ Validation Errors", allErrors);
    
          return; // stop
        }
        // Proceed if no error
        return handlesubmit();
    };

    const handlesubmit = async () => {
        try {
            setIsLoading(true);
            const response = await customerupdateid(user?.customer_id, formData.idtype, formData.idnum, decryptData(token));
            console.log(response)

            Alert.alert("Success", response.message, [
                { text: "Ok", onPress: () => [reload(), setModalVisible2(prev => !prev)] },
            ]);
        } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again later.");
        }finally{
            setIsLoading(false)
        }
    }

    const uploadAddress = (image: any) =>
        handleUpload({
            image,
            uploadFn: (url) => customeruploadAddressproof(url, user?.customer_id, decryptData(token)),
            successMessage: "Address Proof Uploaded Successfully",
        }
    );

    const uploadCAC = (image: any) =>
        handleUpload({
            image,
            uploadFn: (url) => customeruploadCAC(url, user?.customer_id, decryptData(token)),
            successMessage: "CAC document Uploaded Successfully",
        }
    );

    const uploadIdCard = (image: any) =>
        handleUpload({
            image,
            uploadFn: (url) => customeruploadIdcard(url, user?.customer_id, decryptData(token)),
            successMessage: "ID Card Uploaded Successfully",
        }
    );


    const reload = async() => {
        try {
            setIsLoading(true)
            const response = await customerinfocheck(user?.customer_id, decryptData(token))
            setFetchedInfo(response)
            console.log(response)
        } catch (error: any) {
            console.log(error.response)
            return;
        }finally{
            setIsLoading(false)
        }
    }

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
            <ThemedText type="titleMedium">KYC Documents</ThemedText>
            <ThemedText style={{ color: Colors.gray9 }}>Click to upload your kyc documents</ThemedText>

            <View style={{ margin: 15 }} />

            {
                user?.account_type !== "B" ? 
                <TouchableOpacity onPress={() => fetchedInfo.identification_num ? null :setModalVisible2(prev => !prev)}  style={{padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: Colors.gray8, borderRadius:7}}>
                    <View>
                        <ThemedText style={{color: '#000'}}>Identification number</ThemedText>
                        <ThemedText style={{color:Colors.gray9}} type='small'>Click to upload file</ThemedText>
                    </View>
                    
                    {
                        fetchedInfo.identification_num !== null ?
                        <Image source={require("@/assets/images/Frame16.png")} style={{width:20, height:20}}/> 
                        :
                        <View style={{backgroundColor:'#fff', alignSelf:'flex-start', alignContent:'center', padding:10, borderRadius:6}}>
                            <Octicons name="person-add" size={18} color={Colors.gray9} />
                        </View>
                    }

                </TouchableOpacity>
                : null
            }
            
            {
                modalVisible2 &&

                <>
                    <View style={{ margin: 7 }} />

                    <ThemedText>Select Plan</ThemedText>
    
                    <View style={{ flex: 1, margin:1 }}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={{ color: Colors.gray9 }}
                            selectedTextStyle={{ color: "#000" }}
                            data={ids}
                            labelField="label"
                            valueField="value"
                            placeholder="Please Select"
                            maxHeight={300}
                            value={formData.idtype}
                            search
                            searchPlaceholder="Search..."
                            inputSearchStyle={{ color: Colors.gray9 }}
            
                            // When selecting a country
                            onChange={(item) => {
                                setFormData(prev => ({
                                ...prev,
                                idtype: item.value,
                                }));
                            }}
                        />
                    </View>
    
                    <ThemedText>NIN Number</ThemedText>
                    <Input
                        placeholder="Enter nin number"
                        keyboardType="default"
                        value={formData.idnum}
                        maxLength={11}
                        onUpdateValue={(text) => setFormData({...formData, idnum: text})}
                    />
                    <View style={{ margin: 2 }} />
                    <ThemedButton style={{backgroundColor: Colors.green, padding: 10, borderRadius:30, alignItems:'center'}} onPress={() => {handleValidation()}}>
                        <ThemedText style={{color:'#fff'}}>Continue</ThemedText>
                    </ThemedButton>
                </>
            }

            <View style={{margin:7}}/>

            {
                user?.account_type !== "B" ? 
                <TouchableOpacity onPress={() => [fetchedInfo.identification_path === null ? openPopup1() : null]}  style={{padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: Colors.gray8, borderRadius:7}}>
                    <View>
                        <ThemedText style={{color:'#000'}}>Identification card</ThemedText>
                        <ThemedText style={{color:Colors.gray9}} type='small'>Click to upload file</ThemedText>
                    </View>

                    {
                        fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date === null  && fetchedInfo.verify_identification === "N" ?
                            <ThemedText type='small' style={{color:Colors.green}}>Pending...</ThemedText>

                        :
                        fetchedInfo.identification_path !== null && fetchedInfo.verify_identification_date !== null  && fetchedInfo.verify_identification === "Y" ?
                            <Image source={require("@/assets/images/Frame16.png")} style={{width:20, height:20}}/> 
                        :
                        <View style={{backgroundColor:'#fff', alignSelf:'flex-start', alignContent:'center', padding:10, borderRadius:6}}>
                            <Octicons name="person-add" size={18} color={Colors.gray9} />
                        </View>
                    }
                </TouchableOpacity>
                : null
            }

            {
                user?.account_type === "B" ? 
                <TouchableOpacity onPress={() => [fetchedInfo.cac_path === null ? openPopup2() : null]}  style={{padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: Colors.gray8, borderRadius:7}}>
                    <View>
                        <ThemedText style={{color:'#000'}}>CAC document</ThemedText>
                        <ThemedText style={{color:Colors.gray9}} type='small'>Click to upload file</ThemedText>
                    </View>

                    {
                        fetchedInfo.cac_path !== null && fetchedInfo.verify_cac_date === null  && fetchedInfo.verify_cac === "N" ?
                            <ThemedText type='small' style={{color:Colors.green}}>Pending...</ThemedText>

                        :
                        fetchedInfo.cac_path !== null && fetchedInfo.verify_cac_date !== null  && fetchedInfo.verify_cac === "Y" ?
                            <Image source={require("@/assets/images/Frame16.png")} style={{width:20, height:20}}/> 
                        :
                        <View style={{backgroundColor:'#fff', alignSelf:'flex-start', alignContent:'center', padding:10, borderRadius:6}}>
                            <Octicons name="person-add" size={18} color={Colors.gray9} />
                        </View>
                    }
                </TouchableOpacity> 
                : null
            }

            <View style={{margin:7}}/>

           
            <TouchableOpacity onPress={() => [fetchedInfo.address_verification_path === null ? openPopup() : null]} style={{padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: Colors.gray8, borderRadius:7}}>
                <View>
                    <ThemedText style={{color:'#000'}}>Proof of address</ThemedText>
                    <ThemedText style={{color:Colors.gray9}} type='small'>Click to upload file</ThemedText>
                </View>
                {
                    fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date === null  && fetchedInfo.verify_address === "N" ?
                        <ThemedText type='small' style={{color:Colors.green}}>Pending...</ThemedText>

                    :
                    fetchedInfo.address_verification_path !== null && fetchedInfo.verify_address_date !== null  && fetchedInfo.verify_address === "Y" ?
                        <Image source={require("@/assets/images/Frame16.png")} style={{width:20, height:20}}/> 
                    :
                        <View style={{backgroundColor:'#fff', alignSelf:'flex-start', alignContent:'center', padding:10, borderRadius:6}}>
                            <Octicons name="person-add" size={18} color={Colors.gray9} />
                        </View>
                }
            </TouchableOpacity>
        
            <Modal
                transparent
                visible={modalVisible}
                animationType="slide" 
                onRequestClose={closePopup}
            >
                <TouchableOpacity style={styles.overlay} onPress={closePopup}/>
    
                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
                    ]}
                >     
                    <ThemedText style={{textAlign:'center'}}>Choose Image Source (Address)</ThemedText>

                    <View style={{margin:10}}/>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', backgroundColor: Colors.gray7, width:'40%', padding:30, borderRadius:5}} onPress={captureAddressImage}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text style={[{marginLeft:15, marginRight:10}]}>📸 Camera</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', backgroundColor:Colors.gray7, width:'40%', borderRadius:5}} onPress={pickAddressImage}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text style={[{marginLeft:15, marginRight:10}]}>🖼️ Libraries</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{margin:10}}/>
                </Animated.View>
            </Modal>

            <Modal
                transparent
                visible={modalVisible1}
                animationType="slide" 
                onRequestClose={closePopup1}
            >
                <TouchableOpacity style={styles.overlay} onPress={closePopup1}/>
    
                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
                    ]}
                >     
                    <ThemedText style={{textAlign:'center'}}>Choose Image Source (ID Card)</ThemedText>
                    

                    <View style={{margin:10}}/>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', backgroundColor: Colors.gray7, width:'40%', padding:30, borderRadius:5}} onPress={captureIdCardImage}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text style={[{marginLeft:15, marginRight:10}]}>📸 Camera</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', backgroundColor:Colors.gray7, width:'40%', borderRadius:5}} onPress={pickIdCardImage}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text style={[{marginLeft:15, marginRight:10}]}>🖼️ Libraries</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{margin:10}}/>
                </Animated.View>
            </Modal>

            <Modal
                transparent
                visible={modalVisible3}
                animationType="slide" 
                onRequestClose={closePopup2}
            >
                <TouchableOpacity style={styles.overlay} onPress={closePopup2}/>
    
                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
                    ]}
                >     
                    <ThemedText style={{textAlign:'center'}}>Choose Image Source (CAC)</ThemedText>

                    <View style={{margin:10}}/>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', backgroundColor: Colors.gray7, width:'40%', padding:30, borderRadius:5}} onPress={captureCACImage}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text style={[{marginLeft:15, marginRight:10}]}>📸 Camera</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', backgroundColor:Colors.gray7, width:'40%', borderRadius:5}} onPress={pickCACImage}>
                            <View style={{justifyContent:'center', alignItems:'center'}}>
                                <Text style={[{marginLeft:15, marginRight:10}]}>🖼️ Libraries</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{margin:10}}/>
                </Animated.View>
            </Modal>

        </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    popup: {
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
    icon: {
        width: 24,
        height: 24,
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