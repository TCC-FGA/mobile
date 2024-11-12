import { api } from '~/services/api';
import { GuarantorDTO } from '~/dtos/GuarantorDTO';
import axios from 'axios';

// Obter fiador por ID do inquilino
export const getGuarantorByTenantId = async (tenantId: number): Promise<GuarantorDTO[]> => {
  try {
    const response = await api.get(`/guarantor${tenantId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
    }
    throw error;
  }
};

// Criar um novo fiador
export const createGuarantor = async (
  tenantId: number,
  guarantorData: Partial<GuarantorDTO>
): Promise<GuarantorDTO> => {
  try {
    const response = await api.post(`/guarantor/${tenantId}`, guarantorData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao criar fiador para o inquilino com ID ${tenantId}:`,
        error.response?.data
      );
    }
    throw error;
  }
};

// Atualizar um fiador pelo ID
export const updateGuarantor = async (
  guarantorId: number,
  guarantorData: Partial<GuarantorDTO>
): Promise<GuarantorDTO> => {
  try {
    const response = await api.patch(`/guarantor/${guarantorId}`, guarantorData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao atualizar fiador com ID ${guarantorId}:`, error.response?.data);
    }
    throw error;
  }
};

// Deletar um fiador pelo ID
export const deleteGuarantor = async (guarantorId: number): Promise<void> => {
  try {
    await api.delete(`/guarantor/${guarantorId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao deletar fiador com ID ${guarantorId}:`, error.response?.data);
    }
    throw error;
  }
};
