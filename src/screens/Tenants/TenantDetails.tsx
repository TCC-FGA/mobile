import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getTenantById, createTenant, updateTenant } from '~/api/tenants';
import { TenantDTO } from '~/dtos/TenantDTO';
import { convertDateInDDMMYYYY } from '~/helpers/convert_data';
import { theme } from '~/core/theme';
import RNDateTimePicker from '@react-native-community/datetimepicker';

type RouteParamsProps = {
  tenantId?: number;
};

const TenantDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { tenantId } = route.params as RouteParamsProps;
  const [newTenant, setNewTenant] = useState<TenantDTO>({
    id: 0,
    cpf: '',
    contact: '',
    email: null,
    name: '',
    profession: null,
    marital_status: null,
    birth_date: null,
    emergency_contact: '',
    income: null,
    residents: null,
    street: '',
    neighborhood: '',
    number: null,
    zip_code: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (tenantId) {
      const fetchTenant = async () => {
        try {
          const tenant = await getTenantById(tenantId);
          setNewTenant(tenant);
          navigation.setOptions({ title: 'Editar Inquilino' });
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do inquilino.');
        }
      };

      fetchTenant();
    } else {
      navigation.setOptions({ title: 'Adicionar Inquilino' });
    }
  }, [tenantId, navigation]);

  const handleInputChange = (field: string, value: any) => {
    setNewTenant({ ...newTenant, [field]: value });
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    if (!newTenant.name || !newTenant.cpf || !newTenant.contact || !newTenant.email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (tenantId) {
        await updateTenant(tenantId, newTenant);
        Alert.alert('Sucesso', 'Inquilino atualizado com sucesso!');
      } else {
        await createTenant(newTenant);
        Alert.alert('Sucesso', 'Inquilino criado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o inquilino.');
    }
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
          value={newTenant.email || ''}
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
          value={newTenant.profession || ''}
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
          value={newTenant.marital_status || ''}
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
        <>
          <Button
            className="mb-2"
            mode="outlined"
            onPress={showDatePickerHandler}
            icon={() => (
              <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.primary} />
            )}>
            Data de nascimento{' '}
            {newTenant.birth_date
              ? `: ${convertDateInDDMMYYYY(new Date(newTenant.birth_date))}`
              : ''}
          </Button>

          {showDatePicker && (
            <RNDateTimePicker
              value={newTenant.birth_date ? new Date(newTenant.birth_date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || new Date();
                setShowDatePicker(Platform.OS === 'ios');
                handleInputChange('birth_date', currentDate.toISOString());
              }}
              accentColor={theme.colors.primary}
              textColor={theme.colors.primary}
            />
          )}
        </>
        <TextInput
          label="Contato de Emergência"
          value={newTenant.emergency_contact || ''}
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
          value={newTenant.income ? newTenant.income.toString() : ''}
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
          value={newTenant.residents ? newTenant.residents.toString() : ''}
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
          value={newTenant.street || ''}
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
          value={newTenant.neighborhood || ''}
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
          value={newTenant.number ? newTenant.number.toString() : ''}
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
          value={newTenant.zip_code || ''}
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
          value={newTenant.city || ''}
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
          value={newTenant.state || ''}
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
          {tenantId ? 'Atualizar Inquilino' : 'Criar Inquilino'}
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
