import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import disasterRoutes from './routes/disasterRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'


const app = express();
const PORT = process.env.PORT;
app.use(express.json());
connectDB();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api/disaster", disasterRoutes)
app.use("/api/upload", uploadRoutes)

app.listen(PORT, ()=>
{
    console.log(`app is running on the port  ${PORT}`);
})