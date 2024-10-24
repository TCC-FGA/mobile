import React, { useState, useEffect, memo } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Chip, Appbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { format } from 'date-fns';

type RouteParamsProps = {
  contractId: number;
};

const mockPayments: PaymentDTO[] = [
  {
    id: 1,
    installmentValue: 1000.0,
    isPaid: true,
    paymentMethod: 'transferência',
    dueDate: new Date('2023-01-01'),
    paymentDate: new Date('2023-01-01'),
    contractId: 1,
  },
  {
    id: 2,
    installmentValue: 1000.0,
    isPaid: false,
    paymentMethod: 'dinheiro',
    dueDate: new Date('2023-02-01'),
    contractId: 1,
  },
  {
    id: 3,
    installmentValue: 1000.0,
    isPaid: false,
    paymentMethod: 'cartão',
    dueDate: new Date('2023-03-01'),
    contractId: 1,
  },
];

const PaymentsScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { contractId } = route.params as RouteParamsProps;
  const [payments, setPayments] = useState<PaymentDTO[]>(mockPayments);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Simulate fetching data
        // const paymentsData = await getPaymentsByContractId(contractId);
        // setPayments(paymentsData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
      }
    };

    fetchPayments();
  }, [contractId]);

  const renderItem = ({ item, index }: { item: PaymentDTO; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('PaymentsStack', {
          screen: 'PaymentsDetails',
          params: { paymentId: item.id },
        })
      }>
      <View style={styles.paymentContainer}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>
            Parcela {index + 1} de {payments.length}
          </Text>
          <Text style={styles.dueDate}>
            Vence em {format(new Date(item.dueDate), 'dd/MM/yyyy')}
          </Text>
        </View>
        <View style={styles.paymentDetails}>
          <Text style={styles.installmentValue}>R${item.installmentValue.toFixed(2)}</Text>
          <Chip
            icon={item.isPaid ? 'check-circle' : 'alert-circle'}
            style={[styles.chip, item.isPaid ? styles.chipPaid : styles.chipUnpaid]}>
            {item.isPaid ? 'Pago' : 'Em Aberto'}
          </Chip>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pagamentos" />
      </Appbar.Header>
      <FlatList
        data={payments}
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
    paddingVertical: 8,
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentDetails: {
    alignItems: 'flex-end',
  },
  installmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chip: {
    marginTop: 4,
  },
  chipPaid: {
    backgroundColor: '#4caf50',
  },
  chipUnpaid: {
    backgroundColor: '#f44336',
  },
});

export default memo(PaymentsScreen);
