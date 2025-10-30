import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const CustomDropdown = ({ label, data, value, onChange, error }:{label:any, data: any, value:any, onChange:any, error:any}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={{ marginBottom: 15 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: '#4CAF50' },
          error && { borderColor: 'red', backgroundColor: '#ffe6e6' }
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        search
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select gender' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
  },
});

export default CustomDropdown;
