const express = require('express');
const User = require('../models/user'); // get user model
const passport = require('passport');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register( // handle new user registration
    new User({username: req.body.username}),
    req.body.password,
    err => {
      if(err) { // if error
        res.statusCode = 500; 
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {  // handle uthentication
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful'});
        })
      }
    }
  );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are successfully logged in!'});
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
