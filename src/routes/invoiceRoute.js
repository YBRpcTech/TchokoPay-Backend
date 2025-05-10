const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../Controllers/invoiceController');

// Route to handle QR code invoice generation
router.post('/generate-from-qr', generateInvoice);

module.exports = router;