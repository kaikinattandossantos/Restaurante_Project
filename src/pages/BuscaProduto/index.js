import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';

export default function BuscaProduto({ route, navigation }) {
  const { onSelect } = route.params;
  const [query, setQuery] = useState("");

  const produtos = [
    { codigo: 101, nome: "Café Expresso" },
    { codigo: 102, nome: "Café com Leite" },
    { codigo: 103, nome: "Cappuccino" },
    { codigo: 201, nome: "Suco de Laranja" },
    { codigo: 202, nome: "Refrigerante Lata" },
    { codigo: 203, nome: "Refrigerante 600ml" },
    { codigo: 301, nome: "Coxinha" },
    { codigo: 302, nome: "Hambúrguer Artesanal" },
  ];

  const filtrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(query.toLowerCase()) ||
      p.codigo.toString().includes(query)
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Searchbar
        placeholder="Buscar por nome ou código..."
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 10 }}
      />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.codigo.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              onSelect(item);
              navigation.goBack();
            }}
            style={{
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ccc",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.nome}</Text>
            <Text style={{ color: "#777" }}>Código: {item.codigo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
