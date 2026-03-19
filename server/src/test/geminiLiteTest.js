import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function testLite() {
    console.log("Testing Gemini Flash Lite...");
    const apiKey = process.env.GEMINI_API_KEY;
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
        
        const result = await model.generateContent("Hi");
        console.log("Response:", result.response.text());
        console.log("Success!");
    } catch (error) {
        console.error("Error Status:", error.status);
        console.error("Error Message:", error.message);
    }
}

testLite();
