// routes/momoRoutes.js

const express = require('express');
const router = express.Router();
const { initiateMomoPayment } = require('../controllers/paymentController');
const { getMomoTransactionByInvoiceId } = require('../controllers/momoController');
const { momoPayments } = require('../controllers/momoPaymentApi');

// Route: POST /api/payment/momo-payout
router.post('/pay', momoPayments);

// Route to get Momo transaction by invoice ID
router.get('/transaction/:id', getMomoTransactionByInvoiceId);

module.exports = router;
