function auth(req, res, next) {
  if (req.user?.id) return next(); // checks if user has id

  return res.sendStatus(401);
}

module.exports = auth;
