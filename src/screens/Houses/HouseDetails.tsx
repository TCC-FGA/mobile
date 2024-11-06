import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Image, Text, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { createHouse, getHouseById, updateHouse } from '~/api/houses';
import { HouseDTO } from '~/dtos/HouseDTO';
import { PropertiesDTO } from '~/dtos/PropertiesDTO';
import { getProperties } from '~/api/properties';
import { Picker } from '@react-native-picker/picker';
import { theme } from '~/core/theme';
import { getUpdatedFields } from '~/core/utils';
import { TextInputMask } from 'react-native-masked-text';

type RouteParamsProps = {
  house?: {
    id: number;
    property_id: number;
    photo: string;
    nickname: string;
    room_count: number;
    bathrooms: number;
    furnished: boolean;
    status: string;
  };
};

const HouseDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const { house } = route.params as RouteParamsProps;
  const [newHouse, setNewHouse] = useState({
    id: 0,
    property_id: 0,
    photo: null as string | null,
    nickname: '',
    room_count: 0,
    bathrooms: 0,
    furnished: false,
    status: 'vaga',
  } as HouseDTO);
  const [properties, setProperties] = useState<PropertiesDTO[]>();
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  const [selectedImage, setSelectedImage] = useState<null | { uri: string | null; base64: string }>(
    null
  );

  useEffect(() => {
    if (house?.id) {
      const fetchHouse = async () => {
        try {
          const fetchedHouse = await getHouseById(house.id);
          setNewHouse(fetchedHouse);
          setSelectedImage({ uri: fetchedHouse.photo, base64: '' });
          setSelectedProperty(fetchedHouse.property_id);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes da casa.');
        }
      };

      fetchHouse();
    }
    const fetchProperties = async () => {
      try {
        const fetchedProperties = await getProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Erro ao buscar propriedades:', error);
      }
    };
    fetchProperties();
  }, [house?.id]);

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
      base64: true,
    });

    if (!pickerResult.canceled) {
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setSelectedImage({
          uri: pickerResult.assets[0].uri,
          base64: pickerResult.assets[0].base64!,
        });
        setNewHouse({ ...newHouse, photo: pickerResult.assets[0].uri });
      }
    }
  };

  const onSaveHouse = async () => {
    if (!selectedProperty) {
      Alert.alert(
        'Você precisa vincular a casa à uma propriedade',
        'Por favor, selecione uma propriedade.'
      );
      return;
    }
    if (newHouse.nickname && newHouse.room_count && newHouse.bathrooms) {
      try {
        if (house?.id) {
          const updatedFields = getUpdatedFields(house, newHouse);

          if (selectedImage && selectedImage.uri !== house.photo) {
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
            await updateHouse(house.id, formData);
          } else {
            await updateHouse(house.id, updatedFields);
          }

          Alert.alert('Casa atualizada', 'A casa foi atualizada com sucesso.');
        } else {
          const formData = new FormData();

          formData.append('nickname', newHouse.nickname);
          formData.append('room_count', newHouse.room_count as any);
          formData.append('bathrooms', newHouse.bathrooms as any);
          formData.append('furnished', !!newHouse.furnished as any);
          formData.append('status', newHouse.status);

          if (selectedImage) {
            formData.append('photo', {
              uri: selectedImage.uri,
              name: 'photo.jpg',
              type: 'image/jpeg',
            } as any);
          }

          await createHouse(selectedProperty, formData);
          Alert.alert('Casa salva', 'A casa foi salva com sucesso.');
        }
        navigation.goBack();
      } catch (error) {
        console.error('Erro ao salvar casa:', error);
        Alert.alert('Erro', 'Não foi possível salvar a casa.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-2">
          <Text style={{ color: theme.colors.primary }} className="mb-2 text-sm">
            {selectedProperty ? 'Propriedade vinculada:' : 'Escolha a propriedade:'}
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
              name="home-city"
              size={24}
              color={theme.colors.primary}
              style={{ marginRight: 8 }}
            />
            <Picker
              selectedValue={selectedProperty}
              onValueChange={(itemValue) => setSelectedProperty(itemValue)}
              style={{
                flex: 1,
                color: theme.colors.onSurface,
              }}>
              <Picker.Item label="Vincular propriedade" value="" />
              {properties?.map((property) => (
                <Picker.Item
                  key={property.id}
                  label={property.nickname || property.zip_code || 'Propriedade sem nome'}
                  value={property.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        <TextInput
          label={
            selectedProperty ? (
              'Apelido da casa'
            ) : (
              <Text>
                Apelido da casa <Text style={{ color: 'red' }}>*</Text>
              </Text>
            )
          }
          value={newHouse.nickname}
          style={styles.input}
          onChangeText={(text) => setNewHouse({ ...newHouse, nickname: text })}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              )}
            />
          }
        />
        <TextInputMask
          type="only-numbers"
          value={newHouse.room_count?.toString() || ''}
          onChangeText={(text) =>
            setNewHouse({ ...newHouse, room_count: Number(text.replace(/[^0-9]/g, '')) })
          }
          style={styles.input}
          keyboardType="numeric"
          customTextInput={TextInput}
          customTextInputProps={{
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="bed" size={size} color={color} />
                )}
              />
            ),
            label: (
              <Text>
                Quantidade de quartos <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
          }}
        />
        <TextInputMask
          type="only-numbers"
          value={newHouse.bathrooms?.toString() || ''}
          onChangeText={(text) =>
            setNewHouse({ ...newHouse, bathrooms: Number(text.replace(/[^0-9]/g, '')) })
          }
          style={styles.input}
          keyboardType="numeric"
          customTextInput={TextInput}
          customTextInputProps={{
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="shower" size={size} color={color} />
                )}
              />
            ),
            label: (
              <Text>
                Quantidade de banheiros <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
          }}
        />
        <View style={styles.radioButtonContainer}>
          <Text style={styles.radioButtonLabel}>Mobiliada:</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewHouse({ ...newHouse, furnished: value === 'true' })}
            value={newHouse.furnished ? 'true' : 'false'}>
            <View style={styles.radioButtonItem}>
              <RadioButton value="true" />
              <Text>Sim</Text>
            </View>
            <View style={styles.radioButtonItem}>
              <RadioButton value="false" />
              <Text>Não</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View style={styles.radioButtonContainer}>
          <Text style={styles.radioButtonLabel}>Status casa:</Text>
          <RadioButton.Group
            onValueChange={(value) =>
              setNewHouse({ ...newHouse, status: value as 'alugada' | 'reforma' | 'vaga' })
            }
            value={newHouse.status}>
            <View style={styles.radioButtonItem}>
              <RadioButton value="vaga" />
              <Text>Vaga</Text>
            </View>
            <View style={styles.radioButtonItem}>
              <RadioButton value="alugada" />
              <Text>Alugada</Text>
            </View>
            <View style={styles.radioButtonItem}>
              <RadioButton value="reforma" />
              <Text>Em Reforma</Text>
            </View>
          </RadioButton.Group>
        </View>
        <Button mode="outlined" onPress={pickImage} icon="camera">
          {selectedImage && selectedImage.uri ? 'Alterar imagem' : 'Selecionar imagem'}
        </Button>

        {selectedImage?.uri && (
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
          marginTop: 10,
          padding: 10,
        }}>
        <Button mode="contained" onPress={onSaveHouse} contentStyle={{ paddingHorizontal: 16 }}>
          {house ? 'Salvar Alterações' : 'Criar nova casa'}
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
  input: {
    marginBottom: 10,
  },
  radioButtonContainer: {
    marginBottom: 10,
  },
  radioButtonLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
});

export default memo(HouseDetails);
