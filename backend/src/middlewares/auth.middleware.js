const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findOne({ _id: decoded.id })
      .select("-password -__v");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

module.exports = authMiddleware;
