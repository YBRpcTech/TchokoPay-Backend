const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());

// CORS setup to allow all origins and headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'client-key', 'client-secret']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const momoRoutes = require('./routes/momoRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api/momo', momoRoutes);
app.use('/api/invoice', transactionRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 TchokoPay API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
