const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { serverError } = require('./errors/server_error');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');
// , {
// useNewUrlParser: true,
// useCreateIndex: true,
// useFindAndModify: false,
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required,
    name: Joi.string().min(2).max(30).required,
    password: Joi.string().min(8).required,
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required,
    password: Joi.string().min(8).required,
  }),
}), login);

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

// app.use(errors());
app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
