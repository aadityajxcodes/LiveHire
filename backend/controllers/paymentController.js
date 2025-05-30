const Payment = require('../models/Payment');
const Interview = require('../models/Interview');
const User = require('../models/User');

// Create a new payment for an interview
exports.createPayment = async (req, res) => {
  try {
    const { interviewId, paymentMethod, amount } = req.body;
    
    // Find the interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check if user is authorized (must be the company that scheduled the interview)
    if (interview.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Create a new payment
    const payment = new Payment({
      interview: interviewId,
      company: interview.company,
      interviewer: interview.interviewer,
      amount,
      paymentMethod
    });
    
    await payment.save();
    
    // Return the payment details
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Process a payment (simulated)
exports.processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { cardDetails } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if user is authorized (must be the company that made the payment)
    if (payment.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // In a real app, here we would integrate with a payment gateway like Stripe
    // For this demo, we'll simulate a successful payment
    
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate for simulation
    
    if (success) {
      // Update payment status
      payment.status = 'paid';
      payment.transactionId = `txn_${Date.now()}`;
      payment.paidAt = new Date();
      await payment.save();
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        payment
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      
      res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        payment
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('interview', 'candidate.name jobDetails.title schedule.date status')
      .populate('company', 'companyName email')
      .populate('interviewer', 'name email');
      
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if user is authorized
    if (
      payment.company._id.toString() !== req.user._id.toString() &&
      payment.interviewer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payments for a user (company or interviewer)
exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let query = {};
    if (userRole === 'company') {
      query.company = userId;
    } else if (userRole === 'interviewer') {
      query.interviewer = userId;
    }
    
    const payments = await Payment.find(query)
      .populate('interview', 'candidate.name jobDetails.title schedule.date status')
      .sort({ createdAt: -1 });
      
    res.json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 