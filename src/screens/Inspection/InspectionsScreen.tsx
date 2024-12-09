import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, Linking } from 'react-native';
import {
  Button,
  Text,
  TextInput,
  RadioButton,
  ProgressBar,
  Divider,
  ActivityIndicator,
  Modal,
  Portal,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { InspectionDTO } from '~/dtos/InspectionDTO';
import { createInspection } from '~/api/inspections';
import { formatDate } from '~/helpers/convert_data';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';

const sections = [
  'Pintura',
  'Acabamento',
  'Elétrica',
  'Trincos e Fechaduras',
  'Piso e Azulejos',
  'Vidraçaria e Janelas',
  'Telhado',
  'Hidráulica',
  'Mobilia',
  'Chaves',
];

type RouteParamsProps = {
  rentId: number;
};

const InspectionScreen: React.FC = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { rentId } = route.params as RouteParamsProps;
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inspectionData, setInspectionData] = useState<InspectionDTO>({
    contract_id: rentId,
    data_vistoria: formatDate(new Date()),
    estado_pintura: 'Nova',
    tipo_tinta: 'acrílica',
    cor: null,
    condicao_acabamento: null,
    observacoes_acabamento: null,
    condicao_eletrica: 'Funcionando',
    observacoes_eletrica: null,
    condicao_trincos_fechaduras: null,
    observacoes_trincos_fechaduras: null,
    condicao_piso_azulejos: null,
    observacoes_piso_azulejos: null,
    condicao_vidracaria_janelas: null,
    observacoes_vidracaria_janelas: null,
    condicao_telhado: null,
    observacoes_telhado: null,
    condicao_hidraulica: null,
    observacoes_hidraulica: null,
    observacoes_mobilia: null,
    numero_chaves: null,
    observacoes_chaves: null,
    inspection_photos: [],
  });
  const [visible, setVisible] = useState(true);

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria de fotos.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!pickerResult.canceled) {
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setInspectionData({
          ...inspectionData,
          inspection_photos: [...inspectionData.inspection_photos, pickerResult.assets[0].uri],
        });
      }
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <>
            <Text style={styles.sectionTitle}>Pintura</Text>
            <Text variant="titleMedium">Estado das paredes:</Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setInspectionData({
                  ...inspectionData,
                  estado_pintura: value as InspectionDTO['estado_pintura'],
                })
              }
              value={inspectionData.estado_pintura}>
              <RadioButton.Item label="Nova" value="Nova" />
              <RadioButton.Item label="Em bom estado" value="Em bom estado" />
              <RadioButton.Item label="Com alguns defeitos" value="Com alguns defeitos" />
            </RadioButton.Group>
            <Divider bold />
            <Text className="mt-2" variant="titleMedium">
              Tipo de tinta:
            </Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setInspectionData({
                  ...inspectionData,
                  tipo_tinta: value as InspectionDTO['tipo_tinta'],
                })
              }
              value={inspectionData.tipo_tinta}>
              <RadioButton.Item label="Acrílica" value="acrílica" />
              <RadioButton.Item label="Latex" value="latex" />
            </RadioButton.Group>
            <TextInput
              label="Cor"
              value={inspectionData.cor || ''}
              onChangeText={(text) => setInspectionData({ ...inspectionData, cor: text })}
              style={styles.input}
              left={
                <TextInput.Icon icon={() => <MaterialCommunityIcons name="palette" size={20} />} />
              }
            />
          </>
        );
      case 1:
        return (
          <>
            <Text style={styles.sectionTitle}>Acabamento</Text>
            <TextInput
              label="Condição"
              value={inspectionData.condicao_acabamento || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, condicao_acabamento: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="format-paint" size={20} />}
                />
              }
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_acabamento || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_acabamento: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.sectionTitle}>Elétrica</Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setInspectionData({
                  ...inspectionData,
                  condicao_eletrica: value as InspectionDTO['condicao_eletrica'],
                })
              }
              value={inspectionData.condicao_eletrica}>
              <RadioButton.Item label="Funcionando" value="Funcionando" />
              <RadioButton.Item label="Com problemas" value="Com problemas" />
              <RadioButton.Item label="Desligada" value="Desligada" />
            </RadioButton.Group>
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_eletrica || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_eletrica: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.sectionTitle}>Trincos e Fechaduras</Text>
            <TextInput
              label="Condição"
              value={inspectionData.condicao_trincos_fechaduras || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, condicao_trincos_fechaduras: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon icon={() => <MaterialCommunityIcons name="lock" size={20} />} />
              }
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_trincos_fechaduras || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_trincos_fechaduras: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.sectionTitle}>Piso e Azulejos</Text>
            <TextInput
              label="Condição"
              value={inspectionData.condicao_piso_azulejos || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, condicao_piso_azulejos: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="floor-plan" size={20} />}
                />
              }
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_piso_azulejos || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_piso_azulejos: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 5:
        return (
          <>
            <Text style={styles.sectionTitle}>Vidraçaria e Janelas</Text>
            <TextInput
              label="Condição"
              value={inspectionData.condicao_vidracaria_janelas || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, condicao_vidracaria_janelas: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="window-closed" size={20} />}
                />
              }
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_vidracaria_janelas || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_vidracaria_janelas: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 6:
        return (
          <>
            <Text style={styles.sectionTitle}>Telhado</Text>
            <TextInput
              label="Condição"
              value={inspectionData.condicao_telhado || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, condicao_telhado: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="home-roof" size={20} />}
                />
              }
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_telhado || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_telhado: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 7:
        return (
          <>
            <Text style={styles.sectionTitle}>Hidráulica</Text>
            <TextInput
              label="Condição"
              value={inspectionData.condicao_hidraulica || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, condicao_hidraulica: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="water-pump" size={20} />}
                />
              }
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_hidraulica || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_hidraulica: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      case 8:
        return (
          <>
            <Text style={styles.sectionTitle}>Mobilia</Text>
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_mobilia || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_mobilia: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon icon={() => <MaterialCommunityIcons name="sofa" size={20} />} />
              }
            />
          </>
        );
      case 9:
        return (
          <>
            <Text style={styles.sectionTitle}>Chaves</Text>
            <TextInput
              label="Número de Chaves"
              value={inspectionData.numero_chaves ? inspectionData.numero_chaves.toString() : ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, numero_chaves: parseInt(text, 10) })
              }
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="key" size={20} />} />}
            />
            <TextInput
              label="Observações"
              value={inspectionData.observacoes_chaves || ''}
              onChangeText={(text) =>
                setInspectionData({ ...inspectionData, observacoes_chaves: text })
              }
              style={styles.input}
              left={
                <TextInput.Icon
                  icon={() => <MaterialCommunityIcons name="note-text" size={20} />}
                />
              }
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data_vistoria', inspectionData.data_vistoria);
      formData.append('estado_pintura', inspectionData.estado_pintura);
      formData.append('tipo_tinta', inspectionData.tipo_tinta);
      formData.append('cor', inspectionData.cor || '');
      formData.append('condicao_acabamento', inspectionData.condicao_acabamento || '');
      formData.append('observacoes_acabamento', inspectionData.observacoes_acabamento || '');
      formData.append('condicao_eletrica', inspectionData.condicao_eletrica);
      formData.append('observacoes_eletrica', inspectionData.observacoes_eletrica || '');
      formData.append(
        'condicao_trincos_fechaduras',
        inspectionData.condicao_trincos_fechaduras || ''
      );
      formData.append(
        'observacoes_trincos_fechaduras',
        inspectionData.observacoes_trincos_fechaduras || ''
      );
      formData.append('condicao_piso_azulejos', inspectionData.condicao_piso_azulejos || '');
      formData.append('observacoes_piso_azulejos', inspectionData.observacoes_piso_azulejos || '');
      formData.append(
        'condicao_vidracaria_janelas',
        inspectionData.condicao_vidracaria_janelas || ''
      );
      formData.append(
        'observacoes_vidracaria_janelas',
        inspectionData.observacoes_vidracaria_janelas || ''
      );
      formData.append('condicao_telhado', inspectionData.condicao_telhado || '');
      formData.append('observacoes_telhado', inspectionData.observacoes_telhado || '');
      formData.append('condicao_hidraulica', inspectionData.condicao_hidraulica || '');
      formData.append('observacoes_hidraulica', inspectionData.observacoes_hidraulica || '');
      formData.append('observacoes_mobilia', inspectionData.observacoes_mobilia || '');
      formData.append('numero_chaves', inspectionData.numero_chaves?.toString() || '');
      formData.append('observacoes_chaves', inspectionData.observacoes_chaves || '');
      inspectionData.inspection_photos.forEach((photo, index) => {
        formData.append(`inspection_photos`, {
          uri: photo,
          name: `photo_${index}.jpg`,
          type: 'image/jpeg',
        } as any);
      });
      console.log('formData:', formData);
      const response = await createInspection(inspectionData.contract_id, formData);
      Alert.alert('Sucesso', 'Relatório de vistoria criado com sucesso!');
      Linking.openURL(response.pdf_inspection);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o relatório de vistoria.');
      console.error('Erro ao criar relatório de vistoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const hideModal = () => setVisible(false);

  return (
    <>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalText}>Crie o laudo de vistoria do imóvel a ser alugado.</Text>
            <Text className="mt-2 mb-4">Preencha as informações de cada seção.</Text>
            <Button mode="contained" onPress={hideModal} style={styles.modalButton}>
              Iniciar
            </Button>
          </Modal>
        </Portal>
        <ProgressBar progress={(currentSection + 1) / sections.length} style={styles.progressBar} />
        <ScrollView style={styles.scrollView}>
          {renderSection()}
          <Button icon="camera" mode="contained" onPress={pickImage} style={styles.button}>
            Anexar Foto
          </Button>
          <View style={styles.imageContainer}>
            {inspectionData.inspection_photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.image} />
            ))}
          </View>
        </ScrollView>
        <View style={styles.navigationButtons}>
          <Button mode="outlined" onPress={handlePreviousSection} disabled={currentSection === 0}>
            Anterior
          </Button>
          {currentSection === sections.length - 1 ? (
            <Button mode="contained" onPress={handleSubmit} loading={loading}>
              {loading ? 'Gerando Relatório...' : 'Gerar Relatório de Vistoria'}
            </Button>
          ) : (
            <Button mode="contained" onPress={handleNextSection}>
              Próximo
            </Button>
          )}
        </View>
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
  progressBar: {
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'center',
  },
});

export default InspectionScreen;
