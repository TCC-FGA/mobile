import React, { memo, useState } from 'react';
import { Text, StyleSheet, Alert, View } from 'react-native';

import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import Paragraph from '../components/Paragraph';
import TextInput from '../components/TextInput';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });

  const deleteAccount = async () => {
    try {
      const response = await api.delete('/users/me');
      if (response.status === 204) {
        Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
        signOut();
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a conta.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a conta.');
      console.error(error);
    }
  };

  const changePassword = async () => {
    if (newPassword.value.length < 6) {
      setNewPassword({ ...newPassword, error: 'Senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    try {
      const response = await api.post('/users/reset-password', {
        newPassword: newPassword.value,
      });
      if (response.status === 204) {
        Alert.alert('Senha alterada', 'Sua senha foi alterada com sucesso.');
        setNewPassword({ value: '', error: '' });
      } else {
        Alert.alert('Erro', 'Não foi possível alterar a senha.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar a senha.');
      console.error(error);
    }
  };

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
      <Button mode="outlined" onPress={signOut} style={{ marginTop: 20 }}>
        Sair
      </Button>
      <Button mode="outlined" onPress={deleteAccount} style={{ marginTop: 20 }}>
        Excluir Conta
      </Button>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          label="Nova Senha"
          returnKeyType="done"
          value={newPassword.value}
          onChangeText={(text) => setNewPassword({ value: text, error: '' })}
          error={!!newPassword.error}
          errorText={newPassword.error}
          secureTextEntry
        />
        <Button mode="contained" onPress={changePassword}>
          Alterar Senha
        </Button>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
  label: {
    color: '#000',
    marginBottom: 8,
    fontSize: 16,
  },
});

export default memo(Dashboard);
