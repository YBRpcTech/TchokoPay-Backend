const axios = require('axios');
require('dotenv').config();
const Invoice = require('../models/Invoice'); // ✅ Import your invoice model

const API_BASE_URL = process.env.BTC_API_BASE_URL;
const API_KEY = '2259613c6d06bc42ea1962d7e5b35377'; // 🔐 Move this to .env later

// CREATE INVOICE
const createInvoice = async (req, res) => {
  try {
    const {
      amount, // received in XAF
      amountCurrency,
      description,
      reference,
      expiresAt,
    } = req.body;

    // ⚡️ Step 1: Convert XAF to SATS
    const xafAmount = Number(amount); // ensure it's a number
    const satoshiRate = 0.79; // 1 satoshi = 278 XAF
    const amountInSats = xafAmount / satoshiRate;

    // ⚡️ Step 2: Apply 5% charges
    const finalAmountInSats = amountInSats; // keep 95% after cutting 5%

    // ⚡️ Step 3: Ensure final amount is an integer (SATs are integers)
    const finalAmountInSatsRounded = Math.floor(finalAmountInSats);

    const payload = {
      amount: finalAmountInSatsRounded,  // final satoshi amount after conversion & deduction
      amountCurrency: 'SATs',             // force sending SATs because conversion was done
      description,
      reference,
      expiresAt,
    };

    console.log("🔄 Creating Invoice...");
    console.log("➡️ API Endpoint:", `${API_BASE_URL}/api/v1/invoices`);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));
    console.log("🔑 API Key Used:", API_KEY ? "Yes ✅" : "No ❌");

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'x-api-key': API_KEY,
      },
    };

    const response = await axios.post(`${API_BASE_URL}/api/v1/invoices`, payload, config);

    console.log("✅ Invoice Created Successfully:", response.data);

    // ✅ Save invoice to DB using the model
    const invoiceData = response.data?.data;

    const invoiceToSave = new Invoice({
      invoiceReferenceId: invoiceData.invoiceReferenceId,
      reference: invoiceData.reference,
      description: invoiceData.description,
      originalAmount: xafAmount, // store the original XAF amount from frontend
      amountCurrency: 'XAF', // storing it as XAF because that's what was paid
      feeDetails: {
        ejaraFee: invoiceData.feeDetails?.ejaraFee,
        partnerCommission: invoiceData.feeDetails?.partnerCommission,
        totalFee: invoiceData.feeDetails?.totalFee,
      },
      totalAmountWithFees: invoiceData.totalAmountWithFees,
      status: invoiceData.status,
      invoiceHash: invoiceData.invoiceHash,
      expiryDate: invoiceData.expiryDate,
      btcEquivalentOfTokens: invoiceData.btcEquivalentOfTokens || invoiceData.btcEquivalent,
      dateCreated: invoiceData.dateCreated || new Date(),
    });

    await invoiceToSave.save();
    console.log("💾 Invoice saved to DB");

    res.status(201).json({
      message: 'Invoice created successfully',
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error Creating Invoice:");
    console.error("Status:", error.response?.status);
    console.error("Response Data:", error.response?.data || error.message);

    res.status(500).json({
      message: 'Failed to create invoice',
      error: error.response?.data || error.message,
    });
  }
};


// GET INVOICE STATUS
const getInvoiceStatus = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const config = {
      headers: {
        'x-api-key': API_KEY,
        Accept: '*/*',
      },
    };

    console.log("🔍 Checking Invoice Status...");
    console.log("🆔 Invoice ID:", invoiceId);
    console.log("➡️ API Endpoint:", `${API_BASE_URL}/api/v1/partners/invoices/${invoiceId}`);

    const response = await axios.get(`${API_BASE_URL}/api/v1/partners/invoices/${invoiceId}`, config);

    console.log("✅ Invoice Status Retrieved:", response.data);

    res.status(200).json({
      message: 'Invoice status retrieved successfully',
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error Fetching Invoice Status:");
    console.error("Status:", error.response?.status);
    console.error("Response Data:", error.response?.data || error.message);

    res.status(500).json({
      message: 'Failed to retrieve invoice status',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoiceStatus,
};
