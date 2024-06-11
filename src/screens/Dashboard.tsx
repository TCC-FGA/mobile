import React, { memo } from 'react';
import { Text, StyleSheet } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import Paragraph from '../components/Paragraph';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();

  return (
    <Background>
      <Logo />
      <Header>Parabéns você está no E-aluguel</Header>
      <Paragraph>
        {user ? (
          <Text>
            Bem-vindo, <Text style={styles.boldText}>{user.user_id}</Text>! Seu incrível aplicativo
            de aluguel de imóveis está aqui.
          </Text>
        ) : (
          'Seu incrível aplicativo de aluguel de imóveis está aqui.'
        )}
      </Paragraph>
      <Button mode="outlined" onPress={signOut} style={{ marginTop: 70 }}>
        Sair
      </Button>
    </Background>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
});

export default memo(Dashboard);
