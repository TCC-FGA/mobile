import React, { memo, useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
  Chip,
  Badge,
} from 'react-native-paper';
import { HouseDTO } from '~/dtos/HouseDTO';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';
import { deleteHouse, getHouses, getHousesByPropertyId } from '~/api/houses';

type HousesScreenProps = {
  propertyId?: number;
  propertyPhoto?: string;
  propertyNickname?: string;
};

const HousesScreen = () => {
  const [houses, setHouses] = useState<HouseDTO[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<HouseDTO[]>([]);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const isFocused = useIsFocused();
  const closeMenu = () => setMenuVisible(null);
  const { propertyId, propertyPhoto, propertyNickname } = route.params as HousesScreenProps;

  const fetchHouses = async () => {
    try {
      setRefreshing(true);
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
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchHouses();
    }
  }, [propertyId, isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchHouses();
    } finally {
      setRefreshing(false);
    }
  };

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
            <Image
              source={{
                uri:
                  item.photo ||
                  'https://storage.googleapis.com/e-aluguel/aluguelapp/padronizado.jpg',
              }}
              style={styles.image}
            />

            {/* Informações da casa */}
            <View style={styles.infoContainer}>
              <Title style={styles.cardTitle}>{item.nickname}</Title>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.chipContainer}>
                  <Chip
                    textStyle={{ fontWeight: 'bold' }}
                    icon={({ size, color }) => (
                      <MaterialCommunityIcons
                        name={
                          item.status === 'vaga'
                            ? 'home'
                            : item.status === 'alugada'
                              ? 'home'
                              : 'tools'
                        }
                        size={size}
                        color="black"
                      />
                    )}
                    style={[
                      styles.chip,
                      item.status === 'vaga'
                        ? styles.chipVaga
                        : item.status === 'alugada'
                          ? styles.chipAlugada
                          : styles.chipReforma,
                    ]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Chip>
                </View>
                {item.furnished && (
                  <Badge
                    style={{
                      backgroundColor: theme.colors.outline,
                      marginLeft: 8,
                      marginBottom: 2,
                    }}
                    size={25}>{`${'Mobiliada'}`}</Badge>
                )}
              </View>
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
                  style={{ marginRight: -10, marginTop: -45 }}
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
                  <MaterialCommunityIcons name="delete" size={size} color="red" />
                )}
              />
              {/* <Menu.Item
                onPress={() => {
                  closeMenu();
                  onViewTenant(item);
                }}
                title="Ver Inquilino"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="account" size={size} color={color} />
                )}
              /> */}
              <Divider />
              {/* <Menu.Item
                onPress={() => {
                  closeMenu();
                  onViewContract(item);
                }}
                title="Ver contrato"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="file-document" size={size} color={color} />
                )}
              /> */}
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  navigation.navigate('ExpensesStack', {
                    screen: 'ExpensesScreen',
                    params: { houseId: item.id },
                  });
                }}
                title="Gerir Despesas"
                leadingIcon={({ size, color }) => (
                  <MaterialCommunityIcons name="cash" size={size} color={color} />
                )}
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  navigation.navigate('CustomDetailsScreen', {
                    data: item,
                    title: `${item.nickname}`,
                    fieldsToShow: ['nickname', 'room_count', 'bathrooms', 'furnished', 'status'],
                    labels: {
                      nickname: 'Nome',
                      room_count: 'Quantidade de quartos',
                      bathrooms: 'Quantidade de banheiros',
                      furnished: 'Mobiliada?',
                      status: 'Status',
                    },
                  });
                }}
                title="Ver Casa"
                leadingIcon={() => <MaterialCommunityIcons name="home-search" size={20} />}
              />
            </Menu>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        {propertyId ? (
          <View style={styles.appbarContent}>
            <Avatar.Image
              size={40}
              source={{
                uri: propertyPhoto,
              }}
            />
            <Appbar.Content
              className="ml-2"
              title={propertyNickname || 'Todas as Casas'}
              titleStyle={{ fontWeight: 'bold' }}
            />
          </View>
        ) : (
          <Appbar.Content title="Todas as Casas" titleStyle={{ fontWeight: 'bold' }} />
        )}
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={renderItem}
        ListEmptyComponent={() =>
          !refreshing && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>Nenhuma casa encontrada.</Text>
            </View>
          )
        }
      />
      <FAB
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="home-plus-outline" size={size} color={color} />
        )}
        style={styles.fab}
        onPress={onAddHouse}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 74,
    height: 74,
    borderRadius: 8,
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
    marginLeft: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  chip: {
    marginTop: 0,
  },
  chipVaga: {
    backgroundColor: '#4caf50',
  },
  chipAlugada: {
    backgroundColor: '#ff9800',
  },
  chipReforma: {
    backgroundColor: '#f44336',
  },
  appbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  appbarTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default memo(HousesScreen);
