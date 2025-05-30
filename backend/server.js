require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect');
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interviews');
const reportRoutes = require('./routes/reports');
const paymentRoutes = require('./routes/payments');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const http = require('http');
const mongoose = require('mongoose');
const webRTCService = require('./services/webRTCService');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"],
  credentials: true
}));

// Initialize WebRTC service
webRTCService.initialize(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Force the port to be 5001
const port = 5001;

const start = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();
    
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      console.log('WebSocket server initialized');
    });

    // Handle graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  try {
    console.log('Received shutdown signal. Closing HTTP server...');
    await server.close();
    console.log('HTTP server closed.');

    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');

    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  gracefulShutdown();
});

start();