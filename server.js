const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());


// CORS setup to allow all origins and headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'client-key', 'client-secret']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const paymentRoutes = require('./routes/invoiceRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes'); // ✅ add this line
const momoRoutes = require('./routes/momoRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api/payment', paymentRoutes);
app.use('/api/momo', momoRoutes);
app.use('/api/invoice', transactionRoutes);

app.get("/", (req, res) => {
  res.send("BoltPay API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
