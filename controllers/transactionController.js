const Transaction = require('../models/Transaction');
const Momo = require('../models/Momo');
const LightningApiController = require('./lightningApiController');
const MomoApiController = require('./MomoApiController');

const createTransaction = async (req, res) => {
  try {
    console.log('📥 Incoming request payload:', req.body);

    const {
      payerMethod,
      senderNumber,
      receiverMethod,
      receiverNumber,
      amount,
      description
    } = req.body;

    const transactionData = {
      payerMethod,
      senderNumber,
      receiverMethod,
      receiverNumber,
      amount,
      description,
      status: 'pending'
    };

    console.log('🛠 Creating transaction object:', transactionData);

    const transaction = new Transaction(transactionData);
    const savedTransaction = await transaction.save();

    console.log('✅ Transaction saved to DB:', savedTransaction);

    let invoiceId = null;  // This will store the invoice or Momo ID

    // Call appropriate controller
    if (payerMethod === 'Bitcoin Lightning') {
      const bitcoinInvoice = await LightningApiController.createInvoiceFromTransaction(savedTransaction);
      invoiceId = bitcoinInvoice.data.invoiceReferenceId;  // Assuming this is the ID you want to send to frontend
    } else {
      const momoInvoiceId = await MomoApiController.createInvoice(savedTransaction);
      invoiceId = momoInvoiceId;  // Momo invoice ID returned by the API

      // Create Momo record
      const momo = new Momo({
        _id: invoiceId,
        payerMethod,
        senderNumber,
        receiverMethod,
        receiverNumber,
        amount,
        description,
        status: 'pending',
        initiatedTransaction: 'initiated'
      });

      await momo.save();
      console.log('📄 Momo invoice created and saved:', momo);
    }

    // Send response with the invoiceId
    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: savedTransaction,
      invoiceId // Return the invoice ID (either Bitcoin or Momo) in the response
    });
    
    console.log(invoiceId);
  } catch (error) {
    console.error('❌ Error in transaction flow:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createTransaction };
