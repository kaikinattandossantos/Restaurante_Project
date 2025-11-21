import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, FAB, Dialog, Portal, TextInput } from 'react-native-paper';

export default function PedidosCliente({ route, navigation }) {
  const { cliente, atualizarCliente } = route.params;

  const [pedidos, setPedidos] = useState(cliente.pedidos || []);
  const [modalVisible, setModalVisible] = useState(false);

  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");
  const [qtdeProduto, setQtdeProduto] = useState("1");

  // 🔥 total do cliente
  function calcularTotal(pedidosLista) {
    return pedidosLista.reduce(
      (acc, item) => acc + item.preco * item.qtde,
      0
    );
  }

  const total = calcularTotal(pedidos);

  // 🔥 adicionar novo pedido
  function adicionarPedido() {
    if (!nomeProduto.trim() || !precoProduto.trim()) {
      Alert.alert("Erro", "Preencha nome e preço!");
      return;
    }

    const novoItem = {
      id: Date.now(),
      nome: nomeProduto,
      preco: parseFloat(precoProduto),
      qtde: parseInt(qtdeProduto)
    };

    const novaLista = [...pedidos, novoItem];
    setPedidos(novaLista);

    cliente.pedidos = novaLista;
    atualizarCliente(cliente);

    setNomeProduto("");
    setPrecoProduto("");
    setQtdeProduto("1");
    setModalVisible(false);
  }

  // 🔥 aumentar quantidade
  function aumentar(item) {
    const novaLista = pedidos.map(p =>
      p.id === item.id ? { ...p, qtde: p.qtde + 1 } : p
    );

    setPedidos(novaLista);
    cliente.pedidos = novaLista;
    atualizarCliente(cliente);
  }

  // 🔥 diminuir quantidade
  function diminuir(item) {
    if (item.qtde === 1) return;

    const novaLista = pedidos.map(p =>
      p.id === item.id ? { ...p, qtde: p.qtde - 1 } : p
    );

    setPedidos(novaLista);
    cliente.pedidos = novaLista;
    atualizarCliente(cliente);
  }

  // 🔥 remover item
  function remover(item) {
    const novaLista = pedidos.filter(p => p.id !== item.id);

    setPedidos(novaLista);
    cliente.pedidos = novaLista;
    atualizarCliente(cliente);
  }

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <Text variant="headlineMedium">{cliente.nome}</Text>
      <Text style={{ marginBottom: 10, color: "#777" }}>
        {pedidos.length} pedidos
      </Text>

      <FlatList
        data={pedidos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              marginBottom: 10
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              {item.nome}
            </Text>
            <Text>Preço unitário: R$ {item.preco.toFixed(2)}</Text>
            <Text>Subtotal: R$ {(item.preco * item.qtde).toFixed(2)}</Text>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Button
                mode="contained"
                onPress={() => diminuir(item)}
                style={{ marginRight: 10 }}
              >
                -
              </Button>

              <Text style={{ fontSize: 18, marginHorizontal: 10 }}>
                {item.qtde}
              </Text>

              <Button
                mode="contained"
                onPress={() => aumentar(item)}
                style={{ marginRight: 10 }}
              >
                +
              </Button>

              <Button
                mode="contained"
                buttonColor="#b00000"
                onPress={() => remover(item)}
              >
                Remover
              </Button>
            </View>
          </View>
        )}
      />

      {/* TOTAL */}
      <View
        style={{
          padding: 15,
          borderTopWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fafafa",
          marginTop: 10
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Total: R$ {total.toFixed(2)}
        </Text>
      </View>

      {/* FAB para adicionar pedido */}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#8B0000"
        }}
        onPress={() => setModalVisible(true)}
      />

      {/* Modal */}
      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Novo Pedido</Dialog.Title>

          <Dialog.Content>
            <TextInput
              placeholder="Nome do produto"
              value={nomeProduto}
              onChangeText={setNomeProduto}
              style={{ backgroundColor: "#eee", marginBottom: 10 }}
            />

            <TextInput
              placeholder="Preço"
              keyboardType="numeric"
              value={precoProduto}
              onChangeText={setPrecoProduto}
              style={{ backgroundColor: "#eee", marginBottom: 10 }}
            />

            <TextInput
              placeholder="Quantidade"
              keyboardType="numeric"
              value={qtdeProduto}
              onChangeText={setQtdeProduto}
              style={{ backgroundColor: "#eee" }}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
            <Button onPress={adicionarPedido}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
