const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes')
const chatbotRoute = require('./routes/chatRoutes')
const sessionRoute = require('./routes/sessionRoutes');
const attendanceRoute = require('./routes/attendanceRoutes');
const studentRoutes = require('./routes/studentRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/ai/chat', chatbotRoute)
app.use('/api/ai/session', sessionRoute)
app.use('/api/attendance', attendanceRoute)
app.use('/api/student', studentRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})