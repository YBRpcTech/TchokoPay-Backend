const express = require('express');
const cors = require('cors');
const signupRoutes = require('./routes/signupRoute');
const invoiceRoutes = require('./routes/invoiceRoute'); // Added invoiceRoutes
// const helmet = require('helmet');
// const morgan = require('morgan');
// const userRoutes = require('./routes/user.routes');
// const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(cors());
// app.use(helmet());
// app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', signupRoutes);
app.use('/api/invoices', invoiceRoutes); // Added route for invoices
// app.use('/api/users', userRoutes);

// Error handling middleware (last)
// app.use(errorMiddleware);

module.exports = app;