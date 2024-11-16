import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet, Linking } from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  Text,
  IconButton,
  ActivityIndicator,
  Divider,
  Modal,
  Portal,
  Card,
  Avatar,
  Appbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '~/core/theme';
import { RentDTO } from '~/dtos/RentDTO';
import {
  getRentById,
  updateRent,
  updatePdfRent,
  getPdfByContractId,
  deleteRent,
} from '~/api/rents';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { createPaymentInstallment, getPaymentInstallments } from '~/api/payments';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import { convertDateInDDMMYYYY, parseFloatBR } from '~/helpers/convert_data';
import { parse, set } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getInspectionByContractId, submitSignedInspection } from '~/api/inspections';
import { ResponseInspectionDTO } from '~/dtos/InspectionDTO';

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
  const [inspection, setInspection] = useState<ResponseInspectionDTO | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (rentId) {
      const fetchRent = async () => {
        setIsLoadingPage(true);
        try {
          const rentData = await getRentById(rentId);
          const hasPayments = await getPaymentInstallments(rentId);
          const inspectionData = await getInspectionByContractId(rentId);
          setPayments(hasPayments);
          setRent(rentData);
          setInspection(inspectionData);
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

  const openPdfNotSigned = async () => {
    if (!rent) return;

    try {
      const pdfBlob = await getPdfByContractId(rent.id);
      const pdfUri = `${FileSystem.documentDirectory}Contrato_Aluguel.pdf`;
      await FileSystem.writeAsStringAsync(pdfUri, pdfBlob, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert('Erro', 'A visualização do PDF não está disponível no dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter o PDF.');
      console.error('Erro ao obter o PDF:', error);
    }
  };

  const handleDeleteContract = async () => {
    if (!rent) return;

    Alert.alert(
      'Excluir Contrato',
      'Você tem certeza que deseja excluir este contrato?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRent(rent.id);
              Alert.alert('Sucesso', 'Contrato excluído com sucesso!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o contrato.');
              console.error('Erro ao excluir o contrato:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUploadInspection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.assets && rent && inspection) {
        const formData = new FormData();
        formData.append('inspection_pdf', {
          uri: result.assets[0].uri,
          name: 'signed_inspection.pdf',
          type: 'application/pdf',
        } as any);

        await submitSignedInspection(inspection.id, formData);
        Alert.alert('Sucesso', 'Laudo de vistoria assinado enviado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível anexar o laudo de vistoria.');
      console.error('Erro ao anexar o laudo de vistoria:', error);
    }
  };

  const showMenuOption = () => {
    if (!rent) return;

    setModalVisible(true);
  };

  return (
    <>
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Meus Aluguéis" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="dots-vertical" onPress={showMenuOption} />
      </Appbar.Header>
      {isLoadingPage ? (
        <ActivityIndicator animating color={theme.colors.primary} style={{ flex: 1 }} />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#fff' }}>
            {rent && (
              <Surface style={styles.surface}>
                <View style={styles.detailContainer} className="mb-4 justify-center">
                  <Text style={{ fontWeight: 'bold' }} variant="headlineSmall">
                    Detalhes do Contrato
                  </Text>
                </View>
                <Divider bold className="mb-2" theme={{ colors: { primary: 'green' } }} />
                <View className="p-3 justify-center">
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="calendar-start"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Data de Início:{' '}
                      <Text style={styles.detailValue}>
                        {convertDateInDDMMYYYY(parse(rent.start_date, 'yyyy-MM-dd', new Date()))}
                      </Text>
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
                      <Text style={styles.detailValue}>
                        {convertDateInDDMMYYYY(parse(rent.end_date, 'yyyy-MM-dd', new Date()))}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="currency-usd"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Valor Base:{' '}
                      <Text style={styles.detailValue}>R${parseFloatBR(rent.base_value)}</Text>
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleSmall" style={styles.detail}>
                      Dia de Vencimento: <Text style={styles.detailValue}>{rent.due_date}</Text>
                    </Text>
                  </View>
                  {rent.reajustment_rate && rent.reajustment_rate !== 'None' && (
                    <View style={styles.detailContainer}>
                      <MaterialCommunityIcons
                        name="percent"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <Text variant="titleSmall" style={styles.detail}>
                        Taxa de Reajuste:{' '}
                        <Text style={styles.detailValue}>{rent.reajustment_rate}%</Text>
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons name="home" size={24} color={theme.colors.primary} />
                    <Text variant="titleSmall" style={styles.detail}>
                      Nome da Casa: <Text style={styles.detailValue}>{rent.house.nickname}</Text>
                    </Text>
                  </View>
                  <View style={styles.detailContainer}>
                    <MaterialCommunityIcons name="account" size={24} color={theme.colors.primary} />
                    <Text variant="titleSmall" style={styles.detail}>
                      Nome do Inquilino: <Text style={styles.detailValue}>{rent.tenant.name}</Text>
                    </Text>
                  </View>
                  <Divider bold className="mb-4" theme={{ colors: { primary: 'green' } }} />
                  {rent.signed_pdf && (
                    <View style={styles.detailContainer}>
                      <MaterialCommunityIcons
                        name="file-pdf-box"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <Text
                        variant="titleSmall"
                        style={[styles.detail, { color: theme.colors.primary }]}
                        onPress={() => Linking.openURL(rent.signed_pdf || '')}>
                        Contrato Assinado:{' '}
                        <Text style={styles.detailValue}>Clique aqui para abrir</Text>
                      </Text>
                    </View>
                  )}
                  {inspection?.pdf_inspection && !inspection.signed_pdf && (
                    <View style={styles.detailContainer}>
                      <MaterialCommunityIcons
                        name="file-pdf-box"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <Text
                        variant="titleSmall"
                        style={[styles.detail, { color: theme.colors.primary }]}
                        onPress={() => Linking.openURL(inspection.pdf_inspection || '')}>
                        Laudo de Vistoria:{' '}
                        <Text style={styles.detailValue}>Clique aqui para abrir</Text>
                      </Text>
                    </View>
                  )}
                  {inspection?.signed_pdf && (
                    <Button
                      icon="file-pdf-box"
                      mode="outlined"
                      onPress={() => Linking.openURL(inspection.signed_pdf || '')}>
                      Ver Laudo de Vistoria Assinado
                    </Button>
                  )}
                  <Button
                    icon="open-in-new"
                    className="mt-2"
                    mode="outlined"
                    onPress={openPdfNotSigned}>
                    Ver contrato
                  </Button>
                </View>
              </Surface>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            {hasPayments && hasPayments.length > 0 ? (
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate('PaymentsStack', {
                    screen: 'PaymentsScreen',
                    params: { contractId: rent?.id },
                  })
                }
                icon={() => (
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={20}
                    color={theme.colors.primary}
                  />
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
            {!rent?.signed_pdf && (
              <Button
                mode="contained"
                onPress={handleUploadContract}
                icon={() => <MaterialCommunityIcons name="upload" size={20} color="#fff" />}
                contentStyle={{ paddingHorizontal: 16 }}
                style={styles.button}>
                Anexar Contrato Assinado
              </Button>
            )}
            {!inspection?.signed_pdf && inspection?.pdf_inspection && (
              <Button
                mode="contained"
                onPress={handleUploadInspection}
                icon={() => <MaterialCommunityIcons name="upload" size={20} color="#fff" />}
                contentStyle={{ paddingHorizontal: 16 }}
                style={styles.button}>
                Anexar Laudo de vistoria Assinado
              </Button>
            )}
            {!inspection?.pdf_inspection && rent?.id && (
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate('InspectionsStack', {
                    screen: 'InspectionsScreen',
                    params: { rentId: rent?.id },
                  })
                }
                icon={() => (
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
                contentStyle={{ paddingHorizontal: 16 }}
                style={styles.button}>
                Gerar Laudo de Vistoria
              </Button>
            )}
          </View>
        </>
      )}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Opções</Text>
          <Button
            mode="contained"
            icon={() => <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />}
            onPress={handleUploadContract}
            disabled={!rent?.signed_pdf}
            style={styles.modalButton}>
            Atualizar Contrato Assinado
          </Button>
          <Button
            mode="contained"
            icon={() => <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />}
            onPress={handleUploadInspection}
            disabled={!inspection?.pdf_inspection}
            style={styles.modalButton}>
            Atualizar Vistoria Assinada
          </Button>
          <Button mode="text" onPress={() => setModalVisible(false)} style={styles.modalButton}>
            Cancelar
          </Button>
        </Modal>
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
  detailValue: {
    color: '#494c4e',
    fontWeight: 'semibold',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  modalButton: {
    marginVertical: 8,
  },
});

export default memo(RentsDetails);
