const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const chatbotRoute = require('./routes/chatRoutes');
const sessionRoute = require('./routes/sessionRoutes');
const attendanceRoute = require('./routes/attendanceRoutes');
const studentRoutes = require('./routes/studentRoutes');
const busRoutes = require('./routes/busRoutes');
const statsRoutes = require('./routes/statsRoutes');
const alertRoutes = require('./routes/alertRoutes');

const PORT = process.env.PORT || 3000;

// Initialize Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'https://capstone-frontend-tan-sigma.vercel.app',
        credentials: true
    }
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'https://capstone-frontend-tan-sigma.vercel.app',
    credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai/chat', chatbotRoute);
app.use('/api/ai/session', sessionRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/student', studentRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/alerts', alertRoutes);

// Store io in app context to access it in controllers
app.set('socketio', io);

// Socket.IO Connection Logic
io.on('connection', (socket) => {
    console.log(`📡 New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });

    // Handle Two-way alert acknowledgement
    socket.on('alert-received', (data) => {
        console.log(`✅ Alert ${data.alertId} acknowledged by user ${data.userId}`);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`🚀 Scalable Bus Tracking Server running on PORT: ${PORT}`);
});