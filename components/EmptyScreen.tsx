import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Dimensions, Image, StyleSheet, TextProps, View } from 'react-native';
import { ThemedText } from './ThemedText';

export type EmptyScreenProps = TextProps & {
  mainText: string;
  subText?: string;
  imageSource?: any;
  lightColor?: string;
  darkColor?: string;
};


const { width } = Dimensions.get('window');

const EmptyScreen: React.FC<EmptyScreenProps> = ({
  mainText,
  subText,
  imageSource,
  lightColor,
  darkColor
}) => {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {imageSource && <Image source={imageSource} style={styles.image} resizeMode="contain" />}
      <ThemedText type='smallBold' style={[styles.mainText,]}>{mainText}</ThemedText>
      {subText && <ThemedText style={[styles.subText,{maxWidth: "75%"}]}>{subText}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'stretch', // ensure it fills parent width
  },
  image: {
    marginTop:50,
    width: width * 0.3,
    height: width * 0.5,
  },
  mainText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    textAlign: 'center',
  },
});

export default EmptyScreen;
