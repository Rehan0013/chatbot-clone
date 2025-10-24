const express = require("express");

const authiddleware = require("../middlewares/auth.middleware");

const { createChatController } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", authiddleware, createChatController);

module.exports = router;
