import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { RentDTO } from '~/dtos/RentDTO';
import { getPaymentInstallments } from '~/api/payments';
import { getRentById } from '~/api/rents';
import { format, parse } from 'date-fns';
import { parseFloatBR } from '~/helpers/convert_data';
import { api } from '~/services/api';
import { UserDTO } from '~/dtos/UserDTO';

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
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    const fetchUserSignature = async () => {
      setLoading(true);
      try {
        const user: UserDTO = await api.get('/users/me');
        if (user.hashed_signature) {
          setSignature(user.hashed_signature);
        }
      } catch (error) {
        console.error('Erro ao buscar a assinatura do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentAndRent();
    fetchUserSignature();
  }, [paymentId, rentId]);

  const handlePrint = () => {
    Alert.alert('Imprimir', 'Função de impressão não implementada.');
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', 'Função de compartilhamento não implementada.');
  };

  const handleSignature = () => {
    navigation.navigate('PaymentsStack', { screen: 'SignatureScreen' });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Recibo de Aluguel" />
        <Appbar.Action icon="printer" onPress={handlePrint} />
        <Appbar.Action icon="share-variant" onPress={handleShare} />
        <Appbar.Action icon="file-edit" onPress={handleSignature} />
      </Appbar.Header>
      <View style={styles.container}>
        {payment && rent && (
          <>
            <Text style={styles.title}>RECIBO DE ALUGUEL</Text>
            <Text style={styles.reference}>
              MÊS REFERÊNCIA:{' '}
              {format(parse(payment.due_date, 'yyyy-MM-dd', new Date()), 'MMMM yyyy').toUpperCase()}{' '}
              - VALOR: R$
              {parseFloatBR(payment.installment_value)}
            </Text>
            <Text style={styles.detail}>Locatário(a): {rent.tenant.name}</Text>
            <Text style={styles.message}>
              Recebi de {rent.tenant.name} a importância de R$
              {parseFloatBR(payment.installment_value)} referente ao mês de{' '}
              {format(new Date(payment.due_date), 'MMMM yyyy')}.
            </Text>
            <Text style={styles.paymentDate}>
              Pagamento realizado em:{' '}
              {payment.payment_date ? format(new Date(payment.payment_date), 'dd/MM/yyyy') : 'N/A'}
            </Text>
            <View style={styles.signatureContainer}>
              <Text style={styles.signatureLabel}>Assinatura:</Text>
              {signature ? (
                <Image source={{ uri: signature }} style={styles.signatureImage} />
              ) : (
                <View style={styles.signaturePlaceholder} />
              )}
              <Text style={styles.signatureLine}>_________________________</Text>
            </View>
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
  signatureContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  signatureImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  signaturePlaceholder: {
    width: 200,
    height: 100,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 8,
  },
  signatureLine: {
    fontSize: 16,
  },
});

export default memo(ReceiptScreen);
