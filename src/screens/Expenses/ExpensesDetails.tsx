import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getHouses, getHouseById } from '~/api/houses';
import { createExpense, getExpenseById, updateExpense } from '~/api/expenses';
import { HouseDTO } from '~/dtos/HouseDTO';
import { ExpenseDTO } from '~/dtos/ExpenseDTO';
import CustomPicker from '~/components/CustomPicker';
import { TextInputMask } from 'react-native-masked-text';

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
    value: 0,
    expense_date: new Date().toISOString().split('T')[0],
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
    setLoading(true);
    try {
      if (expenseId) {
        await updateExpense(expenseId, expenseData);
        Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
      } else {
        await createExpense(expenseData.house_id!, expenseData);
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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={expenseId ? 'Editar Despesa' : 'Nova Despesa'} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomPicker
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
        />
        <TextInput
          label="Tipo de Despesa"
          value={expenseData.expense_type}
          onChangeText={(text) =>
            setExpenseData({ ...expenseData, expense_type: text as ExpenseDTO['expense_type'] })
          }
          style={styles.input}
        />
        <TextInputMask
          type="money"
          value={expenseData.value?.toString() || ''}
          onChangeText={(text) =>
            setExpenseData({ ...expenseData, value: parseFloat(text.replace(/[^0-9,-]+/g, '')) })
          }
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: 'Valor',
          }}
        />
        <TextInputMask
          type="datetime"
          options={{
            format: 'YYYY-MM-DD',
          }}
          value={expenseData.expense_date as string}
          onChangeText={(text) => setExpenseData({ ...expenseData, expense_date: text })}
          style={styles.input}
          customTextInput={TextInput}
          customTextInputProps={{
            label: 'Data da Despesa',
          }}
        />
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
});

export default memo(ExpenseDetails);
