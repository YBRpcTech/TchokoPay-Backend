// test-create-invoice.js

const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.BTC_API_BASE_URL;
const API_KEY = '2259613c6d06bc42ea1962d7e5b35377'; // Hardcoded API Key

const createInvoice = async () => {
  try {
    const payload = {
        amount: 100,
        amountCurrency: "SATs",
        description: "Payment for order #12345",
        reference: "ORD-12345-ABC",
        expiresAt: "2025-05-20"
      }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'x-api-key': API_KEY,
      },
    };

    const response = await axios.post(`${API_BASE_URL}/api/v1/invoices`, payload, config);

    console.log('✅ Invoice created successfully:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error creating invoice:');
    console.error(error.response?.data || error.message);
  }
};

createInvoice();
