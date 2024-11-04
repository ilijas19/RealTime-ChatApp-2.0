const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide room name"],
    unique: true,
  },
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  privateRoom: {
    type: Boolean,
    default: false,
  },
  allowedUsers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Room", RoomSchema);
