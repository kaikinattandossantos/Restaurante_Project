import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './src/pages/Home';
import MesaDetalhesScreen from './src/pages/MesaDetalhes';
import BuscaProduto from './src/pages/BuscaProduto';
import PedidosCliente from './src/pages/PedidosCliente';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#8B0000' }, headerTintColor: '#fff' }}>
          
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Mesas" }} />
          <Stack.Screen name="MesaDetalhes" component={MesaDetalhesScreen} options={{ title: "Detalhes da Mesa" }} />
          <Stack.Screen name="PedidosCliente" component={PedidosCliente} options={{ title: "Pedidos do Cliente" }} />
          <Stack.Screen name="BuscaProduto" component={BuscaProduto} options={{ title: "Buscar Produto" }} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
