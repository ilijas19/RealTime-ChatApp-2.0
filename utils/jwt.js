const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJwt = createJwt({ payload: user });
  const refreshTokenJwt = createJwt({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const tenDays = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJwt, {
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.enviorment === "production",
  });

  res.cookie("refreshToken", refreshTokenJwt, {
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + tenDays),
    secure: process.env.enviorment === "production",
  });
};

module.exports = { verifyJwt, attachCookiesToResponse };
