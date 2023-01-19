const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../utils/constants');
const { BadRequestError, badRequestMessage } = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { NotFoundError, notFoundUser } = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(STATUS_CREATED).send({
      _id: user._id,
      email,
      name,
    }))
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (e.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(notFoundUser);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(e);
      }
    });
};//

const updateMyInfo = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;
  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(notFoundUser);
    })
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(e);
      }
    });
};


module.exports = {
  createUser, getMyInfo, updateMyInfo, login,
};