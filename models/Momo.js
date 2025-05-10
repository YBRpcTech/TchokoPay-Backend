const mongoose = require('mongoose');

const momoSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Invoice ID from MomoApiController
  payerMethod: String,
  senderNumber: String,
  receiverMethod: String,
  receiverNumber: String,
  amount: Number,
  description: String,
  status: { type: String, default: 'pending' },
  initiatedTransaction: { type: String, default: 'initiated' }
}, { timestamps: true });

const Momo = mongoose.model('Momo', momoSchema);

module.exports = Momo;
