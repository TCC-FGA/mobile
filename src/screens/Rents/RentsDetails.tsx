import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Surface, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '~/core/theme';
import { RentDTO } from '~/dtos/RentDTO';
// import { getRentById, updateRent } from '~/api/rents';

type RouteParamsProps = {
  rentId?: number;
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

const RentsDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { rentId } = route.params as RouteParamsProps;
  const [rent, setRent] = useState<RentDTO | null>(mockRent);

  useEffect(() => {
    if (rentId) {
      const fetchRent = async () => {
        try {
          // const rentData = await getRentById(rentId);
          // setRent(rentData);
          setRent(mockRent); // Use mock data for now
          navigation.setOptions({ title: 'Detalhes do Aluguel' });
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do aluguel.');
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

      if (result) {
        // Handle the uploaded file
        console.log('Uploaded file:', result);
        Alert.alert('Sucesso', 'Contrato anexado com sucesso!');
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
        // await updateRent(rentId, rent);
        Alert.alert('Sucesso', 'Aluguel atualizado com sucesso!');
      } else {
        // await createRent(rent);
        Alert.alert('Sucesso', 'Aluguel criado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o aluguel.');
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {rent && (
          <Surface style={styles.surface}>
            <Text style={styles.title}>Detalhes do Contrato</Text>
            <Text style={styles.detail}>Valor do Depósito: {rent.deposit_value}</Text>
            <Text style={styles.detail}>Ativo: {rent.active ? 'Sim' : 'Não'}</Text>
            <Text style={styles.detail}>Data de Início: {rent.start_date}</Text>
            <Text style={styles.detail}>Data de Término: {rent.end_date}</Text>
            <Text style={styles.detail}>Valor Base: {rent.base_value}</Text>
            <Text style={styles.detail}>Data de Vencimento: {rent.due_date}</Text>
            <Text style={styles.detail}>Taxa de Reajuste: {rent.reajustment_rate}</Text>
            <Text style={styles.detail}>Nome da Casa: {rent.houseDto.nickname}</Text>
            <Text style={styles.detail}>Nome do Inquilino: {rent.tenantsDTO.name}</Text>
          </Surface>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
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
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
});

export default memo(RentsDetails);
