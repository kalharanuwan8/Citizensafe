import axios from 'axios'

const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('localhost')) {
        return envUrl;
    }
    
    // If we're on a non-localhost host (like an IP address), 
    // we should point the API calls to that same host on port 5000
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