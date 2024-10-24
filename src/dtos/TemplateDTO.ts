export type TemplateDTO = {
  id: number;
  template_name: string;
  description?: string | null;
  garage: boolean;
  warranty: string;
  animals: boolean;
  sublease: boolean;
  contract_type: 'residencial' | 'comercial';
};