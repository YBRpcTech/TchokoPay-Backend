const { login } = require('./services/lightningApi'); // Import the login function from the lightningApi.js

async function testLogin() {
  console.log('Starting the login test...');

  const authToken = await login(); // Call the login function

  if (authToken) {
    console.log('Test Passed: Authentication successful.');
    console.log('Auth Token:', authToken);
  } else {
    console.log('Test Failed: Authentication failed.');
  }
}

testLogin(); // Run the test
