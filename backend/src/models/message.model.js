const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "model"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const chatModel = mongoose.model("message", messageSchema);

module.exports = chatModel;
