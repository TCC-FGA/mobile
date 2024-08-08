import axios from 'axios';
import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

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
  const [monthly_income, setMonthlyIncome] = useState({ value: '', error: '' });

  const [numSections, setNumSections] = useState(0);

  const sections = [
    [
      { label: 'Nome', value: name, setValue: setName },
      { label: 'CPF', value: cpf, setValue: setCpf },
      { label: 'Telefone', value: telephone, setValue: setTelephone },
    ],
    [
      { label: 'Data de Nascimento', value: birth_date, setValue: setBirthDate },
      { label: 'Renda Mensal', value: monthly_income, setValue: setMonthlyIncome },
    ],
    [
      { label: 'Email', value: email, setValue: setEmail },
      { label: 'Senha', value: password, setValue: setPassword, secureTextEntry: true },
    ],
  ];

  function handleNextSection() {
    if (numSections < sections.length - 1) {
      setNumSections(numSections + 1);
    }
  }

  function handleReturnSection() {
    if (numSections > 0) {
      setNumSections(numSections - 1);
    }
  }

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
        telephone: telephone.value,
        cpf: cpf.value,
        hashed_signature: null,
        birth_date: birth_date.value,
      });
      console.log(response.data);
      Alert.alert('Sucesso', `Usuário registrado com sucesso ->${response.data.user_id}`);
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

      <View style={styles.inputContainer}>
        {sections[numSections].map((input, index) => (
          <TextInput
            key={index}
            label={input.label}
            returnKeyType="next"
            value={input.value.value}
            onChangeText={(text) => input.setValue({ value: text, error: '' })}
            error={!!input.value.error}
            errorText={input.value.error}
            secureTextEntry={input.secureTextEntry}
            style={styles.input}
          />
        ))}
        <View style={styles.buttonContainer}>
          {numSections > 0 && (
            <Button mode="outlined" onPress={handleReturnSection} style={styles.button}>
              Voltar
            </Button>
          )}
          {numSections < sections.length - 1 ? (
            <Button mode="contained" onPress={handleNextSection} style={styles.button}>
              Próximo
            </Button>
          ) : (
            <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
              Registrar
            </Button>
          )}
        </View>

        {(numSections === sections.length - 1 || numSections === 0) && (
          <View style={styles.row}>
            <Text style={styles.label}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.link}>Entrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 2,
  },
  label: {
    color: theme.colors.secondary,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center',
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(RegisterScreen);
