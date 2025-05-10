// Import Mongoose for database modeling and bcrypt for password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  _customId: {
    type: String,
    unique: true, // Ensure each user has a unique custom ID (e.g., USR01, USR02)
  },
  name: { 
    type: String, 
    required: true // Name is a required field
  },
  email: { 
    type: String, 
    required: true, // Email is required
    unique: true // Email must be unique to prevent duplicate registrations
  },
  password: { 
    type: String, 
    required: true // Password is required
  }
}, { 
    _id: false,  // Disable default _id field
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Middleware: Runs before saving a user to the database
userSchema.pre('save', async function (next) {
  // If the password hasn't been modified, skip hashing
  if (!this.isModified('password')) return next();

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Proceed to save the user
  next();
});

// Export the model to be used elsewhere in the project
module.exports = mongoose.model('User', userSchema);
