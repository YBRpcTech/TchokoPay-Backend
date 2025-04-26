const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.MOMO_API_BASE_URL,
  headers: {
    'client-key': process.env.CLIENT_KEY,
    'client-secret': process.env.CLIENT_SECRET,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const authenticateAccount = async () => {
  try {
    const response = await api.post('/api/v1/accounts/authenticate');
    return response.data.data.accessToken; // Save this token for future requests
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { api, authenticateAccount };
