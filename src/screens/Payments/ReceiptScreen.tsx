import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { RentDTO } from '~/dtos/RentDTO';
import { getPaymentInstallments } from '~/api/payments';
import { getRentById } from '~/api/rents';
import { format } from 'date-fns';

type RouteParamsProps = {
  paymentId: number;
  rentId: number;
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
        const paymentsData = await getPaymentInstallments(rentId);
        const paymentData = paymentsData.find((p) => p.id === paymentId);
        const rentData = await getRentById(rentId);
        setPayment(paymentData || null);
        setRent(rentData || null);
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
              MÊS REFERÊNCIA: {format(new Date(payment.due_date), 'MMMM yyyy').toUpperCase()} -
              VALOR: R$
              {payment.installment_value.toFixed(2)}
            </Text>
            <Text style={styles.detail}>Locatário(a): {rent.tenant.name}</Text>
            <Text style={styles.message}>
              Recebi de {rent.tenant.name} a importância de R$
              {payment.installment_value.toFixed(2)} referente ao mês de{' '}
              {format(new Date(payment.due_date), 'MMMM yyyy')}.
            </Text>
            <Text style={styles.paymentDate}>
              Pagamento realizado em:{' '}
              {payment.payment_date ? format(new Date(payment.payment_date), 'dd/MM/yyyy') : 'N/A'}
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
