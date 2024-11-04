const User = require("../model/User");
const Token = require("../model/Token");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createTokenUser, attachCookiesToResponse } = require("../utils/index");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new CustomError.BadRequestError("All credientials must be specified");
  }
  const user = await User.create({ username, email, password });
  res.status(StatusCodes.OK).json({ user });
};

//To-do: on each login add user to room model
const loginUser = async (req, res) => {
  const { email, password, room } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified email");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Wrong Password");
  }

  const tokenUser = createTokenUser(user);
  const existingToken = await Token.findOne({ user: tokenUser.userId });
  if (existingToken) {
    const refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfully (existing token)", tokenUser });
  }

  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const refreshToken = crypto.randomBytes(40).toString("hex");
  await Token.create({ ip, userAgent, user: tokenUser.userId, refreshToken });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "Login Successfully", tokenUser });
};

//To-do: on each login remove user from room model
const logoutUser = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

const showMe = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

///////////////////
////////////////
////////////
const verifyEmail = async (req, res) => {
  res.send("verifyEmail");
};

const forgotPassword = async (req, res) => {
  res.send("forgot");
};

const resetPassword = async (req, res) => {
  res.send("resset pass");
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  showMe,
};
