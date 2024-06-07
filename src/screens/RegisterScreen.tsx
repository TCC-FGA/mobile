import axios from 'axios';
import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import BackButton from '../components/BackButton';
import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator, nameValidator } from '../core/utils';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [cpf, setCpf] = useState({ value: '', error: '' });
  const [telephone, setTelephone] = useState({ value: '', error: '' });
  const [birth_date, setBirthDate] = useState({ value: '', error: '' });
  const [pix_key, setPixKey] = useState({ value: '', error: '' });
  const [monthly_income, setMonthlyIncome] = useState({ value: '', error: '' });

  const { signIn } = useAuth();

  const _onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    try {
      const response = await api.post('/auth/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        telephone: '619247915',
        monthly_income: 0,
        cpf: '07484238080',
        birth_date: '2024-06-05',
        pix_key: '07484238080',
      });
      console.log(response.data);
      await signIn(email.value, password.value);

      if (response.status !== 201) {
        setEmail({ ...email, error: 'Erro ao registrar' });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.detail);
        setEmail({ ...email, error: error.response?.data.detail });
      }
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      <Logo />

      <Header>Criar Conta</Header>

      <TextInput
        label="Nome"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label="CPF"
        returnKeyType="next"
        value={cpf.value}
        onChangeText={(text) => setCpf({ value: text, error: '' })}
        error={!!cpf.error}
        errorText={cpf.error}
      />

      <TextInput
        label="Telefone"
        returnKeyType="next"
        value={telephone.value}
        onChangeText={(text) => setTelephone({ value: text, error: '' })}
        error={!!telephone.error}
        errorText={telephone.error}
      />

      <TextInput
        label="Data de Nascimento"
        returnKeyType="next"
        value={birth_date.value}
        onChangeText={(text) => setBirthDate({ value: text, error: '' })}
        error={!!birth_date.error}
        errorText={birth_date.error}
      />

      <TextInput
        label="Chave PIX"
        returnKeyType="next"
        value={pix_key.value}
        onChangeText={(text) => setPixKey({ value: text, error: '' })}
        error={!!pix_key.error}
        errorText={pix_key.error}
      />

      <TextInput
        label="Renda Mensal"
        returnKeyType="next"
        value={monthly_income.value}
        onChangeText={(text) => setMonthlyIncome({ value: text, error: '' })}
        error={!!monthly_income.error}
        errorText={monthly_income.error}
      />

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Senha"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        Registrar
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(RegisterScreen);
