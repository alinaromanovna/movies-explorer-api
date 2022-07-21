const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unauthorized');
const { JWT_KEY } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnathorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_KEY);
  } catch (err) {
    next(new UnathorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
