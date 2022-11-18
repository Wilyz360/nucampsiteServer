const express = require('express');
const user = require('../models/user');
const User = require('../models/user'); // get user model
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username}) // cheack if user already exist
  .then(user => {
    if(user){
      const err = new Error(`User ${req.body.username} already exist!`);
      err.status = 403;
      return next(err);
    } else { // if username was NOT found
      User.create({ // create new username
        username: req.body.username,
        password: req.body.password
      })
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registration Successful', user: user});
      })
      .catch( err => next(err));
    }
  })
  .catch( err => next(err));
})

router.post('/login', (req, res, next) => {
  // Authetication
  if(!req.session.user){
    const authHeader = req.headers.authorization;
    if(!authHeader){ // if it is null
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic'); // The server ask for authentication and the authentication is basic
      err.status = 401;
      return next(err); // Pass the error msg to express to handle error msg and authentication request back to the client
    }

    // Parse authentication header and validate username and password
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); 
    const username = auth[0];
    const password = auth[1];

    User.findOne({username: username}) // check if username exist
    .then(user => {
      if(!user) {
        const err = new Error(`User ${username} does not exist`);
        err.status = 401;
        return next(err);
      } else if (user.password !== password) { // check if password exist
        const err = new Error(`Your password is incorrect`);
        err.status = 401;
        return next(err);
      } else if (user.username === username && user.password === password){ // confirm that username and password match
        req.session.user = 'authenticated'; 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch(err => next(err));
  } else { // if user is already log in
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy(); // delete authentication file on the server side
    res.clearCookie('session-id'); // clear cookie stored in the client
    res.redirect('/');  // redirect the user to the root path (main page)
  } else {
    const err = new Error('You are not logged in');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
