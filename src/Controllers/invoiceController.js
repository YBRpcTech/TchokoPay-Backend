const Invoice = require('../models/invoice');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (req, res) => {
  try {
    const { payerName, payerEmail, amount } = req.body;

    // Generate a unique invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Save invoice to the database
    const invoice = new Invoice({ payerName, payerEmail, amount, invoiceNumber });
    await invoice.save();

    // Generate PDF
    const pdfPath = path.join(__dirname, `../invoices/${invoiceNumber}.pdf`);
    const pdfDoc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    pdfDoc.pipe(writeStream);
    pdfDoc.text(`Invoice Number: ${invoiceNumber}`);
    pdfDoc.text(`Payer Name: ${payerName}`);
    pdfDoc.text(`Payer Email: ${payerEmail}`);
    pdfDoc.text(`Amount: $${amount}`);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
    pdfDoc.end();

    writeStream.on('finish', () => {
      return res.status(200).json({ message: 'Invoice generated', invoicePath: pdfPath });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating invoice', error });
  }
};

module.exports = { generateInvoice };