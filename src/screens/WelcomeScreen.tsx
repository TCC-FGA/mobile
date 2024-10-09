import React, { memo } from 'react';
import Logo from '../components/Logo';
import { Navigation } from '../types';
import Slider from '~/components/Slider/Slider';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';

type Props = {
  navigation: Navigation;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  paddingGlobal: {
    padding: 16,
  },
});

const WelcomeScreen = ({ navigation }: Props) => (
  <SafeAreaView style={styles.container}>
    <Logo style={{ alignItems: 'center', marginVertical: 32 }} />

    <View style={styles.container}>
      <Slider />

      <View style={styles.paddingGlobal}>
        <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
          Iniciar
        </Button>
      </View>
    </View>
  </SafeAreaView>
);

export default memo(WelcomeScreen);
