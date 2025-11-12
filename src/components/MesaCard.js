import React from 'react';
import { Card, Text } from 'react-native-paper';

export default function MesaCard({ mesa }) {
  return (
    <Card style={{ marginVertical: 5, padding: 10 }}>
      <Text variant="titleMedium">Mesa {mesa.numero}</Text>
      <Text>Garçom: {mesa.garcom}</Text>
      <Text>Status: {mesa.status}</Text>
    </Card>
  );
}
