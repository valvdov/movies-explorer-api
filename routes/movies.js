const router = require('express').Router();
const {
  getMovies,
  postMovie,
  deleteMovieById,

} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const {
  checkNewMovie, checkMovieId,
} = require('../utils/validation');

router.get('/movies', auth, getMovies);
router.post('/movies', auth, checkNewMovie, postMovie);
router.delete('/movies/:movieId', auth, checkMovieId, deleteMovieById);

module.exports = router;