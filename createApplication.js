const axios = require('axios');
const { login } = require('./services/lightningApi'); // Assuming this function handles authentication and returns a token
require('dotenv').config();

const API_BASE_URL = process.env.BTC_API_BASE_URL;

// CREATE APPLICATION AND GET APPLICATION REFERENCE ID
const createApplication = async () => {
  try {
    // Application details (you can replace these with dynamic values as needed)
    const applicationName = 'BoltPay'; // Replace with actual name
    const applicationDescription = 'Pay With BoltPay'; // Replace with actual description

    if (!applicationName || !applicationDescription) {
      console.error('applicationName and applicationDescription are required');
      return;
    }

    // Authenticate and get the token
    const token = await login();

    if (!token) {
      console.error('Authentication failed');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    };

    // Payload for application creation (removed environment)
    const payload = {
      name: applicationName,
      description: applicationDescription,
    };

    // Send the request to create the application
    const response = await axios.post(`${API_BASE_URL}/api/v1/applications`, payload, config);

    // Extract the application reference ID from the response
    const { applicationReferenceId } = response.data.data;

    if (!applicationReferenceId) {
      console.error('Failed to retrieve applicationReferenceId');
      return;
    }

    // Output the application reference ID
    console.log('Application created successfully!');
    console.log('Application Reference ID:', applicationReferenceId);

  } catch (error) {
    console.error('Error creating application:', error.response?.data || error.message);
  }
};

// Run the function
createApplication();
