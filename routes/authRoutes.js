const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  registerUser,
  loginUser,
  logoutUser,
  showMe,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", authenticateUser, logoutUser);
router.get("/showMe", authenticateUser, showMe);

module.exports = router;
