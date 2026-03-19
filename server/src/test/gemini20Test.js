import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function testGemini20() {
    console.log("Testing Gemini 2.0 Flash API...");
    const apiKey = process.env.GEMINI_API_KEY;
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const result = await model.generateContent("Test message");
        console.log("Response:", result.response.text());
        console.log("Success!");
    } catch (error) {
        console.error("Error Status:", error.status);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Response Data:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini20();
