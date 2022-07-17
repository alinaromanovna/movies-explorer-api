const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found');
const ForbiddenError = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRu,
    nameEn,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRu,
    nameEn,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => new NotFoundError('Пользователь по указанному id не найден.'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('У Вас нет прав для удаления карточки'));
      }
      return Movie.findByIdAndRemove(movieId)
        .then((deleteMovie) => {
          res.status(200).send({ message: `Фильм ${deleteMovie} удален` });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Переданы некорректные данные'));
          }
        });
    })
    .catch(next);
};
