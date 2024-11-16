import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getTenantById, createTenant, updateTenant } from '~/api/tenants';
import { TenantDTO } from '~/dtos/TenantDTO';
import { convertDateInDDMMYYYY, formatDate } from '~/helpers/convert_data';
import { theme } from '~/core/theme';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import { err } from 'react-native-svg';

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

  const [errors, setErrors] = useState({
    name: false,
    cpf: false,
    contact: false,
    email: false,
    zip_code: false,
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

  const validateFields = () => {
    const newErrors = {
      name: !newTenant.name,
      cpf: !newTenant.cpf,
      contact: !newTenant.contact,
      email: !newTenant.email,
      zip_code: !newTenant.zip_code,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = async () => {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    // limpar mascaras
    newTenant.cpf = newTenant.cpf.replace(/[^0-9]+/g, '');
    newTenant.contact = newTenant.contact.replace(/[^0-9]+/g, '');
    newTenant.emergency_contact = newTenant.emergency_contact
      ? newTenant?.emergency_contact?.replace(/[^0-9]+/g, '')
      : null;

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
          label={
            <Text>
              Nome <Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
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
        {errors.name && (
          <HelperText type="error" visible={errors.name}>
            Nome é obrigatório!
          </HelperText>
        )}
        <TextInputMask
          type="cpf"
          value={newTenant.cpf}
          onChangeText={(text) => handleInputChange('cpf', text)}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: (
              <Text>
                CPF <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="card-account-details" size={size} color={color} />
                )}
              />
            ),
          }}
        />
        {errors.cpf && (
          <HelperText type="error" visible={errors.cpf}>
            CPF é obrigatório!
          </HelperText>
        )}
        <TextInputMask
          type="cel-phone"
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) ',
          }}
          value={newTenant.contact}
          onChangeText={(text) => handleInputChange('contact', text)}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: (
              <Text>
                Contato <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="phone" size={size} color={color} />
                )}
              />
            ),
          }}
        />
        {errors.contact && (
          <HelperText type="error" visible={errors.contact}>
            Contato é obrigatório!
          </HelperText>
        )}
        <TextInput
          label={
            <Text>
              Email <Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
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
        {errors.email && (
          <HelperText type="error" visible={errors.email}>
            Email é obrigatório!
          </HelperText>
        )}
        <TextInputMask
          type="zip-code"
          value={newTenant.zip_code}
          onChangeText={(text) => handleInputChange('zip_code', text)}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: (
              <Text>
                CEP <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="map-marker" size={size} color={color} />
                )}
              />
            ),
          }}
        />
        {errors.zip_code && (
          <HelperText type="error" visible={errors.zip_code}>
            CEP é obrigatório!
          </HelperText>
        )}
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
                handleInputChange('birth_date', formatDate(currentDate));
              }}
              accentColor={theme.colors.primary}
              textColor={theme.colors.primary}
            />
          )}
        </>
        <TextInputMask
          type="cel-phone"
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) ',
          }}
          value={newTenant.emergency_contact || ''}
          onChangeText={(text) => handleInputChange('emergency_contact', text)}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: 'Contato de Emergência',
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="phone-in-talk" size={size} color={color} />
                )}
              />
            ),
          }}
        />
        <TextInputMask
          type="money"
          value={newTenant.income ? newTenant.income.toString() : ''}
          onChangeText={(text) =>
            handleInputChange('income', Number(text.replace(/[^0-9,-]+/g, '')))
          }
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: 'Renda',
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
                )}
              />
            ),
          }}
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
