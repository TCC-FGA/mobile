import React, { memo, useState } from 'react';
import { StyleSheet, Alert, View, SafeAreaView } from 'react-native';
import { Avatar, Button, TextInput, Text, IconButton, Title } from 'react-native-paper';

import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Navigation } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  navigation: Navigation;
};

const AccountSettingsScreen = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);

  const deleteAccount = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.value.length < 6) {
      setNewPassword({ ...newPassword, error: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword.value !== confirmPassword.value) {
      setConfirmPassword({ ...confirmPassword, error: 'As senhas não coincidem.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/users/reset-password', {
        newPassword: newPassword.value,
      });
      if (response.status === 204) {
        Alert.alert('Senha alterada', 'Sua senha foi alterada com sucesso.');
        setNewPassword({ value: '', error: '' });
        setConfirmPassword({ value: '', error: '' });
      } else {
        Alert.alert('Erro', 'Não foi possível alterar a senha.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar a senha.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoutContainer}>
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="logout" size={size} color={color} />
            )}
            size={24}
            onPress={signOut}
            style={styles.logoutButton}
          />
          <Text style={styles.logoutText}>Sair</Text>
        </View>
        <Avatar.Image
          size={64}
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.body}>
        <Title style={styles.title}>Olá, {user?.name || 'Usuário'}!</Title>
        <Text style={styles.infoText}>Deseja alterar sua senha?</Text>

        <TextInput
          label="Nova Senha"
          value={newPassword.value}
          onChangeText={(text) => setNewPassword({ value: text, error: '' })}
          secureTextEntry
          error={!!newPassword.error}
          style={styles.input}
        />
        {newPassword.error ? <Text style={styles.errorText}>{newPassword.error}</Text> : null}

        <TextInput
          label="Confirme a Nova Senha"
          value={confirmPassword.value}
          onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
          secureTextEntry
          error={!!confirmPassword.error}
          style={styles.input}
        />
        {confirmPassword.error ? (
          <Text style={styles.errorText}>{confirmPassword.error}</Text>
        ) : null}

        <Button mode="contained" onPress={changePassword} style={styles.button} loading={isLoading}>
          Alterar Senha
        </Button>

        <Button
          mode="outlined"
          onPress={deleteAccount}
          style={styles.deleteButton}
          loading={isLoading}>
          Excluir Conta
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginRight: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    marginLeft: 16,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    marginTop: 100,
  },
  errorText: {
    color: '#b00020',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default memo(AccountSettingsScreen);
