import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { Dashboard } from '../screens';

const Stack = createStackNavigator();

function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

export default AppRoutes;
