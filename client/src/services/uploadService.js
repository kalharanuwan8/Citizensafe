import api from './api';
import axios from 'axios';

export const uploadImage = async (file, folder = 'disasters') => {
  try {
    const response = await api.get('/upload', {
      params: { folder }
    });
    const { uploadurl, key } = response.data.data;

    if (!uploadurl || !key) {
      throw new Error("Failed to get upload URL");
    }

    await axios.put(uploadurl, file, {
      headers: {
        'Content-Type': file.type || 'image/jpeg',
      },
    });

    const url = uploadurl.split('?')[0];
    return { url, key };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getViewingUrl = async (key) => {
  try {
    const response = await api.get('/upload/view', {
      params: { key }
    });
    return response.data.url;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
