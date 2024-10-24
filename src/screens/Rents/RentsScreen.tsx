import React, { useState, useEffect, memo } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, Avatar, Chip, IconButton, Appbar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';

const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names[0][0] + names[names.length - 1][0];
  return initials.toUpperCase();
};

const mockRents = [
  {
    id: 1,
    deposit_value: 1000.0,
    active: true,
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    base_value: 1500.0,
    due_date: 5,
    reajustment_rate: '5%',
    houseDto: { nickname: 'Casa 1', zip_code: '12345-678' },
    template_id: 1,
    tenantsDTO: { name: 'John Doe' },
    user_id: 'user1',
  },
  {
    id: 2,
    deposit_value: 2000.0,
    active: false,
    start_date: '2022-01-01',
    end_date: '2022-12-31',
    base_value: 2500.0,
    due_date: 10,
    reajustment_rate: '3%',
    houseDto: { nickname: 'Casa 2', zip_code: '23456-789' },
    template_id: 2,
    tenantsDTO: { name: 'Jane Smith' },
    user_id: 'user2',
  },
];

const RentsScreen = () => {
  const [rents, setRents] = useState(mockRents);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const fetchRents = async () => {
    // Simulate fetching data
    try {
      // const fetchedRents = await getRents();
      // setRents(fetchedRents);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alugueis.');
    }
  };

  useEffect(() => {
    fetchRents();
  }, []);

  const onViewRent = (rent: (typeof mockRents)[0]) => {
    navigation.navigate('RentsStack', {
      screen: 'RentsDetails',
      params: { rentId: rent.id },
    });
  };

  const renderItem = ({ item }: { item: (typeof mockRents)[0] }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onViewRent(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.rentInfo}>
            {/* Avatar com as iniciais do inquilino */}
            <Avatar.Text
              size={48}
              label={getInitials(item.tenantsDTO.name)}
              style={styles.avatar}
            />

            {/* Informações do aluguel */}
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{item.houseDto.nickname}</Text>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                <Text style={styles.infoText}>{item.houseDto.zip_code}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
                <Text style={styles.infoText}>{item.base_value}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={16} color="#666" />
                <Text style={styles.infoText}>{item.tenantsDTO.name}</Text>
              </View>
            </View>

            {/* Chip indicando se está ativo ou inativo */}
            <Chip
              icon="check-circle"
              style={[styles.chip, item.active ? styles.chipActive : styles.chipInactive]}>
              {item.active ? 'Ativo' : 'Inativo'}
            </Chip>
          </View>
        </Card.Content>
        <Divider />
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Aluguéis" />
      </Appbar.Header>
      <FlatList
        data={rents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
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
  rentInfo: {
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
  cardTitle: {
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
  chip: {
    marginLeft: 16,
  },
  chipActive: {
    backgroundColor: '#4caf50',
  },
  chipInactive: {
    backgroundColor: '#f44336',
  },
});

export default memo(RentsScreen);
