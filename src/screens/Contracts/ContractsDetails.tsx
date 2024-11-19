import React, { useState, useEffect, memo } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Switch, RadioButton, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getTemplateById, createTemplate, updateTemplate } from '~/api/templates';
import { TemplateDTO } from '~/dtos/TemplateDTO';
import { theme } from '~/core/theme';

type RouteParamsProps = {
  templateId?: number;
};

const ContractDetails = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { templateId } = route.params as RouteParamsProps;

  const [newTemplate, setNewTemplate] = useState<TemplateDTO>({
    id: 0,
    template_name: '',
    description: null,
    garage: false,
    warranty: 'nenhum',
    animals: false,
    sublease: false,
    contract_type: 'residencial',
  });

  useEffect(() => {
    if (templateId) {
      const fetchTemplate = async () => {
        try {
          const template = await getTemplateById(templateId);
          setNewTemplate(template);
          navigation.setOptions({ title: 'Editar Template de Contrato' });
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do template.');
        }
      };

      fetchTemplate();
    } else {
      navigation.setOptions({ title: 'Adicionar Template de Contrato' });
    }
  }, [templateId, navigation]);

  const handleInputChange = (field: string, value: any) => {
    setNewTemplate({ ...newTemplate, [field]: value });
  };

  const handleSave = async () => {
    if (!newTemplate.template_name || !newTemplate.warranty) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (templateId) {
        await updateTemplate(templateId, newTemplate);
        Alert.alert('Sucesso', 'Template de contrato atualizado com sucesso!');
      } else {
        await createTemplate(newTemplate);
        Alert.alert('Sucesso', 'Template de contrato criado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o template de contrato.');
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          label="Nome do Modelo"
          value={newTemplate.template_name}
          style={styles.input}
          onChangeText={(text) => handleInputChange('template_name', text)}
          left={
            <TextInput.Icon
              icon={({ size, color = theme.colors.primary }) => (
                <MaterialCommunityIcons
                  name="file-document"
                  size={size}
                  color={theme.colors.primary}
                />
              )}
            />
          }
        />
        <TextInput
          label="Descrição"
          value={newTemplate.description || ''}
          style={styles.input}
          onChangeText={(text) => handleInputChange('description', text)}
          left={
            <TextInput.Icon
              icon={({ size }) => (
                <MaterialCommunityIcons name="text" size={size} color={theme.colors.primary} />
              )}
            />
          }
        />
        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Garantia:</Text>
          <RadioButton.Group
            onValueChange={(value) => handleInputChange('warranty', value)}
            value={newTemplate.warranty}>
            <View style={styles.radioItem}>
              <RadioButton value="fiador" />
              <Text>Fiador</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="caução" />
              <Text>Caução</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="nenhum" />
              <Text>Nenhum</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            style={styles.switch}
            value={newTemplate.garage}
            onValueChange={(value) => handleInputChange('garage', value)}
          />
          <Text style={styles.switchLabel}>Garagem</Text>
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons name="garage" size={30} color={theme.colors.primary} />
            )}
          />
        </View>
        <View style={styles.switchContainer}>
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons name="dog" size={30} color={theme.colors.primary} />
            )}
          />
          <Switch
            style={styles.switch}
            value={newTemplate.animals}
            onValueChange={(value) => handleInputChange('animals', value)}
          />
          <Text style={styles.switchLabel}>Animais</Text>
        </View>
        <View style={styles.switchContainer}>
          <TextInput.Icon
            icon={() => (
              <MaterialCommunityIcons name="home-group" size={30} color={theme.colors.primary} />
            )}
          />
          <Switch
            style={styles.switch}
            value={newTemplate.sublease}
            onValueChange={(value) => handleInputChange('sublease', value)}
          />
          <Text style={styles.switchLabel}>Subarrendamento</Text>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Tipo de Contrato:</Text>
          <RadioButton.Group
            onValueChange={(value) => handleInputChange('contract_type', value)}
            value={newTemplate.contract_type}>
            <View style={styles.radioItem}>
              <RadioButton value="residencial" />
              <Text>Residencial</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="comercial" />
              <Text>Comercial</Text>
            </View>
          </RadioButton.Group>
        </View>
      </ScrollView>
      <View
        style={{
          marginTop: 10,
          padding: 10,
        }}>
        <Button mode="contained" onPress={handleSave} contentStyle={{ paddingHorizontal: 16 }}>
          {templateId ? 'Atualizar Template' : 'Criar Modelo'}
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 0,
  },
  switchLabel: {
    marginLeft: 10,
    fontVariant: ['small-caps'],
  },
  radioContainer: {
    marginBottom: 10,
  },
  radioLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  switch: { color: theme.colors.primary, marginLeft: 30 },
});

export default memo(ContractDetails);
