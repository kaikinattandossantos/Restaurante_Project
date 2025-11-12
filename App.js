import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import MesaDetalhesScreen from './src/screens/MesaDetalhesScreen';
import BuscaScreen from './src/screens/BuscaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mesas' }} />
        <Stack.Screen name="MesaDetalhes" component={MesaDetalhesScreen} options={{ title: 'Detalhes da Mesa' }} />
        <Stack.Screen name="Busca" component={BuscaScreen} options={{ title: 'Buscar' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
