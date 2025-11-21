import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, FAB, Dialog, Portal, Button, TextInput } from 'react-native-paper';

export default function Home({ navigation }) {

  const [mesas, setMesas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [numeroMesa, setNumeroMesa] = useState("");
  const [atendente, setAtendente] = useState("");

  useEffect(() => {
    setMesas([
      {
        id: 1,
        numero: "007",
        atendente: "KAUE",
        status: "aberta",
        clientes: []
      }
    ]);
  }, []);

  function adicionarMesa() {
    const nova = {
      id: Date.now(),
      numero: numeroMesa,
      atendente: atendente,
      status: "aberta",
      clientes: []
    };

    setMesas([...mesas, nova]);
    setNumeroMesa("");
    setAtendente("");
    setModalVisible(false);
  }

  function corMesa(mesa) {
    if (mesa.status === "conta") return "#e6b800";  // amarelo
    if (mesa.status === "fechada") return "green";  // verde
    return "#8B0000";                               // vermelho
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>

      <FlatList
        data={mesas}
        keyExtractor={(m) => m.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MesaDetalhes", {
                mesa: item,
                atualizarMesa: (mesaAtualizada) => {
                  const lista = mesas.map(m =>
                    m.id === mesaAtualizada.id ? mesaAtualizada : m
                  );
                  setMesas(lista);
                }
              })
            }
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: corMesa(item),
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12
              }}
            >
              <Text style={{ fontSize: 22, color: "#fff", fontWeight: "bold" }}>
                {item.numero}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.atendente}</Text>
              <Text style={{ color: "#666" }}>Status: {item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 20, right: 20, backgroundColor: "#8B0000" }}
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Nova Mesa</Dialog.Title>

          <Dialog.Content>
            <TextInput
              placeholder="Número da mesa"
              value={numeroMesa}
              onChangeText={setNumeroMesa}
              style={{ backgroundColor: "#eee", marginBottom: 10 }}
            />
            <TextInput
              placeholder="Atendente"
              value={atendente}
              onChangeText={setAtendente}
              style={{ backgroundColor: "#eee" }}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
            <Button onPress={adicionarMesa}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
}
