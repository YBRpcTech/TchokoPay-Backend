const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  payerMethod: { type: String, required: true },
  senderNumber: { type: String, default: null },
  receiverMethod: { type: String, required: true },
  receiverNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
