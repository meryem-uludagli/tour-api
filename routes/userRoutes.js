const express = require("express");
const {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.patch("/reset-password/:token", resetPassword);

router.patch("/update-password", protect, updatePassword);
module.exports = router;
