import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import http from 'http'
import { Server } from 'socket.io'

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import disasterRoutes from './routes/disasterRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import alertRoutes from './routes/alertRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import chatRoutes from './routes/chatRoutes.js'


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io accessible in controllers
app.set("io", io);

const PORT = process.env.PORT;
app.use(express.json());
connectDB();
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    const allowedSubstrings = ['localhost','192.168.1.10', '13.53.197.186:3000'];
    
    const isAllowed = !origin || allowedSubstrings.some(sub => origin.includes(sub));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Pass io to request object via middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/disaster", disasterRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/chat", chatRoutes)

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Allow user to join a room with their userId
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
