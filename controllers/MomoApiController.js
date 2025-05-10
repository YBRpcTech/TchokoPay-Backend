const crypto = require('crypto');

const generateInvoiceId = () => {
  const randomPart = crypto.randomBytes(6).toString('hex'); // 12-char random hex
  return `tchokopay-${randomPart}`;
};

const createInvoice = async (transaction) => {
  console.log('📱 [Momo] Creating invoice for transaction:', transaction);

  const invoiceId = generateInvoiceId();

  // Simulate real invoice creation logic or API call here if needed
  console.log('✅ [Momo] Generated invoice ID:', invoiceId);

  return invoiceId;
};

module.exports = {
  createInvoice
};
