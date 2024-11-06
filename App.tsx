import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/routes';
import { theme } from '~/core/theme';

import { AuthContextProvider } from '~/contexts/AuthContext';

LogBox.ignoreLogs([
  'Failed prop type: Carousel',
  'react-native-snap-carousel: It is recommended to use at least version 0.44 of React Native with the plugin',
]);

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
