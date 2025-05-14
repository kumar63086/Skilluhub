const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./src/middlewares/globalErrorHandler');
const connectdb = require('./src/config/dbconnection');
const webhookRoutes = require('./src/Router/webhookRoutes');
dotenv = require('dotenv').config();
const app = express();
connectdb();

const allowedOrigins = ['http://localhost:5173', process.env.CORS_ORIGIN];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Apply raw middleware ONLY to Clerk webhook before anything else
app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }));

// Use Helmet and CORS
app.use(helmet());
app.use(cors(corsOptions));

// Now use general parsers
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Register webhook routes
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Healthy', status: 'OK' });
});
app.get('/ts', (req, res) => {
  res.status(200).json({ message: 'Healthy', status: 'OK' });
});


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
