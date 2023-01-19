class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const badRequestMessage = 'Переданы некорректные данные';
module.exports = { BadRequestError, badRequestMessage };
