import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passport.js';
import authRoutes from "./routes/auth.js";
import session from "express-session";

dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// JSON Parser Middleware
app.use(express.json());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "your_strong_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
app.use('/auth', authRoutes);

// Connect to MongoDB (Avoid multiple connections)
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Connected to MongoDB successfully...');
        isConnected = true;
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
    }
}

// Vercel Serverless Handler (No app.listen)
export default async function handler(req, res) {
    await connectDB();
    return app(req, res);
}
