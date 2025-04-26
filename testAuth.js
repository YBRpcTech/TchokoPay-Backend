const { authenticateAccount } = require('./services/api');

const testAuthentication = async () => {
  try {
    const token = await authenticateAccount();
    console.log('✅ Authentication successful. Token received:\n', token);
  } catch (error) {
    console.error('❌ Authentication test failed:', error.response?.data || error.message);
  }
};

testAuthentication();
