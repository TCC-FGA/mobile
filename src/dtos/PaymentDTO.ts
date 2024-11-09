export type PaymentDTO = {
  id: number;
  installment_value: number;
  fg_paid: boolean;
  payment_type: 'dinheiro' | 'cartão' | 'transferência' | 'outro' | 'None';
  due_date: string;
  payment_date?: string;
  contract_id: number;
};
