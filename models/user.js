// Create Moongose User Schema and Model
const moongose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); // Handle user registration and authentication
const Schema = moongose.Schema;

// Schema validation lets you create validation rules for your fields, such as allowed data types and value ranges.
const userSchema = new Schema({ // Create user Schema
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = moongose.model('User', userSchema); // create new model and export 