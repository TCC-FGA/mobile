import { PropertiesDTO } from '@dtos/PropertiesDTO';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import { SafeAreaView, FlatList, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Searchbar,
  IconButton,
  Avatar,
  FAB,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { theme } from '~/core/theme';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { api } from '~/services/api';

const PropertiesScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<PropertiesDTO[]>([]);
  const [properties, setProperties] = useState<PropertiesDTO[]>([]);

  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);

  const openMenu = (propertyId: string) => setVisibleMenu(propertyId);
  const closeMenu = () => setVisibleMenu(null);

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

  const onAddHouse = (propertie: PropertiesDTO) => {
    navigation.navigate('HousesStack', {
      screen: 'HouseDetails',
      params: {
        house: null,
      },
    });
  };

  const renderItem = ({ item }: { item: (typeof properties)[0] }) => (
    <TouchableOpacity activeOpacity={3} onPress={() => onViewHouses(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Imagem à esquerda */}
            <Avatar.Image
              size={64}
              source={{
                uri:
                  item.photo ||
                  'https://storage.googleapis.com/e-aluguel/aluguelapp/padronizado.jpg',
              }}
              style={styles.avatar}
            />

            {/* Informações da propriedade à direita da imagem */}
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.cardTitle}>{item.nickname}</Text>
              <Text>
                {item.street}, {item.id}
              </Text>
              <Text>{item.neighborhood}</Text>
              <Text>
                {item.city} - {item.state}
              </Text>
              <Text>IPTU: {item.iptu}</Text>
              <Text>CEP: {item.zip_code}</Text>
            </View>

            {/* Ícone de três pontinhos no topo à direita */}
            <Menu
              visible={visibleMenu === item.id}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon={({ size, color }) => (
                    <MaterialCommunityIcons name="dots-vertical" size={size} color={color} />
                  )}
                  onPress={() => openMenu(item.id)}
                />
              }>
              {/* Itens do Menu */}
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onEditPropertie(item);
                }}
                title="Editar"
                leadingIcon={() => <MaterialCommunityIcons name="pencil" size={20} />}
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onDeletePropertie(item.id);
                }}
                title="Excluir"
                leadingIcon={() => <MaterialCommunityIcons name="delete" size={20} />}
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onAddHouse(item);
                }}
                title="Adicionar uma Casa"
                leadingIcon={() => <MaterialCommunityIcons name="home-plus" size={20} />}
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onViewHouses(item);
                }}
                title="Ver Casas"
                leadingIcon={() => <MaterialCommunityIcons name="home-outline" size={20} />}
              />
            </Menu>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const onAddPropertie = () => {
    navigation.navigate('PropertiesStack', {
      screen: 'PropertyDetails',
      params: {
        propertie: null,
      },
    });
  };

  const onEditPropertie = (propertie: PropertiesDTO) => {
    navigation.navigate('PropertiesStack', {
      screen: 'PropertyDetails',
      params: {
        propertie,
      },
    });
  };

  const onViewHouses = (propertie: PropertiesDTO) => {
    navigation.navigate('HousesStack', {
      screen: 'HousesScreen',
      params: {
        propertyId: parseInt(propertie.id, 10),
      },
    });
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

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Propriedades" color={theme.colors.primary} />
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
      <FAB
        icon={({ size, color }) => <MaterialCommunityIcons name="plus" size={size} color={color} />}
        style={styles.fab}
        onPress={onAddPropertie}
      />
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
  button: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default memo(PropertiesScreen);
