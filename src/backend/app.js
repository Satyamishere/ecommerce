import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import paymentRouter from './routes/payment.routes.js';
import adminRouter from './routes/admin.routes.js'
import { createAdmin } from "./controllers/adminfunction.js";
dotenv.config();

const app = express();

// Allow multiple origins via CORS_ORIGIN (comma-separated) and enable credentials
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,https://ecommerce-frontend-bdhf.onrender.com")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS Error: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));




app.use("/api/v1/users", userRouter);  
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/admin",adminRouter)


//createAdmin();

export { app };
