class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
const unauthorizedUser = 'Необходима авторизация';
module.exports = { UnauthorizedError, unauthorizedUser };
