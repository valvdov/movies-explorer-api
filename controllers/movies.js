const Movie = require('../models/movie');
const { NotFoundError, notFoundMovie } = require('../errors/NotFoundError');
const { BadRequestError, badRequestMessage } = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const postMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        console.log(req.body);
        next(new BadRequestError(badRequestMessage));
      } else {
        next(e);
      }
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(notFoundMovie);
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('У Вас недостаточно прав для удаления фильма');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(e);
      }
    });
};

module.exports = {
  postMovie, getMovies, deleteMovieById,
};