export type UserDTO = {
  user_id: string;
  email: string;
  password: string;
  name: string;
  telephone: string;
  monthly_income: number;
  cpf: string;
  birth_date: string;
  hashed_signature: string | null;
  photo: string | null;
};
