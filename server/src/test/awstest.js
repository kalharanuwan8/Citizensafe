import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// This tells dotenv exactly where to look (go up two levels to the root)
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

console.log("TESTING KEY:", process.env.AWS_ACCESS_KEY_ID);