import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReceiptIcon from '@mui/icons-material/Receipt';

const PaymentPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interview, setInterview] = useState(null);
  const [report, setReport] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  useEffect(() => {
    const fetchInterviewAndReport = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch interview details
        const interviewResponse = await axios.get(
          `http://localhost:5001/api/interviews/${interviewId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInterview(interviewResponse.data);
        
        // Fetch report if available
        try {
          const reportResponse = await axios.get(
            `http://localhost:5001/api/interviews/${interviewId}/report`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReport(reportResponse.data);
        } catch (reportErr) {
          console.log('Report not yet available');
          // It's fine if there's no report yet
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load interview data. ' + err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    
    fetchInterviewAndReport();
  }, [interviewId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces every 4 digits
      const formattedValue = value
        .replace(/\s/g, '') // Remove existing spaces
        .replace(/(\d{4})/g, '$1 ') // Add space after every 4 digits
        .trim(); // Remove trailing space
      
      setPaymentDetails({
        ...paymentDetails,
        [name]: formattedValue
      });
    } else {
      setPaymentDetails({
        ...paymentDetails,
        [name]: value
      });
    }
  };
  
  const calculatePayment = () => {
    // Base rate depends on interview difficulty and duration
    const baseRate = interview?.jobDetails?.title.toLowerCase().includes('senior') ? 120 : 80;
    const durationHours = interview?.schedule?.duration / 60 || 1;
    return baseRate * durationHours;
  };
  
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    setPaymentError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create payment
      const createPaymentResponse = await axios.post(
        'http://localhost:5001/api/payments',
        {
          interviewId,
          paymentMethod,
          amount: calculatePayment()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const paymentId = createPaymentResponse.data._id;
      
      // Process payment
      const processResponse = await axios.post(
        `http://localhost:5001/api/payments/${paymentId}/process`,
        { cardDetails: paymentDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (processResponse.data.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate(`/interview-report/${interviewId}`);
        }, 3000);
      } else {
        setPaymentError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f9ff'
      }}>
        <CircularProgress size={60} sx={{ color: '#0057b7' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f9ff',
        p: 3
      }}>
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/company-dashboard')}
          sx={{ backgroundColor: '#0057b7' }}
        >
          Return to Dashboard
        </Button>
      </Box>
    );
  }
  
  if (paymentSuccess) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f9ff',
        p: 3
      }}>
        <Paper sx={{ 
          p: 4, 
          maxWidth: 600, 
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
          <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
          <Typography variant="body1" paragraph>
            Thank you for your payment. You can now access the full interview report.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Redirecting you to the report page...
          </Typography>
          <CircularProgress size={24} sx={{ mt: 2, color: '#0057b7' }} />
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      backgroundColor: '#f5f9ff',
      minHeight: '100vh',
      p: { xs: 2, md: 4 }
    }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#0057b7', fontWeight: 'bold' }}>
        Complete Payment
      </Typography>
      
      <Grid container spacing={3}>
        {/* Payment Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: 2
          }}>
            <Typography variant="h5" gutterBottom>
              Payment Details
            </Typography>
            
            {paymentError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {paymentError}
              </Alert>
            )}
            
            <form onSubmit={handleSubmitPayment}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1, color: '#0057b7' }} />
                      Credit/Debit Card
                    </Box>
                  </MenuItem>
                  <MenuItem value="paypal">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentIcon sx={{ mr: 1, color: '#0057b7' }} />
                      PayPal
                    </Box>
                  </MenuItem>
                  <MenuItem value="bank_transfer">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalanceIcon sx={{ mr: 1, color: '#0057b7' }} />
                      Bank Transfer
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              
              {paymentMethod === 'credit_card' && (
                <>
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCardIcon />
                        </InputAdornment>
                      )
                    }}
                    required
                    inputProps={{ maxLength: 19 }}
                  />
                  
                  <TextField
                    label="Cardholder Name"
                    name="cardHolder"
                    value={paymentDetails.cardHolder}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    placeholder="John Doe"
                    required
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Expiry Date"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        placeholder="MM/YY"
                        required
                        inputProps={{ maxLength: 5 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        placeholder="123"
                        required
                        type="password"
                        inputProps={{ maxLength: 3 }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              
              {paymentMethod === 'paypal' && (
                <Box sx={{ 
                  my: 3, 
                  p: 3, 
                  textAlign: 'center',
                  border: '1px dashed #ccc', 
                  borderRadius: 2
                }}>
                  <Typography variant="body1" gutterBottom>
                    You'll be redirected to PayPal to complete your payment after clicking "Pay Now".
                  </Typography>
                </Box>
              )}
              
              {paymentMethod === 'bank_transfer' && (
                <Box sx={{ 
                  my: 3, 
                  p: 3, 
                  border: '1px dashed #ccc', 
                  borderRadius: 2
                }}>
                  <Typography variant="body1" gutterBottom>
                    Please use the following details for bank transfer:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Bank: LiveHire Financial<br />
                    Account Name: LiveHire Inc.<br />
                    Account Number: XXXX-XXXX-XXXX-1234<br />
                    Routing Number: 123456789<br />
                    Reference: INTERVIEW-{interviewId.substring(0, 8)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/company-dashboard')}
                  disabled={processingPayment}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={processingPayment}
                  startIcon={processingPayment ? <CircularProgress size={20} /> : <PaymentIcon />}
                  sx={{ 
                    px: 4,
                    backgroundColor: '#0057b7',
                    '&:hover': { backgroundColor: '#004494' }
                  }}
                >
                  {processingPayment ? 'Processing...' : `Pay $${calculatePayment()}`}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: 2,
            position: 'sticky',
            top: 24
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Interview Details
                </Typography>
                <Typography variant="body1">
                  {interview?.jobDetails?.title || 'Technical Interview'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Candidate: {interview?.candidate?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(interview?.schedule?.date).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Interviewer
                </Typography>
                <Typography variant="body1">
                  {interview?.interviewerName || 'Professional Interviewer'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Service Fee</Typography>
                <Typography variant="body1">${calculatePayment()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax</Typography>
                <Typography variant="body1">$0.00</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${calculatePayment()}</Typography>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Chip 
                  icon={<ReceiptIcon />} 
                  label="Invoice will be emailed"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentPage; 