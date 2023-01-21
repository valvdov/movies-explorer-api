const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { BadRequestError, badRequestLogin } = require('../errors/BadRequestError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(badRequestLogin));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequestError(badRequestLogin));
          }
          return user;
        });
    });
};

module.exports = model('user', userSchema);
