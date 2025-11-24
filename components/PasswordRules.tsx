import { ThemedText } from "@/components/ThemedText"; // adjust path
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

interface PasswordRulesProps {
  password: string;
}

export const PasswordRules: React.FC<PasswordRulesProps> = ({ password }) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return (
    <View style={styles.rulesContainer}>
      <RuleItem text="At least 8 characters" valid={hasMinLength} />
      <RuleItem text="At least 1 uppercase letter" valid={hasUpperCase} />
      <RuleItem text="At least 1 lowercase letter" valid={hasLowerCase} />
      <RuleItem text="At least 1 number" valid={hasNumber} />
    </View>
  );
};

const RuleItem = ({ text, valid }: { text: string; valid: boolean }) => (
  <ThemedText style={[styles.ruleText, valid ? styles.valid : styles.invalid]}>
    {`\u2022`} {text}
  </ThemedText>
);

const styles = StyleSheet.create({
  rulesContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  ruleText: {
    fontSize: 13,
    marginVertical: 2,
  },
  valid: {
    color: "green",
  },
  invalid: {
    color: Colors.gray9 || "gray",
  },
});
