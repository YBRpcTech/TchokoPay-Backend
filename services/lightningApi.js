const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Constants from the .env file
const API_BASE_URL = process.env.BTC_API_BASE_URL;
const EMAIL = process.env.BTC_API_EMAIL;
const PASSWORD = process.env.BTC_API_PASSWORD;

// Function to log in and get the auth token
async function login() {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/authentication/login`,
      {
        email: EMAIL,
        password: PASSWORD
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      const { authToken } = response.data.data; // Get the auth token
      console.log("Authentication successful. Token:", authToken);
      return authToken;
    } else {
      console.error('Authentication failed:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Export the login function
module.exports = {
  login
};
