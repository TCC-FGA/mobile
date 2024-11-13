import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  Surface,
  Chip,
  Appbar,
  Dialog,
  Portal,
  RadioButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { getPaymentInstallments, updatePaymentInstallment } from '~/api/payments';
import { format, parse } from 'date-fns';
import { convertDateInDDMMYYYY, formatDate, parseFloatBR } from '~/helpers/convert_data';
import { capitalizeWords } from '~/helpers/utils';

type RouteParamsProps = {
  paymentId: number;
};

const PaymentDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { paymentId } = route.params as RouteParamsProps;
  const [payment, setPayment] = useState<PaymentDTO | null>(null);
  const [visible, setVisible] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentDTO['payment_type']>('dinheiro');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const paymentsData = await getPaymentInstallments(paymentId);
        const paymentData = paymentsData.find((p) => p.id === paymentId);
        setPayment(paymentData || null);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do pagamento.');
      }
    };

    fetchPayment();
  }, [paymentId]);

  const handleMarkAsPaid = async () => {
    try {
      if (payment) {
        const updatedPayment = await updatePaymentInstallment(payment.id, {
          fg_paid: true,
          payment_date: formatDate(new Date()),
          payment_type: paymentType,
        });
        setPayment(updatedPayment);
        Alert.alert('Sucesso', 'Pagamento marcado como pago!');
        setVisible(false);
      }
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

  const hideDialog = () => setVisible(false);

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
              Valor da Parcela: R${parseFloatBR(payment.installment_value)}
            </Text>
            {payment.payment_type !== 'None' && (
              <Text style={styles.detail}>
                Método de Pagamento: {capitalizeWords(payment.payment_type)}
              </Text>
            )}
            <Text style={styles.detail}>
              Data de Vencimento:{' '}
              {convertDateInDDMMYYYY(parse(payment.due_date, 'yyyy-MM-dd', new Date()))}
            </Text>
            {payment.payment_date && (
              <Text style={styles.detail}>
                Data de Pagamento:{' '}
                {convertDateInDDMMYYYY(parse(payment.payment_date, 'yyyy-MM-dd', new Date()))}
              </Text>
            )}
            <Chip
              icon={payment.fg_paid ? 'check-circle' : 'alert-circle'}
              style={[styles.chip, payment.fg_paid ? styles.chipPaid : styles.chipUnpaid]}>
              {payment.fg_paid ? 'Pago' : 'Em Aberto'}
            </Chip>
          </Surface>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => setVisible(true)}
          icon={() => <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />}
          style={styles.button}
          disabled={payment?.fg_paid}>
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
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Escolha o Método de Pagamento</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => setPaymentType(value as typeof paymentType)}
              value={paymentType}>
              <View style={styles.radioItem}>
                <RadioButton value="dinheiro" />
                <Text>Dinheiro</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="cartao" />
                <Text>Cartão</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="transferencia" />
                <Text>Transferência</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="outro" />
                <Text>Outro</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={handleMarkAsPaid}>Marcar como Pago</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default memo(PaymentDetails);
