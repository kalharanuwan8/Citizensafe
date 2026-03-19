import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function testGemini() {
    console.log("Testing Gemini API with different models...");
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of models) {
        try {
            console.log(`Trying model: ${modelName}`);
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const result = await model.generateContent("Hello?");
            console.log(`Success with ${modelName}:`, result.response.text());
            return;
        } catch (error) {
            console.error(`Failed with ${modelName}:`, error.status || error.message);
        }
    }
}

testGemini();
