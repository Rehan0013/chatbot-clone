const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

const generateResponse = require("../services/ai.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.request.headers?.cookie || "");

      if (!cookies.token) {
        console.error(
          "Authentication error: Token not found for socket",
          socket.id
        );
        return next(new Error("Authentication error: Token not found"));
      }

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        console.error(
          "Authentication error: User not found for socket",
          socket.id
        );
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error(
        "Authentication error for socket",
        socket.id,
        ":",
        error.message
      );

      if (error.name === "JsonWebTokenError") {
        next(new Error("Authentication error: Invalid token"));
      } else if (error.name === "TokenExpiredError") {
        next(new Error("Authentication error: Token expired"));
      } else {
        next(new Error("Authentication error: Server error"));
      }
    }
  });

  io.on("connection", (socket) => {
    console.log("New Socket connected: ", socket.id);

    socket.on("ai-message", async (messagePayload) => {
      try {
        console.log("Received AI message:", messagePayload);

        // Validate payload
        if (
          !messagePayload ||
          !messagePayload.content ||
          !messagePayload.chat
        ) {
          throw new Error(
            "Invalid message payload: content and chat are required"
          );
        }

        // Save user message
        await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        });

        const chatHistory = await messageModel.find({
          chat: messagePayload.chat,
        });

        console.log("Chat history:", chatHistory);

        // Generate AI response
        const response = await generateResponse(
          chatHistory.map((item) => {
            return {
              role: item.role,
              parts: [
                {
                  text: item.content,
                },
              ],
            };
          })
        );

        // Save AI response
        await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        });

        // Send response back to client
        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });
      } catch (error) {
        console.error(
          "Error processing AI message for socket",
          socket.id,
          ":",
          error.message
        );

        // Send error response to client without crashing the server
        socket.emit("ai-error", {
          message: "Failed to process message",
          error:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Internal server error",
        });
      }
    });

    // Handle socket errors
    socket.on("error", (error) => {
      console.error("Socket error for", socket.id, ":", error.message);
    });
  });

  // Handle server-level errors
  io.engine.on("connection_error", (error) => {
    console.error("Socket.io connection error:", error);
  });

  io.on("disconnect", (socket) => {
    console.log("Socket disconnected: ", socket.id);
  });

  return io;
}

module.exports = initSocketServer;
