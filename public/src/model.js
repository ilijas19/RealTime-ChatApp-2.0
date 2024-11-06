import { ORIGIN } from "./utils.js";

export const state = {
  currentUser: {},
};

export const loginUser = async function (email, password, room) {
  try {
    const result = await axios.post(`${ORIGIN}/api/v1/auth/login`, {
      email,
      password,
    });
    alert(result.data.msg);
    // state.currentUser = result.data.tokenUser;
    // state.currentUser.room = room;
    // console.log("Roo");
    window.location.href = `/chat?room=${room}`;
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const registerUser = async function (username, password, email) {
  try {
    const result = await axios.post(`${ORIGIN}/api/v1/auth/register`, {
      username,
      email,
      password,
    });

    alert("Registration Successfull... Transition to login...");
    // alert(result.data.msg);
    window.location.href = "/";
  } catch (error) {
    alert(error.response.data.msg);
  }
};

export const getCurrentUser = async function () {
  try {
    const result = await axios.get(`${origin}/api/v1/auth/showMe`);
    return result.data.user;
  } catch (error) {
    console.log(error);
  }
};
