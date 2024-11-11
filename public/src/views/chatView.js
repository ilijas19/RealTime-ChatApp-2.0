class ChatView {
  _currentUser;
  _activeChatPartner;

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
  //popuo
  _chatPopup = document.querySelector(".popup-div");
  _popupTitle = document.querySelector(".popup-title");
  _popupMessageContainer = document.querySelector(".popup-chat");
  _popupForm = document.querySelector(".popup-message-form");
  _popupMessageInput = document.querySelector(".popup-message-input");
  _closePopupBtn = document.querySelector(".popup-close-btn");

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

  renderUsers(users, currentUser, socket) {
    //seting current user
    this._currentUser = currentUser;

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
    //-adding event listener for each username added
    document.querySelectorAll(".user").forEach((user) => {
      user.addEventListener("click", (e) => {
        if (e.target.textContent !== currentUser.username) {
          this._openPrivateChat(e.target.textContent, socket);
        }
        // this._openPrivateChat(e.target.textContent);
      });
    });
  }
  renderUsername(username) {
    this._usernameField.textContent = username;
  }
  //OPENING POPUP
  _openPrivateChat(username, socket) {
    this._activeChatPartner = username;

    this._chatPopup.style.opacity = 1;
    this._chatPopup.style.pointerEvents = "auto";
    this._popupTitle.textContent = `Chat with ${username}`;
    this._popupMessageContainer.innerHTML = "";

    // -fetch and display previous messagaes
    socket.emit("fetchMessageHistory", {
      user1: this._currentUser.username,
      user2: username,
    });
  }

  //SENDING PRIVATE MESSAGES
  addPopupFormListener(socket) {
    this._popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this._popupMessageInput.value === "") return;
      const message = this._popupMessageInput.value;

      //render message in senders popup
      this._renderPrivateMessage({
        to: this._activeChatPartner,
        from: this._currentUser.username,
        msg: message,
        time: new Date().toLocaleTimeString(),
      });

      //send the message to the reciever
      socket.emit("sentPrivateMessage", {
        to: this._activeChatPartner,
        from: this._currentUser.username,
        msg: message,
      });

      this._popupMessageInput.value = "";
      this._popupMessageInput.focus();
      this._popupMessageContainer.scrollTo(
        0,
        this._popupMessageContainer.scrollHeight
      );
    });
  }

  //--function to render private messages
  _renderPrivateMessage(formattedMessage) {
    if (
      formattedMessage.to === this._activeChatPartner ||
      formattedMessage.from === this._activeChatPartner
    ) {
      const message = `
      <div class="popup-message-div">
          <p class="popup-message-info">
            <span class="${
              formattedMessage.from !== this._currentUser.username
                ? "cBlack"
                : "cOrange"
            }">${formattedMessage.from} </span>${formattedMessage.time}
          </p>
          <p class="popup-message">
          ${formattedMessage.msg}
          </p>
        </div>
      `;
      this._popupMessageContainer.insertAdjacentHTML("beforeend", message);
    }
  }

  //CLOSING POPUP
  addClosePopupListener() {
    this._closePopupBtn.addEventListener("click", () => {
      this._chatPopup.style.opacity = 0;
      this._chatPopup.style.pointerEvents = "none";
    });
  }
}

export default new ChatView();
