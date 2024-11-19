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
import { convertDateInDDMMYYYY, formatDate } from '~/helpers/convert_data';
import {
  ActivityIndicator,
  Button as BtnPaper,
  TextInput as Input,
  Text as TextPaper,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthRouterProps } from '~/routes/auth.routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';

const RegisterScreen = () => {
  const navigation = useNavigation<AuthRouterProps>();

  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [cpf, setCpf] = useState({ value: '', error: '' });
  const [telephone, setTelephone] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);
  const [birthDatePicker, setBirthDatePicker] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [numSections, setNumSections] = useState(0);

  const sections = [
    [
      {
        label: 'Nome',
        value: name,
        setValue: setName,
        secureTextEntry: false,
        textContentType: 'name' as 'name',
        left: <Input.Icon icon={() => <MaterialCommunityIcons name="account" size={20} />} />,
        right: null,
      },
      {
        label: 'CPF',
        value: cpf,
        setValue: setCpf,
        keyboardType: 'numeric' as KeyboardTypeOptions,
        secureTextEntry: false,
        textContentType: 'none' as 'none',
        left: (
          <Input.Icon
            icon={() => <MaterialCommunityIcons name="card-account-details" size={20} />}
          />
        ),
      },
      {
        label: 'Telefone',
        value: telephone,
        setValue: setTelephone,
        keyboardType: 'phone-pad' as KeyboardTypeOptions,
        secureTextEntry: false,
        textContentType: 'telephoneNumber' as 'telephoneNumber',
        left: <Input.Icon icon={() => <MaterialCommunityIcons name="phone" size={20} />} />,
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
        left: <Input.Icon icon={() => <MaterialCommunityIcons name="email" size={20} />} />,
      },
      {
        label: 'Senha',
        value: password,
        setValue: setPassword,
        secureTextEntry: !showPassword,
        textContentType: 'password' as 'password',
        left: <Input.Icon icon={() => <MaterialCommunityIcons name="lock" size={20} />} />,
        right: (
          <Input.Icon
            onPress={() => setShowPassword(!showPassword)}
            icon={() => (
              <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={21} />
            )}
          />
        ),
      },
      {
        label: 'Confirmar Senha',
        value: confirmPassword,
        setValue: setConfirmPassword,
        secureTextEntry: !showConfirmPassword,
        textContentType: 'password' as 'password',
        left: <Input.Icon icon={() => <MaterialCommunityIcons name="lock" size={20} />} />,
        right: (
          <Input.Icon
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            icon={() => (
              <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={21} />
            )}
          />
        ),
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
        zip_code: '00000-000',
      });
      Alert.alert('Seja bem-vindo!', `Agora você está no e-aluguel! Aproveite!`);
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
            <TextPaper className="mb-2" variant="labelLarge">
              Selecione a data de nascimento:
            </TextPaper>
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
            left={input.left}
            right={input?.right}
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
