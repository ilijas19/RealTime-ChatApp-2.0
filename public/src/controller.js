import * as model from "./model.js";
import authView from "./views/authView.js";

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

    socket.emit("joinRoom", { currentUser });
  }
};

loginController();

chatController();
