export type InspectionDTO = {
  contract_id: number;
  data_vistoria: string;
  estado_pintura: 'Nova' | 'Em bom estado' | 'Com alguns defeitos';
  tipo_tinta: 'acrílica' | 'latex';
  cor: string | null;
  condicao_acabamento: string | null;
  observacoes_acabamento: string | null;
  condicao_eletrica: 'Funcionando' | 'Com problemas' | 'Desligada';
  observacoes_eletrica: string | null;
  condicao_trincos_fechaduras: string | null;
  observacoes_trincos_fechaduras: string | null;
  condicao_piso_azulejos: string | null;
  observacoes_piso_azulejos: string | null;
  condicao_vidracaria_janelas: string | null;
  observacoes_vidracaria_janelas: string | null;
  condicao_telhado: string | null;
  observacoes_telhado: string | null;
  condicao_hidraulica: string | null;
  observacoes_hidraulica: string | null;
  observacoes_mobilia: string | null;
  numero_chaves: number | null;
  observacoes_chaves: string | null;
  inspection_photos: string[];
};

export type ResponseInspectionDTO = {
  id: number;
  pdf_inspection: string;
  signed_pdf: string;
  inspection_date: string;
  contract_id: number;
};
