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
} = require("./controllers/roomController");

const { formatMessage } = require("./utils");

const botName = "APP BOT";

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

    io.on("connection", (socket) => {
      socket.on("joinRoom", async (data) => {
        data.currentUser.socketId = socket.id;

        await userJoin(data.currentUser, data.currentUser.room);

        socket.join(data.currentUser.room);

        //Welcome current user
        socket.emit("message", formatMessage(botName, "Welcome to Chat Cord"));
      });

      socket.on("disconnect", async () => {
        await userLeave(socket.id);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

start();
