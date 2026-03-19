import axios from 'axios'

const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Ensure the URL always ends with /api
        return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }
    
    // Fallback: point to same host on port 5000
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config)=>
{
    const token = localStorage.getItem('token')
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default api;