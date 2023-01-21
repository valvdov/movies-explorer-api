require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const router = require('./routes/routes');
const { ErrorHandler } = require('./middlewares/ErrorHandler')
const { limiter } = require('./middlewares/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, NODE_ENV, MONGODB_ADDRESS } = process.env;
const mongoDBAddress = NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://127.0.0.1:27017/bitfilmsdb';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use(helmet());
app.use(requestLogger);
app.use(router);
app.use(auth);
app.use(errorLogger);
app.use(errors());
app.use(limiter);
app.use(ErrorHandler);

mongoose.connect(mongoDBAddress, {
  useNewUrlParser: true,
}, () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
