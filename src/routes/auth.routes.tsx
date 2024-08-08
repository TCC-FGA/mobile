import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { HomeScreen, LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens';

const Stack = createStackNavigator();

function AuthRoutes() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthRoutes;
