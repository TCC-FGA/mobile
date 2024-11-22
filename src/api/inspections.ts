import { api } from '~/services/api';
import { ResponseInspectionDTO } from '~/dtos/InspectionDTO';
import axios from 'axios';

// Obter inspeção pelo ID do contrato
export const getInspectionByContractId = async (
  contractId: number
): Promise<ResponseInspectionDTO | null> => {
  try {
    const response = await api.get(`/inspection/${contractId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return null;
    } else {
      console.error(`Erro ao obter inspeção com ID do contrato ${contractId}:`, error);
    }
    throw error;
  }
};

// Criar uma nova inspeção
export const createInspection = async (
  contractId: number,
  inspectionData: FormData
): Promise<ResponseInspectionDTO> => {
  try {
    const response = await api.post(`/inspection/${contractId}`, inspectionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao criar inspeção para o contrato com ID ${contractId}:`,
        error.response?.data
      );
    } else {
      console.error(`Erro ao criar inspeção para o contrato com ID ${contractId}:`, error);
    }
    throw error;
  }
};

// Submeter um laudo de vistoria assinado
export const submitSignedInspection = async (
  inspectionId: number,
  signedPdf: FormData
): Promise<ResponseInspectionDTO> => {
  try {
    const response = await api.patch(`/inspection/${inspectionId}`, signedPdf, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao submeter o laudo de vistoria assinado para a inspeção com ID ${inspectionId}:`,
        error.response?.data
      );
    } else {
      console.error(
        `Erro ao submeter o laudo de vistoria assinado para a inspeção com ID ${inspectionId}:`,
        error
      );
    }
    throw error;
  }
};
