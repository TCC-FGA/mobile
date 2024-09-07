import { PropertiesDTO } from '@dtos/PropertiesDTO';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Button,
  Searchbar,
  IconButton,
  Modal,
  TextInput,
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

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    filterProperties(query);
  };

  // Função para filtrar as propriedades com base na busca
  const filterProperties = (query: string) => {
    if (query.trim() === '') {
      // Se a busca estiver vazia, restaura todas as propriedades originais
      setFilteredProperties(properties);
    } else {
      // Filtra as propriedades com base na consulta de busca
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
          <View>
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
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={require('@assets/edit.svg')}
              iconColor={theme.colors.primary}
              onPress={() => onEditPropertie(item)}
              style={styles.iconButton}
            />
            <IconButton
              icon={require('@assets/delete.svg')}
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
          const response = await api.post('/properties', newPropertie);
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
          icon={require('@assets/plus.svg')}
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
            left={<TextInput.Icon icon={require('@assets/home.svg')} />}
          />
          <TextInput
            label="Valor IPTU"
            value={newPropertie.iptu?.toString() || ''}
            onChangeText={(text) =>
              setNewPropertie({ ...newPropertie, iptu: Number(text.replace(/[^0-9]/g, '')) })
            }
            style={styles.input}
            keyboardType="numeric"
            left={<TextInput.Icon icon={require('@assets/numeric.svg')} />}
          />
          <TextInput
            label="Rua"
            value={newPropertie.street || ''}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, street: text })}
            style={styles.input}
            left={<TextInput.Icon icon={require('@assets/road.svg')} />}
          />
          <TextInput
            label="Bairro"
            value={newPropertie.neighborhood || ''}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, neighborhood: text })}
            style={styles.input}
            left={<TextInput.Icon icon={require('@assets/map-marker.svg')} />}
          />
          <TextInput
            label="Número"
            value={newPropertie.number || ''}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, number: text })}
            style={styles.input}
            left={<TextInput.Icon icon={require('@assets/numeric.svg')} />}
            keyboardType="numeric"
          />
          <TextInput
            label="CEP"
            value={newPropertie.zip_code || ''}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, zip_code: text })}
            style={styles.input}
            left={<TextInput.Icon icon={require('@assets/mailbox.svg')} />}
            keyboardType="numeric"
          />
          <TextInput
            label="Cidade"
            value={newPropertie.city || ''}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, city: text })}
            style={styles.input}
            left={<TextInput.Icon icon={require('@assets/city.svg')} />}
          />
          <TextInput
            label="Estado"
            value={newPropertie.state || ''}
            style={styles.input}
            left={<TextInput.Icon icon={require('@assets/map-marker.svg')} />}
            right={<TextInput.Icon icon={require('@assets/chevron-down.svg')} />}
            // onPress={handlePress}
            onChangeText={(text) => setNewPropertie({ ...newPropertie, state: text })}
          />
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
  searchbar: {
    margin: 10,
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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
