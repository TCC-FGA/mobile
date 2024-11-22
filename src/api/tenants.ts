import { api } from '~/services/api';
import { TenantDTO } from '~/dtos/TenantDTO';
import axios from 'axios';

// Função para obter todos os inquilinos
export const getTenants = async (): Promise<TenantDTO[]> => {
  try {
    const response = await api.get('/tenants');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter inquilinos:', error.response?.data);
    }
    throw error;
  }
};

// Função para criar um novo inquilino
export const createTenant = async (tenantData: TenantDTO): Promise<TenantDTO> => {
  const { id, ...tenantDataWithoutId } = tenantData;
  console.log(tenantDataWithoutId);
  try {
    const response = await api.post('/tenants', tenantDataWithoutId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar inquilino:', error.response?.data);
    }
    throw error;
  }
};

// Função para obter um inquilino pelo ID
export const getTenantById = async (tenantId: number): Promise<TenantDTO> => {
  try {
    const response = await api.get(`/tenants/${tenantId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao obter inquilino com ID ${tenantId}:`, error.response?.data);
    }
    throw error;
  }
};

// Função para atualizar um inquilino pelo ID
export const updateTenant = async (
  tenantId: number,
  tenantData: Partial<TenantDTO>
): Promise<TenantDTO> => {
  try {
    const response = await api.patch(`/tenants/${tenantId}`, tenantData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao atualizar inquilino com ID ${tenantId}:`, error.response?.data);
    }
    throw error;
  }
};

// Função para deletar um inquilino pelo ID
export const deleteTenant = async (tenantId: number): Promise<void> => {
  try {
    await api.delete(`/tenants/${tenantId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao deletar inquilino com ID ${tenantId}:`, error.response?.data);
    }
    throw error;
  }
};
