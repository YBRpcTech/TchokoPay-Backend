const mongoose = require('mongoose');

// Define the schema for an invoice
const InvoiceSchema = new mongoose.Schema({
  // Name of the person or organization being billed
  payerName: { 
    type: String, 
    required: true 
  },

  // Email address of the payer
  payerEmail: { 
    type: String, 
    required: true 
  },

  // Amount to be paid (in currency units, e.g. dollars)
  amount: { 
    type: Number, 
    required: true 
  },

  // Date the invoice was created (defaults to current date and time)
  date: { 
    type: Date, 
    default: Date.now 
  },

  // Unique invoice identifier (e.g. INV-123456789)
  invoiceNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
});

// Export the model so it can be used in controllers/routes
module.exports = mongoose.model('Invoice', InvoiceSchema);
