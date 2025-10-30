import GoBack from '@/components/GoBack';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptData, encryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { biometricsetup, disablebiometric } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Modal, StyleSheet, Switch, TextProps, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from "uuid";

const { height } = Dimensions.get('window');

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function settings({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()

    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const { user, logout, updateUserFields, refreshUser, token } = useAuth();
    const [supported, setSupported] = useState(false);
    const [enabled, setEnabled] = useState<boolean>(user?.biometric_setup === "N" ? false : true);
    const [loading, setLoading] = useState(false);
    

    const slideAnim = React.useRef(new Animated.Value(height)).current;

    console.log(user?.biometric_setup)
   
    useEffect(() => {
        const checkAvailability = async () => {
            const isSupported = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setSupported(isSupported && enrolled);

            const saved = await AsyncStorage.getItem("biometricEnabled");
            setEnabled(saved === "true");
        };
        checkAvailability();
    }, []);

    const updateBiometricOnServer = async (status: "Y" | "N") => {
        try {
            let deviceToken = await SecureStore.getItemAsync("deviceToken");
            if (!deviceToken) {
                deviceToken = uuidv4();
                await SecureStore.setItemAsync("deviceToken", deviceToken);
            }
            if(status === 'Y'){
                const response = await biometricsetup(user?.customer_id, encryptData(deviceToken), decryptData(token))
                console.log("Biometric setup updated:", response);
                await updateUserFields({ biometric_setup: "Y" });
            }else{
                const response = await disablebiometric(user?.customer_id, decryptData(token))
                await updateUserFields({ biometric_setup: "N" });
                console.log("Biometric setup updated:", response);
            }
            await refreshUser(true);

        } catch (error: any) {
            console.error("Failed to update biometric setup:", error.response?.data || error);
            Alert.alert("Error", "Failed to update biometric setting on server.");
        }
    };

    const handleToggle = async (value: boolean) => {
        // if (loading) return;

        if (!supported) {
            Alert.alert("Not Supported", "Your device does not support biometrics.");
            return;
        }

        if (value) {
            // setLoading(true);
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Verify to enable biometrics",
                fallbackLabel: "Enter PIN",
            });

            // setLoading(false);

            if (result.success) {
                await AsyncStorage.setItem("biometricEnabled", "true");
                await updateBiometricOnServer("Y");
                setEnabled(true);
                console.log(result.success)
                Alert.alert("Success", "Biometric login enabled!");
            } else {
                setEnabled(false);
                Alert.alert("Failed", "Authentication failed. Try again.");
            }
        } else {
            await AsyncStorage.removeItem("biometricEnabled");
            await updateBiometricOnServer("N");
            setEnabled(false);
            Alert.alert("Disabled", "Biometric login disabled.");
        }
    };

    const openPopup = () => {
        setModalVisible2(true);
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
        }).start(() => setModalVisible2(false)); // Close after animation
    };

    const openPopup1= () => {
        setModalVisible3(true);
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
        }).start(() => setModalVisible3(false)); // Close after animation
    };

    const deleteaccount = async() => {
        return ([closePopup(), openPopup1()])
    }
    
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
            <Animated.ScrollView showsVerticalScrollIndicator={false}>  
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
                
                <View style={{margin:15}}/> 
                <ThemedText type="titleMedium">Settings</ThemedText>
                <ThemedText style={{color: Colors.gray9}}>View your app activities here</ThemedText>

                <View style={{margin:15}}/>

                <TouchableOpacity onPress={() => router.push('/(protected)/compliance')} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}}>
                    <ThemedText>Compliance Docs</ThemedText>
                    <MaterialIcons name="arrow-forward-ios" size={15} color={color} />
                </TouchableOpacity>

                <View style={{margin:7}}/>

                 <TouchableOpacity onPress={() => router.push("/(protected)/notificationsetup") } style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}}>
                    <ThemedText>Notification Setup</ThemedText>
                    <MaterialIcons name="arrow-forward-ios" size={15} color={color} />
                </TouchableOpacity>

                <View style={{margin:7}}/>

                 <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}} onPress={() => router.push("/transactionpin")}>
                    <ThemedText>Set Transaction Pin</ThemedText>
                    <MaterialIcons name="arrow-forward-ios" size={15} color={color} />
                </TouchableOpacity>

                <View style={{margin:7}}/>

                {/* {supported &&
                    <> */}
                        <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}}>
                            <ThemedText>Enable Biometrics</ThemedText>
                            {/* <MaterialIcons name="arrow-forward-ios" size={15} color={color} /> */}
                            <Switch
                                value={enabled}
                                onValueChange={handleToggle}
                                trackColor={{ false: Colors.gray9, true: Colors.green }}
                                thumbColor={enabled ? Colors.white : "#f4f3f4"}
                            />
                        </TouchableOpacity>

                        <View style={{margin:7}}/>
                    {/* </>
                } */}

                <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}} onPress={() => router.push("/changepassword")}>
                    <ThemedText>Change Login Password</ThemedText>
                    <MaterialIcons name="arrow-forward-ios" size={15} color={color} />
                </TouchableOpacity>

                <View style={{margin:7}}/>

                <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}} onPress={() => Alert.alert("Logout", "Are you sure you want to logout", [
                    {
                        text: "No",
                        onPress: () => {}
                    }, 
                    {
                        text: "Yes",
                        onPress: () => logout()
                    }
                ])}>
                    <ThemedText>Logout</ThemedText>
                    <Feather name="log-in" size={15} color={color} />
                </TouchableOpacity>

                <View style={{margin:7}}/>

                 <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:0.5, paddingTop:13, paddingBottom:13, borderBottomColor: Colors.gray9}} onPress={openPopup}>
                    <ThemedText style={{color: Colors.red}}>Delete Account</ThemedText>
                    <MaterialCommunityIcons name="trash-can" size={20} color={Colors.red} />
                </TouchableOpacity>

                <View style={{margin:7}}/>

            <Modal
                transparent
                visible={modalVisible2}
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
                    <ThemedView style={{alignSelf:'center', backgroundColor: Colors.error300, padding:10, borderRadius:100}}>
                        <View style={{backgroundColor: Colors.error200, padding:10, borderRadius:100}}>
                            <AntDesign name="exclamation-circle" size={20} color={Colors.red} />  
                        </View>
                    </ThemedView>

                    <View style={{margin:10}}/>

                    <ThemedText type='subtitle' style={{textAlign:'center', color: Colors.red}}>Delete Account</ThemedText>
                    <View style={{margin:2}}/>

                    <ThemedText style={{textAlign:'center', color: Colors.gray9}}>This cannot be undone</ThemedText>

                    <View style={{margin:10}}/>

                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly'}}>
                        <ThemedButton style={{paddingVertical: 15,borderRadius: 10,alignItems: "center", flex:1}}>
                            <ThemedText>Cancel</ThemedText> 
                        </ThemedButton>
                        <ThemedButton style={{paddingVertical: 15,borderRadius:30,alignItems: "center", backgroundColor: Colors.red, flex:1}} onPress={deleteaccount}>
                            <ThemedText>Delete</ThemedText> 
                        </ThemedButton>
                    </View>
                    <View style={{margin:10}}/>
                </Animated.View>
            </Modal>


            <Modal
                transparent
                visible={modalVisible3}
                animationType="slide" 
                onRequestClose={closePopup1}
            >
                <TouchableOpacity style={styles.overlay}/>
    
                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                    ]}
                >     
                    <ThemedView style={{alignSelf:'center', backgroundColor: Colors.error300, padding:10, borderRadius:100}}>
                        <View style={{backgroundColor: Colors.error200, padding:10, borderRadius:100}}>
                            <AntDesign name="exclamation-circle" size={20} color={Colors.red} />  
                        </View>
                    </ThemedView>

                    <View style={{margin:10}}/>

                    <ThemedText type='subtitle' style={{textAlign:'center', color: Colors.red}}>Account Deleted</ThemedText>
                    <ThemedText type='subtitle' style={{textAlign:'center', color: Colors.red}}>Successfully</ThemedText>

                    <View style={{margin:10}}/>

                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly'}}>
                        <ThemedButton style={{paddingVertical: 15,borderRadius: 10,alignItems: "center", flex:1}} onPress={() => [closePopup1(),router.push("/signup")]}>
                            <ThemedText>Create an Account</ThemedText> 
                        </ThemedButton>
                        <ThemedButton style={{paddingVertical: 15,borderRadius:30,alignItems: "center", backgroundColor: Colors.green, flex:1}} onPress={() => [closePopup1(), router.push("/login")]}>
                            <ThemedText>Exit App</ThemedText> 
                        </ThemedButton>
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
})