export type ExpenseDTO = {
  id: number;
  expense_type: 'manutenção' | 'reparo' | 'imposto';
  value: number | string;
  expense_date: Date | string;
  house_id: number;
};
