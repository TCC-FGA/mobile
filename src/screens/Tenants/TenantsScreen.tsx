import React, { memo, useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  Card,
  Text,
  Avatar,
  IconButton,
  Menu,
  Divider,
  Appbar,
  Searchbar,
  FAB,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getTenants, deleteTenant } from '~/api/tenants';
import { TenantDTO } from '~/dtos/TenantDTO';
import GuarantorComponent from '~/components/guarantor/GuarantorComponent';
import { theme } from '~/core/theme';

const getInitials = (name: string) => {
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0][0].toUpperCase();
  }
  const initials = names[0][0] + names[names.length - 1][0];
  return initials.toUpperCase();
};

const TenantScreen = () => {
  const [tenants, setTenants] = useState<TenantDTO[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<TenantDTO[]>([]);
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [modalVisible, setModalVisible] = useState(false);
  const [itemTenant, setTenantItem] = useState<TenantDTO>();
  const isFocused = useIsFocused();

  const fetchTenants = async () => {
    setRefreshing(true);
    try {
      const fetchedTenants = await getTenants();
      setTenants(fetchedTenants);
      setFilteredTenants(fetchedTenants);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os inquilinos.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTenants();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTenants();
    } finally {
      setRefreshing(false);
    }
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = tenants.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(query.toLowerCase()) ||
          tenant.cpf.toLowerCase().includes(query.toLowerCase()) ||
          tenant.contact.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTenants(filtered);
    } else {
      setFilteredTenants(tenants);
    }
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchQuery('');
    setFilteredTenants(tenants);
  };

  const openMenu = (tenantId: string) => setVisibleMenu(tenantId);
  const closeMenu = () => setVisibleMenu(null);

  const onAddTenants = () => {
    navigation.navigate('TenantsStack', {
      screen: 'TenantDetails',
      params: {
        tenantId: null,
      },
    });
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleDeleteTenant = async (tenantId: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este inquilino? Qualquer contrato vinculado será perdido.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTenant(tenantId);
              setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
              setFilteredTenants(filteredTenants.filter((tenant) => tenant.id !== tenantId));
              Alert.alert('Sucesso', 'Inquilino excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o inquilino.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: TenantDTO }) => (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('CustomDetailsScreen', {
            data: item,
            title: `Inquilino ${item.name}`,
            fieldsToShow: [
              'name',
              'cpf',
              'contact',
              'email',
              'profession',
              'marital_status',
              'birth_date',
              'income',
              'residents',
              'street',
              'neighborhood',
              'number',
              'zip_code',
              'city',
              'state',
            ],
            labels: {
              name: 'Nome',
              cpf: 'CPF',
              contact: 'Contato',
              email: 'Email',
              profession: 'Profissão',
              marital_status: 'Estado Civil',
              emergency_contact: 'Contato de Emergência',
              income: 'Renda',
              residents: 'Residentes',
              street: 'Rua',
              neighborhood: 'Bairro',
              number: 'Número',
              zip_code: 'CEP',
              city: 'Cidade',
              state: 'Estado',
            },
          })
        }>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.tenantInfo}>
              {/* Avatar com as iniciais */}
              <Avatar.Text size={48} label={getInitials(item.name)} />

              {/* Informações do inquilino */}
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="phone" size={16} color="#666" />
                  <Text style={styles.infoText}>{item.contact}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={16} color="#666" />
                  <Text style={styles.infoText}>{item.email}</Text>
                </View>
              </View>

              {/* Menu de opções (ícone de três pontinhos) */}
              <Menu
                visible={visibleMenu === item.cpf}
                onDismiss={closeMenu}
                anchor={
                  <IconButton
                    icon={({ size, color }) => (
                      <MaterialCommunityIcons name="dots-vertical" size={size} color={color} />
                    )}
                    onPress={() => openMenu(item.cpf)}
                  />
                }>
                <Menu.Item
                  onPress={() => {
                    closeMenu();
                    navigation.navigate('TenantsStack', {
                      screen: 'TenantDetails',
                      params: {
                        tenantId: item.id,
                      },
                    });
                  }}
                  title="Editar"
                  leadingIcon="pencil"
                />
                <Menu.Item
                  onPress={() => {
                    closeMenu();
                    handleDeleteTenant(item.id);
                  }}
                  title="Excluir"
                  leadingIcon="delete"
                />
                <Menu.Item
                  onPress={() => {
                    closeMenu();
                    navigation.navigate('CustomDetailsScreen', {
                      data: item,
                      title: `Inquilino ${item.name}`,
                      fieldsToShow: [
                        'name',
                        'cpf',
                        'contact',
                        'email',
                        'profession',
                        'marital_status',
                        'birth_date',
                        'income',
                        'residents',
                        'street',
                        'neighborhood',
                        'number',
                        'zip_code',
                        'city',
                        'state',
                      ],
                      labels: {
                        name: 'Nome',
                        cpf: 'CPF',
                        contact: 'Contato',
                        email: 'Email',
                        profession: 'Profissão',
                        marital_status: 'Estado Civil',
                        emergency_contact: 'Contato de Emergência',
                        income: 'Renda',
                        residents: 'Residentes',
                        street: 'Rua',
                        neighborhood: 'Bairro',
                        number: 'Número',
                        zip_code: 'CEP',
                        city: 'Cidade',
                        state: 'Estado',
                      },
                    });
                  }}
                  title="Ver Inquilino"
                  leadingIcon={() => (
                    <MaterialCommunityIcons name="account-arrow-right" size={20} />
                  )}
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setTenantItem(item);
                    closeMenu();
                    handleOpenModal();
                  }}
                  title="Adicionar Fiador"
                  leadingIcon="account-details"
                />
              </Menu>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!modalVisible && (
        <>
          <Appbar.Header
            elevated
            style={{ backgroundColor: theme.colors.surface }}
            mode="center-aligned">
            {isSearchVisible ? (
              <Searchbar
                placeholder="Pesquisar"
                onChangeText={onChangeSearch}
                value={searchQuery}
                autoFocus
                onBlur={toggleSearchBar}
              />
            ) : (
              <>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Inquilinos" titleStyle={{ fontWeight: 'bold' }} />
              </>
            )}
            <Appbar.Action icon="magnify" onPress={toggleSearchBar} />
          </Appbar.Header>
        </>
      )}
      <FlatList
        className="mt-2"
        data={filteredTenants}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item) => item.cpf}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() =>
          !refreshing && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>Nenhum inquilino encontrado.</Text>
            </View>
          )
        }
      />
      {itemTenant && (
        <GuarantorComponent
          tenantId={itemTenant?.id}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )}
      {!modalVisible && (
        <FAB
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="account-plus" size={size} color={color} />
          )}
          style={styles.fab}
          onPress={onAddTenants}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 22,
    right: 0,
    bottom: 35,
  },
});

export default memo(TenantScreen);
