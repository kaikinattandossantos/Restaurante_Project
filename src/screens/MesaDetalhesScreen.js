import React from 'react';
import { View, Text } from 'react-native';

export default function MesaDetalhesScreen({ route }) {
  const { mesa } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mesa {mesa.numero}</Text>
      <Text>Garçom: {mesa.garcom}</Text>
      <Text>Status: {mesa.status}</Text>
    </View>
  );
}
