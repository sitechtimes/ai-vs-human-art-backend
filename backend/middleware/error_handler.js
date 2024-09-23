function errorHandler(err, req, res, next) {
  req.status(500).send(err.message);
}
module.exports = { errorHandler };
