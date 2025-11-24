import { useThemeColor } from '@/hooks/useThemeColor';
import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';


export type CustomButtonProps = {
  lightColor: string;
  darkColor: string;
  onClick: () => void; // Function that will be called when the button is pressed
};


const GoBack: React.FC<CustomButtonProps & { children?: React.ReactNode }> = ({
  lightColor,
  darkColor,
  onClick,
  // children,
}) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center',  marginLeft: -5 }}
      onPress={onClick}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={{ width: 25, alignItems: 'center' }}>
        <Entypo name="chevron-left" size={25} color={color} />
      </View>
    </TouchableOpacity>

  );
};

export default GoBack;


