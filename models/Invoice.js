const mongoose = require('mongoose');

// Define the schema for the invoice
const invoiceSchema = new mongoose.Schema({
  invoiceReferenceId: {
    type: String,
    required: true,
    unique: true,
  },
  reference: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  originalAmount: {
    type: Number,
    required: true,
  },
  amountCurrency: {
    type: String,
    required: true,
  },
  feeDetails: {
    ejaraFee: {
      type: Number,
      required: true,
    },
    partnerCommission: {
      type: Number,
      required: true,
    },
    totalFee: {
      type: Number,
      required: true,
    },
  },
  totalAmountWithFees: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true,
  },
  invoiceHash: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  btcEquivalentOfTokens: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
