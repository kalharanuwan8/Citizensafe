import { GoogleGenerativeAI } from "@google/generative-ai";
import Disaster from "../models/disaster.js";
import Alert from "../models/alerts.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

export const handleChat = async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        // Fetch context from DB
        const activeDisasters = await Disaster.find({ status: "Active" }).limit(10).lean();
        const recentAlerts = await Alert.find({ status: "Active" }).sort({ createdAt: -1 }).limit(10).lean();

        const contextPrompt = `
            You are "CitizenSafe AI", a premium, helpful, and highly intelligent assistant for the CitizenSafe disaster reporting platform.
            
            GUIDELINES:
            1. Provide accurate information about disasters and alerts based on the real-time data provided.
            2. For lists of disasters or alerts, ALWAYS use a clean, bulleted list format.
            3. Use Markdown for formatting (bolding important terms, using headers if necessary).
            4. If the user asks for active disasters, summarize them clearly. Example:
               - **Flood**: Its flooding everywhere (Status: Active)
            5. If no specific data is available for a query, answer politely.
            6. Keep answers concise, professional, and easy to read.
            7. Use emojis occasionally to make the assistant feel approachable but stay professional.
            8. Do NOT make up disasters. Only report what is in the context.

            REAL-TIME DATA CONTEXT:
            
            Active Disasters:
            ${activeDisasters.length > 0 ? JSON.stringify(activeDisasters, null, 2) : "No active disasters reported."}

            Active Alerts:
            ${recentAlerts.length > 0 ? JSON.stringify(recentAlerts, null, 2) : "No active alerts at the moment."}
        `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: contextPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am CitizenSafe AI, your dedicated assistant for real-time disaster and alert information. How can I assist you today?" }],
                },
                ...(history || []).map(msg => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content || msg.text }],
                })),
            ],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.status(200).json({ response: responseText });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "I'm having trouble connecting to my brain right now. Please try again in a moment." });
    }
};
