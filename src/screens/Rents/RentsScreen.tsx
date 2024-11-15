import React, { useState, useEffect, memo } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, Avatar, Chip, Appbar, Divider, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getRents } from '~/api/rents';
import { RentDTO } from '~/dtos/RentDTO';
import { parseFloatBR } from '~/helpers/convert_data';
import CustomAppBar from '~/components/AppBar/AppBar';

const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names[0][0] + names[names.length - 1][0];
  return initials.toUpperCase();
};

const RentsScreen = () => {
  const [rents, setRents] = useState<RentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const fetchRents = async () => {
    try {
      setIsLoading(true);
      const fetchedRents = await getRents();
      setRents(fetchedRents);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alugueis.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRents();
  }, []);

  const onViewRent = (rent: RentDTO) => {
    navigation.navigate('RentsStack', {
      screen: 'RentsDetails',
      params: { rentId: rent.id },
    });
  };

  const renderItem = ({ item }: { item: RentDTO }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onViewRent(item)}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.rentInfo}>
            {/* Avatar com as iniciais do inquilino */}
            <Avatar.Text size={48} label={getInitials(item.tenant.name)} style={styles.avatar} />

            {/* Informações do aluguel */}
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{item.house.nickname}</Text>
              {/* <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                <Text style={styles.infoText}>{item.houseDto.}</Text>
              </View> */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
                <Text style={styles.infoText}>{parseFloatBR(item.base_value)}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={16} color="#666" />
                <Text style={styles.infoText}>{item.tenant.name}</Text>
              </View>
            </View>

            {/* Chip indicando se está ativo ou inativo */}
            <Chip icon="check-circle" style={[styles.chip, styles.chipActive]}>
              Ativo
            </Chip>
          </View>
        </Card.Content>
        <Divider />
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomAppBar title="Aluguéis" />
      <FlatList
        data={rents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={fetchRents}
        ListEmptyComponent={() =>
          !isLoading && (
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ fontSize: 16, color: '#666' }}>Nenhum aluguel encontrado.</Text>
            </View>
          )
        }
      />
      <FAB
        icon="briefcase-plus"
        style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
        onPress={() => navigation.navigate('RentsStack', { screen: 'RentsMainCreation' })}
      />
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
