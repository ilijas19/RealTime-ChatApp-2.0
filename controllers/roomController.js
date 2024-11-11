const Room = require("../model/Room");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

let users = [];

//for postman
const createRoom = async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) {
    throw new CustomError.BadRequestError("All credientials must be provided");
  }
  const room = await Room.create({ name: roomName });
  res.status(StatusCodes.OK).json({ msg: `Room ${roomName} created` });
};

const deleteRoom = async (req, res) => {
  const { roomName } = req.body;
  await Room.findOneAndDelete({ name: roomName });
  res.status(StatusCodes.OK).json({ msg: `Room deleted` });
};

//backend (for socket.io)
const userJoin = async (user, roomName) => {
  //ADDING TO ROOM IN DATABASE(FOR FUTURE IMPLEMENTATIONS)
  // const room = await Room.findOne({ name: roomName });
  // if (!room) {
  //   throw new CustomError.NotFoundError("No room found");
  // }
  // const isUserInRoom = room.users.some(
  //   (userId) => userId.toString() === user.userId
  // );
  // if (!isUserInRoom) {
  //   room.users.push(user.userId);
  //   await room.save();
  //   users.push(user);
  // }

  //ADING TO USERS ARRAY
  users.push(user);
};

const userLeave = async (socketId, roomName) => {
  const user = users.find((user) => user.socketId === socketId);
  //REMOVING USER FROM DATABASE(FOR FUTURE IMPLEMENTATIONS)
  // const room = await Room.findOne({ name: user.room });
  // if (!room) {
  //   throw new CustomError.NotFoundError("No room found");
  // }
  // room.users = room.users.filter((userId) => userId.toString() !== user.userId);
  // await room.save();
  users = users.filter((user) => user.socketId !== socketId);
  return user;
  // console.log(user, userLeave);
};

// const getRoomUsers = async (roomName) => {
//   const room = await Room.findOne({ name: roomName });
//   return room ? room.users : [];
// };

//get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

const findUserSocketId = (username) => {
  const user = users.find((user) => user.username === username);
  return user.socketId;
};

module.exports = {
  createRoom,
  deleteRoom,
  userJoin,
  userLeave,
  getRoomUsers,
  findUserSocketId,
};
