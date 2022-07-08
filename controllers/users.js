const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const UnauthorizedError = require('../errors/unauthorized');
const NotFoundError = require('../errors/not_found');
const BadRequestError = require('../errors/bad_request');
const ConflictError = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsersMe = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.status(200).send(user);
      console.log(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные для обновления профиля'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Неправильная почта или пароль!'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Неправильная почта или пароль!'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV !== 'production' ? 'dev-secret' : JWT_SECRET,
            { expiresIn: '7d' },
          );
          res.status(200).send({ token });
        });
    })
    .catch(next);
};
