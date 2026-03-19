import api from "./api";

export const sendMessage = async (message, history) => {
    try {
        const response = await api.post("/chat", { message, history });
        return response.data;
    } catch (error) {
        console.error("Chat Service Error:", error);
        throw error;
    }
};
