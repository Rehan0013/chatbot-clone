const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// import routes
const authRoutes = require("./routes/auth.route");
const chatRoutes = require("./routes/chat.route");

const app = express();

// using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// using routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
