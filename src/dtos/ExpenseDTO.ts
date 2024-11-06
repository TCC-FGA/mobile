export type ExpenseDTO = {
  id: number;
  expense_type: 'manutenção' | 'reparo' | 'imposto';
  value: number;
  expense_date: Date;
  house_id: number;
};
