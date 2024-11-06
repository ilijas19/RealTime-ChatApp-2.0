import * as model from "./model.js";
import authView from "./views/authView.js";
import chatView from "./views/chatView.js";

const loginController = () => {
  authView.addLoginFormListener(model.loginUser);
  authView.addRegisterFormListener(model.registerUser);
};

const chatController = async () => {
  if (window.location.href.includes("/chat")) {
    const { room } = Qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    const socket = io();

    const currentUser = await model.getCurrentUser();
    currentUser.room = room;
    //emmit current user to server on connection
    socket.emit("joinRoom", { currentUser });

    //get room and users
    socket.on("roomUsers", (data) => {
      chatView.renderRoomName(data.room);
      chatView.renderUsers(data.users, currentUser);
      chatView.renderUsername(currentUser.username);
    });

    //sending message
    chatView.addChatFormListeners(socket, currentUser);

    //messages from server
    socket.on("message", (message) => {
      chatView.renderMessage(message, currentUser);
    });
  }
};

loginController();

chatController();
