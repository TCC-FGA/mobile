import { api } from '~/services/api';
import axios from 'axios';
import { TemplateDTO } from '~/dtos/TemplateDTO';

// Função para obter todos os templates
export const getTemplates = async (): Promise<TemplateDTO[]> => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao obter templates:', error.response?.data);
    }
    throw error;
  }
};

// Função para criar um novo template
export const createTemplate = async (templateData: TemplateDTO): Promise<TemplateDTO> => {
  try {
    const response = await api.post('/templates', templateData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar template:', error.response?.data);
    }
    throw error;
  }
};

// Função para obter um template pelo ID
export const getTemplateById = async (templateId: number): Promise<TemplateDTO> => {
  try {
    const response = await api.get(`/templates/${templateId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao obter template com ID ${templateId}:`, error.response?.data);
    }
    throw error;
  }
};

// Função para atualizar um template pelo ID
export const updateTemplate = async (
  templateId: number,
  templateData: Partial<TemplateDTO>
): Promise<TemplateDTO> => {
  try {
    const response = await api.patch(`/templates/${templateId}`, templateData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao atualizar template com ID ${templateId}:`, error.response?.data);
    }
    throw error;
  }
};

// Função para deletar um template pelo ID
export const deleteTemplate = async (templateId: number): Promise<void> => {
  try {
    await api.delete(`/templates/${templateId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao deletar template com ID ${templateId}:`, error.response?.data);
    }
    throw error;
  }
};
