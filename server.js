import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passport.js';
import authRoutes from "./routes/auth.js";
import session from "express-session";

dotenv.config(); // Load environment variables at the top

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",  // Use CLIENT_URL from .env
    credentials: true
}));

// JSON Parser Middleware
app.use(express.json());

// Session Middleware (Fixed secret key issue)
app.use(session({
    secret: process.env.SESSION_SECRET || "your_strong_secret_key", // Use SESSION_SECRET from .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set `true` in production with HTTPS
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
app.use('/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB successfully...'))
    .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
