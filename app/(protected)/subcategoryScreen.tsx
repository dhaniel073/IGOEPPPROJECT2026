import EmptyScreen from '@/components/EmptyScreen';
import GoBack from '@/components/GoBack';
import LogoSpinner from '@/components/LoadingScreen';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { PUBLIC_API_BASE_URL, subcategory } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};

export default function subcategoryScreen({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const router = useRouter()
    const navigation = useNavigation();
    const { id, name } = useLocalSearchParams<any>()
    const { logout } = useAuth()
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
    const [fetchedCategory, setFetchedCategory] = useState<any[]>([])
    const [isLoading, setisloading] = useState<boolean>(false)
    const [filteredData, setFilteredData] = useState(fetchedCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        subcatid: "",
        preassessment_flg: "",
        enable_go_to_artisan: ""
    });


    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setisloading(true)
                const response = await subcategory(id);
                setFetchedCategory(response)
            } catch (error: any) {
                Alert.alert('Error', 'Unable to load sub categories.')
            } finally {
                setisloading(false);
            }
        };
        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);
        return unsubscribe;
    }, []);

    useEffect(() => {
        const q = searchQuery.trim().toLowerCase();
        if (q.length === 0) {
            setFilteredData(fetchedCategory);
        } else {
            setFilteredData(
                fetchedCategory.filter((item: any) =>
                    (item.sub_cat_name || '').toLowerCase().includes(q)
                ));
        }
    }, [searchQuery, fetchedCategory]);

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

    if (isLoading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color1, paddingHorizontal: 20, paddingTop: 10 }} edges={['top', 'bottom']}>
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>
            <View style={{ margin: 6 }} />

            <ThemedText type="titleMedium">{name}</ThemedText>
            <ThemedText style={{ color: Colors.gray9 }}>View all sub categories</ThemedText>

            <View style={{ margin: 6 }} />

            <View style={styles.searchRow}>
                <TextInput style={styles.input} placeholder="Search subcategory by name" placeholderTextColor={"#000"} value={searchQuery} onChangeText={setSearchQuery} returnKeyType="search" />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <MaterialIcons name="close" size={20} color={color} />
                    </TouchableOpacity>)}
            </View>

            {filteredData.length === 0 ?
                <View style={styles.emptyContainer}>
                    <EmptyScreen
                        mainText="No subcategory"
                        subText="No subcategory found under this category yet."
                        imageSource={""} // your local image
                    />
                </View>
                :
                <>


                    <View style={{ margin: 5 }} />


                    <FlatList
                        keyExtractor={(item: any) => item.id.toString()}
                        data={filteredData}
                        showsHorizontalScrollIndicator={false}
                        numColumns={1}
                        renderItem={({ item }) => (
                            <TouchableOpacity>
                                <ThemedView style={{ padding: 20, borderColor: Colors.gray9, borderWidth: 0.5, borderRadius: 15, marginBottom: 15, boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', }}>
                                    {
                                        item.image === null || "" ?
                                            <Image source={require('@/assets/images/bookings.png')} style={styles.image} />
                                            :
                                            <Image source={{ uri: `${PUBLIC_API_BASE_URL}subcategory/${item.image}` }} style={styles.image} />
                                    }

                                    <View style={{ margin: 15 }} />

                                    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <ThemedText type="titleLight">{item.sub_cat_name}</ThemedText>
                                    </ThemedView>

                                    <View style={{ margin: 7 }} />

                                    <ThemedView style={{ flexDirection: 'row' }}>
                                        <ThemedText style={{ color: Colors.gray9 }}>{item.sub_cat_desc}</ThemedText>
                                    </ThemedView>

                                    <View style={{ margin: 10 }} />

                                    <ThemedButton style={{ backgroundColor: Colors.green, alignSelf: 'flex-end', padding: 7, borderRadius: 25, paddingHorizontal: 15 }} onPress={() => {
                                        if (item.preassessment_flg === "N") {
                                            [setFormData({ subcatid: item.id, preassessment_flg: item.preassessment_flg, enable_go_to_artisan: item.enable_go_to_artisan }), openPopup1()]
                                        } else {
                                            [setFormData({ subcatid: item.id, preassessment_flg: item.preassessment_flg, enable_go_to_artisan: item.enable_go_to_artisan }), openPopup()]
                                        }

                                    }
                                    }>
                                        <ThemedText style={{ color: '#fff' }} type='defaultSemiBold'>Proceed</ThemedText>
                                    </ThemedButton>

                                </ThemedView>
                            </TouchableOpacity>
                        )}
                    />
                </>
            }

            <View style={{ margin: 5 }} />


            <Modal
                transparent
                visible={modalVisible1}
                animationType="slide"
                onRequestClose={closePopup1}
            >
                <TouchableOpacity style={styles.overlay} onPress={() => [closePopup1()]} />

                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
                    ]}
                >
                    <TouchableOpacity onPress={closePopup1} style={{ alignSelf: 'flex-end' }}>
                        <MaterialIcons name="cancel" size={24} color={Colors.green} />
                    </TouchableOpacity>

                    <ThemedText type='subtitle' style={{ textAlign: 'center' }}>Target option</ThemedText>
                    <View style={{ margin: 10 }} />


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>

                        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.yellow3, padding: 12, borderRadius: 12 }]} onPress={() => [closePopup1(), router.push(
                            { pathname: '/selectartisanmap', params: { request_type: "P", name: name, catid: id, subcatid: formData.subcatid, preassessment_flg: formData.preassessment_flg, enable_go_to_artisan: formData.enable_go_to_artisan } })]}>
                            <MaterialIcons name="person" size={28} color={Colors.yellow2} style={styles.icon} />
                            <Text style={styles.cardTitle}>
                                Send to an Artisan
                            </Text>
                            <Text style={styles.cardText}>Request a particular artisan</Text>
                        </TouchableOpacity>

                        <View style={{ marginHorizontal: 5 }} />

                        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.green6, padding: 12, borderRadius: 12 }]} onPress={() => [closePopup1(), router.push(
                            { pathname: '/requesthelp', params: { request_type: "G", catid: id, subcatid: formData.subcatid, preassessment_flg: formData.preassessment_flg, enable_go_to_artisan: formData.enable_go_to_artisan } })]}>
                            <FontAwesome name="group" size={20} color={Colors.green4} style={styles.icon} />
                            <Text style={styles.cardTitle}>
                                Send to all Artisans
                            </Text>
                            <Text style={styles.cardText}>Send request to a general pool of artisans</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 15 }} />
                </Animated.View>
            </Modal>

            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closePopup}
            >
                <TouchableOpacity style={styles.overlay} onPress={() => [closePopup()]} />

                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '10%' },
                    ]}
                >
                    <TouchableOpacity onPress={closePopup} style={{ alignSelf: 'flex-end' }}>
                        <MaterialIcons name="cancel" size={24} color={Colors.green} />
                    </TouchableOpacity>

                    <ThemedText type='subtitle' style={{ textAlign: 'center' }}>Select a request type</ThemedText>

                    <View style={{ margin: 10 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>

                        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.yellow3, padding: 12, borderRadius: 12 }]} onPress={() => [setFormData({ subcatid: formData.subcatid, preassessment_flg: "P", enable_go_to_artisan: formData.enable_go_to_artisan }), closePopup(), openPopup1()]}>
                            <Text style={styles.cardTitle}>
                                Preassessment Request
                            </Text>
                            <Text style={styles.cardText}>Initial evaluation before full service.</Text>
                        </TouchableOpacity>

                        <View style={{ marginHorizontal: 5 }} />

                        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.green6, padding: 12, borderRadius: 12 }]} onPress={() => [setFormData({ subcatid: formData.subcatid, preassessment_flg: "N", enable_go_to_artisan: formData.enable_go_to_artisan }), closePopup(), openPopup1()]}>
                            <Text style={styles.cardTitle}>
                                New Request
                            </Text>
                            <Text style={styles.cardText}>Fresh service request from user.</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 15 }} />
                </Animated.View>
            </Modal>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
        // borderWidth:1
    },
    searchRow: {
        flexDirection: 'row',           // layout children horizontally
        alignItems: 'center',           // center vertically
        backgroundColor: Colors.clock1, // subtle background color matching your app palette
        borderRadius: 8,                // rounded corners
        paddingHorizontal: 10,          // left and right padding inside the bar
        paddingVertical: 10,             // top and bottom padding inside the bar
        marginBottom: 10,               // space below the search bar before the list
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.blacktext,
        paddingVertical: 7,
        paddingHorizontal: 10,
    },
    card: {
        flex: 1,
        // padding: 12,
        // borderRadius: 12,
        // marginHorizontal: 5,
    },
    icon: {
        marginBottom: 8,
    },
    cardTitle: {
        color: '#000',
        marginBottom: 6,
        fontSize: 12,
        fontFamily: 'poppinsMedium'
    },
    cardText: {
        color: Colors.blacktext,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 12,
        alignSelf: 'center'
    },
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})