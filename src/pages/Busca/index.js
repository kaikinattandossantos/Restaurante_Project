import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';

export default function BuscaScreen({ route, navigation }) {
  // pega o mesaId de forma segura
  const mesaId = route?.params?.mesaId ?? null;

  const [query, setQuery] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutosMock();
  }, []);

  function carregarProdutosMock() {
    setCarregando(true);

    // simula um delay de API
    setTimeout(() => {
      const mock = [
        { codigo: 101, nome: "Café Expresso" },
        { codigo: 102, nome: "Café com Leite" },
        { codigo: 103, nome: "Cappuccino" },
        { codigo: 201, nome: "Suco de Laranja" },
        { codigo: 202, nome: "Refrigerante Lata" },
        { codigo: 203, nome: "Refrigerante 600ml" },
        { codigo: 301, nome: "Coxinha" },
        { codigo: 302, nome: "Hambúrguer Artesanal" },
        { codigo: 401, nome: "Bolo de Chocolate" },
        { codigo: 402, nome: "Torta de Limão" },
      ];

      setProdutos(mock);
      setCarregando(false);
    }, 600);
  }

  function adicionarProdutoMock(produto) {
    // proteção extra: se alguém abrir essa tela sem mesa
    if (!mesaId) {
      Alert.alert(
        "Erro",
        "Essa tela foi aberta sem a mesa. Volte e selecione uma mesa primeiro."
      );
      return;
    }

    Alert.alert(
      "Adicionado (mock)",
      `${produto.nome} seria adicionado à mesa ${mesaId}.`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(query.toLowerCase()) ||
    p.codigo.toString().includes(query)
  );

  // se mesaId não veio, mostra uma mensagem amigável
  if (!mesaId) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text variant="titleMedium" style={{ textAlign: "center", marginBottom: 8 }}>
          Tela de busca sem mesa
        </Text>
        <Text style={{ textAlign: "center", color: "#666" }}>
          Volte para a lista de mesas e abra esta tela através de uma mesa específica.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* BARRA DE PESQUISA */}
      <Searchbar
        placeholder="Buscar produto por nome ou código..."
        value={query}
        onChangeText={setQuery}
        style={{
          marginBottom: 15,
          borderRadius: 10,
        }}
      />

      {/* LOADING */}
      {carregando ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.codigo.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => adicionarProdutoMock(item)}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderColor: "#ddd",
                backgroundColor: "#fff",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.nome}</Text>
              <Text style={{ color: "#555" }}>Código: {item.codigo}</Text>
              <Text style={{ color: "#8B0000", marginTop: 4 }}>
                Toque para adicionar →
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
