function errorHandler(err, req, res, next) {
  // requires 4 paramters to be error handling middleware
  res.status(500).send(err.message);
}

module.exports = errorHandler;
