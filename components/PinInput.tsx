import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface PinInputProps {
  length?: number;
  lightColor?: string;
  darkColor?: string;
  style?: object;
  onComplete?: (pin: string) => void;
  onSubmit?: (pin: string) => void;
  secure?: boolean;
}

export default function PinInput({
  length = 4,
  lightColor,
  darkColor,
  style,
  onComplete,
  onSubmit,
  secure,
}: PinInputProps) {
  const [pin, setPin] = useState("");
  const inputRef = useRef<TextInput | null>(null);

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const bgColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const handleChange = (text: string) => {
    if (/^\d*$/.test(text) && text.length <= length) {
      setPin(text);
      if (text.length === length) onComplete?.(text);
    }
  };

  const handleSubmit = () => {
    if (pin.length === length && onSubmit) onSubmit(pin);
  };

  return (
    <View style={{ alignItems: "center", gap: 20, width: "100%" }}>
      {/* Hidden Input */}
      <TextInput
        ref={inputRef}
        value={pin}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={[styles.hiddenInput, style]}
        autoFocus={false}
      />

      {/* PIN Boxes */}
      <Pressable style={styles.container} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={[styles.box, { borderColor: color, backgroundColor: bgColor }]}>
            <ThemedText style={[styles.text, { color }]}>
              {pin[i] ? (secure ? "●" : pin[i]) : ""}
            </ThemedText>
          </View>
        ))}
      </Pressable>

      <View style={{margin:3}}/>
      {/* Full-width Submit Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: pin.length === length ? Colors.green : "#aaa",
            width: "90%", // full width with some margin
          },
        ]}
        disabled={pin.length !== length}
        onPress={handleSubmit}
      >
        <ThemedText style={[styles.buttonText, { color: "#fff" }]}>Submit</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  hiddenInput: {
    position: "absolute",
    // opacity: 0,
    left: -9999,
    height: 0,
    width: 0,
  },
  box: {
    borderWidth: 1,
    borderRadius: 8,
    width: 55,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
