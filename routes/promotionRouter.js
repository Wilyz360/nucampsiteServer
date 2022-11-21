const express = require('express');
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');

const promotionRouter = express.Router();

promotionRouter.route('/') 
.get((req, res, next) => { // next for deal with errors
    // get method: the client is asking to send back data for all campsites
    Promotion.find() // this will query the database for all the documents
    .then( promotion => { // acess the results from the find method as campsites
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }).catch( err => next(err) ); // it pass the error to the overall error handler for this express application
})
.post(authenticate.verifyUser, (req, res, next) => {
    // Create new campsite document using the request body which should contain information for the campsite to post from the client
    Promotion.create(req.body).then( promotion => { // campsite contain information that was posted
        console.log('Promotion Created', promotion); // get information log to the console
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); // send info about the posted docuemnt to the client
    }).catch( err => next(err) );
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403,
    res.end('PUT operation not supported on /promotion');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    // delete all the campsites
    Promotion.deleteMany() // delete every documents in the campsite's collection
    .then( response => { // it gives information about how many documents were deleted
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }).catch( err => next(err) );
});

promotionRouter.route('/:promotionId')
.get((req, res, next) => {
     // Get docuement by id
     Promotion.findById(req.params.promotionId)
     .then( promotion => { // campsite var will contain the document
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
     })
     .catch( err => next(err) );
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotion/${req.params.promotionId}`);
})
.put(authenticate.verifyUser, (req, res, next) => { 
    // Update campsite by id
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body // mongo operator for updating
    }, {
        new: true // get update rn
    })
    .then( promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch( err => next(err)); 
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then( response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch( err => next(err)); 
});

module.exports = promotionRouter;