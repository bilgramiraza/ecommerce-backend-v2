const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs  = require('express-handlebars');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const inventoryRouter = require('./routes/inventory');

const app = express();

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const mongodbURI = process.env.MONGODB_URI;
const mongodbParams = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(mongodbURI, mongodbParams);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', exphbs.engine({ 
  extname: 'hbs',
  layoutsdir: __dirname + '/views/layouts/',
  partialsdir: __dirname + '/views/partials/',
  helpers: {
    selected: function (chosen, value, options) {
      if (chosen && chosen === value) {
        return "selected"; 
      }else{
        return ""; 
      }
    },
  },
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
