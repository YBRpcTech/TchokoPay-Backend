const Momo = require('../models/Momo');  // Import the Momo model

// Controller function to fetch Momo transaction by invoice ID
const getMomoTransactionByInvoiceId = async (req, res) => {
  try {
    const { id } = req.params;  // Retrieve the invoice ID from URL params

    // Find the transaction record by invoice ID
    const transaction = await Momo.findById(id);

    // If transaction is not found, return a 404 error
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Return the transaction data if found
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

module.exports = { getMomoTransactionByInvoiceId };
