import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import userRouter from './src/backend/routes/user.routes.js';
import paymentRouter from './src/backend/routes/payment.routes.js';
import adminRouter from './src/backend/routes/admin.routes.js'
import { createAdmin } from "./src/backend/controllers/adminfunction.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));




app.use("/api/v1/users", userRouter);  
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/admin",adminRouter)

createAdmin();

export { app };
