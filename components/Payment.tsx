import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { PaystackProvider } from 'react-native-paystack-webview';

type PaymentBoxProps = {
  children: ReactNode; // 👈 anything can be passed inside
  containerStyle?: ViewStyle;
};

export default function CustomBox({ children, containerStyle }: PaymentBoxProps) {
  return (
    <PaystackProvider
      debug
      publicKey='pk_test_4a243b6e1b05148c6f3a136103c4ddb4290b3764'
      currency='NGN'
      defaultChannels={["card", "bank_transfer", "bank"]}
    >

      <View style={[styles.container, containerStyle]}>
        {children}
      </View>
    </PaystackProvider>
  );
}
// const Payment = () => {
    // const {popup} = usePaystack()
    // const router = useRouter()

    // const paynow = () => {
    //     popup.newTransaction({
    //         email: "danilchinedu766@gmailcom",
    //         amount: 3000,
    //         reference: `TNX_${Date.now()}`,
    //         onSuccess: async(res) => {
    //             router.push("/")
    //         },
    //         onCancel: () => {
    //             Alert.alert("Cancelled", "Transaction Cancelled")
    //         },
    //         onLoad: (res) => console.log("Webview loading"),
    //         onError: (err) => {
    //             console.log("An error occured while per", err)
    //         }
    //     })
    // }
//   return (
    
     
//   )
// }


const styles = StyleSheet.create({
  container: {
    flex:1
  },
})