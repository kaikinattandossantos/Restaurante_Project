import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Dialog, Portal, Button, TextInput } from 'react-native-paper';

function formatarHora(dataISO) {
  if (!dataISO) return "--:--";
  const data = new Date(dataISO);
  return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MesaDetalhes({ route, navigation }) {
  const { mesa, atualizarMesa } = route.params;
  const [clientes, setClientes] = useState(mesa.clientes || []);
  
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalLiberarVisible, setModalLiberarVisible] = useState(false);
  const [modalAtendenteVisible, setModalAtendenteVisible] = useState(false);
  
  const [novoCliente, setNovoCliente] = useState("");
  const [atendenteEdit, setAtendenteEdit] = useState("");

  function adicionarCliente() {
    if (!novoCliente.trim()) return;
    const novo = { id: Date.now(), nome: novoCliente, pedidos: [] };
    const novosClientes = [...clientes, novo];
    
    setClientes(novosClientes);
    mesa.clientes = novosClientes;
    mesa.status = "ocupada"; // 🔥 VIRA VERMELHA ASSIM QUE ENTRA GENTE
    atualizarMesa(mesa);
    
    setNovoCliente("");
    setModalClienteVisible(false);
  }

  function abrirModalTrocaAtendente() {
    setAtendenteEdit(mesa.atendente);
    setModalAtendenteVisible(true);
  }

  function salvarNovoAtendente() {
    if (!atendenteEdit.trim()) return;
    mesa.atendente = atendenteEdit;
    atualizarMesa(mesa);
    setModalAtendenteVisible(false);
  }

  function calcularTotalCliente(cliente) {
    return cliente.pedidos.reduce((acc, item) => acc + item.preco * item.qtde, 0);
  }

  function pedirConta() {
    mesa.status = "conta";
    atualizarMesa(mesa);
    alert("Conta solicitada!");
  }

  function confirmarLiberacaoMesa() {
    mesa.status = "livre"; // 🔥 VOLTA PARA VERDE
    mesa.clientes = [];
    mesa.horarioAbertura = new Date().toISOString(); 
    setClientes([]);
    atualizarMesa(mesa);
    setModalLiberarVisible(false);
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      
      <View style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text variant="headlineMedium">Mesa {mesa.numero}</Text>
          <Text variant="titleMedium" style={{ color: '#555' }}>
             Garçom: <Text style={{ fontWeight: 'bold' }}>{mesa.atendente}</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#777' }}>Aberta às: {formatarHora(mesa.horarioAbertura)}</Text>
        </View>
        <Button mode="outlined" icon="account-switch" compact onPress={abrirModalTrocaAtendente}>
          Trocar
        </Button>
      </View>

      <Button mode="contained" style={{ marginBottom: 15, backgroundColor: "#e6b800" }} onPress={pedirConta}>
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
                  atendenteResponsavel: mesa.atendente, // 🔥 ENVIA QUEM ESTÁ NA MESA AGORA
                  atualizarCliente: (clienteAtualizado) => {
                    const novos = clientes.map(c => c.id === clienteAtualizado.id ? clienteAtualizado : c);
                    setClientes(novos);
                    mesa.clientes = novos;
                    atualizarMesa(mesa);
                  }
                })
              }
              style={{ backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 12 }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.nome}</Text>
              <Text style={{ color: "#777" }}>{item.pedidos.length} pedidos</Text>
              <Text style={{ marginTop: 4, fontWeight: "bold" }}>Total: R$ {total.toFixed(2)}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={{textAlign:'center', color:'#999', marginTop:20}}>Mesa Livre (Verde). Adicione um cliente para ocupar.</Text>}
      />

      <FAB icon="account-plus" style={{ position: "absolute", bottom: 90, right: 20, backgroundColor: "#8B0000" }} onPress={() => setModalClienteVisible(true)} />
      
      <Button mode="contained" icon="check-circle-outline" style={{ position: "absolute", bottom: 20, left: 20, right: 20, backgroundColor: "green" }} onPress={() => setModalLiberarVisible(true)}>
        Liberar Mesa
      </Button>

      {/* MODAIS */}
      <Portal>
        <Dialog visible={modalClienteVisible} onDismiss={() => setModalClienteVisible(false)}>
          <Dialog.Title>Novo Cliente</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Nome" value={novoCliente} onChangeText={setNovoCliente} style={{ backgroundColor: "#eee" }} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalClienteVisible(false)}>Cancelar</Button>
            <Button onPress={adicionarCliente}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={modalAtendenteVisible} onDismiss={() => setModalAtendenteVisible(false)}>
          <Dialog.Title>Trocar Atendente</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Novo Nome" value={atendenteEdit} onChangeText={setAtendenteEdit} style={{ backgroundColor: "#eee" }} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalAtendenteVisible(false)}>Cancelar</Button>
            <Button onPress={salvarNovoAtendente}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={modalLiberarVisible} onDismiss={() => setModalLiberarVisible(false)}>
            <Dialog.Title>Liberar Mesa?</Dialog.Title>
            <Dialog.Actions>
                <Button onPress={() => setModalLiberarVisible(false)}>Não</Button>
                <Button onPress={confirmarLiberacaoMesa}>Sim</Button>
            </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}