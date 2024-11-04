const notFound = (req, res) => {
  res.status(404).send("Resource Not Found");
};

module.exports = notFound;
