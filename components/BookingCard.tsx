import { Colors, convertToReadableDateTime, decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { cancelrecurringrequestbyid } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import LogoSpinner from './LoadingScreen';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const {height} = Dimensions.get("window")

export const BookingCard = ({ item, onPress }: any) => {
  const router = useRouter();
  const color = Colors.gray9;
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current; 
  const [isFetching, setIsFetching] = React.useState(false);
  const {token, logout} = useAuth()
  const [formData, setFormData] = useState({
    id: "",
    assigned_helper: "",
    cancel_frequency: ""
  });
  
  const color1 = useThemeColor({},'background');
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

  const cancelfrequncyhandler = async () => {
    try {
      setIsFetching(true);
      const response = await cancelrecurringrequestbyid(formData.id, decryptData(token));
      Alert.alert("Success", response.message, [
        { text: "Ok", onPress: onPress },
      ]);
    } catch (error: any) {
      console.error("Error fetching pending requests:", error);
      if (error.response?.status === 401) {
        Alert.alert("Session expired", "Please log in again.");
        await logout(); // from your AuthContext
        router.replace("/login"); // navigate to login screen
      } else {
        Alert.alert('Error', 'Unable to load notification settings.')
      }
    } finally {
      setIsFetching(false);
    }
  }

  if(isFetching){
    return <LogoSpinner lightColor='' darkColor=''/>
  }

  return (
    <>
      <TouchableOpacity onPress={() => router.push({pathname:'/bookings1',  params: { bookingId: item.id } })}>
        <ThemedView
          style={{
            padding: 20,
            borderColor: Colors.gray9,
            borderWidth: 0.5,
            borderRadius: 15,
            marginBottom: 15,
          }}
        >
          {
            item.image === null ? <Image source={require('@/assets/images/bookings.png')} style={{ width: '100%', height: 150, borderRadius: 10 }} /> 
            : 
            <Image source={{ uri: `https://phixotech.com/igoepp/public/subcategory/${item.image}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
          }
          
          <View style={{ margin: 10 }} />

          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText type="titleLight">{item.sub_cat_name}</ThemedText>
            <ThemedView
              style={{
                backgroundColor: Colors.yellow1,
                alignSelf: 'flex-start',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 4,
              }}
            >
              <ThemedText style={{ color: '#fff' }} type="smallBold">
                #{item.id}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <View style={{ margin: 7 }} />

          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText type="title">NGN {!item.agreed_price ? '0.00' : item.agreed_price.toLocaleString()}</ThemedText>
            <ThemedView
              style={{
                paddingHorizontal: 8,
                backgroundColor: item.help_status === 'A' ? Colors.yellow1 : item.help_status === 'N' ? "#FD6922" : item.help_status === "C" ? Colors.green : '#FD6922',
                alignSelf: 'flex-start',
                borderRadius: 10,
              }}
            >
              <ThemedText type="smallMedium" style={{ color:'#fff'}}>
                {item.help_status === 'N' ? 'Pending' : item.help_status === 'A' ? 'Accepted' : item.help_status === 'C' ? 'Completed' : item.help_status === 'X' ? 'Cancelled' : item.help_status}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <View style={{ margin: 10 }} />
          
          <View>

            <ThemedView style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
              <ThemedText style={{ color: Colors.gray9 }}>{item.help_location+", "+item.help_lga+" "+item.help_state+"."}</ThemedText>
            </ThemedView>

            {item.help_status === 'A' && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ position: 'absolute', bottom: '10%', right: 0 }}
                onPress={() =>
                  router.push({
                    pathname: '/(protected)/chatscreen',
                    params: { id: item?.id, helperId: item?.assigned_helper, helper_user_id: item.helper_user_id },
                  })
                }
              >
                <Ionicons name="chatbubbles" size={22} color={Colors.green} />

                {/* Unread badge */}
                {item.chat_unread_customer > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      backgroundColor: Colors.red,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                      {item.chat_unread_customer > 100 ? '99+' : item.chat_unread_customer}
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            )}
{/* <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                      {item.chat_unread_customer}
                    </ThemedText> */}
          </View>
          <View style={{ margin: 4 }} />

          <ThemedView style={{ flexDirection: 'row' }}>
            <AntDesign name="calendar" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
            <ThemedText style={{ color: Colors.gray9 }}>{convertToReadableDateTime(item.help_date, item.help_time)}</ThemedText>
          </ThemedView>

          <View style={{ margin: 4 }} />

          <ThemedView style={{ flexDirection: 'row' }}>
            <Ionicons name="person-outline" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
            <ThemedText style={{ color: Colors.gray9 }}>{!item.helper_name ? "Not assigned" : item.helper_name}</ThemedText>
          </ThemedView>

          <View style={{ margin: 4 }} />

          <ThemedView style={{ flexDirection: 'row' }}>
            <MaterialIcons name="payments" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
            <ThemedText  style={{ color: Colors.gray9 }}>{item.invoice_type === "Y" ? "Invoice Payment" : "Immediate Payment"}</ThemedText>
          </ThemedView>

          <View style={{ margin: 4 }} />
          
          <ThemedView style={{ flexDirection: 'row' }}>
            <MaterialIcons name="payments" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
            <ThemedText  style={{ color: Colors.gray9 }}>{item.preassessment_flg === "Y" ? "Preassessment Request" : "Normal Request" }</ThemedText>
          </ThemedView>

          <View style={{ margin: 10 }} />

          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            {item.help_status !== 'A' && item.help_status !== 'C' && item.help_status !== 'X' ?
              <ThemedButton
                style={{
                  backgroundColor: Colors.green4,
                  alignSelf: 'flex-start',
                  padding: 7,
                  borderRadius: 25,
                }}
                onPress={() => router.push({pathname:'/bidspending',  params: { bookingId: item.id } })}
              >
                <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">
                  View Offer({item.bid_count})
                </ThemedText>
              </ThemedButton>
              : <View></View>
            }

            {item.help_status !== 'N' &&
              <TouchableOpacity style={{alignContent:'flex-end'}} onPress={() => [openPopup(), setFormData({id: item.id, assigned_helper: item.assigned_helper, cancel_frequency: item.cancel_frequency})]}>
                <Entypo name="dots-three-vertical" size={20} color={Colors.gray9} />
              </TouchableOpacity>
            }
          </View>


          <View style={{ height: 1, backgroundColor: Colors.gray9, marginTop: 10 }} />
        </ThemedView>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide" // Disable default animation for custom one
        onRequestClose={() => [closePopup()]} // Close on back press
      >

      {/* <Pressable  onPress={Keyboard.dismiss} style={styles.centeredView}> */}

      <TouchableOpacity style={styles.overlay} onPress={() => {closePopup()}} />

      <Animated.View
        style={[
          styles.popup,
          { transform: [{ translateY: slideAnim }], backgroundColor: color1  },
        ]}
      >
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={closePopup}>
            <AntDesign name="close-circle" size={20} color={color} />
          </TouchableOpacity>
          <View style={{flexDirection:'row', flex:1, justifyContent:'center'}}>
            <ThemedText type='titleMedium'>Actions</ThemedText>
          </View>
        </View>

        <View style={{marginTop:30}}/>
          <TouchableOpacity style={{flexDirection:'row',}} onPress={() => [closePopup(),router.push({pathname:'/viewmaterials', params:{requestid:formData.id, assignedhelper: formData.assigned_helper}})]}>
            <MaterialIcons name="view-headline" size={24} color={color}/>
            <View style={{margin:5}}/>
            <View style={{alignItems:'center', alignContent:'center',alignSelf:'center'}}>
              <ThemedText>{"View Material's"}</ThemedText>
            </View>
          </TouchableOpacity>


          {
            formData.cancel_frequency === "N" && 
            <>
              <View style={{marginTop:20}}/>
              <TouchableOpacity style={{flexDirection:'row',}} onPress={() => [closePopup(), cancelfrequncyhandler()]}>
                <MaterialIcons name="mode" size={16} color={color}/>
                <View style={{margin:5}}/>
                <View style={{alignItems:'center', alignContent:'center',alignSelf:'center'}}>
                  <ThemedText>{"Cancel Recurring Request"}</ThemedText>
                </View>
              </TouchableOpacity>
            </>
          } 
          

          <View style={{marginTop:20}}/>
        </Animated.View>
        {/* </Pressable> */}
      </Modal>
    </>
  );
};

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
