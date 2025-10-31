import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route imports
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import loopRouter from "./routes/loop.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";
import adminRouter from "./routes/admin.routes.js"; // ✅ NEW

// Socket server
import { app, server } from "./socket.js";

// Load environment variables
dotenv.config();

// Port
const port = process.env.PORT || 8000;

// Middlewares

// --- YAHI HAI AAPKA FIX ---

// 1. Apne dono allowed URLs ki ek list banayein
const allowedOrigins = [
  'http://localhost:5173', // Aapka local dev frontend
  'https://campuslink-frontend.onrender.com', // Aapka naya deployed frontend
];

// 2. 'cors' ko batayein ki woh is list ko check kare
app.use(
  cors({
    origin: function (origin, callback) {
      // Check karein ki jo request bhej raha hai (origin) woh allowed list mein hai ya nahi
      // !origin ka matlab hai ki server-to-server requests (jaise Postman) ko bhi allow karega
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Agar hai, toh allow karein
      } else {
        callback(new Error("Not allowed by CORS")); // Nahi hai, toh block karein
      }
    },
    credentials: true,
  })
);

// --- FIX KHATAM ---

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);
app.use("/api/admin", adminRouter); // ✅ NEW - Admin route

// Start server
server.listen(port, () => {
  connectDb();
  console.log(`✅ Server started on port ${port}`);
});
