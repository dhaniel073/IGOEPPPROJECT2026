import { Colors, convertToReadableDateTime, decryptData, encryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { acceptTopup, cancelrecurringrequestbyid, getsession, PUBLIC_API_BASE_URL, validatepin } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign, Entypo, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { usePaystack } from 'react-native-paystack-webview';
import { downloadattachment } from './downloadattachment';
import LogoSpinner from './LoadingScreen';
import PinInput from './PinInput';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const { height } = Dimensions.get("window")

export const BookingCard = ({ item, onPress }: any) => {
  const router = useRouter();
  const color = Colors.gray9;
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const { user } = useAuth()
  const [isFetching, setIsFetching] = React.useState(false);
  const { token, logout } = useAuth()
  const [formData, setFormData] = useState({
    id: "",
    assigned_helper: "",
    help_frequency: "",
    cancel_frequency: "",
  });

  const [modalVisible1, setModalVisible1] = useState(false); // PIN Modal
  const [modalVisible2_Pay, setModalVisible2_Pay] = useState(false); // Payment Modal
  const [pinLoading, setPinLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [sessionid, setSessionId] = useState<any>(null);
  const { popup } = usePaystack();

  const color1 = useThemeColor({}, 'background');

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getsession(user?.email, decryptData(token));
        setSessionId(response.login_session_id);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };
    if (token) fetchSession();
  }, [token, user?.email]);

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

  const openPopup1 = () => {
    setModalVisible1(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePopup1 = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible1(false));
  };

  const openPayPopup = () => {
    setModalVisible2_Pay(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePayPopup = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible2_Pay(false));
  };

  const cancelfrequncyhandler = async () => {
    try {
      setIsFetching(true);
      const response = await cancelrecurringrequestbyid(formData.id, decryptData(token));
      Alert.alert("Success", response.message, [
        { text: "Ok", onPress: onPress },
      ]);
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Session expired", "Please log in again.");
        await logout();
        router.replace("/login");
      } else {
        Alert.alert('Error', 'Unable to load notification settings.')
      }
    } finally {
      setIsFetching(false);
    }
  }

  const handleDownload = async (url: any) => {
    const fileName = "attachment.pdf";
    const fileUrl = `${PUBLIC_API_BASE_URL}attachment/${url}`;
    await downloadattachment(fileUrl, fileName);
  };

  const handleTopupClick = () => {
    const amount = item.pending_topup_amount;
    Alert.alert(
      "Confirm Payment",
      `You are about to pay NGN ${amount?.toLocaleString()}. Do you want to proceed?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Okay", onPress: () => openPopup1() }
      ]
    );
  };

  const onPinSubmit = async (pin: string) => {
    try {
      setPinLoading(true);
      await validatepin(user?.customer_id, encryptData(pin), decryptData(token));
      closePopup1();
      openPayPopup();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Invalid PIN. Please try again.");
    } finally {
      setPinLoading(false);
    }
  };

  const handlePaymentSelect = async () => {
    if (!selectedMethod) return Alert.alert("Selection Required", "Please select a payment method.");

    try {
      if (selectedMethod.id === 'DC') {
        // For Card, we don't show our spinner yet, Paystack handles its own UI
        closePayPopup();
        popup.newTransaction({
          email: user?.email,
          amount: item.pending_topup_amount,
          reference: `TOPUP_${item.id}_${Date.now()}`,
          onSuccess: async () => {
            try {
              setIsFetching(true);
              const response = await acceptTopup(item.id, 'DC', sessionid, decryptData(token));
              Alert.alert("Success", response.message || "Top-up balance paid successfully via card.", [{ text: "Ok", onPress: onPress }]);
            } catch (error: any) {
              Alert.alert(
                "Payment Error",
                error.response?.data?.message || "An error occurred while confirming card payment.",
                [{ text: "Try Again", onPress: () => openPayPopup() }, { text: "Cancel", style: "cancel" }]
              );
            } finally {
              setIsFetching(false);
            }
          },
          onCancel: () => {
            Alert.alert("Cancelled", "Payment cancelled.", [{ text: "Try Again", onPress: () => openPayPopup() }, { text: "Ok", style: "cancel" }]);
          },
          onError: () => {
            Alert.alert("Error", "Payment failed.", [{ text: "Try Again", onPress: () => openPayPopup() }, { text: "Ok", style: "cancel" }]);
          }
        });
      } else {
        // For other methods (Wallet, Cash, Transfer, Invoice)
        closePayPopup();
        setIsFetching(true);
        if (selectedMethod.id === 'W') {
          const response = await acceptTopup(item.id, 'W', sessionid, decryptData(token));
          Alert.alert("Success", response.message || "Top-up balance paid successfully via wallet.", [{ text: "Ok", onPress: onPress }]);
        } else if (selectedMethod.id === 'C') {
          const response = await acceptTopup(item.id, 'C', sessionid, decryptData(token));
          Alert.alert("Success", response.message || "Cash payment confirmed.", [{ text: "Ok", onPress: onPress }]);
        } else if (selectedMethod.id === 'T') {
          setIsFetching(false);
          router.push({
            pathname: '/(protected)/virtualaccountrequesttopup',
            params: {
              amount: item.pending_topup_amount,
              formattedamount: item.pending_topup_amount,
              requestid: item.id,
              bank: "VFD MICROFINANCE BANK"
            }

          });
        } else if (selectedMethod.id === 'I') {
          const response = await acceptTopup(item.id, 'I', sessionid, decryptData(token));
          Alert.alert("Success", response.message || "Invoice request initiated. Please follow up on the invoice details.", [{ text: "Ok", onPress: onPress }]);
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Payment Error",
        error.response?.data?.message || "An error occurred during payment.",
        [{ text: "Try Again", onPress: () => openPayPopup() }, { text: "Cancel", style: "cancel" }]
      );
      console.log(error.response);
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const paymentMethods = [
    { id: 'W', name: 'Pay with wallet', icon: <Fontisto name="wallet" size={14} color={Colors.wallet} /> },
    { id: 'DC', name: 'Pay with debit card', icon: <Entypo name="credit-card" size={14} color={Colors.wallet} /> },
    { id: 'T', name: 'Pay with transfer', icon: <FontAwesome name="bank" size={14} color={Colors.wallet} /> },
    { id: 'C', name: 'Pay with cash', icon: <FontAwesome5 name="money-bill-wave" size={14} color={Colors.wallet} /> },
    ...(user?.account_type === 'B' || user?.account_type === 'E' ? [
      { id: 'I', name: 'Pay with invoice', icon: <MaterialCommunityIcons name="invoice" size={14} color={Colors.wallet} /> }
    ] : []),
  ];



  return (
    <>
      {isFetching && (
        <Modal transparent visible={true} animationType="none">
          <LogoSpinner lightColor="" darkColor="" />
        </Modal>
      )}
      <TouchableOpacity onPress={() => router.push({ pathname: '/bookings1', params: { bookingId: item.id } })}>
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
              <Image source={{ uri: `${PUBLIC_API_BASE_URL}subcategory/${item.image}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
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
              <ThemedText type="smallMedium" style={{ color: '#fff' }}>
                {item.help_status === 'N' ? 'Pending' : item.help_status === 'A' ? 'Accepted' : item.help_status === 'C' ? 'Completed' : item.help_status === 'X' ? 'Cancelled' : item.help_status}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {item.pending_topup_amount > 0 && (
            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.clock2, padding: 12, borderRadius: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="cash-plus" size={20} color={Colors.green} style={{ marginRight: 8 }} />
                <ThemedText type="smallBold" style={{ color: Colors.green }}>Topup pending:</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ThemedText type="smallBold" style={{ color: Colors.green }}>NGN {item.pending_topup_amount.toLocaleString()}</ThemedText>
                <TouchableOpacity
                  onPress={handleTopupClick}
                  style={{ backgroundColor: Colors.green, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 }}
                >
                  <ThemedText style={{ color: '#fff', fontSize: 12, fontFamily: 'poppinsSemiBold' }}>Pay Now</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ margin: 10 }} />

          <View>
            <ThemedView style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
              <ThemedText style={{ color: Colors.gray9 }}>{item.help_location + ", " + item.help_lga + " " + item.help_state + "."}</ThemedText>
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
                {item.chat_unread_customer > 0 && (
                  <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: Colors.red, minWidth: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }}>
                    <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{item.chat_unread_customer > 100 ? '99+' : item.chat_unread_customer}</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            )}
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
            <ThemedText style={{ color: Colors.gray9 }}>{item.invoice_type === "Y" ? "Invoice Payment" : "Immediate Payment"}</ThemedText>
          </ThemedView>

          <View style={{ margin: 4 }} />

          <ThemedView style={{ flexDirection: 'row' }}>
            <MaterialIcons name="payments" size={16} color={Colors.gray9} style={{ marginRight: 10 }} />
            <ThemedText style={{ color: Colors.gray9 }}>{item.preassessment_flg === "Y" ? "Preassessment Request" : "Normal Request"}</ThemedText>
          </ThemedView>

          <View style={{ margin: 10 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {item.help_status !== 'A' && item.help_status !== 'C' && item.help_status !== 'X' ?
                <ThemedButton
                  style={{ backgroundColor: Colors.green4, alignSelf: 'flex-start', padding: 7, borderRadius: 25 }}
                  onPress={() => router.push({ pathname: '/bidspending', params: { bookingId: item.id } })}
                >
                  <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">View Offer({item.bid_count})</ThemedText>
                </ThemedButton>
                : item.help_status === 'C' && item.customer_statisfy === null ?
                  <ThemedButton
                    style={{ backgroundColor: Colors.wallet, alignSelf: 'flex-start', padding: 7, borderRadius: 25 }}
                    onPress={() => router.push({ pathname: '/bookings1', params: { bookingId: item.id } })}
                  >
                    <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">Satisfy Request</ThemedText>
                  </ThemedButton>
                  : item.customer_statisfy !== null && item.helper_rating === null ?
                    <ThemedButton
                      style={{ backgroundColor: Colors.yellow, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 7, borderRadius: 25 }}
                      onPress={() => router.push({ pathname: '/(protected)/customerrating', params: { requestid: item.id, assigned_helper: item.assigned_helper, helper_rating: item.custom_rating } })}
                    >
                      <ThemedText style={{ color: '#fff', marginRight: 3 }} type="defaultSemiBold">Rate Helper</ThemedText>
                      <MaterialIcons name="star-rate" size={15} color="white" />
                    </ThemedButton>
                    : null
              }

              {item.help_status === 'C' &&
                <ThemedButton
                  style={{ backgroundColor: Colors.green11, alignSelf: 'flex-start', padding: 7, borderRadius: 25 }}
                  onPress={() => router.push({ pathname: '/(protected)/requestcompletedimages', params: { id: item.id } })}
                >
                  <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">Proof Images</ThemedText>
                </ThemedButton>
              }
            </View>

            {item.help_status !== 'N' &&
              <TouchableOpacity style={{ alignContent: 'flex-end' }} onPress={() => [openPopup(), setFormData(prev => ({ ...prev, id: item.id, assigned_helper: item.assigned_helper, cancel_frequency: item.cancel_frequency }))]}>
                <Entypo name="dots-three-vertical" size={20} color={Colors.gray9} />
              </TouchableOpacity>
            }
          </View>
          <View style={{ height: 1, backgroundColor: Colors.gray9, marginTop: 10 }} />
        </ThemedView>
      </TouchableOpacity>

      {/* Actions Modal */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={closePopup}>
        <TouchableOpacity style={styles.overlay} onPress={closePopup} />
        <Animated.View style={[styles.popup, { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' }]}>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <TouchableOpacity onPress={closePopup}>
              <AntDesign name="close-circle" size={24} color={color} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ThemedText type='titleMedium'>Actions</ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.actionItem} onPress={() => [closePopup(), router.push({ pathname: '/viewmaterials', params: { requestid: formData.id, assignedhelper: formData.assigned_helper } })]}>
            <MaterialIcons name="view-headline" size={20} color={color} />
            <ThemedText style={styles.actionText}>View Material's</ThemedText>
          </TouchableOpacity>

          {item.help_status === "A" && (
            <TouchableOpacity style={styles.actionItem} onPress={() => [closePopup(), router.push({ pathname: '/(protected)/dispute', params: { requestid: formData.id } })]}>
              <AntDesign name="exclamation-circle" size={20} color={color} />
              <ThemedText style={styles.actionText}>Log a Dispute</ThemedText>
            </TouchableOpacity>
          )}

          {item.help_status === "A" && item.attachment && (
            <TouchableOpacity style={styles.actionItem} onPress={() => [closePopup(), router.push({ pathname: '/(protected)/attachment', params: { url: `${PUBLIC_API_BASE_URL}attachment/${item.attachment}` } })]}>
              <Entypo name="attachment" size={20} color={color} />
              <ThemedText style={styles.actionText}>View Attachment's</ThemedText>
            </TouchableOpacity>
          )}

          {item.help_frequency !== "One-off" && item.cancel_frequency === "N" && (
            <TouchableOpacity style={styles.actionItem} onPress={() => [closePopup(), cancelfrequncyhandler()]}>
              <MaterialIcons name="mode" size={20} color={color} />
              <ThemedText style={styles.actionText}>Cancel Recurring Request</ThemedText>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Modal>

      {/* Transaction PIN Modal */}
      <Modal visible={modalVisible1} transparent animationType="slide" onRequestClose={closePopup1}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TouchableOpacity style={styles.overlay} onPress={closePopup1} />
          <Animated.View style={[styles.popup, { transform: [{ translateY: slideAnim }], backgroundColor: color1 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <ThemedText type="titleMedium">Enter PIN</ThemedText>
            </View>
            <ThemedText style={{ textAlign: 'center', color: Colors.gray9, marginBottom: 20 }}>
              Enter your four-digit transaction PIN to authorize payment of NGN {item.pending_topup_amount?.toLocaleString()}
            </ThemedText>
            {pinLoading ? <ActivityIndicator size="large" color={Colors.green} /> : <PinInput length={4} secure onSubmit={onPinSubmit} />}
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Select Payment Method Modal */}
      <Modal visible={modalVisible2_Pay} transparent animationType="slide" onRequestClose={closePayPopup}>
        <TouchableOpacity style={styles.overlay} onPress={closePayPopup} />
        <Animated.View style={[styles.popup, { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ThemedText type='titleMedium'>Select Payment Method</ThemedText>
            </View>
            <TouchableOpacity onPress={closePayPopup}>
              <MaterialIcons name="cancel" size={24} color={Colors.green} />
            </TouchableOpacity>
          </View>

          <ThemedText style={{ textAlign: 'center', color: Colors.green, marginBottom: 20 }} type='titleMedium'>
            NGN {item.pending_topup_amount?.toLocaleString()}
          </ThemedText>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method)}
              style={[styles.methodItem, selectedMethod?.id === method.id && styles.selectedMethodItem]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.iconContainer}>{method.icon}</View>
                <ThemedText>{method.name}</ThemedText>
              </View>
              <View style={[styles.radioOuter, { borderColor: Colors.green }]}>
                {selectedMethod?.id === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}

          <ThemedButton
            onPress={handlePaymentSelect}
            enabled={!!selectedMethod}
            style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}
          >
            <ThemedText style={{ color: '#fff' }}>Make Payment</ThemedText>
          </ThemedButton>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    marginLeft: 15,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  selectedMethodItem: {
    borderWidth: 1,
    borderColor: Colors.green,
  },
  iconContainer: {
    backgroundColor: Colors.clock2,
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: Colors.green,
    borderRadius: 5,
  }
});
