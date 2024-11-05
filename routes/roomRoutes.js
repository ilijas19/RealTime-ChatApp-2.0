const express = require("express");
const router = express.Router();

const {
  authorizePermission,
  authenticateUser,
} = require("../middlewares/authentication");

const { createRoom, deleteRoom } = require("../controllers/roomController");

router.post(
  "/create",
  authenticateUser,
  authorizePermission("admin"),
  createRoom
);

router.delete(
  "/delete",
  authenticateUser,
  authorizePermission("admin"),
  deleteRoom
);

module.exports = router;
