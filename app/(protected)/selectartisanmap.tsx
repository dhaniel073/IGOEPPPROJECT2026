import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { getsubcathelper, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

const { width, height } = Dimensions.get('window');

// ArtisanMarker component with floating animation
const ArtisanMarker = ({ artisan, position, onPress }: any) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.markerContainer,
        {
          left: position.x,
          top: position.y,
          transform: [{ translateY: floatAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={() => onPress(artisan)} activeOpacity={0.8}>
        <View style={styles.imageWrapper}>
          <Image
            source={artisan.photo ? { uri: `${PUBLIC_API_BASE_URL}handyman/${artisan.photo}` } : require("@/assets/images/person-4.png")}
            style={styles.markerImage}
          />
        </View>
        <View style={styles.markerPin} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function selectartisanmap({
  lightColor,
  darkColor,
}: any) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const { token } = useAuth()
  const [responseData, setresponseData] = useState<any>([])
  const [isloading, setisloading] = useState(false)
  const { request_type, catid, subcatid, preassessment_flg, name, enable_go_to_artisan } = useLocalSearchParams()

  const [selectedArtisan, setSelectedArtisan] = useState<any>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtisans = responseData.filter((artisan: any) =>
    artisan.helper_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artisan.helper_location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useLayoutEffect(() => {
    const fetchArtisans = async () => {
      try {
        setisloading(true)
        const response = await getsubcathelper(subcatid, decryptData(token));
        setresponseData(response.data || [])
      } catch (error: any) {
        console.error("Error loading artisans:", error);
      } finally {
        setisloading(false);
      }
    };
    fetchArtisans();
  }, [subcatid, token]);

  const onMarkerPress = (artisan: any) => {
    setSelectedArtisan(artisan);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeDetails = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedArtisan(null));
  };

  // Grid-based deterministic positioning to prevent overlaps
  const getPosition = (id: string, index: number) => {
    const numCols = 3;
    const horizontalPadding = 40;
    const verticalStart = 140;
    const cellWidth = (width - horizontalPadding * 2) / numCols;
    const cellHeight = 110;

    const col = index % numCols;
    const row = Math.floor(index / numCols);

    // Grid base position
    const baseX = horizontalPadding + col * cellWidth;
    const baseY = verticalStart + row * cellHeight;

    // Deterministic jitter based on ID to keep it look "scattered" but within cell bounds
    const seed = (parseInt(id) || index) * 997;
    const jitterX = (Math.abs(Math.sin(seed)) * (cellWidth - 50));
    const jitterY = (Math.abs(Math.cos(seed)) * (cellHeight - 60));

    return { x: baseX + jitterX, y: baseY + jitterY };
  };

  if (isloading && !responseData.length) {
    return <LogoSpinner lightColor='' darkColor='' />
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("@/assets/images/stylized_map.jpg")}
        style={[
          styles.map,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, height],
                  outputRange: [0, -100],
                  extrapolate: 'clamp',
                }),
              },
              {
                scale: 1.3,
              }
            ],
          },
        ]}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          height: Math.max(height, 200 + Math.ceil(responseData.length / 3) * 120),
          paddingBottom: 400
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredArtisans.map((item: any) => {
          const originalIndex = responseData.findIndex((i: any) => i.helper_id === item.helper_id);
          return (
            <ArtisanMarker
              key={item.helper_id}
              artisan={item}
              position={getPosition(item.helper_id, originalIndex)}
              onPress={onMarkerPress}
            />
          );
        })}
      </Animated.ScrollView>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: color1 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={color} />
      </TouchableOpacity>

      <View style={[styles.searchBar, { backgroundColor: color1 }]}>
        <Ionicons name="search" size={18} color={Colors.gray9} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: color }]}
          placeholder="Search artisan or location..."
          placeholderTextColor={Colors.gray9}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.gray9} />
          </TouchableOpacity>
        )}
      </View>

      {selectedArtisan && (
        <Animated.View style={[styles.detailCard, { transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={closeDetails}>
            <MaterialCommunityIcons name="close" size={24} color={Colors.gray9} />
          </TouchableOpacity>
          <View style={styles.detailRow}>
            <View style={styles.detailImageWrapper}>
              <Image
                source={selectedArtisan.photo ? { uri: `${PUBLIC_API_BASE_URL}handyman/${selectedArtisan.photo}` } : require("@/assets/images/person-4.png")}
                style={styles.detailImage}
              />
            </View>
            <View style={styles.detailText}>
              <ThemedText style={styles.artisanName}>{selectedArtisan.helper_name}</ThemedText>
              <ThemedText type="small" style={styles.locationText}>
                <MaterialCommunityIcons name="map-marker" size={16} color={Colors.gray9} />{selectedArtisan.helper_location}
              </ThemedText>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons name="star" size={16} color={Colors.yellow1} />
                <ThemedText type="small" style={{ marginLeft: 4, color: Colors.gray9 }}>4.8 (24 reviews)</ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.green }]}
              onPress={() => router.push({ pathname: "/requesthelp", params: { request_type, catid, subcatid, preassessment_flg, name, helperid: selectedArtisan.helper_id, enable_go_to_artisan } })}
            >
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Select Artisan</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.gray6 }]}
              onPress={() => router.push({ pathname: "/artisan", params: { request_type, catid, subcatid, preassessment_flg, name, helperid: selectedArtisan.helper_id, enable_go_to_artisan } })}
            >
              <ThemedText style={{ fontWeight: '600', color: Colors.gray9 }}>View Profile</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Soft overlay to make UI elements pop
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
  },
  searchBar: {
    position: 'absolute',
    top: 50,
    left: 74,
    right: 20,
    zIndex: 10,
    borderRadius: 22,
    paddingHorizontal: 15,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'poppinsRegular',
    padding: 0,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
  },
  imageWrapper: {
    padding: 3,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  markerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  markerPin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.green,
    transform: [{ rotate: '180deg' }],
    alignSelf: 'center',
    marginTop: -2,
  },
  detailCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailImageWrapper: {
    padding: 2,
    backgroundColor: Colors.green,
    borderRadius: 35,
    marginRight: 15,
  },
  detailImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#fff',
  },
  detailText: {
    flex: 1,
  },
  artisanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationText: {
    color: Colors.gray9,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
