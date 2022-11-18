// Create Moongose User Schema and Model
const moongose = require('mongoose');
const Schema = moongose.Schema;

// Schema validation lets you create validation rules for your fields, such as allowed data types and value ranges.
const userSchema = new Schema({ // Create user Schema
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});

module.exports = moongose.model('User', userSchema); // create new model and export