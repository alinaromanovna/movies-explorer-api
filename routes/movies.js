const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.date().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/).required(),
    trailer: Joi.string().regex(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/).required(),
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
    thumbnail: Joi.string().min(2).max(30).required(),
    movieId: Joi.string().alphanum().length(24),
    owner: Joi.string().alphanum().length(24),
  }),
}), createMovie);

router.delete('/movies/_id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24),
  }),
}), deleteMovie);

module.exports = router;
