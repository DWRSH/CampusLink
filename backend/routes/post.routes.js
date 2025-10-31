import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js"; // ✅ NEW: Admin middleware
import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllPosts,
  like,
  saved,
  uploadPost,
  deletePost // ✅ NEW: delete controller
} from "../controllers/post.controllers.js";

const postRouter = express.Router();

// ✅ Upload a new post (image/video)
postRouter.post("/upload", isAuth, upload.single("media"), uploadPost);

// ✅ Get all posts (with author and comments populated)
postRouter.get("/getAll", isAuth, getAllPosts);

// ✅ Like/unlike a post
postRouter.get("/like/:postId", isAuth, like);

// ✅ Save/un-save a post
postRouter.get("/saved/:postId", isAuth, saved);

// ✅ Comment on a post
postRouter.post("/comment/:postId", isAuth, comment);

// ✅ 🔥 Admin-only: Delete a post
postRouter.delete("/delete/:postId", isAuth, isAdmin, deletePost); // ✅ NEW

export default postRouter;
