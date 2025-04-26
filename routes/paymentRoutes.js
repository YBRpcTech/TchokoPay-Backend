const express = require('express');
const router = express.Router();
const { createInvoice, getInvoiceStatus } = require('../controllers/lightningApiController');

// Route to create a new invoice
router.post('/invoices', createInvoice);

// Route to get status of a specific invoice
router.get('/invoices/:invoiceId', getInvoiceStatus);

module.exports = router;
