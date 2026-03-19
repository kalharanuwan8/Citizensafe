import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            // Print every single model name
            data.models.forEach(m => console.log(m.name));
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
