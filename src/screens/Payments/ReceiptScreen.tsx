import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { RentDTO } from '~/dtos/RentDTO';
import { format } from 'date-fns';

type RouteParamsProps = {
  paymentId: number;
  rentId: number;
};

const mockPayment: PaymentDTO = {
  id: 1,
  installmentValue: 1000.0,
  isPaid: true,
  paymentMethod: 'transferência',
  dueDate: new Date('2023-01-01'),
  paymentDate: new Date('2023-01-01'),
  contractId: 1,
};

const mockRent: RentDTO = {
  id: 1,
  deposit_value: 1000.0,
  active: true,
  start_date: '2023-01-01',
  end_date: '2023-12-31',
  base_value: 1500.0,
  due_date: 5,
  reajustment_rate: '5%',
  houseDto: {
    nickname: 'Casa 1',
    id: 0,
    property_id: 0,
    photo: null,
    room_count: 0,
    bathrooms: 0,
    furnished: null,
    status: 'alugada',
  },
  template_id: 1,
  tenantsDTO: {
    name: 'John Doe',
    id: 0,
    cpf: '',
    contact: '',
    email: null,
    profession: null,
    marital_status: null,
    birth_date: null,
    emergency_contact: null,
    income: null,
    residents: null,
    street: '',
    neighborhood: null,
    number: null,
    zip_code: '',
    city: null,
    state: null,
  },
  user_id: 'user1',
};

const ReceiptScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { paymentId, rentId } = route.params as RouteParamsProps;
  const [payment, setPayment] = useState<PaymentDTO | null>(null);
  const [rent, setRent] = useState<RentDTO | null>(null);

  useEffect(() => {
    const fetchPaymentAndRent = async () => {
      try {
        // Simulate fetching data
        // const paymentData = await getPaymentById(paymentId);
        // const rentData = await getRentById(rentId);
        // setPayment(paymentData);
        // setRent(rentData);
        setPayment(mockPayment); // Use mock data for now
        setRent(mockRent); // Use mock data for now
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do recibo.');
      }
    };

    fetchPaymentAndRent();
  }, [paymentId, rentId]);

  const handlePrint = () => {
    Alert.alert('Imprimir', 'Função de impressão não implementada.');
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', 'Função de compartilhamento não implementada.');
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Recibo de Aluguel" />
        <Appbar.Action icon="printer" onPress={handlePrint} />
        <Appbar.Action icon="share-variant" onPress={handleShare} />
      </Appbar.Header>
      <View style={styles.container}>
        {payment && rent && (
          <>
            <Text style={styles.title}>RECIBO DE ALUGUEL</Text>
            <Text style={styles.reference}>
              MÊS REFERÊNCIA: {format(new Date(payment.dueDate), 'MMMM yyyy').toUpperCase()} -
              VALOR: R$
              {payment.installmentValue.toFixed(2)}
            </Text>
            <Text style={styles.detail}>Locatário(a): {rent.tenantsDTO.name}</Text>
            <Text style={styles.message}>
              Recebi de {rent.tenantsDTO.name} a importância de R$
              {payment.installmentValue.toFixed(2)} referente ao mês de{' '}
              {format(new Date(payment.dueDate), 'MMMM yyyy')}.
            </Text>
            <Text style={styles.paymentDate}>
              Pagamento realizado em:{' '}
              {payment.paymentDate ? format(new Date(payment.paymentDate), 'dd/MM/yyyy') : 'N/A'}
            </Text>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  reference: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
  },
  paymentDate: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default memo(ReceiptScreen);
