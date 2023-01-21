const Movie = require('../models/movie');
const { NotFoundError, notFoundMovie } = require('../errors/NotFoundError');
const { BadRequestError, badRequestMessage } = require('../errors/BadRequestError');
const { ForbiddenError, forbiddenMovie } = require('../errors/ForbiddenError');

const postMovie = (req, res, next) => {
    Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(req.body);
        next(new BadRequestError(badRequestMessage));
      } else {
        next(err);
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
        throw new ForbiddenError(forbiddenMovie);
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
