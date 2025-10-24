const express = require("express");

// import middlewares
const authMiddleware = require("../middlewares/auth.middleware");

// import controllers
const {
  registerUserController,
  loginUserController,
  logoutUserController,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/logout", logoutUserController);

module.exports = router;
