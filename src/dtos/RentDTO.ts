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
  reajustment_rate?: string;
  houseDto: HouseDTO;
  template_id: number;
  tenantsDTO: TenantDTO;
  user_id: string;
};
