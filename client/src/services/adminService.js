import api from './api';

export const getAdminDisasters = async () => {
  try {
    const response = await api.get('/admin/disasters');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyDisaster = async (id) => {
  try {
    const response = await api.post(`/admin/disasters/${id}/verify`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createAdminAlert = async (alertData) => {
  try {
    const response = await api.post('/admin/alerts', alertData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
