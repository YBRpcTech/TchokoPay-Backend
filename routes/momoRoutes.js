// routes/momoRoutes.js

const express = require('express');
const router = express.Router();
const { initiateMomoPayment } = require('../controllers/paymentController');

// Route: POST /api/payment/momo-payout
router.post('/payment/momo-payout', initiateMomoPayment);

module.exports = router;
