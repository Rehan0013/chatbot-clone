const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUserController = async (req, res) => {
  const {
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      fullName: {
        firstName,
        lastName,
      },
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7), // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Username and password are required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7), // 7 days
  });

  res.status(200).json({
    message: "User logged in successfully",
    token: token,
  });
};

const logoutUserController = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
};
