const createTokenUser = (user) => {
  return {
    userId: user._id,
    role: user.role,
    username: user.username,
    email: user.email,
  };
};

module.exports = createTokenUser;
