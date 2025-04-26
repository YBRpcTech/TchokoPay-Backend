const axios = require('axios');
require('dotenv').config();

// Get the token dynamically from login
const { login } = require('./services/lightningApi');

const API_URL = 'https://lightningpay-testbox.ejaraapis.xyz/api/v1/api-keys';

async function createApiKey() {
  try {
    // Assuming `login()` returns the token
    const token = await login(); 

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const payload = {
      applicationReferenceId: 'app-6065d5854b3e4dca9a5a', // Update with your actual application reference ID
    };

    const response = await axios.post(API_URL, payload, config);
    console.log('API Key Created:', response.data);
  } catch (error) {
    console.error('Error creating API key:', error.response ? error.response.data : error.message);
  }
}

createApiKey();
