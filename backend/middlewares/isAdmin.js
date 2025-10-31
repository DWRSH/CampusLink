// backend/middlewares/isAdmin.js
import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Check for valid userId (injected from isAuth)
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found." });
    }

    // Fetch only the isAdmin field from the user
    const user = await User.findById(userId).select("isAdmin");

    // Ensure the user exists and is an admin
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access only." });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    return res.status(500).json({ message: "Server error in isAdmin middleware." });
  }
};

export default isAdmin;
