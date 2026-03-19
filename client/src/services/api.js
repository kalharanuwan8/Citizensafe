import axios from 'axios'

const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;

    if (!envUrl) {
        console.error("❌ VITE_API_URL is not defined");
        return "";
    }

    return envUrl;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default api;