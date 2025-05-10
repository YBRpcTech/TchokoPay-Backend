const mongoose = require('mongoose');

const bitcoinSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Invoice ID from the Lightning API
  payloadReceived: { type: Object, required: true }, // Store the full payload received
  status: { type: String, default: 'pending' }, // Default status is 'pending'
  invoiceHash: { type: String, required: true }, // LN invoice hash
  expiryDate: { type: String, required: true }, // Invoice expiry date (as string from API)
}, { timestamps: true });

const Bitcoin = mongoose.model('Bitcoin', bitcoinSchema);

module.exports = Bitcoin;
