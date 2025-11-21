import React from 'react';
import { Searchbar } from 'react-native-paper';

export default function SearchBar({ value, onChangeText, placeholder }) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={{ marginBottom: 10, borderRadius: 10 }}
    />
  );
}
