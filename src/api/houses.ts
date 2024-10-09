import { api } from '~/services/api';
import { HouseDTO } from '~/dtos/HouseDTO';
import axios from 'axios';

// obter todas as casas
export const getHouses = async (): Promise<HouseDTO[]> => {
  try {
    const response = await api.get('/houses');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter casas:', error);
    throw error;
  }
};

// obter uma casa pelo ID
export const getHouseById = async (houseId: number): Promise<HouseDTO> => {
  try {
    const response = await api.get(`/houses/${houseId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao obter casa com ID ${houseId}:`, error);
    throw error;
  }
};

// atualizar uma casa pelo ID
export const updateHouse = async (
  houseId: number,
  houseData: Partial<HouseDTO>
): Promise<HouseDTO> => {
  try {
    const response = await api.patch(`/houses/${houseId}`, houseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar casa com ID ${houseId}:`, error);
    throw error;
  }
};

// Função para deletar uma casa pelo ID
export const deleteHouse = async (houseId: number): Promise<void> => {
  try {
    await api.delete(`/houses/${houseId}`);
  } catch (error) {
    console.error(`Erro ao deletar casa com ID ${houseId}:`, error);
    throw error;
  }
};

// Função para obter casas por ID da propriedade
export const getHousesByPropertyId = async (propertyId: number): Promise<HouseDTO[]> => {
  try {
    const response = await api.get(`/houses/property/${propertyId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
    }
    throw error;
  }
};

// criar uma nova casa
export const createHouse = async (propertyId: number, houseData: FormData): Promise<HouseDTO> => {
  try {
    const response = await api.post(`/houses/${propertyId}`, houseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar casa na propriedade com ID ${propertyId}:`, error);
    throw error;
  }
};
