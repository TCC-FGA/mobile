import React, { memo } from 'react';
import Logo from '../components/Logo';
import { Navigation } from '../types';
import Slider from '~/components/Slider/Slider';
import { Dimensions, SafeAreaView, View } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';

type Props = {
  navigation: Navigation;
};

const WelcomeScreen = ({ navigation }: Props) => (
  <SafeAreaView>
    <View className="items-center my-8">
      <Logo />
    </View>
    <View>
      <Slider />

      <View className="flex-row justify-end">
        <Button
          onPress={() => navigation.navigate('LoginScreen')}
          contentStyle={{ flexDirection: 'row-reverse' }}
          icon={() => (
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.primary} />
          )}>
          Pular
        </Button>
      </View>
    </View>
  </SafeAreaView>
);

export default memo(WelcomeScreen);
