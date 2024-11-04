import * as model from "./model.js";
import authView from "./views/authView.js";

const loginController = () => {
  authView.addLoginFormListener(model.loginUser);
  authView.addRegisterFormListener(model.registerUser);
};

const chatController = async () => {
  if (window.location.href.includes("/chat")) {
    const socket = io();

    const currentUser = await model.getCurrentUser();
    // console.log(currentUser);

    socket.emit("joinRoom", { currentUser });
  }
};

loginController();

chatController();
