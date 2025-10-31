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
app.use(cors({
    origin: "http://localhost:5173",  // You can update this to your frontend URL in production
    credentials: true
}));
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
