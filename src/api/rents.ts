import { api } from '~/services/api';
import { RentCreateDTO, RentDTO } from '~/dtos/RentDTO';
import axios from 'axios';
import { Buffer } from 'buffer';
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
export const createRent = async (contractData: RentCreateDTO): Promise<RentDTO> => {
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

// Função para fazer upload de um PDF assinado
export const updatePdfRent = async (contractId: number, signedPdf: FormData): Promise<RentDTO> => {
  try {
    const response = await api.patch(`/contracts/${contractId}`, signedPdf, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao fazer upload do PDF assinado para o contrato com ID ${contractId}:`,
        error.response?.data
      );
    }
    throw error;
  }
};

// Função para obter um PDF pelo ID do contrato
export const getPdfByContractId = async (contractId: number) => {
  try {
    const url = `/contracts/${contractId}/pdf`;
    const response = await api({
      url,
      method: 'POST',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao obter PDF para o contrato com ID ${contractId}:`,
        error.response?.data
      );
    }
    throw error;
  }
};

// Função para gerar um relatório em PDF
export const generateReport = async (): Promise<string> => {
  try {
    const url = '/generate-report';
    const response = await api({
      url,
      method: 'POST',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
    return Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao gerar relatório em PDF:', error.response?.data);
    }
    throw error;
  }
};
