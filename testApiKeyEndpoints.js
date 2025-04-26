const axios = require('axios');
const { login } = require('../services/lightningApi'); // Adjust the path to match your file structure
require('dotenv').config();

// Simulating the request body and the API base URL
const API_BASE_URL = process.env.BTC_API_BASE_URL; // Make sure this is set in your .env file
const applicationReferenceId = 'gotyu-payment-app'; // Change to whatever reference you want to test

// Simulate the API Key Creation Logic
const createApiKey = async () => {
  try {
    // Ensure applicationReferenceId is provided
    if (!applicationReferenceId) {
      console.log('❌ applicationReferenceId is required');
      return;
    }

    // Step 1: Log in and get the token
    const token = await login(); // Assumes this returns a token

    if (!token) {
      console.log('❌ Authentication failed');
      return;
    }

    // Step 2: Configure the request with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*'
      }
    };

    // Step 3: Prepare the payload for the POST request
    const payload = { applicationReferenceId };

    // Step 4: Send the request to create the API key
    const response = await axios.post(`${API_BASE_URL}/api/v1/api-keys`, payload, config);

    // Step 5: Output the result
    console.log('✅ API Key Created Successfully:');
    console.log(response.data);

  } catch (error) {
    console.error('❌ Error during API key creation:');
    console.error(error.response?.data || error.message);
  }
};

// Run the script
createApiKey();
