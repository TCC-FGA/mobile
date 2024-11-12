import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Modal, TextInput, Button, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createGuarantor, getGuarantorByTenantId, updateGuarantor } from '~/api/guarantors';
import { GuarantorDTO } from '~/dtos/GuarantorDTO';
import { TextInputMask } from 'react-native-masked-text';
import CustomPicker from '../CustomPicker';
import { statesOfBrazil } from '~/dtos/PropertiesDTO';

type GuarantorComponentProps = {
  tenantId: number;
  visible: boolean;
  onClose: () => void;
};

const GuarantorComponent: React.FC<GuarantorComponentProps> = ({ tenantId, visible, onClose }) => {
  const [guarantorData, setGuarantorData] = useState<Partial<GuarantorDTO>>({
    tenant_id: tenantId,
    cpf: '',
    contact: '',
    email: '',
    name: '',
    profession: '',
    marital_status: '',
    birth_date: '',
    comment: '',
    income: null,
    street: '',
    neighborhood: '',
    number: null,
    zip_code: '',
    city: '',
    state: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [guarantorId, setGuarantorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchGuarantor = async () => {
      try {
        const guarantors = await getGuarantorByTenantId(tenantId);
        if (guarantors.length > 0) {
          setGuarantorData(guarantors[0]);
          setGuarantorId(guarantors[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do fiador.');
        onClose();
        console.error('Erro ao carregar os dados do fiador:', error);
      }
    };

    if (visible) {
      fetchGuarantor();
    }
  }, [tenantId, visible]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (guarantorId) {
        await updateGuarantor(guarantorId, guarantorData);
        Alert.alert('Sucesso', 'Fiador atualizado com sucesso!');
      } else {
        await createGuarantor(tenantId, guarantorData);
        Alert.alert('Sucesso', 'Fiador cadastrado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o fiador.');
      console.error('Erro ao salvar o fiador:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          label="Nome"
          value={guarantorData.name || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, name: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              )}
            />
          }
        />
        <TextInputMask
          type="cpf"
          value={guarantorData.cpf || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, cpf: text })}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="card-account-details" size={size} color={color} />
                )}
              />
            ),
            label: 'CPF',
          }}
        />
        <TextInputMask
          type="cel-phone"
          options={{
            maskType: 'BRL',
            withDDD: true,
            dddMask: '(99) ',
          }}
          value={guarantorData.contact || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, contact: text })}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="phone" size={size} color={color} />
                )}
              />
            ),
            label: 'Contato',
          }}
        />
        <TextInput
          label="Email"
          value={guarantorData.email || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, email: text })}
          style={styles.input}
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
          value={guarantorData.profession || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, profession: text })}
          style={styles.input}
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
          value={guarantorData.marital_status || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, marital_status: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="account-heart" size={size} color={color} />
              )}
            />
          }
        />
        <TextInputMask
          type="datetime"
          options={{
            format: 'DD/MM/YYYY',
          }}
          value={guarantorData.birth_date || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, birth_date: text })}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="calendar" size={size} color={color} />
                )}
              />
            ),
            label: 'Data de Nascimento',
          }}
        />
        <TextInput
          label="Renda"
          value={guarantorData.income ? guarantorData.income.toString() : ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, income: parseFloat(text) })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
              )}
            />
          }
          keyboardType="numeric"
        />
        <TextInput
          label="Rua"
          value={guarantorData.street || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, street: text })}
          style={styles.input}
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
          value={guarantorData.neighborhood || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, neighborhood: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="map-marker" size={size} color={color} />
              )}
            />
          }
        />
        <TextInput
          label="Número"
          value={guarantorData.number ? guarantorData.number.toString() : ''}
          onChangeText={(text) =>
            setGuarantorData({ ...guarantorData, number: parseInt(text, 10) })
          }
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="numeric" size={size} color={color} />
              )}
            />
          }
          keyboardType="numeric"
        />
        <TextInputMask
          type="zip-code"
          value={guarantorData.zip_code || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, zip_code: text })}
          style={styles.input}
          keyboardType="numeric"
          customTextInput={TextInput}
          customTextInputProps={{
            left: (
              <TextInput.Icon
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="mailbox" size={size} color={color} />
                )}
              />
            ),
            label: (
              <Text>
                CEP <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
          }}
        />
        <TextInput
          label="Cidade"
          value={guarantorData.city || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, city: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="city" size={size} color={color} />
              )}
            />
          }
        />
        <CustomPicker
          data={statesOfBrazil}
          selectedValue={guarantorData.state || ''}
          onValueChange={(value) => setGuarantorData({ ...guarantorData, state: value.value })}
          placeholder="Selecione um estado"
          leftIcon="map-marker"
          title="Estado"
        />
        <TextInput
          className="mt-2"
          label="Observação"
          value={guarantorData.comment || ''}
          onChangeText={(text) => setGuarantorData({ ...guarantorData, comment: text })}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={({ size, color }) => (
                <MaterialCommunityIcons name="comment" size={size} color={color} />
              )}
            />
          }
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSave} style={styles.button} loading={isLoading}>
          Salvar
        </Button>
        <Button mode="text" onPress={onClose} style={styles.button}>
          Cancelar
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  scrollContainer: {
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
  },
});

export default GuarantorComponent;
