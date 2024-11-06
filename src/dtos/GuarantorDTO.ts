export type GuarantorDTO = {
  id: number;
  tenant_id: number;
  cpf: string;
  contact: string;
  email: string | null;
  name: string;
  profession: string | null;
  marital_status: string | null;
  birth_date: string | null;
  comment: string | null;
  income: number | null;
  street: string;
  neighborhood: string | null;
  number: number | null;
  zip_code: string;
  city: string | null;
  state: string | null;
};
