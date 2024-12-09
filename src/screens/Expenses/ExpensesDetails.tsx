import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Appbar, RadioButton, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getHouses, getHouseById } from '~/api/houses';
import { createExpense, getExpenseById, updateExpense } from '~/api/expenses';
import { HouseDTO } from '~/dtos/HouseDTO';
import { ExpenseDTO } from '~/dtos/ExpenseDTO';
import CustomPicker from '~/components/CustomPicker';
import { TextInputMask } from 'react-native-masked-text';
import { convertStringDateInDDMMYYYY, convertStringDateToYYYYMMDD } from '~/helpers/convert_data';
import { theme } from '~/core/theme';

type RouteParamsProps = {
  houseId?: number;
  expenseId?: number;
};

const ExpenseDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { houseId, expenseId } = route.params as RouteParamsProps;

  const [houses, setHouses] = useState<HouseDTO[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<HouseDTO | null>(null);
  const [expenseData, setExpenseData] = useState<Partial<ExpenseDTO>>({
    expense_type: 'manutenção',
    value: '0' as string,
    expense_date: '06/12/2024',
    house_id: houseId || 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const data = await getHouses();
        setHouses(data);
        if (houseId) {
          const house = data.find((h) => h.id === houseId);
          setSelectedHouse(house || null);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter as casas.');
        console.error('Erro ao obter as casas:', error);
      }
    };

    const fetchExpense = async () => {
      if (expenseId && houseId) {
        try {
          const data = await getExpenseById(expenseId, houseId);
          setExpenseData(data);
          const house = await getHouseById(data.house_id);
          setSelectedHouse(house);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível obter os dados da despesa.');
          console.error('Erro ao obter os dados da despesa:', error);
        }
      }
    };

    fetchHouses();
    fetchExpense();
  }, [houseId, expenseId]);

  const handleSave = async () => {
    const { expense_type, value, expense_date, house_id } = expenseData;

    if (!expense_type || !value || !expense_date || !house_id) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const updatedExpenseData = {
        ...expenseData,
        expense_date: convertStringDateToYYYYMMDD(expense_date as string),
      };

      if (expenseId) {
        await updateExpense(expenseId, updatedExpenseData);
        Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
      } else {
        await createExpense(updatedExpenseData.house_id!, updatedExpenseData);
        Alert.alert('Sucesso', 'Despesa criada com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a despesa.');
      console.error('Erro ao salvar a despesa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={expenseId ? 'Editar Despesa' : 'Nova Despesa'}
          titleStyle={{ fontWeight: 'bold' }}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        {/* <CustomPicker
          data={houses.map((house) => ({ label: house.nickname, value: house.id.toString() }))}
          selectedValue={selectedHouse ? selectedHouse.nickname : ''}
          onValueChange={(item) => {
            const house = houses.find((h) => h.id.toString() === item.value);
            setSelectedHouse(house || null);
            setExpenseData({ ...expenseData, house_id: house ? house.id : 0 });
          }}
          title="Casa"
          placeholder="Selecione uma casa"
          leftIcon="home"
        /> */}
        <TextInputMask
          className="mt-4"
          type="money"
          value={(expenseData?.value as string) ?? '0'}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');
            setExpenseData({ ...expenseData, value: Number(numericValue) });
          }}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: (
              <Text>
                Valor <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
          }}
        />
        <TextInputMask
          type="datetime"
          options={{
            format: 'DD/MM/YYYY',
          }}
          value={convertStringDateInDDMMYYYY(expenseData.expense_date as string)}
          onChangeText={(text) => setExpenseData({ ...expenseData, expense_date: text })}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: (
              <Text>
                Data da Despesa <Text style={{ color: 'red' }}>*</Text>
              </Text>
            ),
          }}
        />
        <Text variant="titleMedium">
          Tipo de despesa <Text style={{ color: 'red' }}>*</Text>:
        </Text>
        <RadioButton.Group
          onValueChange={(newValue) =>
            setExpenseData({ ...expenseData, expense_type: newValue as ExpenseDTO['expense_type'] })
          }
          value={expenseData.expense_type as string}>
          <View style={styles.radioButtonContainer}>
            <RadioButton.Item label="Manutenção" value="manutenção" />
            <RadioButton.Item label="Reparo" value="reparo" />
            <RadioButton.Item label="Imposto" value="imposto" />
          </View>
        </RadioButton.Group>
        <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
          Salvar
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  radioButtonContainer: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default memo(ExpenseDetails);
