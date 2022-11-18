var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const partnerRouter = require('./routes/partnersRouter');
const promotionRouter = require('./routes/promotionRouter');

//Connect Express Server to MongoDB/Mongoose
const mongoose = require('mongoose'); // get mongoose API

const url = 'mongodb://localhost:27017/nucampsite'; // url for mogodb server
const connect = mongoose.connect(url, { // set up connection
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), // If connection success
  err => console.log(err) // If there is error in the connection  
); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

// Set up basic Authentication
// user must authenticate before can access any data
function auth(req, res, next) {
  console.log(req.session)
  if(!req.session.user) { // if upcomming req doesnt no include session. it means the client has no be authenticated
    const authHeader = req.headers.authorization;
    if(!authHeader){ // if it is null
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic'); // The server ask for authentication and the authentication is basic
      err.status = 401;
      return next(err); // Pass the error msg to express to handle error msg and authentication request back to the client
    }

    // Parse authentication header and validate username and password
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); 
    const user = auth[0];
    const pass = auth[1];
    if(user === 'admin' && pass === 'password'){ // user and pass are valid
      req.session.user = 'admin';  // Set up new session
      return next() // authorized
    } else {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic'); // The server ask for authentication and the authentication is basic
      err.status = 401;
      return next(err); 
    }
  } else {
    if(req.session.user === 'admin'){
      return next(); // pass the client to the next middleware function
    } else {
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }
}
app.use(auth);

// Data Access 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

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
