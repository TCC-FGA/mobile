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
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { getPaymentInstallments, updatePaymentInstallment } from '~/api/payments';
import { format, parse } from 'date-fns';
import { convertDateInDDMMYYYY, formatDate, parseFloatBR } from '~/helpers/convert_data';
import { capitalizeWords } from '~/helpers/utils';
import { theme } from '~/core/theme';

type RouteParamsProps = {
  paymentId: number;
  contractId: number;
};

const PaymentDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { paymentId, contractId } = route.params as RouteParamsProps;
  const [payment, setPayment] = useState<PaymentDTO | null>(null);
  const [visible, setVisible] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentDTO['payment_type']>('dinheiro');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const paymentsData = await getPaymentInstallments(contractId);
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
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalhes do Pagamento" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}>
        {payment && (
          <Surface style={styles.surface}>
            <Text style={styles.title}>Detalhes da Parcela</Text>
            <Divider bold className="mb-2" />
            <Text style={styles.detail}>
              Valor da Parcela:{' '}
              <Text style={styles.detailValue}>R${parseFloatBR(payment.installment_value)}</Text>
            </Text>
            {payment.payment_type !== 'None' && (
              <Text style={styles.detail}>
                Método de Pagamento:{' '}
                <Text style={styles.detailValue}>{capitalizeWords(payment.payment_type)}</Text>
              </Text>
            )}
            <Text style={styles.detail}>
              Data de Vencimento:{' '}
              <Text style={styles.detailValue}>
                {convertDateInDDMMYYYY(parse(payment.due_date, 'yyyy-MM-dd', new Date()))}
              </Text>
            </Text>
            {payment.payment_date && (
              <Text style={styles.detail}>
                Data de Pagamento:{' '}
                <Text style={styles.detailValue}>
                  {convertDateInDDMMYYYY(parse(payment.payment_date, 'yyyy-MM-dd', new Date()))}
                </Text>
              </Text>
            )}
            <Divider bold className="mb-2 mt-2" />
            <View style={{ alignItems: 'center', marginTop: 2 }}>
              <Chip
                icon={({ size, color }) => (
                  <MaterialCommunityIcons
                    name={payment.fg_paid ? 'check-circle' : 'alert-circle'}
                    size={size}
                    color="black"
                  />
                )}
                style={[styles.chip, payment.fg_paid ? styles.chipPaid : styles.chipUnpaid]}>
                {payment.fg_paid ? 'Pago' : 'Em Aberto'}
              </Chip>
            </View>
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
          disabled={!payment?.fg_paid}
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
                <Text>Dinheiro/PIX</Text>
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
            <Button mode="outlined" onPress={handleMarkAsPaid}>
              Marcar como Pago
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 24,
    marginVertical: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  detail: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: 'bold',
    paddingLeft: 8,
  },
  detailValue: {
    color: 'gray',
    fontWeight: 'normal',
    fontSize: 18,
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
