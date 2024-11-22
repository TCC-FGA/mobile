import React, { memo, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Appbar, Text, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { RentDTO } from '~/dtos/RentDTO';
import { getPaymentInstallments } from '~/api/payments';
import { getRentById } from '~/api/rents';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseFloatBR } from '~/helpers/convert_data';
import { api } from '~/services/api';
import { UserDTO } from '~/dtos/UserDTO';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAuth } from '~/hooks/useAuth';
import { theme } from '~/core/theme';

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
  const receiptRef = useRef<ScrollView>(null);
  const { user } = useAuth();

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
        const response = await api.get('/users/me');
        const user: UserDTO = response.data;
        if (user.hashed_signature) {
          setSignature(user.hashed_signature);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a assinatura do usuário.');
        console.error('Erro ao buscar a assinatura do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentAndRent();
    fetchUserSignature();
  }, [paymentId, rentId]);

  const randomReceiptNumber = Math.floor(100000 + Math.random() * 900000);

  const translateMonth = (date: Date): string => {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${months[month]} de ${year}`;
  };

  const generateHtmlContent = () => {
    // Função para gerar um número aleatório para o recibo
    return `
      <html>
        <head></head>
        <body>
          <!-- 1 Via -->
          <div style="border-bottom: 2px dashed #cbd5e0;">
            <div style="border-bottom: 2px solid #16a34a; padding: 28px 24px; display: flex; align-items: center;">
              <p style="font-size: 1rem; font-weight: bold; width: 33.333%; margin-right: 80px;">RECIBO</p>
              <label for="numeroReciboGerado" style="font-size: 1rem; font-weight: bold; margin-right: 12px;">Nº</label>
              <input type="text" readonly="readonly" id="numeroReciboGerado"
                style="background-color: #e2e8f0; color: #4a5568; padding: 8px; font-size: 0.875rem; text-align: center; border: 1px solid #cbd5e0; border-radius: 0.375rem; margin-right: 80px;" 
                value="${randomReceiptNumber}">
              <label for="valorReciboGerado" style="font-size: 1rem; font-weight: bold; margin-right: 12px;">VALOR</label>
              <input type="text" readonly="readonly" id="valorReciboGerado"
                style="background-color: #e2e8f0; color: #4a5568; padding: 8px; font-size: 0.875rem; text-align: center; border: 1px solid #cbd5e0; border-radius: 0.375rem;" value="R$${payment ? parseFloatBR(payment.installment_value) : ''}">
            </div>
            <div style="padding: 28px 24px; text-align: center;">
              <p style="word-break: break-all; font-size: 1rem; font-weight: bold;">
                Eu, ${user.name}, portador(a) do CPF nº ${user.cpf},<br><br>
                recebi de
                <span id="receboDe" style="font-weight: normal; text-transform: uppercase; display: inline-block;">${rent ? rent.tenant.name : ''}, CPF nº ${rent ? rent.tenant.cpf : '000.000.000-00'}</span><br><br>
                a importância de R$${payment ? parseFloatBR(payment.installment_value) : ''} referente ao mês de
                <span id="correspondeA" style="font-weight: normal; text-transform: uppercase;">${payment ? translateMonth(new Date(payment.due_date)) : ''}</span><br><br>
                Pagamento realizado em: ${payment && payment.payment_date ? format(new Date(payment.payment_date), 'dd/MM/yyyy') : 'N/A'} e para clareza firmo(amos) o presente.
              </p>
              <p id="cidadeEstadoData" style="margin-top: 32px; text-align: center;">${format(new Date(), 'dd')} ${translateMonth(new Date())}.</p>
              <div style="display: flex; flex-direction: column; align-items: center; margin: 32px 0;">
                <p style="font-size: 0.875rem; font-weight: bold; line-height: 1.25; text-align: center;">
                  Assinatura do locador(a)
                </p>
                <br>
                <div style="border-bottom: 1px solid #000; width: 200px; margin: 8px auto;">
                  ${signature ? `<img src="${signature}" style="width: 200px; height: 28px; display: block; margin-top: -28px;" />` : ''}
                </div>
                <p style="font-size: 0.875rem; font-weight: bold; line-height: 1.25; text-align: center;">
                  ${user.name}
                </p>
              </div>
            </div>
          </div>
          <style>
            @media print {
              .elemento {
                display: none;
              }
            }
          </style>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      const htmlContent = generateHtmlContent();
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível imprimir o recibo.');
      console.error('Erro ao imprimir o recibo:', error);
    }
  };

  const handleShare = async () => {
    try {
      const htmlContent = generateHtmlContent();
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o recibo.');
      console.error('Erro ao compartilhar o recibo:', error);
    }
  };

  const handleSignature = () => {
    navigation.navigate('PaymentsStack', { screen: 'SignatureScreen' });
  };

  return (
    <>
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Recibo" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="printer" onPress={handlePrint} />
        <Appbar.Action icon="share-variant" onPress={handleShare} />
        <Appbar.Action icon="file-edit" onPress={handleSignature} />
      </Appbar.Header>
      <ScrollView style={styles.container} ref={receiptRef}>
        {payment && rent && (
          <>
            {/* Divisória superior */}
            <View style={styles.dashedDivider}>
              <Text className="text-center" variant="titleMedium">
                RECIBO DE ALUGUEL
              </Text>
              <View style={styles.headerRow}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Nº</Text>
                  <Text style={styles.fieldValue}>{randomReceiptNumber}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>VALOR</Text>
                  <Text style={styles.fieldValue}>
                    R$ {parseFloatBR(payment.installment_value)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Conteúdo principal do recibo */}
            <View style={styles.contentContainer}>
              <Text style={styles.message}>
                Eu, {user.name}, portador(a) do CPF nº {user.cpf},
              </Text>
              <Text style={styles.message}>
                recebi de <Text style={styles.tenantName}>{rent.tenant.name}</Text>, CPF nº{' '}
                {rent.tenant.cpf || '000.000.000-00'}
              </Text>
              <Text style={styles.message}>
                a importância de R$ {parseFloatBR(payment.installment_value)} referente ao mês de{' '}
                {format(new Date(payment.due_date), 'MMMM yyyy', { locale: ptBR }).toUpperCase()}.
              </Text>
              <Text style={styles.message}>
                Pagamento realizado em:{' '}
                {payment.payment_date
                  ? format(new Date(payment.payment_date), 'dd/MM/yyyy')
                  : 'N/A'}{' '}
                e para clareza firmo(amos) o presente.
              </Text>
              <Text style={styles.date}>
                {format(new Date(), 'dd MMMM yyyy', { locale: ptBR })}.
              </Text>

              {/* Assinatura */}
              <View style={styles.signatureContainer}>
                <Text style={styles.signatureLabel}>Assinatura do locatário(a)</Text>
                {signature ? (
                  <Image
                    source={{ uri: signature }}
                    style={styles.signatureImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.signaturePlaceholder} />
                )}
                <Text>_________________________</Text>
                <Text style={styles.signatureLine}>{user.name}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  dashedDivider: {
    borderBottomWidth: 2,
    borderColor: '#cbd5e0',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderColor: '#16a34a',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '33%',
    marginRight: 40,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  fieldValue: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  contentContainer: {
    paddingVertical: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  tenantName: {
    fontWeight: 'normal',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 14,
    marginTop: 32,
    textAlign: 'center',
  },
  signatureContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signatureImage: {
    width: 200,
    height: 28,
  },
  signaturePlaceholder: {
    width: 200,
    height: 28,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  signatureLine: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default memo(ReceiptScreen);
