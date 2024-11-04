const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    maxLength: 20,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email value"],
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: "Not Valid Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    maxLength: 60,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: true, //true for easy testing
  },
  verificationToken: {
    type: String,
  },
  passwordVerificationToken: {
    type: String, //future implementation
  },
  passwordTokenExpDate: {
    type: Date, //future implementation
  },
});

UserSchema.methods.comparePassword = async function (candidatePass) {
  return await bcrypt.compare(candidatePass, this.password);
};

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", UserSchema);
