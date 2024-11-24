import { api } from '~/services/api';
import axios from 'axios';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

// Tipos de retorno esperados
export type DashboardTotalsDTO = {
  total_properties: number;
  total_houses: number;
  total_tenants: number;
};

export type DashboardHousesAvailabilityDTO = {
  total_rented: number;
  total_available: number;
  total_maintenance: number;
};

export type DashboardCashFlowDTO = {
  total_monthly_income: number;
  total_monthly_expenses: number;
  total_profit_monthly: number;
};

export type DashboardPaymentStatusDTO = {
  total_monthly_paid: Float;
  total_monthly_overdue: Float;
  total_monthly_pending: Float;
};

// Obter totais do dashboard
export const getDashboardTotals = async (): Promise<DashboardTotalsDTO> => {
  try {
    const response = await api.get('/dashboard/totals');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter totais do dashboard:', error.response?.data);
    }
    throw error;
  }
};

// Obter disponibilidade das casas no dashboard
export const getDashboardHousesAvailability = async (): Promise<DashboardHousesAvailabilityDTO> => {
  try {
    const response = await api.get('/dashboard/houses-availability');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter disponibilidade das casas no dashboard:', error.response?.data);
    }
    throw error;
  }
};

// Obter fluxo de caixa do dashboard
export const getDashboardCashFlow = async (): Promise<DashboardCashFlowDTO> => {
  try {
    const response = await api.get('/dashboard/cash-flow');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter fluxo de caixa do dashboard:', error.response?.data);
    }
    throw error;
  }
};

// Obter status de pagamento do dashboard
export const getDashboardPaymentStatus = async (): Promise<DashboardPaymentStatusDTO> => {
  try {
    const response = await api.get('/dashboard/payment-status');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter status de pagamento do dashboard:', error.response?.data);
    }
    throw error;
  }
};
