import React, { Component, useState } from 'react';
import {
  Appbar,
  Button,
  Card,
  Icon,
  IconButton,
  List,
  TextInput,
  Text as TextNative,
} from 'react-native-paper';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomPicker from '~/components/CustomPicker';
import { statesOfBrazil } from '~/dtos/PropertiesDTO';
import { TextInputMask } from 'react-native-masked-text';
import { theme } from '~/core/theme';
import { convertStringDateInDDMMYYYY, convertStringDateToYYYYMMDD } from '~/helpers/convert_data';

const AccountSettingsScreen: React.FC = () => {
  const { user, signOut, updateUserData } = useAuth();
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [address, setAddress] = useState({
    street: user.street || '',
    neighborhood: user.neighborhood || '',
    number: user.number || '',
    zip_code: user.zip_code || '',
    city: user.city || '',
    state: user.state || '',
  });
  const [personalData, setPersonalData] = useState({
    name: user.name || '',
    telephone: user.telephone || '',
    monthly_income: user.monthly_income ? user.monthly_income.toString() : '',
    cpf: user.cpf || '',
    birth_date: user.birth_date || '',
    email: user.email || '',
    profession: user.profession || '',
    marital_status: user.marital_status || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ uri: string; base64: string } | null>(null);
  const navigation = useNavigation();

  const deleteAccount = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
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
          },
        },
      ],
      { cancelable: true }
    );
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
        updateUserData();
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

  const updateAddress = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch('/users/me', address);
      if (response.status === 200) {
        Alert.alert('Endereço atualizado', 'Seu endereço foi atualizado com sucesso.');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o endereço.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o endereço.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria de fotos.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setSelectedImage({
          uri: pickerResult.assets[0].uri,
          base64: pickerResult.assets[0].base64!,
        });
        await updateProfilePhoto(pickerResult.assets[0].uri);
        updateUserData();
      }
    }
  };

  const updatePersonalData = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch('/users/me', {
        ...personalData,
        cpf: personalData.cpf.replace(/\D/g, ''),
        telephone: personalData.telephone.replace(/\D/g, ''),
        monthly_income: parseFloat(personalData.monthly_income.replace(/\D/g, '')),
        birth_date: personalData.birth_date.split('/').reverse().join('-'),
      });
      if (response.status === 200) {
        Alert.alert(
          'Dados pessoais atualizados',
          'Seus dados pessoais foram atualizados com sucesso.'
        );
        await updateUserData();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar os dados pessoais.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados pessoais.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfilePhoto = async (uri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await api.patch('/users/me/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        Alert.alert('Foto atualizada', 'Sua foto de perfil foi atualizada com sucesso.');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
      console.error(error);
    }
  };

  const renderHeader = () => {
    const avatar = user.photo ?? 'https://i.imgur.com/xCvzudW.png';
    const avatarBackground = 'https://i.imgur.com/rXVcgTZ.jpg';
    const name = user.name;

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{ uri: avatarBackground }}>
          <Appbar.Header className="flex-1 bg-transparent p-0 mt-0 pt-0" statusBarHeight={2}>
            <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
            <Appbar.Content title />
          </Appbar.Header>
          <View style={styles.headerColumn}>
            <View style={{ position: 'relative' }}>
              <Image style={styles.userImage} source={{ uri: avatar }} />
              <IconButton
                mode="contained"
                icon="pencil"
                size={24}
                style={{ position: 'absolute', bottom: 0, right: 0 }}
                onPress={pickImage}
              />
            </View>
            <Text style={styles.userNameText}>{name}</Text>
            {user.city && user.state && (
              <View style={styles.userAddressRow}>
                <View>
                  <MaterialCommunityIcons name="map-marker" size={30} color="white" />
                </View>
                <View style={styles.userCityRow}>
                  <Text style={styles.userCityText}>
                    {user.city}, {user.state}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card style={styles.cardContainer}>{renderHeader()}</Card>
          <List.AccordionGroup>
            <List.Accordion
              id="2"
              title="Alterar Senha"
              titleStyle={{ fontWeight: 'bold' }}
              left={(props) => <List.Icon {...props} icon="lock" color={theme.colors.primary} />}>
              <View style={styles.emailContainer}>
                <TextInput
                  label="Nova Senha"
                  value={newPassword.value}
                  onChangeText={(text) => setNewPassword({ value: text, error: '' })}
                  error={!!newPassword.error}
                  secureTextEntry
                  style={styles.input}
                />
                <TextInput
                  label="Confirmar Nova Senha"
                  value={confirmPassword.value}
                  onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
                  error={!!confirmPassword.error}
                  secureTextEntry
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  onPress={changePassword}
                  loading={isLoading}
                  style={styles.button}>
                  Alterar Senha
                </Button>
              </View>
            </List.Accordion>
            <List.Accordion
              id="1"
              title="Alterar Endereço"
              titleStyle={{ fontWeight: 'bold' }}
              left={(props) => (
                <List.Icon {...props} icon="home-map-marker" color={theme.colors.primary} />
              )}>
              <View style={styles.telContainer}>
                <TextInput
                  label="Rua"
                  value={address.street}
                  onChangeText={(text) => setAddress({ ...address, street: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Bairro"
                  value={address.neighborhood}
                  onChangeText={(text) => setAddress({ ...address, neighborhood: text })}
                  style={styles.input}
                />
                <TextInputMask
                  type="only-numbers"
                  value={address.number}
                  onChangeText={(text) => setAddress({ ...address, number: text })}
                  style={styles.input}
                  keyboardType="numeric"
                  customTextInput={TextInput}
                  customTextInputProps={{
                    label: 'Número',
                  }}
                />
                <TextInputMask
                  type="zip-code"
                  value={address.zip_code}
                  onChangeText={(text) => setAddress({ ...address, zip_code: text })}
                  style={styles.input}
                  keyboardType="numeric"
                  customTextInput={TextInput}
                  customTextInputProps={{
                    label: 'CEP',
                  }}
                />
                <TextInput
                  label="Cidade"
                  value={address.city}
                  onChangeText={(text) => setAddress({ ...address, city: text })}
                  style={styles.input}
                />
                <CustomPicker
                  data={statesOfBrazil}
                  selectedValue={address.state}
                  onValueChange={(value) => setAddress({ ...address, state: value.value })}
                  placeholder="Selecione um estado"
                  leftIcon="map-marker"
                  title="Estado"
                />
                <Button
                  mode="contained"
                  onPress={updateAddress}
                  loading={isLoading}
                  style={styles.button}>
                  Atualizar Endereço
                </Button>
              </View>
            </List.Accordion>
            <List.Accordion
              id="3"
              title="Excluir Conta"
              titleStyle={{ fontWeight: 'bold' }}
              left={(props) => (
                <List.Icon {...props} icon="account-remove" color={theme.colors.primary} />
              )}>
              <View style={styles.telContainer}>
                <TextNative variant="titleMedium">Deseja excluir sua conta?</TextNative>
                <Button
                  mode="contained"
                  onPress={deleteAccount}
                  loading={isLoading}
                  buttonColor={theme.colors.error}
                  style={styles.button}>
                  Excluir Conta
                </Button>
              </View>
            </List.Accordion>
            <List.Accordion
              id="4"
              title="Alterar dados pessoais"
              titleStyle={{ fontWeight: 'bold' }}
              left={(props) => (
                <List.Icon {...props} icon="account-edit" color={theme.colors.primary} />
              )}>
              <View style={styles.telContainer}>
                <TextInput
                  label="Nome"
                  value={personalData.name}
                  onChangeText={(text) => setPersonalData({ ...personalData, name: text })}
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                      )}
                    />
                  }
                />
                <TextInputMask
                  type="cpf"
                  value={personalData.cpf}
                  onChangeText={(text) =>
                    setPersonalData({ ...personalData, cpf: text.replace(/\D/g, '') })
                  }
                  style={styles.input}
                  customTextInput={TextInput}
                  customTextInputProps={{
                    left: (
                      <TextInput.Icon
                        icon={({ size, color }) => (
                          <MaterialCommunityIcons
                            name="card-account-details"
                            size={size}
                            color={color}
                          />
                        )}
                      />
                    ),
                    label: 'CPF',
                  }}
                />
                <TextInputMask
                  type="cel-phone"
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                  value={personalData.telephone}
                  onChangeText={(text) =>
                    setPersonalData({ ...personalData, telephone: text.replace(/\D/g, '') })
                  }
                  style={styles.input}
                  customTextInput={TextInput}
                  customTextInputProps={{
                    left: (
                      <TextInput.Icon
                        icon={({ size, color }) => (
                          <MaterialCommunityIcons name="phone" size={size} color={color} />
                        )}
                      />
                    ),
                    label: 'Telefone',
                  }}
                />
                <TextInput
                  label="Email"
                  value={personalData.email}
                  onChangeText={(text) => setPersonalData({ ...personalData, email: text })}
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons name="email" size={size} color={color} />
                      )}
                    />
                  }
                />
                <TextInputMask
                  type="datetime"
                  options={{
                    format: 'DD/MM/YYYY',
                  }}
                  value={convertStringDateInDDMMYYYY(personalData.birth_date)}
                  onChangeText={(text) =>
                    setPersonalData({
                      ...personalData,
                      birth_date: text,
                    })
                  }
                  style={styles.input}
                  customTextInput={TextInput}
                  customTextInputProps={{
                    left: (
                      <TextInput.Icon
                        icon={({ size, color }) => (
                          <MaterialCommunityIcons name="calendar" size={size} color={color} />
                        )}
                      />
                    ),
                    label: 'Data de Nascimento',
                  }}
                />
                <TextInputMask
                  type="money"
                  value={personalData.monthly_income}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');
                    setPersonalData({ ...personalData, monthly_income: numericValue });
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                  customTextInput={TextInput}
                  customTextInputProps={{
                    left: (
                      <TextInput.Icon
                        icon={({ size, color }) => (
                          <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
                        )}
                      />
                    ),
                    label: (
                      <Text>
                        Renda Mensal <Text style={{ color: 'red' }}>*</Text>
                      </Text>
                    ),
                  }}
                />
                <TextInput
                  label={
                    <Text>
                      Profissão <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                  }
                  value={personalData.profession || ''}
                  onChangeText={(text) => setPersonalData({ ...personalData, profession: text })}
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons name="briefcase" size={size} color={color} />
                      )}
                    />
                  }
                />
                <TextInput
                  label={
                    <Text>
                      Estado Civil <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                  }
                  value={personalData.marital_status || ''}
                  onChangeText={(text) =>
                    setPersonalData({ ...personalData, marital_status: text })
                  }
                  style={styles.input}
                  left={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons name="account-heart" size={size} color={color} />
                      )}
                    />
                  }
                />
                <Button
                  mode="contained"
                  onPress={updatePersonalData}
                  loading={isLoading}
                  style={styles.button}>
                  Atualizar Dados Pessoais
                </Button>
              </View>
            </List.Accordion>
          </List.AccordionGroup>
          <View style={{ backgroundColor: theme.colors.surface }}>
            <List.Item
              onPress={() => signOut()}
              titleStyle={{ fontWeight: 'bold' }}
              className="mt-2"
              title="Sair"
              left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.primary} />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
    padding: 16,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
    padding: 16,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: theme.colors.primary,
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
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

export default AccountSettingsScreen;
