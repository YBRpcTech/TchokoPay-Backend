// Import the User model from the models directory
const User = require('../models/signUp');

// Define an asynchronous signup controller function
const signup = async (req, res) => {
  try {
    // Extract name, email, password, and phoneNumber from the request body
    const { name, email, password, phoneNumber } = req.body;

    // Step 1: Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If a user with the given email already exists, return a 400 Bad Request response
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 2: Validate the phone number
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      // If the phone number already exists, return a 400 Bad Request response
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Step 3: Generate a custom user ID like USR01, USR02, etc.
    const lastUser = await User.findOne().sort({ createdAt: -1 }); // Get the most recent user
    let customId = 'USR01'; // Default starting ID if no users exist

    if (lastUser && lastUser.customId) {
      // Extract number from last customId and increment it
      const lastNumber = parseInt(lastUser.customId.replace('USR', ''));
      const nextNumber = (lastNumber + 1).toString().padStart(2, '0'); // e.g., 3 -> "03"
      customId = `USR${nextNumber}`; // e.g., "USR03"
    }

    // Step 4: Create a new user instance using the data from the request
    const newUser = new User({
      name,
      email,
      password,
      phoneNumber, // Assign phone number from request body
      customId,    // Assign generated custom ID
    });

    // Step 5: Save the new user to the MongoDB database
    await newUser.save();

    // Step 6: Respond with a 201 Created status and include user info (excluding password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.customId,  // Return the custom user ID instead of _id
        name: newUser.name,    // Return the name
        email: newUser.email,  // Return the email
        phoneNumber: newUser.phoneNumber // Return the phone number
      }
    });

  } catch (error) {
    // If any error occurs (e.g., DB connection issues), send a 500 Internal Server Error
    res.status(500).json({ message: error.message });
  }
};

// Export the signup function so it can be used in the routes
module.exports = { signup };
