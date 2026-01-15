import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'small' | 'smallBold' | 'smallMedium' | 'bigsmall' | 'title' | 'titleLight' | 'titleBold'| 'titleMedium' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'smallBold' ? styles.smallBold : undefined,
        type === 'bigsmall' ? styles.bigsmall : undefined,
        type === 'smallMedium' ? styles.smallMedium : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'titleLight' ? styles.titleLight : undefined,
        type === 'titleMedium' ? styles.titleMedium : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'titleBold' ? styles.titleBold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  titleMedium:{
    fontSize: 18,
    lineHeight: 50,
    fontFamily:'poppinsSemiBold'
  },
  default: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: 'poppinsRegular'
  },
  small: {
    fontSize: 10,
    lineHeight: 24,
    fontFamily: 'poppinsRegular'
  },
  bigsmall: {
    fontSize: 11,
    lineHeight: 24,
    fontFamily: 'poppinsRegular'
  },
  smallMedium: {
    fontSize: 11,
    lineHeight: 24,
    fontFamily: 'poppinsSemiBold'
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'poppinsBold'
  },
  defaultSemiBold: {
    fontSize: 12,
    lineHeight: 24,
    // fontWeight: '600',
    fontFamily: 'poppinsSemiBold',
  },
  title: {
    fontSize: 20,
    lineHeight: 32,
    fontFamily:'poppinsBold'
  },
  titleBold: {
    fontSize: 15,
    lineHeight: 32,
    fontFamily:'poppinsBold'
  },
  titleLight: {
    fontSize: 12.5,
    lineHeight: 32,
    fontFamily:'poppinsMedium'
  },
  subtitle: {
    fontSize: 16,
    fontFamily:'poppinsMedium',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
