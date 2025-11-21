import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Dialog, Portal, Button, TextInput } from 'react-native-paper';

export default function MesaDetalhes({ route, navigation }) {
  const { mesa, atualizarMesa } = route.params;

  const [clientes, setClientes] = useState(mesa.clientes || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoCliente, setNovoCliente] = useState("");

  function adicionarCliente() {
    const novo = {
      id: Date.now(),
      nome: novoCliente,
      pedidos: []
    };

    const novosClientes = [...clientes, novo];
    setClientes(novosClientes);

    mesa.clientes = novosClientes;
    atualizarMesa(mesa);

    setNovoCliente("");
    setModalVisible(false);
  }

  function pedirConta() {
    mesa.status = "conta";
    atualizarMesa(mesa);
    alert("Conta solicitada!");
  }

  function resetarMesa() {
    mesa.status = "fechada";
    mesa.clientes = [];
    setClientes([]);
    atualizarMesa(mesa);
    alert("Mesa finalizada e resetada!");
  }

  // 🔥 Cálculo do total por cliente
  function calcularTotalCliente(cliente) {
    return cliente.pedidos.reduce(
      (acc, item) => acc + item.preco * item.qtde,
      0
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text variant="titleLarge">Mesa {mesa.numero}</Text>

      <Button
        mode="contained"
        style={{ marginTop: 10, marginBottom: 15, backgroundColor: "#e6b800" }}
        onPress={pedirConta}
      >
        Pedir Conta
      </Button>

      <FlatList
        data={clientes}
        keyExtractor={c => c.id.toString()}
        renderItem={({ item }) => {
          const total = calcularTotalCliente(item);

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PedidosCliente", {
                  cliente: item,
                  atualizarCliente: (clienteAtualizado) => {
                    const novos = clientes.map(c =>
                      c.id === clienteAtualizado.id ? clienteAtualizado : c
                    );

                    setClientes(novos);
                    mesa.clientes = novos;
                    atualizarMesa(mesa);
                  }
                })
              }
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 12
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {item.nome}
              </Text>

              <Text style={{ color: "#777" }}>
                {item.pedidos.length} pedidos
              </Text>

              <Text style={{ marginTop: 4, fontWeight: "bold" }}>
                Total: R$ {total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FAB
        icon="account-plus"
        style={{
          position: "absolute",
          bottom: 90,
          right: 20,
          backgroundColor: "#8B0000"
        }}
        onPress={() => setModalVisible(true)}
      />

      <Button
        mode="contained"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "green"
        }}
        onPress={resetarMesa}
      >
        Finalizar Mesa / Resetar
      </Button>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Novo Cliente</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder="Nome do cliente"
              value={novoCliente}
              onChangeText={setNovoCliente}
              style={{ backgroundColor: "#eee" }}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
            <Button onPress={adicionarCliente}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
