class AuthView {
  //login
  _loginEmailInput = document.getElementById("login-email");
  _loginPasswordInput = document.getElementById("login-password");
  _roomFieldInput = document.getElementById("room");
  _loginForm = document.getElementById("login-form");

  //register
  _registerEmailInput = document.getElementById("register-email");
  _registerPasswordInput = document.getElementById("register-password");
  _registerUsernameInput = document.getElementById("register-username");
  _registerForm = document.getElementById("register-form");

  addLoginFormListener(handler) {
    this._loginForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = this._loginEmailInput.value;
      const password = this._loginPasswordInput.value;
      const roomName = this._roomFieldInput.value;
      handler(email, password, roomName);
    });
  }

  addRegisterFormListener(handler) {
    this._registerForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = this._registerUsernameInput.value;
      const password = this._registerPasswordInput.value;
      const email = this._registerEmailInput.value;
      handler(username, password, email);
    });
  }
}

export default new AuthView();
