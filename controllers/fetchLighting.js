const Bitcoin = require('../models/Bitcoin');  // Import the Bitcoin model

// Controller function to fetch the Bitcoin transaction by invoice ID
const getBitcoinTransactionByInvoiceId = async (req, res) => {
  try {
    const { id } = req.params;  // Retrieve invoice ID from URL params

    // Find the transaction record by invoice ID
    const transaction = await Bitcoin.findById(id);

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

module.exports = { getBitcoinTransactionByInvoiceId };
