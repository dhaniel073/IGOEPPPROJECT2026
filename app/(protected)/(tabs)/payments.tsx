import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, ScrollView, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function payments({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<'bills' | 'history'>('bills');

    const bills = [
      { title: 'Buy Airtime', desc: 'Recharge your phone', link: () => router.push("/billspaymentAirtime")},
      { title: 'Buy Data', desc: 'Purchase data bundles', link: () => router.push("/billspaymentData")},
      { title: 'Buy Electricity', desc: 'Top up your electricity units  ', link: () => router.push("/billspaymentElectricity")},
      { title: 'Buy Cable TV', desc: 'Renew your TV subscription', link: () => router.push("/billspaymentTv")},
      { title: 'Betting', desc: 'Fund your betting wallet', link: () => router.push("/billspaymentBetting")},
      { title: 'Buy WAEC PIN', desc: 'Pay for your WAEC registration', link: () => router.push("/billspaymentEducation") },
    ];
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:15, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal:10}}>  
        <View style={{margin:15}}/> 
        <ThemedText type="titleMedium">Bills Payment</ThemedText>
        <ThemedText style={{color: Colors.gray9}}>View your app activities here</ThemedText>
        <View style={{margin:15}}/>

        {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bills' && styles.activeTab]}
          onPress={() => setActiveTab('bills')}
        >
          <Text style={[styles.tabText, activeTab === 'bills' && styles.activeTabText]}>
            Bills Payment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Unified Content Area (prevents spacing jump) */}
      <View style={styles.contentContainer}>
        {activeTab === 'bills' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {bills.map((item, index) => (
              <TouchableOpacity key={index} style={styles.billItem} onPress={item.link}>
                <View style={styles.billLeft}>
                  <Ionicons name="card-outline" size={22} color="#fff" style={styles.icon} />
                  <View>
                    <Text style={styles.billTitle}>{item.title}</Text>
                    <Text style={styles.billDesc}>{item.desc}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#fff" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.historyContent}>
            <Text style={styles.historyText}>No transaction history yet.</Text>
          </View>
        )}
      </View>

      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
   tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius:16,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    padding: 6,
  },
  tab: {
    flex: 1,
    marginVertical:10,
    marginHorizontal:10,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#2E5126',
  },
  tabText: {
    color: '#ddd',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },

  /** unified content area **/
  contentContainer: {
    flex: 1,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -2,
    paddingVertical: 8,
  },

  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  billLeft: { flexDirection: 'row', alignItems: 'center' },
  billTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  billDesc: { color: '#ccc', fontSize: 12, marginTop: 2 },
  icon: { marginRight: 14 },

  /** history **/
  historyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: { color: '#fff', fontSize: 14 },
})