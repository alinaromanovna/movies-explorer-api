const mongoose = require('mongoose');
const { isURL } = require('validator');
// const user = require('./user');

const movieShema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (image) => isURL(image),
      message: 'Ссылка на изображение невалидна',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (trailer) => isURL(trailer),
      message: 'Ссылка на трейлер невалидна',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (poster) => isURL(poster),
      message: 'Ссылка на постер невалидна',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieShema);
