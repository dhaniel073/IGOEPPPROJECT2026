import { Colors } from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputProps {
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  secure?: boolean;
  onUpdateValue?: (val: string) => void;
  value?: string;
  isInvalid?: boolean;
  style?: object;
  maxLength?: number;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  onFocus?: () => void;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  keyboardType = 'default',
  secure,
  onUpdateValue,
  value,
  isInvalid,
  style,
  maxLength,
  placeholder,
  multiline,
  autoCapitalize = 'none',
  editable = true,
  onFocus,
  onPress,
  leftIcon,
  rightIcon,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [touched, setTouched] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  // Determine background & border color based on validity
  const getDynamicStyle = () => {
    if (!touched) {
      return { backgroundColor: Colors.offwhite1, borderColor: 'transparent' };
    }
    if (isInvalid) {
      return {
        backgroundColor: '#FFEAEA',
        borderColor: '#FF4D4D',
      };
    }
    return {
      backgroundColor: '#E8F8EF',
      borderColor: '#00C851',
    };
  };

  return (
    <View style={[styles.inputContainer, getDynamicStyle()]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <TextInput
          style={[
            styles.input,
            multiline && styles.textArea,
            style,
          ]}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          secureTextEntry={secure ? showPassword : false}
          onChangeText={(text) => {
            if (!touched) setTouched(true);
            onUpdateValue?.(text);
          }}
          placeholder={placeholder}
          placeholderTextColor="gray"
          value={value}
          maxLength={maxLength}
          editable={editable}
          multiline={multiline}
          onFocus={() => {
            setTouched(true);
            onFocus?.();
          }}
          autoCorrect={false}
          autoComplete="off"
        />
      </TouchableOpacity>

      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}

      {secure && (
        <TouchableOpacity style={styles.passwordToggle} onPress={togglePassword}>
          {showPassword ? (
            <Entypo name="eye" size={22} color={Colors.gray9} />
          ) : (
            <Entypo name="eye-with-line" size={22} color={Colors.gray9} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 7,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'poppinsMedium',
    color: '#000'
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  passwordToggle: {
    marginLeft: 8,
  },
});
