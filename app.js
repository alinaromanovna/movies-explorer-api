require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { serverError } = require('./errors/server_error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { BAZA_MOVIES } = require('./utils/config');
const { routes } = require('./routes/index');

const app = express();

mongoose.connect(BAZA_MOVIES)
  .then(() => {
    console.log('successfully connected');
  }).catch((e) => {
    console.log('not connected', e);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.use('/', routes);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
