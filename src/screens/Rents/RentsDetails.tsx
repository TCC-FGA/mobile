import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  Text,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '~/core/theme';
import { RentDTO } from '~/dtos/RentDTO';
import { getRentById, updateRent, updatePdfRent } from '~/api/rents';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { createPaymentInstallment, getPaymentInstallments } from '~/api/payments';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { convertDateInDDMMYYYY, parseFloatBR } from '~/helpers/convert_data';
import { parse } from 'date-fns';

type RouteParamsProps = {
  rentId?: number;
};

const RentsDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { rentId } = route.params as RouteParamsProps;
  const [rent, setRent] = useState<RentDTO | null>(null);
  const [hasPayments, setPayments] = useState<PaymentDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  useEffect(() => {
    if (rentId) {
      const fetchRent = async () => {
        setIsLoadingPage(true);
        try {
          const rentData = await getRentById(rentId);
          const hasPayments = await getPaymentInstallments(rentId);
          setPayments(hasPayments);
          setRent(rentData);
          navigation.setOptions({ title: 'Detalhes do Aluguel' });
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do aluguel.');
        } finally {
          setIsLoadingPage(false);
        }
      };

      fetchRent();
    } else {
      navigation.setOptions({ title: 'Adicionar Aluguel' });
    }
  }, [rentId, navigation]);

  const handleUploadContract = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.assets && rent) {
        const formData = new FormData();
        formData.append('signed_pdf', {
          uri: result.assets[0].uri,
          name: 'signed_contract.pdf',
          type: 'application/pdf',
        } as any);

        await updatePdfRent(rent.id, formData);
        Alert.alert('Sucesso', 'PDF assinado enviado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível anexar o contrato.');
    }
  };

  const handleSave = async () => {
    if (!rent) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (rentId) {
        await updateRent(rentId, rent);
        Alert.alert('Sucesso', 'Aluguel atualizado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o aluguel.');
    }
  };

  return (
    <>
      {isLoadingPage ? (
        <ActivityIndicator animating color={theme.colors.primary} style={{ flex: 1 }} />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {rent && (
              <Surface style={styles.surface}>
                <View style={styles.detailContainer} className="mb-4 justify-center">
                  <Text variant="headlineSmall">Detalhes do Contrato</Text>
                </View>
                <View className="p-3 justify-center">
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="calendar-start"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Data de Início:{' '}
                      {convertDateInDDMMYYYY(parse(rent.start_date, 'yyyy-MM-dd', new Date()))}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="calendar-end"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Data de Término:{' '}
                      {convertDateInDDMMYYYY(parse(rent.end_date, 'yyyy-MM-dd', new Date()))}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="currency-usd"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Valor Base: R${parseFloatBR(rent.base_value)}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Dia de Vencimento: {rent.due_date}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons name="percent" size={24} color={theme.colors.primary} />
                    <Text variant="titleSmall" style={styles.detail}>
                      Taxa de Reajuste: {rent.reajustment_rate}%
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons name="home" size={24} color={theme.colors.primary} />
                    <Text variant="titleSmall" style={styles.detail}>
                      Nome da Casa: {rent.house.nickname}
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons name="account" size={24} color={theme.colors.primary} />
                    <Text variant="titleSmall" style={styles.detail}>
                      Nome do Inquilino: {rent.tenant.name}
                    </Text>
                  </View>
                </View>
              </Surface>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            {hasPayments && hasPayments.length > 0 ? (
              <Button
                mode="contained"
                onPress={() =>
                  navigation.navigate('PaymentsStack', {
                    screen: 'PaymentsScreen',
                    params: { contractId: rent?.id },
                  })
                }
                icon={() => (
                  <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
                )}
                contentStyle={{ paddingHorizontal: 16 }}
                style={styles.button}>
                Ver Parcelas
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={async () => {
                  if (rent) {
                    try {
                      setIsLoading(true);
                      await createPaymentInstallment(rent.id);
                      Alert.alert('Sucesso', 'Parcelas geradas com sucesso!');
                      const updatedPayments = await getPaymentInstallments(rent.id);
                      setPayments(updatedPayments);
                    } catch (error) {
                      Alert.alert('Erro', 'Não foi possível gerar as parcelas.');
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                icon={() =>
                  isLoading ? (
                    <ActivityIndicator animating color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
                  )
                }
                contentStyle={{ paddingHorizontal: 16 }}
                style={styles.button}
                disabled={isLoading}>
                {isLoading ? 'Gerando Parcelas' : 'Gerar Parcelas'}
              </Button>
            )}
            <Button
              mode="contained"
              onPress={handleUploadContract}
              icon={() => <MaterialCommunityIcons name="upload" size={20} color="#fff" />}
              contentStyle={{ paddingHorizontal: 16 }}
              style={styles.button}>
              Anexar Contrato Assinado
            </Button>
          </View>
        </>
      )}
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
    marginBottom: 8,
  },
  detail: {
    marginLeft: 8,
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default memo(RentsDetails);
