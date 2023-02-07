const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Поле email заполнено неверно',
    },

  },
  password: {
    type: String,
    required: true,
    select: false,

  },
});

module.exports = mongoose.model('user', userShema);
