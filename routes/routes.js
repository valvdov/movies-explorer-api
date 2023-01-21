const router = require('express').Router();
const MoviesRouter = require('./movies');
const usersRouter = require('./users');
const notFound = require('./not-found');

router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  const errorMessage = statusCode === 500 ? 'На сервере произошла ошибка' : message;
  res.status(statusCode).send({ message: errorMessage });
  next();
});

router.use(
  usersRouter,
  MoviesRouter,
  notFound,
);

module.exports = router;