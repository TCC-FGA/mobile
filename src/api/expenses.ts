import { api } from '~/services/api';
import { ExpenseDTO } from '~/dtos/ExpenseDTO';
import axios from 'axios';

// Obter despesas por ID da casa
export const getExpensesByHouseId = async (houseId: number): Promise<ExpenseDTO[]> => {
  try {
    const response = await api.get(`/expenses/${houseId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error(`Erro ao obter despesas da casa com ID ${houseId}:`, error.response?.data);
    }
    throw error;
  }
};

// Criar uma nova despesa
export const createExpense = async (
  houseId: number,
  expenseData: Partial<ExpenseDTO>
): Promise<ExpenseDTO> => {
  try {
    const response = await api.post(`/expenses/${houseId}`, expenseData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao criar despesa na casa com ID ${houseId}:`, error.response?.data);
    }
    throw error;
  }
};

// Atualizar uma despesa pelo ID
export const updateExpense = async (
  expenseId: number,
  expenseData: Partial<ExpenseDTO>
): Promise<ExpenseDTO> => {
  try {
    const response = await api.patch(`/expenses/${expenseId}`, expenseData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao atualizar despesa com ID ${expenseId}:`, error.response?.data);
    }
    throw error;
  }
};

// Deletar uma despesa pelo ID
export const deleteExpense = async (expenseId: number): Promise<void> => {
  try {
    await api.delete(`/expenses/${expenseId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao deletar despesa com ID ${expenseId}:`, error.response?.data);
    }
    throw error;
  }
};

export const getExpenseById = async (expenseId: number, houseId: number): Promise<ExpenseDTO> => {
  try {
    const all_expen = await getExpensesByHouseId(houseId);
    const expense = all_expen.find((exp) => exp.id === expenseId);
    return expense!;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao obter despesa com ID ${expenseId}:`, error.response?.data);
    }
    throw error;
  }
};
