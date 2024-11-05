var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var playersRouter = require('./routes/players');
var cardsRouter = require('./routes/cards');
var teamRouter = require('./routes/team');
var transportRouter = require('./routes/transport');
var gpsRouter = require('./routes/gps');
var automaticSwap = require('./services/automaticSwap');

var auth = require('./auth');

var app = express();

const corsOptions = {
  origin: '*', // Allow your frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Specify the HTTP methods you want to allow
  allowedHeaders: 'Content-Type,Authorization',  // Allow specific headers
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/player', playersRouter);
app.use('/cards', auth , cardsRouter);
app.use('/team', auth , teamRouter);
app.use('/transport', auth , transportRouter);
app.use('/gps', auth , gpsRouter);
automaticSwap()

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
