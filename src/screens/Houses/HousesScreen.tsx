import React, { memo, useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  IconButton,
  Avatar,
  Searchbar,
  Text,
  FAB,
  Menu,
  Divider,
} from 'react-native-paper';
import { HouseDTO } from '~/dtos/HouseDTO';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';
import { deleteHouse, getHouses, getHousesByPropertyId } from '~/api/houses';

type HousesScreenProps = {
  propertyId?: number;
};

const HousesScreen = () => {
  const [houses, setHouses] = useState<HouseDTO[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<HouseDTO[]>([]);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const closeMenu = () => setMenuVisible(null);
  const { propertyId } = route.params as HousesScreenProps;

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        let fetchedHouses: HouseDTO[];
        if (propertyId) {
          fetchedHouses = await getHousesByPropertyId(propertyId);
        } else {
          fetchedHouses = await getHouses();
        }
        setHouses(fetchedHouses);
        setFilteredHouses(fetchedHouses);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as casas.');
      }
    };

    fetchHouses();
  }, [propertyId]);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    filterHouses(query);
  };

  const onAddHouse = () => {
    navigation.navigate('HousesStack', {
      screen: 'HouseDetails',
      params: {
        house: null,
      },
    });
  };

  const filterHouses = (query: string) => {
    if (query.trim() === '') {
      setFilteredHouses(houses);
    } else {
      const filtered = houses.filter(
        (house) => house.nickname && house.nickname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHouses(filtered);
    }
  };

  const onEditHouse = (house: HouseDTO) => {
    navigation.navigate('HousesStack', {
      screen: 'HouseDetails',
      params: {
        house,
      },
    });
  };

  const onDeleteHouse = (houseId: number) => {
    Alert.alert('Confirmar Exclusão', 'Você tem certeza que deseja excluir esta casa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHouse(houseId);
            const updatedHouses = houses.filter((house) => house.id !== houseId);
            setHouses(updatedHouses);
            setFilteredHouses(updatedHouses);
            Alert.alert('Casa excluída', 'A casa foi excluída com sucesso.');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a casa.');
          }
        },
      },
    ]);
  };

  const onViewTenant = (house: HouseDTO) => {
    Alert.alert('Ver Inquilino', `Ver inquilino da casa: ${house.nickname}`);
  };

  const onViewContract = (house: HouseDTO) => {
    Alert.alert('Ver Contrato', `Ver contrato da casa: ${house.nickname}`);
  };

  const toggleMenu = (houseId: number) => {
    setMenuVisible((prevState) => (prevState === houseId ? null : houseId)); // Alterna entre abrir e fechar o menu
  };

  const renderItem = ({ item }: { item: HouseDTO }) => (
    <TouchableOpacity activeOpacity={1} onPress={() => console.log('Casa selecionada', item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            {/* Imagem à esquerda */}
            <Avatar.Image
              size={64}
              source={{ uri: item.photo || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />

            {/* Informações da casa */}
            <View style={styles.infoContainer}>
              <Title>{item.nickname}</Title>
              <Paragraph>Quartos: {item.room_count}</Paragraph>
              <Paragraph>Banheiros: {item.bathrooms}</Paragraph>
              <Paragraph>Mobiliada: {item.furnished ? 'Sim' : 'Não'}</Paragraph>
              <Paragraph>Status: {item.status}</Paragraph>
            </View>

            {/* Botão de Menu (três pontos) */}
            <Menu
              visible={menuVisible === item.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon={({ size, color }) => (
                    <MaterialCommunityIcons name="dots-vertical" size={size} color={color} />
                  )}
                  onPress={() => toggleMenu(item.id)}
                />
              }>
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onEditHouse(item);
                }}
                title="Editar"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="pencil" size={size} color={color} />
                )}
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onDeleteHouse(item.id);
                }}
                title="Excluir"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="delete" size={size} color={color} />
                )}
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onViewTenant(item);
                }}
                title="Ver Inquilino"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="account" size={size} color={color} />
                )}
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  onViewContract(item);
                }}
                title="Ver contrato"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="file-document" size={size} color={color} />
                )}
              />
            </Menu>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content
          title={propertyId ? `Casas da Propriedade ${propertyId}` : 'Todas as Casas'}
        />
      </Appbar.Header>

      <Searchbar
        placeholder="Buscar casas"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredHouses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>Nenhuma casa encontrada.</Text>
          </View>
        )}
      />
      <FAB
        icon={({ size, color }) => <MaterialCommunityIcons name="plus" size={size} color={color} />}
        style={styles.fab}
        onPress={onAddHouse}
      />
    </View>
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
    margin: 10,
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
  fab: {
    position: 'absolute',
    margin: 22,
    right: 0,
    bottom: 35,
  },
  infoContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default memo(HousesScreen);
