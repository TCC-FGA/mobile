import { PropertiesDTO } from '@dtos/PropertiesDTO';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Button,
  Searchbar,
  IconButton,
  Modal,
  TextInput,
  Avatar,
  // List,
} from 'react-native-paper';

import { theme } from '~/core/theme';
import { api } from '~/services/api';

const PropertiesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<PropertiesDTO[]>([]);
  const [properties, setProperties] = useState<PropertiesDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | { uri: string; base64: string }>(null);
  // const [expanded, setExpanded] = useState(false);
  // const [selectedState, setSelectedState] = useState('');
  const [editingPropertie, setEditingPropertie] = useState({} as PropertiesDTO);
  const [newPropertie, setNewPropertie] = useState({
    nickname: '',
    photo: '',
    iptu: 0,
    street: '',
    neighborhood: '',
    number: '',
    zip_code: '',
    city: '',
    state: '',
  } as PropertiesDTO);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
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
        setNewPropertie({ ...newPropertie, photo: pickerResult.assets[0].uri });
      }
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setNewPropertie({ ...newPropertie, photo: pickerResult.assets[0].uri });
      }
    }
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    filterProperties(query);
  };

  const filterProperties = (query: string) => {
    if (query.trim() === '') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (house) => house.nickname && house.nickname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  };

  const renderItem = ({ item }: { item: (typeof properties)[0] }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Imagem à esquerda */}
          <Avatar.Image
            size={64}
            source={{
              uri:
                item.photo || 'https://storage.googleapis.com/e-aluguel/aluguelapp/padronizado.jpg',
            }}
            style={styles.avatar}
          />

          {/* Informações da propriedade à direita da imagem */}
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.cardTitle}>{item.nickname}</Text>
            <Text>
              {item.street}, {item.number}
            </Text>
            <Text>{item.neighborhood}</Text>
            <Text>
              {item.city} - {item.state}
            </Text>
            <Text>IPTU: {item.iptu}</Text>
            <Text>CEP: {item.zip_code}</Text>
          </View>

          {/* Botões de editar e excluir */}
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="pencil" size={size} color={color} />
              )}
              iconColor={theme.colors.primary}
              onPress={() => onEditPropertie(item)}
              style={styles.iconButton}
            />
            <IconButton
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="delete" size={size} color={color} />
              )}
              iconColor={theme.colors.error}
              onPress={() => onDeletePropertie(item.id)}
              style={styles.iconButton}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const onAddPropertie = () => {
    setIsEditing(false);
    setModalVisible(true);
  };

  const onEditPropertie = (house: PropertiesDTO) => {
    setIsEditing(true);
    setEditingPropertie(house);
    setNewPropertie({
      id: house.id,
      nickname: house.nickname,
      photo: house.photo,
      iptu: house.iptu,
      street: house.street,
      neighborhood: house.neighborhood,
      number: house.number,
      zip_code: house.zip_code,
      city: house.city,
      state: house.state,
    });
    // setSelectedState(statesOfBrazil.find((state) => state.value === house.state)?.label || '');
    setModalVisible(true);
  };

  const onSavePropertie = async () => {
    if (newPropertie.nickname && newPropertie.iptu && newPropertie.zip_code) {
      try {
        if (isEditing) {
          await api.patch(`/properties/${editingPropertie.id}`, newPropertie);
          const updatedProperties = properties.map((house) =>
            house.id === editingPropertie.id ? { ...editingPropertie, ...newPropertie } : house
          );
          setProperties(updatedProperties);
          setFilteredProperties(updatedProperties);
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
              type: 'image/jpg',
            } as any);
          }

          const response = await api.post('/properties', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setProperties([...properties, response.data]);
          setFilteredProperties([...filteredProperties, response.data]);
          Alert.alert('Propriedade salva', 'A propriedade foi salva com sucesso.');
        }
        setNewPropertie({
          id: '',
          nickname: '',
          photo: null,
          iptu: 0,
          street: '',
          neighborhood: '',
          number: '',
          zip_code: '',
          city: '',
          state: '',
        });
        setModalVisible(false);
      } catch (error) {
        console.error('Erro ao salvar propriedade:', error);
      }
    }
  };

  const onDeletePropertie = async (houseId: string) => {
    Alert.alert('Confirmar Exclusão', 'Você tem certeza que deseja excluir esta propriedade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/properties/${houseId}`);
            const updatedProperties = properties.filter((house) => house.id !== houseId);
            Alert.alert('Propriedade excluída', 'A propriedade foi excluída com sucesso.');
            setProperties(updatedProperties);
            setFilteredProperties(updatedProperties);
          } catch (error) {
            console.error('Erro ao excluir propriedade:', error);
          }
        },
      },
    ]);
  };

  const onCloseModal = () => {
    setModalVisible(false);
    setNewPropertie({
      id: '',
      nickname: '',
      photo: null,
      iptu: 0,
      street: '',
      neighborhood: '',
      number: '',
      zip_code: '',
      city: '',
      state: '',
    });
    // setSelectedState('');
  };

  // const handlePress = () => setExpanded(!expanded);

  // const handleStateSelect = (state: { label: any; value: any }) => {
  //   setSelectedState(state.label);
  //   setNewPropertie({ ...newPropertie, state: state.value });
  //   setExpanded(false);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Propriedades" color={theme.colors.primary} />
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="plus" size={size} color={color} />
          )}
          size={24}
          onPress={onAddPropertie}
          iconColor={theme.colors.primary}
        />
      </Appbar.Header>
      <Searchbar
        placeholder="Buscar propriedades"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredProperties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <Modal visible={modalVisible} onDismiss={onCloseModal} contentContainerStyle={styles.modal}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            label="Apelido da propriedade"
            value={newPropertie.nickname || ''}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, nickname: text })}
            style={styles.input}
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
          <TextInput
            label="Estado"
            value={newPropertie.state || ''}
            style={styles.input}
            left={
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="map-marker" size={size} color={color} />
                )}
              />
            }
            right={
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="chevron-down" size={size} color={color} />
                )}
              />
            }
            onChangeText={(text) => setNewPropertie({ ...newPropertie, state: text })}
          />
          <Button
            mode="outlined"
            onPress={pickImage}
            icon={() => (
              <MaterialCommunityIcons name="camera" size={20} color={theme.colors.primary} />
            )}>
            {selectedImage ? 'Alterar imagem' : 'Selecionar imagem'}
          </Button>
          {selectedImage && (
            <>
              <Text style={{ marginTop: 10 }}>Imagem selecionada:</Text>
              <Image
                source={{ uri: selectedImage.uri }}
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            </>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={onSavePropertie} style={styles.button}>
            Salvar
          </Button>
          <Button mode="text" onPress={onCloseModal} style={styles.button}>
            Cancelar
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
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

export default PropertiesScreen;
