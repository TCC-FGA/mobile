import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

import { useAuth } from '~/hooks/useAuth';

function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user && user.user_id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}

export default AppNavigator;
