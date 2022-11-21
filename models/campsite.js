const mongoose = require('mongoose');
const Schema = mongoose.Schema;  

require('mongoose-currency').loadType(mongoose); // load new currency type into mongoose
const Currency = mongoose.Types.Currency; 

const commentSchema = new Schema({ // for storing comments documents about a campsite
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
         type: String,
         required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   } 
}, {
    timestamps: true
});

// Instantiate a new object named campsite schema
// Schema(obj(required), optioal), obj contains the definition for the schema via object's properties
const campsiteSchema = new Schema({
    name: { // Defining a collection
        type: String, 
        required: true, // name is required
        unique: true    // must be unique (name must be unique)
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    // Add document ass a sub schema
    comments: [commentSchema]
}, { // second argument - for setting various configuration options
    timestamps: true, // atomatically add two properties to the schema - created at & updated at - mongoose will manage for us
});

// Create model using schema
// This creates a model named campsites 
// the first afrument must be capitalized and singular version of the name of the collection that you
// want to use for this model
// we want to use for the collection name campsite s
const Campsite = mongoose.model('Campsite', campsiteSchema); // it returns a constructor function
  

module.exports = Campsite;