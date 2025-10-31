// message.controllers.js
import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
      seen: false, // default to false
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id]
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Emit socket event to receiver
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: `send Message error ${error}` });
  }
};

// Get all messages between two users
export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    return res.status(500).json({ message: `get Message error ${error}` });
  }
};

// Mark messages as seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const senderId = req.params.senderId;

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, seen: false },
      { $set: { seen: true } }
    );

    return res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    return res.status(500).json({ message: `Mark seen error: ${error}` });
  }
};

// Get previous chat users
export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const conversations = await Conversation.find({
      participants: currentUserId
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const userMap = {};

    conversations.forEach(conv => {
      conv.participants.forEach(user => {
        if (user._id != currentUserId) {
          userMap[user._id] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);
    return res.status(200).json(previousUsers);
  } catch (error) {
    return res.status(500).json({ message: `prev user error ${error}` });
  }
};
