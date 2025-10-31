// backend/routes/admin.routes.js

import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

import {
  getAllUsers,
  deleteUser,
  toggleAdmin,
  getSingleUser
} from "../controllers/admin.controllers.js";

import {
  getAllLoopsAdmin,
  deleteLoopAdmin
} from "../controllers/adminLoop.controllers.js";

import { getAllPosts } from "../controllers/post.controllers.js";
import { deletePost } from "../controllers/post.controllers.js";

const router = express.Router();

// ————— Users routes —————
router.get("/all", isAuth, isAdmin, getAllUsers);
router.delete("/:userId", isAuth, isAdmin, deleteUser);
router.post("/:userId/toggle-admin", isAuth, isAdmin, toggleAdmin);
router.get("/user/:userId", isAuth, isAdmin, getSingleUser);

// ————— Posts routes for admin —————
router.get("/posts", isAuth, isAdmin, getAllPosts);
router.delete("/posts/:postId", isAuth, isAdmin, deletePost);

// ————— Loops routes for admin —————
router.get("/loops", isAuth, isAdmin, getAllLoopsAdmin);
router.delete("/loops/:loopId", isAuth, isAdmin, deleteLoopAdmin);

export default router;
