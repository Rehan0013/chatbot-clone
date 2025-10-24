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

module.exports = {
  createChatController,
};
