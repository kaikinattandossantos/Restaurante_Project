import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import SearchBar from '../components/SearchBar';
import mockData from '../data/mockData';

export default function BuscaScreen() {
  const [query, setQuery] = useState('');

  const resultados = mockData.produtos.filter(p =>
    p.nome.toLowerCase().includes(query.toLowerCase()) ||
    p.codigo.toString().includes(query)
  );

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: '#fff' }}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar produto ou garçom..."
      />

      {resultados.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#888' }}>
          Nenhum resultado encontrado
        </Text>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.codigo.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
              <Text style={{ color: '#666' }}>Código: {item.codigo}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
