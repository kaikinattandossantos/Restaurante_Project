import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { Text, FAB, Dialog, Portal, Button, TextInput } from 'react-native-paper';

// Função auxiliar para formatar hora
function formatarHora(dataISO) {
  if (!dataISO) return "--:--";
  const data = new Date(dataISO);
  return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Home({ navigation }) {
  const [mesas, setMesas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Inputs
  const [numeroMesa, setNumeroMesa] = useState("");
  const [atendente, setAtendente] = useState("");
  
  // Memória do último atendente
  const [ultimoAtendente, setUltimoAtendente] = useState("");

  // Abre modal e puxa o último nome usado
  function abrirModalCriacao() {
    if (ultimoAtendente) {
        setAtendente(ultimoAtendente);
    }
    setModalVisible(true);
  }

  function adicionarMesa() {
    const nova = {
      id: Date.now(),
      numero: numeroMesa,
      atendente: atendente,
      status: "livre", // PADRÃO VERDE (Livre)
      horarioAbertura: new Date().toISOString(),
      clientes: []
    };

    setMesas([...mesas, nova]);
    
    // Salva na memória para a próxima mesa
    setUltimoAtendente(atendente);

    setNumeroMesa("");
    setModalVisible(false);
  }

  // A função corMesa não é mais necessária para o fundo, 
  // mas podemos usar para a cor do texto do status se quiser.
  function getStatusColor(status) {
    if (status === "conta") return "#e6b800";   // Amarelo
    if (status === "ocupada") return "#8B0000"; // Vermelho
    return "green";                             // Verde (Livre)
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

            <ImageBackground
              source={require('../../../assets/mesa_icon.png')} 
              style={{
                width: 70,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12
              }}
              imageStyle={{ borderRadius: 10 }} // Arredonda a imagem
            >
              <Text style={{ fontSize: 22, color: "#fff", fontWeight: "bold", textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 }}>
                {item.numero}
              </Text>
            </ImageBackground>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.atendente}</Text>
                <Text style={{ fontSize: 12, color: '#999' }}>
                  {formatarHora(item.horarioAbertura)}
                </Text>
              </View>
              {/* Usamos a cor apenas para o texto do status agora */}
              <Text style={{ color: getStatusColor(item.status), fontWeight: 'bold' }}>Status: {item.status.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 20, right: 20, backgroundColor: "#8B0000" }}
        onPress={abrirModalCriacao}
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