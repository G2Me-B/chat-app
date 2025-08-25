 import express from 'express';
 import "dotenv/config";
 import authRoutes from './routes/auth.route.js';
 import {connectDB} from './lib/db.js';
 import cookieParser from 'cookie-parser';

//  App initialization
 const app = express();
 const PORT = process.env.PORT

// Middlewares
  app.use(express.json());
  app.use(cookieParser());
  
 //  Routes
 app.use("/api/auth", authRoutes);

 app.listen(5001, () => {
   console.log(`Server is running on port ${PORT}`);
   connectDB();
 });