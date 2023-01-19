const router = require('express').Router();
const {
  createUser,
  updateMyInfo,
  login,
  getMyInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  checkLogin, checkUserData, checkReg,
} = require('../utils/validation');

router.get('/users/me', auth, getMyInfo);

router.post('/signin', checkLogin, login);
router.post('/signup', checkReg, createUser);

router.patch('/users/me', auth, checkUserData, updateMyInfo);


module.exports = router;