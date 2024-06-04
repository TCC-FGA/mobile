import React from 'react';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from './src/core/theme';
import App from './src/navigation';

const Main = () => (
  <Provider theme={theme}>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </Provider>
);

export default Main;
