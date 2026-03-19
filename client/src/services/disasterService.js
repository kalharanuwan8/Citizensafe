import api from "./api";

// ── Disaster type mapping: UI label → backend enum ────────────────────────────
export const DISASTER_TYPES = [
  { label: 'Flash Flood',  value: 'flood'        },
  { label: 'Landslide',    value: 'Landslide'    },
  { label: 'Earthquake',   value: 'earthquake'   },
  { label: 'Wildfire',     value: 'Fire'         },
  { label: 'Accident',     value: 'Accident'     },
  { label: 'Power Outage', value: 'power_outage' },
  { label: 'Other',        value: 'other'        },
];

// ── API helpers ───────────────────────────────────────────────────────────────
export const getAllDisasters = async () => {
  try {
    const response = await api.get('/disaster');
    return response.data.data ?? [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getNearbyDisasters = async (lattitude, longitude, radius = 50, useHome = false) => {
  try {
    const response = await api.get('/disaster/nearby', {
      params: { lattitude, longitude, radius, useHome }
    });
    return response.data.data ?? [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDisasterById = async (id) => {
  try {
    const response = await api.get(`/disaster/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const confirmDisaster = async (id, imageUrl) => {
  try {
    const response = await api.patch(`/disaster/confirm/${id}`, { imageUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createDisaster = async ({ disasterType, description, location, image }) => {
  try {
    const response = await api.post('/disaster', { disasterType, description, location, image });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateDisasterStatus = async (id, status) => {
  try {
    const response = await api.put(`/disaster/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteDisaster = async (id) => {
  try {
    const response = await api.delete(`/disaster/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
