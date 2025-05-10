const axios = require('axios');
const Bitcoin = require('../models/Bitcoin');
require('dotenv').config();

const BTC_API_BASE_URL = process.env.BTC_API_BASE_URL;
const BTC_API_KEY = process.env.BTC_API_KEY;
const MOMO_API_KEY = "YI9n5YXd5hjasw-gXZscL";
const MOMO_BASE_URL = 'https://api.pay.mynkwa.com';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const formatDate = (date) => date.toISOString().split('T')[0];

// General function to make API requests
const makeApiRequest = async (url, method, data) => {
  try {
    console.log(`[API REQUEST] ${method} ${url} | Payload:`, data);
    const response = await axios({
      url: `${BASE_URL}${url}`,
      method: method,
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    });
    console.log(`[API RESPONSE] ${method} ${url} | Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[API ERROR] ${method} ${url} |`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response ? JSON.stringify(error.response.data) : error.message
    );
  }
};
// 🔁 Create Lightning Invoice
const createLightningInvoice = async ({ amount, description, reference }) => {
  const xafAmount = Number(amount);
  const amountInSats = Math.floor(xafAmount / 1); // assuming 1 XAF = 1 SAT

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const payload = {
    amount: amountInSats,
    amountCurrency: 'SATs',
    description,
    reference,
    expiresAt: formatDate(expiresAt),
  };

  const response = await axios.post(
    `${BTC_API_BASE_URL}/api/v1/invoices`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'x-api-key': BTC_API_KEY,
      },
    }
  );

  return response.data;
};

const pollInvoiceStatus = async (invoiceId) => {
  const config = {
    headers: {
      'x-api-key': BTC_API_KEY,
      Accept: '*/*',
    },
  };

  const MAX_ATTEMPTS = 100;
  const POLL_INTERVAL_MS = 5000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await axios.get(
        `${BTC_API_BASE_URL}/api/v1/partners/invoices/${invoiceId}`,
        config
      );

      const status = response.data?.data?.status;
      console.log(`🔍 [Invoice Attempt ${attempt}] Invoice ${invoiceId} status: ${status}`);

      if (status === 'completed') {
        console.log(`✅ Invoice ${invoiceId} has been paid.`);

        const invoice = await Bitcoin.findById(invoiceId);
        if (!invoice) {
          console.error(`⚠️ Invoice ${invoiceId} not found in DB`);
          return;
        }

        const { amount, receiverNumber } = invoice.payloadReceived;

        // ✅ Step 1: Initiate MoMo disbursement
        console.log(`💸 Initiating MoMo disbursement to ${receiverNumber}`);
        const disburseData = await makeApiRequest('/disburse', 'POST', {
          amount,
          phoneNumber: receiverNumber,
        });

        if (!disburseData?.id || disburseData.status !== 'pending') {
          console.warn('❌ Disbursement initiation failed:', disburseData);
          return;
        }

        // ✅ Step 2: Poll MoMo disbursement
        for (let i = 1; i <= MAX_ATTEMPTS; i++) {
          const disburseStatus = await makeApiRequest(`/payments/${disburseData.id}`, 'GET');
          console.log(`💳 [Disburse Attempt ${i}] Status: ${disburseStatus.status}`);

          if (disburseStatus.status === 'success') {
            console.log('✅ BTC collected and successfully disbursed via MoMo.');
            return;
          }

          await delay(POLL_INTERVAL_MS);
        }

        console.warn('⚠️ MoMo disbursement polling exceeded max attempts.');
        return;

      } else if (['failed', 'expired'].includes(status)) {
        console.warn(`❌ Invoice ${invoiceId} status: ${status}`);
        return;
      }

    } catch (error) {
      console.error(`❗ Error polling invoice ${invoiceId}:`, error.message);
    }

    await delay(POLL_INTERVAL_MS);
  }

  console.warn(`🚫 Max polling attempts reached for invoice ${invoiceId}`);
};



// 🌐 External API: Create Invoice
const createInvoice = async (req, res) => {
  try {
    const {
      amount,
      description,
      payerMethod,
      receiverMethod,
      receiverNumber,
      senderNumber,
    } = req.body;

    const reference = `TchokoPay-${description}`;
    const invoice = await createLightningInvoice({ amount, description, reference });

    const bitcoinData = new Bitcoin({
      _id: invoice.data.invoiceReferenceId,
      payloadReceived: req.body,
      status: invoice.data.status,
      invoiceHash: invoice.data.invoiceHash,
      expiryDate: invoice.data.expiryDate,
      amountInSats: invoice.data.originalAmount,
      btcEquivalent: invoice.data.btcEquivalentOfTokens,
    });

    await bitcoinData.save();

    pollInvoiceStatus(invoice.data.invoiceReferenceId);

    res.status(201).json({
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (error) {
    console.error('❌ Failed to create invoice:', error.message);
    res.status(500).json({
      message: 'Failed to create invoice',
      error: error.response?.data || error.message,
    });
  }
};

// 🛠 Internal Service: Create Invoice From Transaction
const createInvoiceFromTransaction = async (transaction) => {
  try {
    const { amount, description } = transaction;
    const reference = `TchokoPay-${description}`;
    const invoice = await createLightningInvoice({ amount, description, reference });

    const bitcoinData = new Bitcoin({
      _id: invoice.data.invoiceReferenceId,
      payloadReceived: transaction,
      status: invoice.data.status || 'pending',
      invoiceHash: invoice.data.invoiceHash,
      expiryDate: invoice.data.expiryDate,
      amountInSats: invoice.data.originalAmount,
      btcEquivalent: invoice.data.btcEquivalentOfTokens,
    });

    await bitcoinData.save();
    pollInvoiceStatus(invoice.data.invoiceReferenceId);

    return invoice;
  } catch (error) {
    console.error('❌ Error creating invoice from transaction:', error.message);
    throw error;
  }
};

// 🔍 API: Get Invoice Status
const getInvoiceStatus = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const config = {
      headers: {
        'x-api-key': BTC_API_KEY,
        Accept: '*/*',
      },
    };

    const response = await axios.get(
      `${BTC_API_BASE_URL}/api/v1/partners/invoices/${invoiceId}`,
      config
    );

    res.status(200).json({
      message: 'Invoice status retrieved successfully',
      data: response.data,
    });
  } catch (error) {
    console.error(`❌ Error getting invoice status:`, error.message);
    res.status(500).json({
      message: 'Failed to get invoice status',
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoiceStatus,
  createInvoiceFromTransaction,
};
