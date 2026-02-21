import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerinfocheck, PUBLIC_API_BASE_URL, uploadprofileimage } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Animated, Dimensions, Image, Modal, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const { height } = Dimensions.get('window');

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};

export default function profile({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const { user, token, updateUser } = useAuth()

    const slideAnim = React.useRef(new Animated.Value(height)).current;

    const copyToClipboard = async (number: any) => {
        await Clipboard.setStringAsync(number);
    };

    const handlePlay = () => {
        setVisible1(true)
        setTimeout(() => {
            setVisible1(false);
        }, 2000); // Adjust this duration to match the length of your GIF
    };
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
        setVisible(true);
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
        }).start(() => setVisible(false)); // Close after animation
    };

    const captureImage = async () => {
        try {
            // Ask for camera permission properly
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
            Alert.alert('Error', 'Unable to open camera.');
        }
    };


    const pickImage = async () => {
        try {
            //Ask for media library permission properly
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

            Alert.alert("Success", successMessage, [
                { text: "Ok", onPress: reload },
            ]);
        } catch (error: any) {
            Alert.alert("Error", "An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadAddress = (image: any) =>
        handleUpload({
            image,
            uploadFn: (url) => uploadprofileimage(url, user?.customer_id, decryptData(token)),
            successMessage: "Profile Picture Updated Successfully",
        }
        );

    const reload = async () => {
        try {
            setIsLoading(true)
            const response = await customerinfocheck(user?.customer_id, decryptData(token))
            updateUser(response);
        } catch (error: any) {
            return;
        } finally {
            setIsLoading(false)
        }
    }

    if (isloading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <Animated.ScrollView showsVerticalScrollIndicator={false}>
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
                <View style={{ margin: 6 }} />
                <ThemedText type="titleMedium">Profile</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>View your app activities here</ThemedText>

                <View style={{ margin: 10 }} />

                {
                    visible1 ?
                        <ThemedView style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', marginTop: 8, marginBottom: 10, padding: 10, borderRadius: 8, backgroundColor: color }}>
                            <ThemedText style={{ textAlign: 'center', color: color1 }}>Copied!</ThemedText>
                        </ThemedView>
                        : null
                }

                <TouchableOpacity activeOpacity={0.8} onPress={openPopup1} style={{ padding: 15, borderWidth: 1, alignSelf: 'flex-start', borderRadius: 100, borderColor: Colors.green }}>
                    {
                        user?.picture ?
                            <Image
                                source={{ uri: `${PUBLIC_API_BASE_URL}customers/${user?.picture}` }}
                                style={styles.image}
                            />
                            :
                            <Image
                                source={require("@/assets/images/avatar1.png")}
                                style={styles.image}
                            />
                    }
                    <View style={{ position: "absolute", bottom: 0, right: 15 }}>
                        <FontAwesome name="camera" size={20} color={Colors.green} />
                    </View>
                </TouchableOpacity>

                <View style={{ margin: 3 }} />

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.6} onPress={() => router.push("/profileEdit")}>
                    <ThemedText style={{ marginRight: 10 }}>Edit</ThemedText>
                    <TouchableOpacity>
                        <FontAwesome6 name="edit" size={13} color={Colors.green} />
                    </TouchableOpacity>
                </TouchableOpacity>
                <View style={{ margin: 8 }} />


                <ThemedView style={{ backgroundColor: Colors.gray10, paddingHorizontal: 15, paddingVertical: 20, borderRadius: 8 }}>
                    <ThemedText style={{ color: Colors.green }}>Basic Info</ThemedText>
                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                    <View style={{ margin: 3 }} />

                    <ThemedText style={{ color: Colors.blacktext }}>Name</ThemedText>

                    {user?.account_type === 'C' || user?.account_type === 'E' ?
                        <ThemedText style={{ color: '#000' }}>{user?.last_name} {user?.first_name} </ThemedText>
                        :
                        <ThemedText style={{ color: '#000' }}>{user?.company_name}</ThemedText>
                    }
                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                    <View style={{ margin: 1 }} />

                    <ThemedText style={{ color: Colors.blacktext }}>Customer id</ThemedText>
                    <ThemedText style={{ color: '#000' }}>{user?.customer_id}</ThemedText>

                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />
                    <View style={{ margin: 1 }} />

                    <ThemedText style={{ color: Colors.blacktext }}>Referal code</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ThemedText style={{ color: '#000' }}>{user?.personal_referal_code}</ThemedText>
                        <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => [handlePlay(), copyToClipboard(user?.personal_referal_code)]}>
                            <Ionicons name="copy" size={15} color={Colors.gray9} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                    <View style={{ margin: 1 }} />

                    <ThemedText style={{ color: Colors.blacktext }}>Phone number</ThemedText>
                    <ThemedText style={{ color: '#000' }}>{user?.phone && `+234${user?.phone.startsWith('0') ? user?.phone.slice(1) : user?.phone}`}</ThemedText>
                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                    <View style={{ margin: 1 }} />

                    <ThemedText style={{ color: Colors.blacktext }}>Email</ThemedText>
                    <ThemedText style={{ color: '#000' }}>{user?.email}</ThemedText>
                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                    <View style={{ margin: 1 }} />

                    <ThemedText style={{ color: Colors.blacktext }}>Accoun type</ThemedText>
                    <ThemedText style={{ color: '#000' }}>{user?.account_type === "B" ? "Business account" : "Personal account"}</ThemedText>
                    <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                    <View style={{ margin: 1 }} />

                    {
                        user?.account_type === "B" || user?.account_type === "E" ?
                            <>
                                <ThemedText style={{ color: Colors.blacktext }}>Business id</ThemedText>
                                <ThemedText style={{ color: '#000' }}>{user?.business_id}</ThemedText>
                                <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                                <View style={{ margin: 1 }} />

                                <ThemedText style={{ color: Colors.blacktext }}>Tin number</ThemedText>
                                <ThemedText style={{ color: '#000' }}>{user?.tin_number}</ThemedText>
                                <View style={{ borderWidth: 0.2, borderColor: Colors.gray9 }} />

                                <View style={{ margin: 1 }} />


                                <ThemedText style={{ color: Colors.blacktext }}>Rc number</ThemedText>
                                <ThemedText style={{ color: '#000' }}>{user?.rc_number}</ThemedText>
                            </>
                            : null
                    }

                </ThemedView>




                <Modal
                    transparent
                    visible={visible}
                    animationType="slide" // Disable default animation for custom one
                    onRequestClose={() => [closePopup1()]} // Close on back press
                >

                    <TouchableOpacity style={styles.overlay} onPress={() => { closePopup1() }} />

                    <Animated.View
                        style={[
                            styles.popup,
                            { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' },
                        ]}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={closePopup1}>
                                <AntDesign name="close-circle" size={20} color={color} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                                <ThemedText type='titleMedium'>Actions</ThemedText>
                            </View>
                        </View>

                        {
                            user?.picture &&
                            <>
                                <View style={{ marginTop: 20 }} />
                                <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => [closePopup1(), router.push({ pathname: "/(protected)/profilepictureview", params: { imageUrl: user?.picture } })]}>
                                    <MaterialIcons name="view-headline" size={20} color={color} />
                                    <View style={{ margin: 5 }} />
                                    <View style={{ alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
                                        <ThemedText>{"View Profile picture"}</ThemedText>
                                    </View>
                                </TouchableOpacity>
                            </>
                        }

                        <View style={{ marginTop: 20 }} />

                        <TouchableOpacity style={{ flexDirection: 'row', }} onPress={() => [closePopup1(), openPopup()]}>
                            <AntDesign name="edit" size={20} color={color} />
                            <View style={{ margin: 5 }} />
                            <View style={{ alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
                                <ThemedText>{"Update Profile picture"}</ThemedText>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    {/* </Pressable> */}
                </Modal>

                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={closePopup}
                >
                    <TouchableOpacity style={styles.overlay} onPress={closePopup} />

                    <Animated.View
                        style={[
                            styles.popup,
                            { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
                        ]}
                    >
                        <ThemedText style={{ textAlign: 'center' }}>Choose Image Source (Address)</ThemedText>

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
            </Animated.ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    image: {
        width: 85,
        height: 85,
        borderRadius: 100,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.green
    },

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