import { api } from '~/services/api';
import { PropertiesDTO } from '~/dtos/PropertiesDTO';

// obter todas as propriedades
export const getProperties = async (): Promise<PropertiesDTO[]> => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter propriedades:', error);
    throw error;
  }
};
