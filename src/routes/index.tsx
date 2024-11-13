import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';
import { useAuth } from '~/hooks/useAuth';
import { setUserEmail, tagUserCreate } from '~/services/notifications';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 107, 88)',
    background: 'rgb(251, 253, 250)',
    card: 'rgb(219, 229, 224)',
    text: 'rgb(25, 28, 27)',
    border: 'rgb(111, 121, 117)',
    notification: 'rgb(255, 59, 48)',
  },
};

function AppNavigator() {
  const { user } = useAuth();
  if (user && user.user_id) {
    tagUserCreate(user.user_id);
    setUserEmail(user.email);
  }

  return (
    <NavigationContainer theme={MyTheme}>
      {user && user.user_id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}

export default AppNavigator;
