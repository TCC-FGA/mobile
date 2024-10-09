import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';

const mockTenant = {
  cpf: '',
  contact: '',
  email: '',
  name: '',
  profession: '',
  marital_status: '',
  birth_date: '',
  emergency_contact: '',
  income: null,
  residents: null,
  street: '',
  neighborhood: '',
  number: null,
  zip_code: '',
  city: '',
  state: '',
};

type RouteParamsProps = {
  tenant?: typeof mockTenant;
};

const TenantDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const { tenant } = route.params as RouteParamsProps;
  const [newTenant, setNewTenant] = useState(tenant || mockTenant);

  useEffect(() => {
    if (tenant) {
      navigation.setOptions({ title: 'Editar Inquilino' });
    } else {
      navigation.setOptions({ title: 'Adicionar Inquilino' });
    }
  }, [tenant, navigation]);

  const handleInputChange = (field: string, value: any) => {
    setNewTenant({ ...newTenant, [field]: value });
  };

  const handleSave = () => {
    if (!newTenant.name || !newTenant.cpf || !newTenant.contact || !newTenant.email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (tenant) {
      Alert.alert('Sucesso', 'Inquilino atualizado com sucesso!');
    } else {
      Alert.alert('Sucesso', 'Inquilino criado com sucesso!');
    }

    navigation.goBack();
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          label="Nome"
          value={newTenant.name}
          style={styles.input}
          onChangeText={(text) => handleInputChange('name', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="CPF"
          value={newTenant.cpf}
          style={styles.input}
          onChangeText={(text) => handleInputChange('cpf', text)}
          keyboardType="numeric"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="card-account-details" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Contato"
          value={newTenant.contact}
          style={styles.input}
          onChangeText={(text) => handleInputChange('contact', text)}
          keyboardType="phone-pad"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="phone" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Email"
          value={newTenant.email}
          style={styles.input}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="email" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Profissão"
          value={newTenant.profession}
          style={styles.input}
          onChangeText={(text) => handleInputChange('profession', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="briefcase" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Estado Civil"
          value={newTenant.marital_status}
          style={styles.input}
          onChangeText={(text) => handleInputChange('marital_status', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="heart" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Data de Nascimento"
          value={newTenant.birth_date}
          style={styles.input}
          onChangeText={(text) => handleInputChange('birth_date', text)}
          placeholder="DD/MM/AAAA"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="calendar" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Contato de Emergência"
          value={newTenant.emergency_contact}
          style={styles.input}
          onChangeText={(text) => handleInputChange('emergency_contact', text)}
          keyboardType="phone-pad"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="phone-in-talk" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Renda"
          value={newTenant.income ? newTenant.income : ''}
          style={styles.input}
          onChangeText={(text) => handleInputChange('income', Number(text))}
          keyboardType="numeric"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Residentes"
          value={newTenant.residents ? newTenant.residents : ''}
          style={styles.input}
          onChangeText={(text) => handleInputChange('residents', Number(text))}
          keyboardType="numeric"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="account-group" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Rua"
          value={newTenant.street}
          style={styles.input}
          onChangeText={(text) => handleInputChange('street', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="road" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Bairro"
          value={newTenant.neighborhood}
          style={styles.input}
          onChangeText={(text) => handleInputChange('neighborhood', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="home-city" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Número"
          value={newTenant.number ? newTenant.number : ''}
          style={styles.input}
          onChangeText={(text) => handleInputChange('number', Number(text))}
          keyboardType="numeric"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="numeric" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="CEP"
          value={newTenant.zip_code}
          style={styles.input}
          onChangeText={(text) => handleInputChange('zip_code', text)}
          keyboardType="numeric"
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="map-marker" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Cidade"
          value={newTenant.city}
          style={styles.input}
          onChangeText={(text) => handleInputChange('city', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="city" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Estado"
          value={newTenant.state}
          style={styles.input}
          onChangeText={(text) => handleInputChange('state', text)}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="map" size={size} color={color} />
              )}
            />
          }
        />
      </ScrollView>
      <View
        style={{
          marginTop: 10,
          padding: 10,
        }}>
        <Button mode="contained" onPress={handleSave} contentStyle={{ paddingHorizontal: 16 }}>
          {tenant ? 'Atualizar Inquilino' : 'Criar Inquilino'}
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()}>
          Cancelar
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: 10,
  },
});

export default memo(TenantDetails);
