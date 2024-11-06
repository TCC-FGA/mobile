import React, { useState, useEffect, memo } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
      !endDate
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
          <Text>
            Escolha a propriedade <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
            <MaterialCommunityIcons
              name="home-city"
              size={24}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Picker
              selectedValue={selectedProperty}
              onValueChange={(itemValue) => setSelectedProperty(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Selecione uma propriedade" value="" />
              {properties.map((property) => (
                <Picker.Item
                  key={property.id}
                  label={property.nickname || property.zip_code || 'Propriedade sem nome'}
                  value={property.id.toString()}
                />
              ))}
            </Picker>
            <IconButton
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
                  <Text>
                    Escolha a casa <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.pickerContainer}>
                    <MaterialCommunityIcons
                      name="home"
                      size={24}
                      color={theme.colors.primary}
                      style={styles.icon}
                    />
                    <Picker
                      selectedValue={selectedHouse}
                      onValueChange={(itemValue) => setSelectedHouse(itemValue)}
                      style={styles.picker}>
                      <Picker.Item label="Selecione uma casa" value="" />
                      {houses.length === 0 ? (
                        <Picker.Item label="Nenhuma casa encontrada" value="" />
                      ) : (
                        houses.map((house) => (
                          <Picker.Item
                            key={house.id}
                            label={house.nickname || 'Casa sem nome'}
                            value={house.id.toString()}
                          />
                        ))
                      )}
                    </Picker>
                    <IconButton
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
                  <Text>
                    Escolha o inquilino <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <View style={styles.pickerContainer}>
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color={theme.colors.primary}
                      style={styles.icon}
                    />
                    <Picker
                      selectedValue={selectedTenant}
                      onValueChange={(itemValue) => setSelectedTenant(itemValue)}
                      style={styles.picker}>
                      <Picker.Item label="Selecione um inquilino" value="" />
                      {tenants.map((tenant) => (
                        <Picker.Item
                          key={tenant.id}
                          label={tenant.name}
                          value={tenant.id.toString()}
                        />
                      ))}
                    </Picker>
                    <IconButton
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
                  <IconButton
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
                </>
              )}
            </>
          )}
        </View>
      )}
      {currentSection === 2 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolher Template de Contrato</Text>
          <View style={styles.pickerContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Picker
              selectedValue={selectedTemplate}
              onValueChange={(itemValue) => setSelectedTemplate(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Selecione um template" value="" />
              {templates.map((template) => (
                <Picker.Item
                  key={template.id}
                  label={template.template_name}
                  value={template.id.toString()}
                />
              ))}
            </Picker>
          </View>
          {/* <TextInput
            label="Valor do Aluguel"
            value={rentValue}
            onChangeText={setRentValue}
            keyboardType="numeric"
            style={styles.input}
          /> */}
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
          {/* <TextInput
            label="Dia de Vencimento"
            value={dueDay}
            onChangeText={setDueDay}
            keyboardType="numeric"
            style={styles.input}
          /> */}
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
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="check" size={size} color={color} />
            )}
            size={48}
            onPress={handleSubmit}
            style={styles.nextSectionIcon}
          />
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
    marginBottom: 24,
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
});

export default memo(RentsMainCreation);
