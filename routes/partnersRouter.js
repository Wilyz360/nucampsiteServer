const express = require('express');
const Partner = require('../models/partners');

const partnerRouter = express.Router();

partnerRouter.route('/') 
.get((req, res, next) => { // next for deal with errors
    // get method: the client is asking to send back data for all campsites
    Partner.find() // this will query the database for all the documents
    .then( partners => { // acess the results from the find method as campsites
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    }).catch( err => next(err) ); // it pass the error to the overall error handler for this express application
})
.post((req, res, next) => {
    // Create new campsite document using the request body which should contain information for the campsite to post from the client
    Partner.create(req.body).then( partner => { // campsite contain information that was posted
        console.log('Partner Created', partner); // get information log to the console
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); // send info about the posted docuemnt to the client
    }).catch( err => next(err) );
})
.put((req, res) => {
    res.statusCode = 403,
    res.end('PUT operation not supported on /partner');
})
.delete((req, res, next) => {
    // delete all the campsites
    Partner.deleteMany() // delete every documents in the campsite's collection
    .then( response => { // it gives information about how many documents were deleted
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }).catch( err => next(err) );
});

partnerRouter.route('/:partnerId')
.get((req, res, next) => {
     // Get docuement by id
     Partner.findById(req.params.partnerId)
     .then( partner => { // campsite var will contain the document
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
     })
     .catch( err => next(err) );
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campstes/${req.params.partnerId}`);
})
.put((req, res, next) => { 
    // Update campsite by id
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body // mongo operator for updating
    }, {
        new: true // get update rn
    })
    .then( partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch( err => next(err)); 
})
.delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then( response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch( err => next(err)); 
});

module.exports = partnerRouter;