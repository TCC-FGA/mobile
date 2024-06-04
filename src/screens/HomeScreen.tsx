import React, { memo } from 'react';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => (
  <Background>
    <Logo />
    <Header>Bem Vindo ao E-aluguel</Header>

    <Paragraph>O melhor aplicativo para gerenciar aluguéis</Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate('LoginScreen')}>
      Login
    </Button>
    <Button mode="outlined" onPress={() => navigation.navigate('RegisterScreen')}>
      Registrar
    </Button>
  </Background>
);

export default memo(HomeScreen);
