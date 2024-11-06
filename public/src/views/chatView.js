class ChatView {
  _chatForm = document.getElementById("chat-form");
  _messageInput = document.getElementById("message-input");
  _chatMessages = document.querySelector(".message-container");
  _roomName = document.querySelector(".room-name");
  _usersList = document.querySelector(".users-list");
  _usernameField = document.querySelector(".username-field");
  _logoutButton = document.querySelector(".logout-button");
  _menuButton = document.querySelector(".menu-button");
  _aside = document.querySelector(".aside");
  _closeMenuButton = document.querySelector(".close-menu-btn");

  addMenuBtnListeners() {
    this._menuButton.addEventListener("click", () => {
      this._aside.style.left = 0;
      this._aside.style.width = "100%";
      this._logoutButton.style.opacity = 1;
      this._logoutButton.style.pointerEvents = "auto";
    });
    this._closeMenuButton.addEventListener("click", () => {
      this._aside.style.left = "-50rem";
      this._aside.style.width = "0%";

      this._logoutButton.style.opacity = 0;
      this._logoutButton.style.pointerEvents = "none";
    });
  }

  addChatFormListeners(socket, currentUser) {
    this._chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      //checks for empty message
      if (this._messageInput.value === "") return;
      //emmiting sent message to server
      socket.emit("chatMessage", {
        msg: this._messageInput.value,
        user: currentUser,
        socketID: socket.id,
      });
      this._messageInput.value = "";
      this._messageInput.focus();
    });
  }

  addLogoutButtonListener(handler) {
    this._logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  }

  renderMessage(formatedMsg, currentUser) {
    const isCurrentUser = formatedMsg.username === currentUser.username;

    const message = `
      <div class="message">
         <p class="message-info ${isCurrentUser ? "" : "cBlack"}">
           ${formatedMsg.username}<span class="time">${formatedMsg.time}</span>
         </p>
         <p class="message-text">${formatedMsg.text}</p>
       </div>
    `;

    this._chatMessages.insertAdjacentHTML("beforeend", message);
    this._chatMessages.scrollTo(0, this._chatMessages.scrollHeight);
  }

  renderRoomName(room) {
    this._roomName.textContent = room;
  }

  renderUsers(users, currentUser) {
    this._usersList.innerHTML = `
    ${users
      .map(
        (user) =>
          `<li class="user ${
            user.username === currentUser.username ? "cOrange" : ""
          }">${user.username}</li>`
      )
      .join("")}
    `;
  }

  renderUsername(username) {
    this._usernameField.textContent = username;
  }
}

export default new ChatView();
