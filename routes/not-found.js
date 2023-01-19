const router = require('express').Router();
const { NotFoundError } = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

router.all('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;