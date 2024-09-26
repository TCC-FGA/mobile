import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { WelcomeScreen, LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens';

const Stack = createStackNavigator();

function AuthRoutes() {
  return (
    <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthRoutes;
