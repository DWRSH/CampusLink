// backend/controllers/adminLoop.controllers.js
import Loop from "../models/loop.model.js";

export const getAllLoopsAdmin = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });
    return res.status(200).json(loops);
  } catch (error) {
    return res.status(500).json({ message: `getAllLoopsAdmin error: ${error}` });
  }
};

export const deleteLoopAdmin = async (req, res) => {
  try {
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    await loop.deleteOne();

    return res.status(200).json({ message: "Loop deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `deleteLoopAdmin error: ${error}` });
  }
};
