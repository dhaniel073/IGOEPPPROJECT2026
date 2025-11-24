import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  enabled?: boolean; // 👈 new prop
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  enabled = true, // default true
  onPress,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <TouchableOpacity
      style={[
        { backgroundColor, opacity: enabled ? 1 : 0.5 }, // dim when disabled
        style,
      ]}
      onPress={enabled ? onPress : undefined} // only fire if enabled
      disabled={!enabled} // block touch interaction
      {...otherProps}
    />
  );
}
