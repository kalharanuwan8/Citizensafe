import api from "./api";

export const loginUser = async (email, password) => {
    
    try {
        const response = await api.post('/auth/login', { email, password })
        {
            if (response.data.token)
                localStorage.setItem('token', response.data.token)
        }
        return response.data;

    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export const registerUser = async (firstName, lastName, email, password) =>
{
    try {
        const response = await api.post('/auth/register', {firstName, lastName, email, password});
        return response.data;

    } catch (error) {
        throw error.response?.data || error.message;   
    }
}