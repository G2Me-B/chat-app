 import express from 'express';
 import "dotenv/config";
 import cookieParser from 'cookie-parser';
 import authRoutes from './routes/auth.route.js';
 import {connectDB} from './lib/db.js';
 import messageRoutes from './routes/message.route.js';

//  App initialization
 const app = express();
 const PORT = process.env.PORT

// Middlewares
  app.use(express.json());
  app.use(cookieParser());
  
 //  Routes
 app.use("/api/auth", authRoutes);
 app.use("/api/message", messageRoutes)

 app.listen(5001, () => {
   console.log(`Server is running on port ${PORT}`);
   connectDB();
 });