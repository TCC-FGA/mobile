import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { HomeScreen, LoginScreen, Dashboard, RegisterScreen } from '../screens';

import { useAuth } from '~/hooks/useAuth';

const Stack = createStackNavigator();

function RootStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={user ? 'Dashboard' : 'HomeScreen'}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
