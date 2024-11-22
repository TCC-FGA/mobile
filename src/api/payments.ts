import { api } from '~/services/api';
import { PaymentDTO } from '~/dtos/PaymentDTO';
import axios from 'axios';

// Criar uma nova parcela de pagamento
export const createPaymentInstallment = async (contractId: number): Promise<PaymentDTO> => {
  try {
    const response = await api.post(`/payment_installment/${contractId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao criar parcela de pagamento no contrato com ID ${contractId}:`,
        error.response?.data
      );
    }
    throw error;
  }
};

// Obter parcelas de pagamento por ID do contrato
export const getPaymentInstallments = async (contractId: number): Promise<PaymentDTO[]> => {
  try {
    const response = await api.get(`/payment_installment/${contractId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao obter parcelas de pagamento do contrato com ID ${contractId}:`,
        error.response?.data
      );
    }
    throw error;
  }
};

// Atualizar uma parcela de pagamento pelo ID
export const updatePaymentInstallment = async (
  paymentInstallmentId: number,
  paymentData: {
    fg_paid: boolean;
    payment_date: string;
    payment_type: PaymentDTO['payment_type'];
  }
): Promise<PaymentDTO> => {
  try {
    const response = await api.patch(`/payment_installment/${paymentInstallmentId}`, paymentData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Erro ao atualizar parcela de pagamento com ID ${paymentInstallmentId}:`,
        error.response?.data
      );
    }
    throw error;
  }
};
