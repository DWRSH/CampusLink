// backend/routes/message.routes.js
import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

import {
  getAllMessages,
  getPrevUserChats,
  sendMessage,
  markMessagesAsSeen, // ✅ NEW controller import
} from "../controllers/message.controllers.js";

const messageRouter = express.Router();

// Send a message (with optional image)
messageRouter.post("/send/:receiverId", isAuth, upload.single("image"), sendMessage);

// Get all messages in a conversation
messageRouter.get("/getAll/:receiverId", isAuth, getAllMessages);

// Get previous chat users
messageRouter.get("/prevChats", isAuth, getPrevUserChats);

// ✅ Mark messages as seen
messageRouter.put("/markSeen/:senderId", isAuth, markMessagesAsSeen);

export default messageRouter;
