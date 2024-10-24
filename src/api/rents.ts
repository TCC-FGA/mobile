import { api } from '~/services/api';
import { RentDTO } from '~/dtos/RentDTO';
import axios from 'axios';

// Função para obter todos os contratos (rents)
export const getRents = async (): Promise<RentDTO[]> => {
  try {
    const response = await api.get('/contracts');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter contratos:', error.response?.data);
    }
    throw error;
  }
};

// Função para criar um novo contrato (rent)
export const createRent = async (contractData: RentDTO): Promise<RentDTO> => {
  try {
    const response = await api.post('/contracts', contractData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar contrato:', error.response?.data);
    }
    throw error;
  }
};

// Função para obter um contrato pelo ID
export const getRentById = async (contractId: number): Promise<RentDTO> => {
  try {
    const response = await api.get(`/contracts/${contractId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao obter contrato com ID ${contractId}:`, error.response?.data);
    }
    throw error;
  }
};

// Função para atualizar um contrato pelo ID
export const updateRent = async (
  contractId: number,
  contractData: Partial<RentDTO>
): Promise<RentDTO> => {
  try {
    const response = await api.patch(`/contracts/${contractId}`, contractData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao atualizar contrato com ID ${contractId}:`, error.response?.data);
    }
    throw error;
  }
};

// Função para deletar um contrato pelo ID
export const deleteRent = async (contractId: number): Promise<void> => {
  try {
    await api.delete(`/contracts/${contractId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao deletar contrato com ID ${contractId}:`, error.response?.data);
    }
    throw error;
  }
};
