import { PropertiesDTO } from '@dtos/PropertiesDTO';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo, useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
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
import CustomAppBar from '~/components/AppBar/AppBar';

const PropertiesScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<PropertiesDTO[]>([]);
  const [properties, setProperties] = useState<PropertiesDTO[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);

  const openMenu = (propertyId: string) => setVisibleMenu(propertyId);
  const closeMenu = () => setVisibleMenu(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/properties');
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProperties();
    } catch (error) {
      console.error('Erro ao atualizar propriedades:', error);
    } finally {
      setRefreshing(false);
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
    <TouchableOpacity activeOpacity={0.8} onPress={() => onViewHouses(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Imagem à esquerda */}
            {/* <Avatar.Image
              size={64}
              source={{
                uri:
                  item.photo ||
                  'https://storage.googleapis.com/e-aluguel/aluguelapp/padronizado.jpg',
              }}
              style={styles.avatar}
            /> */}
            <Image
              source={{
                uri:
                  item.photo ||
                  'https://storage.googleapis.com/e-aluguel/aluguelapp/padronizado.jpg',
              }}
              style={styles.image}
            />

            {/* Informações da propriedade à direita da imagem */}
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.cardTitle}>{item.nickname}</Text>
              <Text style={styles.cardSubtitle}>CEP: {item.zip_code}</Text>
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
                  style={{ marginRight: -10, marginTop: -45 }}
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
        propertyPhoto:
          propertie.photo || 'https://storage.googleapis.com/e-aluguel/aluguelapp/padronizado.jpg',
        propertyNickname: propertie.nickname || 'Propriedade',
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
      <CustomAppBar title="Propriedades" />
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() =>
          !refreshing && (
            <View style={styles.loadingIndicator}>
              <Text>Nenhuma propriedade encontrada.</Text>
            </View>
          )
        }
      />
      <FAB
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="home-group-plus" size={size} color={color} />
        )}
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
    borderRadius: 50,
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
    margin: 14,
    right: 0,
    bottom: 0,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
});

export default memo(PropertiesScreen);
