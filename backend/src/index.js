 import express from 'express';
 import "dotenv/config";
 import cookieParser from 'cookie-parser';
 import authRoutes from './routes/auth.route.js';
 import {
   connectDB
 } from './lib/db.js';
 import messageRoutes from './routes/message.route.js';
 import cors from "cors"
 import {
   app,
   server,
   io
 } from './lib/socket.js';
 import path from 'path';

 //  App initialization
 const PORT = process.env.PORT
 const __dirname = path.resolve();

 // Middlewares
 app.use(express.json({
   limit: '10mb'
 }));
 app.use(cookieParser());
 app.use(cors({
   origin: 'http://localhost:5173', // Replace with your frontend URL
   credentials: true, // Allow cookies to be sent
 }))

 //  Routes

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes)


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

 server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
   connectDB();
 });