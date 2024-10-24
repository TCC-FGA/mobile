export type PaymentDTO = {
  id: number;
  installmentValue: number;
  isPaid: boolean;
  paymentMethod: 'dinheiro' | 'cartão' | 'transferência' | 'outro';
  dueDate: Date;
  paymentDate?: Date;
  contractId: number;
};
