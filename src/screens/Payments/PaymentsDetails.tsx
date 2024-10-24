import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import { Text, Button, Surface, Chip, Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { format } from 'date-fns';

type RouteParamsProps = {
  paymentId: number;
};

const mockPayment: PaymentDTO = {
  id: 1,
  installmentValue: 1000.0,
  isPaid: false,
  paymentMethod: 'transferência',
  dueDate: new Date('2023-01-01'),
  paymentDate: undefined,
  contractId: 1,
};

const PaymentDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { paymentId } = route.params as RouteParamsProps;
  const [payment, setPayment] = useState<PaymentDTO | null>(mockPayment);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // Simulate fetching data
        // const paymentData = await getPaymentById(paymentId);
        // setPayment(paymentData);
        setPayment(mockPayment); // Use mock data for now
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do pagamento.');
      }
    };

    fetchPayment();
  }, [paymentId]);

  const handleMarkAsPaid = async () => {
    try {
      // Simulate updating payment status
      // await updatePaymentStatus(paymentId, { isPaid: true });
      setPayment((prev) => prev && { ...prev, isPaid: true, paymentDate: new Date() });
      Alert.alert('Sucesso', 'Pagamento marcado como pago!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar o pagamento como pago.');
    }
  };

  const handleGenerateReceipt = () => {
    navigation.navigate('PaymentsStack', {
      screen: 'ReceiptScreen',
      params: { paymentId: payment?.id, rentId: payment?.id },
    });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalhes do Pagamento" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {payment && (
          <Surface style={styles.surface}>
            <Text style={styles.title}>Detalhes da Parcela</Text>
            <Text style={styles.detail}>
              Valor da Parcela: R${payment.installmentValue.toFixed(2)}
            </Text>
            <Text style={styles.detail}>Método de Pagamento: {payment.paymentMethod}</Text>
            <Text style={styles.detail}>
              Data de Vencimento: {format(new Date(payment.dueDate), 'dd/MM/yyyy')}
            </Text>
            <Text style={styles.detail}>
              Data de Pagamento:{' '}
              {payment.paymentDate ? format(new Date(payment.paymentDate), 'dd/MM/yyyy') : 'N/A'}
            </Text>
            <Chip
              icon={payment.isPaid ? 'check-circle' : 'alert-circle'}
              style={[styles.chip, payment.isPaid ? styles.chipPaid : styles.chipUnpaid]}>
              {payment.isPaid ? 'Pago' : 'Em Aberto'}
            </Chip>
          </Surface>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleMarkAsPaid}
          icon={() => <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />}
          style={styles.button}
          disabled={payment?.isPaid}>
          Marcar como Pago
        </Button>
        <Button
          mode="contained"
          onPress={handleGenerateReceipt}
          icon={() => (
            <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
          )}
          style={styles.button}>
          Gerar Recibo
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  chip: {
    marginTop: 8,
  },
  chipPaid: {
    backgroundColor: '#4caf50',
  },
  chipUnpaid: {
    backgroundColor: '#f44336',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
});

export default memo(PaymentDetails);
