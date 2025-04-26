const express = require('express');
const router = express.Router();
const { createInvoice, getInvoiceStatus } = require('../controllers/lightningApiController');

// Route to create a new invoice
router.post('/', createInvoice);

// Route to get status of a specific invoice
router.get('/:invoiceId', getInvoiceStatus);

module.exports = router;
