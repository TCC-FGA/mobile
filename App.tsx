import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from './src/core/theme';
import AppNavigator from './src/routes';

import { AuthContextProvider } from '~/contexts/AuthContext';

const Main = () => (
  <Provider theme={theme}>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <AuthContextProvider>
        <AppNavigator />
      </AuthContextProvider>
    </SafeAreaProvider>
  </Provider>
);

export default Main;
