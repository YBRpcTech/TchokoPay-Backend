const express = require('express');
const { createTransaction } = require('../controllers/transactionController');
const { getBitcoinTransactionByInvoiceId } = require('../controllers/fetchLighting');

const router = express.Router();

router.post('/', createTransaction);
// Define the route to get the Bitcoin transaction by invoice ID
router.get('/transaction/:id', getBitcoinTransactionByInvoiceId);

module.exports = router;
