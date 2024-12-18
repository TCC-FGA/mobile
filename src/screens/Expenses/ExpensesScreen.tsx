import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { List, FAB, Appbar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getExpensesByHouseId, deleteExpense } from '~/api/expenses';
import { ExpenseDTO } from '~/dtos/ExpenseDTO';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { convertDateInDDMMYYYY } from '~/helpers/convert_data';
import { parse } from 'date-fns';
import { capitalizeWords } from '~/helpers/utils';
import { theme } from '~/core/theme';

type RouteParamsProps = {
  houseId: number;
};

const ExpensesScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { houseId } = route.params as RouteParamsProps;
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpensesByHouseId(houseId);
      setExpenses(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter as despesas.');
      console.error('Erro ao obter as despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchExpenses();
    }
  }, [houseId, isFocused]);

  const handleDeleteExpense = async (expenseId: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir esta despesa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              setExpenses(expenses.filter((expense) => expense.id !== expenseId));
              Alert.alert('Sucesso', 'Despesa deletada com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a despesa.');
              console.error('Erro ao deletar a despesa:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderExpenseItem = ({ item }: { item: ExpenseDTO }) => (
    <List.Item
      title={`R$ ${typeof item.value === 'number' ? item.value.toFixed(2) : item.value}`}
      description={`${item.expense_type.toUpperCase()} - ${convertDateInDDMMYYYY(parse(item.expense_date as string, 'yyyy-MM-dd', new Date()))}`}
      left={(props) => <List.Icon {...props} icon="finance" color={theme.colors.error} />}
      right={(props) => (
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ExpensesStack', {
                screen: 'ExpensesDetails',
                params: { houseId, expenseId: item.id },
              })
            }>
            <List.Icon {...props} icon="pencil" color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
            <List.Icon {...props} icon="delete" color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Despesas" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderExpenseItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={loading}
          onRefresh={fetchExpenses}
          ListEmptyComponent={() =>
            !loading && (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text>Nenhuma despesa encontrada.</Text>
              </View>
            )
          }
        />
      )}
      <FAB
        style={styles.fab}
        icon="cash-remove"
        onPress={() =>
          navigation.navigate('ExpensesStack', { screen: 'ExpensesDetails', params: { houseId } })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  fab: {
    position: 'absolute',
    margin: 22,
    right: 0,
    bottom: 35,
    backgroundColor: theme.colors.error,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(ExpensesScreen);
