import React, { memo, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Keyboard } from 'react-native';
import Background from '../components/Background';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '~/components/Logo';
import { TextInput as Input } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fi } from 'date-fns/locale';

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const { signIn } = useAuth();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      setIsLoading(true);
      const response = await signIn(email.value, password.value);
      if (!response) {
        Alert.alert('Erro ao fazer Login', 'Senha ou e-mail incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro ao fazer Login', 'Senha ou e-mail incorretos.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>
      <SafeAreaView>
        {!isKeyboardVisible && (
          <View style={styles.containerHead}>
            <Logo isIcon size="lg" style={styles.logo} />
            <Text style={styles.headline}>Simplifique a gestão do seu imóvel.</Text>
            <Text style={styles.paragraph}>
              Faça login e descubra como é fácil administrar suas locações.
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
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
            left={<Input.Icon icon={() => <MaterialCommunityIcons name="email" size={21} />} />}
          />
          <View style={styles.forgotPassword}>
            <TextInput
              label="Senha"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: '' })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry={!showPassword}
              left={<Input.Icon icon={() => <MaterialCommunityIcons name="lock" size={21} />} />}
              right={
                <Input.Icon
                  onPress={() => setShowPassword(!showPassword)}
                  icon={() => (
                    <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={21} />
                  )}
                />
              }
            />
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={styles.label}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button mode="contained" onPress={_onLoginPressed} loading={isLoading} disabled={isLoading}>
          Fazer Login
        </Button>

        <View style={styles.contentSignUp}>
          <Text style={styles.textSignUp}>Ainda não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.link}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  containerHead: {
    marginTop: 32,
    marginBottom: 8,
  },
  logo: {
    marginBottom: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  headline: {
    color: theme.colors.onBackground,
    fontSize: 45,
    lineHeight: 52,
    fontWeight: 'medium',
    marginBottom: 16,
  },
  paragraph: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24,
    paddingRight: 24,
  },
  textSignUp: {
    color: theme.colors.onBackground,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'medium',
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
  },
  inputGroup: {
    marginVertical: 8,
  },
  contentSignUp: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.primary,
  },
});

export default memo(LoginScreen);
