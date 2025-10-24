const chatModel = require("../models/chat.model");

const createChatController = async (req, res) => {
  const { title } = req.body;
  const user = req.user;

  try {
    const chat = await chatModel.create({
      user: user._id,
      title: title,
    });
    res.status(201).json({
      message: "Chat created successfully",
      chat: chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating chat",
    });
  }
};

const getChatsController = async (req, res) => {
  const user = req.user;

  try {
    const chats = await chatModel.find({ user: user._id });
    res.status(200).json({
      message: "Chats fetched successfully",
      chats: chats.map((chat) => ({
        _id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        user: chat.user,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching chats",
    });
  }
};

const getMessagesController = async (req, res) => {
  const chatId = req.params.id;

  try {
    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });
    res.status(200).json({
      message: "Messages fetched successfully",
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching messages",
    });
  }
};

module.exports = {
  createChatController,
  getChatsController,
  getMessagesController,
};
