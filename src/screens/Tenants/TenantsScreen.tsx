import React, { memo, useState } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';

// Mock dos dados TenantsDTO
const tenantsMock = [
  {
    cpf: '123.456.789-00',
    contact: '(11) 98765-4321',
    email: 'vitor.farias@email.com',
    name: 'Vitor Farias',
    profession: 'Engenheiro',
    marital_status: 'Solteiro',
    birth_date: '1990-05-10',
    emergency_contact: '(11) 99999-1234',
    income: 7000,
    residents: 2,
    street: 'Rua das Flores',
    neighborhood: 'Centro',
    number: 123,
    zip_code: '12345-678',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    cpf: '987.654.321-00',
    contact: '(21) 91234-5678',
    email: 'ana.silva@email.com',
    name: 'Ana Silva',
    profession: 'Médica',
    marital_status: 'Casada',
    birth_date: '1985-02-20',
    emergency_contact: '(21) 98888-8765',
    income: 10000,
    residents: 3,
    street: 'Rua das Laranjeiras',
    neighborhood: 'Jardim América',
    number: 456,
    zip_code: '87654-321',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
];

// Função para extrair as iniciais do nome
const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names[0][0] + names[names.length - 1][0];
  return initials.toUpperCase();
};

const TenantScreen = () => {
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchQuery('');
  };

  const openMenu = (tenantId: string) => setVisibleMenu(tenantId);
  const closeMenu = () => setVisibleMenu(null);

  const onAddTenants = () => {
    navigation.navigate('TenantsStack', {
      screen: 'TenantDetails',
      params: {
        tenant: null,
      },
    });
  };

  const renderItem = ({ item }: { item: (typeof tenantsMock)[0] }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.tenantInfo}>
            {/* Avatar com as iniciais */}
            <Avatar.Text size={48} label={getInitials(item.name)} style={styles.avatar} />

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
                  console.log('Editar', item.name);
                }}
                title="Editar"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  console.log('Excluir', item.name);
                }}
                title="Excluir"
                leadingIcon="delete"
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  console.log('Ver contratos', item.name);
                }}
                title="Ver Contratos"
                leadingIcon="file-document-outline"
              />
              <Divider />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  console.log('Ver Detalhes', item.name);
                }}
                title="Ver Detalhes"
                leadingIcon="account-details"
              />
            </Menu>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        {isSearchVisible ? (
          <Searchbar
            placeholder="Pesquisar"
            onChangeText={onChangeSearch}
            value={searchQuery}
            autoFocus
            onBlur={toggleSearchBar}
          />
        ) : (
          <Appbar.Content title="Inquilinos" />
        )}
        <Appbar.Action icon="magnify" onPress={toggleSearchBar} />
      </Appbar.Header>
      <FlatList
        data={tenantsMock}
        renderItem={renderItem}
        keyExtractor={(item) => item.cpf}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon={({ size, color }) => <MaterialCommunityIcons name="plus" size={size} color={color} />}
        style={styles.fab}
        onPress={onAddTenants}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  avatar: {
    backgroundColor: '#6200ee',
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
