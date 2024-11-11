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

    //JOINING
    socket.emit("joinRoom", { currentUser });

    //GETTING ROOM AND USERS
    socket.on("roomUsers", (data) => {
      chatView.renderRoomName(data.room);
      chatView.renderUsers(data.users, currentUser, socket);
      chatView.renderUsername(currentUser.username);
    });

    //SENDING MESSAGES
    chatView.addChatFormListeners(socket, currentUser);

    //RECIEVING MESSAGES FROM SERVER
    socket.on("message", (message) => {
      chatView.renderMessage(message, currentUser);
    });

    //SENDING PRIVATE MESSAGES
    chatView.addPopupFormListener(socket);

    //RECIEVING PRIVATE MESSAGES AND RENDERING THEM IN ACTIVE POPUP
    socket.on("recievedPrivateMessage", (formattedMessage) => {
      chatView._renderPrivateMessage(formattedMessage);
    });

    // Fetching message history for a specific user
    socket.on("messageHistory", (history) => {
      // console.log(history, "HISTORY");
      chatView._popupMessageContainer.innerHTML = ""; // Clear previous messages
      history.forEach((message) => {
        chatView._renderPrivateMessage(message);
      });
    });

    //closing popup
    chatView.addClosePopupListener();
    //logout
    chatView.addLogoutButtonListener(model.logoutUser);

    chatView.addMenuBtnListeners();
  }
};

const popupController = async () => {};

loginController();

chatController();

popupController();
