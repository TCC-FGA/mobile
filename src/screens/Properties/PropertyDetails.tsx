import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Image, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { api } from '~/services/api';
import { theme } from '~/core/theme';
import { Picker } from '@react-native-picker/picker';
import { statesOfBrazil } from '~/dtos/PropertiesDTO';
import axios from 'axios';
import { getUpdatedFields } from '~/core/utils';

type RouteParamsProps = {
  propertie?: {
    id: string;
    nickname: string;
    photo: string;
    iptu: number;
    street: string;
    neighborhood: string;
    number: string;
    zip_code: string;
    city: string;
    state: string;
  };
};

const PropertyDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const { propertie } = route.params as RouteParamsProps;
  const [newPropertie, setNewPropertie] = useState({
    id: '',
    nickname: '',
    photo: '',
    iptu: 0,
    street: '',
    neighborhood: '',
    number: '',
    zip_code: '',
    city: '',
    state: '',
  });

  const [selectedImage, setSelectedImage] = useState<null | { uri: string; base64: string }>(null);

  useEffect(() => {
    if (propertie) {
      setNewPropertie(propertie);
      setSelectedImage({ uri: propertie.photo, base64: '' });
    }
  }, [propertie]);

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
        setNewPropertie({ ...newPropertie, photo: pickerResult.assets[0].uri });
      }
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setNewPropertie({ ...newPropertie, photo: pickerResult.assets[0].uri });
      }
    }
  };

  const onSavePropertie = async () => {
    if (newPropertie.nickname && newPropertie.iptu && newPropertie.zip_code) {
      try {
        if (propertie) {
          const updatedFields = getUpdatedFields(propertie, newPropertie);

          if (selectedImage && selectedImage.uri !== propertie.photo) {
            const formData = new FormData();
            formData.append('photo', {
              uri: selectedImage.uri,
              name: 'photo.jpg',
              type: 'image/jpeg',
            } as any);

            for (const key in updatedFields) {
              if (key !== 'photo') {
                formData.append(key, updatedFields[key]);
              }
            }
            await api.patch(`/properties/${propertie.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          } else {
            await api.patch(`/properties/${propertie.id}`, updatedFields, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          }

          Alert.alert('Propriedade atualizada', 'A propriedade foi atualizada com sucesso.');
        } else {
          const formData = new FormData();

          formData.append('nickname', newPropertie.nickname);
          formData.append('iptu', newPropertie.iptu.toString());
          formData.append('street', newPropertie.street || '');
          formData.append('neighborhood', newPropertie.neighborhood || '');
          formData.append('number', newPropertie.number || '');
          formData.append('zip_code', newPropertie.zip_code);
          formData.append('city', newPropertie.city || '');
          formData.append('state', newPropertie.state || '');

          if (selectedImage) {
            formData.append('photo', {
              uri: selectedImage.uri,
              name: 'photo.jpg',
              type: 'image/jpeg',
            } as any);
          }

          await api.post('/properties', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          Alert.alert('Propriedade salva', 'A propriedade foi salva com sucesso.');
        }
        navigation.goBack();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          console.error(`error`, error.response?.data);
        }
      }
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          label="Apelido da propriedade"
          value={newPropertie.nickname}
          style={styles.input}
          onChangeText={(text) => setNewPropertie({ ...newPropertie, nickname: text })}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Valor IPTU"
          value={newPropertie.iptu?.toString() || ''}
          onChangeText={(text) =>
            setNewPropertie({ ...newPropertie, iptu: Number(text.replace(/[^0-9]/g, '')) })
          }
          style={styles.input}
          keyboardType="numeric"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="numeric" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Rua"
          value={newPropertie.street || ''}
          onChangeText={(text) => setNewPropertie({ ...newPropertie, street: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="road" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Bairro"
          value={newPropertie.neighborhood || ''}
          onChangeText={(text) => setNewPropertie({ ...newPropertie, neighborhood: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="map-marker" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Número"
          value={newPropertie.number || ''}
          onChangeText={(text) => setNewPropertie({ ...newPropertie, number: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="numeric" size={size} color={color} />
              )}
            />
          }
          keyboardType="numeric"
        />
        <TextInput
          label="CEP"
          value={newPropertie.zip_code || ''}
          onChangeText={(text) => setNewPropertie({ ...newPropertie, zip_code: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="mailbox" size={size} color={color} />
              )}
            />
          }
          keyboardType="numeric"
        />
        <TextInput
          label="Cidade"
          value={newPropertie.city || ''}
          onChangeText={(text) => setNewPropertie({ ...newPropertie, city: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="city" size={size} color={color} />
              )}
            />
          }
        />
        <View className="mb-4">
          <Text style={{ color: theme.colors.primary }} className="mb-2 text-sm">
            Estado:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 8,
              paddingHorizontal: 12,
              marginBottom: 4,
            }}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={theme.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Picker
              selectedValue={newPropertie.state}
              onValueChange={(itemValue) => setNewPropertie({ ...newPropertie, state: itemValue })}
              style={{
                flex: 1,
                color: theme.colors.onSurface,
              }}>
              <Picker.Item label="Selecione um estado" value="" />
              {statesOfBrazil.map((state) => (
                <Picker.Item key={state.value} label={state.label} value={state.value} />
              ))}
            </Picker>
          </View>
        </View>

        <Button mode="outlined" onPress={pickImage} icon="camera">
          {selectedImage && selectedImage.uri ? 'Alterar imagem' : 'Selecionar imagem'}
        </Button>

        {selectedImage && selectedImage.uri && (
          <>
            <Text style={{ marginTop: 10 }}>Imagem selecionada:</Text>
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          </>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          padding: 10,
        }}>
        <Button mode="contained" onPress={onSavePropertie}>
          {propertie ? 'Salvar Alterações' : 'Criar Propriedade'}
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()}>
          Cancelar
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    borderRadius: 28,
  },
  searchbar: {
    margin: 10,
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    marginLeft: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
  },
  listItem: {
    paddingVertical: 4,
  },
  accordion: {
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 10,
  },
});

export default memo(PropertyDetails);
