import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import SearchBar from '../components/SearchBar';
import MesaCard from '../components/MesaCard';
import mockData from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [mesas, setMesas] = useState(mockData.mesas);

  const filtered = mesas.filter(m =>
    m.numero.toString().includes(search) ||
    m.garcom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8', padding: 10 }}>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar mesa ou garçom..." />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MesaDetalhes', { mesa: item })}>
            <MesaCard mesa={item} />
          </TouchableOpacity>
        )}
      />

      <FAB
        icon="magnify"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#1976D2'
        }}
        onPress={() => navigation.navigate('Busca')}
      />
    </View>
  );
}
