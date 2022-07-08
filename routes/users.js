const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsersMe, updateUser } = require('../controllers/users');

router.get('/users/me', getUsersMe);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().min(2).max(30).required(),
      // password: Joi.string().min(8).required(),
    }),
  }),
  updateUser,
);

module.exports = router;
