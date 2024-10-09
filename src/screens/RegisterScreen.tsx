import axios from 'axios';
import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardTypeOptions,
} from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import BackButton from '../components/BackButton';
import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
  confirmPasswordValidator,
  cpfValidator,
  phoneValidator,
} from '../core/utils';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { formatDate } from '~/helpers/convert_data';
import { ActivityIndicator, Button as BtnPaper } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthRouterProps } from '~/routes/auth.routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RegisterScreen = () => {
  const navigation = useNavigation<AuthRouterProps>();

  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [cpf, setCpf] = useState({ value: '', error: '' });
  const [telephone, setTelephone] = useState({ value: '', error: '' });
  const [monthly_income, setMonthlyIncome] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [birthDatePicker, setBirthDatePicker] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [numSections, setNumSections] = useState(0);

  const sections = [
    [
      {
        label: 'Nome',
        value: name,
        setValue: setName,
        secureTextEntry: false,
        textContentType: 'name' as 'name',
      },
      {
        label: 'CPF',
        value: cpf,
        setValue: setCpf,
        keyboardType: 'numeric' as KeyboardTypeOptions,
        secureTextEntry: false,
        textContentType: 'none' as 'none',
      },
      {
        label: 'Telefone',
        value: telephone,
        setValue: setTelephone,
        keyboardType: 'phone-pad' as KeyboardTypeOptions,
        secureTextEntry: false,
        textContentType: 'telephoneNumber' as 'telephoneNumber',
      },
    ],
    [
      {
        label: 'Renda Mensal',
        value: monthly_income,
        setValue: setMonthlyIncome,
        keyboardType: 'numeric' as KeyboardTypeOptions,
        secureTextEntry: false,
        textContentType: 'none' as 'none',
      },
    ],
    [
      {
        label: 'Email',
        value: email,
        setValue: setEmail,
        keyboardType: 'email-address' as KeyboardTypeOptions,
        secureTextEntry: false,
        autoCapitalize: 'none',
        textContentType: 'emailAddress' as 'emailAddress',
      },
      {
        label: 'Senha',
        value: password,
        setValue: setPassword,
        secureTextEntry: true,
        textContentType: 'password' as 'password',
      },
      {
        label: 'Confirmar Senha',
        value: confirmPassword,
        setValue: setConfirmPassword,
        secureTextEntry: true,
        textContentType: 'password' as 'password',
      },
    ],
  ];

  function handleNextSection() {
    if (!runValidators(numSections)) {
      return;
    }

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

  const runValidators = (sectionIndex: number) => {
    const currentSection = sections[sectionIndex];
    let hasError = false;

    currentSection.forEach((input) => {
      let error = '';
      switch (input.label) {
        case 'Nome':
          error = nameValidator(input.value.value);
          setName({ ...input.value, error });
          break;
        case 'Email':
          error = emailValidator(input.value.value);
          setEmail({ ...input.value, error });
          break;
        case 'Senha':
          error = passwordValidator(input.value.value);
          setPassword({ ...input.value, error });
          break;
        case 'Confirmar Senha':
          error = confirmPasswordValidator(password.value, input.value.value);
          setConfirmPassword({ ...input.value, error });
          break;
        case 'CPF':
          error = cpfValidator(input.value.value);
          setCpf({ ...input.value, error });
          break;
        case 'Telefone':
          error = phoneValidator(input.value.value);
          setTelephone({ ...input.value, error });
          break;
        case 'Renda Mensal':
          break;
        default:
          break;
      }
      if (error) {
        hasError = true;
      }
    });

    if (!birthDatePicker && sectionIndex === 1) {
      Alert.alert('Erro', 'Por favor, selecione a data de nascimento.');
      hasError = true;
    }

    return !hasError;
  };

  const _onSignUpPressed = async () => {
    if (!runValidators(numSections) || !birthDatePicker) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: name.value,
        email: email.value.toLowerCase(),
        password: password.value,
        telephone: telephone.value,
        cpf: cpf.value,
        hashed_signature: null,
        birth_date: formatDate(birthDatePicker),
        photo: '',
      });
      console.log(response.data);
      Alert.alert('Sucesso', `Usuário registrado com sucesso ->${response.data.user_id}`);
      navigation.navigate('LoginScreen');
      await signIn(email.value, password.value);

      if (response.status !== 201) {
        setEmail({ ...email, error: 'Erro ao registrar' });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.detail);
        setEmail({ ...email, error: error.response?.data.detail });
      }
    } finally {
      setLoading(false);
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && event.type === 'set') {
      setBirthDatePicker(selectedDate);
    }
  };

  const convertDateInDDMMYYYY = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleBackButton = () => {
    if (numSections > 0) {
      handleReturnSection();
    } else {
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <Background>
      <BackButton goBack={handleBackButton} />

      <Logo />

      <Header>Criar Conta</Header>

      <View style={styles.inputContainer}>
        {numSections === 1 && (
          <>
            <BtnPaper
              mode="outlined"
              onPress={showDatePickerHandler}
              icon={() => (
                <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.primary} />
              )}>
              Data de nascimento{' '}
              {birthDatePicker ? `: ${convertDateInDDMMYYYY(birthDatePicker)}` : ''}
            </BtnPaper>

            {showDatePicker && (
              <RNDateTimePicker
                value={birthDatePicker ? new Date(birthDatePicker) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                accentColor={theme.colors.primary}
                textColor={theme.colors.primary}
              />
            )}
          </>
        )}
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
            keyboardType={input.keyboardType}
            style={styles.input}
            autoCapitalize={input.label === 'Email' ? 'none' : undefined}
            textContentType={input.textContentType}
            maxLength={input.label === 'CPF' || input.label === 'Telefone' ? 11 : undefined}
            autoComplete={input.label === 'Email' ? 'email' : 'off'}
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
            <Button
              mode="contained"
              onPress={_onSignUpPressed}
              style={styles.button}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                'Registrar'
              )}
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
