import React, { useState, useEffect, memo } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Chip, Appbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { getPaymentInstallments } from '~/api/payments';
import { format, parse, set } from 'date-fns';
import { convertDateInDDMMYYYY, parseFloatBR } from '~/helpers/convert_data';

type RouteParamsProps = {
  contractId: number;
};

const PaymentsScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { contractId } = route.params as RouteParamsProps;
  const [payments, setPayments] = useState<PaymentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const paymentsData = await getPaymentInstallments(contractId);
      const sortedPayments = paymentsData.sort((a, b) => a.id - b.id);
      setPayments(sortedPayments);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
            Parcela {item.id} de {payments.length}
          </Text>
          <Text style={styles.dueDate}>
            Vence em {convertDateInDDMMYYYY(parse(item.due_date, 'yyyy-MM-dd', new Date()))}
          </Text>
        </View>
        <View style={styles.paymentDetails}>
          <Text style={styles.installmentValue}>R${parseFloatBR(item.installment_value)}</Text>
          <Chip
            icon={item.fg_paid ? 'check-circle' : 'alert-circle'}
            style={[styles.chip, item.fg_paid ? styles.chipPaid : styles.chipUnpaid]}>
            {item.fg_paid ? 'Pago' : 'Em Aberto'}
          </Chip>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pagamentos" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <FlatList
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={fetchPayments}
        ListEmptyComponent={() =>
          !isLoading && (
            <Text style={{ textAlign: 'center', padding: 16 }}>
              Nenhuma parcela encontrada para este contrato.
            </Text>
          )
        }
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
