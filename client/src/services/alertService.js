import api from './api';

export const getAlerts = async () => {
  try {
    const response = await api.get('/alerts');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
