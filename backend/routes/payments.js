const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Create a new payment
router.post('/', authenticateToken, paymentController.createPayment);

// Process a payment
router.post('/:paymentId/process', authenticateToken, paymentController.processPayment);

// Get payment by ID
router.get('/:paymentId', authenticateToken, paymentController.getPaymentById);

// Get user's payments (company or interviewer)
router.get('/', authenticateToken, paymentController.getUserPayments);

module.exports = router; 