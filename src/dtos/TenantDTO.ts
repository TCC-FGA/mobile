export type TenantDTO = {
  id: number;
  cpf: string;
  contact: string;
  email: string | null;
  name: string;
  profession: string | null;
  marital_status: string | null;
  birth_date: string | null;
  emergency_contact: string | null;
  income: number | null;
  residents: number | null;
  street: string;
  neighborhood: string | null;
  number: number | null;
  zip_code: string;
  city: string | null;
  state: string | null;
};
