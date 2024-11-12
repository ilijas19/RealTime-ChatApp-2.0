require("dotenv").config();
require("express-async-errors");

const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
//packages
const cookieParser = require("cookie-parser");
//db
const connectDb = require("./db/connectDb");
//routers
const authRouter = require("./routes/authRoutes");
const navigationRouter = require("./routes/navigationRoutes");
const roomRouter = require("./routes/roomRoutes");
//middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);
app.use(navigationRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const {
  userJoin,
  userLeave,
  getRoomUsers,
  findUserSocketId,
} = require("./controllers/roomController");

const { formatMessage } = require("./utils");

const botName = "APP BOT";

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

    const messages = {}; // Stores message history for each pair

    io.on("connection", (socket) => {
      socket.on("joinRoom", async (data) => {
        // console.log(data.currentUser);
        data.currentUser.socketId = socket.id;

        await userJoin(data.currentUser, data.currentUser.room);

        socket.join(data.currentUser.room);

        //Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to Chat App"));

        //Broadcast message on user connection
        socket.broadcast
          .to(data.currentUser.room)
          .emit(
            "message",
            formatMessage(
              botName,
              `${data.currentUser.username} has joined the chat`
            )
          );

        //SEND USER AND ROOM INFO
        io.to(data.currentUser.room).emit("roomUsers", {
          room: data.currentUser.room,
          users: getRoomUsers(data.currentUser.room),
        });

        //RECIEVING PUBLIC MESSAGES FROM CLIENT
        socket.on("chatMessage", (data) => {
          const user = data.user;
          //-server recieved message from client msg form and emits to all users
          io.to(user.room).emit(
            "message",
            formatMessage(user.username, data.msg)
          );
        });

        //RECIEVING PRIVATE MESSAGE
        socket.on("sentPrivateMessage", (data) => {
          const { to, from, msg } = data;
          const time = new Date().toLocaleTimeString();
          const conversationKey = [from, to].sort().join("-");
          // console.log(conversationKey);
          if (!messages[conversationKey]) {
            messages[conversationKey] = [];
          }
          messages[conversationKey].push({ from, to, msg, time });

          const receiverSocketId = findUserSocketId(to);
          io.to(receiverSocketId).emit("recievedPrivateMessage", {
            from,
            msg,
            time,
          });
          io.to(socket.id).emit("recievedPrivateMessage", { from, msg, time });
          //--notification

          io.to(receiverSocketId).emit("recievedNotification", {
            from,
          });
        });
      });

      //FETCH MESSAGE HISTORY FOR A USER PAIR
      socket.on("fetchMessageHistory", ({ user1, user2 }) => {
        const conversationKey = [user1, user2].sort().join("-");
        const messageHistory = messages[conversationKey] || [];
        io.to(socket.id).emit("messageHistory", messageHistory);
      });

      socket.on("disconnect", async () => {
        const user = await userLeave(socket.id);
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

        //send user and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

start();
