class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const badRequestMessage = 'Переданы некорректные данные';
const badRequestLogin ='Неправильные почта или пароль'
module.exports = { BadRequestError, badRequestMessage, badRequestLogin };
