class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

const conflictErrorMessage = 'Пользователь с таким email уже существует';

module.exports = { ConflictError, conflictErrorMessage };
