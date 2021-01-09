const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const logger = require('morgan');
const session = require('express-session');
const globalErrorHandler = require('./controllers/errorsController');
require('dotenv').config();

const dbConnector = require('./database/dbConnector');
const checkAuth = require('./middlewares/check-auth');

const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
let roomMap={}
require('./socket/sockets.js')(io,roomMap);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const matchesRouter = require('./routes/matches');
const { ErrorHandler } = require('./helpers/errorHandler');
const auth = require('./middlewares/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

dbConnector();

require('./config/passport')(passport);
// Passport init
app.use(
  session({
    secret: 'passport-js',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());


app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/rooms', auth, roomsRouter);
app.use('/api/v1/matches', auth, matchesRouter);


// error handler
app.all('*', (req, res, next) => {
  next(
    new ErrorHandler(
      404,
      `Can't find ${req.method} - ${req.originalUrl} on this server!`,
    )
  );
});
app.use(globalErrorHandler);


module.exports = {app: app, server: server};
