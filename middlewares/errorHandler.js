const CustomApiError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.code === 11000) {
    // console.log(err);
    const duplicateValues = Object.keys(err.keyValue);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Database contains value for ${duplicateValues}` });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something Went Wrong" });
};

module.exports = errorHandler;
