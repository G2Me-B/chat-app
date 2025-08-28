 import express from 'express';
 import "dotenv/config";
 import cookieParser from 'cookie-parser';
 import authRoutes from './routes/auth.route.js';
 import {connectDB} from './lib/db.js';
 import messageRoutes from './routes/message.route.js';
 import cors from "cors"

//  App initialization
 const app = express();
 const PORT = process.env.PORT

// Middlewares
  app.use(express.json({limit: '10mb'}));
  app.use(cookieParser());
  app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  }))
  
 //  Routes
 app.use("/api/auth", authRoutes);
 app.use("/api/messages", messageRoutes)

 app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
   connectDB();
 });