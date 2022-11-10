const express = require('express');
const campsiteRouter = express.Router(); 

// Add support for api endpoints
// Routing method that's a catch-all for all http verbs in this case
// catch all upcoming get put post delete request to the /campsites trigger this method
// Handle all endpoints for routing to campsites
campsiteRouter.route('/')
.all((req, res, next) => { // '/' roor directory
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // Is used to pass control of the application routing to the next relevant routing method after this one
})
.get((req, res) => {
    res.end('Will send all the campsites to you');
})
.post((req, res) => {
    res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`)
})
.put((req, res) => {
    res.statusCode = 403,
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res) => {
    res.end('Deleting all campsites');
});

campsiteRouter.route('/:campsiteId')
.all((req, res, next) => { // '/' roor directory
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); // Is used to pass control of the application routing to the next relevant routing method after this one
})
.get((req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campstes/${req.params.campsiteId}`);
})
.put((req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
    res.end(`Will update the campsite: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`);
});

module.exports = campsiteRouter;