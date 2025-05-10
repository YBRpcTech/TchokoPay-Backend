// Import necessary modules
const mongoose = require('mongoose'); // MongoDB object modeling
const dotenv = require('dotenv'); // For environment variable management
const app = require('./app'); // Import the app configuration
const connectDB = require('./config/db'); // Database connection configuration

// Load environment variables from .env file
dotenv.config();

// Establish connection to MongoDB using the connectDB function
connectDB();

// Define the port the server will listen on (either from environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server and log the status to the console
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`); // Confirmation message on successful server start
});
