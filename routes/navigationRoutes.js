const express = require("express");
const router = express.Router();
const path = require("path");

const { authenticateUser } = require("../middlewares/authentication");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.get("/chat", authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chat.html"));
});

module.exports = router;
