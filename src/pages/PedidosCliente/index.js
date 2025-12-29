import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Text, Button, FAB, Dialog, Portal, TextInput } from 'react-native-paper';

function formatarHora(dataISO) {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function PedidosCliente({ route, navigation }) {
  // 🔥 Recebe o atendenteResponsavel
  const { cliente, atualizarCliente, atendenteResponsavel } = route.params;

  const [pedidos, setPedidos] = useState(cliente.pedidos || []);
  const [modalVisible, setModalVisible] = useState(false);

  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");
  const [qtdeProduto, setQtdeProduto] = useState("1");
  const [obsProduto, setObsProduto] = useState("");

  function calcularTotal(pedidosLista) {
    return pedidosLista.reduce((acc, item) => acc + item.preco * item.qtde, 0);
  }

  const total = calcularTotal(pedidos);

  function adicionarPedido() {
    if (!nomeProduto.trim() || !precoProduto.trim()) {
      Alert.alert("Erro", "Preencha nome e preço!");
      return;
    }

    const novoItem = {
      id: Date.now(),
      nome: nomeProduto,
      preco: parseFloat(precoProduto),
      qtde: parseInt(qtdeProduto),
      obs: obsProduto,
      horarioPedido: new Date().toISOString(),
      garcom: atendenteResponsavel // 🔥 Grava quem pediu este item
    };

    const novaLista = [...pedidos, novoItem];
    setPedidos(novaLista);

    cliente.pedidos = novaLista;
    atualizarCliente(cliente);

    setNomeProduto("");
    setPrecoProduto("");
    setQtdeProduto("1");
    setObsProduto("");
    setModalVisible(false);
  }

  function alterarQuantidade(item, delta) {
    const novaLista = pedidos.map(p => {
        if (p.id === item.id) {
            const novaQtde = p.qtde + delta;
            return novaQtde > 0 ? { ...p, qtde: novaQtde } : p;
        }
        return p;
    });
    setPedidos(novaLista);
    cliente.pedidos = novaLista;
    atualizarCliente(cliente);
  }

  function remover(item) {
    const novaLista = pedidos.filter(p => p.id !== item.id);
    setPedidos(novaLista);
    cliente.pedidos = novaLista;
    atualizarCliente(cliente);
  }

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#f5f5f5' }}>
      <Text variant="headlineMedium" style={{ fontWeight:'bold' }}>{cliente.nome}</Text>
      <Text style={{ marginBottom: 10, color: "#777" }}>
        {pedidos.length} itens pedidos
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
              marginBottom: 10,
              borderLeftWidth: 5,
              borderLeftColor: '#8B0000'
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: "bold", fontSize: 17 }}>{item.nome}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12, color: '#8B0000', fontWeight:'bold' }}>
                        {formatarHora(item.horarioPedido)}
                    </Text>
                    {/* 🔥 MOSTRA O GARÇOM DESTE ITEM */}
                    <Text style={{ fontSize: 10, color: '#555' }}>Por: {item.garcom}</Text>
                </View>
            </View>
            
            {item.obs ? <Text style={{ fontStyle: 'italic', color: '#555', fontSize: 13, marginBottom: 5 }}>Obs: {item.obs}</Text> : null}

            <Text>Unit: R$ {item.preco.toFixed(2)} | Total: R$ {(item.preco * item.qtde).toFixed(2)}</Text>

            <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center' }}>
              <Button mode="outlined" onPress={() => alterarQuantidade(item, -1)} compact>- </Button>
              <Text style={{ fontSize: 18, marginHorizontal: 15, fontWeight:'bold' }}>{item.qtde}</Text>
              <Button mode="outlined" onPress={() => alterarQuantidade(item, 1)} compact> +</Button>
              <View style={{ flex: 1 }} />
              <Button textColor="red" onPress={() => remover(item)}>Remover</Button>
            </View>
          </View>
        )}
      />

      <View style={{ padding: 15, backgroundColor: "#fff", borderRadius: 10, elevation: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: 'center' }}>
          Total da conta: R$ {total.toFixed(2)}
        </Text>
      </View>

      <FAB
        icon="plus"
        label="Novo Pedido"
        style={{ position: "absolute", bottom: 20, right: 20, backgroundColor: "#8B0000" }}
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Adicionar Item</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Nome" value={nomeProduto} onChangeText={setNomeProduto} style={{ backgroundColor: "#eee", marginBottom: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput label="Preço" keyboardType="numeric" value={precoProduto} onChangeText={setPrecoProduto} style={{ backgroundColor: "#eee", marginBottom: 10, width: '48%' }} />
                <TextInput label="Qtde" keyboardType="numeric" value={qtdeProduto} onChangeText={setQtdeProduto} style={{ backgroundColor: "#eee", marginBottom: 10, width: '48%' }} />
            </View>
            <TextInput label="Obs (Ex: Sem gelo)" value={obsProduto} onChangeText={setObsProduto} style={{ backgroundColor: "#eee" }} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
            <Button onPress={adicionarPedido}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}