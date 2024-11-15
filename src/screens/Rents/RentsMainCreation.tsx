import React, { useState, useEffect, memo } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getProperties } from '~/api/properties';
import { getHousesByPropertyId } from '~/api/houses';
import { getTenants } from '~/api/tenants';
import { getTemplates } from '~/api/templates';
import { createRent } from '~/api/rents';
import { PropertiesDTO } from '~/dtos/PropertiesDTO';
import { HouseDTO } from '~/dtos/HouseDTO';
import { TenantDTO } from '~/dtos/TenantDTO';
import { TemplateDTO } from '~/dtos/TemplateDTO';
import { theme } from '~/core/theme';
import { TextInputMask } from 'react-native-masked-text';
import { convertDateInDDMMYYYY, formatDate } from '~/helpers/convert_data';
import { RentCreateDTO } from '~/dtos/RentDTO';
import CustomPicker from '~/components/CustomPicker';

const RentsMainCreation = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [properties, setProperties] = useState<PropertiesDTO[]>([]);
  const [houses, setHouses] = useState<HouseDTO[]>([]);
  const [tenants, setTenants] = useState<TenantDTO[]>([]);
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [rentValue, setRentValue] = useState<string>('');
  const [dueDay, setDueDay] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [loadingHouses, setLoadingHouses] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [depositValue, setDepositValue] = useState<string>('');
  const [reajustment_rate, setReajustment_rate] = useState<string>('IGMP');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertiesData = await getProperties();
        setProperties(propertiesData);
        const tenantsData = await getTenants();
        setTenants(tenantsData);
        const templatesData = await getTemplates();
        setTemplates(templatesData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      const fetchHouses = async () => {
        setLoadingHouses(true);
        try {
          const housesData = await getHousesByPropertyId(Number(selectedProperty));
          setHouses(housesData);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar as casas.');
        } finally {
          setLoadingHouses(false);
        }
      };

      fetchHouses();
    }
  }, [selectedProperty]);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const handleSubmit = async () => {
    if (
      !selectedProperty ||
      !selectedHouse ||
      !selectedTenant ||
      !selectedTemplate ||
      !rentValue ||
      !dueDay ||
      !startDate ||
      !endDate ||
      !reajustment_rate
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newRent = {
      property_id: Number(selectedProperty),
      house_id: Number(selectedHouse),
      tenant_id: Number(selectedTenant),
      template_id: Number(selectedTemplate),
      base_value: Number(rentValue),
      due_date: Number(dueDay),
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      deposit_value: depositValue ? Number(depositValue) : null,
      reajustment_rate: reajustment_rate as RentCreateDTO['reajustment_rate'],
    };

    try {
      await createRent(newRent);
      Alert.alert('Sucesso', 'Contrato de aluguel criado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o contrato de aluguel.');
    }
  };

  const canAdvance = selectedProperty && selectedHouse && selectedTenant;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {currentSection === 1 && (
        <View style={styles.section}>
          <Text variant="titleMedium">
            Escolha a propriedade <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.customPicker}>
            <CustomPicker
              data={properties.map((property) => ({
                label: property.nickname || property.zip_code || 'Propriedade sem nome',
                value: property.id.toString(),
              }))}
              selectedValue={selectedProperty ? selectedProperty.toString() : ''}
              onValueChange={(item) => setSelectedProperty(item.value)}
              title="Propriedade"
              placeholder="Selecione uma propriedade"
              leftIcon="home-city"
            />
            <IconButton
              mode="contained-tonal"
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="plus" size={size} color={theme.colors.primary} />
              )}
              size={24}
              onPress={() =>
                navigation.navigate('PropertiesStack', {
                  screen: 'PropertyDetails',
                  params: {
                    propertie: null,
                  },
                })
              }
            />
          </View>
          {selectedProperty && (
            <>
              {loadingHouses ? (
                <ActivityIndicator animating color={theme.colors.primary} />
              ) : (
                <>
                  <Text variant="titleMedium">
                    Escolha a casa <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.customPicker}>
                    <CustomPicker
                      data={houses.map((house) => ({
                        label: house.nickname || 'Casa sem nome',
                        value: house.id.toString(),
                      }))}
                      selectedValue={selectedHouse ? selectedHouse.toString() : ''}
                      onValueChange={(item) => setSelectedHouse(item.value)}
                      title="Casa"
                      placeholder="Selecione uma casa"
                      leftIcon="home"
                    />
                    <IconButton
                      mode="contained-tonal"
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons
                          name="plus"
                          size={size}
                          color={theme.colors.primary}
                        />
                      )}
                      size={24}
                      onPress={() =>
                        navigation.navigate('HousesStack', {
                          screen: 'HouseDetails',
                          params: {
                            house: null,
                          },
                        })
                      }
                    />
                  </View>
                  <Text variant="titleMedium">
                    Escolha o inquilino<Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.customPicker}>
                    <CustomPicker
                      data={tenants.map((tenant) => ({
                        label: tenant.name,
                        value: tenant.id.toString(),
                      }))}
                      selectedValue={selectedTenant ? selectedTenant.toString() : ''}
                      onValueChange={(item) => setSelectedTenant(item.value)}
                      title="Inquilino"
                      placeholder="Selecione um inquilino"
                      leftIcon="account"
                    />
                    <IconButton
                      mode="contained-tonal"
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons
                          name="plus"
                          size={size}
                          color={theme.colors.primary}
                        />
                      )}
                      size={24}
                      onPress={() =>
                        navigation.navigate('TenantsStack', {
                          screen: 'TenantDetails',
                          params: {
                            tenantId: null,
                          },
                        })
                      }
                    />
                  </View>
                  <Text variant="titleMedium">
                    Escolha o template de contrato <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.customPicker}>
                    <CustomPicker
                      data={templates.map((template) => ({
                        label: template.template_name,
                        value: template.id.toString(),
                      }))}
                      selectedValue={selectedTemplate ? selectedTemplate.toString() : ''}
                      onValueChange={(item) => setSelectedTemplate(item.value)}
                      title="Template"
                      placeholder="Selecione um template"
                      leftIcon="file-document-outline"
                    />
                    <IconButton
                      mode="contained-tonal"
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons
                          name="plus"
                          size={size}
                          color={theme.colors.primary}
                        />
                      )}
                      size={24}
                      onPress={() =>
                        navigation.navigate('ContractsStack', {
                          screen: 'ContractsDetails',
                          params: {
                            templateId: null,
                          },
                        })
                      }
                    />
                  </View>
                  <IconButton
                    mode="contained"
                    icon={({ size, color }) => (
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={size}
                        color={theme.colors.primary}
                      />
                    )}
                    size={48}
                    onPress={() => setCurrentSection(2)}
                    style={styles.nextSectionIcon}
                    disabled={!canAdvance}
                  />
                  <Text style={{ alignSelf: 'center', fontWeight: 'bold' }} variant="titleLarge">
                    Avançar
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      )}
      {currentSection === 2 && (
        <View style={styles.section}>
          <View style={styles.pickerContainer}>
            <CustomPicker
              data={[
                { label: 'IGPM', value: 'IGPM' },
                { label: 'Nenhum', value: 'None' },
              ]}
              selectedValue={reajustment_rate}
              onValueChange={(item) => setReajustment_rate(item.value)}
              title="Reajuste"
              placeholder="Selecione o reajuste"
              leftIcon="percent"
            />
          </View>
          {selectedTemplate &&
            templates.find((template) => template.id.toString() === selectedTemplate)?.warranty ===
              'caução' && (
              <TextInputMask
                type="money"
                value={depositValue}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');
                  setDepositValue(numericValue);
                }}
                style={styles.input}
                keyboardType="numeric"
                customTextInput={TextInput}
                customTextInputProps={{
                  left: (
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
                      )}
                    />
                  ),
                  label: (
                    <Text>
                      Valor da Caução <Text style={{ color: 'red' }}>*</Text>
                    </Text>
                  ),
                }}
              />
            )}
          <TextInputMask
            type="money"
            value={rentValue}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');
              setRentValue(numericValue);
            }}
            style={styles.input}
            keyboardType="numeric"
            customTextInput={TextInput}
            customTextInputProps={{
              left: (
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
                  )}
                />
              ),
              label: (
                <Text>
                  Valor base do Aluguel <Text style={{ color: 'red' }}>*</Text>
                </Text>
              ),
            }}
          />
          <TextInputMask
            type="only-numbers"
            value={dueDay}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              const day = parseInt(numericValue, 10);
              if (numericValue === '') {
                setDueDay('');
                setError('Dia de vencimento é obrigatório');
              } else if (day >= 1 && day <= 30) {
                setDueDay(numericValue);
                setError(null);
              } else {
                setDueDay(numericValue);
                setError('Dia de vencimento inválido');
              }
            }}
            style={styles.input}
            keyboardType="numeric"
            customTextInput={TextInput}
            customTextInputProps={{
              left: (
                <TextInput.Icon
                  icon={({ size, color }) => (
                    <MaterialCommunityIcons name="calendar" size={size} color={color} />
                  )}
                />
              ),
              label: (
                <Text>
                  Dia de Vencimento (dia do mês de 1 a 30) <Text style={{ color: 'red' }}>*</Text>
                </Text>
              ),
              error: !!error,
            }}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            onPress={() => setShowStartDatePicker(true)}
            mode="outlined"
            icon={() => (
              <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.primary} />
            )}
            style={styles.dateButton}>
            Data de Início do Contrato {startDate ? `: ${convertDateInDDMMYYYY(startDate)}` : ''}
          </Button>
          {showStartDatePicker && (
            <RNDateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              accentColor={theme.colors.primary}
              textColor={theme.colors.primary}
            />
          )}
          <Button
            onPress={() => setShowEndDatePicker(true)}
            icon={() => (
              <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.primary} />
            )}
            mode="outlined"
            style={styles.dateButton}>
            Data de Fim do Contrato {endDate ? `: ${convertDateInDDMMYYYY(endDate)}` : ''}
          </Button>
          {showEndDatePicker && (
            <RNDateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              accentColor={theme.colors.primary}
              textColor={theme.colors.primary}
            />
          )}
          <IconButton
            mode="contained"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="check" size={size} color={color} />
            )}
            size={48}
            onPress={handleSubmit}
            disabled={!rentValue || !dueDay || !startDate || !endDate}
            style={styles.nextSectionIcon}
          />
          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }} variant="titleLarge">
            Criar Contrato
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  icon: {
    marginRight: 8,
  },
  nextSectionIcon: {
    alignSelf: 'center',
    marginBottom: 14,
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  customPicker: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});

export default memo(RentsMainCreation);
