import React from 'react';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from './src/core/theme';
import App from './src/navigation';

import { AuthContextProvider } from '~/contexts/AuthContext';

const Main = () => (
  <Provider theme={theme}>
    <SafeAreaProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </SafeAreaProvider>
  </Provider>
);

export default Main;
