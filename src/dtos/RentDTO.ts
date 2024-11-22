import { HouseDTO } from './HouseDTO';
import { TenantDTO } from './TenantDTO';

export type RentDTO = {
  id: number;
  deposit_value: number;
  active: boolean;
  start_date: string;
  end_date: string;
  base_value: number;
  due_date: number;
  reajustment_rate?: 'IGPM' | 'None' | null;
  house: HouseDTO;
  template_id: number;
  tenant: TenantDTO;
  user_id: string;
  signed_pdf?: string | null;
};

export type RentCreateDTO = {
  deposit_value?: number | null;
  start_date: Date | string;
  end_date: Date | string;
  base_value: number;
  due_date: number;
  reajustment_rate?: 'IGPM' | 'None' | null;
  house_id: number;
  template_id: number;
  tenant_id: number;
};
