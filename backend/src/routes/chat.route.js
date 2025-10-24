const express = require("express");

const authiddleware = require("../middlewares/auth.middleware");

const {
  createChatController,
  getChatsController,
  getMessagesController,
} = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", authiddleware, createChatController);

router.get("/", authiddleware, getChatsController);

router.get("/messages/:id", authiddleware, getMessagesController);

module.exports = router;
