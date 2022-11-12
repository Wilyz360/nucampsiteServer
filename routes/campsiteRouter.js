const express = require('express');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router(); 

// Add support for api endpoints
// Routing method that's a catch-all for all http verbs in this case
// catch all upcoming get put post delete request to the /campsites trigger this method
// Handle all endpoints for routing to campsites
campsiteRouter.route('/') 
.get((req, res, next) => { // next for deal with errors
    // get method: the client is asking to send back data for all campsites
    Campsite.find() // this will query the database for all the documents
    .then( campsites => { // acess the results from the find method as campsites
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
    }).catch( err => next(err) ); // it pass the error to the overall error handler for this express application
})
.post((req, res, next) => {
    // Create new campsite document using the request body which should contain information for the campsite to post from the client
    Campsite.create(req.body).then( campsite => { // campsite contain information that was posted
        console.log('Campsite Created', campsite); // get information log to the console
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); // send info about the posted docuemnt to the client
    }).catch( err => next(err) );
})
.put((req, res) => {
    res.statusCode = 403,
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    // delete all the campsites
    Campsite.deleteMany() // delete every documents in the campsite's collection
    .then( response => { // it gives information about how many documents were deleted
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }).catch( err => next(err) );
});

campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
     // Get docuement by id
     Campsite.findById(req.params.campsiteId)
     .then( campsite => { // campsite var will contain the document
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
     })
     .catch( err => next(err) );
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campstes/${req.params.campsiteId}`);
})
.put((req, res, next) => { 
    // Update campsite by id
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body // mongo operator for updating
    }, {
        new: true // get update rn
    })
    .then( campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch( err => next(err)); 
})
.delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then( response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch( err => next(err)); 
});

module.exports = campsiteRouter;