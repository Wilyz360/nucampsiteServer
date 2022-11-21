const express = require('express');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');

const campsiteRouter = express.Router(); 

// Add support for api endpoints
// Routing method that's a catch-all for all http verbs in this case
// catch all upcoming get put post delete request to the /campsites trigger this method
// Handle all endpoints for routing to campsites
campsiteRouter.route('/') 
.get((req, res, next) => { // next for deal with errors
    // get method: the client is asking to send back data for all campsites
    Campsite.find() // this will query the database for all the documents
    .populate('comments.author')
    .then( campsites => { // acess the results from the find method as campsites
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites);
    }).catch( err => next(err) ); // it pass the error to the overall error handler for this express application
})
.post(authenticate.verifyUser, (req, res, next) => {
    // Create new campsite document using the request body which should contain information for the campsite to post from the client
    Campsite.create(req.body).then( campsite => { // campsite contain information that was posted
        console.log('Campsite Created', campsite); // get information log to the console
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); // send info about the posted docuemnt to the client
    }).catch( err => next(err) );
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403,
    res.end('PUT operation not supported on /campsites');
})
.delete(authenticate.verifyUser, (req, res, next) => {
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
     .populate('comments.author')
     .then( campsite => { // campsite var will contain the document
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
     })
     .catch( err => next(err) );
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campstes/${req.params.campsiteId}`);
})
.put(authenticate.verifyUser, (req, res, next) => { 
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
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then( response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch( err => next(err)); 
});

//Request for comments - Enpoints for /:campsiteId/comments
campsiteRouter.route('/:campsiteId/comments') 
.get((req, res, next) => { 
    Campsite.findById(req.params.campsiteId) // it looks for a single campsite comment 
    .populate('comments.author')
    .then( campsite => { 
        if(campsite){ // check if campsite exist
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments);
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    }).catch( err => next(err) ); 
})
.post(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId) // it looks for a single campsite comment 
    .then( campsite => { 
        if(campsite){
            req.body.author = req.user._id;
            campsite.comments.push(req.body); // add new comment to the comment array of the campsite collection
            campsite.save() // to save the new comment 
            .then( campsite => {
                res.statusCode = 200 ;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite); // send back comments using json format 
            })
            .catch( err => next(err)); 
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    }).catch( err => next(err) );
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403,
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId) // it looks for a single campsite comment 
    .then( campsite => { 
        if(campsite){
            for(let i = (campsite.comments.length-1); i >= 0; i--){
                campsite.comments.id(campsite.comments[i]._id).remove(); // delete all comments by id
            }
            campsite.save() // to save the new comment 
            .then( campsite => {
                res.statusCode = 200 ;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite); // send back comments using json format 
            })
            .catch( err => next(err)); 
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    }).catch( err => next(err) );
});

// Request for specific campsite ids - Endpoits for /:campsiteId/comments/:commentId
campsiteRouter.route('/:campsiteId/comments/:commentId') // handle for specific comment of specific campsite
.get((req, res, next) => { 
    Campsite.findById(req.params.campsiteId) // it looks for a single campsite comment 
    .populate('comments.author')
    .then( campsite => { 
        if(campsite && campsite.comments.id(req.params.commentId)){ // check if campsite and commentId exist
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.commentId)); // send the specific comment that it was requested
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }  else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    }).catch( err => next(err) ); 
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campstes/${req.params.campsiteId}/comments/${req.params.commentId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId) // it looks for a single campsite comment 
    .then( campsite => { 
        if(campsite && campsite.comments.id(req.params.commentId)){ // check if campsite and commentId exist
            if(req.body.rating) { // check if a new rating has been passed in
                 campsite.comments.id(req.params.commentId).rating = req.body.rating; // update rating for this comment
            }
            if (req.body.text){ // check if a new text has been passed in
                campsite.comments.id(req.params.commentId).text = req.body.text; // update comment text
            }
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'applcation/json');
                res.json(campsite);
            })
            .catch( err => next(err) ); 
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }  else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    }).catch( err => next(err) );  
}) 
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId) // it looks for a single campsite comment 
    .then( campsite => { 
        if(campsite && campsite.comments.id(req.params.commentId)){ // check if campsite and commentId exist
            campsite.comments.id(req.params.commentId).remove(); // remove comment by id
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'applcation/json');
                res.json(campsite);
            })
            .catch( err => next(err) ); 
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }  else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    }).catch( err => next(err) );
});

module.exports = campsiteRouter;