// controllers/momoController.js

const { api, authenticateAccount } = require('../services/api');

/**
 * POST /api/payment/momo-payout
 */
const initiateMomoPayment = async (req, res) => {
  try {
    const {
      phoneNumber,         // Must come from frontend
      amount,              // Must come from frontend
      emailAddress,        // Must come from frontend
      paymentMode,         // Must come from frontend
      externalReference,   // Must come from frontend
    } = req.body;

    // These are defaulted internally
    const transactionType = 'payout';       // Hardcoded to "payout"
    const currencyCode = 'XAF';              // Central African CFA Franc
    const countryCode = 'CM';                // Cameroon
    const featureCode = 'PRO';               // Pro feature
    const fullName = 'John Doe';              // Default dummy name

    // Strong validation: ensure critical fields are provided
    if (!phoneNumber || !amount || !emailAddress || !paymentMode || !externalReference) {
      return res.status(400).json({
        message: 'phoneNumber, amount, emailAddress, paymentMode, and externalReference are required',
      });
    }

    // Step 1: Authenticate
    const token = await authenticateAccount();

    // Step 2: Fire the MoMo payout API call
    const payoutRes = await api.post(
      '/api/v1/transactions/initiate-momo-payment',
      {
        phoneNumber,
        transactionType,
        amount,
        fullName,
        emailAddress,
        currencyCode,
        countryCode,
        paymentMode,
        externalReference,
        featureCode,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Step 3: Return successful response
    return res.status(200).json({
      message: 'MoMo payout initiated successfully',
      data: payoutRes.data,
    });
  } catch (error) {
    console.error(
      '❌ initiateMomoPayment error:',
      error.response?.data || error.message
    );
    return res.status(500).json({
      message: 'Failed to initiate MoMo payout',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { initiateMomoPayment };
