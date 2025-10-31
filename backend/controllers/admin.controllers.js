// backend/controllers/admin.controllers.js

import User from "../models/user.model.js";
// You may import Post, Loop, etc. as needed
import Post from "../models/post.model.js";
import Loop from "../models/loop.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // omit sensitive fields
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: `getAllUsers error: ${error.message}` });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: `deleteUser error: ${error.message}` });
  }
};

export const toggleAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: `toggleAdmin error: ${error.message}` });
  }
};

// **New**: Get full single user details (profile, posts, loops)
export const getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate("posts")       // if user model has posts
      .populate("loops");      // if user model has loops

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, also fetch posts or loops separately:
    // const posts = await Post.find({ author: userId });
    // const loops = await Loop.find({ author: userId });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: `getSingleUser error: ${error.message}` });
  }
};
