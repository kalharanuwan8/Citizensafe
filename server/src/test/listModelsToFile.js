import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync(path.join(__dirname, "models_list.json"), JSON.stringify(data, null, 2));
        console.log("Full models list written to models_list.json");
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
